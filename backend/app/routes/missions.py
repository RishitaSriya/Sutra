from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.database import get_db
from app.models.mission import Mission, MissionTask
from app.models.user import User
from app.schemas.schemas import TaskToggleRequest
from app.utils.auth_utils import get_current_user
from app.services.streak_service import log_meaningful_activity

router = APIRouter(prefix="/missions", tags=["Missions"])

from app.services.path_initializer import resolve_path_id, ensure_user_mission

@router.get("/today")
def get_today_missions(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Determine active learning path
    path_id = "path_web_dev"
    if user.learning_profile and user.learning_profile.learning_path_id:
        path_id = user.learning_profile.learning_path_id
    elif user.profile:
        if user.profile.path_type == "exam" and user.profile.target_exam:
            path_id = resolve_path_id(user.profile.target_exam)
        elif user.profile.target_role:
            path_id = resolve_path_id(user.profile.target_role)

    # Ensure user has a mission for their active path
    ensure_user_mission(db, user.id, path_id)

    # Fetch missions belonging to this user for active path levels
    from app.models.learning import Level
    path_levels = db.query(Level).filter(Level.learning_path_id == path_id).all()
    level_ids = [l.id for l in path_levels] if path_levels else []

    missions = db.query(Mission).filter(
        Mission.user_id == user.id,
        Mission.level_id.in_(level_ids)
    ).all()
    
    if not missions:
        # Fallback to any mission belonging to this user
        missions = db.query(Mission).filter(Mission.user_id == user.id).all()
    if not missions:
        missions = db.query(Mission).limit(1).all()

    results = []
    for m in missions:
        tasks_data = [
            {
                "id": t.id,
                "text": t.text,
                "completed": t.completed,
                "xp": t.xp,
                "type": t.type
            }
            for t in m.tasks
        ]
        results.append({
            "id": m.id,
            "title": m.title,
            "subtitle": m.subtitle,
            "time_estimate": f"{m.duration_minutes} MIN",
            "duration_category": m.duration_category,
            "category": m.category,
            "xp_reward": m.xp_reward,
            "completed": m.completed,
            "skills": m.skills or [],
            "tasks": tasks_data
        })
    return results

@router.get("/{mission_id}")
def get_mission(mission_id: str, db: Session = Depends(get_db)):
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    
    tasks_data = [
        {
            "id": t.id,
            "text": t.text,
            "completed": t.completed,
            "xp": t.xp,
            "type": t.type
        }
        for t in mission.tasks
    ]
    return {
        "id": mission.id,
        "title": mission.title,
        "subtitle": mission.subtitle,
        "time_estimate": f"{mission.duration_minutes} MIN",
        "duration_category": mission.duration_category,
        "category": mission.category,
        "xp_reward": mission.xp_reward,
        "completed": mission.completed,
        "skills": mission.skills or [],
        "tasks": tasks_data
    }

@router.post("/{mission_id}/tasks/{task_id}/toggle")
def toggle_task(
    mission_id: str,
    task_id: str,
    req: TaskToggleRequest = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(MissionTask).filter(MissionTask.id == task_id, MissionTask.mission_id == mission_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if req and req.completed is not None:
        task.completed = req.completed
    else:
        task.completed = not task.completed

    xp_gained = 0
    if task.completed:
        xp_gained = task.xp
        log_meaningful_activity(db, user, "mission_task_completed", task_id, xp_gained)

    # Check if all tasks in mission completed
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    all_done = all(t.completed for t in mission.tasks)
    mission.completed = all_done
    if all_done:
        mission.status = "completed"
        mission.completed_at = datetime.now(timezone.utc)
        log_meaningful_activity(db, user, "mission_completed", mission_id, 30)

    db.commit()
    db.refresh(task)

    return {
        "success": True,
        "task_id": task.id,
        "completed": task.completed,
        "xp_earned": xp_gained,
        "mission_completed": mission.completed,
        "total_xp": user.total_xp,
        "streak_days": user.streak_days
    }

@router.post("/{mission_id}/complete")
def complete_mission(mission_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    mission = db.query(Mission).filter(Mission.id == mission_id).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    for t in mission.tasks:
        t.completed = True

    mission.completed = True
    mission.status = "completed"
    mission.completed_at = datetime.now(timezone.utc)
    
    xp_reward = mission.xp_reward
    log_meaningful_activity(db, user, "mission_completed", mission_id, xp_reward)

    db.commit()
    return {
        "success": True,
        "mission_id": mission.id,
        "xp_earned": xp_reward,
        "total_xp": user.total_xp,
        "streak_days": user.streak_days
    }

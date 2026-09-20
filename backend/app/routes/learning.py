from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.learning import LearningPath, Level, Concept, Lesson, LessonStep
from app.models.user import User
from app.models.progress import UserProgress
from app.utils.auth_utils import get_current_user, get_current_user_optional
from app.services.streak_service import log_meaningful_activity

router = APIRouter(tags=["Learning"])

def format_path_with_user_progress(p: LearningPath, user: Optional[User], db: Session):
    user_prog_map = {}
    if user:
        progs = db.query(UserProgress).filter(UserProgress.user_id == user.id).all()
        user_prog_map = {up.level_id: up for up in progs}

    levels_data = []
    current_active_level = 1
    sorted_levels = sorted(p.levels, key=lambda x: x.level_number)

    for idx, l in enumerate(sorted_levels):
        if user and l.id in user_prog_map:
            up = user_prog_map[l.id]
            status = up.status
            is_locked = (up.status == "locked")
            if status == "in_progress":
                current_active_level = l.level_number
        elif user and not user.is_demo:
            # Clean user default without DB entry yet
            status = "in_progress" if idx == 0 else "locked"
            is_locked = (idx != 0)
        else:
            # Fallback to level default
            status = l.status
            is_locked = l.is_locked
            if status == "in_progress":
                current_active_level = l.level_number

        levels_data.append({
            "id": l.id,
            "level_number": l.level_number,
            "title": l.title,
            "subtitle": l.subtitle,
            "estimated_time": f"{l.estimated_minutes} min",
            "status": status,
            "is_locked": is_locked,
            "xp_reward": l.xp_reward,
            "story_snippet": l.story_snippet,
            "tags": l.tags or []
        })

    return {
        "id": p.id,
        "title": p.name,
        "icon": p.icon,
        "role_tag": p.role_tag,
        "description": p.description,
        "current_level": current_active_level,
        "total_levels": p.total_levels,
        "estimated_weeks": p.estimated_weeks,
        "levels": levels_data
    }

@router.get("/learning-paths")
def get_learning_paths(user: Optional[User] = Depends(get_current_user_optional), db: Session = Depends(get_db)):
    paths = db.query(LearningPath).all()
    return [format_path_with_user_progress(p, user, db) for p in paths]

@router.get("/learning-paths/{path_id}")
def get_learning_path(path_id: str, user: Optional[User] = Depends(get_current_user_optional), db: Session = Depends(get_db)):
    path = db.query(LearningPath).filter(LearningPath.id == path_id).first()
    if not path:
        raise HTTPException(status_code=404, detail="Learning path not found")
    return format_path_with_user_progress(path, user, db)

@router.get("/learning-paths/{path_id}/levels")
def get_levels_for_path(path_id: str, user: Optional[User] = Depends(get_current_user_optional), db: Session = Depends(get_db)):
    path = db.query(LearningPath).filter(LearningPath.id == path_id).first()
    if not path:
        raise HTTPException(status_code=404, detail="Learning path not found")
    formatted = format_path_with_user_progress(path, user, db)
    return formatted["levels"]

@router.get("/levels/{level_id}")
def get_level_detail(level_id: str, db: Session = Depends(get_db)):
    level = db.query(Level).filter(Level.id == level_id).first()
    if not level:
        raise HTTPException(status_code=404, detail="Level not found")
    return {
        "id": level.id,
        "level_number": level.level_number,
        "title": level.title,
        "subtitle": level.subtitle,
        "description": level.description,
        "estimated_minutes": level.estimated_minutes,
        "status": level.status,
        "is_locked": level.is_locked,
        "xp_reward": level.xp_reward,
        "story_snippet": level.story_snippet,
        "tags": level.tags or []
    }

@router.get("/lessons/{lesson_id}")
def get_lesson(lesson_id: str, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail=f"Lesson '{lesson_id}' not found")

    from app.routes.users_learning import format_lesson_payload
    return format_lesson_payload(lesson)

@router.post("/lessons/{lesson_id}/complete")
def complete_lesson(lesson_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    xp_earned = 50
    log_meaningful_activity(db, user, "lesson_completed", lesson_id, xp_earned)
    
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    level_id = lesson.level_id if lesson and lesson.level_id else "lvl_01"
    
    # Update progress for Level
    prog = db.query(UserProgress).filter(UserProgress.user_id == user.id, UserProgress.level_id == level_id).first()
    if prog:
        prog.status = "completed"
        prog.progress_percentage = 100
        prog.xp += xp_earned
        
        # Unlock next level in this path
        current_level = db.query(Level).filter(Level.id == level_id).first()
        if current_level:
            next_level = db.query(Level).filter(
                Level.learning_path_id == current_level.learning_path_id,
                Level.level_number == current_level.level_number + 1
            ).first()
            if next_level:
                next_prog = db.query(UserProgress).filter(
                    UserProgress.user_id == user.id,
                    UserProgress.level_id == next_level.id
                ).first()
                if next_prog:
                    if next_prog.status == "locked":
                        next_prog.status = "in_progress"
                else:
                    db.add(UserProgress(
                        user_id=user.id,
                        level_id=next_level.id,
                        status="in_progress",
                        progress_percentage=0,
                        xp=0
                    ))
    
    db.commit()
    return {
        "success": True,
        "message": "Lesson completed successfully!",
        "xp_earned": xp_earned,
        "total_xp": user.total_xp,
        "streak_days": user.streak_days
    }

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.learning import LearningPath, Level, Concept, Lesson, LessonStep
from app.models.user import User
from app.models.progress import UserProgress
from app.models.mission import Mission
from app.utils.auth_utils import get_current_user
from app.services.path_initializer import resolve_path_id, ensure_user_mission

router = APIRouter(prefix="/users/me", tags=["User Learning"])

def format_lesson_payload(lesson: Lesson):
    steps_data = [
        {
            "id": s.id,
            "step_number": s.step_number,
            "type": s.type,
            "content": s.content,
            "interaction_data": s.interaction_data or {}
        }
        for s in sorted(lesson.steps, key=lambda x: x.step_number)
    ]

    level = lesson.concept.level if lesson.concept and lesson.concept.level else None
    level_num = level.level_number if level else (lesson.level_id if isinstance(lesson.level_id, int) else 1)
    level_title = level.title if level else "Core Foundations"

    return {
        "id": lesson.id,
        "path_id": level.learning_path_id if level else None,
        "level_id": lesson.level_id or (level.id if level else None),
        "level_number": level_num,
        "level_title": level_title,
        "title": lesson.title,
        "concept": lesson.concept.title if lesson.concept else "Foundations",
        "role_context": lesson.role_context,
        "narrative": lesson.story_content,
        "interactive_moment": lesson.interactive_moment or {
            "prompt": "Arrange the core conceptual steps in logical order:",
            "correctOrder": [],
            "initialItems": [],
            "hints": [],
            "explanationAfterSuccess": "Great job mastering this step!"
        },
        "concept_breakdown": {
            "title": f"WHAT JUST HAPPENED? — {lesson.title}",
            "summary": lesson.explanation,
            "realWorldAnalogy": lesson.analogy or {
                "title": "Real-World Analogy 💡",
                "story": lesson.explanation or "Understanding the core concept through intuition.",
                "icon": "💡"
            },
            "visualDiagramFlow": lesson.visual_diagram_flow or [],
            "commonMistakes": lesson.common_mistakes or [],
            "goldenRule": lesson.golden_rule or "Master the core intuition before writing syntax."
        },
        "mini_challenge": lesson.mini_challenge or {
            "question": f"What is the key takeaway of {lesson.title}?",
            "context": "Core Engineering Principle",
            "options": [],
            "correctFeedback": "Spot on!",
            "incorrectFeedback": "Review the concept analogy."
        },
        "practice_task": lesson.practice_task or {
            "title": f"Practice Drill: {lesson.title}",
            "description": "Apply what you learned in a practical situation.",
            "problemType": "coding"
        },
        "steps": steps_data
    }

def resolve_user_path_id(user: User, db: Session = None) -> str:
    if user.learning_profile and user.learning_profile.learning_path_id:
        return user.learning_profile.learning_path_id
    if db is not None:
        from app.models.profile import UserLearningProfile
        from app.models.user import UserPreferences
        prof = db.query(UserLearningProfile).filter(UserLearningProfile.user_id == user.id).first()
        if prof and prof.learning_path_id:
            return prof.learning_path_id
        pref = db.query(UserPreferences).filter(UserPreferences.user_id == user.id).first()
        if pref and pref.learning_path_id:
            return pref.learning_path_id
    if user.preferences and user.preferences.learning_path_id:
        return user.preferences.learning_path_id
    return "path_web_dev"

@router.get("/learning-path")
def get_user_learning_path(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    path_id = resolve_user_path_id(user, db)
    path = db.query(LearningPath).filter(LearningPath.id == path_id).first()
    if not path:
        path = db.query(LearningPath).first()
    if not path:
        raise HTTPException(status_code=404, detail="Learning path not found")

    from app.routes.learning import format_path_with_user_progress
    return format_path_with_user_progress(path, user, db)

@router.get("/learning-journey")
def get_user_learning_journey(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    path_id = resolve_user_path_id(user, db)
    path = db.query(LearningPath).filter(LearningPath.id == path_id).first()
    if not path:
        raise HTTPException(status_code=404, detail="Learning path not found")

    from app.routes.learning import format_path_with_user_progress
    formatted = format_path_with_user_progress(path, user, db)
    return {
        "path_id": path.id,
        "path_name": path.name,
        "role_tag": path.role_tag,
        "current_level": formatted["current_level"],
        "total_levels": formatted["total_levels"],
        "levels": formatted["levels"]
    }

@router.get("/current-lesson")
def get_user_current_lesson(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    path_id = resolve_user_path_id(user, db)
    
    # Get all levels for this path
    levels = db.query(Level).filter(Level.learning_path_id == path_id).order_by(Level.level_number).all()
    if not levels:
        raise HTTPException(status_code=404, detail=f"No curriculum found for learning path {path_id}")

    level_ids = [l.id for l in levels]

    # Find user active level from UserProgress
    active_level = None
    user_progs = db.query(UserProgress).filter(
        UserProgress.user_id == user.id,
        UserProgress.level_id.in_(level_ids)
    ).all()
    
    prog_map = {up.level_id: up for up in user_progs}
    for l in levels:
        up = prog_map.get(l.id)
        if up and up.status == "in_progress":
            active_level = l
            break

    if not active_level:
        # Check first level without completed status, or default to level 1
        for l in levels:
            up = prog_map.get(l.id)
            if not up or up.status != "completed":
                active_level = l
                break
    if not active_level:
        active_level = levels[0]

    # Find Lesson for this active level
    lesson = db.query(Lesson).join(Concept).filter(Concept.level_id == active_level.id).first()
    if not lesson:
        # Fallback to any lesson in this learning path
        lesson = db.query(Lesson).join(Concept).filter(Concept.level_id.in_(level_ids)).first()

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail=f"No lesson available yet for {path_id}. Your curriculum is being prepared."
        )

    return format_lesson_payload(lesson)

@router.get("/today-mission")
def get_user_today_mission(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    path_id = resolve_user_path_id(user)
    ensure_user_mission(db, user.id, path_id)

    path_levels = db.query(Level).filter(Level.learning_path_id == path_id).all()
    level_ids = [l.id for l in path_levels] if path_levels else []

    missions = db.query(Mission).filter(
        Mission.user_id == user.id,
        Mission.level_id.in_(level_ids)
    ).all()

    if not missions:
        missions = db.query(Mission).filter(Mission.user_id == user.id).all()

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

@router.get("/flashcards")
def get_user_flashcards(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from app.routes.flashcards import get_flashcards
    return get_flashcards(user=user, db=db)

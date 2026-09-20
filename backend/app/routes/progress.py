from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.progress import UserProgress, ConceptMastery, LearningActivity
from app.models.mission import Mission
from app.models.challenge import ChallengeSubmission
from app.utils.auth_utils import get_current_user

router = APIRouter(prefix="/progress", tags=["Progress"])

@router.get("")
def get_progress_overview(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    completed_missions = db.query(Mission).filter(Mission.completed == True).count()
    completed_challenges = db.query(ChallengeSubmission).filter(ChallengeSubmission.user_id == user.id, ChallengeSubmission.completed == True).count()
    mastered_concepts = db.query(ConceptMastery).filter(ConceptMastery.user_id == user.id, ConceptMastery.mastery_score >= 80).count()

    levels_prog = db.query(UserProgress).filter(UserProgress.user_id == user.id).all()
    
    return {
        "total_xp": user.total_xp,
        "streak_days": user.streak_days,
        "current_level": 3,
        "current_level_mastery": 68,
        "mastered_concepts_count": max(mastered_concepts, 24),
        "completed_missions_count": max(completed_missions, 12),
        "completed_challenges_count": max(completed_challenges, 3),
        "levels_progress": [
            {
                "level_id": lp.level_id,
                "status": lp.status,
                "progress_percentage": lp.progress_percentage,
                "xp": lp.xp
            }
            for lp in levels_prog
        ]
    }

@router.get("/levels")
def get_levels_progress(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    levels_prog = db.query(UserProgress).filter(UserProgress.user_id == user.id).all()
    return [
        {
            "level_id": lp.level_id,
            "status": lp.status,
            "progress_percentage": lp.progress_percentage,
            "xp": lp.xp
        }
        for lp in levels_prog
    ]

@router.get("/concepts")
def get_concepts_mastery(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    mastery = db.query(ConceptMastery).filter(ConceptMastery.user_id == user.id).all()
    return [
        {
            "concept_id": cm.concept_id,
            "mastery_score": cm.mastery_score,
            "attempts": cm.attempts,
            "last_reviewed_at": cm.last_reviewed_at
        }
        for cm in mastery
    ]

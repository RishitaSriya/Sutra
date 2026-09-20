from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from app.database import get_db
from app.models.flashcard import Flashcard
from app.models.user import User
from app.schemas.schemas import FlashcardReviewRequest
from app.utils.auth_utils import get_current_user
from app.services.streak_service import log_meaningful_activity

from app.models.learning import Level, Concept
from app.routes.users_learning import resolve_user_path_id

router = APIRouter(prefix="/flashcards", tags=["Flashcards"])

@router.get("")
def get_flashcards(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    path_id = resolve_user_path_id(user, db)
    
    # 1. Get levels for user's active learning path
    levels = db.query(Level).filter(Level.learning_path_id == path_id).all()
    if not levels:
        return []
    
    level_ids = [l.id for l in levels]
    
    # 2. Get concepts for these levels
    concepts = db.query(Concept).filter(Concept.level_id.in_(level_ids)).all()
    if not concepts:
        return []
        
    concept_ids = [c.id for c in concepts]
    
    # 3. Get flashcards strictly belonging to these concepts
    cards = db.query(Flashcard).filter(Flashcard.concept_id.in_(concept_ids)).all()
    
    return [
        {
            "id": c.id,
            "concept_id": c.concept_id,
            "topic": c.topic,
            "category": c.category,
            "question": c.front,
            "answer": c.back,
            "code_snippet": c.code_snippet,
            "difficulty": c.difficulty,
            "confidence": c.confidence,
            "mastery_score": c.mastery_score,
            "times_reviewed": c.times_reviewed
        }
        for c in cards
    ]

@router.post("/{flashcard_id}/review")
def review_flashcard(
    flashcard_id: str,
    req: FlashcardReviewRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    card = db.query(Flashcard).filter(Flashcard.id == flashcard_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    now = datetime.now(timezone.utc)
    card.times_reviewed += 1
    card.last_reviewed_at = now

    xp_awarded = 0
    if req.remembered:
        card.mastery_score = min(100, card.mastery_score + 10)
        card.confidence = min(100, card.confidence + 15)
        card.next_review_at = now + timedelta(days=3)
        xp_awarded = 10
        log_meaningful_activity(db, user, "flashcard_session", flashcard_id, xp_awarded)
    else:
        card.mastery_score = max(20, card.mastery_score - 15)
        card.confidence = max(10, card.confidence - 20)
        card.next_review_at = now + timedelta(days=1)

    db.commit()
    db.refresh(card)

    return {
        "success": True,
        "flashcard_id": card.id,
        "mastery_score": card.mastery_score,
        "times_reviewed": card.times_reviewed,
        "xp_awarded": xp_awarded,
        "total_xp": user.total_xp
    }

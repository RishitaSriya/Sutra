from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.progress import Question, ConceptMastery
from app.models.user import User
from app.schemas.schemas import AnswerRequest
from app.utils.auth_utils import get_current_user
from app.services.streak_service import log_meaningful_activity

router = APIRouter(prefix="/questions", tags=["Questions"])

@router.get("/{concept_id}")
def get_questions_for_concept(concept_id: str, db: Session = Depends(get_db)):
    questions = db.query(Question).filter(Question.concept_id == concept_id).all()
    if not questions:
        questions = db.query(Question).all()
    
    return [
        {
            "id": q.id,
            "concept_id": q.concept_id,
            "question": q.question,
            "context": q.context,
            "options": q.options,
            "explanation": q.explanation,
            "difficulty": q.difficulty
        }
        for q in questions
    ]

@router.post("/{question_id}/answer")
def answer_question(
    question_id: str,
    req: AnswerRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        # Check if question_id is a concept or lesson ID
        question = db.query(Question).filter(Question.concept_id == question_id).first()
    
    if not question:
        # Default quiz mock evaluation for demo questions (e.g. story mini-challenge)
        is_correct = (req.option_id in ["opt_2", "b", "opt_b", "correct"])
        feedback = "Correct! The browser makes an asynchronous GET request to the merchant server." if is_correct else "Not quite. Remember that the client browser initiates an HTTP GET request to fetch remote data."
        xp_earned = 30 if is_correct else 5
        log_meaningful_activity(db, user, "quiz_completed", question_id, xp_earned)
        db.commit()
        return {
            "is_correct": is_correct,
            "feedback": feedback,
            "explanation": "HTTP GET requests are used to retrieve resource representations from an origin server.",
            "xp_earned": xp_earned,
            "mastery_score": 85 if is_correct else 45,
            "total_xp": user.total_xp
        }

    is_correct = (req.option_id == question.correct_option_id)
    
    # Check options for specific feedback
    feedback = "Incorrect. Review the concept steps."
    if question.options:
        for opt in question.options:
            if opt.get("id") == req.option_id:
                feedback = opt.get("feedback", feedback)

    xp_earned = 20 if is_correct else 5
    if is_correct:
        log_meaningful_activity(db, user, "quiz_completed", question_id, xp_earned)

    # Update concept mastery
    mastery = db.query(ConceptMastery).filter(
        ConceptMastery.user_id == user.id,
        ConceptMastery.concept_id == question.concept_id
    ).first()
    if not mastery:
        mastery = ConceptMastery(
            user_id=user.id,
            concept_id=question.concept_id,
            mastery_score=85 if is_correct else 40,
            attempts=1
        )
        db.add(mastery)
    else:
        mastery.attempts += 1
        if is_correct:
            mastery.mastery_score = min(100, mastery.mastery_score + 15)
        else:
            mastery.mastery_score = max(20, mastery.mastery_score - 10)

    db.commit()

    return {
        "is_correct": is_correct,
        "feedback": feedback,
        "explanation": question.explanation,
        "xp_earned": xp_earned,
        "mastery_score": mastery.mastery_score,
        "total_xp": user.total_xp
    }

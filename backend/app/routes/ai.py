from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.auth_utils import get_current_user
from app.models.user import User
from app.services.gemini_service import gemini_service
from app.schemas.schemas import (
    AiChatRequest,
    AiChatResponse,
    AiExplainRequest,
    AiExplainResponse,
    AiFlashcardGenRequest,
    AiStatusResponse,
    FlashcardResponse,
    InterviewStartRequest,
    InterviewStartResponse,
    InterviewRespondRequest,
    InterviewRespondResponse
)
from typing import List, Dict, Any

router = APIRouter(prefix="/api/ai", tags=["AI Mentor (Gemini)"])

@router.get("/status", response_model=AiStatusResponse)
def get_ai_status():
    return gemini_service.get_status()

@router.post("/chat", response_model=AiChatResponse)
def chat_with_mentor(
    req: AiChatRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_role = "Web Developer"
    track_type = getattr(user, "track_type", "career") or "career"
    if user.learning_profile:
        user_role = user.learning_profile.career_path or (
            "GATE CSE Journey" if user.learning_profile.track_type == "exam" else "Web Developer"
        )
        track_type = user.learning_profile.track_type

    res = gemini_service.chat_with_mentor(
        user_name=user.name,
        user_role=user_role,
        track_type=track_type,
        message=req.message,
        lesson_context=req.lesson_context or "",
        code_snippet=req.code_snippet
    )
    return res

@router.post("/explain", response_model=AiExplainResponse)
def explain_concept_or_code(
    req: AiExplainRequest,
    user: User = Depends(get_current_user)
):
    user_role = "Web Developer"
    if user.learning_profile:
        user_role = user.learning_profile.career_path or (
            "GATE CSE Journey" if user.learning_profile.track_type == "exam" else "Web Developer"
        )

    res = gemini_service.explain_code_or_concept(
        user_role=user_role,
        query=req.query,
        language=req.language or "javascript"
    )
    return res

@router.post("/generate-cards", response_model=List[Dict[str, Any]])
def generate_flashcards_ai(
    req: AiFlashcardGenRequest,
    user: User = Depends(get_current_user)
):
    user_role = "Web Developer"
    if user.learning_profile:
        user_role = user.learning_profile.career_path or (
            "GATE CSE Journey" if user.learning_profile.track_type == "exam" else "Web Developer"
        )

    cards = gemini_service.generate_flashcards(
        topic=req.topic,
        user_role=user_role,
        count=req.count or 3
    )
    return cards

@router.post("/interview/start", response_model=InterviewStartResponse)
def start_mock_interview(
    req: InterviewStartRequest,
    user: User = Depends(get_current_user)
):
    user_role = req.role or "Web Developer"
    if user.learning_profile and not req.role:
        user_role = user.learning_profile.career_path or "Web Developer"
    track_type = getattr(user, "track_type", "career") or "career"

    res = gemini_service.start_mock_interview(
        user_name=user.name,
        user_role=user_role,
        company=req.company or "Razorpay",
        track_type=track_type
    )
    return res

@router.post("/interview/respond", response_model=InterviewRespondResponse)
def respond_mock_interview(
    req: InterviewRespondRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    res = gemini_service.evaluate_interview_answer(
        user_role=req.role,
        company=req.company,
        question=req.question,
        answer=req.answer,
        round_number=req.round_number
    )

    xp_awarded = res.get("xp_awarded", 0)
    if xp_awarded > 0:
        user.total_xp = (user.total_xp or 0) + xp_awarded
        db.commit()
        db.refresh(user)

    res["total_xp"] = user.total_xp
    return res

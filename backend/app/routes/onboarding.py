from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.database import get_db
from app.models.user import User, Company, UserCompany, UserPreferences
from app.models.profile import UserLearningProfile
from app.models.mission import Mission, MissionTask
from app.schemas.schemas import (
    CareerOnboardingRequest,
    ExamOnboardingRequest,
    UserLearningProfileResponse,
    UserPreferencesUpdate
)
from app.utils.auth_utils import get_current_user
from app.services.path_initializer import resolve_path_id, initialize_user_path_progress, ensure_user_mission

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])

@router.post("/career")
def onboard_career(
    req: CareerOnboardingRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserLearningProfile).filter(UserLearningProfile.user_id == user.id).first()
    if not profile:
        profile = UserLearningProfile(user_id=user.id)
        db.add(profile)

    path_id = resolve_path_id(req.learning_path_id or req.career_path)
    profile.track_type = "career"
    profile.career_path = req.career_path
    profile.learning_path_id = path_id
    profile.target_companies = req.target_companies or []
    profile.daily_minutes = req.daily_minutes or 30
    profile.learning_preferences = req.learning_preferences or ["Stories", "Hands-on"]
    profile.onboarding_completed = True
    profile.exam_type = None
    profile.target_year = None
    profile.goals = []
    profile.subjects = []

    user.onboarding_completed = True

    # Sync UserCompany for career
    db.query(UserCompany).filter(UserCompany.user_id == user.id).delete()
    for comp_name in (req.target_companies or []):
        comp = db.query(Company).filter(Company.name == comp_name).first()
        if comp:
            db.add(UserCompany(user_id=user.id, company_id=comp.id))

    # Sync UserPreferences
    prefs = db.query(UserPreferences).filter(UserPreferences.user_id == user.id).first()
    if not prefs:
        prefs = UserPreferences(user_id=user.id)
        db.add(prefs)
    prefs.current_role = req.career_path
    prefs.learning_path_id = path_id
    prefs.daily_minutes = req.daily_minutes or 30
    prefs.learning_preferences = req.learning_preferences or ["Stories", "Hands-on"]

    db.commit()
    db.refresh(user)
    db.refresh(profile)

    # Initialize path progress and path-specific mission for this user
    initialize_user_path_progress(db, user.id, path_id)
    ensure_user_mission(db, user.id, path_id)

    return {
        "success": True,
        "message": f"Career track for {req.career_path} configured successfully",
        "track_type": "career",
        "onboarding_completed": True,
        "learning_profile": {
            "track_type": profile.track_type,
            "career_path": profile.career_path,
            "learning_path_id": profile.learning_path_id,
            "target_companies": profile.target_companies or [],
            "daily_minutes": profile.daily_minutes,
            "learning_preferences": profile.learning_preferences or [],
            "onboarding_completed": profile.onboarding_completed
        },
        "user": {
            "id": user.id,
            "name": user.name,
            "current_role": req.career_path,
            "dream_companies": req.target_companies or [],
            "daily_minutes": req.daily_minutes or 30
        }
    }

@router.post("/exam")
def onboard_exam(
    req: ExamOnboardingRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserLearningProfile).filter(UserLearningProfile.user_id == user.id).first()
    if not profile:
        profile = UserLearningProfile(user_id=user.id)
        db.add(profile)

    path_id = "path_gate_cse" if "CSE" in (req.exam_type or "") else "path_gate_cse"
    profile.track_type = "exam"
    profile.exam_type = req.exam_type or "GATE_CSE"
    profile.learning_path_id = path_id
    profile.target_year = req.target_year or "2028"
    profile.goals = req.goals or ["IIT / IISc", "M.Tech"]
    profile.preparation_level = req.preparation_level or "Just Starting"
    profile.daily_minutes = req.daily_minutes or 120
    profile.subjects = req.subjects or []
    profile.learning_preferences = req.learning_preferences or ["Stories", "Hands-on"]
    profile.target_companies = []  # Strictly NO companies for exam track
    profile.career_path = None
    profile.onboarding_completed = True

    user.onboarding_completed = True

    # Remove any company links for exam user
    db.query(UserCompany).filter(UserCompany.user_id == user.id).delete()

    # Sync UserPreferences
    prefs = db.query(UserPreferences).filter(UserPreferences.user_id == user.id).first()
    if not prefs:
        prefs = UserPreferences(user_id=user.id)
        db.add(prefs)
    prefs.current_role = f"{req.exam_type} Aspirant"
    prefs.learning_path_id = path_id
    prefs.daily_minutes = req.daily_minutes or 120
    prefs.learning_preferences = req.learning_preferences or ["Stories", "Hands-on"]

    db.commit()
    db.refresh(user)
    db.refresh(profile)

    # Initialize path progress and path-specific mission for this user
    initialize_user_path_progress(db, user.id, path_id)
    ensure_user_mission(db, user.id, path_id)

    return {
        "success": True,
        "message": f"Exam preparation profile for {req.exam_type} ({req.target_year}) configured successfully",
        "track_type": "exam",
        "onboarding_completed": True,
        "learning_profile": {
            "track_type": profile.track_type,
            "exam_type": profile.exam_type,
            "target_year": profile.target_year,
            "goals": profile.goals or [],
            "preparation_level": profile.preparation_level,
            "daily_minutes": profile.daily_minutes,
            "subjects": profile.subjects or [],
            "target_companies": [],
            "learning_preferences": profile.learning_preferences or [],
            "onboarding_completed": profile.onboarding_completed
        },
        "user": {
            "id": user.id,
            "name": user.name,
            "exam_type": req.exam_type,
            "target_year": req.target_year,
            "goals": req.goals,
            "preparation_level": req.preparation_level,
            "daily_minutes": req.daily_minutes,
            "subjects": req.subjects
        }
    }

# Learning Profile endpoints under /users/me/learning-profile
profile_router = APIRouter(prefix="/users/me", tags=["Learning Profile"])

@profile_router.get("/learning-profile", response_model=UserLearningProfileResponse)
def get_learning_profile(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserLearningProfile).filter(UserLearningProfile.user_id == user.id).first()
    if not profile:
        profile = UserLearningProfile(
            user_id=user.id,
            track_type="career",
            career_path="Web Developer",
            learning_path_id="path_web_dev",
            target_companies=[],
            daily_minutes=30,
            onboarding_completed=user.onboarding_completed
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return profile

@profile_router.put("/learning-profile", response_model=UserLearningProfileResponse)
def update_learning_profile(
    req: UserPreferencesUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserLearningProfile).filter(UserLearningProfile.user_id == user.id).first()
    if not profile:
        profile = UserLearningProfile(user_id=user.id)
        db.add(profile)

    if req.track_type is not None:
        profile.track_type = req.track_type
    if req.career_path is not None:
        profile.career_path = req.career_path
        profile.learning_path_id = resolve_path_id(req.learning_path_id or req.career_path)
    if req.learning_path_id is not None:
        profile.learning_path_id = resolve_path_id(req.learning_path_id)
    if req.target_companies is not None and profile.track_type == "career":
        profile.target_companies = req.target_companies
    if req.exam_type is not None:
        profile.exam_type = req.exam_type
        profile.learning_path_id = "path_gate_cse"
    if req.target_year is not None:
        profile.target_year = req.target_year
    if req.goals is not None:
        profile.goals = req.goals
    if req.preparation_level is not None:
        profile.preparation_level = req.preparation_level
    if req.subjects is not None:
        profile.subjects = req.subjects
    if req.daily_minutes is not None:
        profile.daily_minutes = req.daily_minutes
    if req.learning_preferences is not None:
        profile.learning_preferences = req.learning_preferences
    if req.learning_dna is not None:
        profile.learning_dna = req.learning_dna

    db.commit()
    db.refresh(profile)

    # Initialize new path levels and mission if needed
    if profile.learning_path_id:
        initialize_user_path_progress(db, user.id, profile.learning_path_id)
        ensure_user_mission(db, user.id, profile.learning_path_id)

    return profile


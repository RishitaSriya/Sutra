from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserPreferences, Company, UserCompany
from app.models.profile import UserLearningProfile
from app.schemas.schemas import AuthRegister, AuthLogin, TokenResponse, DemoLoginRequest
from app.utils.auth_utils import verify_password, get_password_hash, create_access_token, get_current_user
from app.services.streak_service import get_streak_history

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=TokenResponse)
def register(req: AuthRegister, db: Session = Depends(get_db)):
    if not req.name or not req.name.strip():
        raise HTTPException(status_code=400, detail="Name is required")
    if not req.password or len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")
    if req.confirm_password is not None and req.password != req.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing = db.query(User).filter(User.email.ilike(req.email.strip())).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered")

    user = User(
        name=req.name.strip(),
        email=req.email.strip().lower(),
        password_hash=get_password_hash(req.password),
        college=req.college or "Engineering College",
        year=req.year or "1st Year",
        tier=req.tier or "Tier-2 College",
        avatar_url=f"https://api.dicebear.com/7.x/bottts/svg?seed={req.name.strip()}",
        total_xp=0,
        streak_days=0,
        onboarding_completed=False,
        is_demo=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id, "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "avatar_url": user.avatar_url,
            "total_xp": user.total_xp,
            "streak_days": user.streak_days,
            "onboarding_completed": False,
            "is_demo": False,
            "track_type": "career"
        }
    }

@router.post("/login", response_model=TokenResponse)
def login(req: AuthLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email.ilike(req.email.strip())).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Check track type from profile
    profile = db.query(UserLearningProfile).filter(UserLearningProfile.user_id == user.id).first()
    track_type = profile.track_type if profile else "career"
    onboarding_done = bool(user.onboarding_completed or (profile and profile.onboarding_completed))

    token = create_access_token({"sub": user.id, "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "avatar_url": user.avatar_url,
            "total_xp": user.total_xp,
            "streak_days": user.streak_days,
            "onboarding_completed": onboarding_done,
            "is_demo": getattr(user, "is_demo", False),
            "track_type": track_type
        }
    }

@router.post("/demo", response_model=TokenResponse)
@router.post("/demo/{demo_user}", response_model=TokenResponse)
def login_demo(demo_user: Optional[str] = None, req: Optional[DemoLoginRequest] = None, db: Session = Depends(get_db)):
    demo_key = demo_user or (req.demo_user if req else "aarav") or "aarav"
    key_lower = demo_key.lower()
    
    if "ananya" in key_lower:
        user = db.query(User).filter(User.email.ilike("ananya@sutra.demo")).first()
    elif "meera" in key_lower:
        user = db.query(User).filter(User.email.ilike("meera@sutra.demo")).first()
    elif "kabir" in key_lower:
        user = db.query(User).filter(User.email.ilike("kabir@sutra.demo")).first()
    else:
        user = db.query(User).filter(User.email.ilike("aarav@sutra.demo")).first()
    
    if not user:
        user = db.query(User).filter(User.is_demo == True).first() or db.query(User).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Demo account not found in database")

    profile = db.query(UserLearningProfile).filter(UserLearningProfile.user_id == user.id).first()
    track_type = profile.track_type if profile else "career"
    onboarding_done = bool(user.onboarding_completed or (profile and profile.onboarding_completed))

    token = create_access_token({"sub": user.id, "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "avatar_url": user.avatar_url,
            "total_xp": user.total_xp,
            "streak_days": user.streak_days,
            "onboarding_completed": onboarding_done,
            "is_demo": True,
            "track_type": track_type
        }
    }

@router.post("/logout")
def logout():
    return {"success": True, "message": "Logged out successfully"}

@router.get("/me")
def get_me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(UserLearningProfile).filter(UserLearningProfile.user_id == user.id).first()
    prefs = db.query(UserPreferences).filter(UserPreferences.user_id == user.id).first()
    
    track_type = profile.track_type if profile else "career"
    onboarding_done = bool(user.onboarding_completed or (profile and profile.onboarding_completed))
    
    current_role = "Web Developer"
    learning_path_id = "path_web_dev"
    dream_companies = []
    learning_styles = ["Stories", "Hands-on"]
    daily_time_minutes = 30
    learning_dna = {"handsOn": 40, "stories": 30, "challenges": 20, "visualExploration": 10}
    exam_details = None

    if profile:
        daily_time_minutes = profile.daily_minutes
        learning_styles = profile.learning_preferences or ["Stories", "Hands-on"]
        learning_dna = profile.learning_dna or learning_dna
        learning_path_id = profile.learning_path_id or ("path_gate_cse" if profile.track_type == "exam" else "path_web_dev")
        
        if profile.track_type == "career":
            current_role = profile.career_path or "Web Developer"
            dream_companies = profile.target_companies or []
        elif profile.track_type in ("exam", "higher_studies"):
            current_role = profile.exam_type or "GATE CSE"
            dream_companies = []  # Strictly NO companies for exam track
            exam_details = {
                "exam_type": profile.exam_type or "GATE_CSE",
                "target_year": profile.target_year or "2028",
                "goals": profile.goals or [],
                "preparation_level": profile.preparation_level or "Just Starting",
                "subjects": profile.subjects or []
            }
    elif prefs:
        current_role = prefs.current_role or "Web Developer"
        learning_path_id = prefs.learning_path_id or "path_web_dev"
        user_comps = db.query(UserCompany).filter(UserCompany.user_id == user.id).all()
        dream_companies = [uc.company.name for uc in user_comps if uc.company] if user_comps else []
        learning_styles = prefs.learning_preferences or ["Stories", "Hands-on"]
        daily_time_minutes = prefs.daily_minutes
        learning_dna = prefs.learning_dna or learning_dna
    
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "avatar_url": user.avatar_url,
        "college": user.college,
        "tier": user.tier,
        "year": user.year,
        "total_xp": user.total_xp,
        "streak_days": user.streak_days,
        "onboarding_completed": onboarding_done,
        "is_demo": getattr(user, "is_demo", False),
        "track_type": track_type,
        "current_role": current_role,
        "learning_path_id": learning_path_id,
        "dream_companies": dream_companies,
        "learning_styles": learning_styles,
        "daily_time_minutes": daily_time_minutes,
        "learning_dna": learning_dna,
        "exam_details": exam_details,
        "streak_history": get_streak_history(db, user)
    }


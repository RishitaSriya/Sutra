from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserPreferences, Company, UserCompany
from app.schemas.schemas import UserResponse, UserUpdate, UserPreferencesUpdate
from app.utils.auth_utils import get_current_user
from app.services.streak_service import get_streak_history

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me")
def get_user_me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    prefs = db.query(UserPreferences).filter(UserPreferences.user_id == user.id).first()
    user_comps = db.query(UserCompany).filter(UserCompany.user_id == user.id).all()
    company_names = [uc.company.name for uc in user_comps if uc.company] if user_comps else ["Google", "Microsoft", "Amazon"]
    
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
        "current_role": prefs.current_role if prefs else "Web Developer",
        "dream_companies": company_names,
        "learning_styles": prefs.learning_preferences if prefs else ["Stories", "Hands-on"],
        "daily_time_minutes": prefs.daily_minutes if prefs else 30,
        "learning_dna": prefs.learning_dna if prefs and prefs.learning_dna else {"handsOn": 45, "stories": 30, "challenges": 25, "visualExploration": 20},
        "streak_history": get_streak_history(db, user)
    }

@router.put("/me")
def update_user_me(req: UserUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if req.name is not None:
        user.name = req.name
    if req.avatar_url is not None:
        user.avatar_url = req.avatar_url
    if req.college is not None:
        user.college = req.college
    if req.year is not None:
        user.year = req.year

    prefs = db.query(UserPreferences).filter(UserPreferences.user_id == user.id).first()
    if not prefs:
        prefs = UserPreferences(user_id=user.id)
        db.add(prefs)

    if req.current_role is not None:
        prefs.current_role = req.current_role
    if req.learning_styles is not None:
        prefs.learning_preferences = req.learning_styles
    if req.daily_time_minutes is not None:
        prefs.daily_minutes = req.daily_time_minutes
    if req.learning_dna is not None:
        prefs.learning_dna = req.learning_dna

    if req.dream_companies is not None:
        # Clear existing companies and re-attach
        db.query(UserCompany).filter(UserCompany.user_id == user.id).delete()
        for comp_name in req.dream_companies:
            comp = db.query(Company).filter(Company.name == comp_name).first()
            if comp:
                db.add(UserCompany(user_id=user.id, company_id=comp.id))

    db.commit()
    db.refresh(user)
    return get_user_me(user, db)

@router.get("/me/preferences")
def get_preferences(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    prefs = db.query(UserPreferences).filter(UserPreferences.user_id == user.id).first()
    if not prefs:
        prefs = UserPreferences(user_id=user.id)
        db.add(prefs)
        db.commit()
        db.refresh(prefs)
    return prefs

@router.put("/me/preferences")
def update_preferences(req: UserPreferencesUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    prefs = db.query(UserPreferences).filter(UserPreferences.user_id == user.id).first()
    if not prefs:
        prefs = UserPreferences(user_id=user.id)
        db.add(prefs)

    if req.learning_path_id is not None:
        prefs.learning_path_id = req.learning_path_id
    if req.current_role is not None:
        prefs.current_role = req.current_role
    if req.daily_minutes is not None:
        prefs.daily_minutes = req.daily_minutes
    if req.learning_preferences is not None:
        prefs.learning_preferences = req.learning_preferences
    if req.learning_dna is not None:
        prefs.learning_dna = req.learning_dna

    if req.companies is not None:
        db.query(UserCompany).filter(UserCompany.user_id == user.id).delete()
        for comp_name in req.companies:
            comp = db.query(Company).filter(Company.name == comp_name).first()
            if comp:
                db.add(UserCompany(user_id=user.id, company_id=comp.id))

    db.commit()
    db.refresh(prefs)
    return prefs

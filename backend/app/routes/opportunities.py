from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.opportunity import Opportunity, UserOpportunity
from app.models.user import User
from app.utils.auth_utils import get_current_user
from app.services.streak_service import log_meaningful_activity

router = APIRouter(prefix="/opportunities", tags=["Opportunities"])

@router.get("")
def get_opportunities(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    opps = db.query(Opportunity).all()
    results = []
    for o in opps:
        saved = False
        applied = False
        if user:
            uo = db.query(UserOpportunity).filter(
                UserOpportunity.opportunity_id == o.id,
                UserOpportunity.user_id == user.id
            ).first()
            if uo:
                saved = uo.saved
                applied = uo.applied

        results.append({
            "id": o.id,
            "title": o.title,
            "company": o.company,
            "logo": o.logo,
            "location": o.location,
            "work_type": o.work_type,
            "type": o.type,
            "stipend_or_prize": o.stipend_or_prize,
            "deadline": o.deadline,
            "days_left": o.days_left,
            "skill_tags": o.skill_tags or [],
            "match_score": o.match_score,
            "description": o.description,
            "eligibility": o.eligibility,
            "url": o.url,
            "saved": saved,
            "applied": applied
        })
    return results

@router.get("/{opportunity_id}")
def get_opportunity(opportunity_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    o = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not o:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    saved = False
    applied = False
    if user:
        uo = db.query(UserOpportunity).filter(
            UserOpportunity.opportunity_id == o.id,
            UserOpportunity.user_id == user.id
        ).first()
        if uo:
            saved = uo.saved
            applied = uo.applied

    return {
        "id": o.id,
        "title": o.title,
        "company": o.company,
        "logo": o.logo,
        "location": o.location,
        "work_type": o.work_type,
        "type": o.type,
        "stipend_or_prize": o.stipend_or_prize,
        "deadline": o.deadline,
        "days_left": o.days_left,
        "skill_tags": o.skill_tags or [],
        "match_score": o.match_score,
        "description": o.description,
        "eligibility": o.eligibility,
        "url": o.url,
        "saved": saved,
        "applied": applied
    }

@router.post("/{opportunity_id}/save")
def toggle_save_opportunity(opportunity_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    o = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not o:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    uo = db.query(UserOpportunity).filter(
        UserOpportunity.opportunity_id == opportunity_id,
        UserOpportunity.user_id == user.id
    ).first()
    if not uo:
        uo = UserOpportunity(user_id=user.id, opportunity_id=opportunity_id, saved=True, applied=False)
        db.add(uo)
    else:
        uo.saved = not uo.saved

    db.commit()
    return {"success": True, "opportunity_id": o.id, "saved": uo.saved}

@router.post("/{opportunity_id}/apply")
def apply_opportunity(opportunity_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    o = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not o:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    uo = db.query(UserOpportunity).filter(
        UserOpportunity.opportunity_id == opportunity_id,
        UserOpportunity.user_id == user.id
    ).first()
    if not uo:
        uo = UserOpportunity(user_id=user.id, opportunity_id=opportunity_id, saved=True, applied=True)
        db.add(uo)
    else:
        uo.applied = True

    xp_awarded = 50
    log_meaningful_activity(db, user, "opportunity_applied", opportunity_id, xp_awarded)

    db.commit()
    return {"success": True, "opportunity_id": o.id, "applied": True, "xp_awarded": xp_awarded, "total_xp": user.total_xp}

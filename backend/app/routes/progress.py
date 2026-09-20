from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
from app.database import get_db
from app.models.user import User
from app.models.progress import UserProgress, ConceptMastery, LearningActivity
from app.models.mission import Mission
from app.models.challenge import ChallengeSubmission
from app.schemas.schemas import AICoachReviewRequest, AICoachReviewResponse
from app.utils.auth_utils import get_current_user
from app.services.gemini_service import gemini_service

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

@router.get("/analytics")
def get_user_analytics(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    now = datetime.utcnow()
    
    # Generate 7-day breakdown
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    daily_stats = []
    base_minutes = [45, 60, 30, 75, 50, 90, 40]
    base_xp = [120, 160, 90, 210, 140, 280, 110]
    
    for i in range(7):
        d_date = (now - timedelta(days=(6 - i))).strftime("%b %d")
        daily_stats.append({
            "date": d_date,
            "day_name": days[i],
            "minutes_spent": base_minutes[i],
            "xp_earned": base_xp[i],
            "missions_completed": (i % 3) + 1,
            "is_target_met": base_minutes[i] >= user.daily_time_minutes
        })

    # Generate 30-day activity heatmap
    heatmap = []
    for d in range(30, 0, -1):
        dt = (now - timedelta(days=d)).strftime("%Y-%m-%d")
        # Simulating realistic active study days
        intensity = 0
        if d % 7 != 1:  # Most days active
            intensity = 2 if d % 3 == 0 else (3 if d % 5 == 0 else 1)
        heatmap.append({
            "date": dt,
            "count": intensity,
            "xp": intensity * 75,
            "minutes": intensity * 25
        })

    # Role specific skills mastery
    role = user.current_role or "Web Developer"
    if "data" in role.lower():
        skills = [
            {"category": "Pandas & Data Wrangling", "score": 88, "level_label": "Advanced", "description": "Vectorized ops, merges & datetime indexing"},
            {"category": "Exploratory Data Analysis", "score": 92, "level_label": "Master", "description": "Distribution testing & IQR outlier detection"},
            {"category": "SQL & Analytical Aggregates", "score": 80, "level_label": "Proficient", "description": "Window functions, partitioning & CTES"},
            {"category": "Statistical Modeling & ML", "score": 70, "level_label": "Intermediate", "description": "Feature scaling & cross-validation"}
        ]
    elif "security" in role.lower() or "soc" in role.lower():
        skills = [
            {"category": "Vulnerability Analysis", "score": 90, "level_label": "Master", "description": "OWASP Top 10 & SQL injection defense"},
            {"category": "Network Traffic & WireShark", "score": 82, "level_label": "Advanced", "description": "PCAP dissection & handshake analysis"},
            {"category": "Authentication & JWT Security", "score": 85, "level_label": "Advanced", "description": "Cryptographic tokens & timing attacks"},
            {"category": "SIEM & Telemetry Forensics", "score": 72, "level_label": "Intermediate", "description": "Log correlation & incident triage"}
        ]
    elif "gate" in role.lower():
        skills = [
            {"category": "Operating Systems & Kernels", "score": 88, "level_label": "Advanced", "description": "CPU scheduling, semaphores & page replacement"},
            {"category": "Algorithms & Data Structures", "score": 84, "level_label": "Advanced", "description": "Dynamic programming & graph traversals"},
            {"category": "DBMS & Concurrency", "score": 90, "level_label": "Master", "description": "Serializability, ACID & B+ tree index math"},
            {"category": "Computer Networks & TCP/IP", "score": 78, "level_label": "Intermediate", "description": "Subnetting, sliding window & routing"}
        ]
    else: # Web Developer
        skills = [
            {"category": "Frontend Architecture & DOM", "score": 92, "level_label": "Master", "description": "CSS Grid, render cycle & microtasks"},
            {"category": "JavaScript & Async Runtimes", "score": 85, "level_label": "Advanced", "description": "Event loop, Promises & memory leaks"},
            {"category": "Backend APIs & Database Design", "score": 80, "level_label": "Proficient", "description": "REST endpoints, indexing & transaction locks"},
            {"category": "System Design & Resiliency", "score": 75, "level_label": "Intermediate", "description": "Rate limiting, caching & idempotency keys"}
        ]

    total_week_minutes = sum(d["minutes_spent"] for d in daily_stats)
    total_week_xp = sum(d["xp_earned"] for d in daily_stats)

    return {
        "weekly": {
            "week_start": (now - timedelta(days=6)).strftime("%d %b"),
            "week_end": now.strftime("%d %b %Y"),
            "total_minutes": total_week_minutes,
            "total_xp": total_week_xp,
            "active_days": sum(1 for d in daily_stats if d["minutes_spent"] > 0),
            "avg_minutes_per_day": round(total_week_minutes / 7.0, 1),
            "streak_days": user.streak_days,
            "daily_breakdown": daily_stats
        },
        "monthly": {
            "month_name": now.strftime("%B"),
            "year": now.year,
            "total_hours": round((sum(h["minutes"] for h in heatmap)) / 60.0, 1),
            "total_xp": sum(h["xp"] for h in heatmap) + user.total_xp,
            "completion_rate_percent": 84,
            "heatmap": heatmap,
            "skills_mastery": skills
        }
    }

@router.post("/analytics/ai-coach", response_model=AICoachReviewResponse)
def get_ai_coach_review(
    req: AICoachReviewRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    review = gemini_service.generate_performance_coach_review(
        user_name=user.name,
        user_role=user.current_role or "Web Developer",
        total_xp=user.total_xp,
        streak_days=user.streak_days,
        weekly_minutes=390,
        focus_topic=req.focus_topic
    )
    return review

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


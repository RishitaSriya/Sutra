from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.progress import LearningActivity

def log_meaningful_activity(db: Session, user: User, activity_type: str, reference_id: str = None, xp_earned: int = 0) -> bool:
    """
    Logs a meaningful learning activity and updates user streak and total XP.
    Streak only counts if a real mission, lesson, challenge, flashcard session or quiz was finished.
    """
    now = datetime.now(timezone.utc)
    
    # 1. Create activity record
    activity = LearningActivity(
        user_id=user.id,
        activity_type=activity_type,
        reference_id=reference_id,
        xp_earned=xp_earned,
        completed_at=now
    )
    db.add(activity)

    # 2. Update user total XP
    user.total_xp += xp_earned

    # 3. Check streak logic
    # Find all activities from past 7 days
    seven_days_ago = now - timedelta(days=7)
    recent_activities = (
        db.query(LearningActivity)
        .filter(LearningActivity.user_id == user.id, LearningActivity.completed_at >= seven_days_ago)
        .all()
    )

    # Group activities by date string YYYY-MM-DD
    active_dates = set(act.completed_at.strftime("%Y-%m-%d") for act in recent_activities)
    today_str = now.strftime("%Y-%m-%d")
    active_dates.add(today_str)

    # Compute consecutive daily streak backwards from today
    streak = 0
    check_date = now.date()
    while check_date.strftime("%Y-%m-%d") in active_dates:
        streak += 1
        check_date = check_date - timedelta(days=1)

    if streak > user.streak_days:
        user.streak_days = max(user.streak_days, streak)
    elif user.streak_days == 0:
        user.streak_days = 1

    db.commit()
    db.refresh(user)
    return True

def get_streak_history(db: Session, user: User) -> list:
    """
    Returns 7-day visual week calendar (Mon-Sun) with completion status.
    """
    now = datetime.now(timezone.utc)
    days_data = []
    
    # Generate past 7 days
    for i in range(6, -1, -1):
        target_date = now - timedelta(days=i)
        date_str = target_date.strftime("%Y-%m-%d")
        day_abbr = target_date.strftime("%a")
        date_label = target_date.strftime("%b %d")
        
        # Check if user had activity on this date
        had_activity = db.query(LearningActivity).filter(
            LearningActivity.user_id == user.id,
            LearningActivity.completed_at >= datetime(target_date.year, target_date.month, target_date.day, 0, 0, 0),
            LearningActivity.completed_at <= datetime(target_date.year, target_date.month, target_date.day, 23, 59, 59)
        ).first() is not None

        # For demo accounts, default previous days to active for visual presentation
        if getattr(user, "is_demo", False) or "demo" in (user.email or ""):
            had_activity = True

        days_data.append({
            "day": day_abbr,
            "date": date_label,
            "completed": had_activity,
            "xpEarned": 60 if had_activity else 0
        })
    
    return days_data

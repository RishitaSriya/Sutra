from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.group import StudyGroup, GroupMember, GroupMessage
from app.models.user import User
from app.schemas.schemas import SendMessageRequest
from app.utils.auth_utils import get_current_user
from app.services.streak_service import log_meaningful_activity

router = APIRouter(prefix="/groups", tags=["Study Groups"])

@router.get("")
def get_study_groups(db: Session = Depends(get_db)):
    groups = db.query(StudyGroup).all()
    results = []
    for g in groups:
        members_data = [
            {
                "id": m.id,
                "name": m.name,
                "college": m.college,
                "avatar": m.avatar_url,
                "role": m.role,
                "xp_this_week": m.xp_this_week,
                "online": m.is_online,
                "current_mission": m.current_mission
            }
            for m in g.members
        ]
        messages_data = [
            {
                "id": msg.id,
                "sender_name": msg.sender_name,
                "sender_avatar": msg.sender_avatar,
                "sender_college": msg.sender_college,
                "text": msg.text,
                "timestamp": msg.created_at.strftime("%I:%M %p") if msg.created_at else "10:14 AM",
                "reactions": msg.reactions_data or []
            }
            for msg in g.messages
        ]
        results.append({
            "id": g.id,
            "name": g.name,
            "tag": g.tag,
            "slogan": g.slogan,
            "member_count": g.member_count,
            "max_members": g.max_members,
            "active_now_count": g.active_now_count,
            "goal": {
                "title": g.goal_title,
                "progressPercent": g.goal_progress,
                "deadline": g.goal_deadline,
                "targetLevel": g.target_level
            },
            "squad_streak": g.squad_streak,
            "members": members_data,
            "messages": messages_data
        })
    return results

@router.get("/{group_id}")
def get_group(group_id: str, db: Session = Depends(get_db)):
    g = db.query(StudyGroup).filter(StudyGroup.id == group_id).first()
    if not g:
        g = db.query(StudyGroup).first()
    if not g:
        raise HTTPException(status_code=404, detail="Study group not found")

    members_data = [
        {
            "id": m.id,
            "name": m.name,
            "college": m.college,
            "avatar": m.avatar_url,
            "role": m.role,
            "xp_this_week": m.xp_this_week,
            "online": m.is_online,
            "current_mission": m.current_mission
        }
        for m in g.members
    ]
    messages_data = [
        {
            "id": msg.id,
            "sender_name": msg.sender_name,
            "sender_avatar": msg.sender_avatar,
            "sender_college": msg.sender_college,
            "text": msg.text,
            "timestamp": msg.created_at.strftime("%I:%M %p") if msg.created_at else "10:14 AM",
            "reactions": msg.reactions_data or []
        }
        for msg in g.messages
    ]
    return {
        "id": g.id,
        "name": g.name,
        "tag": g.tag,
        "slogan": g.slogan,
        "member_count": g.member_count,
        "max_members": g.max_members,
        "active_now_count": g.active_now_count,
        "goal": {
            "title": g.goal_title,
            "progressPercent": g.goal_progress,
            "deadline": g.goal_deadline,
            "targetLevel": g.target_level
        },
        "squad_streak": g.squad_streak,
        "members": members_data,
        "messages": messages_data
    }

@router.post("/{group_id}/join")
def join_group(group_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    g = db.query(StudyGroup).filter(StudyGroup.id == group_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Study group not found")

    existing = db.query(GroupMember).filter(GroupMember.group_id == group_id, GroupMember.user_id == user.id).first()
    if not existing:
        member = GroupMember(
            group_id=group_id,
            user_id=user.id,
            name=user.name,
            college=user.college,
            avatar_url=user.avatar_url,
            role="Level 3 • Squad Scholar",
            xp_this_week=user.total_xp,
            is_online=True
        )
        db.add(member)
        g.member_count += 1
        db.commit()

    return {"success": True, "group_id": g.id}

@router.post("/{group_id}/messages")
def send_message(
    group_id: str,
    req: SendMessageRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    g = db.query(StudyGroup).filter(StudyGroup.id == group_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Study group not found")

    msg = GroupMessage(
        group_id=group_id,
        user_id=user.id,
        sender_name=f"{user.name} (You)",
        sender_avatar=user.avatar_url,
        sender_college=user.college,
        text=req.text,
        reactions_data=[{"emoji": "🔥", "count": 1}]
    )
    db.add(msg)
    
    xp_earned = 15
    log_meaningful_activity(db, user, "squad_message_sent", msg.id, xp_earned)

    db.commit()
    db.refresh(msg)

    return {
        "id": msg.id,
        "sender_name": msg.sender_name,
        "sender_avatar": msg.sender_avatar,
        "sender_college": msg.sender_college,
        "text": msg.text,
        "timestamp": "Just now",
        "reactions": msg.reactions_data
    }

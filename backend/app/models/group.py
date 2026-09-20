import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class StudyGroup(Base):
    __tablename__ = "study_groups"

    id = Column(String(50), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    tag = Column(String(20), nullable=False)
    slogan = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    learning_path_id = Column(String(50), default="path_web_dev")
    goal_title = Column(String(255), nullable=False)
    goal_progress = Column(Integer, default=74)
    goal_deadline = Column(String(100), default="Sunday 11:59 PM")
    target_level = Column(String(100), default="Level 04 — Make It Think")
    squad_streak = Column(Integer, default=14)
    member_count = Column(Integer, default=18)
    max_members = Column(Integer, default=20)
    active_now_count = Column(Integer, default=7)
    created_by = Column(String(36), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    members = relationship("GroupMember", back_populates="group", cascade="all, delete-orphan")
    messages = relationship("GroupMessage", back_populates="group", cascade="all, delete-orphan")

class GroupMember(Base):
    __tablename__ = "group_members"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    group_id = Column(String(50), ForeignKey("study_groups.id"), nullable=False)
    user_id = Column(String(36), nullable=True)
    name = Column(String(100), nullable=False)
    college = Column(String(200), default="Engineering College")
    avatar_url = Column(String(500), nullable=True)
    role = Column(String(100), default="Student")
    xp_this_week = Column(Integer, default=300)
    is_online = Column(Boolean, default=False)
    current_mission = Column(String(200), default="The Website That Couldn’t Talk")
    joined_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    group = relationship("StudyGroup", back_populates="members")

class GroupMessage(Base):
    __tablename__ = "group_messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    group_id = Column(String(50), ForeignKey("study_groups.id"), nullable=False)
    user_id = Column(String(36), nullable=True)
    sender_name = Column(String(100), nullable=False)
    sender_avatar = Column(String(500), nullable=True)
    sender_college = Column(String(200), default="Engineering College")
    text = Column(Text, nullable=False)
    reactions_data = Column(JSON, default=lambda: [])
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    group = relationship("StudyGroup", back_populates="messages")

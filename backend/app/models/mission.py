import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Mission(Base):
    __tablename__ = "missions"

    id = Column(String(50), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    level_id = Column(String(50), nullable=True)
    title = Column(String(200), nullable=False)
    subtitle = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, default=30)
    duration_category = Column(String(20), default="30m")  # 15m, 30m, 45m, 60m
    category = Column(String(30), default="main")  # main, recall, practice, bonus
    xp_reward = Column(Integer, default=60)
    status = Column(String(30), default="in_progress")  # in_progress, completed, available
    completed = Column(Boolean, default=False)
    skills = Column(JSON, default=lambda: [])
    scheduled_date = Column(String(30), default=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="missions")
    tasks = relationship("MissionTask", back_populates="mission", cascade="all, delete-orphan")

class MissionTask(Base):
    __tablename__ = "mission_tasks"

    id = Column(String(50), primary_key=True)
    mission_id = Column(String(50), ForeignKey("missions.id"), nullable=False)
    text = Column(String(255), nullable=False)
    type = Column(String(30), default="concept")  # story, concept, challenge, reflect, practice
    xp = Column(Integer, default=15)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    mission = relationship("Mission", back_populates="tasks")

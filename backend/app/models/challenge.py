import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(String(50), primary_key=True)
    learning_path_id = Column(String(50), nullable=True)
    title = Column(String(200), nullable=False)
    scenario = Column(Text, nullable=False)
    objective = Column(Text, nullable=False)
    type = Column(String(30), default="boss")  # boss, debug, speedrun, architect
    difficulty = Column(Integer, default=3)  # 1 to 5 stars
    duration_minutes = Column(Integer, default=90)
    skills = Column(JSON, default=lambda: [])
    requirements = Column(JSON, default=lambda: [])
    xp_reward = Column(Integer, default=250)
    badge_reward = Column(String(100), default="Fest Architect 🎪")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ChallengeSubmission(Base):
    __tablename__ = "challenge_submissions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    challenge_id = Column(String(50), ForeignKey("challenges.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    submission = Column(Text, nullable=True)
    score = Column(Integer, default=100)
    status = Column(String(30), default="passed")  # accepted, submitted, passed, failed
    accepted = Column(Boolean, default=False)
    completed = Column(Boolean, default=False)
    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    challenge = relationship("Challenge")
    user = relationship("User")

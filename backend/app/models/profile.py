import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean, JSON, Text
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class UserLearningProfile(Base):
    __tablename__ = "user_learning_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, unique=True)
    track_type = Column(String(50), default="career")  # "career", "exam", "higher_studies"
    
    # Career-specific fields
    career_path = Column(String(100), nullable=True)  # e.g. "Web Developer", "AI / ML"
    learning_path_id = Column(String(50), nullable=True)
    target_companies = Column(JSON, default=lambda: [])  # List of company names (ONLY for career)
    
    # Exam / GATE-specific fields
    exam_type = Column(String(50), nullable=True)  # e.g. "GATE_CSE", "GATE_DA", "Other"
    target_year = Column(String(20), nullable=True)  # e.g. "2027", "2028", "Later", "Not decided"
    goals = Column(JSON, default=lambda: [])  # e.g. ["IIT / IISc", "M.Tech", "PSU opportunities"]
    preparation_level = Column(String(100), nullable=True)  # "Just Starting", "Revision stage", etc.
    subjects = Column(JSON, default=lambda: [])  # Selected current subjects
    
    # Shared preferences
    daily_minutes = Column(Integer, default=30)
    learning_preferences = Column(JSON, default=lambda: ["Stories", "Hands-on"])
    learning_dna = Column(JSON, default=lambda: {"handsOn": 40, "stories": 30, "challenges": 20, "visualExploration": 10})
    onboarding_completed = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="learning_profile")

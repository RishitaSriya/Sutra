import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(String(50), primary_key=True, default=generate_uuid)
    title = Column(String(200), nullable=False)
    company = Column(String(100), nullable=False)
    logo = Column(String(20), default="💼")
    location = Column(String(100), default="Bengaluru / Remote")
    work_type = Column(String(50), default="Hybrid")  # Remote, Hybrid, On-site
    type = Column(String(50), default="Internship")    # Internship, Hackathon, Competition, Scholarship, Workshop, Event
    stipend_or_prize = Column(String(100), default="Competitive")
    deadline = Column(String(100), nullable=False)
    days_left = Column(Integer, default=14)
    skill_tags = Column(JSON, default=lambda: [])
    match_score = Column(Integer, default=90)
    description = Column(Text, nullable=False)
    eligibility = Column(Text, nullable=True)
    url = Column(String(500), nullable=True)
    learning_path_id = Column(String(50), default="path_web_dev")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class UserOpportunity(Base):
    __tablename__ = "user_opportunities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    opportunity_id = Column(String(50), ForeignKey("opportunities.id"), nullable=False)
    saved = Column(Boolean, default=False)
    applied = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User")
    opportunity = relationship("Opportunity")

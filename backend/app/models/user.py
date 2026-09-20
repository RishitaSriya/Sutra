import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    college = Column(String(200), default="Engineering College")
    tier = Column(String(50), default="Tier-2 College")
    year = Column(String(50), default="3rd Year B.Tech CSE")
    total_xp = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)
    onboarding_completed = Column(Boolean, default=False)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    learning_profile = relationship("UserLearningProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    preferences = relationship("UserPreferences", back_populates="user", uselist=False, cascade="all, delete-orphan")
    companies = relationship("UserCompany", back_populates="user", cascade="all, delete-orphan")
    progress = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")
    activities = relationship("LearningActivity", back_populates="user", cascade="all, delete-orphan")
    flashcards = relationship("Flashcard", back_populates="user", cascade="all, delete-orphan")
    notes = relationship("Note", back_populates="user", cascade="all, delete-orphan")
    missions = relationship("Mission", back_populates="user", cascade="all, delete-orphan")


class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, unique=True)
    learning_path_id = Column(String(50), default="path_web_dev")
    current_role = Column(String(100), default="Web Developer")
    daily_minutes = Column(Integer, default=30)
    learning_preferences = Column(JSON, default=lambda: ["Stories", "Hands-on"])
    learning_dna = Column(JSON, default=lambda: {"handsOn": 45, "stories": 30, "challenges": 25, "visualExploration": 20})
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="preferences")

class Company(Base):
    __tablename__ = "companies"

    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    logo_url = Column(String(20), nullable=False)
    description = Column(String(255), nullable=True)
    type = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class UserCompany(Base):
    __tablename__ = "user_companies"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    company_id = Column(String(50), ForeignKey("companies.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="companies")
    company = relationship("Company")

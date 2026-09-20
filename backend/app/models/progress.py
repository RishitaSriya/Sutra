import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON, Float
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    level_id = Column(String(50), ForeignKey("levels.id"), nullable=False)
    status = Column(String(30), default="locked")  # completed, available, in_progress, locked
    progress_percentage = Column(Integer, default=0)
    xp = Column(Integer, default=0)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="progress")
    level = relationship("Level")

class ConceptMastery(Base):
    __tablename__ = "concept_mastery"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    concept_id = Column(String(50), ForeignKey("concepts.id"), nullable=False)
    mastery_score = Column(Integer, default=0)  # 0 - 100
    attempts = Column(Integer, default=0)
    last_reviewed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class LearningActivity(Base):
    __tablename__ = "learning_activity"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    activity_type = Column(String(50), nullable=False)  # mission_completed, lesson_completed, challenge_completed, flashcard_session, quiz_completed
    reference_id = Column(String(100), nullable=True)
    xp_earned = Column(Integer, default=0)
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="activities")

class Question(Base):
    __tablename__ = "questions"

    id = Column(String(50), primary_key=True)
    concept_id = Column(String(50), ForeignKey("concepts.id"), nullable=False)
    question = Column(Text, nullable=False)
    context = Column(String(255), nullable=True)
    options = Column(JSON, nullable=False)  # [{id, label, isCorrect, feedback}]
    correct_option_id = Column(String(50), nullable=False)
    explanation = Column(Text, nullable=True)
    difficulty = Column(String(20), default="medium")

    concept = relationship("Concept", back_populates="questions")

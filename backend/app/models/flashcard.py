import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(String(50), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    concept_id = Column(String(50), ForeignKey("concepts.id"), nullable=True)
    topic = Column(String(100), nullable=False)
    category = Column(String(100), default="Core Foundations")
    front = Column(Text, nullable=False)  # Question
    back = Column(Text, nullable=False)   # Answer
    code_snippet = Column(Text, nullable=True)
    difficulty = Column(String(20), default="medium")
    confidence = Column(Integer, default=50)  # 0 to 100
    mastery_score = Column(Integer, default=70)
    times_reviewed = Column(Integer, default=0)
    next_review_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    last_reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="flashcards")
    concept = relationship("Concept", backref="flashcards")

import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean, JSON, Text
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Exam(Base):
    __tablename__ = "exams"

    id = Column(String(50), primary_key=True)  # e.g. "GATE_CSE", "GATE_DA"
    title = Column(String(100), nullable=False)
    slug = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=False)
    icon = Column(String(20), default="📚")
    color_accent = Column(String(20), default="#244B3A")
    target_years = Column(JSON, default=lambda: ["2027", "2028", "2029", "Later", "Not decided"])
    total_subjects = Column(Integer, default=10)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    subjects = relationship("ExamSubject", back_populates="exam", cascade="all, delete-orphan")

class ExamSubject(Base):
    __tablename__ = "exam_subjects"

    id = Column(String(50), primary_key=True)
    exam_id = Column(String(50), ForeignKey("exams.id"), nullable=False)
    name = Column(String(150), nullable=False)
    code = Column(String(20), nullable=True)
    icon = Column(String(20), default="📖")
    weightage_percent = Column(Integer, default=10)
    total_topics = Column(Integer, default=15)
    topics = Column(JSON, default=lambda: [])
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    exam = relationship("Exam", back_populates="subjects")

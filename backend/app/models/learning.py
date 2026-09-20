import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class LearningPath(Base):
    __tablename__ = "learning_paths"

    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=False)
    icon = Column(String(20), default="🌐")
    role_tag = Column(String(100), nullable=False)
    color_accent = Column(String(20), default="#244B3A")
    total_levels = Column(Integer, default=7)
    estimated_weeks = Column(Integer, default=6)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    levels = relationship("Level", back_populates="learning_path", cascade="all, delete-orphan")

class Level(Base):
    __tablename__ = "levels"

    id = Column(String(50), primary_key=True)
    learning_path_id = Column(String(50), ForeignKey("learning_paths.id"), nullable=False)
    level_number = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    subtitle = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    estimated_minutes = Column(Integer, default=45)
    status = Column(String(20), default="locked")  # mastered, current, locked
    is_locked = Column(Boolean, default=True)
    xp_reward = Column(Integer, default=100)
    story_snippet = Column(Text, nullable=True)
    tags = Column(JSON, default=lambda: [])
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    learning_path = relationship("LearningPath", back_populates="levels")
    concepts = relationship("Concept", back_populates="level", cascade="all, delete-orphan")

class Concept(Base):
    __tablename__ = "concepts"

    id = Column(String(50), primary_key=True)
    level_id = Column(String(50), ForeignKey("levels.id"), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    difficulty = Column(String(20), default="medium")
    estimated_minutes = Column(Integer, default=15)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    level = relationship("Level", back_populates="concepts")
    lessons = relationship("Lesson", back_populates="concept", cascade="all, delete-orphan")
    questions = relationship("Question", back_populates="concept", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(String(50), primary_key=True)
    concept_id = Column(String(50), ForeignKey("concepts.id"), nullable=False)
    level_id = Column(String(50), ForeignKey("levels.id"), nullable=True)
    title = Column(String(150), nullable=False)
    role_context = Column(String(255), nullable=True)
    story_content = Column(JSON, nullable=True)  # premise, dilemma, objective
    explanation = Column(Text, nullable=True)
    analogy = Column(JSON, nullable=True)  # title, story, icon
    visual_diagram_flow = Column(JSON, default=lambda: [])
    golden_rule = Column(Text, nullable=True)
    common_mistakes = Column(JSON, default=lambda: [])
    interactive_moment = Column(JSON, nullable=True)
    mini_challenge = Column(JSON, nullable=True)
    practice_task = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    concept = relationship("Concept", back_populates="lessons")
    steps = relationship("LessonStep", back_populates="lesson", cascade="all, delete-orphan")

class LessonStep(Base):
    __tablename__ = "lesson_steps"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    lesson_id = Column(String(50), ForeignKey("lessons.id"), nullable=False)
    step_number = Column(Integer, nullable=False)
    type = Column(String(50), nullable=False)  # story, explanation, choice, ordering, mcq, simulation, reflection, practice
    content = Column(Text, nullable=False)
    interaction_data = Column(JSON, default=lambda: {})
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    lesson = relationship("Lesson", back_populates="steps")

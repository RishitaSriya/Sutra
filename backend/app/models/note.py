import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Note(Base):
    __tablename__ = "notes"

    id = Column(String(50), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    concept_id = Column(String(50), nullable=True)
    title = Column(String(150), nullable=False)
    read_time = Column(String(50), default="60 SEC READ")
    topic = Column(String(100), nullable=False)
    category = Column(String(100), default="Web Architecture")
    what_it_is = Column(Text, nullable=False)
    think_of_it_like = Column(Text, nullable=False)
    remember_this = Column(JSON, default=lambda: [])
    common_mistake = Column(Text, nullable=False)
    is_saved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="notes")

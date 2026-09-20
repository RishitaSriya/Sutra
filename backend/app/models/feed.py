import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Post(Base):
    __tablename__ = "posts"

    id = Column(String(50), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    author_name = Column(String(100), nullable=False)
    handle = Column(String(100), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    college = Column(String(200), default="Engineering College")
    category = Column(String(50), default="Programming")  # Programming, AI, DSA, College, Debugging, GATE, DevLife
    headline = Column(String(255), nullable=False)
    type = Column(String(50), default="code-vs-code")  # code-vs-code, stat-punchline, relatable-quote
    content_data = Column(JSON, default=lambda: {})
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    learning_bridge_data = Column(JSON, default=lambda: {})
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    likes = relationship("PostLike", back_populates="post", cascade="all, delete-orphan")
    comments = relationship("PostComment", back_populates="post", cascade="all, delete-orphan")
    saves = relationship("SavedPost", back_populates="post", cascade="all, delete-orphan")

class PostLike(Base):
    __tablename__ = "post_likes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    post_id = Column(String(50), ForeignKey("posts.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    post = relationship("Post", back_populates="likes")

class PostComment(Base):
    __tablename__ = "post_comments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    post_id = Column(String(50), ForeignKey("posts.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    author_name = Column(String(100), nullable=False)
    author_avatar = Column(String(500), nullable=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    post = relationship("Post", back_populates="comments")

class SavedPost(Base):
    __tablename__ = "saved_posts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    post_id = Column(String(50), ForeignKey("posts.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    post = relationship("Post", back_populates="saves")

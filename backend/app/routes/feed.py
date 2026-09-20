from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.database import get_db
from app.models.feed import Post, PostLike, PostComment, SavedPost
from app.models.user import User
from app.schemas.schemas import CommentCreate
from app.utils.auth_utils import get_current_user

router = APIRouter(prefix="/feed", tags=["Tech Feed"])

@router.get("")
def get_feed(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    posts = db.query(Post).order_by(Post.created_at.desc()).all()
    results = []
    for p in posts:
        liked = False
        saved = False
        if user:
            liked = db.query(PostLike).filter(PostLike.post_id == p.id, PostLike.user_id == user.id).first() is not None
            saved = db.query(SavedPost).filter(SavedPost.post_id == p.id, SavedPost.user_id == user.id).first() is not None

        results.append({
            "id": p.id,
            "author": p.author_name,
            "handle": p.handle,
            "avatar": p.avatar_url,
            "college": p.college,
            "category": p.category,
            "meme_card": {
                "headline": p.headline,
                "type": p.type,
                **(p.content_data or {})
            },
            "likes": p.likes_count,
            "liked": liked,
            "comments_count": p.comments_count,
            "saved": saved,
            "learning_mission_bridge": p.learning_bridge_data or {},
            "created_at": p.created_at
        })
    return results

@router.post("/posts/{post_id}/like")
def like_post(post_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_like = db.query(PostLike).filter(PostLike.post_id == post_id, PostLike.user_id == user.id).first()
    if existing_like:
        db.delete(existing_like)
        post.likes_count = max(0, post.likes_count - 1)
        liked = False
    else:
        new_like = PostLike(post_id=post_id, user_id=user.id)
        db.add(new_like)
        post.likes_count += 1
        liked = True

    db.commit()
    db.refresh(post)
    return {"success": True, "post_id": post.id, "liked": liked, "likes_count": post.likes_count}

@router.post("/posts/{post_id}/save")
def save_post(post_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_save = db.query(SavedPost).filter(SavedPost.post_id == post_id, SavedPost.user_id == user.id).first()
    if existing_save:
        db.delete(existing_save)
        saved = False
    else:
        new_save = SavedPost(post_id=post_id, user_id=user.id)
        db.add(new_save)
        saved = True

    db.commit()
    return {"success": True, "post_id": post.id, "saved": saved}

@router.post("/posts/{post_id}/comment")
def add_comment(post_id: str, req: CommentCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comment = PostComment(
        post_id=post_id,
        user_id=user.id,
        author_name=user.name,
        author_avatar=user.avatar_url,
        content=req.content
    )
    db.add(comment)
    post.comments_count += 1
    db.commit()
    db.refresh(comment)
    return {
        "id": comment.id,
        "post_id": comment.post_id,
        "author_name": comment.author_name,
        "content": comment.content,
        "created_at": comment.created_at
    }

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.note import Note
from app.models.user import User
from app.schemas.schemas import NoteCreate, NoteGenerateAiRequest
from app.utils.auth_utils import get_current_user
from app.services.gemini_service import gemini_service
import uuid

router = APIRouter(prefix="/notes", tags=["Notes"])

@router.get("")
def get_notes(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notes = db.query(Note).all()
    return [
        {
            "id": n.id,
            "title": n.title,
            "read_time": n.read_time,
            "topic": n.topic,
            "category": n.category,
            "what_it_is": n.what_it_is,
            "think_of_it_like": n.think_of_it_like,
            "remember_this": n.remember_this or [],
            "common_mistake": n.common_mistake,
            "is_saved": n.is_saved
        }
        for n in notes
    ]

@router.post("/generate-ai")
def generate_ai_note(
    req: NoteGenerateAiRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note_data = gemini_service.generate_short_note(
        topic=req.topic,
        user_role=req.category or user.current_role or "Web Developer"
    )
    
    # Save synthesized note to DB for the user
    new_note = Note(
        id=f"note_ai_{uuid.uuid4().hex[:8]}",
        user_id=user.id,
        title=note_data.get("title", f"{req.topic} in 60 Seconds"),
        topic=note_data.get("topic", req.topic),
        category=note_data.get("category", req.category or "Engineering Insights"),
        read_time=note_data.get("read_time", "60 SEC READ"),
        what_it_is=note_data.get("what_it_is", ""),
        think_of_it_like=note_data.get("think_of_it_like", ""),
        remember_this=note_data.get("remember_this", []),
        common_mistake=note_data.get("common_mistake", ""),
        is_saved=True
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    
    return {
        "id": new_note.id,
        "title": new_note.title,
        "read_time": new_note.read_time,
        "topic": new_note.topic,
        "category": new_note.category,
        "what_it_is": new_note.what_it_is,
        "think_of_it_like": new_note.think_of_it_like,
        "remember_this": new_note.remember_this or [],
        "common_mistake": new_note.common_mistake,
        "is_saved": new_note.is_saved,
        "is_ai_generated": True
    }

@router.get("/{note_id}")
def get_note(note_id: str, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return {
        "id": note.id,
        "title": note.title,
        "read_time": note.read_time,
        "topic": note.topic,
        "category": note.category,
        "what_it_is": note.what_it_is,
        "think_of_it_like": note.think_of_it_like,
        "remember_this": note.remember_this or [],
        "common_mistake": note.common_mistake,
        "is_saved": note.is_saved
    }

@router.post("/{note_id}/save")
def toggle_save_note(note_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    note.is_saved = not note.is_saved
    db.commit()
    db.refresh(note)
    return {
        "success": True,
        "note_id": note.id,
        "is_saved": note.is_saved
    }

@router.post("")
def create_note(req: NoteCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    note = Note(
        user_id=user.id,
        title=req.title,
        topic=req.topic,
        category=req.category,
        what_it_is=req.what_it_is,
        think_of_it_like=req.think_of_it_like,
        remember_this=req.remember_this,
        common_mistake=req.common_mistake,
        is_saved=req.is_saved or False
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.note import Note
from app.models.user import User
from app.schemas.schemas import NoteCreate
from app.utils.auth_utils import get_current_user

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

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.exam import Exam, ExamSubject
from app.schemas.schemas import ExamResponse, ExamSubjectResponse

router = APIRouter(prefix="/exams", tags=["Exams"])

@router.get("", response_model=List[ExamResponse])
def get_all_exams(db: Session = Depends(get_db)):
    exams = db.query(Exam).all()
    results = []
    for ex in exams:
        subj_list = [
            ExamSubjectResponse(
                id=s.id,
                name=s.name,
                code=s.code,
                icon=s.icon,
                weightage_percent=s.weightage_percent,
                total_topics=s.total_topics,
                topics=s.topics or []
            )
            for s in ex.subjects
        ]
        results.append(
            ExamResponse(
                id=ex.id,
                title=ex.title,
                slug=ex.slug,
                description=ex.description,
                icon=ex.icon,
                color_accent=ex.color_accent,
                target_years=ex.target_years or ["2027", "2028", "2029", "Later", "Not decided"],
                total_subjects=ex.total_subjects,
                subjects=subj_list
            )
        )
    return results

@router.get("/{exam_id}", response_model=ExamResponse)
def get_exam_by_id(exam_id: str, db: Session = Depends(get_db)):
    ex = db.query(Exam).filter(Exam.id == exam_id).first()
    if not ex:
        # Try finding by slug
        ex = db.query(Exam).filter(Exam.slug == exam_id.lower()).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    subj_list = [
        ExamSubjectResponse(
            id=s.id,
            name=s.name,
            code=s.code,
            icon=s.icon,
            weightage_percent=s.weightage_percent,
            total_topics=s.total_topics,
            topics=s.topics or []
        )
        for s in ex.subjects
    ]
    return ExamResponse(
        id=ex.id,
        title=ex.title,
        slug=ex.slug,
        description=ex.description,
        icon=ex.icon,
        color_accent=ex.color_accent,
        target_years=ex.target_years or ["2027", "2028", "2029", "Later", "Not decided"],
        total_subjects=ex.total_subjects,
        subjects=subj_list
    )

@router.get("/{exam_id}/subjects", response_model=List[ExamSubjectResponse])
def get_exam_subjects(exam_id: str, db: Session = Depends(get_db)):
    ex = db.query(Exam).filter((Exam.id == exam_id) | (Exam.slug == exam_id.lower())).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    return [
        ExamSubjectResponse(
            id=s.id,
            name=s.name,
            code=s.code,
            icon=s.icon,
            weightage_percent=s.weightage_percent,
            total_topics=s.total_topics,
            topics=s.topics or []
        )
        for s in ex.subjects
    ]

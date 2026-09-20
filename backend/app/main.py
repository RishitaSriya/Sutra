from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import engine, Base
import app.models  # ensure all models are registered

# Import all route modules
from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.learning import router as learning_router
from app.routes.missions import router as missions_router
from app.routes.progress import router as progress_router
from app.routes.flashcards import router as flashcards_router
from app.routes.notes import router as notes_router
from app.routes.questions import router as questions_router
from app.routes.challenges import router as challenges_router
from app.routes.feed import router as feed_router
from app.routes.groups import router as groups_router
from app.routes.opportunities import router as opportunities_router
from app.routes.onboarding import router as onboarding_router, profile_router
from app.routes.exams import router as exams_router
from app.routes.users_learning import router as users_learning_router
from app.routes.ai import router as ai_router
from app.routes.sandbox import router as sandbox_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed if database is fresh on new deployment
    try:
        from app.database import SessionLocal
        from app.models.learning import LearningPath
        db = SessionLocal()
        try:
            if db.query(LearningPath).count() == 0:
                print("[SUTRA Startup] Fresh database detected, seeding initial dataset...")
                from seed import seed_database
                seed_database(drop_existing=False)
                print("[SUTRA Startup] Database seeded successfully!")
        except Exception as e:
            print(f"[SUTRA Startup] Auto-seed note: {e}")
        finally:
            db.close()
    except Exception as e:
        print(f"[SUTRA Startup] Database init note: {e}")

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SUTRA — Student-First Learning & Productivity Platform API",
    lifespan=lifespan
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under /api
app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(onboarding_router, prefix="/api")
app.include_router(profile_router, prefix="/api")
app.include_router(exams_router, prefix="/api")
app.include_router(learning_router, prefix="/api")
app.include_router(users_learning_router, prefix="/api")
app.include_router(missions_router, prefix="/api")
app.include_router(progress_router, prefix="/api")
app.include_router(flashcards_router, prefix="/api")
app.include_router(notes_router, prefix="/api")
app.include_router(questions_router, prefix="/api")
app.include_router(challenges_router, prefix="/api")
app.include_router(feed_router, prefix="/api")
app.include_router(groups_router, prefix="/api")
app.include_router(opportunities_router, prefix="/api")
app.include_router(ai_router)
app.include_router(sandbox_router)


@app.get("/")
def root_index():
    return {
        "status": "online",
        "service": "SUTRA Backend API",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "frontend_app": "http://localhost:5173",
        "message": "Welcome to SUTRA API. Open http://localhost:5173 to access the frontend application or /docs for API documentation."
    }

@app.get("/api")
def api_index():
    return {
        "status": "online",
        "service": "SUTRA Backend API",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "endpoints": [
            "/api/auth",
            "/api/users/me/current-lesson",
            "/api/users/me/learning-path",
            "/api/users/me/learning-journey",
            "/api/users/me/today-mission",
            "/api/onboarding",
            "/api/learning-paths",
            "/api/health"
        ]
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Sutra API",
        "tagline": "Your syllabus tells you what to learn. We make you want to learn it."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

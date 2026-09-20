import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_DB_PATH = os.path.join(BASE_DIR, "sutra.db")

class Settings(BaseSettings):
    PROJECT_NAME: str = "SUTRA API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database: Supports PostgreSQL / Supabase, falls back to SQLite for local development
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH.replace(os.sep, '/')}")
    
    # JWT Auth
    JWT_SECRET: str = os.getenv("JWT_SECRET", "sutra_super_secret_jwt_key_2026_dev_prod")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # AI Service
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()

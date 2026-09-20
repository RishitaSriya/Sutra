from fastapi import APIRouter, Depends, HTTPException
from app.services.sandbox_service import sandbox_service, CHALLENGE_TEST_SUITES
from app.schemas.schemas import SandboxRunRequest, SandboxRunResponse
from app.utils.auth_utils import get_current_user
from app.models.user import User
from typing import List, Dict, Any

router = APIRouter(prefix="/api/sandbox", tags=["Code Sandbox Execution"])

@router.get("/languages")
def get_supported_languages():
    return sandbox_service.get_supported_languages()

@router.post("/run", response_model=SandboxRunResponse)
def execute_code(
    req: SandboxRunRequest,
    user: User = Depends(get_current_user)
):
    if not req.code or not req.code.strip():
        raise HTTPException(status_code=400, detail="No code provided for execution")

    result = sandbox_service.execute_code(
        code=req.code,
        language=req.language or "python",
        stdin_data=req.stdin or "",
        timeout_sec=4.0
    )
    return result

@router.get("/challenges/{challenge_id}/template")
def get_challenge_starter_template(
    challenge_id: str,
    user: User = Depends(get_current_user)
):
    suite = CHALLENGE_TEST_SUITES.get(challenge_id, CHALLENGE_TEST_SUITES["challenge_boss_01"])
    return {
        "challenge_id": challenge_id,
        "title": suite["title"],
        "python": suite["python_template"],
        "javascript": suite["js_template"],
        "test_cases_count": len(suite["test_cases"])
    }

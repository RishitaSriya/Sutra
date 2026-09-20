from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr

# Auth Schemas
class AuthRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    confirm_password: Optional[str] = None
    college: Optional[str] = "Engineering College"
    year: Optional[str] = "1st Year"
    tier: Optional[str] = "Tier-2 College"

class AuthLogin(BaseModel):
    email: EmailStr
    password: str

class DemoLoginRequest(BaseModel):
    demo_user: Optional[str] = "aarav"  # "aarav" or "ananya"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

# Onboarding Schemas
class CareerOnboardingRequest(BaseModel):
    career_path: str = "Web Developer"
    learning_path_id: Optional[str] = "path_web_dev"
    target_companies: Optional[List[str]] = []
    daily_minutes: Optional[int] = 30
    learning_preferences: Optional[List[str]] = ["Stories", "Hands-on"]

class ExamOnboardingRequest(BaseModel):
    exam_type: str = "GATE_CSE"
    target_year: str = "2028"
    goals: List[str] = ["IIT / IISc", "M.Tech"]
    preparation_level: str = "Just Starting"
    daily_minutes: int = 120
    subjects: List[str] = []
    learning_preferences: Optional[List[str]] = ["Stories", "Hands-on"]

class UserLearningProfileResponse(BaseModel):
    id: str
    user_id: str
    track_type: str
    career_path: Optional[str] = None
    learning_path_id: Optional[str] = None
    target_companies: List[str] = []
    exam_type: Optional[str] = None
    target_year: Optional[str] = None
    goals: List[str] = []
    preparation_level: Optional[str] = None
    subjects: List[str] = []
    daily_minutes: int = 30
    learning_preferences: List[str] = []
    learning_dna: Dict[str, int] = {}
    onboarding_completed: bool = False

# Exam Schemas
class ExamSubjectResponse(BaseModel):
    id: str
    name: str
    code: Optional[str] = None
    icon: str = "📖"
    weightage_percent: int = 10
    total_topics: int = 15
    topics: List[str] = []

class ExamResponse(BaseModel):
    id: str
    title: str
    slug: str
    description: str
    icon: str = "📚"
    color_accent: str = "#244B3A"
    target_years: List[str] = []
    total_subjects: int = 10
    subjects: List[ExamSubjectResponse] = []

# User Schemas
class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    avatar_url: Optional[str] = None
    college: str
    tier: str
    year: str
    total_xp: int
    streak_days: int
    onboarding_completed: bool = False
    is_demo: bool = False
    track_type: str = "career"
    current_role: Optional[str] = "Web Developer"
    dream_companies: List[str] = []
    learning_styles: List[str] = []
    daily_time_minutes: int = 30
    learning_dna: Dict[str, int] = {}
    streak_history: List[Dict[str, Any]] = []
    exam_details: Optional[Dict[str, Any]] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    college: Optional[str] = None
    year: Optional[str] = None
    current_role: Optional[str] = None
    dream_companies: Optional[List[str]] = None
    learning_styles: Optional[List[str]] = None
    daily_time_minutes: Optional[int] = None
    learning_dna: Optional[Dict[str, int]] = None

class UserPreferencesUpdate(BaseModel):
    track_type: Optional[str] = None
    career_path: Optional[str] = None
    learning_path_id: Optional[str] = None
    current_role: Optional[str] = None
    daily_minutes: Optional[int] = None
    learning_preferences: Optional[List[str]] = None
    target_companies: Optional[List[str]] = None
    exam_type: Optional[str] = None
    target_year: Optional[str] = None
    goals: Optional[List[str]] = None
    preparation_level: Optional[str] = None
    subjects: Optional[List[str]] = None
    learning_dna: Optional[Dict[str, int]] = None


# Learning Schemas
class LevelSummary(BaseModel):
    id: str
    level_number: int
    title: str
    subtitle: Optional[str] = None
    estimated_time: str
    status: str
    is_locked: bool
    xp_reward: int
    story_snippet: Optional[str] = None
    tags: List[str] = []

class LearningPathResponse(BaseModel):
    id: str
    title: str
    icon: str
    role_tag: str
    description: str
    current_level: int
    total_levels: int
    estimated_weeks: int
    levels: List[LevelSummary] = []

class LessonStepResponse(BaseModel):
    id: str
    step_number: int
    type: str
    content: str
    interaction_data: Optional[Dict[str, Any]] = {}

class LessonResponse(BaseModel):
    id: str
    level_id: Optional[str] = None
    level_number: Optional[int] = 1
    level_title: Optional[str] = ""
    title: str
    role_context: Optional[str] = None
    narrative: Optional[Dict[str, Any]] = None
    interactive_moment: Optional[Dict[str, Any]] = None
    concept_breakdown: Optional[Dict[str, Any]] = None
    mini_challenge: Optional[Dict[str, Any]] = None
    practice_task: Optional[Dict[str, Any]] = None
    steps: List[LessonStepResponse] = []

# Mission Schemas
class MissionTaskResponse(BaseModel):
    id: str
    text: str
    completed: bool
    xp: int
    type: str

class MissionResponse(BaseModel):
    id: str
    title: str
    subtitle: Optional[str] = None
    time_estimate: str
    duration_category: str
    category: str
    xp_reward: int
    completed: bool
    skills: List[str] = []
    tasks: List[MissionTaskResponse] = []

class TaskToggleRequest(BaseModel):
    completed: Optional[bool] = None

# Progress Schemas
class ProgressResponse(BaseModel):
    total_xp: int
    streak_days: int
    current_level: int
    current_level_mastery: int
    mastered_concepts_count: int
    completed_missions_count: int
    completed_challenges_count: int
    levels_progress: List[Dict[str, Any]] = []

# Flashcard Schemas
class FlashcardResponse(BaseModel):
    id: str
    topic: str
    category: str
    question: str
    answer: str
    code_snippet: Optional[str] = None
    difficulty: str
    mastery_score: int
    times_reviewed: int

class FlashcardReviewRequest(BaseModel):
    remembered: bool

# Note Schemas
class NoteResponse(BaseModel):
    id: str
    title: str
    read_time: str
    topic: str
    category: str
    what_it_is: str
    think_of_it_like: str
    remember_this: List[str] = []
    common_mistake: str
    is_saved: bool

class NoteCreate(BaseModel):
    title: str
    topic: str
    category: Optional[str] = "Web Architecture"
    what_it_is: str
    think_of_it_like: str
    remember_this: List[str] = []
    common_mistake: str
    is_saved: Optional[bool] = False

class NoteGenerateAiRequest(BaseModel):
    topic: str
    category: Optional[str] = "Web Architecture"

# Question & Quiz Schemas
class QuestionResponse(BaseModel):
    id: str
    concept_id: str
    question: str
    context: Optional[str] = None
    options: List[Dict[str, Any]]
    explanation: Optional[str] = None
    difficulty: str

class AnswerRequest(BaseModel):
    option_id: str

class AnswerResponse(BaseModel):
    is_correct: bool
    feedback: str
    explanation: Optional[str] = None
    xp_earned: int
    mastery_score: int

# Challenge Schemas
class ChallengeResponse(BaseModel):
    id: str
    title: str
    difficulty: int
    duration: str
    skills: List[str] = []
    scenario: str
    objective: str
    requirements: List[str] = []
    xp_reward: int
    badge_reward: str
    accepted: bool
    completed: bool
    type: str

class ChallengeSubmissionRequest(BaseModel):
    solution_code: Optional[str] = None

class ChallengeSubmissionResponse(BaseModel):
    passed: bool
    score: int
    message: str
    xp_awarded: int
    badge_unlocked: Optional[str] = None

# Tech Meme Feed Schemas
class PostResponse(BaseModel):
    id: str
    author: str
    handle: str
    avatar: str
    college: str
    category: str
    meme_card: Dict[str, Any]
    likes: int
    liked: bool = False
    comments_count: int
    saved: bool = False
    learning_mission_bridge: Dict[str, Any]
    created_at: Optional[datetime] = None

class CommentCreate(BaseModel):
    content: str

class CommentResponse(BaseModel):
    id: str
    post_id: str
    author_name: str
    author_avatar: Optional[str] = None
    content: str
    created_at: datetime

# Study Group Schemas
class SquadMemberResponse(BaseModel):
    id: str
    name: str
    college: str
    avatar: str
    role: str
    xp_this_week: int
    online: bool
    current_mission: str

class SquadMessageResponse(BaseModel):
    id: str
    sender_name: str
    sender_avatar: Optional[str] = None
    sender_college: str
    text: str
    timestamp: str
    reactions: List[Dict[str, Any]] = []

class StudyGroupResponse(BaseModel):
    id: str
    name: str
    tag: str
    slogan: str
    member_count: int
    max_members: int
    active_now_count: int
    goal: Dict[str, Any]
    squad_streak: int
    members: List[SquadMemberResponse] = []
    messages: List[SquadMessageResponse] = []

class SendMessageRequest(BaseModel):
    text: str

# Opportunity Schemas
class OpportunityResponse(BaseModel):
    id: str
    title: str
    company: str
    logo: str
    location: str
    work_type: str
    type: str
    stipend_or_prize: str
    deadline: str
    days_left: int
    skill_tags: List[str] = []
    match_score: int
    description: str
    eligibility: Optional[str] = None
    url: Optional[str] = None
    saved: bool = False
    applied: bool = False

# AI Mentor & Gemini Schemas
class AiChatRequest(BaseModel):
    message: str
    lesson_context: Optional[str] = None
    code_snippet: Optional[str] = None

class AiChatResponse(BaseModel):
    reply: str
    role_persona: str
    suggested_followups: List[str] = []
    timestamp: str
    is_live_gemini: bool = False

class AiExplainRequest(BaseModel):
    query: str
    language: Optional[str] = "javascript"

class AiExplainResponse(BaseModel):
    title: str
    explanation: str
    analogy: str
    common_pitfall: str
    key_takeaways: List[str] = []
    role_persona: str

class AiFlashcardGenRequest(BaseModel):
    topic: str
    count: Optional[int] = 3

class AiStatusResponse(BaseModel):
    gemini_configured: bool
    provider: str
    active_personas: List[str] = []
    status: str

# Sandbox Execution & Evaluation Schemas
class SandboxRunRequest(BaseModel):
    code: str
    language: Optional[str] = "python"  # "python" or "javascript"
    stdin: Optional[str] = ""

class SandboxRunResponse(BaseModel):
    stdout: str
    stderr: str
    success: bool
    exit_code: int
    execution_time_ms: float
    language: str

class TestCaseResult(BaseModel):
    test_name: str
    input_data: str
    expected_output: str
    actual_output: str
    passed: bool
    execution_time_ms: float
    error_message: Optional[str] = None

class ChallengeEvaluateRequest(BaseModel):
    code: str
    language: Optional[str] = "python"

class ChallengeEvaluateResponse(BaseModel):
    passed: bool
    score: int
    total_tests: int
    passed_tests: int
    test_results: List[TestCaseResult]
    stdout: str
    stderr: str
    execution_time_ms: float
    xp_awarded: int
    badge_unlocked: Optional[str] = None
    ai_feedback: Optional[str] = None
    total_xp: int

# AI Mock Interview Schemas
class InterviewStartRequest(BaseModel):
    company: Optional[str] = "Razorpay"
    role: Optional[str] = "Web Developer"

class InterviewStartResponse(BaseModel):
    interview_id: str
    company: str
    role: str
    interviewer_persona: str
    round_number: int
    total_rounds: int
    question: str
    context_hint: str
    timestamp: str

class InterviewRespondRequest(BaseModel):
    interview_id: str
    company: str
    role: str
    question: str
    answer: str
    round_number: int

class InterviewRespondResponse(BaseModel):
    score: int  # 1 - 10
    feedback: str
    key_strengths: List[str] = []
    improvements: List[str] = []
    is_completed: bool
    next_question: Optional[str] = None
    next_round: Optional[int] = None
    verdict: Optional[str] = None
    xp_awarded: int = 0
    total_xp: int


# User Progress & Analytics Schemas
class DailyActivityStat(BaseModel):
    date: str
    day_name: str
    minutes_spent: int
    xp_earned: int
    missions_completed: int
    is_target_met: bool

class SkillMasteryStat(BaseModel):
    category: str
    score: int  # 0 - 100
    level_label: str
    description: str

class WeeklyAnalytics(BaseModel):
    week_start: str
    week_end: str
    total_minutes: int
    total_xp: int
    active_days: int
    avg_minutes_per_day: float
    streak_days: int
    daily_breakdown: List[DailyActivityStat]

class MonthlyAnalytics(BaseModel):
    month_name: str
    year: int
    total_hours: float
    total_xp: int
    completion_rate_percent: int
    heatmap: List[Dict[str, Any]]  # [{date: 'YYYY-MM-DD', count: 1-4, xp: int, minutes: int}]
    skills_mastery: List[SkillMasteryStat]

class AICoachReviewRequest(BaseModel):
    focus_topic: Optional[str] = None

class AICoachReviewResponse(BaseModel):
    summary: str
    strengths: List[str]
    growth_areas: List[str]
    recommended_focus_this_week: List[str]
    projected_readiness: str
    mentor_quote: str




import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.learning import LearningPath, Level, Concept
from app.models.progress import UserProgress
from app.models.mission import Mission, MissionTask

PATH_DEFAULT_MISSIONS = {
    "path_web_dev": {
        "title": "The Website That Couldn't Talk",
        "subtitle": "Track packets from the browser address bar to server return",
        "duration_minutes": 30,
        "category": "main",
        "xp_reward": 60,
        "skills": ["HTTP", "DNS", "REST APIs", "Network Debugging"],
        "tasks": [
            {"text": "Enter the story & diagnose the blank page", "type": "story", "xp": 15},
            {"text": "Understand HTTP & DNS resolution flow", "type": "concept", "xp": 15},
            {"text": "Complete the mini challenge (Idempotency Key)", "type": "challenge", "xp": 15},
            {"text": "Explain what you learned & inspect practice code", "type": "reflect", "xp": 15}
        ]
    },
    "path_data_science": {
        "title": "The Dataset That Lied",
        "subtitle": "Clean messy CSVs, handle null values, and spot hidden outliers",
        "duration_minutes": 30,
        "category": "main",
        "xp_reward": 60,
        "skills": ["Pandas", "Data Cleaning", "Statistics", "Outlier Detection"],
        "tasks": [
            {"text": "Inspect the corrupted CSV and find null values", "type": "story", "xp": 15},
            {"text": "Calculate IQR bounds and filter extreme anomalies", "type": "concept", "xp": 15},
            {"text": "Execute DataFrame imputation with Pandas", "type": "challenge", "xp": 15},
            {"text": "Verify clean dataset summary statistics", "type": "reflect", "xp": 15}
        ]
    },
    "path_cybersecurity": {
        "title": "The Login That Shouldn't Exist",
        "subtitle": "Trace an SQL injection backdoor and secure authentication tokens",
        "duration_minutes": 35,
        "category": "main",
        "xp_reward": 65,
        "skills": ["SQL Injection", "OWASP Top 10", "Network Security", "Sanitization"],
        "tasks": [
            {"text": "Analyze the suspicious login payload in HTTP traffic", "type": "story", "xp": 15},
            {"text": "Understand why string concatenation breaks SQL queries", "type": "concept", "xp": 15},
            {"text": "Rewrite query with parameterized prepared statements", "type": "challenge", "xp": 20},
            {"text": "Run automated penetration test to verify fix", "type": "reflect", "xp": 15}
        ]
    },
    "path_ai_ml": {
        "title": "The Hallucinating Classifier",
        "subtitle": "Diagnose vanishing gradients and build your first neural network tensor",
        "duration_minutes": 35,
        "category": "main",
        "xp_reward": 65,
        "skills": ["Neural Networks", "Tensors", "Gradient Descent", "PyTorch"],
        "tasks": [
            {"text": "Step into the prediction loop and diagnose 0% accuracy", "type": "story", "xp": 15},
            {"text": "Understand backpropagation and activation functions", "type": "concept", "xp": 15},
            {"text": "Implement ReLU activation to fix vanishing gradients", "type": "challenge", "xp": 20},
            {"text": "Train model for 10 epochs and inspect loss curve", "type": "reflect", "xp": 15}
        ]
    },
    "path_full_stack": {
        "title": "The Broken Microservice Bridge",
        "subtitle": "Connect React state to backend API with JWT authentication",
        "duration_minutes": 30,
        "category": "main",
        "xp_reward": 60,
        "skills": ["Full Stack", "React", "REST APIs", "PostgreSQL", "JWT"],
        "tasks": [
            {"text": "Diagnose CORS and authentication header failures", "type": "story", "xp": 15},
            {"text": "Map database model relations to API endpoints", "type": "concept", "xp": 15},
            {"text": "Build secure JWT token bearer verification", "type": "challenge", "xp": 15},
            {"text": "Render synchronized state across client and database", "type": "reflect", "xp": 15}
        ]
    },
    "path_sde": {
        "title": "The O(N^2) Bottleneck",
        "subtitle": "Optimize search from quadratic brute-force to logarithmic binary search",
        "duration_minutes": 30,
        "category": "main",
        "xp_reward": 60,
        "skills": ["Algorithms", "Time Complexity", "Binary Search", "Arrays"],
        "tasks": [
            {"text": "Identify quadratic timeout in 100,000 element search", "type": "story", "xp": 15},
            {"text": "Understand logarithmic divide-and-conquer bounds", "type": "concept", "xp": 15},
            {"text": "Implement optimal two-pointer binary search", "type": "challenge", "xp": 15},
            {"text": "Verify zero test-suite timeouts and O(log N) scaling", "type": "reflect", "xp": 15}
        ]
    },
    "path_app_dev": {
        "title": "The 60 FPS Jitter",
        "subtitle": "Fix mobile re-rendering lag and implement responsive gesture navigation",
        "duration_minutes": 30,
        "category": "main",
        "xp_reward": 60,
        "skills": ["React Native", "Mobile UI", "Performance", "State"],
        "tasks": [
            {"text": "Trace frame rate drop in mobile list rendering", "type": "story", "xp": 15},
            {"text": "Understand memory allocation in mobile virtualization", "type": "concept", "xp": 15},
            {"text": "Implement memoization and keyExtractor optimization", "type": "challenge", "xp": 15},
            {"text": "Achieve silky-smooth 60 FPS scroll performance", "type": "reflect", "xp": 15}
        ]
    },
    "path_product_design": {
        "title": "The Drop-off Crisis",
        "subtitle": "Redesign onboarding friction, improve visual hierarchy, and map user flow",
        "duration_minutes": 25,
        "category": "main",
        "xp_reward": 50,
        "skills": ["UX Design", "Figma", "Design Systems", "User Psychology"],
        "tasks": [
            {"text": "Analyze funnel drop-off analytics at step 2", "type": "story", "xp": 15},
            {"text": "Apply progressive disclosure & Hick's Law principles", "type": "concept", "xp": 15},
            {"text": "Design high-converting 3-step onboarding bento", "type": "challenge", "xp": 10},
            {"text": "Audit contrast ratios against WCAG AAA standards", "type": "reflect", "xp": 10}
        ]
    },
    "path_gate_cse": {
        "title": "Four Processes, One Deadlock",
        "subtitle": "Analyze Resource Allocation Graphs and execute Banker's Algorithm",
        "duration_minutes": 45,
        "category": "main",
        "xp_reward": 90,
        "skills": ["Operating Systems", "Deadlocks", "Banker's Algorithm", "GATE PYQs"],
        "tasks": [
            {"text": "Enter the kernel story & diagnose the frozen server", "type": "story", "xp": 20},
            {"text": "Master the 4 Coffman Conditions & RAG cycles", "type": "concept", "xp": 20},
            {"text": "Solve the 12-drive Banker's Algorithm safe sequence", "type": "challenge", "xp": 25},
            {"text": "Complete 5 GATE CSE past-year PYQ practice drills", "type": "practice", "xp": 25}
        ]
    }
}

ROLE_TO_PATH_MAP = {
    "Web Developer": "path_web_dev",
    "Full Stack Developer": "path_full_stack",
    "Software Developer": "path_sde",
    "Data Scientist": "path_data_science",
    "AI / ML": "path_ai_ml",
    "AI / ML Specialist": "path_ai_ml",
    "Cybersecurity": "path_cybersecurity",
    "Cybersecurity Analyst": "path_cybersecurity",
    "App Developer": "path_app_dev",
    "Product Designer": "path_product_design",
    "GATE_CSE": "path_gate_cse",
    "GATE_DA": "path_gate_cse"
}

def resolve_path_id(role_or_path: str) -> str:
    if not role_or_path:
        return "path_web_dev"
    if role_or_path in PATH_DEFAULT_MISSIONS:
        return role_or_path
    return ROLE_TO_PATH_MAP.get(role_or_path, "path_web_dev")

def initialize_user_path_progress(db: Session, user_id: str, path_id: str):
    """
    Ensures the user has UserProgress entries for all levels of path_id,
    with Level 1 in_progress and subsequent levels locked.
    """
    levels = db.query(Level).filter(Level.learning_path_id == path_id).order_by(Level.level_number).all()
    if not levels:
        return

    now = datetime.now(timezone.utc)
    for idx, lvl in enumerate(levels):
        existing_prog = db.query(UserProgress).filter(
            UserProgress.user_id == user_id,
            UserProgress.level_id == lvl.id
        ).first()

        if not existing_prog:
            prog_status = "in_progress" if idx == 0 else "locked"
            db.add(UserProgress(
                user_id=user_id,
                level_id=lvl.id,
                status=prog_status,
                progress_percentage=0,
                xp=0,
                started_at=now if idx == 0 else None
            ))

    db.flush()

def ensure_user_mission(db: Session, user_id: str, path_id: str) -> Mission:
    """
    Ensures that the user has a valid daily mission for their selected path.
    If no mission exists for this user and path, creates one with tasks.
    """
    # Check if a mission for this user and path's level exists
    path_levels = db.query(Level).filter(Level.learning_path_id == path_id).order_by(Level.level_number).all()
    level_ids = [l.id for l in path_levels]
    first_level_id = level_ids[0] if level_ids else None

    existing_mission = db.query(Mission).filter(
        Mission.user_id == user_id,
        Mission.level_id.in_(level_ids)
    ).first()

    if existing_mission:
        return existing_mission

    # Create new path-specific mission
    config = PATH_DEFAULT_MISSIONS.get(path_id, PATH_DEFAULT_MISSIONS["path_web_dev"])
    mission_id = f"mission_{user_id[:8]}_{path_id[:10]}_{int(datetime.now(timezone.utc).timestamp())}"
    
    new_mission = Mission(
        id=mission_id,
        user_id=user_id,
        level_id=first_level_id,
        title=config["title"],
        subtitle=config["subtitle"],
        duration_minutes=config["duration_minutes"],
        duration_category=f"{config['duration_minutes']}m",
        category=config["category"],
        xp_reward=config["xp_reward"],
        status="in_progress",
        completed=False,
        skills=config["skills"]
    )
    db.add(new_mission)
    db.flush()

    for idx, t in enumerate(config["tasks"]):
        task_id = f"task_{mission_id}_{idx+1}"
        db.add(MissionTask(
            id=task_id,
            mission_id=new_mission.id,
            text=t["text"],
            type=t["type"],
            xp=t["xp"],
            completed=False
        ))

    db.commit()
    db.refresh(new_mission)
    return new_mission

# -*- coding: utf-8 -*-
import os
import sys
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, SessionLocal, Base
import app.models
from app.models.user import User, UserPreferences, Company, UserCompany
from app.models.profile import UserLearningProfile
from app.models.exam import Exam, ExamSubject
from app.models.learning import LearningPath, Level, Concept, Lesson, LessonStep
from app.models.mission import Mission, MissionTask
from app.models.progress import UserProgress, ConceptMastery, Question
from app.models.flashcard import Flashcard
from app.models.note import Note
from app.models.challenge import Challenge, ChallengeSubmission
from app.models.feed import Post
from app.models.group import StudyGroup, GroupMember, GroupMessage
from app.models.opportunity import Opportunity
from app.utils.auth_utils import get_password_hash

def seed_database(drop_existing: bool = False):
    print("[*] Initializing tables...")
    if drop_existing:
        Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    now = datetime.now(timezone.utc)

    # -------------------------------------------------------------
    # 1. SEED DEMO USERS
    # -------------------------------------------------------------
    print("[*] Creating 4 Demo Users (Aarav, Meera, Kabir, Ananya)...")
    
    # 1A. Aarav — Web Developer
    aarav = User(
        id="usr_aarav_01",
        name="Aarav",
        email="aarav@sutra.demo",
        password_hash=get_password_hash("sutra123"),
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        college="VNR Vignana Jyothi Institute of Engineering and Tech",
        tier="Tier-2 College",
        year="3rd Year B.Tech CSE",
        total_xp=420,
        streak_days=7,
        is_demo=True,
        onboarding_completed=True
    )
    db.add(aarav)
    db.flush()

    aarav_profile = UserLearningProfile(
        user_id=aarav.id,
        track_type="career",
        career_path="Web Developer",
        learning_path_id="path_web_dev",
        target_companies=["Google", "Microsoft", "Amazon", "Razorpay"],
        daily_minutes=30,
        learning_preferences=["Stories", "Hands-on", "Challenges"],
        learning_dna={"handsOn": 45, "stories": 30, "challenges": 25, "visualExploration": 20},
        onboarding_completed=True
    )
    db.add(aarav_profile)

    aarav_pref = UserPreferences(
        user_id=aarav.id,
        learning_path_id="path_web_dev",
        current_role="Web Developer",
        daily_minutes=30,
        learning_preferences=["Stories", "Hands-on", "Challenges"],
        learning_dna={"handsOn": 45, "stories": 30, "challenges": 25, "visualExploration": 20}
    )
    db.add(aarav_pref)

    # 1B. Meera — Data Scientist
    meera = User(
        id="usr_meera_02",
        name="Meera",
        email="meera@sutra.demo",
        password_hash=get_password_hash("sutra123"),
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        college="IIIT Hyderabad",
        tier="Tier-1 College",
        year="4th Year B.Tech DS/AI",
        total_xp=480,
        streak_days=10,
        is_demo=True,
        onboarding_completed=True
    )
    db.add(meera)
    db.flush()

    meera_profile = UserLearningProfile(
        user_id=meera.id,
        track_type="career",
        career_path="Data Scientist",
        learning_path_id="path_data_science",
        target_companies=["Amazon", "Google", "Flipkart", "Swiggy"],
        daily_minutes=45,
        learning_preferences=["Stories", "Hands-on", "Challenges"],
        learning_dna={"handsOn": 40, "stories": 35, "challenges": 25, "visualExploration": 15},
        onboarding_completed=True
    )
    db.add(meera_profile)

    meera_pref = UserPreferences(
        user_id=meera.id,
        learning_path_id="path_data_science",
        current_role="Data Scientist",
        daily_minutes=45,
        learning_preferences=["Stories", "Hands-on", "Challenges"],
        learning_dna={"handsOn": 40, "stories": 35, "challenges": 25, "visualExploration": 15}
    )
    db.add(meera_pref)

    # 1C. Kabir — Cybersecurity Analyst
    kabir = User(
        id="usr_kabir_03",
        name="Kabir",
        email="kabir@sutra.demo",
        password_hash=get_password_hash("sutra123"),
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
        college="DTU Delhi",
        tier="Tier-1 College",
        year="3rd Year B.Tech IT",
        total_xp=390,
        streak_days=5,
        is_demo=True,
        onboarding_completed=True
    )
    db.add(kabir)
    db.flush()

    kabir_profile = UserLearningProfile(
        user_id=kabir.id,
        track_type="career",
        career_path="Cybersecurity",
        learning_path_id="path_cybersecurity",
        target_companies=["CrowdStrike", "Palo Alto Networks", "Razorpay", "Microsoft"],
        daily_minutes=40,
        learning_preferences=["Stories", "Hands-on", "Challenges"],
        learning_dna={"handsOn": 50, "stories": 30, "challenges": 20, "visualExploration": 10},
        onboarding_completed=True
    )
    db.add(kabir_profile)

    kabir_pref = UserPreferences(
        user_id=kabir.id,
        learning_path_id="path_cybersecurity",
        current_role="Cybersecurity Specialist",
        daily_minutes=40,
        learning_preferences=["Stories", "Hands-on", "Challenges"],
        learning_dna={"handsOn": 50, "stories": 30, "challenges": 20, "visualExploration": 10}
    )
    db.add(kabir_pref)

    # 1D. Ananya — GATE CSE Aspirant
    ananya = User(
        id="usr_ananya_04",
        name="Ananya",
        email="ananya@sutra.demo",
        password_hash=get_password_hash("sutra123"),
        avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
        college="National Institute of Technology (NIT) Warangal",
        tier="Tier-1 College",
        year="3rd Year B.Tech CSE",
        total_xp=520,
        streak_days=14,
        is_demo=True,
        onboarding_completed=True
    )
    db.add(ananya)
    db.flush()

    ananya_profile = UserLearningProfile(
        user_id=ananya.id,
        track_type="exam",
        exam_type="GATE_CSE",
        target_year="2028",
        goals=["IIT / IISc", "M.Tech"],
        preparation_level="Just Starting",
        daily_minutes=120,
        subjects=["Programming & Data Structures", "Algorithms", "Operating Systems", "DBMS", "Computer Networks"],
        learning_preferences=["Stories", "Hands-on", "Challenges"],
        learning_dna={"handsOn": 30, "stories": 35, "challenges": 25, "visualExploration": 10},
        target_companies=[],  # STRICTLY NO COMPANIES FOR EXAM TRACK!
        onboarding_completed=True
    )
    db.add(ananya_profile)

    ananya_pref = UserPreferences(
        user_id=ananya.id,
        learning_path_id="path_gate_cse",
        current_role="GATE CSE Aspirant",
        daily_minutes=120,
        learning_preferences=["Stories", "Hands-on", "Challenges"],
        learning_dna={"handsOn": 30, "stories": 35, "challenges": 25, "visualExploration": 10}
    )
    db.add(ananya_pref)

    # -------------------------------------------------------------
    # 2. SEED COMPANIES
    # -------------------------------------------------------------
    print("[*] Seeding companies...")
    companies_data = [
        {"id": "comp_google", "name": "Google", "logo_url": "🔍", "type": "Global Tech", "description": "Search, Cloud & AI Systems"},
        {"id": "comp_microsoft", "name": "Microsoft", "logo_url": "🪟", "type": "Cloud & OS", "description": "Enterprise software & Azure cloud"},
        {"id": "comp_amazon", "name": "Amazon", "logo_url": "📦", "type": "Distributed Scale", "description": "E-commerce & AWS distributed systems"},
        {"id": "comp_razorpay", "name": "Razorpay", "logo_url": "💳", "type": "Fintech Titan", "description": "India's payment gateway & banking infra"},
        {"id": "comp_zoho", "name": "Zoho", "logo_url": "💼", "type": "Bootstrapped SaaS", "description": "Full-stack enterprise productivity tools"},
        {"id": "comp_atlassian", "name": "Atlassian", "logo_url": "🔷", "type": "Dev Tools", "description": "Jira, Confluence & collaborative git"},
        {"id": "comp_adobe", "name": "Adobe", "logo_url": "🎨", "type": "Creative Tech", "description": "Digital media & rendering engines"},
        {"id": "comp_swiggy", "name": "Swiggy", "logo_url": "🛵", "type": "Hyperlocal Logistics", "description": "Real-time routing & geo-tracking"}
    ]
    for c in companies_data:
        db.add(Company(**c))
    db.flush()

    for comp_id in ["comp_google", "comp_microsoft", "comp_amazon", "comp_razorpay"]:
        db.add(UserCompany(user_id=aarav.id, company_id=comp_id))

    # -------------------------------------------------------------
    # 3. SEED EXAM CATALOGS & SUBJECTS
    # -------------------------------------------------------------
    print("[*] Seeding Exam Catalogs & Subjects...")
    gate_cse = Exam(
        id="GATE_CSE",
        title="GATE Computer Science & Information Technology",
        slug="gate-cse",
        description="Comprehensive syllabus mastery for IIT/IISc M.Tech & PSU admissions through intuitive situations and conceptual depth.",
        icon="📚",
        color_accent="#244B3A",
        target_years=["2027", "2028", "2029", "Later", "Not decided"],
        total_subjects=12
    )
    db.add(gate_cse)
    db.flush()

    gate_cse_subjects = [
        {"id": "subj_pds", "exam_id": gate_cse.id, "name": "Programming & Data Structures", "code": "CS-01", "icon": "💻", "weightage_percent": 12, "total_topics": 18, "topics": ["Arrays & Pointers", "Stacks & Queues", "Binary Trees & BST", "Heaps", "Graphs", "Hashing"]},
        {"id": "subj_algo", "exam_id": gate_cse.id, "name": "Algorithms", "code": "CS-02", "icon": "⚡", "weightage_percent": 10, "total_topics": 15, "topics": ["Asymptotic Analysis", "Recurrence Relations", "Divide & Conquer", "Greedy Techniques", "Dynamic Programming", "Graph Traversals & MST"]},
        {"id": "subj_os", "exam_id": gate_cse.id, "name": "Operating Systems", "code": "CS-03", "icon": "🖥️", "weightage_percent": 10, "total_topics": 16, "topics": ["Processes & Threads", "CPU Scheduling", "Synchronization & Semaphores", "Deadlocks", "Memory Management & Paging", "Virtual Memory", "File Systems"]},
        {"id": "subj_dbms", "exam_id": gate_cse.id, "name": "DBMS", "code": "CS-04", "icon": "🗄️", "weightage_percent": 9, "total_topics": 14, "topics": ["ER Models", "Relational Algebra", "SQL Queries", "Functional Dependencies & Normalization", "Transactions & ACID", "Concurrency & Serializability", "B/B+ Tree Indexing"]},
        {"id": "subj_cn", "exam_id": gate_cse.id, "name": "Computer Networks", "code": "CS-05", "icon": "🌐", "weightage_percent": 9, "total_topics": 15, "topics": ["OSI & TCP/IP Stack", "Framing & Error Control", "Sliding Window Protocols", "IP Addressing & Subnetting", "Routing Algorithms", "TCP/UDP & Congestion Control", "Network Security"]},
        {"id": "subj_coa", "exam_id": gate_cse.id, "name": "Computer Organization & Architecture", "code": "CS-06", "icon": "⚙️", "weightage_percent": 9, "total_topics": 14, "topics": ["Machine Instructions", "Addressing Modes", "ALU & Data Path", "Instruction Pipelining & Hazards", "Memory Hierarchy & Cache Mapping"]},
        {"id": "subj_dm", "exam_id": gate_cse.id, "name": "Discrete Mathematics", "code": "CS-07", "icon": "📐", "weightage_percent": 10, "total_topics": 12, "topics": ["Propositional & First-Order Logic", "Sets, Relations & Functions", "Partial Orders & Lattices", "Combinatorics", "Graph Theory"]},
        {"id": "subj_toc", "exam_id": gate_cse.id, "name": "Theory of Computation", "code": "CS-08", "icon": "🤖", "weightage_percent": 8, "total_topics": 12, "topics": ["Regular Languages & DFA/NFA", "Context-Free Grammars & PDA", "Turing Machines", "Decidability & Halting Problem"]},
        {"id": "subj_cd", "exam_id": gate_cse.id, "name": "Compiler Design", "code": "CS-09", "icon": "🧩", "weightage_percent": 4, "total_topics": 10, "topics": ["Lexical Analysis", "Parsing & LL/LR Grammars", "Syntax Directed Translation", "Intermediate Code Generation"]},
        {"id": "subj_dl", "exam_id": gate_cse.id, "name": "Digital Logic", "code": "CS-10", "icon": "💡", "weightage_percent": 5, "total_topics": 10, "topics": ["Boolean Algebra", "Combinational Circuits", "Sequential Circuits & Flip Flops"]},
        {"id": "subj_em", "exam_id": gate_cse.id, "name": "Engineering Mathematics", "code": "CS-11", "icon": "🔢", "weightage_percent": 8, "total_topics": 12, "topics": ["Linear Algebra", "Calculus", "Probability Distributions"]},
        {"id": "subj_ga", "exam_id": gate_cse.id, "name": "General Aptitude", "code": "CS-12", "icon": "🎯", "weightage_percent": 15, "total_topics": 10, "topics": ["Verbal Aptitude", "Quantitative Aptitude", "Analytical Aptitude", "Spatial Aptitude"]}
    ]
    for subj in gate_cse_subjects:
        db.add(ExamSubject(**subj))

    gate_da = Exam(
        id="GATE_DA",
        title="GATE Data Science & Artificial Intelligence",
        slug="gate-da",
        description="Core mathematical and algorithmic foundation for Data Science & AI research.",
        icon="🧠",
        color_accent="#E9785A",
        target_years=["2027", "2028", "2029", "Later", "Not decided"],
        total_subjects=8
    )
    db.add(gate_da)
    db.flush()

    gate_da_subjects = [
        {"id": "subj_da_prob", "exam_id": gate_da.id, "name": "Probability & Statistics", "code": "DA-01", "icon": "📊", "weightage_percent": 15, "total_topics": 12, "topics": ["Random Variables", "Bayes Theorem", "Expectation & Variance", "Distributions", "Hypothesis Testing"]},
        {"id": "subj_da_la", "exam_id": gate_da.id, "name": "Linear Algebra", "code": "DA-02", "icon": "📐", "weightage_percent": 12, "total_topics": 10, "topics": ["Vector Spaces", "Matrices & Determinants", "Eigenvalues & Eigenvectors", "SVD & PCA"]},
        {"id": "subj_da_calc", "exam_id": gate_da.id, "name": "Calculus & Optimization", "code": "DA-03", "icon": "📈", "weightage_percent": 10, "total_topics": 10, "topics": ["Gradients", "Hessians", "Convex Optimization", "Gradient Descent"]},
        {"id": "subj_da_prog", "exam_id": gate_da.id, "name": "Programming, Data Structures & Algorithms", "code": "DA-04", "icon": "💻", "weightage_percent": 15, "total_topics": 14, "topics": ["Python Data Science", "Trees, Graphs & Search", "Dynamic Programming"]},
        {"id": "subj_da_dbms", "exam_id": gate_da.id, "name": "Database Management & Warehousing", "code": "DA-05", "icon": "🗄️", "weightage_percent": 10, "total_topics": 10, "topics": ["ER Models", "SQL & Query Optimization", "Data Warehousing & Schema"]},
        {"id": "subj_da_ml", "exam_id": gate_da.id, "name": "Machine Learning", "code": "DA-06", "icon": "🤖", "weightage_percent": 15, "total_topics": 15, "topics": ["Supervised Learning", "Unsupervised Clustering", "Neural Networks", "Cross Validation"]},
        {"id": "subj_da_ai", "exam_id": gate_da.id, "name": "Artificial Intelligence", "code": "DA-07", "icon": "🧠", "weightage_percent": 10, "total_topics": 10, "topics": ["Informed & Uninformed Search", "Adversarial Search (Minimax)", "Constraint Satisfaction"]},
        {"id": "subj_da_ga", "exam_id": gate_da.id, "name": "General Aptitude", "code": "DA-08", "icon": "🎯", "weightage_percent": 13, "total_topics": 10, "topics": ["Verbal & Quantitative Aptitude"]}
    ]
    for subj in gate_da_subjects:
        db.add(ExamSubject(**subj))

    # -------------------------------------------------------------
    # 4. SEED LEARNING PATHS (ALL 9 DOMAINS)
    # -------------------------------------------------------------
    print("[*] Seeding learning paths...")
    paths_data = [
        {"id": "path_web_dev", "name": "Web Developer", "slug": "web-developer", "description": "Master how the modern web breathes: from semantic markup to interactive state machines and blazing client performance.", "icon": "🌐", "role_tag": "Frontend & Web Architecture", "color_accent": "#244B3A", "total_levels": 7, "estimated_weeks": 6},
        {"id": "path_data_science", "name": "Data Scientist", "slug": "data-scientist", "description": "Transform messy data into statistical models and actionable business intelligence.", "icon": "📊", "role_tag": "Data & Modeling", "color_accent": "#244B3A", "total_levels": 7, "estimated_weeks": 7},
        {"id": "path_ai_ml", "name": "AI / ML", "slug": "ai-ml", "description": "Transform raw numbers into prediction superpowers, embeddings, and intelligent agent workflows.", "icon": "🧠", "role_tag": "Machine Learning & Neural Nets", "color_accent": "#E9785A", "total_levels": 8, "estimated_weeks": 8},
        {"id": "path_cybersecurity", "name": "Cybersecurity", "slug": "cybersecurity", "description": "Threat defense, network vulnerabilities, cryptography & ethical penetration testing.", "icon": "🛡️", "role_tag": "High Stakes Defense", "color_accent": "#171717", "total_levels": 6, "estimated_weeks": 6},
        {"id": "path_sde", "name": "Software Developer", "slug": "software-developer", "description": "DSA mastery, clean system architecture, algorithms & LeetCode intuition.", "icon": "💻", "role_tag": "Core Foundations", "color_accent": "#6F8F72", "total_levels": 8, "estimated_weeks": 8},
        {"id": "path_full_stack", "name": "Full Stack Developer", "slug": "full-stack-developer", "description": "End-to-end applications: React, Node.js, Postgres & Edge Deployments.", "icon": "⚡", "role_tag": "Frontend + Backend + DB", "color_accent": "#E4A93A", "total_levels": 10, "estimated_weeks": 10},
        {"id": "path_app_dev", "name": "App Developer", "slug": "app-developer", "description": "Cross-platform mobile apps with React Native & Flutter.", "icon": "📱", "role_tag": "Mobile First", "color_accent": "#E4A93A", "total_levels": 6, "estimated_weeks": 6},
        {"id": "path_product_design", "name": "Product Designer", "slug": "product-designer", "description": "Design systems, visual psychology, interaction design & Figma.", "icon": "🎨", "role_tag": "Creative UI", "color_accent": "#F2C6A8", "total_levels": 5, "estimated_weeks": 5},
        {"id": "path_gate_cse", "name": "GATE CSE Journey", "slug": "gate-cse-journey", "description": "Master core computer science principles through situational engineering puzzles and GATE PYQs.", "icon": "📚", "role_tag": "IIT / IISc & PSU Prep", "color_accent": "#244B3A", "total_levels": 10, "estimated_weeks": 24}
    ]
    for p in paths_data:
        db.add(LearningPath(**p))
    db.flush()

    # -------------------------------------------------------------
    # 5. SEED LEVELS FOR ALL 9 DOMAINS
    # -------------------------------------------------------------
    print("[*] Seeding levels across all 9 paths...")
    
    # 1. Web Developer Levels
    web_levels = [
        {"id": "lvl_01", "learning_path_id": "path_web_dev", "level_number": 1, "title": "The Web Awakens", "subtitle": "HTML, DOM Tree & Browser Rendering Engine", "description": "Understand what happens when a user enters a URL.", "estimated_minutes": 45, "status": "in_progress", "is_locked": False, "xp_reward": 100, "story_snippet": "You step into a basement office where the founder has a great idea, but zero HTML tags on screen.", "tags": ["DOM", "Semantic HTML", "DNS"]},
        {"id": "lvl_02", "learning_path_id": "path_web_dev", "level_number": 2, "title": "Build Your First Page", "subtitle": "Box Model, Flexbox & CSS Magic", "description": "Master component layout and spacing with 1D CSS Flexbox.", "estimated_minutes": 60, "status": "locked", "is_locked": True, "xp_reward": 120, "story_snippet": "Everything was overlapping like a collapsed building until you cracked the flex direction secrets.", "tags": ["Box Model", "Flexbox", "Centering"]},
        {"id": "lvl_03", "learning_path_id": "path_web_dev", "level_number": 3, "title": "Make It Beautiful", "subtitle": "CSS Grid, Responsive Breakpoints & Design Tokens", "description": "Design responsive bento grids and fluid typography.", "estimated_minutes": 50, "status": "locked", "is_locked": True, "xp_reward": 150, "story_snippet": "A user opened the website on a flip phone and a 4K ultrawide monitor simultaneously.", "tags": ["CSS Grid", "Media Queries", "Typography"]},
        {"id": "lvl_04", "learning_path_id": "path_web_dev", "level_number": 4, "title": "Make It Think", "subtitle": "JavaScript DOM, Event Loop & State", "description": "Single threaded event loops, closures, and async execution.", "estimated_minutes": 70, "status": "locked", "is_locked": True, "xp_reward": 180, "story_snippet": "The click handlers are trapped in callback hell. The startup needs an event listener whisperer.", "tags": ["Event Loop", "Closures", "Async/Await"]},
        {"id": "lvl_05", "learning_path_id": "path_web_dev", "level_number": 5, "title": "Make It Talk", "subtitle": "HTTP, REST APIs & Asynchronous Data", "description": "Discover what happens between typing a URL and seeing a webpage.", "estimated_minutes": 60, "status": "locked", "is_locked": True, "xp_reward": 200, "story_snippet": "Nobody knows what happens after a user types a URL. You are sent to uncover the secret route.", "tags": ["HTTP Requests", "REST APIs", "JSON Fetch"]},
        {"id": "lvl_06", "learning_path_id": "path_web_dev", "level_number": 6, "title": "Remember Everything", "subtitle": "Local Storage, Cookies, IndexedDB & State Management", "description": "Persist state across page refreshes and offline sessions.", "estimated_minutes": 65, "status": "locked", "is_locked": True, "xp_reward": 220, "story_snippet": "Every page refresh wipes the user's cart to zero. Teach the web application how to remember.", "tags": ["LocalStorage", "State Sync", "Cache"]},
        {"id": "lvl_07", "learning_path_id": "path_web_dev", "level_number": 7, "title": "Ship It", "subtitle": "Build Bundles, Web Vitals, CDN & Edge Deployment", "description": "Bundle optimization, CDN edge caching, and 100% Lighthouse score.", "estimated_minutes": 90, "status": "locked", "is_locked": True, "xp_reward": 300, "story_snippet": "The viral tweet is scheduled for midnight. Deploy a production build that handles 10,000 requests.", "tags": ["Vite Bundler", "Vercel / Netlify", "Lighthouse 100"]}
    ]
    for lvl in web_levels:
        db.add(Level(**lvl))

    # 2. Data Scientist Levels
    ds_levels = [
        {"id": "lvl_ds_01", "learning_path_id": "path_data_science", "level_number": 1, "title": "The Data Awakening", "subtitle": "Python, Pandas & Data Wrangling", "description": "Handle messy CSVs, impute missing values, and inspect dataframes.", "estimated_minutes": 45, "status": "in_progress", "is_locked": False, "xp_reward": 100, "story_snippet": "A million rows of customer records arrived with corrupt formats and null values.", "tags": ["Pandas", "Data Cleaning", "NumPy"]},
        {"id": "lvl_ds_02", "learning_path_id": "path_data_science", "level_number": 2, "title": "Visual Storytelling", "subtitle": "EDA, Matplotlib & Seaborn Distributions", "description": "Plot histograms, scatter correlations, and spot hidden outliers.", "estimated_minutes": 55, "status": "locked", "is_locked": True, "xp_reward": 120, "story_snippet": "The executive team wants to know why churn spiked last month in one visual chart.", "tags": ["EDA", "Data Viz", "Outlier Detection"]},
        {"id": "lvl_ds_03", "learning_path_id": "path_data_science", "level_number": 3, "title": "The Statistical Crucible", "subtitle": "Hypothesis Testing, P-Values & Confidence Intervals", "description": "Rigorous A/B test analysis and statistical inference.", "estimated_minutes": 60, "status": "locked", "is_locked": True, "xp_reward": 150, "story_snippet": "Did the new checkout button actually increase conversions or was it random noise?", "tags": ["Hypothesis Testing", "A/B Testing", "P-Values"]},
        {"id": "lvl_ds_04", "learning_path_id": "path_data_science", "level_number": 4, "title": "Feature Engineering Forge", "subtitle": "Encoding, Scaling & Dimensionality Transformation", "description": "Transform raw signals into high-signal feature matrices.", "estimated_minutes": 65, "status": "locked", "is_locked": True, "xp_reward": 180, "story_snippet": "The model is underfitting until you synthesize interaction features and log-transform skew.", "tags": ["Feature Engineering", "Scaling", "Encoders"]},
        {"id": "lvl_ds_05", "learning_path_id": "path_data_science", "level_number": 5, "title": "Predictive Mastery", "subtitle": "Regression, Decision Trees & Ensemble Methods", "description": "Train Random Forests, XGBoost, and evaluate RMSE/F1.", "estimated_minutes": 75, "status": "locked", "is_locked": True, "xp_reward": 200, "story_snippet": "Predict flight delays with 92% precision across 50 airports.", "tags": ["XGBoost", "Random Forest", "Evaluation"]},
        {"id": "lvl_ds_06", "learning_path_id": "path_data_science", "level_number": 6, "title": "Time's Arrow", "subtitle": "Time Series Forecasting & ARIMA Models", "description": "Forecast seasonality, trends, and future demand.", "estimated_minutes": 70, "status": "locked", "is_locked": True, "xp_reward": 220, "story_snippet": "Forecast warehouse inventory requirements ahead of Diwali sales.", "tags": ["ARIMA", "Seasonality", "Forecasting"]},
        {"id": "lvl_ds_07", "learning_path_id": "path_data_science", "level_number": 7, "title": "Production Intelligence", "subtitle": "Model Deployment, ML Pipelines & Dashboards", "description": "Deploy FastAPI inference endpoints and live dashboards.", "estimated_minutes": 90, "status": "locked", "is_locked": True, "xp_reward": 300, "story_snippet": "Ship an automated batch inference engine that runs every midnight without failing.", "tags": ["MLOps", "Model Serving", "Dashboards"]}
    ]
    for lvl in ds_levels:
        db.add(Level(**lvl))

    # 3. AI / ML Levels
    aiml_levels = [
        {"id": "lvl_ai_01", "learning_path_id": "path_ai_ml", "level_number": 1, "title": "Tensor Foundations", "subtitle": "NumPy, Vectorization & Linear Algebra", "description": "Vector math, matrix multiplications, and gradient foundations.", "estimated_minutes": 45, "status": "in_progress", "is_locked": False, "xp_reward": 100, "story_snippet": "Turn 1,000,000 raw pixels into high-dimensional matrix coordinates.", "tags": ["Tensors", "NumPy", "Linear Algebra"]},
        {"id": "lvl_ai_02", "learning_path_id": "path_ai_ml", "level_number": 2, "title": "Classical Machine Learning", "subtitle": "Supervised Classifiers, Regressors & Loss Curves", "description": "Fit regression, SVMs, and understand bias-variance tradeoffs.", "estimated_minutes": 55, "status": "locked", "is_locked": True, "xp_reward": 120, "story_snippet": "Train a model to identify loan default risk with zero overfitting.", "tags": ["Supervised", "Loss Functions", "Scikit-Learn"]},
        {"id": "lvl_ai_03", "learning_path_id": "path_ai_ml", "level_number": 3, "title": "Deep Neural Networks", "subtitle": "Backpropagation, Activation Functions & PyTorch", "description": "Build multi-layer perceptrons from scratch with autograd.", "estimated_minutes": 65, "status": "locked", "is_locked": True, "xp_reward": 160, "story_snippet": "Diagnose vanishing gradients in an 8-layer deep neural network.", "tags": ["PyTorch", "Backpropagation", "ReLU"]},
        {"id": "lvl_ai_04", "learning_path_id": "path_ai_ml", "level_number": 4, "title": "Vision & Convolutions", "subtitle": "CNNs, Image Filters & Feature Maps", "description": "Build convolutional networks for real-time image recognition.", "estimated_minutes": 70, "status": "locked", "is_locked": True, "xp_reward": 180, "story_snippet": "Detect medical anomalies in X-ray scans with spatial feature filters.", "tags": ["CNN", "Computer Vision", "Kernels"]},
        {"id": "lvl_ai_05", "learning_path_id": "path_ai_ml", "level_number": 5, "title": "Sequences & Attention", "subtitle": "Transformers, Self-Attention & Embeddings", "description": "Master the math behind transformer encoders and token embeddings.", "estimated_minutes": 75, "status": "locked", "is_locked": True, "xp_reward": 200, "story_snippet": "Deconstruct why 'Attention Is All You Need' revolutionized NLP.", "tags": ["Transformers", "Attention", "Embeddings"]},
        {"id": "lvl_ai_06", "learning_path_id": "path_ai_ml", "level_number": 6, "title": "Large Language Models & RAG", "subtitle": "Retrieval Augmented Generation & Vector DBs", "description": "Build high-accuracy domain Q&A systems using vector search.", "estimated_minutes": 80, "status": "locked", "is_locked": True, "xp_reward": 220, "story_snippet": "Ground a chatbot on 10,000 legal PDF documents with zero hallucination.", "tags": ["RAG", "Vector DB", "LLM"]},
        {"id": "lvl_ai_07", "learning_path_id": "path_ai_ml", "level_number": 7, "title": "Fine-Tuning & Quantization", "subtitle": "LoRA, QLoRA & Parameter-Efficient Tuning", "description": "Fine-tune open-weights models on consumer GPU hardware.", "estimated_minutes": 85, "status": "locked", "is_locked": True, "xp_reward": 250, "story_snippet": "Adapt an 8B model to generate domain-specific SQL with 98% syntax precision.", "tags": ["LoRA", "Fine-Tuning", "Quantization"]},
        {"id": "lvl_ai_08", "learning_path_id": "path_ai_ml", "level_number": 8, "title": "Autonomous Agent Systems", "subtitle": "Function Calling, Planning & Multi-Agent Teams", "description": "Design autonomous coding and research agents that execute tools.", "estimated_minutes": 90, "status": "locked", "is_locked": True, "xp_reward": 300, "story_snippet": "Deploy a multi-agent swarm that automatically investigates and fixes codebase bugs.", "tags": ["AI Agents", "Tool Calling", "Autonomous"]}
    ]
    for lvl in aiml_levels:
        db.add(Level(**lvl))

    # 4. Cybersecurity Levels
    cyber_levels = [
        {"id": "lvl_cy_01", "learning_path_id": "path_cybersecurity", "level_number": 1, "title": "Packet Reconnaissance", "subtitle": "Wireshark, TCP Handshakes & Network Packets", "description": "Inspect packet flows, analyze headers, and detect network anomalies.", "estimated_minutes": 45, "status": "in_progress", "is_locked": False, "xp_reward": 100, "story_snippet": "A strange surge in port 443 traffic threatens the server infrastructure.", "tags": ["Wireshark", "TCP/IP", "Packets"]},
        {"id": "lvl_cy_02", "learning_path_id": "path_cybersecurity", "level_number": 2, "title": "The Web Under Siege", "subtitle": "OWASP Top 10 & SQL Injection Defense", "description": "Find and remediate SQLi, XSS, and CSRF vulnerabilities.", "estimated_minutes": 60, "status": "locked", "is_locked": True, "xp_reward": 130, "story_snippet": "An unescaped search input is leaking customer records. Patch the vulnerability immediately.", "tags": ["SQLi", "XSS", "OWASP"]},
        {"id": "lvl_cy_03", "learning_path_id": "path_cybersecurity", "level_number": 3, "title": "Cryptographic Fortress", "subtitle": "Symmetric/Asymmetric Ciphers, Hashing & RSA", "description": "Bcrypt, salt hashing, public-private key cryptography.", "estimated_minutes": 65, "status": "locked", "is_locked": True, "xp_reward": 160, "story_snippet": "Design a tamper-proof digital signature scheme for financial ledgers.", "tags": ["RSA", "Bcrypt", "Hashes"]},
        {"id": "lvl_cy_04", "learning_path_id": "path_cybersecurity", "level_number": 4, "title": "Ethical Infiltration", "subtitle": "Penetration Testing, Metasploit & Exploitation", "description": "Perform authorized vulnerability assessments on simulated targets.", "estimated_minutes": 75, "status": "locked", "is_locked": True, "xp_reward": 200, "story_snippet": "Can you breach the staging server before the black-hat attackers do?", "tags": ["Pen Testing", "Metasploit", "Recon"]},
        {"id": "lvl_cy_05", "learning_path_id": "path_cybersecurity", "level_number": 5, "title": "Defensive SOC & SIEM", "subtitle": "Log Analysis, Incident Response & Threat Hunting", "description": "Analyze syslog data, trace attacker kill chains, and isolate nodes.", "estimated_minutes": 80, "status": "locked", "is_locked": True, "xp_reward": 220, "story_snippet": "A compromised employee laptop triggered an alert at 2 AM. Triage the breach.", "tags": ["SIEM", "Incident Response", "Threat Hunting"]},
        {"id": "lvl_cy_06", "learning_path_id": "path_cybersecurity", "level_number": 6, "title": "Zero Trust Bastion", "subtitle": "Cloud Security, IAM & Identity Architectures", "description": "Implement principle of least privilege and zero-trust policies.", "estimated_minutes": 90, "status": "locked", "is_locked": True, "xp_reward": 300, "story_snippet": "Secure a multi-cloud enterprise perimeter against advanced persistent threats.", "tags": ["Zero Trust", "IAM", "Cloud Security"]}
    ]
    for lvl in cyber_levels:
        db.add(Level(**lvl))

    # 5. Software Developer (SDE) Levels
    sde_levels = [
        {"id": "lvl_sde_01", "learning_path_id": "path_sde", "level_number": 1, "title": "Algorithmic Complexity", "subtitle": "Big-O Notation, Space & Time Tradeoffs", "description": "Calculate tight asymptotic bounds and optimize memory footprints.", "estimated_minutes": 45, "status": "in_progress", "is_locked": False, "xp_reward": 100, "story_snippet": "Transform a crashing O(N^2) brute-force algorithm into an instant O(N) solution.", "tags": ["Big-O", "Complexity", "Algorithms"]},
        {"id": "lvl_sde_02", "learning_path_id": "path_sde", "level_number": 2, "title": "Arrays & Pointers", "subtitle": "Two Pointers, Sliding Window & Prefix Sums", "description": "Solve high-frequency array problems with optimal pointers.", "estimated_minutes": 55, "status": "locked", "is_locked": True, "xp_reward": 120, "story_snippet": "Find the maximum sum subarray in continuous streaming data in O(N).", "tags": ["Two Pointers", "Sliding Window", "Arrays"]},
        {"id": "lvl_sde_03", "learning_path_id": "path_sde", "level_number": 3, "title": "Recursion & Backtracking", "subtitle": "State Trees, Permutations & Subsets", "description": "Master recursive call stacks and exhaustive search pruning.", "estimated_minutes": 65, "status": "locked", "is_locked": True, "xp_reward": 150, "story_snippet": "Solve the N-Queens board puzzle with optimal constraint backtracking.", "tags": ["Recursion", "Backtracking", "Pruning"]},
        {"id": "lvl_sde_04", "learning_path_id": "path_sde", "level_number": 4, "title": "Trees & Priority Queues", "subtitle": "BST, Invariant Traversal & Binary Heaps", "description": "Implement tree operations, balance checks, and heap top-K queries.", "estimated_minutes": 70, "status": "locked", "is_locked": True, "xp_reward": 180, "story_snippet": "Maintain live top-100 trending hashtags across millions of tweets.", "tags": ["Trees", "Heaps", "Priority Queues"]},
        {"id": "lvl_sde_05", "learning_path_id": "path_sde", "level_number": 5, "title": "Graph Algorithms", "subtitle": "BFS, DFS, Dijkstra & Topological Sort", "description": "Navigate network graphs, find shortest routes, and detect dependency cycles.", "estimated_minutes": 75, "status": "locked", "is_locked": True, "xp_reward": 200, "story_snippet": "Route GPS delivery drivers through dynamic road blockages using Dijkstra.", "tags": ["Graphs", "Dijkstra", "BFS/DFS"]},
        {"id": "lvl_sde_06", "learning_path_id": "path_sde", "level_number": 6, "title": "Dynamic Programming", "subtitle": "Memoization, Tabulation & Knapsack Patterns", "description": "Break complex problems into overlapping subproblems with optimal substructure.", "estimated_minutes": 85, "status": "locked", "is_locked": True, "xp_reward": 220, "story_snippet": "Crack the Longest Common Subsequence and Coin Change DP puzzles.", "tags": ["Dynamic Programming", "Memoization", "Tabulation"]},
        {"id": "lvl_sde_07", "learning_path_id": "path_sde", "level_number": 7, "title": "Object-Oriented Design", "subtitle": "SOLID Principles & Gang of Four Patterns", "description": "Design extensible, maintainable class hierarchies and design patterns.", "estimated_minutes": 75, "status": "locked", "is_locked": True, "xp_reward": 250, "story_snippet": "Architect an extensible payment processor supporting 10 payment gateways cleanly.", "tags": ["SOLID", "Design Patterns", "Clean Code"]},
        {"id": "lvl_sde_08", "learning_path_id": "path_sde", "level_number": 8, "title": "System Design Foundations", "subtitle": "Scalability, Sharding, Load Balancers & CAP Theorem", "description": "Architect systems handling 100M+ daily active users.", "estimated_minutes": 90, "status": "locked", "is_locked": True, "xp_reward": 300, "story_snippet": "Design a globally distributed URL shortener that handles 10,000 writes/sec.", "tags": ["System Design", "Scalability", "CAP Theorem"]}
    ]
    for lvl in sde_levels:
        db.add(Level(**lvl))

    # 6. Full Stack Developer Levels
    fs_levels = [
        {"id": "lvl_fs_01", "learning_path_id": "path_full_stack", "level_number": 1, "title": "Full Stack Architecture", "subtitle": "Client-Server Paradigm, REST & JSON", "description": "Understand the modern full stack web ecosystem.", "estimated_minutes": 45, "status": "in_progress", "is_locked": False, "xp_reward": 100, "story_snippet": "Design the data flow between a React single-page app and a backend API.", "tags": ["Architecture", "REST", "JSON"]},
        {"id": "lvl_fs_02", "learning_path_id": "path_full_stack", "level_number": 2, "title": "React Component Mastery", "subtitle": "JSX, Props, Hooks & State Trees", "description": "Build reusable, modular user interface components.", "estimated_minutes": 55, "status": "locked", "is_locked": True, "xp_reward": 120, "story_snippet": "Refactor a monolithic spaghetti file into clean, composable React components.", "tags": ["React", "Hooks", "Components"]},
        {"id": "lvl_fs_03", "learning_path_id": "path_full_stack", "level_number": 3, "title": "Client State & Routing", "subtitle": "React Router, Context & Global Store", "description": "Manage multi-page navigation and synchronized state.", "estimated_minutes": 60, "status": "locked", "is_locked": True, "xp_reward": 140, "story_snippet": "Create seamless SPA transitions without full page reloads.", "tags": ["Routing", "Context API", "State"]},
        {"id": "lvl_fs_04", "learning_path_id": "path_full_stack", "level_number": 4, "title": "Node.js & Express Engines", "subtitle": "Middleware, Routing & Async Controllers", "description": "Build high-throughput RESTful backend endpoints.", "estimated_minutes": 65, "status": "locked", "is_locked": True, "xp_reward": 160, "story_snippet": "Handle 1,000 concurrent API requests with asynchronous Express routes.", "tags": ["Node.js", "Express", "Middleware"]},
        {"id": "lvl_fs_05", "learning_path_id": "path_full_stack", "level_number": 5, "title": "Relational Data Modeling", "subtitle": "PostgreSQL, Foreign Keys & Migrations", "description": "Design scalable normalized schemas and write optimized SQL joins.", "estimated_minutes": 70, "status": "locked", "is_locked": True, "xp_reward": 180, "story_snippet": "Eliminate database deadlocks and slow queries on high-traffic tables.", "tags": ["PostgreSQL", "SQL", "Schema Design"]},
        {"id": "lvl_fs_06", "learning_path_id": "path_full_stack", "level_number": 6, "title": "Authentication & JWT", "subtitle": "Bcrypt, Bearer Tokens & Secure Sessions", "description": "Implement secure registration, login, and token refresh.", "estimated_minutes": 75, "status": "locked", "is_locked": True, "xp_reward": 200, "story_snippet": "Defend the authentication flow against replay attacks and token leaks.", "tags": ["JWT", "Auth", "Bcrypt"]},
        {"id": "lvl_fs_07", "learning_path_id": "path_full_stack", "level_number": 7, "title": "Full Stack Bridging", "subtitle": "End-to-End Type Safety & Data Fetching", "description": "Connect frontend forms to database mutations with robust error handling.", "estimated_minutes": 80, "status": "locked", "is_locked": True, "xp_reward": 220, "story_snippet": "Build a live real-time dashboard connecting WebSockets to backend events.", "tags": ["Integration", "WebSockets", "CRUD"]},
        {"id": "lvl_fs_08", "learning_path_id": "path_full_stack", "level_number": 8, "title": "High Speed Caching", "subtitle": "Redis, In-Memory Stores & Invalidation", "description": "Accelerate slow database reads with Redis cache layers.", "estimated_minutes": 75, "status": "locked", "is_locked": True, "xp_reward": 220, "story_snippet": "Reduce API response latency from 450ms to 8ms with Redis caching.", "tags": ["Redis", "Caching", "Performance"]},
        {"id": "lvl_fs_09", "learning_path_id": "path_full_stack", "level_number": 9, "title": "Containerization & CI/CD", "subtitle": "Docker, GitHub Actions & Automated Testing", "description": "Containerize full stack apps and automate staging deploys.", "estimated_minutes": 85, "status": "locked", "is_locked": True, "xp_reward": 250, "story_snippet": "Never say 'it worked on my machine' again: build unified Docker containers.", "tags": ["Docker", "CI/CD", "Testing"]},
        {"id": "lvl_fs_10", "learning_path_id": "path_full_stack", "level_number": 10, "title": "Production Deployment", "subtitle": "Cloud Hosting, Monitoring & Load Balancing", "description": "Deploy to production with SSL, CDN caching, and error logging.", "estimated_minutes": 90, "status": "locked", "is_locked": True, "xp_reward": 300, "story_snippet": "Launch your full stack application to the public with 99.99% uptime.", "tags": ["Cloud Deploy", "Monitoring", "Scale"]}
    ]
    for lvl in fs_levels:
        db.add(Level(**lvl))

    # 7. App Developer Levels
    app_levels = [
        {"id": "lvl_app_01", "learning_path_id": "path_app_dev", "level_number": 1, "title": "Mobile Foundations", "subtitle": "Mobile Viewports, React Native & Component Tree", "description": "Build responsive cross-platform mobile layouts.", "estimated_minutes": 45, "status": "in_progress", "is_locked": False, "xp_reward": 100, "story_snippet": "Design a mobile interface that renders identically on iOS and Android devices.", "tags": ["React Native", "Mobile UI", "Flexbox"]},
        {"id": "lvl_app_02", "learning_path_id": "path_app_dev", "level_number": 2, "title": "Mobile Navigation", "subtitle": "Stack, Tab & Drawer Navigation Systems", "description": "Seamless multi-screen mobile user journeys.", "estimated_minutes": 55, "status": "locked", "is_locked": True, "xp_reward": 120, "story_snippet": "Implement intuitive bottom-tab switching with smooth transition animations.", "tags": ["Navigation", "User Flow", "Mobile"]},
        {"id": "lvl_app_03", "learning_path_id": "path_app_dev", "level_number": 3, "title": "Device Hardware APIs", "subtitle": "Camera, Geolocation & Biometrics", "description": "Access device camera, GPS sensors, and biometric FaceID.", "estimated_minutes": 65, "status": "locked", "is_locked": True, "xp_reward": 150, "story_snippet": "Build a QR ticket scanner that authenticates fest entry in 200ms.", "tags": ["Device APIs", "Camera", "Sensors"]},
        {"id": "lvl_app_04", "learning_path_id": "path_app_dev", "level_number": 4, "title": "Offline-First Sync", "subtitle": "AsyncStorage, SQLite & Background Sync", "description": "Enable full mobile app functionality with zero network connection.", "estimated_minutes": 70, "status": "locked", "is_locked": True, "xp_reward": 180, "story_snippet": "Let users take notes on the metro offline and sync to cloud when connected.", "tags": ["Offline Sync", "SQLite", "Cache"]},
        {"id": "lvl_app_05", "learning_path_id": "path_app_dev", "level_number": 5, "title": "Push Notifications & Real-Time", "subtitle": "FCM, APNs & Background Event Handlers", "description": "Deliver instant push alerts and background silent notifications.", "estimated_minutes": 75, "status": "locked", "is_locked": True, "xp_reward": 220, "story_snippet": "Alert users the instant their delivery order status changes.", "tags": ["Push Notifications", "FCM", "Real-Time"]},
        {"id": "lvl_app_06", "learning_path_id": "path_app_dev", "level_number": 6, "title": "App Store Launch", "subtitle": "App Signing, TestFlight & Production Release", "description": "Bundle binaries, manage app store assets, and publish live.", "estimated_minutes": 90, "status": "locked", "is_locked": True, "xp_reward": 300, "story_snippet": "Pass Google Play and Apple App Store review guidelines on the first submission.", "tags": ["App Store", "TestFlight", "Release"]}
    ]
    for lvl in app_levels:
        db.add(Level(**lvl))

    # 8. Product Designer Levels
    pd_levels = [
        {"id": "lvl_pd_01", "learning_path_id": "path_product_design", "level_number": 1, "title": "Visual Hierarchy & Foundations", "subtitle": "Typography, Spacing, Contrast & Color Theory", "description": "Master WCAG accessibility, visual balance, and harmonious scales.", "estimated_minutes": 40, "status": "in_progress", "is_locked": False, "xp_reward": 100, "story_snippet": "Redesign a cluttered dashboard into an instantly scannable, calm interface.", "tags": ["Visual Design", "Typography", "Color Theory"]},
        {"id": "lvl_pd_02", "learning_path_id": "path_product_design", "level_number": 2, "title": "User Empathy & Research", "subtitle": "User Journeys, Personas & Friction Audits", "description": "Interview users, map friction drop-offs, and define core user tasks.", "estimated_minutes": 50, "status": "locked", "is_locked": True, "xp_reward": 120, "story_snippet": "Discover why 40% of users drop out at step 2 of the checkout funnel.", "tags": ["User Research", "Personas", "Friction Audit"]},
        {"id": "lvl_pd_03", "learning_path_id": "path_product_design", "level_number": 3, "title": "Design Systems & Figma", "subtitle": "Auto-Layout, Variants & Component Libraries", "description": "Build robust, scalable design tokens and UI component libraries.", "estimated_minutes": 65, "status": "locked", "is_locked": True, "xp_reward": 160, "story_snippet": "Create a unified Figma design system used across 5 product engineering squads.", "tags": ["Figma", "Design Systems", "Auto-Layout"]},
        {"id": "lvl_pd_04", "learning_path_id": "path_product_design", "level_number": 4, "title": "Interaction & Motion", "subtitle": "Micro-Interactions, Feedback & Prototyping", "description": "Bring interfaces alive with physics-based feedback and delight.", "estimated_minutes": 60, "status": "locked", "is_locked": True, "xp_reward": 200, "story_snippet": "Craft a celebratory completion animation that boosts user retention by 15%.", "tags": ["Micro-Interactions", "Motion", "Prototyping"]},
        {"id": "lvl_pd_05", "learning_path_id": "path_product_design", "level_number": 5, "title": "Usability Testing & Iteration", "subtitle": "A/B Testing, Heatmaps & Continuous Discovery", "description": "Validate prototypes with live users and iterate towards product-market fit.", "estimated_minutes": 75, "status": "locked", "is_locked": True, "xp_reward": 250, "story_snippet": "Run a remote unmoderated usability study and iterate to 95% task success rate.", "tags": ["Usability Testing", "A/B Testing", "Product Strategy"]}
    ]
    for lvl in pd_levels:
        db.add(Level(**lvl))

    # 9. GATE CSE Levels (10 Levels)
    gate_levels = [
        {"id": "lvl_gate_01", "learning_path_id": "path_gate_cse", "level_number": 1, "title": "Processes & CPU Architecture", "subtitle": "Process State Models, PCB & Context Switching", "description": "First-order kernel mechanics, process scheduling, and concurrency control.", "estimated_minutes": 60, "status": "in_progress", "is_locked": False, "xp_reward": 120, "story_snippet": "Four critical system programs must share a single CPU core without freezing.", "tags": ["Processes", "PCB", "Context Switch", "CPU Scheduling"]},
        {"id": "lvl_gate_02", "learning_path_id": "path_gate_cse", "level_number": 2, "title": "Data Structures & Pointer Sorcery", "subtitle": "Trees, BST, Heaps & Hash Collisions", "description": "Master memory layouts, recursion stacks, and tree invariants.", "estimated_minutes": 75, "status": "locked", "is_locked": True, "xp_reward": 140, "story_snippet": "A million keys inserted randomly: why does an AVL tree never degenerate into a linked list?", "tags": ["Binary Search Trees", "Heaps", "Hashing"]},
        {"id": "lvl_gate_03", "learning_path_id": "path_gate_cse", "level_number": 3, "title": "Algorithms & Asymptotic Thinking", "subtitle": "Recurrences, Greedy vs DP & MSTs", "description": "Master master theorem, matrix chain multiplication, and Dijkstra speedups.", "estimated_minutes": 80, "status": "locked", "is_locked": True, "xp_reward": 160, "story_snippet": "Optimize a space rover's battery routing over dynamic terrain.", "tags": ["Dynamic Programming", "Dijkstra", "Recurrence"]},
        {"id": "lvl_gate_04", "learning_path_id": "path_gate_cse", "level_number": 4, "title": "Computer Organization & Architecture", "subtitle": "Pipelining, Structural Hazards & Cache Hierarchy", "description": "Speed up clock cycles without blowing up CPU hazards.", "estimated_minutes": 90, "status": "locked", "is_locked": True, "xp_reward": 180, "story_snippet": "Instruction branch predictions are missing 40% of the time in the core pipeline!", "tags": ["Pipeline Hazards", "Cache Mapping", "Addressing Modes"]},
        {"id": "lvl_gate_05", "learning_path_id": "path_gate_cse", "level_number": 5, "title": "Operating Systems — Kernel Chronicles", "subtitle": "Deadlocks, Mutex Locks & Virtual Memory Paging", "description": "Conquer Coffman conditions and page replacement anomalies.", "estimated_minutes": 90, "status": "locked", "is_locked": True, "xp_reward": 200, "story_snippet": "Four concurrent database processes hold each other in an unbreakable deadlock loop.", "tags": ["Deadlocks", "Banker's Algorithm", "Paging", "Semaphores"]},
        {"id": "lvl_gate_06", "learning_path_id": "path_gate_cse", "level_number": 6, "title": "Database Management & ACID Transactions", "subtitle": "Serializability, B+ Trees & 2PL Protocols", "description": "Guaranteed transactional consistency under multi-threaded writes.", "estimated_minutes": 80, "status": "locked", "is_locked": True, "xp_reward": 200, "story_snippet": "A midnight bank transfer glitch threatens to duplicate funds across accounts.", "tags": ["Conflict Serializability", "2PL", "B+ Trees", "Normalization"]},
        {"id": "lvl_gate_07", "learning_path_id": "path_gate_cse", "level_number": 7, "title": "Computer Networks & Congestion Control", "subtitle": "Sliding Windows, Subnet Masks & TCP Handshakes", "description": "Packet routing across routers with zero congestion loss.", "estimated_minutes": 85, "status": "locked", "is_locked": True, "xp_reward": 200, "story_snippet": "A cross-continental submarine cable suffers 15% packet drop. Tune the sliding window!", "tags": ["TCP Reno/Tahoe", "Subnetting", "CIDR", "Routing"]},
        {"id": "lvl_gate_08", "learning_path_id": "path_gate_cse", "level_number": 8, "title": "Theory of Computation & Automata", "subtitle": "DFA Minimization, CFG & Turing Decidability", "description": "Determine what problems can mathematically never be solved.", "estimated_minutes": 90, "status": "locked", "is_locked": True, "xp_reward": 220, "story_snippet": "Design an automaton to verify if infinite programs halt without crashing.", "tags": ["DFA/NFA", "Pumping Lemma", "Turing Machines"]},
        {"id": "lvl_gate_09", "learning_path_id": "path_gate_cse", "level_number": 9, "title": "Compiler Design & Syntax Translation", "subtitle": "LL(1), LR(0), LALR Parsing & Code Generation", "description": "Transform language syntax trees into optimized machine instructions.", "estimated_minutes": 70, "status": "locked", "is_locked": True, "xp_reward": 200, "story_snippet": "Resolve shift-reduce conflicts in an expression grammar parser.", "tags": ["Parsing Tables", "FIRST & FOLLOW", "SDT"]},
        {"id": "lvl_gate_10", "learning_path_id": "path_gate_cse", "level_number": 10, "title": "Revision & Mock Battlegrounds", "subtitle": "Comprehensive 65-Question Speed Drills", "description": "Test yourself under real GATE 3-hour examination pressure.", "estimated_minutes": 180, "status": "locked", "is_locked": True, "xp_reward": 350, "story_snippet": "The final frontier: AIR under 100 simulation with past 15 years PYQ analytics.", "tags": ["Full Length Mock", "PYQs", "Speed Strategy"]}
    ]
    for lvl in gate_levels:
        db.add(Level(**lvl))
    db.flush()

    # -------------------------------------------------------------
    # 6. SEED CONCEPTS FOR ALL 9 DOMAINS
    # -------------------------------------------------------------
    print("[*] Seeding concepts for all 9 domains...")
    concepts_data = [
        {"id": "c_web_works", "level_id": "lvl_01", "title": "How the Web Works & HTTP", "description": "The foundational journey of web packets across DNS and servers.", "difficulty": "easy", "estimated_minutes": 15},
        {"id": "c_ds_wrangling", "level_id": "lvl_ds_01", "title": "Data Wrangling & Outlier Detection", "description": "Transform messy raw datasets into verified Pandas dataframes.", "difficulty": "easy", "estimated_minutes": 15},
        {"id": "c_ai_tensors", "level_id": "lvl_ai_01", "title": "Features, Labels & Vector Spaces", "description": "Transform raw text and images into numerical tensor feature vectors.", "difficulty": "medium", "estimated_minutes": 20},
        {"id": "c_cy_packets", "level_id": "lvl_cy_01", "title": "Network Recon & Injection Defense", "description": "Inspect TCP payloads, analyze packet headers, and block injection exploits.", "difficulty": "medium", "estimated_minutes": 20},
        {"id": "c_sde_complexity", "level_id": "lvl_sde_01", "title": "Asymptotic Complexity & Optimization", "description": "Analyze tight Big-O bounds and optimize nested loops into linear time.", "difficulty": "easy", "estimated_minutes": 15},
        {"id": "c_fs_arch", "level_id": "lvl_fs_01", "title": "Client-Server Full Stack Architecture", "description": "Connect React single-page frontend with Node API and Postgres DB.", "difficulty": "medium", "estimated_minutes": 20},
        {"id": "c_app_lifecycle", "level_id": "lvl_app_01", "title": "Mobile Viewports & Offline Persistence", "description": "Design responsive mobile UIs and cache state offline in AsyncStorage.", "difficulty": "easy", "estimated_minutes": 15},
        {"id": "c_pd_hierarchy", "level_id": "lvl_pd_01", "title": "Visual Hierarchy & Usability Principles", "description": "Structure UI layouts with clear focal points, contrast, and cognitive ease.", "difficulty": "easy", "estimated_minutes": 15},
        {"id": "c_gate_proc", "level_id": "lvl_gate_01", "title": "Processes, PCB & Context Switching", "description": "State models, hardware interrupts, Process Control Blocks, and Round Robin.", "difficulty": "hard", "estimated_minutes": 25},
        {"id": "c_os_deadlock", "level_id": "lvl_gate_05", "title": "Operating System Deadlocks", "description": "Coffman conditions, resource allocation graphs, and Banker's avoidance algorithm.", "difficulty": "hard", "estimated_minutes": 25}
    ]
    for cd in concepts_data:
        db.add(Concept(**cd))
    db.flush()

    # -------------------------------------------------------------
    # 7. SEED AUTHENTIC 9 FIRST STORY LESSONS
    # -------------------------------------------------------------
    print("[*] Seeding 9 distinct first story lessons...")

    # 1. WEB DEVELOPER STORY: The Website That Couldn't Talk
    lesson_web = Lesson(
        id="story_http_01",
        concept_id="c_web_works",
        level_id="lvl_01",
        title="The Website That Couldn't Talk",
        role_context='Junior Frontend Engineer at "ChaiPay" (Fintech Startup, Bengaluru)',
        story_content={
            "premise": 'You just joined ChaiPay, a fast-moving fintech startup. Your first Monday morning assignment sounds deceptive: "Make our checkout page talk to the payment gateway."',
            "dilemma": "The entire engineering team is arguing about why the user sees a blank white screen. The intern blames the CSS, the backend lead blames the DNS, and nobody has traced what actually travels across the wire.",
            "objective": "Step inside the network wire. Follow a single keystroke from the address bar to the server and back to bring ChaiPay to life."
        },
        explanation="HTTP (Hypertext Transfer Protocol) is the universal conversation language of the internet. The client speaks in Requests (GET, POST, PUT, DELETE), and the server answers in Responses with Status Codes (200, 404, 500) and Payloads.",
        analogy={
            "title": "The Irani Chai Cafe Analogy ☕",
            "story": "Imagine walking into a famous Hyderabad Irani cafe. You don't walk straight into the kitchen. You check the board for the table number (DNS lookup). You tell the waiter 'Ek Chai aur do Bun Maska' (HTTP GET Request). The kitchen prepares it (Server execution). The waiter brings your plate with a nod (Status 200 OK Response). If they ran out of Maska, the waiter says 'Khatam ho gaya' (Status 404 Not Found)!",
            "icon": "☕"
        },
        visual_diagram_flow=[
            {"step": 1, "actor": "Client (Browser)", "action": "DNS Resolution", "desc": 'Converts "chaipay.in" -> "104.21.48.192" via recursive DNS servers.'},
            {"step": 2, "actor": "Network Socket", "action": "TCP/TLS Handshake", "desc": "SYN -> SYN-ACK -> ACK to establish encrypted TLS 1.3 tunnel."},
            {"step": 3, "actor": "Browser Engine", "action": "HTTP GET Dispatch", "desc": "Sends Headers (Host, Accept, User-Agent, Authorization Cookie)."},
            {"step": 4, "actor": "ChaiPay Server", "action": "Process & Return 200", "desc": "Validates session, queries PostgreSQL, and streams HTML/JSON."},
            {"step": 5, "actor": "Rendering Engine", "action": "Critical Rendering Path", "desc": "Parses HTML into DOM Tree, applies CSSOM, and Paints pixels."}
        ],
        golden_rule="Clients ask (Requests) with Methods and Headers; Servers answer (Responses) with Status Codes and Bodies. The web is stateless by default.",
        common_mistakes=[
            "Mistake 1: Believing DNS stores the actual website files (DNS only stores phonebook IP records).",
            "Mistake 2: Thinking HTTP POST is automatically encrypted without HTTPS (Always enforce TLS!).",
            "Mistake 3: Confusing 401 Unauthorized with 403 Forbidden."
        ],
        interactive_moment={
            "prompt": "Arrange the 5 critical stages of a Web Request in exact chronological order to bridge the Browser and the Server:",
            "correctOrder": [
                "1. Browser looks up IP via DNS Resolver",
                "2. TCP Handshake establishes secure socket",
                "3. Browser transmits HTTP GET /checkout request",
                "4. Server processes request & returns 200 OK + HTML",
                "5. Browser renders DOM & triggers CSS layout paint"
            ],
            "initialItems": [
                "3. Browser transmits HTTP GET /checkout request",
                "1. Browser looks up IP via DNS Resolver",
                "5. Browser renders DOM & triggers CSS layout paint",
                "2. TCP Handshake establishes secure socket",
                "4. Server processes request & returns 200 OK + HTML"
            ],
            "hints": [
                "Think: Before the browser can send an HTTP letter, it needs the postal address (IP).",
                "Before data flows, a secure phone call (TCP Handshake) must be answered.",
                "Rendering the DOM only happens after the browser receives the HTML payload."
            ],
            "explanationAfterSuccess": "Boom! You just connected the wire. The DNS found the IP, the TCP handshake verified the line, HTTP delivered the envelope, and the browser turned raw bytes into a living UI."
        },
        mini_challenge={
            "question": 'A user on a slow 3G mobile network in Jaipur clicks "Pay Rs 250". The network drops for 3 seconds, and the user taps the button three more times in frustration. What HTTP design pattern prevents them from being charged Rs 1,000?',
            "context": "Payment Gateways & Idempotency in Real-World Distributed Systems",
            "options": [
                {"id": "opt_a", "label": "Change the HTTP method from POST to GET", "isCorrect": False, "feedback": "GET requests should never modify state or trigger financial transactions!"},
                {"id": "opt_b", "label": 'Attach a unique "Idempotency-Key" header with each checkout session', "isCorrect": True, "feedback": "Yep. That's exactly what happens at Razorpay, Stripe and ChaiPay! 🔥 The server recognizes duplicate requests with the same key and only charges once."},
                {"id": "opt_c", "label": "Disable JavaScript on mobile browsers", "isCorrect": False, "feedback": "Disabling JavaScript would break the entire modern web application!"},
                {"id": "opt_d", "label": "Send a 500 Internal Server Error immediately on second click", "isCorrect": False, "feedback": "That scares the user and doesn't cleanly deduplicate the transaction in the database."}
            ],
            "correctFeedback": "Spot on! An Idempotency Key guarantees that identical retries produce the exact same outcome without duplicate side effects.",
            "incorrectFeedback": "Almost! Think about what unique identifier allows a backend to identify identical retries."
        },
        practice_task={
            "title": "Now Use It: Fetch ChaiPay Merchant Status",
            "description": "Write a modern JavaScript fetch() call to retrieve live store status with error handling for non-200 HTTP codes.",
            "problemType": "coding",
            "starterSnippet": "async function checkMerchantStatus(merchantId) {\n  try {\n    const response = await fetch(`https://api.chaipay.in/v1/merchants/${merchantId}`);\n    if (!response.ok) {\n      throw new Error(`HTTP Error: ${response.status}`);\n    }\n    const data = await response.json();\n    return { success: true, isLive: data.active };\n  } catch (err) {\n    return { success: false, error: err.message };\n  }\n}",
            "hint": "Always check response.ok before parsing response.json(), because fetch() does NOT reject on 404/500!",
            "externalLinkText": "Test in JS Playground ↗",
            "externalLinkUrl": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch"
        }
    )
    db.add(lesson_web)

    # 2. DATA SCIENTIST STORY: The Dataset That Lied
    lesson_ds = Lesson(
        id="story_ds_01",
        concept_id="c_ds_wrangling",
        level_id="lvl_ds_01",
        title="The Dataset That Lied",
        role_context='Junior Data Scientist at "QuickMart" (Hyperlocal E-commerce, Bengaluru)',
        story_content={
            "premise": "You sit at your desk on Monday morning and open QuickMart's flash sale revenue report. The automated dashboard claims the company made -Rs 42,000,000 during the Diwali sale.",
            "dilemma": "The marketing VP is panicking, while the engineering team insists the payment gateway logged record profits. When you open the raw CSV file, you notice customer ages listed as '999', delivery times written as strings like 'N/A', and negative order amounts.",
            "objective": "Untangle the dirty dataset, filter corrupt values, apply robust statistical aggregations, and present the true revenue numbers to leadership."
        },
        explanation="Raw data in the wild is almost always dirty, missing, or corrupted. Data wrangling is the systematic process of cleaning, structuring, and enriching raw data into high-fidelity dataframes for accurate statistical modeling.",
        analogy={
            "title": "The Vegetable Market Sieve 🥦",
            "story": "You don't dump a freshly bought sack of potatoes directly into the cooking pot. You wash off the mud (null handling), pick out the rotten ones (outlier detection), peel the skins (type conversion), and chop them into uniform cubes (normalization) before cooking the curry (model training)!",
            "icon": "🥦"
        },
        visual_diagram_flow=[
            {"step": 1, "actor": "Data Ingestion", "action": "Load Raw CSV", "desc": "Read 500,000 transaction rows with Pandas read_csv()."},
            {"step": 2, "actor": "Schema Audit", "action": "Inspect Types & Nulls", "desc": "Identify string values in numeric columns & missing delivery timestamps."},
            {"step": 3, "actor": "Cleaning Filter", "action": "Impute & Cleanse", "desc": "Convert corrupt formats, impute median values, and drop invalid negative records."},
            {"step": 4, "actor": "Outlier Isolation", "action": "IQR Anomaly Detection", "desc": "Filter out test transactions with age=999 using 1.5 * IQR thresholds."},
            {"step": 5, "actor": "Statistical Synthesis", "action": "Aggregate True Metrics", "desc": "Calculate robust median order values and true gross merchandising volume (GMV)."}
        ],
        golden_rule="Garbage in, garbage out. A simple linear regression on clean data always beats a state-of-the-art neural network trained on corrupt data.",
        common_mistakes=[
            "Mistake 1: Relying on the mean (average) for skewed data with extreme outliers instead of the median.",
            "Mistake 2: Dropping all rows with any missing value (causes massive data loss and sampling bias).",
            "Mistake 3: Imputing test set data before splitting train/test sets (Data Leakage!)."
        ],
        interactive_moment={
            "prompt": "Arrange the 5 essential steps of a Data Cleaning Pipeline in exact operational sequence:",
            "correctOrder": [
                "1. Inspect schema & missing values (df.info())",
                "2. Cast corrupt string columns to numeric types",
                "3. Impute missing values with median/mode strategies",
                "4. Detect & filter anomalous outliers using IQR bounds",
                "5. Compute robust summary statistics for executive report"
            ],
            "initialItems": [
                "3. Impute missing values with median/mode strategies",
                "1. Inspect schema & missing values (df.info())",
                "5. Compute robust summary statistics for executive report",
                "2. Cast corrupt string columns to numeric types",
                "4. Detect & filter anomalous outliers using IQR bounds"
            ],
            "hints": [
                "Start with discovering what data types and nulls exist.",
                "Convert text types to numbers before attempting numerical imputation.",
                "Filter statistical outliers before computing final report summaries."
            ],
            "explanationAfterSuccess": "Outstanding work! You converted 500,000 rows of chaotic noise into verified business intelligence. QuickMart's true revenue was Rs 84,00,000!"
        },
        mini_challenge={
            "question": "QuickMart's delivery time dataset in minutes contains the values: [12, 14, 15, 16, 18, 9999]. Which metric best describes the typical delivery time without being skewed by the system test value (9999)?",
            "context": "Exploratory Data Analysis & Robust Central Tendency",
            "options": [
                {"id": "opt_a", "label": "Mean (Arithmetic Average)", "isCorrect": False, "feedback": "The mean is heavily distorted by 9999, yielding an absurd 1,679 minutes!"},
                {"id": "opt_b", "label": "Median (50th Percentile)", "isCorrect": True, "feedback": "Spot on! 🎯 The median is 15.5 minutes, unaffected by extreme outlier test entries."},
                {"id": "opt_c", "label": "Standard Deviation", "isCorrect": False, "feedback": "Standard deviation measures spread, not central tendency, and is also inflated by outliers."},
                {"id": "opt_d", "label": "Variance", "isCorrect": False, "feedback": "Variance is the square of standard deviation and explodes with extreme outliers."}
            ],
            "correctFeedback": "Correct! The median is a non-parametric statistic robust against severe outliers and long-tail skew.",
            "incorrectFeedback": "Think about which statistic splits the ordered dataset exactly in half regardless of how large the maximum value is."
        },
        practice_task={
            "title": "Now Use It: Clean QuickMart Order Dataframe",
            "description": "Write a Pandas snippet to filter negative order values and impute missing delivery ratings with the column median.",
            "problemType": "coding",
            "starterSnippet": "import pandas as pd\n\ndef clean_quickmart_orders(df: pd.DataFrame) -> pd.DataFrame:\n    # 1. Filter out corrupt negative amounts\n    df_clean = df[df['amount'] > 0].copy()\n    \n    # 2. Impute missing rating with median\n    rating_median = df_clean['rating'].median()\n    df_clean['rating'] = df_clean['rating'].fillna(rating_median)\n    \n    return df_clean",
            "hint": "Use df[df['col'] > 0] for boolean indexing and .fillna() for imputation.",
            "externalLinkText": "Explore Pandas Documentation ↗",
            "externalLinkUrl": "https://pandas.pydata.org/docs/"
        }
    )
    db.add(lesson_ds)

    # 3. AI / ML STORY: The Machine That Had to Guess
    lesson_aiml = Lesson(
        id="story_aiml_01",
        concept_id="c_ai_tensors",
        level_id="lvl_ai_01",
        title="The Machine That Had to Guess",
        role_context='Junior ML Engineer at "SpamShield AI" (Cyber Intelligence Platform)',
        story_content={
            "premise": "SpamShield's legacy rule-based system is collapsing. Scammers are bypassing keyword filters by typing 'Fr33 M0n3y!!' and using unicode emojis.",
            "dilemma": "Hardcoded if/else rules require constant manual updates and still miss 30% of fraudulent emails. The CTO tasks you with building an intelligent classification model that learns spam patterns automatically from data.",
            "objective": "Transform raw text into numerical feature vectors, split historical data into train and test sets, train a classifier, and maximize precision to protect 1,000,000 users."
        },
        explanation="Machine learning algorithms cannot read words directly; they operate exclusively on numbers. Feature extraction maps unstructured inputs into high-dimensional vector spaces where mathematical decision boundaries can be learned.",
        analogy={
            "title": "The Fruit Sorting Machine 🍎🍊",
            "story": "You can't tell a mechanical robot arm 'look for shiny red apples'. You give it sensors that measure weight in grams (Feature 1) and light wavelength in nanometers (Feature 2). Plotted on a graph, apples cluster in one quadrant and oranges in another. The machine simply draws a line between them!",
            "icon": "🤖"
        },
        visual_diagram_flow=[
            {"step": 1, "actor": "Data Pipeline", "action": "Tokenize & Clean Text", "desc": "Lowercases text, strips punctuation, and removes common stop words."},
            {"step": 2, "actor": "Vectorization", "action": "Convert to TF-IDF Embeddings", "desc": "Translates email words into a 5,000-dimensional numerical feature vector."},
            {"step": 3, "actor": "Data Splitter", "action": "Train/Test Split (80/20)", "desc": "Reserves 20% unseen test data to guarantee generalization."},
            {"step": 4, "actor": "Optimizer", "action": "Fit Classification Boundary", "desc": "Minimizes log-loss loss function via stochastic gradient descent."},
            {"step": 5, "actor": "Evaluation Matrix", "action": "Confusion Matrix Audit", "desc": "Calculates Precision, Recall, and F1-Score to verify zero false positives."}
        ],
        golden_rule="Never evaluate your machine learning model on the same data it was trained on. Unseen test evaluation is the only truth against overfitting.",
        common_mistakes=[
            "Mistake 1: Relying solely on overall accuracy for imbalanced datasets (e.g. 99% accuracy on 1% spam rate is meaningless).",
            "Mistake 2: Fitting feature vectorizers on the test dataset (causing data contamination).",
            "Mistake 3: Confusing High Bias (underfitting) with High Variance (overfitting)."
        ],
        interactive_moment={
            "prompt": "Arrange the 5 phases of the Machine Learning Lifecycle in proper order:",
            "correctOrder": [
                "1. Ingest raw text & clean noisy characters",
                "2. Extract numerical feature vectors (TF-IDF / Embeddings)",
                "3. Split data into independent Train (80%) and Test (20%) sets",
                "4. Train model by minimizing loss function on training split",
                "5. Evaluate Precision and Recall on held-out test dataset"
            ],
            "initialItems": [
                "4. Train model by minimizing loss function on training split",
                "1. Ingest raw text & clean noisy characters",
                "5. Evaluate Precision and Recall on held-out test dataset",
                "2. Extract numerical feature vectors (TF-IDF / Embeddings)",
                "3. Split data into independent Train (80%) and Test (20%) sets"
            ],
            "hints": [
                "Feature vectorization must happen before model training.",
                "Split your dataset before fitting model weights.",
                "Held-out test evaluation is always the final verification step."
            ],
            "explanationAfterSuccess": "Superb! Your model achieved 98.4% precision on the SpamShield test set, successfully blocking obfuscated spam without catching real emails."
        },
        mini_challenge={
            "question": "A fraud detection model predicts 99.9% of all transactions are 'Legitimate'. In a test set of 1,000 transactions where 10 are actually fraudulent, the model predicts all 1,000 are legitimate. What is its accuracy, and which metric reveals the failure?",
            "context": "Model Evaluation & Class Imbalance",
            "options": [
                {"id": "opt_a", "label": "Accuracy is 50%; revealed by ROC-AUC", "isCorrect": False, "feedback": "It got 990 correct out of 1000, so accuracy is 99%!"},
                {"id": "opt_b", "label": "Accuracy is 99.0%; failure revealed by 0% Recall on fraud", "isCorrect": True, "feedback": "Spot on! 🎯 It caught 0 out of 10 frauds (Recall = 0.0), even though raw accuracy was 99%."},
                {"id": "opt_c", "label": "Accuracy is 0%; revealed by Training Loss", "isCorrect": False, "feedback": "Accuracy is calculated over all correctly predicted samples (990/1000 = 99%)."},
                {"id": "opt_d", "label": "Accuracy is 100%; revealed by Mean Squared Error", "isCorrect": False, "feedback": "MSE is for continuous regression, not binary classification."}
            ],
            "correctFeedback": "Exact! On imbalanced datasets, high accuracy is a mirage. Recall and Precision on the minority class reveal the true performance.",
            "incorrectFeedback": "Calculate how many total predictions were correct (990 non-frauds out of 1000) vs how many fraud cases were actually identified."
        },
        practice_task={
            "title": "Now Use It: Train a Spam Classifier with Scikit-Learn",
            "description": "Construct a complete pipeline combining TfidfVectorizer with MultinomialNB.",
            "problemType": "coding",
            "starterSnippet": "from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.naive_bayes import MultinomialNB\nfrom sklearn.pipeline import Pipeline\n\ndef build_spam_classifier():\n    model = Pipeline([\n        ('vectorizer', TfidfVectorizer(ngram_range=(1, 2), stop_words='english')),\n        ('classifier', MultinomialNB(alpha=0.1))\n    ])\n    return model",
            "hint": "Using a Pipeline prevents data leakage between feature transformations and model fitting.",
            "externalLinkText": "Scikit-Learn Classification Guide ↗",
            "externalLinkUrl": "https://scikit-learn.org/stable/tutorial/text_analytics/working_with_text_data.html"
        }
    )
    db.add(lesson_aiml)

    # 4. CYBERSECURITY STORY: The Login That Shouldn't Exist
    lesson_cyber = Lesson(
        id="story_cyber_01",
        concept_id="c_cy_packets",
        level_id="lvl_cy_01",
        title="The Login That Shouldn't Exist",
        role_context='Junior Security Analyst at "Fortress Bank SOC" (Fintech Security, Mumbai)',
        story_content={
            "premise": "At 3:14 AM, Fortress Bank's security operations center triggers an automated Sev-1 red alert. An administrative session was established with the root user 'admin' without any valid password entered in the system logs.",
            "dilemma": "The junior developer wrote inline SQL: `SELECT * FROM users WHERE user = '\" + username + \"' AND pass = '\" + password + \"'`. An attacker entered `admin' OR '1'='1` in the login username field, bypassing authentication entirely.",
            "objective": "Inspect the raw HTTP POST request, patch the SQL injection vulnerability with parameterized queries, and implement salted bcrypt password hashing."
        },
        explanation="SQL Injection (SQLi) occurs when untrusted user input is directly concatenated into dynamic database queries, allowing attackers to manipulate the query structure and execute arbitrary SQL commands.",
        analogy={
            "title": "The VIP Club Guestbook 🚪",
            "story": "Imagine a nightclub bouncer who checks an ID card by reading: 'Let person in if name matches [User Input]'. An intruder shows a badge saying 'Nobody OR 1=1'. Because 1=1 is always true, the bouncer opens the velvet rope for the entire crowd!",
            "icon": "🛡️"
        },
        visual_diagram_flow=[
            {"step": 1, "actor": "Attacker", "action": "Craft Malicious Payload", "desc": "Inputs `admin' --` into username input field."},
            {"step": 2, "actor": "Vulnerable Server", "action": "String Concatenation", "desc": "Constructs: `SELECT * FROM users WHERE user='admin' --' AND pass='...'`."},
            {"step": 3, "actor": "Database Engine", "action": "Execute Altered Query", "desc": "Treats `--` as a SQL comment, ignoring the password condition completely."},
            {"step": 4, "actor": "Security Patch", "action": "Prepared Statement", "desc": "Treats user input strictly as a parameter literal, neutralizing injection syntax."},
            {"step": 5, "actor": "SOC Hardening", "action": "Bcrypt + WAF Defense", "desc": "Enforces salted password hashes and Web Application Firewall rules."}
        ],
        golden_rule="Never concatenate raw user strings into SQL queries. Always use parameterized queries (Prepared Statements) or ORM abstraction layers.",
        common_mistakes=[
            "Mistake 1: Relying on client-side regex validation alone (attackers bypass frontend checks with curl or Postman).",
            "Mistake 2: Storing passwords as MD5 or SHA-256 without salt (trivial to crack with rainbow tables).",
            "Mistake 3: Believing escaping quotes with simple replace() makes dynamic queries 100% safe."
        ],
        interactive_moment={
            "prompt": "Arrange the 5 defense steps to remediate an active SQL Injection vulnerability:",
            "correctOrder": [
                "1. Intercept & analyze malicious HTTP POST payload in logs",
                "2. Identify vulnerable dynamic string concatenation in query",
                "3. Refactor query to use parameterized Prepared Statements",
                "4. Enforce salted Bcrypt hashing on all stored passwords",
                "5. Deploy Web Application Firewall (WAF) rule to block payload patterns"
            ],
            "initialItems": [
                "3. Refactor query to use parameterized Prepared Statements",
                "1. Intercept & analyze malicious HTTP POST payload in logs",
                "5. Deploy Web Application Firewall (WAF) rule to block payload patterns",
                "2. Identify vulnerable dynamic string concatenation in query",
                "4. Enforce salted Bcrypt hashing on all stored passwords"
            ],
            "hints": [
                "Understand the attacker payload in the logs first.",
                "Locate the unsafe string concatenation.",
                "Replace raw concatenation with parameterized SQL parameters."
            ],
            "explanationAfterSuccess": "Vulnerability patched! 🛡️ The login endpoint now uses parameterized bindings, and Fortress Bank's core banking vault is fully secured."
        },
        mini_challenge={
            "question": "In the query `SELECT * FROM accounts WHERE acc_id = '\" + input_id + \"'`, an attacker enters `105' OR '1'='1`. Why does this return every record in the table?",
            "context": "OWASP Top 10 — SQL Injection Exploitation",
            "options": [
                {"id": "opt_a", "label": "Because the database server crashed and rebooted in debug mode", "isCorrect": False, "feedback": "No crash occurs; the SQL engine simply executes the modified boolean logic."},
                {"id": "opt_b", "label": "Because '1'='1' evaluates to TRUE for every single row in the database", "isCorrect": True, "feedback": "Spot on! 🔥 The WHERE clause condition `acc_id = '105' OR '1'='1'` evaluates to TRUE for every row, returning the entire table."},
                {"id": "opt_c", "label": "Because the web server treats the single quote as an escape character for passwords", "isCorrect": False, "feedback": "The single quote terminates the string literal within the SQL grammar."},
                {"id": "opt_d", "label": "Because HTTP POST requests automatically bypass SQL WHERE clauses", "isCorrect": False, "feedback": "HTTP methods have nothing to do with database WHERE clause evaluation."}
            ],
            "correctFeedback": "Exact! In Boolean SQLi, injecting an always-true condition forces the database to match all records regardless of the original constraint.",
            "incorrectFeedback": "Analyze how SQL evaluates `WHERE condition1 OR condition2` when condition2 is `'1'='1'`."
        },
        practice_task={
            "title": "Now Use It: Secure Login Query with Parameterization",
            "description": "Write a secure Python SQLite query using parameter placeholders (?) instead of formatted strings.",
            "problemType": "coding",
            "starterSnippet": "import sqlite3\n\ndef secure_authenticate(conn: sqlite3.Connection, username: str, password_hash: str):\n    cursor = conn.cursor()\n    # Use parameterized placeholders (?) to neutralize SQL Injection\n    query = \"SELECT id, email, role FROM users WHERE username = ? AND password_hash = ?\"\n    cursor.execute(query, (username, password_hash))\n    return cursor.fetchone()",
            "hint": "Never use f-strings or % formatting inside .execute() queries.",
            "externalLinkText": "OWASP SQL Injection Prevention Cheat Sheet ↗",
            "externalLinkUrl": "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"
        }
    )
    db.add(lesson_cyber)

    # 5. SOFTWARE DEVELOPER (SDE) STORY: The Bug That Only Appeared on Friday
    lesson_sde = Lesson(
        id="story_sde_01",
        concept_id="c_sde_complexity",
        level_id="lvl_sde_01",
        title="The Bug That Only Appeared on Friday",
        role_context='Backend SDE at "RideNow" (Cab Hailing Platform, Hyderabad)',
        story_content={
            "premise": "RideNow's driver matching service runs in 5 milliseconds on your local laptop with 10 test drivers. But at 8:00 PM on Friday night, with 50,000 live drivers and riders in Bengaluru, the matching engine freezes completely.",
            "dilemma": "The matching code uses a nested loop `O(N^2)` that compares every rider against every driver repeatedly. With 50,000 users, 2.5 billion iterations lock the CPU thread, causing massive surge price spikes and app crashes.",
            "objective": "Analyze asymptotic time complexity, replace brute-force nested loops with Hash Map indexing to achieve O(N) linear time, and restore sub-10ms response latency."
        },
        explanation="Asymptotic Big-O complexity measures how an algorithm's runtime and memory requirements scale as input size N grows toward infinity. An O(N^2) algorithm might feel fast on small test datasets but explodes exponentially under production scale.",
        analogy={
            "title": "Finding Names in a 1,000-Page Phone Directory 📖",
            "story": "If you check every single phone number on every single page one by one from start to finish (Brute Force O(N)), it will take you 3 days. If you flip directly to the letter 'S' using the alphabetical tab index (Hash Map O(1)), you find your friend's number in 2 seconds!",
            "icon": "⚡"
        },
        visual_diagram_flow=[
            {"step": 1, "actor": "Benchmark Audit", "action": "Profile Slow Endpoint", "desc": "Measures 45,000ms latency on 50,000 driver array with O(N^2) loop."},
            {"step": 2, "actor": "Complexity Analysis", "action": "Identify Bottleneck", "desc": "Calculates (50,000)^2 = 2,500,000,000 CPU comparison operations."},
            {"step": 3, "actor": "Data Structure Shift", "action": "Construct Spatial Hash Map", "desc": "Buckets drivers into geo-hash keys for instantaneous O(1) lookups."},
            {"step": 4, "actor": "Refactor Code", "action": "Linear Scan O(N)", "desc": "Replaces nested loop with single pass: for each rider, lookup matching bucket."},
            {"step": 5, "actor": "Production Verification", "action": "Sub-10ms Dispatch", "desc": "Dispatches 50,000 matches in 8ms with zero CPU thread blockage."}
        ],
        golden_rule="Optimize data structures before micro-optimizing code. The right data structure can drop complexity from exponential or quadratic to logarithmic or constant.",
        common_mistakes=[
            "Mistake 1: Testing algorithms only on small sample inputs (N=10) and assuming it will scale to production (N=100,000).",
            "Mistake 2: Forgetting that array lookups with .includes() or .indexOf() inside a for-loop create hidden O(N^2) complexity.",
            "Mistake 3: Sacrificing code readability when a simple standard hash map is already optimal."
        ],
        interactive_moment={
            "prompt": "Arrange asymptotic time complexities from Fastest (Best) to Slowest (Worst):",
            "correctOrder": [
                "1. O(1) Constant Time (Direct Hash Map lookup)",
                "2. O(log N) Logarithmic Time (Binary Search)",
                "3. O(N) Linear Time (Single Pass iteration)",
                "4. O(N log N) Linearithmic Time (Merge Sort / Timsort)",
                "5. O(N^2) Quadratic Time (Nested brute-force loops)"
            ],
            "initialItems": [
                "3. O(N) Linear Time (Single Pass iteration)",
                "1. O(1) Constant Time (Direct Hash Map lookup)",
                "5. O(N^2) Quadratic Time (Nested brute-force loops)",
                "2. O(log N) Logarithmic Time (Binary Search)",
                "4. O(N log N) Linearithmic Time (Merge Sort / Timsort)"
            ],
            "hints": [
                "Constant time O(1) is always the absolute fastest.",
                "Dividing the search space in half gives logarithmic O(log N).",
                "Nested loops multiply input lengths, leading to quadratic O(N^2)."
            ],
            "explanationAfterSuccess": "Brilliant! By replacing O(N^2) nested search with an O(1) Hash Map lookup, RideNow's Friday night dispatch latency dropped from 45 seconds to 8 milliseconds!"
        },
        mini_challenge={
            "question": "If an O(N^2) algorithm takes 1 millisecond to process 1,000 items, approximately how long will it take to process 100,000 items (100 times larger input)?",
            "context": "Asymptotic Scaling & System Engineering",
            "options": [
                {"id": "opt_a", "label": "100 milliseconds (0.1 seconds)", "isCorrect": False, "feedback": "That would be linear O(N) scaling, not quadratic O(N^2)!"},
                {"id": "opt_b", "label": "10,000 milliseconds (10 seconds)", "isCorrect": True, "feedback": "Spot on! 🎯 Scaling factor = 100x. For O(N^2), time increases by (100)^2 = 10,000x. 1ms * 10,000 = 10 seconds!"},
                {"id": "opt_c", "label": "1,000 milliseconds (1 second)", "isCorrect": False, "feedback": "Review quadratic scaling: (100)^2 = 10,000 times increase."},
                {"id": "opt_d", "label": "1,000,000 milliseconds (16 minutes)", "isCorrect": False, "feedback": "That would be cubic O(N^3) scaling."}
            ],
            "correctFeedback": "Spot on! In quadratic time, a 100x increase in data causes a 10,000x increase in execution time.",
            "incorrectFeedback": "Calculate (New Input / Old Input)^2 and multiply by the base 1ms duration."
        },
        practice_task={
            "title": "Now Use It: Optimize Two Sum from O(N^2) to O(N)",
            "description": "Write an optimal solution for Two Sum using a Python dictionary in a single pass.",
            "problemType": "coding",
            "starterSnippet": "def two_sum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []",
            "hint": "Store each visited number's index in the hash map and check for target - num in O(1).",
            "externalLinkText": "Explore Big-O Cheat Sheet ↗",
            "externalLinkUrl": "https://www.bigocheatsheet.com/"
        }
    )
    db.add(lesson_sde)

    # 6. FULL STACK DEVELOPER STORY: The Button That Did Nothing
    lesson_fs = Lesson(
        id="story_fs_01",
        concept_id="c_fs_arch",
        level_id="lvl_fs_01",
        title="The Button That Did Nothing",
        role_context='Full Stack Engineer at "SaaSify" (Cloud Workspace, Pune)',
        story_content={
            "premise": "Users click the glowing 'Upgrade to Pro' button on SaaSify's dashboard. The button spinner spins forever, the user is charged on Stripe, but their account status remains 'Free Tier' even after page refresh.",
            "dilemma": "The React frontend never listened for the webhook confirmation, the Node.js API failed silently without sending a JSON error status, and the PostgreSQL database transaction rolled back due to an unhandled foreign key mismatch.",
            "objective": "Wire the end-to-end full stack pipeline: React form mutation -> REST API route -> PostgreSQL atomic transaction -> State re-render."
        },
        explanation="Full stack engineering requires seamless communication across three distinct tiers: the Client presentation layer (React), the API business logic layer (Node/Express), and the Data persistence layer (PostgreSQL).",
        analogy={
            "title": "The Restaurant Kitchen Line 🍳",
            "story": "The customer orders at the table from the menu (React UI). The waiter writes down the order and carries the ticket to the kitchen hatch (REST API Endpoint). The chef cooks the meal, deducts ingredients from the pantry, and logs the invoice in the register (Database Transaction). Finally, the waiter brings the hot dish back to the customer's table (State Sync)!",
            "icon": "⚡"
        },
        visual_diagram_flow=[
            {"step": 1, "actor": "React Frontend", "action": "Submit Mutation", "desc": "Sends POST /api/v1/subscriptions with Bearer token & plan payload."},
            {"step": 2, "actor": "Node.js Controller", "action": "Validate & Authorize", "desc": "Validates schema with Zod and verifies JWT session authenticity."},
            {"step": 3, "actor": "PostgreSQL Engine", "action": "Atomic Transaction", "desc": "BEGIN -> UPDATE users SET plan='pro' -> INSERT audit_log -> COMMIT."},
            {"step": 4, "actor": "Express API", "action": "Return 200 JSON", "desc": "Sends JSON response: { success: true, tier: 'pro', expiresAt: '2027-01-01' }."},
            {"step": 5, "actor": "React Query Store", "action": "Invalidate & Re-render", "desc": "Updates user context store and unlocks Pro tier dashboard badges."}
        ],
        golden_rule="Always wrap multi-step database mutations in atomic transactions (ACID). If one step fails, rollback everything to keep data completely consistent.",
        common_mistakes=[
            "Mistake 1: Updating frontend UI state before confirming backend API success (Optimistic updates without rollback handlers).",
            "Mistake 2: Storing sensitive API secrets or database credentials inside frontend React environment variables.",
            "Mistake 3: Omitting proper HTTP status codes (e.g. returning 200 OK with an error message body)."
        ],
        interactive_moment={
            "prompt": "Arrange the 5 steps of an end-to-end Full Stack mutation lifecycle:",
            "correctOrder": [
                "1. React component dispatches async POST request with payload",
                "2. Node.js backend middleware verifies JWT authentication",
                "3. Database executes atomic SQL transaction (BEGIN -> COMMIT)",
                "4. Backend sends 200 OK JSON response with updated record",
                "5. Frontend updates global state store and re-renders Pro UI"
            ],
            "initialItems": [
                "3. Database executes atomic SQL transaction (BEGIN -> COMMIT)",
                "1. React component dispatches async POST request with payload",
                "5. Frontend updates global state store and re-renders Pro UI",
                "2. Node.js backend middleware verifies JWT authentication",
                "4. Backend sends 200 OK JSON response with updated record"
            ],
            "hints": [
                "The user interaction in the UI is always step 1.",
                "Authentication and validation happen on the server before database writes.",
                "UI store synchronization completes the cycle after server 200 response."
            ],
            "explanationAfterSuccess": "Connected end-to-end! 🚀 The subscription pipeline is now rock solid across React, Express, and PostgreSQL."
        },
        mini_challenge={
            "question": "A user clicks 'Upgrade Account', the database updates successfully, but the server crashes before sending the HTTP response. What happens on the frontend if the request times out without proper retry logic?",
            "context": "Full Stack Distributed State Synchronization",
            "options": [
                {"id": "opt_a", "label": "The browser automatically reverts the PostgreSQL database record", "isCorrect": False, "feedback": "The browser has no direct access to PostgreSQL database transactions!"},
                {"id": "opt_b", "label": "The frontend shows an error even though the database was updated (State desynchronization)", "isCorrect": True, "feedback": "Spot on! 🎯 The client assumes failure, causing UI state mismatch until the user refreshes or a sync endpoint runs."},
                {"id": "opt_c", "label": "The React component re-renders into Pro tier automatically via browser telepathy", "isCorrect": False, "feedback": "React state only updates through explicit setState calls or WebSocket messages."},
                {"id": "opt_d", "label": "The user's credit card is refunded by the DNS server", "isCorrect": False, "feedback": "DNS only resolves domain names to IP addresses."}
            ],
            "correctFeedback": "Spot on! Handling partial network failures requires robust synchronization endpoints and idempotent retries.",
            "incorrectFeedback": "Consider what the frontend knows if the HTTP response packet never arrived."
        },
        practice_task={
            "title": "Now Use It: Express Async Route with Error Handling",
            "description": "Write a clean Express.js route handler that wraps database operations in try/catch and returns structured JSON errors.",
            "problemType": "coding",
            "starterSnippet": "app.post('/api/subscribe', async (req, res) => {\n  try {\n    const { userId, plan } = req.body;\n    if (!userId || !plan) {\n      return res.status(400).json({ error: 'Missing required parameters' });\n    }\n    const updatedUser = await db.user.update({\n      where: { id: userId },\n      data: { tier: plan }\n    });\n    return res.status(200).json({ success: true, user: updatedUser });\n  } catch (error) {\n    return res.status(500).json({ error: 'Internal Server Error', message: error.message });\n  }\n});",
            "hint": "Always return distinct status codes: 400 for client validation errors, 500 for server exceptions.",
            "externalLinkText": "Express Routing Guide ↗",
            "externalLinkUrl": "https://expressjs.com/en/guide/routing.html"
        }
    )
    db.add(lesson_fs)

    # 7. APP DEVELOPER STORY: The App That Forgot Everything
    lesson_app = Lesson(
        id="story_app_01",
        concept_id="c_app_lifecycle",
        level_id="lvl_app_01",
        title="The App That Forgot Everything",
        role_context='Mobile App Developer at "MetroGo" (Smart Transit App, Delhi)',
        story_content={
            "premise": "Commuters purchase Metro tickets on the MetroGo mobile app above ground. But the second they step into the underground metro tunnel where 4G signals disappear, the ticket screen blanks out and resets to the home screen.",
            "dilemma": "The mobile app relied 100% on live network API requests and had zero local caching or offline storage. When offline, all components unmounted with null pointer exceptions, stranding thousands of passengers at the turnstiles.",
            "objective": "Build an offline-first architecture with local SQLite/AsyncStorage persistence, manage mobile app lifecycle state, and render cached QR tickets instantly with zero network."
        },
        explanation="Mobile applications operate in unstable, intermittent network environments. An offline-first mobile architecture stores data locally on the physical device first, allowing instant UI rendering regardless of internet connectivity.",
        analogy={
            "title": "The Physical Ticket in Your Pocket 🎟️",
            "story": "When you board a train, you don't call the central railway headquarters on your phone every time the ticket checker walks past your seat. You keep the printed ticket right in your shirt pocket so you can produce it instantly anywhere!",
            "icon": "📱"
        },
        visual_diagram_flow=[
            {"step": 1, "actor": "Network API", "action": "Fetch Ticket Payload", "desc": "Receives QR ticket data and signature from MetroGo backend."},
            {"step": 2, "actor": "Device Storage", "action": "Write to AsyncStorage", "desc": "Persists encrypted ticket object locally in device flash memory."},
            {"step": 3, "actor": "Network Monitor", "action": "Detect Connection Loss", "desc": "NetInfo listener detects zero cellular connectivity underground."},
            {"step": 4, "actor": "Offline Cache Layer", "action": "Hydrate from Local DB", "desc": "Instantly reads stored ticket from local storage in 2 milliseconds."},
            {"step": 5, "actor": "Mobile View", "action": "Render Offline QR", "desc": "Displays high-brightness QR code with offline-verified badge."}
        ],
        golden_rule="Cache on write, read from local storage, and synchronize in the background. Mobile apps must never show an empty blank screen when offline.",
        common_mistakes=[
            "Mistake 1: Blocking the UI thread with heavy synchronous disk reads on mobile startup.",
            "Mistake 2: Failing to handle AppState changes when the app goes into the background or phone sleeps.",
            "Mistake 3: Storing unencrypted sensitive biometric or authentication keys in plain AsyncStorage."
        ],
        interactive_moment={
            "prompt": "Arrange the 5 steps of an Offline-First Mobile Data Flow in chronological order:",
            "correctOrder": [
                "1. App downloads ticket payload from cloud API while online",
                "2. App saves ticket record to device local storage (AsyncStorage)",
                "3. User enters underground tunnel and loses internet connection",
                "4. User opens app; UI loads ticket directly from device local cache",
                "5. Network restored; background worker syncs validation timestamp"
            ],
            "initialItems": [
                "4. User opens app; UI loads ticket directly from device local cache",
                "1. App downloads ticket payload from cloud API while online",
                "3. User enters underground tunnel and loses internet connection",
                "2. App saves ticket record to device local storage (AsyncStorage)",
                "5. Network restored; background worker syncs validation timestamp"
            ],
            "hints": [
                "Saving to local storage must happen while online.",
                "Losing connection happens next.",
                "Offline hydration renders the cached ticket instantly."
            ],
            "explanationAfterSuccess": "Flawless mobile architecture! 📱 MetroGo commuters can now pass through underground turnstiles with sub-50ms instant ticket scans without needing cellular reception."
        },
        mini_challenge={
            "question": "When a user switches from your React Native app to answer an incoming phone call, what AppState lifecycle state does the mobile operating system transition into?",
            "context": "Mobile App Lifecycle Management (iOS & Android)",
            "options": [
                {"id": "opt_a", "label": "Destroyed immediately with memory wiped", "isCorrect": False, "feedback": "Modern mobile OSes keep background apps in memory unless RAM pressure forces termination."},
                {"id": "opt_b", "label": "'background' or 'inactive'", "isCorrect": True, "feedback": "Spot on! 🎯 The OS signals `inactive` or `background`, allowing you to pause timers and persist unsaved state."},
                {"id": "opt_c", "label": "Overclocked mode", "isCorrect": False, "feedback": "Background apps are throttled to save battery, never overclocked."},
                {"id": "opt_d", "label": "'unmounted' root tree", "isCorrect": False, "feedback": "The React component tree stays mounted in memory while backgrounded."}
            ],
            "correctFeedback": "Spot on! Listening to AppState changes enables mobile apps to save draft form state and pause media playback when backgrounded.",
            "incorrectFeedback": "Think about whether the app is running in the foreground or background when the phone app takes over the screen."
        },
        practice_task={
            "title": "Now Use It: React Native AsyncStorage Cache Helper",
            "description": "Write a TypeScript helper to save and retrieve cached JSON data safely with error handling.",
            "problemType": "coding",
            "starterSnippet": "import AsyncStorage from '@react-native-async-storage/async-storage';\n\nexport const cacheData = async (key: string, value: any): Promise<void> => {\n  try {\n    const jsonValue = JSON.stringify(value);\n    await AsyncStorage.setItem(key, jsonValue);\n  } catch (e) {\n    console.error('Failed to save to local storage', e);\n  }\n};\n\nexport const getCachedData = async <T>(key: string): Promise<T | null> => {\n  try {\n    const jsonValue = await AsyncStorage.getItem(key);\n    return jsonValue != null ? JSON.parse(jsonValue) : null;\n  } catch (e) {\n    console.error('Failed to read from local storage', e);\n    return null;\n  }\n};",
            "hint": "Always wrap AsyncStorage operations in try/catch blocks because device storage writes can fail under low disk space.",
            "externalLinkText": "React Native AppState Docs ↗",
            "externalLinkUrl": "https://reactnative.dev/docs/appstate"
        }
    )
    db.add(lesson_app)

    # 8. PRODUCT DESIGNER STORY: The Button Everyone Ignored
    lesson_pd = Lesson(
        id="story_pd_01",
        concept_id="c_pd_hierarchy",
        level_id="lvl_pd_01",
        title="The Button Everyone Ignored",
        role_context='Product Designer at "EduLearn" (EdTech Platform, Bengaluru)',
        story_content={
            "premise": "EduLearn launched an ambitious 'Join Live Masterclass' feature. Out of 100,000 students visiting the course homepage, only 12 people clicked the registration button.",
            "dilemma": "When you audit the page, you discover the primary CTA button is washed-out gray (#CCCCCC), placed below 5 walls of unformatted dense text, and is visually smaller than the secondary 'Cancel' link.",
            "objective": "Restructure visual hierarchy, apply the F-shaped reading pattern, utilize WCAG AA high-contrast design tokens, and transform conversion rates."
        },
        explanation="Visual hierarchy is the deliberate arrangement of UI elements in order of visual importance. Through contrast, scale, white space, and color weight, designers guide the human eye effortlessly toward primary objectives.",
        analogy={
            "title": "Highway Traffic Signboards 🛣️",
            "story": "You don't read dense 10-point paragraphs while driving at 100 km/h on an expressway. Critical exit signboards are massive, colored in high-contrast vibrant green, and placed directly in your natural eye line so you understand them in 200 milliseconds!",
            "icon": "🎨"
        },
        visual_diagram_flow=[
            {"step": 1, "actor": "UX Audit", "action": "Heatmap & Friction Analysis", "desc": "Identifies 94% user drop-off before reaching the bottom of the page."},
            {"step": 2, "actor": "Layout Architecture", "action": "F-Pattern Restructuring", "desc": "Positions hero title, value propositions, and primary CTA above the fold."},
            {"step": 3, "actor": "Design System", "action": "Color Contrast & Scale", "desc": "Applies 4.5:1 WCAG AA contrast ratio with vibrant brand accent token."},
            {"step": 4, "actor": "Micro-Interaction", "action": "Hover & Tap States", "desc": "Adds smooth spring hover transitions and clear tactile feedback states."},
            {"step": 5, "actor": "A/B Validation", "action": "Usability Verification", "desc": "Measures 320% increase in masterclass registrations across 10,000 visitors."}
        ],
        golden_rule="Every screen should have exactly ONE primary action. If everything looks bold and important, nothing is important.",
        common_mistakes=[
            "Mistake 1: Placing primary conversion actions below the fold without visual anchors.",
            "Mistake 2: Using low-contrast gray text on white backgrounds that fails accessibility standards.",
            "Mistake 3: Giving secondary actions (like 'Cancel' or 'Back') the same visual weight as the primary action."
        ],
        interactive_moment={
            "prompt": "Arrange the 5 steps of a UX Visual Hierarchy Redesign in order:",
            "correctOrder": [
                "1. Audit user heatmaps to locate friction and drop-off points",
                "2. Define 1 clear primary action and subordinate secondary links",
                "3. Apply 60-30-10 color rule and WCAG AA contrast compliance",
                "4. Introduce generous whitespace and modular typography scale",
                "5. Launch A/B test to measure conversion and task completion rate"
            ],
            "initialItems": [
                "3. Apply 60-30-10 color rule and WCAG AA contrast compliance",
                "1. Audit user heatmaps to locate friction and drop-off points",
                "5. Launch A/B test to measure conversion and task completion rate",
                "2. Define 1 clear primary action and subordinate secondary links",
                "4. Introduce generous whitespace and modular typography scale"
            ],
            "hints": [
                "Start with empirical user drop-off data.",
                "Establish clear primary vs secondary action roles.",
                "Validate the redesign with live A/B usability metrics."
            ],
            "explanationAfterSuccess": "Spectacular design execution! 🎨 EduLearn's masterclass registration conversion rate soared from 0.012% to 4.8% with the new visual hierarchy."
        },
        mini_challenge={
            "question": "According to WCAG 2.1 AA accessibility guidelines, what is the minimum contrast ratio required for standard body text against its background?",
            "context": "Accessibility & Inclusive Design Standards",
            "options": [
                {"id": "opt_a", "label": "2.0 : 1", "isCorrect": False, "feedback": "2:1 is unreadable for users with low vision or in bright sunlight."},
                {"id": "opt_b", "label": "4.5 : 1", "isCorrect": True, "feedback": "Spot on! 🎯 WCAG AA requires at least 4.5:1 for normal text and 3:1 for large text (18pt+)."},
                {"id": "opt_c", "label": "10.0 : 1", "isCorrect": False, "feedback": "10:1 exceeds standard AA requirements (AAA requires 7:1)."},
                {"id": "opt_d", "label": "1.5 : 1", "isCorrect": False, "feedback": "1.5:1 is practically invisible contrast."}
            ],
            "correctFeedback": "Spot on! 4.5:1 is the gold standard for WCAG AA compliance, ensuring readability across diverse devices and lighting conditions.",
            "incorrectFeedback": "Recall the standard minimum ratio for normal text under WCAG AA level guidelines."
        },
        practice_task={
            "title": "Now Use It: Design Token Hierarchy in CSS",
            "description": "Write semantic CSS custom properties defining a harmonious visual hierarchy with primary, secondary, and surface tokens.",
            "problemType": "coding",
            "starterSnippet": ":root {\n  /* Color Hierarchy */\n  --color-primary-cta: #244B3A;\n  --color-primary-cta-hover: #1b382b;\n  --color-secondary-action: #EAE6DF;\n  --color-text-primary: #171717;\n  --color-text-muted: #5C6470;\n  --color-surface-card: #FFFFFF;\n  \n  /* Typography Scale */\n  --font-size-hero: 2.5rem;    /* 40px */\n  --font-size-heading: 1.5rem; /* 24px */\n  --font-size-body: 1rem;      /* 16px */\n  --font-size-caption: 0.875rem; /* 14px */\n}",
            "hint": "Using CSS variables ensures instant theme adaptability and consistent design token inheritance across components.",
            "externalLinkText": "WebAIM Color Contrast Checker ↗",
            "externalLinkUrl": "https://webaim.org/resources/contrastchecker/"
        }
    )
    db.add(lesson_pd)

    # 9. GATE CSE STORY: Four Programs. One Computer.
    lesson_gate_proc = Lesson(
        id="story_gate_proc_01",
        concept_id="c_gate_proc",
        level_id="lvl_gate_01",
        title="Four Programs. One Computer.",
        role_context="Kernel Architect & OS Diagnostics Specialist (GATE CSE Foundations)",
        story_content={
            "premise": "A single-core onboard microprocessor must manage 4 mission-critical programs simultaneously: Flight Path Navigation (P1), Sensor Polling (P2), Audio Telemetry (P3), and Battery Health Monitor (P4).",
            "dilemma": "If any one process gets stuck in an infinite loop, the entire computer freezes and telemetry crashes. The physical CPU only has a single hardware execution core.",
            "objective": "Implement Process Control Blocks (PCB), hardware timer interrupts, preemption mechanics, and Round-Robin CPU scheduling to guarantee fair CPU time slices."
        },
        explanation="A Process is a program in execution containing program code, data, heap, and call stack. The Operating System creates the illusion of simultaneous multi-tasking on a single CPU core via rapid Context Switching governed by hardware timer interrupts and scheduling algorithms.",
        analogy={
            "title": "The Master Chef with One Single Stove 👨‍🍳",
            "story": "A world-class chef is cooking 4 distinct gourmet dishes on a stove with only 1 burner! The chef cooks Dish 1 for 2 minutes (Time Slice), writes the exact spice temperature on a sticky note (PCB save), swaps pan to Dish 2 for 2 minutes, and repeats. To the customers, all 4 dishes appear to be cooking at the exact same time!",
            "icon": "🖥️"
        },
        visual_diagram_flow=[
            {"step": 1, "actor": "Hardware Timer", "action": "Periodic Interrupt", "desc": "Hardware clock triggers interrupt every time quantum Q=10ms."},
            {"step": 2, "actor": "CPU Mode Switch", "action": "User -> Kernel Mode", "desc": "CPU transitions from User Mode to Kernel Mode privilege."},
            {"step": 3, "actor": "Context Saver", "action": "Save to PCB_1", "desc": "Stores CPU registers, Program Counter (PC), and stack pointer into PCB_1."},
            {"step": 4, "actor": "Kernel Scheduler", "action": "Select Next Ready Process", "desc": "Picks next process from Ready Queue using Round-Robin policy."},
            {"step": 5, "actor": "Context Restorer", "action": "Load from PCB_2 & Resume", "desc": "Loads PCB_2 registers and switches back to User Mode execution."}
        ],
        golden_rule="Context switching overhead is pure system waste: no useful user work is accomplished while saving and loading PCBs. Time quantum Q must be tuned larger than context switch overhead.",
        common_mistakes=[
            "Mistake 1: Believing a single CPU core executes multiple processes at the exact same instant (It is time-sliced concurrency, not true hardware parallelism).",
            "Mistake 2: Forgetting that if Round Robin quantum Q is excessively large, it degenerates into First-Come-First-Served (FCFS).",
            "Mistake 3: Confusing Process (independent address space) with Thread (shared address space within process)."
        ],
        interactive_moment={
            "prompt": "Arrange the 5 critical stages of a Kernel CPU Context Switch in exact hardware sequence:",
            "correctOrder": [
                "1. Hardware timer interrupt fires, signaling end of time slice",
                "2. CPU switches privilege from User Mode to Kernel Mode",
                "3. Kernel saves current process registers & Program Counter to PCB_1",
                "4. CPU Scheduler selects next Ready process from queue",
                "5. Kernel loads PCB_2 registers and switches CPU to User Mode"
            ],
            "initialItems": [
                "3. Kernel saves current process registers & Program Counter to PCB_1",
                "1. Hardware timer interrupt fires, signaling end of time slice",
                "5. Kernel loads PCB_2 registers and switches CPU to User Mode",
                "2. CPU switches privilege from User Mode to Kernel Mode",
                "4. CPU Scheduler selects next Ready process from queue"
            ],
            "hints": [
                "Hardware timer interrupt is always the initial trigger.",
                "Mode switch into kernel mode must occur before saving system state.",
                "Loading new PCB registers and resuming execution finishes the switch."
            ],
            "explanationAfterSuccess": "Outstanding kernel mastery! 🖥️ You executed a clean CPU context switch in under 2 microseconds, ensuring fair Round-Robin execution across all 4 system tasks."
        },
        mini_challenge={
            "question": "In a Round-Robin CPU scheduling algorithm with time quantum Q, what happens if Q is set larger than the longest process burst time?",
            "context": "GATE CSE Operating Systems — Scheduling Algorithms",
            "options": [
                {"id": "opt_a", "label": "It causes system deadlock", "isCorrect": False, "feedback": "CPU scheduling algorithms do not cause deadlocks."},
                {"id": "opt_b", "label": "It degenerates into First-Come First-Served (FCFS)", "isCorrect": True, "feedback": "Spot on! 🎯 If every process completes its entire burst before Q expires, no preemption occurs, exactly behaving as FCFS."},
                {"id": "opt_c", "label": "Context switching overhead increases to infinity", "isCorrect": False, "feedback": "Context switches actually decrease to a minimum because each process runs to completion."},
                {"id": "opt_d", "label": "Shortest Job First (SJF) optimal behavior is achieved", "isCorrect": False, "feedback": "FCFS does not prioritize shortest burst times."}
            ],
            "correctFeedback": "Spot on! When Q >= Max(Burst_Time), no preemption occurs and Round-Robin behaves identically to FCFS.",
            "incorrectFeedback": "Think about what happens if every process finishes before the timer interrupt ever fires."
        },
        practice_task={
            "title": "GATE PYQ Drill: Round Robin Average Waiting Time",
            "description": "Calculate average waiting time for 3 processes P1(burst=6), P2(burst=4), P3(burst=2) with time quantum Q=2 (all arriving at t=0).",
            "problemType": "system-design",
            "hint": "Draw the Gantt chart: [P1: 0-2] -> [P2: 2-4] -> [P3: 4-6 (finishes)] -> [P1: 6-8] -> [P2: 8-10 (finishes)] -> [P1: 10-12 (finishes)]. Completion times: P3=6, P2=10, P1=12. Waiting times: P1=12-6=6, P2=10-4=6, P3=6-2=4. Average = (6+6+4)/3 = 5.33.",
            "externalLinkText": "View GATE CSE 2024 Question Analysis ↗",
            "externalLinkUrl": "https://gate.iitk.ac.in"
        }
    )
    db.add(lesson_gate_proc)

    # 10. GATE DEADLOCK STORY (Level 5)
    lesson_deadlock = Lesson(
        id="story_gate_deadlock",
        concept_id="c_os_deadlock",
        level_id="lvl_gate_05",
        title="The 4-Process Traffic Jam at Scale",
        role_context="Kernel Diagnostics Specialist (High Performance OS Internals)",
        story_content={
            "premise": "Four worker threads in the database engine freeze simultaneously at midnight during peak billing.",
            "dilemma": "Process P1 holds Resource R1 and waits for R2. Process P2 holds R2 and waits for R3. Process P3 holds R3 and waits for R4. Process P4 holds R4 and waits for R1. CPU utilization drops to zero, and the kernel scheduler is completely paralyzed.",
            "objective": "Break down the Coffman conditions, identify the cyclic wait dependency graph, and execute Banker's Algorithm to restore system safety."
        },
        explanation="A Deadlock occurs when every process in a set is waiting for an event that only another process in the set can cause. The 4 Coffman conditions must hold simultaneously: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.",
        analogy={
            "title": "The 4-Way Single Lane Intersection 🚗",
            "story": "Imagine four cars arriving at a 4-way single-lane junction at the exact same moment. Each car moves into the center and attempts to turn right. Car A blocks Car B, Car B blocks Car C, Car C blocks Car D, and Car D blocks Car A. Nobody can move forward without backing up, but no car has reverse gear (No Preemption)!",
            "icon": "🚦"
        },
        visual_diagram_flow=[
            {"step": 1, "actor": "Process P1", "action": "Allocated Resource R1", "desc": "P1 holds R1 and requests R2."},
            {"step": 2, "actor": "Process P2", "action": "Allocated Resource R2", "desc": "P2 holds R2 and requests R3."},
            {"step": 3, "actor": "Process P3", "action": "Allocated Resource R3", "desc": "P3 holds R3 and requests R4."},
            {"step": 4, "actor": "Process P4", "action": "Allocated Resource R4", "desc": "P4 holds R4 and requests R1 (Completing Circular Wait)."},
            {"step": 5, "actor": "Kernel Watchdog", "action": "Deadlock Detected", "desc": "Cycle detected in single-instance Resource Allocation Graph."}
        ],
        golden_rule="For single-instance resource systems: Cycle in RAG is NECESSARY and SUFFICIENT for deadlock. For multi-instance systems: Cycle is necessary but NOT sufficient.",
        common_mistakes=[
            "Mistake 1: Confusing Deadlock with Starvation (Starvation can resolve over time; Deadlock is permanent without intervention).",
            "Mistake 2: Assuming Banker's Algorithm prevents deadlocks by killing processes (Banker's algorithm avoids deadlocks by dynamically checking safe state before granting requests).",
            "Mistake 3: Forgetting that having a cycle in a multi-instance resource graph does NOT guarantee deadlock."
        ],
        interactive_moment={
            "prompt": "Arrange the 4 Coffman Conditions required for a Deadlock state to occur:",
            "correctOrder": [
                "1. Mutual Exclusion (Non-shareable resource access)",
                "2. Hold & Wait (Holding 1 resource while requesting another)",
                "3. No Preemption (Resources cannot be forcibly revoked)",
                "4. Circular Wait (Closed loop chain of waiting processes)"
            ],
            "initialItems": [
                "3. No Preemption (Resources cannot be forcibly revoked)",
                "1. Mutual Exclusion (Non-shareable resource access)",
                "4. Circular Wait (Closed loop chain of waiting processes)",
                "2. Hold & Wait (Holding 1 resource while requesting another)"
            ],
            "hints": [
                "Start with the hardware property: resources cannot be shared simultaneously.",
                "Processes then hold existing items while asking for more.",
                "The kernel refuses to forcibly snatch resources away.",
                "Finally, a cyclic chain forms where everyone waits on someone else."
            ],
            "explanationAfterSuccess": "Outstanding! By preventing ANY ONE of these four conditions, you mathematically eliminate the possibility of deadlock in operating systems."
        },
        mini_challenge={
            "question": "In a system with 3 processes (P0, P1, P2) sharing 12 magnetic tape drives, P0 requires a maximum of 10 drives and currently holds 5. P1 requires max 4 and holds 2. P2 requires max 9 and holds 2. What is the current state of the system?",
            "context": "Banker's Algorithm & Safe State Computation (GATE CSE Core Problem)",
            "options": [
                {"id": "opt_a", "label": "Safe State with sequence <P1, P0, P2>", "isCorrect": True, "feedback": "Correct! Available drives = 12 - (5+2+2) = 3. P1 needs 4 - 2 = 2 drives <= 3. P1 finishes and releases 2, total available = 5. P0 needs 10 - 5 = 5 <= 5. P0 finishes and releases 5, total available = 10. P2 needs 9 - 2 = 7 <= 10. Safe sequence exists!"},
                {"id": "opt_b", "label": "Deadlocked State immediately", "isCorrect": False, "feedback": "Available drives (3) are sufficient to satisfy P1's remaining need (2)."},
                {"id": "opt_c", "label": "Unsafe State with no safe sequence", "isCorrect": False, "feedback": "P1 -> P0 -> P2 is a valid safe execution sequence."},
                {"id": "opt_d", "label": "Livelocked State", "isCorrect": False, "feedback": "Livelock is dynamic state thrashing, not resource allocation constraint."}
            ],
            "correctFeedback": "Spot on! By computing Need = Max - Allocation and comparing against Available, you found the safe sequence <P1, P0, P2>.",
            "incorrectFeedback": "Check your available calculation: Total (12) - Allocated (5+2+2=9) = 3 drives remaining."
        },
        practice_task={
            "title": "GATE PYQ Drill: Resource Allocation Graph Analysis",
            "description": "Analyze an RAG with 4 processes and 2 resource types. Determine if the graph contains a knot and whether deadlock is guaranteed.",
            "problemType": "system-design",
            "hint": "Construct the adjacency matrix and run Tarjan's strongly connected components algorithm to detect cycle topology.",
            "externalLinkText": "View GATE CSE 2024 Question Analysis ↗",
            "externalLinkUrl": "https://gate.iitk.ac.in"
        }
    )
    db.add(lesson_deadlock)
    db.flush()

    # -------------------------------------------------------------
    # 8. SEED PROGRESS & MASTERY FOR DEMO USERS
    # -------------------------------------------------------------
    print("[*] Seeding demo user progress & masteries...")

    # Aarav Progress
    db.add(UserProgress(user_id=aarav.id, level_id="lvl_01", status="in_progress", progress_percentage=45, xp=60, started_at=now))
    for lvl_id in ["lvl_02", "lvl_03", "lvl_04", "lvl_05", "lvl_06", "lvl_07"]:
        db.add(UserProgress(user_id=aarav.id, level_id=lvl_id, status="locked", progress_percentage=0, xp=0))
    db.add(ConceptMastery(user_id=aarav.id, concept_id="c_web_works", mastery_score=85, attempts=3))

    # Meera Progress
    db.add(UserProgress(user_id=meera.id, level_id="lvl_ds_01", status="in_progress", progress_percentage=50, xp=70, started_at=now))
    for lvl_id in ["lvl_ds_02", "lvl_ds_03", "lvl_ds_04", "lvl_ds_05", "lvl_ds_06", "lvl_ds_07"]:
        db.add(UserProgress(user_id=meera.id, level_id=lvl_id, status="locked", progress_percentage=0, xp=0))
    db.add(ConceptMastery(user_id=meera.id, concept_id="c_ds_wrangling", mastery_score=90, attempts=4))

    # Kabir Progress
    db.add(UserProgress(user_id=kabir.id, level_id="lvl_cy_01", status="in_progress", progress_percentage=40, xp=55, started_at=now))
    for lvl_id in ["lvl_cy_02", "lvl_cy_03", "lvl_cy_04", "lvl_cy_05", "lvl_cy_06"]:
        db.add(UserProgress(user_id=kabir.id, level_id=lvl_id, status="locked", progress_percentage=0, xp=0))
    db.add(ConceptMastery(user_id=kabir.id, concept_id="c_cy_packets", mastery_score=80, attempts=3))

    # Ananya Progress
    db.add(UserProgress(user_id=ananya.id, level_id="lvl_gate_01", status="in_progress", progress_percentage=60, xp=90, started_at=now))
    for lvl_id in ["lvl_gate_02", "lvl_gate_03", "lvl_gate_04", "lvl_gate_05", "lvl_gate_06", "lvl_gate_07", "lvl_gate_08", "lvl_gate_09", "lvl_gate_10"]:
        db.add(UserProgress(user_id=ananya.id, level_id=lvl_id, status="locked", progress_percentage=0, xp=0))
    db.add(ConceptMastery(user_id=ananya.id, concept_id="c_gate_proc", mastery_score=92, attempts=5))

    # -------------------------------------------------------------
    # 9. SEED MISSIONS FOR DEMO USERS
    # -------------------------------------------------------------
    print("[*] Seeding tailored missions for all 4 demo users...")

    # Aarav Mission (Web Dev)
    m_aarav = Mission(id="mission_aarav_today", user_id=aarav.id, level_id="lvl_01", title="The Website That Couldn't Talk", subtitle="Track packets from the browser address bar to server return", duration_minutes=30, duration_category="30m", category="main", xp_reward=60, status="in_progress", completed=False, skills=["HTTP", "DNS", "REST APIs", "Network Debugging"])
    db.add(m_aarav)
    db.flush()
    for t in [
        {"id": "task_a1", "mission_id": m_aarav.id, "text": "Enter the story & diagnose ChaiPay blank page", "type": "story", "xp": 15, "completed": True},
        {"id": "task_a2", "mission_id": m_aarav.id, "text": "Understand HTTP & DNS resolution flow", "type": "concept", "xp": 15, "completed": True},
        {"id": "task_a3", "mission_id": m_aarav.id, "text": "Complete the Idempotency Key mini challenge", "type": "challenge", "xp": 15, "completed": False},
        {"id": "task_a4", "mission_id": m_aarav.id, "text": "Inspect practice fetch() code", "type": "reflect", "xp": 15, "completed": False}
    ]:
        db.add(MissionTask(**t))

    # Meera Mission (Data Science)
    m_meera = Mission(id="mission_meera_today", user_id=meera.id, level_id="lvl_ds_01", title="The Dataset That Lied", subtitle="Clean corrupt flash sale logs & calculate true median GMV", duration_minutes=45, duration_category="45m", category="main", xp_reward=75, status="in_progress", completed=False, skills=["Pandas", "Data Wrangling", "Outlier Detection", "Statistics"])
    db.add(m_meera)
    db.flush()
    for t in [
        {"id": "task_m1", "mission_id": m_meera.id, "text": "Enter the QuickMart revenue data story", "type": "story", "xp": 20, "completed": True},
        {"id": "task_m2", "mission_id": m_meera.id, "text": "Order the 5 stages of the data cleaning pipeline", "type": "concept", "xp": 20, "completed": True},
        {"id": "task_m3", "mission_id": m_meera.id, "text": "Solve the IQR Outlier vs Median challenge", "type": "challenge", "xp": 20, "completed": False},
        {"id": "task_m4", "mission_id": m_meera.id, "text": "Review Pandas boolean indexing starter code", "type": "reflect", "xp": 15, "completed": False}
    ]:
        db.add(MissionTask(**t))

    # Kabir Mission (Cybersecurity)
    m_kabir = Mission(id="mission_kabir_today", user_id=kabir.id, level_id="lvl_cy_01", title="The Login That Shouldn't Exist", subtitle="Investigate 3:14 AM admin bypass & patch SQL injection", duration_minutes=40, duration_category="40m", category="main", xp_reward=70, status="in_progress", completed=False, skills=["SQL Injection", "Wireshark", "Prepared Statements", "Bcrypt"])
    db.add(m_kabir)
    db.flush()
    for t in [
        {"id": "task_k1", "mission_id": m_kabir.id, "text": "Audit Fortress Bank SOC 3:14 AM login logs", "type": "story", "xp": 20, "completed": True},
        {"id": "task_k2", "mission_id": m_kabir.id, "text": "Arrange the 5 stages of SQLi vulnerability defense", "type": "concept", "xp": 15, "completed": True},
        {"id": "task_k3", "mission_id": m_kabir.id, "text": "Solve the Boolean SQL Injection mini challenge", "type": "challenge", "xp": 20, "completed": False},
        {"id": "task_k4", "mission_id": m_kabir.id, "text": "Write parameterized SQLite authentication query", "type": "reflect", "xp": 15, "completed": False}
    ]:
        db.add(MissionTask(**t))

    # Ananya Mission (GATE CSE)
    m_ananya = Mission(id="mission_ananya_today", user_id=ananya.id, level_id="lvl_gate_01", title="Four Programs. One Computer.", subtitle="Conquer Process Control Blocks & CPU Context Switching", duration_minutes=60, duration_category="60m", category="main", xp_reward=90, status="in_progress", completed=False, skills=["Operating Systems", "Processes & PCB", "Context Switching", "Round Robin"])
    db.add(m_ananya)
    db.flush()
    for t in [
        {"id": "task_an1", "mission_id": m_ananya.id, "text": "Enter the 4-Process micro-controller story", "type": "story", "xp": 20, "completed": True},
        {"id": "task_an2", "mission_id": m_ananya.id, "text": "Master CPU privilege mode switch and PCB structure", "type": "concept", "xp": 25, "completed": True},
        {"id": "task_an3", "mission_id": m_ananya.id, "text": "Solve the Round Robin Quantum limit mini challenge", "type": "challenge", "xp": 25, "completed": False},
        {"id": "task_an4", "mission_id": m_ananya.id, "text": "Solve the GATE PYQ Waiting Time drill", "type": "practice", "xp": 20, "completed": False}
    ]:
        db.add(MissionTask(**t))

    # -------------------------------------------------------------
    # 10. SEED FLASHCARDS & SHORT NOTES
    # -------------------------------------------------------------
    print("[*] Seeding flashcards & short notes across domains...")
    flashcards_data = [
        {"id": "fc_01", "user_id": aarav.id, "topic": "Networking & HTTP", "category": "Web Foundations", "front": "What is the exact difference between HTTP 401 and HTTP 403?", "back": "401 Unauthorized means 'You are not authenticated (we do not know who you are)'. 403 Forbidden means 'We know who you are, but you lack permission to view this resource'.", "difficulty": "easy", "mastery_score": 75, "times_reviewed": 3},
        {"id": "fc_02", "user_id": aarav.id, "topic": "JavaScript", "category": "Web Foundations", "front": "What is a Closure in JavaScript, and why is it useful?", "back": "A closure is the combination of a function bundled with references to its lexical environment. It allows an inner function to remember and access variables from its outer scope even after the outer function has finished executing.", "code_snippet": "function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}", "difficulty": "medium", "mastery_score": 90, "times_reviewed": 6},
        {"id": "fc_03", "user_id": meera.id, "topic": "Statistics", "category": "Data Science Core", "front": "Why is Median preferred over Mean for income and salary distributions?", "back": "Mean is heavily sensitive to extreme high-earner outliers (billioneers skew the average). The Median (50th percentile) accurately represents the typical person in skewed non-normal distributions.", "difficulty": "easy", "mastery_score": 85, "times_reviewed": 4},
        {"id": "fc_04", "user_id": kabir.id, "topic": "Web Security", "category": "OWASP Defense", "front": "How do Parameterized Queries (Prepared Statements) stop SQL Injection?", "back": "They ensure the database compiler treats user input strictly as literal parameter data values rather than executable SQL syntax commands, regardless of what quotes or operators are entered.", "difficulty": "medium", "mastery_score": 95, "times_reviewed": 5},
        {"id": "fc_05", "user_id": ananya.id, "topic": "Operating Systems", "category": "GATE CSE Core", "front": "What are the 4 Coffman conditions for Deadlock?", "back": "1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait.\nAll 4 must hold simultaneously for a deadlock to exist.", "difficulty": "medium", "mastery_score": 90, "times_reviewed": 5},
        {"id": "fc_06", "user_id": ananya.id, "topic": "Operating Systems", "category": "GATE CSE Core", "front": "What is saved in a Process Control Block (PCB) during a context switch?", "back": "Process State, Program Counter (PC), CPU Registers, CPU Scheduling Info, Memory Management Info (page tables), and I/O status information.", "difficulty": "medium", "mastery_score": 92, "times_reviewed": 4}
    ]
    for fc in flashcards_data:
        db.add(Flashcard(**fc))

    notes_data = [
        {
            "id": "note_http_60s",
            "user_id": aarav.id,
            "title": "HTTP in 60 Seconds",
            "read_time": "60 SEC READ",
            "topic": "Networking",
            "category": "Web Architecture",
            "what_it_is": "HTTP (Hypertext Transfer Protocol) is an application-layer protocol for transmitting hypermedia documents. It operates on a request-response model between clients (browsers) and servers.",
            "think_of_it_like": "Sending a registered post envelope: The Request Header is the stamp and postal address; the Request Body is the letter inside; the Response Status (200, 404) is the postal delivery receipt.",
            "remember_this": [
                "HTTP is stateless: each request has no knowledge of past requests unless backed by Cookies or JWT tokens.",
                "GET retrieves data and must be safe (no side effects).",
                "POST creates new resources.",
                "Status 2xx = Success, 3xx = Redirection, 4xx = Client Error, 5xx = Server Error."
            ],
            "common_mistake": "Expecting fetch() in JavaScript to reject its Promise on 404 or 500. fetch() only rejects on network hardware failure or blocked CORS!",
            "is_saved": True
        },
        {
            "id": "note_proc_60s",
            "user_id": ananya.id,
            "title": "Processes & PCBs in 60 Seconds",
            "read_time": "60 SEC READ",
            "topic": "Operating Systems",
            "category": "GATE CSE Revision",
            "what_it_is": "A process is a program in active execution. The kernel maintains a Process Control Block (PCB) as the physical data structure representation of the process state.",
            "think_of_it_like": "A chef cooking multiple recipes on a single stove burner, saving the exact temperature and bookmark on a sticky note (PCB) before switching pans.",
            "remember_this": [
                "Context switch time is pure computational overhead.",
                "State transitions: New -> Ready -> Running -> Waiting -> Terminated.",
                "Round Robin with large quantum Q degenerates into FCFS."
            ],
            "common_mistake": "Confusing User Mode with Kernel Mode. System calls trigger a mode switch via software interrupts before kernel scheduler execution.",
            "is_saved": True
        }
    ]
    for n in notes_data:
        db.add(Note(**n))

    # -------------------------------------------------------------
    # 11. SEED CHALLENGES, SQUADS, FEED & OPPORTUNITIES
    # -------------------------------------------------------------
    print("[*] Seeding challenges, squads, feed and opportunities...")
    ch_data = [
        {
            "id": "boss_fest_landing",
            "title": "WEEKLY BOSS: Build the College Fest Ticketing Page",
            "difficulty": 3,
            "duration_minutes": 90,
            "skills": ["HTML5", "CSS Grid", "Responsive Design", "Form Validation"],
            "scenario": "Your college's annual cultural extravaganza 'Tarang 2026' is launching its ticket drop in 4 hours. The student council needs a high-converting, mobile-perfect landing page with responsive seat tier badges and sticky checkout bar.",
            "objective": "Construct a responsive landing page layout that passes 3 viewport test cases without horizontal scrollbar overflow.",
            "requirements": ["Semantic HTML5 hierarchy", "CSS Grid bento layout for tiers", "Sticky checkout bar on mobile", "WCAG AA contrast"],
            "xp_reward": 250,
            "badge_reward": "Fest Architect",
            "type": "boss"
        },
        {
            "id": "challenge_gate_pcb",
            "title": "GATE SPEED BOSS: Context Switch & Gantt Chart Simulator",
            "difficulty": 4,
            "duration_minutes": 30,
            "skills": ["Operating Systems", "CPU Scheduling", "Round Robin", "Gantt Charts"],
            "scenario": "A 4-process real-time telemetry kernel experiences severe scheduling jitter. Calculate exact turnaround and waiting times under Round-Robin Q=2 in under 3 minutes.",
            "objective": "Compute Gantt completion vector and output optimal process execution ordering.",
            "requirements": ["Draw Gantt chart", "Compute Completion Time matrix", "Calculate Average Waiting Time"],
            "xp_reward": 200,
            "badge_reward": "Kernel Strategist",
            "type": "speedrun"
        }
    ]
    for ch in ch_data:
        db.add(Challenge(**ch))

    print("[*] Seeding domain-specific flashcards across all 9 paths...")
    flashcards_data = [
        # 1. WEB DEVELOPER (Concept: c_web_works)
        {
            "id": "fc_web_01",
            "concept_id": "c_web_works",
            "topic": "HTTP Protocols",
            "category": "Web Foundations",
            "front": "What does HTTP define in a web application?",
            "back": "HTTP (Hypertext Transfer Protocol) defines the stateless request-response language between clients (browsers) and servers.",
            "difficulty": "easy",
            "confidence": 85,
            "mastery_score": 90,
            "times_reviewed": 5
        },
        {
            "id": "fc_web_02",
            "concept_id": "c_web_works",
            "topic": "Browser Rendering",
            "category": "Frontend & UI",
            "front": "What is the role of a browser engine in a web application?",
            "back": "It parses HTML into a DOM tree, merges it with the CSSOM to construct the Render Tree, computes Layout geometry, and paints pixels on screen.",
            "difficulty": "medium",
            "confidence": 80,
            "mastery_score": 85,
            "times_reviewed": 4
        },
        {
            "id": "fc_web_03",
            "concept_id": "c_web_works",
            "topic": "HTTP Status Codes",
            "category": "Web Foundations",
            "front": "What is the exact difference between HTTP 401 and HTTP 403?",
            "back": "401 Unauthorized means 'You are not authenticated (identity unknown)'. 403 Forbidden means 'We know who you are, but you lack permission to view this resource'.",
            "difficulty": "easy",
            "confidence": 95,
            "mastery_score": 95,
            "times_reviewed": 6
        },
        {
            "id": "fc_web_04",
            "concept_id": "c_web_works",
            "topic": "CSS Layout",
            "category": "Frontend & UI",
            "front": "When should you choose CSS Grid over Flexbox?",
            "back": "Choose Flexbox for 1-dimensional layouts (a single row of nav items or a column of inputs). Choose CSS Grid for 2-dimensional layouts where items align across both rows and columns simultaneously.",
            "difficulty": "easy",
            "confidence": 90,
            "mastery_score": 90,
            "times_reviewed": 5
        },
        {
            "id": "fc_web_05",
            "concept_id": "c_web_works",
            "topic": "JavaScript Scope",
            "category": "Web Foundations",
            "front": "What is a Closure in JavaScript, and why is it useful?",
            "back": "A closure is a function bundled with references to its surrounding lexical scope, allowing inner functions to access outer variables even after the outer function has completed execution.",
            "code_snippet": "function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}",
            "difficulty": "medium",
            "confidence": 75,
            "mastery_score": 80,
            "times_reviewed": 3
        },
        {
            "id": "fc_web_06",
            "concept_id": "c_web_works",
            "topic": "REST API Architecture",
            "category": "Backend & APIs",
            "front": "What is an Idempotent API operation?",
            "back": "An operation is idempotent if executing it multiple times produces the exact same server state and result as executing it once (e.g. GET, PUT, DELETE).",
            "difficulty": "hard",
            "confidence": 70,
            "mastery_score": 75,
            "times_reviewed": 3
        },
        {
            "id": "fc_web_07",
            "concept_id": "c_web_works",
            "topic": "React Optimization",
            "category": "Frontend & UI",
            "front": "Why must React Keys be unique and stable rather than array indices?",
            "back": "React uses keys during the Reconciliation diffing algorithm. Using array indices causes component state corruption and re-rendering performance bugs during list item insertions and deletions.",
            "difficulty": "medium",
            "confidence": 85,
            "mastery_score": 90,
            "times_reviewed": 4
        },

        # 2. DATA SCIENCE (Concept: c_ds_wrangling)
        {
            "id": "fc_ds_01",
            "concept_id": "c_ds_wrangling",
            "topic": "Descriptive Statistics",
            "category": "Data Science Core",
            "front": "When would you prefer the median over the mean?",
            "back": "When the dataset contains significant extreme outliers or heavy skew, because the median (50th percentile) is non-parametric and resistant to extreme values.",
            "difficulty": "easy",
            "confidence": 90,
            "mastery_score": 95,
            "times_reviewed": 5
        },
        {
            "id": "fc_ds_02",
            "concept_id": "c_ds_wrangling",
            "topic": "Statistical Association",
            "category": "Data Science Core",
            "front": "What does correlation measure between two variables?",
            "back": "Correlation measures the strength and linear direction of association between two continuous variables (-1 to +1). It does NOT imply causation.",
            "difficulty": "easy",
            "confidence": 85,
            "mastery_score": 90,
            "times_reviewed": 4
        },
        {
            "id": "fc_ds_03",
            "concept_id": "c_ds_wrangling",
            "topic": "Outlier Detection",
            "category": "Data Cleaning",
            "front": "What is the IQR (Interquartile Range) rule for outlier detection?",
            "back": "Values lying below Q1 - 1.5 * IQR or above Q3 + 1.5 * IQR (where IQR = Q3 - Q1) are statistically flagged as potential anomalies.",
            "difficulty": "medium",
            "confidence": 80,
            "mastery_score": 85,
            "times_reviewed": 4
        },
        {
            "id": "fc_ds_04",
            "concept_id": "c_ds_wrangling",
            "topic": "Missing Data Handling",
            "category": "Data Cleaning",
            "front": "Why is Mean Imputation risky for missing data?",
            "back": "Mean imputation artificially reduces the variance of the variable, shrinks standard errors, and distorts covariance relationships with other features.",
            "difficulty": "medium",
            "confidence": 75,
            "mastery_score": 80,
            "times_reviewed": 3
        },
        {
            "id": "fc_ds_05",
            "concept_id": "c_ds_wrangling",
            "topic": "Feature Types",
            "category": "Data Science Core",
            "front": "What is the difference between Nominal and Ordinal categorical data?",
            "back": "Nominal data has no intrinsic ordering (e.g. City names, Blood type). Ordinal data has a clear, meaningful rank order (e.g. Education level, Low/Medium/High).",
            "difficulty": "easy",
            "confidence": 90,
            "mastery_score": 95,
            "times_reviewed": 5
        },
        {
            "id": "fc_ds_06",
            "concept_id": "c_ds_wrangling",
            "topic": "Data Preprocessing",
            "category": "Data Pipelines",
            "front": "What is Data Leakage in a machine learning and data science pipeline?",
            "back": "Data leakage occurs when information from the target or test set is inadvertently introduced into the training feature pipeline, producing deceptively high validation metrics that fail in production.",
            "difficulty": "hard",
            "confidence": 70,
            "mastery_score": 75,
            "times_reviewed": 2
        },

        # 3. AI / ML (Concept: c_ai_tensors)
        {
            "id": "fc_ai_01",
            "concept_id": "c_ai_tensors",
            "topic": "Supervised Learning",
            "category": "ML Foundations",
            "front": "What is a feature in machine learning?",
            "back": "A feature is an individual measurable property or numerical input column used by mathematical models to compute predictions.",
            "difficulty": "easy",
            "confidence": 90,
            "mastery_score": 95,
            "times_reviewed": 5
        },
        {
            "id": "fc_ai_02",
            "concept_id": "c_ai_tensors",
            "topic": "Model Evaluation",
            "category": "Model Validation",
            "front": "Why do we evaluate models on a held-out Test Set?",
            "back": "To accurately measure how well a trained algorithm generalizes to completely unseen data, protecting against memorization and overfitting.",
            "difficulty": "easy",
            "confidence": 85,
            "mastery_score": 90,
            "times_reviewed": 4
        },
        {
            "id": "fc_ai_03",
            "concept_id": "c_ai_tensors",
            "topic": "Evaluation Metrics",
            "category": "Model Validation",
            "front": "What is the fundamental difference between Precision and Recall?",
            "back": "Precision = TP / (TP + FP) (How many predicted positives were actually true). Recall = TP / (TP + FN) (How many actual real positives did the model capture).",
            "difficulty": "medium",
            "confidence": 80,
            "mastery_score": 85,
            "times_reviewed": 4
        },
        {
            "id": "fc_ai_04",
            "concept_id": "c_ai_tensors",
            "topic": "Optimization",
            "category": "Neural Networks",
            "front": "What is a Loss Function in machine learning training?",
            "back": "A mathematical objective function that quantifies the error between predicted model outputs and true ground-truth targets, minimized via gradient descent.",
            "difficulty": "medium",
            "confidence": 75,
            "mastery_score": 80,
            "times_reviewed": 3
        },
        {
            "id": "fc_ai_05",
            "concept_id": "c_ai_tensors",
            "topic": "Bias-Variance Tradeoff",
            "category": "ML Foundations",
            "front": "What is the primary cause of Overfitting (High Variance)?",
            "back": "The model has too much capacity and learns random noise in the training set instead of the underlying data distribution.",
            "difficulty": "medium",
            "confidence": 85,
            "mastery_score": 90,
            "times_reviewed": 4
        },
        {
            "id": "fc_ai_06",
            "concept_id": "c_ai_tensors",
            "topic": "Representation Learning",
            "category": "Deep Learning",
            "front": "What is a Vector Embedding?",
            "back": "A dense, continuous numerical vector mapping of complex objects (words, images, graphs) into high-dimensional geometric space where similarity corresponds to spatial proximity.",
            "difficulty": "hard",
            "confidence": 70,
            "mastery_score": 75,
            "times_reviewed": 2
        },

        # 4. CYBERSECURITY (Concept: c_cy_packets)
        {
            "id": "fc_cy_01",
            "concept_id": "c_cy_packets",
            "topic": "Identity & Access",
            "category": "Security Architecture",
            "front": "What is the difference between Authentication and Authorization?",
            "back": "Authentication verifies WHO an entity is (Identity proof). Authorization verifies WHAT actions and resources that authenticated entity is permitted to access.",
            "difficulty": "easy",
            "confidence": 95,
            "mastery_score": 95,
            "times_reviewed": 6
        },
        {
            "id": "fc_cy_02",
            "concept_id": "c_cy_packets",
            "topic": "Cryptography",
            "category": "Data Protection",
            "front": "Why must passwords be hashed with Bcrypt and Salt rather than MD5?",
            "back": "Bcrypt is an adaptive, computationally expensive hashing algorithm with cryptographic salt, preventing precomputed rainbow table lookups and high-speed GPU dictionary attacks.",
            "difficulty": "easy",
            "confidence": 90,
            "mastery_score": 95,
            "times_reviewed": 5
        },
        {
            "id": "fc_cy_03",
            "concept_id": "c_cy_packets",
            "topic": "OWASP Top 10",
            "category": "Web Security",
            "front": "How do Parameterized Queries (Prepared Statements) prevent SQL Injection?",
            "back": "The SQL query structure is compiled first, and user input is strictly treated as literal data parameters, making it impossible for input strings to alter query execution logic.",
            "difficulty": "medium",
            "confidence": 85,
            "mastery_score": 90,
            "times_reviewed": 4
        },
        {
            "id": "fc_cy_04",
            "concept_id": "c_cy_packets",
            "topic": "Web Vulnerabilities",
            "category": "Web Security",
            "front": "What is a Cross-Site Scripting (XSS) vulnerability?",
            "back": "An exploit where malicious client-side JavaScript code is injected into a trusted web application and executed inside the browsers of unsuspecting visitors.",
            "difficulty": "medium",
            "confidence": 80,
            "mastery_score": 85,
            "times_reviewed": 4
        },
        {
            "id": "fc_cy_05",
            "concept_id": "c_cy_packets",
            "topic": "Session Management",
            "category": "Security Architecture",
            "front": "What protection does the HttpOnly cookie flag provide?",
            "back": "It prevents client-side scripts (JavaScript) from accessing the session cookie via document.cookie, mitigating session hijacking via XSS.",
            "difficulty": "medium",
            "confidence": 85,
            "mastery_score": 90,
            "times_reviewed": 4
        },
        {
            "id": "fc_cy_06",
            "concept_id": "c_cy_packets",
            "topic": "Encryption Protocols",
            "category": "Data Protection",
            "front": "What is the difference between Symmetric and Asymmetric Encryption?",
            "back": "Symmetric uses a single shared secret key for encryption and decryption (e.g. AES-256). Asymmetric uses a mathematically linked public-private key pair (e.g. RSA, ECC).",
            "difficulty": "hard",
            "confidence": 75,
            "mastery_score": 80,
            "times_reviewed": 3
        },

        # 5. SOFTWARE DEVELOPER (Concept: c_sde_complexity)
        {
            "id": "fc_sde_01",
            "concept_id": "c_sde_complexity",
            "topic": "Clean Code",
            "category": "Core Foundations",
            "front": "What is the purpose of a function in software development?",
            "back": "To encapsulate reusable computational logic, enforce modularity, isolate variable scopes, and reduce code redundancy (DRY principle).",
            "difficulty": "easy",
            "confidence": 95,
            "mastery_score": 95,
            "times_reviewed": 5
        },
        {
            "id": "fc_sde_02",
            "concept_id": "c_sde_complexity",
            "topic": "Hash Tables",
            "category": "Data Structures",
            "front": "Why is Hash Map key lookup O(1) average time complexity?",
            "back": "A hash function computes a deterministic numerical index directly from the key, allowing instantaneous constant-time memory address offset access.",
            "difficulty": "easy",
            "confidence": 90,
            "mastery_score": 95,
            "times_reviewed": 5
        },
        {
            "id": "fc_sde_03",
            "concept_id": "c_sde_complexity",
            "topic": "Memory Layout",
            "category": "Data Structures",
            "front": "Why is Array index lookup O(1) while LinkedList lookup is O(N)?",
            "back": "Arrays reside in contiguous memory blocks computed via base + (i * size). LinkedList nodes are dynamically allocated across heap memory and must be traversed pointer-by-pointer.",
            "difficulty": "easy",
            "confidence": 90,
            "mastery_score": 90,
            "times_reviewed": 4
        },
        {
            "id": "fc_sde_04",
            "concept_id": "c_sde_complexity",
            "topic": "Recursion",
            "category": "Algorithms",
            "front": "What role does the Call Stack play during recursive function execution?",
            "back": "Each recursive call pushes a stack frame with its local variables, parameters, and instruction return address, popping frames sequentially upon hitting the base case.",
            "difficulty": "medium",
            "confidence": 80,
            "mastery_score": 85,
            "times_reviewed": 4
        },
        {
            "id": "fc_sde_05",
            "concept_id": "c_sde_complexity",
            "topic": "Sorting Algorithms",
            "category": "Algorithms",
            "front": "What is the Time Complexity of Merge Sort across all cases?",
            "back": "O(N log N) in best, average, and worst cases because it consistently splits the array in half log N times and merges subarrays in linear O(N) time.",
            "difficulty": "medium",
            "confidence": 85,
            "mastery_score": 90,
            "times_reviewed": 4
        },
        {
            "id": "fc_sde_06",
            "concept_id": "c_sde_complexity",
            "topic": "Object-Oriented Design",
            "category": "Design Principles",
            "front": "What does the Single Responsibility Principle (SRP) dictate?",
            "back": "A class or software module should have one, and only one, reason to change, meaning it performs exactly one encapsulated responsibility.",
            "difficulty": "medium",
            "confidence": 80,
            "mastery_score": 85,
            "times_reviewed": 3
        },

        # 6. FULL STACK DEVELOPER (Concept: c_fs_arch)
        {
            "id": "fc_fs_01",
            "concept_id": "c_fs_arch",
            "topic": "System Integration",
            "category": "Architecture",
            "front": "What is the role of an API between frontend and backend tiers?",
            "back": "It provides a clearly defined interface and contract through which client applications communicate securely with server-side business logic and persistence stores.",
            "difficulty": "easy",
            "confidence": 90,
            "mastery_score": 95,
            "times_reviewed": 5
        },
        {
            "id": "fc_fs_02",
            "concept_id": "c_fs_arch",
            "topic": "Database Transactions",
            "category": "Databases & SQL",
            "front": "What do the 4 ACID properties guarantee in full stack databases?",
            "back": "Atomicity (all or nothing), Consistency (preserves schema rules), Isolation (concurrent safety), and Durability (committed data survives system crashes).",
            "difficulty": "medium",
            "confidence": 85,
            "mastery_score": 90,
            "times_reviewed": 4
        },
        {
            "id": "fc_fs_03",
            "concept_id": "c_fs_arch",
            "topic": "Backend Frameworks",
            "category": "Backend & APIs",
            "front": "What is Express.js Middleware and how does next() operate?",
            "back": "Functions that intercept incoming HTTP requests before route handlers. Invoking next() passes execution control to the next middleware in the pipeline chain.",
            "difficulty": "easy",
            "confidence": 90,
            "mastery_score": 90,
            "times_reviewed": 4
        },
        {
            "id": "fc_fs_04",
            "concept_id": "c_fs_arch",
            "topic": "Communication Protocols",
            "category": "Backend & APIs",
            "front": "When should an architect use WebSockets instead of standard REST HTTP?",
            "back": "Use WebSockets for real-time bidirectional event streaming (chat, live trading, collaborative multiplayer) where low-latency continuous connection is required.",
            "difficulty": "medium",
            "confidence": 80,
            "mastery_score": 85,
            "times_reviewed": 3
        },
        {
            "id": "fc_fs_05",
            "concept_id": "c_fs_arch",
            "topic": "Database Optimization",
            "category": "Databases & SQL",
            "front": "Why is Database Connection Pooling essential for high-throughput APIs?",
            "back": "Reuses existing open connections rather than incurring the expensive latency overhead of TCP handshakes and SSL negotiation for every single database query.",
            "difficulty": "hard",
            "confidence": 75,
            "mastery_score": 80,
            "times_reviewed": 3
        },
        {
            "id": "fc_fs_06",
            "concept_id": "c_fs_arch",
            "topic": "Web Security",
            "category": "Architecture",
            "front": "What is CORS (Cross-Origin Resource Sharing) in full stack web apps?",
            "back": "A browser security policy that restricts web clients from fetching resources from a different domain/port unless the server explicitly sends Allow-Origin headers.",
            "difficulty": "easy",
            "confidence": 90,
            "mastery_score": 95,
            "times_reviewed": 5
        },

        # 7. APP DEVELOPER (Concept: c_app_lifecycle)
        {
            "id": "fc_app_01",
            "concept_id": "c_app_lifecycle",
            "topic": "Mobile State Management",
            "category": "Mobile Foundations",
            "front": "What is application state in a mobile application?",
            "back": "Data representing the current condition and UI state of the app that updates dynamically as users navigate screens, type inputs, or receive background events.",
            "difficulty": "easy",
            "confidence": 90,
            "mastery_score": 95,
            "times_reviewed": 5
        },
        {
            "id": "fc_app_02",
            "concept_id": "c_app_lifecycle",
            "topic": "Offline Persistence",
            "category": "Local Storage",
            "front": "Why is local storage (AsyncStorage/SQLite) essential in mobile apps?",
            "back": "Enables an offline-first experience, allowing apps to hydrate and render tickets, caches, and draft data instantaneously with zero network connectivity.",
            "difficulty": "easy",
            "confidence": 85,
            "mastery_score": 90,
            "times_reviewed": 4
        },
        {
            "id": "fc_app_03",
            "concept_id": "c_app_lifecycle",
            "topic": "Mobile OS Lifecycle",
            "category": "App Lifecycle",
            "front": "What AppState transitions occur when a mobile phone call interrupts the app?",
            "back": "The app transitions from active (foreground) to inactive or background, triggering listeners to pause video playback and persist unsaved form drafts.",
            "difficulty": "medium",
            "confidence": 85,
            "mastery_score": 90,
            "times_reviewed": 4
        },
        {
            "id": "fc_app_04",
            "concept_id": "c_app_lifecycle",
            "topic": "React Native Architecture",
            "category": "Mobile Foundations",
            "front": "What is the difference between JavaScript Thread and Native UI Thread?",
            "back": "The JS thread executes React component logic and state hooks; the Native thread renders actual platform native views (UIView/android.view) at 60 FPS.",
            "difficulty": "hard",
            "confidence": 75,
            "mastery_score": 80,
            "times_reviewed": 3
        },
        {
            "id": "fc_app_05",
            "concept_id": "c_app_lifecycle",
            "topic": "Real-Time Alerts",
            "category": "Push Notifications",
            "front": "How do push notifications (FCM / APNs) reach a device when the app is terminated?",
            "back": "The mobile operating system maintains a persistent background socket connection to Apple/Google push servers to display system tray notifications without running the app process.",
            "difficulty": "medium",
            "confidence": 80,
            "mastery_score": 85,
            "times_reviewed": 3
        },
        {
            "id": "fc_app_06",
            "concept_id": "c_app_lifecycle",
            "topic": "Mobile Performance",
            "category": "App Lifecycle",
            "front": "Why is 60 FPS (16.6ms per frame budget) critical on touch devices?",
            "back": "Human touch perception is extremely sensitive to micro-stutters; exceeding 16.6ms drops frames, producing visible touch lag and jank during scrolling.",
            "difficulty": "easy",
            "confidence": 90,
            "mastery_score": 90,
            "times_reviewed": 4
        },

        # 8. PRODUCT DESIGN (Concept: c_pd_hierarchy)
        {
            "id": "fc_pd_01",
            "concept_id": "c_pd_hierarchy",
            "topic": "User Research",
            "category": "Product Strategy",
            "front": "What is a User Journey map?",
            "back": "A visual timeline representation of the steps, emotional states, touchpoints, and friction pain-points a user experiences while attempting to achieve a goal.",
            "difficulty": "easy",
            "confidence": 95,
            "mastery_score": 95,
            "times_reviewed": 5
        },
        {
            "id": "fc_pd_02",
            "concept_id": "c_pd_hierarchy",
            "topic": "Accessibility Standards",
            "category": "Visual Design",
            "front": "What is the minimum WCAG 2.1 AA color contrast ratio for body text?",
            "back": "At least 4.5:1 for standard body text and 3:1 for large text (18pt+), ensuring readability for users with visual impairments or in direct sunlight.",
            "difficulty": "easy",
            "confidence": 90,
            "mastery_score": 95,
            "times_reviewed": 5
        },
        {
            "id": "fc_pd_03",
            "concept_id": "c_pd_hierarchy",
            "topic": "Design Systems",
            "category": "Visual Design",
            "front": "What is the 60-30-10 Color Rule in product design?",
            "back": "A visual balance formula: 60% dominant neutral background canvas, 30% secondary structural cards/surfaces, and 10% high-contrast brand accent for primary CTAs.",
            "difficulty": "medium",
            "confidence": 85,
            "mastery_score": 90,
            "times_reviewed": 4
        },
        {
            "id": "fc_pd_04",
            "concept_id": "c_pd_hierarchy",
            "topic": "Cognitive Psychology",
            "category": "Interaction Design",
            "front": "What is the F-shaped reading pattern in digital layouts?",
            "back": "Eye-tracking studies show web readers scan horizontally across the top headline, move down to scan a shorter horizontal section, and finally scan vertically down the left edge.",
            "difficulty": "medium",
            "confidence": 80,
            "mastery_score": 85,
            "times_reviewed": 4
        },
        {
            "id": "fc_pd_05",
            "concept_id": "c_pd_hierarchy",
            "topic": "Design Deliverables",
            "category": "Product Strategy",
            "front": "What is the difference between a Wireframe and a Prototype?",
            "back": "Wireframes are low-fidelity structural blueprints focusing on layout and content priority; Prototypes are interactive, clickable simulations demonstrating user flows and micro-interactions.",
            "difficulty": "easy",
            "confidence": 90,
            "mastery_score": 90,
            "times_reviewed": 4
        },
        {
            "id": "fc_pd_06",
            "concept_id": "c_pd_hierarchy",
            "topic": "Spatial Hierarchy",
            "category": "Visual Design",
            "front": "Why is Whitespace (Negative Space) crucial in interface design?",
            "back": "Whitespace reduces cognitive load, clarifies groupings via the Gestalt Law of Proximity, and gives primary content room to breathe.",
            "difficulty": "easy",
            "confidence": 95,
            "mastery_score": 95,
            "times_reviewed": 5
        },

        # 9. GATE CSE (Concept: c_gate_proc & c_os_deadlock)
        {
            "id": "fc_gate_01",
            "concept_id": "c_gate_proc",
            "topic": "Operating Systems",
            "category": "GATE CSE Core",
            "front": "What is the difference between a Program and a Process?",
            "back": "A program is a passive executable file stored on disk (passive entity); a process is a program in active execution loaded into RAM with a PCB and register state (active entity).",
            "difficulty": "easy",
            "confidence": 95,
            "mastery_score": 95,
            "times_reviewed": 6
        },
        {
            "id": "fc_gate_02",
            "concept_id": "c_gate_proc",
            "topic": "Kernel Structures",
            "category": "GATE CSE Core",
            "front": "What critical information does a Process Control Block (PCB) contain?",
            "back": "Process State, Program Counter (PC), CPU Registers, CPU Scheduling priority, Memory management info (Page Tables), and I/O status accounting information.",
            "difficulty": "medium",
            "confidence": 90,
            "mastery_score": 95,
            "times_reviewed": 5
        },
        {
            "id": "fc_gate_03",
            "concept_id": "c_gate_proc",
            "topic": "CPU Scheduling",
            "category": "GATE CSE Core",
            "front": "What is CPU Context Switch overhead?",
            "back": "The time the CPU spends saving old process registers into PCB_1 and loading new PCB_2 registers without executing any useful user program work.",
            "difficulty": "medium",
            "confidence": 85,
            "mastery_score": 90,
            "times_reviewed": 4
        },
        {
            "id": "fc_gate_04",
            "concept_id": "c_os_deadlock",
            "topic": "Operating Systems",
            "category": "GATE CSE Core",
            "front": "What are the 4 Coffman conditions for Deadlock?",
            "back": "1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait.\nAll 4 must hold simultaneously for a deadlock state to exist.",
            "difficulty": "medium",
            "confidence": 90,
            "mastery_score": 95,
            "times_reviewed": 5
        },
        {
            "id": "fc_gate_05",
            "concept_id": "c_gate_proc",
            "topic": "CPU Scheduling",
            "category": "GATE CSE Core",
            "front": "What happens if Round-Robin Time Quantum Q is set larger than the longest burst time?",
            "back": "No preemption ever occurs, and Round-Robin scheduling degenerates to behave identically to First-Come First-Served (FCFS).",
            "difficulty": "easy",
            "confidence": 90,
            "mastery_score": 95,
            "times_reviewed": 5
        },
        {
            "id": "fc_gate_06",
            "concept_id": "c_gate_proc",
            "topic": "CPU Scheduling",
            "category": "GATE CSE Core",
            "front": "What distinguishes Preemptive from Non-Preemptive CPU scheduling?",
            "back": "Preemptive allows the OS scheduler to interrupt and suspend a currently running process (e.g. SRTF, Round Robin); Non-preemptive processes run until voluntary yield or termination.",
            "difficulty": "medium",
            "confidence": 85,
            "mastery_score": 90,
            "times_reviewed": 4
        },
        {
            "id": "fc_gate_07",
            "concept_id": "c_os_deadlock",
            "topic": "Deadlock Avoidance",
            "category": "GATE CSE Core",
            "front": "In Banker's Algorithm, what mathematically defines a Safe State?",
            "back": "A state where at least one execution sequence <P1, P2, ... Pn> exists such that each process can satisfy its remaining Need from Available resources plus currently allocated resources.",
            "difficulty": "hard",
            "confidence": 80,
            "mastery_score": 85,
            "times_reviewed": 4
        }
    ]
    for fc in flashcards_data:
        db.add(Flashcard(**fc))
    db.flush()

    squad = StudyGroup(
        id="squad_web_warriors",
        name="Web & System Warriors",
        tag="SW-2026",
        slogan="No one leaves a bug behind. Building real products together.",
        description="Active study squad for engineering college builders.",
        learning_path_id="path_web_dev",
        goal_title="Finish Level 1 foundations & missions this week",
        goal_progress=80,
        goal_deadline="Sunday 11:59 PM",
        target_level="Level 01 — The Awakening",
        squad_streak=14,
        member_count=18,
        max_members=20,
        active_now_count=7,
        created_by=aarav.id
    )
    db.add(squad)
    db.flush()

    db.add(GroupMember(group_id=squad.id, user_id=aarav.id, name="Aarav (You)", college="VNR VJIET, Hyderabad", avatar_url=aarav.avatar_url, role="Level 1 • Web Explorer", xp_this_week=420, is_online=True, current_mission="The Website That Couldn't Talk"))
    db.add(GroupMember(group_id=squad.id, name="Meera P.", college="IIIT Hyderabad", avatar_url=meera.avatar_url, role="Level 1 • Data Sleuth", xp_this_week=480, is_online=True, current_mission="The Dataset That Lied"))
    db.add(GroupMember(group_id=squad.id, name="Kabir S.", college="DTU Delhi", avatar_url=kabir.avatar_url, role="Level 1 • SOC Defender", xp_this_week=390, is_online=True, current_mission="The Login That Shouldn't Exist"))
    db.add(GroupMember(group_id=squad.id, name="Ananya S.", college="NIT Warangal", avatar_url=ananya.avatar_url, role="Level 1 • GATE Kernelist", xp_this_week=520, is_online=False, current_mission="Four Programs. One Computer."))

    db.add(GroupMessage(group_id=squad.id, sender_name="Meera P.", sender_avatar=meera.avatar_url, sender_college="IIIT Hyderabad", text="The QuickMart data cleaning mission made IQR outlier detection click in 5 minutes! 🥦", reactions_data=[{"emoji": "🔥", "count": 6}]))
    db.add(GroupMessage(group_id=squad.id, sender_name="Aarav (You)", sender_avatar=aarav.avatar_url, sender_college="VNR VJIET", text="Just connected the ChaiPay network wire story. DNS to TCP to DOM rendering was super intuitive 🚀", reactions_data=[{"emoji": "🚀", "count": 8}]))

    # Challenges & Boss Battles
    db.add(Challenge(
        id="challenge_boss_01",
        title="The College Fest Traffic Apocalypse",
        scenario="It's 11:59 PM. 15,000 students are frantically trying to book concert passes on the college portal. The server CPU is throttling at 99%, requests are timing out, and duplicate passes are being generated.",
        objective="Implement an optimal Two-Pointer / Hash Map lookup algorithm (solve) with O(N) time complexity to pair duplicate request IDs in real-time.",
        type="boss",
        difficulty=4,
        duration_minutes=60,
        skills=["Two-Pointer Technique", "Hash Tables", "O(N) Optimization", "Data Structures"],
        requirements=["Must execute in O(N) time complexity", "Handle negative and duplicate numbers", "Zero layout shifts & sub-50ms execution", "Pass all boundary test suites"],
        xp_reward=350,
        badge_reward="Fest Architect 🎪",
        learning_path_id="path_web_dev"
    ))
    db.add(Challenge(
        id="challenge_debug_01",
        title="The Leaky Token Bucket Rate Limiter",
        scenario="An automated botnet is hammering your payment webhook with 5,000 requests per second. The current rate limiter lets burst traffic crash the database.",
        objective="Write a parameterized SQL builder and token bucket gatekeeper to throttle bursts safely.",
        type="debug",
        difficulty=3,
        duration_minutes=30,
        skills=["Rate Limiting", "SQL Security", "Token Bucket", "Backend APIs"],
        requirements=["Throttle requests exceeding capacity", "Return standard 429 Too Many Requests", "Zero memory leak over 10,000 iterations"],
        xp_reward=180,
        badge_reward="Bug Hunter 🔍",
        learning_path_id="path_web_dev"
    ))
    db.add(Challenge(
        id="challenge_speed_01",
        title="10-Minute Regex Security Audit",
        scenario="A junior developer wrote an unescaped regex for phone numbers and email addresses that allows ReDoS (Regular Expression Denial of Service).",
        objective="Construct a linear-time safe validation pattern and patch the vulnerability before deployment.",
        type="speedrun",
        difficulty=2,
        duration_minutes=10,
        skills=["Regular Expressions", "ReDoS Prevention", "Security Auditing"],
        requirements=["Linear time matching O(N)", "Block catastrophic backtracking patterns"],
        xp_reward=100,
        badge_reward="Speed Demon ⚡",
        learning_path_id="path_web_dev"
    ))

    # Feed Memes
    db.add(Post(
        id="meme_01",
        author_name="Harsh Vardhan",
        handle="@harsh_codes",
        avatar_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
        college="DTU, Delhi",
        category="GATE",
        headline="When the GATE Question gives you 4 processes and 1 CPU core",
        type="code-vs-code",
        content_data={
            "leftBlock": {"title": "College Exam", "language": "text", "code": "Q: Define CPU Context Switch.\n\nAnswer:\nSwitching between programs.", "badge": "Surface Level 🥱"},
            "rightBlock": {"title": "GATE CSE 2026", "language": "text", "code": "Save PCB_1 registers\nMode switch User->Kernel\nLoad PCB_2 -> resume execution", "badge": "Kernel Internals 🔥"},
            "caption": "Theory only gets you marks in college semester exams. Situation mastery gets you AIR < 100."
        },
        likes_count=1240,
        comments_count=98,
        learning_bridge_data={
            "badgeText": "10 MIN MISSION",
            "hookTitle": "Master CPU Context Switching & PCB structure",
            "duration": "10 MIN",
            "xp": 45,
            "targetTopic": "Operating Systems",
            "targetLessonId": "story_gate_proc_01"
        }
    ))
    db.add(Post(
        id="meme_02",
        author_name="Priya Sharma",
        handle="@priya_dev",
        avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
        college="IIIT Hyderabad",
        category="Programming",
        headline="HTTP 401 vs 403 Explained by Chai Stall Bhaiya ☕",
        type="code-vs-code",
        content_data={
            "leftBlock": {"title": "401 Unauthorized", "language": "text", "code": "'Bhaiya, do chai dena!'\nBhaiya: 'Pehle token dikhao (Who are you?)'", "badge": "No Auth Token ❌"},
            "rightBlock": {"title": "403 Forbidden", "language": "text", "code": "'Bhaiya, kitchen mein ghuske samosa kha lu?'\nBhaiya: 'Nahi. Permission nahi hai.'", "badge": "Authenticated but Blocked 🚫"},
            "caption": "Finally understood HTTP status codes better than 3 years of computer networks lectures."
        },
        likes_count=1420,
        comments_count=86,
        learning_bridge_data={
            "badgeText": "5 MIN MISSION",
            "hookTitle": "Why Razorpay checkout uses 401 vs 403",
            "duration": "5 MIN",
            "xp": 35,
            "targetTopic": "HTTP Status Codes",
            "targetLessonId": "story_http_01"
        }
    ))

    # Opportunities
    db.add(Opportunity(
        id="opp_razorpay_intern",
        title="Frontend Engineering Intern (Winter 2026)",
        company="Razorpay",
        logo="💳",
        location="Bengaluru / Hybrid",
        work_type="Hybrid",
        type="Internship",
        stipend_or_prize="Rs 45,000 / month",
        deadline="October 15, 2026",
        days_left=8,
        skill_tags=["HTML5", "CSS Grid", "JavaScript", "REST APIs", "React"],
        match_score=92,
        description="Work alongside the Checkout and Merchant Experience teams to build high-performance UI components handling 50M+ daily transactions.",
        eligibility="2nd, 3rd, or 4th Year B.Tech/BE/BCA students.",
        learning_path_id="path_web_dev"
    ))

    db.commit()
    db.close()
    print("[SUCCESS] SUTRA Database Seeding Complete!")
    print("  -> Demo User 1 (Web Dev): aarav@sutra.demo / sutra123 -> 'The Website That Couldn't Talk'")
    print("  -> Demo User 2 (Data Science): meera@sutra.demo / sutra123 -> 'The Dataset That Lied'")
    print("  -> Demo User 3 (Cybersecurity): kabir@sutra.demo / sutra123 -> 'The Login That Shouldn't Exist'")
    print("  -> Demo User 4 (GATE CSE): ananya@sutra.demo / sutra123 -> 'Four Programs. One Computer.'")

if __name__ == "__main__":
    seed_database()

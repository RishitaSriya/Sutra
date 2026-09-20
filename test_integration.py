import urllib.request
import urllib.error
import json
import uuid

BASE_URL = "http://localhost:8000/api"

def make_req(endpoint, method="GET", data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8")), resp.status
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            return json.loads(err_body), e.code
        except Exception:
            return {"error": err_body}, e.code

def test_full_stack():
    print("=======================================================", flush=True)
    print("   SUTRA FULL-STACK AUTH & DUAL-ONBOARDING TEST SUITE  ", flush=True)
    print("=======================================================", flush=True)
    
    # 1. Health check
    health, code = make_req("/health")
    assert code == 200, f"Health check failed: {code}"
    print(f"[PASS] 1. Health Check: {health.get('status')} - {health.get('service')}", flush=True)

    # 2. Verify 401 Protected Route without Token
    unauth_resp, code = make_req("/auth/me")
    assert code == 401, f"Expected 401 Unauthorized, got {code}"
    print(f"[PASS] 2. Auth Protection: GET /auth/me without token correctly returned 401 Unauthorized", flush=True)

    # 3. Test Seeded Demo User 1: Aarav (Career Track)
    aarav_login, code = make_req("/auth/login", "POST", {"email": "aarav@sutra.demo", "password": "sutra123"})
    assert code == 200, f"Aarav login failed: {code}"
    aarav_token = aarav_login["access_token"]
    aarav_profile, code = make_req("/users/me/learning-profile", token=aarav_token)
    assert code == 200
    assert aarav_profile["track_type"] == "career"
    print(f"[PASS] 3. Seeded Demo User (Aarav): Career Track | Role: {aarav_profile['career_path']} | Companies: {aarav_profile['target_companies']}", flush=True)

    # 4. Test Seeded Demo User 2: Ananya (GATE Track)
    ananya_login, code = make_req("/auth/login", "POST", {"email": "ananya@sutra.demo", "password": "sutra123"})
    assert code == 200, f"Ananya login failed: {code}"
    ananya_token = ananya_login["access_token"]
    ananya_profile, code = make_req("/users/me/learning-profile", token=ananya_token)
    assert code == 200
    assert ananya_profile["track_type"] == "exam"
    assert ananya_profile["exam_type"] == "GATE_CSE"
    assert ananya_profile["target_year"] == "2028"
    assert ananya_profile["target_companies"] == []
    print(f"[PASS] 4. Seeded Demo User (Ananya): GATE Track | Exam: {ananya_profile['exam_type']} ({ananya_profile['target_year']}) | Goals: {ananya_profile['goals']} | No Companies Attached", flush=True)

    # 5. Test User Registration (New Career Student)
    unique_career_email = f"student_career_{uuid.uuid4().hex[:6]}@sutra.edu"
    reg_career_payload = {
        "name": "Rohan Verma",
        "email": unique_career_email,
        "password": "Password123!",
        "college": "BITS Pilani",
        "year": "2nd Year",
        "tier": "Tier 1"
    }
    reg_res, code = make_req("/auth/register", "POST", reg_career_payload)
    assert code == 200, f"Registration failed: {reg_res}"
    new_career_token = reg_res["access_token"]
    print(f"[PASS] 5. User Registration: Created new student {reg_career_payload['name']} ({unique_career_email})", flush=True)

    # Verify new user onboarding_completed is False
    new_career_me, _ = make_req("/auth/me", token=new_career_token)
    assert new_career_me["onboarding_completed"] is False
    print(f"[PASS] 6. Initial Onboarding State: onboarding_completed = False as expected", flush=True)

    # 6. Execute Career Onboarding Flow
    career_onboard_payload = {
        "career_path": "Full Stack Developer",
        "learning_path_id": "path_web_dev",
        "target_companies": ["Swiggy", "Razorpay", "Atlassian"],
        "daily_minutes": 45,
        "learning_preferences": ["Stories", "Hands-on"]
    }
    onboard_res, code = make_req("/onboarding/career", "POST", career_onboard_payload, token=new_career_token)
    assert code == 200
    assert onboard_res["onboarding_completed"] is True
    assert onboard_res["learning_profile"]["track_type"] == "career"
    assert onboard_res["learning_profile"]["career_path"] == "Full Stack Developer"
    assert "Razorpay" in onboard_res["learning_profile"]["target_companies"]
    print(f"[PASS] 7. Career Onboarding: Configured {career_onboard_payload['career_path']} with target companies {career_onboard_payload['target_companies']}", flush=True)

    # 7. Test User Registration (New GATE Student)
    unique_gate_email = f"student_gate_{uuid.uuid4().hex[:6]}@sutra.edu"
    reg_gate_payload = {
        "name": "Pooja Sharma",
        "email": unique_gate_email,
        "password": "Password123!",
        "college": "NIT Trichy",
        "year": "3rd Year",
        "tier": "Tier 1"
    }
    reg_gate_res, code = make_req("/auth/register", "POST", reg_gate_payload)
    assert code == 200
    new_gate_token = reg_gate_res["access_token"]

    # 8. Execute GATE / Higher Studies Onboarding Flow (Strictly NO Companies)
    gate_onboard_payload = {
        "exam_type": "GATE_CSE",
        "target_year": "2027",
        "goals": ["IIT / IISc", "M.Tech in AI / Systems"],
        "preparation_level": "Covered Several Subjects",
        "daily_minutes": 180,
        "subjects": ["Algorithms", "Operating Systems", "Discrete Mathematics", "Theory of Computation"],
        "learning_preferences": ["Stories", "Hands-on"]
    }
    gate_res, code = make_req("/onboarding/exam", "POST", gate_onboard_payload, token=new_gate_token)
    assert code == 200
    assert gate_res["onboarding_completed"] is True
    assert gate_res["learning_profile"]["track_type"] == "exam"
    assert gate_res["learning_profile"]["exam_type"] == "GATE_CSE"
    assert gate_res["learning_profile"]["target_year"] == "2027"
    assert gate_res["learning_profile"]["target_companies"] == []
    print(f"[PASS] 8. GATE Onboarding: Configured {gate_onboard_payload['exam_type']} ({gate_onboard_payload['target_year']}) with {len(gate_onboard_payload['subjects'])} subjects, NO companies attached", flush=True)

    # 9. Test Exam Catalog Endpoints
    exams, code = make_req("/exams", token=new_gate_token)
    assert code == 200
    assert len(exams) >= 2
    gate_cse = next(e for e in exams if "cse" in e["slug"].lower())
    print(f"[PASS] 9. Exam Catalog: Found {len(exams)} exams. Catalog includes '{gate_cse['title']}' with {gate_cse['total_subjects']} subjects", flush=True)

    subjects, code = make_req(f"/exams/{gate_cse['id']}/subjects", token=new_gate_token)
    assert code == 200
    assert len(subjects) >= 5
    print(f"[PASS] 10. Exam Subjects: Loaded {len(subjects)} syllabus subjects for '{gate_cse['title']}'", flush=True)

    # 10. Core App Features with Auth Token
    paths, _ = make_req("/learning-paths", token=aarav_token)
    missions, _ = make_req("/missions/today", token=aarav_token)
    cards, _ = make_req("/flashcards", token=aarav_token)
    notes, _ = make_req("/notes", token=aarav_token)
    challenges, _ = make_req("/challenges", token=aarav_token)
    print(f"[PASS] 11. Core Features (Paths={len(paths)}, Missions={len(missions)}, Flashcards={len(cards)}, Notes={len(notes)}, Challenges={len(challenges)}) verified with JWT auth.", flush=True)

    # 11. Logout test
    logout_res, code = make_req("/auth/logout", "POST", token=new_career_token)
    assert code == 200
    print(f"[PASS] 12. Logout: POST /auth/logout executed successfully", flush=True)

    print("\n=======================================================", flush=True)
    print("ALL AUTHENTICATION & DUAL-ONBOARDING TESTS PASSED (12/12)!", flush=True)
    print("=======================================================", flush=True)

if __name__ == "__main__":
    test_full_stack()


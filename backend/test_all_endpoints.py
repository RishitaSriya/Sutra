import sys
import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:8000"

def api_call(path, method="GET", data=None, headers=None):
    url = f"{BASE_URL}{path}"
    headers = headers or {}
    headers["Content-Type"] = "application/json"
    
    encoded_data = None
    if data is not None:
        encoded_data = json.dumps(data).encode("utf-8")
        
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            status = response.status
            body = response.read().decode("utf-8")
            try:
                json_data = json.loads(body)
            except Exception:
                json_data = body
            return status, json_data
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            json_data = json.loads(body)
        except Exception:
            json_data = body
        return e.code, json_data
    except Exception as ex:
        return 500, {"error": str(ex)}

def run_live_e2e_suite():
    print("==================================================")
    print("   SUTRA LIVE END-TO-END SYSTEM INTEGRATION SUITE ")
    print("==================================================")
    
    passed = []
    failed = []

    def check(name, ok, details=""):
        if ok:
            print(f"  [PASS] {name} {details}", flush=True)
            passed.append(name)
        else:
            print(f"  [FAIL] {name} {details}", flush=True)
            failed.append(name)

    # 1. Health
    print("\n--- 1. Health & Discovery Endpoints ---")
    st, data = api_call("/api/health")
    check("GET /api/health", st == 200 and data.get("status") == "healthy", f"- {data.get('service')}")

    st, data = api_call("/api")
    check("GET /api (Discovery)", st == 200 and "endpoints" in data)

    # 2. Demo Logins
    print("\n--- 2. Demo Persona Logins & Auth ---")
    demo_tokens = {}
    for p in ["aarav", "meera", "kabir", "ananya"]:
        st, data = api_call(f"/api/auth/demo/{p}", method="POST")
        ok = st == 200 and "access_token" in data
        if ok:
            demo_tokens[p] = data["access_token"]
        role = data.get("user", {}).get("current_role") if ok else ""
        check(f"POST /api/auth/demo/{p}", ok, f"-> {p.capitalize()} ({role})")

    # 3. New User Registration & Login
    print("\n--- 3. Registration & Login Flow ---")
    test_user = {
        "name": "Tanmay Bhat",
        "email": "tanmay_e2e@sutra.edu",
        "password": "SutraPassword123!",
        "college": "IIT Bombay",
        "year": "4th Year",
        "tier": "Tier-1"
    }
    st, data = api_call("/api/auth/register", method="POST", data=test_user)
    # 200 or 400 (if already registered)
    st, data = api_call("/api/auth/login", method="POST", data={
        "email": test_user["email"],
        "password": test_user["password"]
    })
    ok = st == 200 and "access_token" in data
    auth_token = data.get("access_token", demo_tokens.get("aarav"))
    auth_headers = {"Authorization": f"Bearer {auth_token}"}
    check("POST /api/auth/login", ok, f"-> Logged in as {test_user['name']}")

    st, data = api_call("/api/auth/me", headers=auth_headers)
    check("GET /api/auth/me", st == 200 and "id" in data, f"-> User ID: {data.get('id')}")

    # 4. Onboarding & Learning Profile
    print("\n--- 4. Onboarding & Preferences ---")
    st, data = api_call("/api/onboarding/career", method="POST", headers=auth_headers, data={
        "career_path": "Web Developer",
        "dream_companies": ["Razorpay", "Google", "Swiggy"],
        "daily_time_minutes": 45,
        "learning_styles": ["Hands-on Coding", "Interactive Stories"]
    })
    check("POST /api/onboarding/career", st == 200)

    st, data = api_call("/api/users/me/learning-profile", headers=auth_headers)
    check("GET /api/users/me/learning-profile", st == 200)

    # 5. Learning Paths & Syllabus
    print("\n--- 5. Learning Paths & Syllabus ---")
    st, data = api_call("/api/learning-paths", headers=auth_headers)
    check("GET /api/learning-paths", st == 200 and len(data) > 0, f"({len(data)} paths loaded)")
    path_id = data[0]["id"] if (st == 200 and data) else "path_web_dev"

    st, data = api_call(f"/api/learning-paths/{path_id}/levels", headers=auth_headers)
    check(f"GET /api/learning-paths/{path_id}/levels", st == 200)

    st, data = api_call("/api/users/me/current-lesson", headers=auth_headers)
    check("GET /api/users/me/current-lesson", st in [200, 404])

    # 6. Daily Missions
    print("\n--- 6. Daily Productivity Missions ---")
    st, data = api_call("/api/missions/today", headers=auth_headers)
    check("GET /api/missions/today", st == 200, f"({len(data) if isinstance(data, list) else 0} missions)")

    # 7. Flashcards
    print("\n--- 7. Active Recall Flashcards ---")
    st, data = api_call("/api/flashcards", headers=auth_headers)
    check("GET /api/flashcards", st == 200, f"({len(data) if isinstance(data, list) else 0} flashcards)")

    # 8. Short Notes
    print("\n--- 8. 60-Second Short Notes ---")
    st, data = api_call("/api/notes", headers=auth_headers)
    check("GET /api/notes", st == 200, f"({len(data) if isinstance(data, list) else 0} notes)")

    # 9. Code Execution Sandbox & Boss Challenges
    print("\n--- 9. Real Code Sandbox & Challenge Evaluation ---")
    st, data = api_call("/api/sandbox/languages", headers=auth_headers)
    check("GET /api/sandbox/languages", st == 200 and isinstance(data, list) and len(data) > 0, f"({len(data) if isinstance(data, list) else 0} runtimes)")

    st, data = api_call("/api/sandbox/run", method="POST", headers=auth_headers, data={
        "code": "print('Sutra Sandbox Live!')",
        "language": "python"
    })
    check("POST /api/sandbox/run (Python)", st == 200 and "Sutra Sandbox Live!" in data.get("stdout", ""))

    st, data = api_call("/api/sandbox/run", method="POST", headers=auth_headers, data={
        "code": "console.log('JS Sandbox Live!');",
        "language": "javascript"
    })
    check("POST /api/sandbox/run (JavaScript)", st == 200 and "JS Sandbox Live!" in data.get("stdout", ""))

    # Evaluate Challenge 1 (Two Sum / Idempotency Cache)
    st, data = api_call("/api/challenges/challenge_boss_01/evaluate", method="POST", headers=auth_headers, data={
        "code": """def solve(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []
""",
        "language": "python"
    })
    check("POST /api/challenges/{id}/evaluate", st == 200 and data.get("passed") is True, f"-> Score: {data.get('score')}%, Passed: {data.get('passed_tests')}/{data.get('total_tests')}")

    # 10. AI Mentor & Mock Interview
    print("\n--- 10. AI Mentor & Mock Technical Interviewer ---")
    st, data = api_call("/api/ai/status")
    check("GET /api/ai/status", st == 200 and "provider" in data, f"-> Provider: {data.get('provider')}")

    st, data = api_call("/api/ai/chat", method="POST", headers=auth_headers, data={
        "message": "Explain how caching reduces database contention.",
        "lesson_context": "Caching & Redis Fundamentals"
    })
    check("POST /api/ai/chat", st == 200 and "reply" in data, f"-> Persona: {data.get('role_persona')}")

    st, data = api_call("/api/ai/explain", method="POST", headers=auth_headers, data={
        "query": "TCP 3-Way Handshake SYN ACK",
        "language": "python"
    })
    check("POST /api/ai/explain", st == 200 and "explanation" in data)

    st, data = api_call("/api/ai/interview/start", method="POST", headers=auth_headers, data={
        "company": "Razorpay",
        "role": "Web Developer"
    })
    check("POST /api/ai/interview/start", st == 200 and "question" in data, f"-> Round 1 for {data.get('company')}")
    interview_start = data if st == 200 else {}

    st, data = api_call("/api/ai/interview/respond", method="POST", headers=auth_headers, data={
        "interview_id": interview_start.get("interview_id", "interview_1"),
        "company": "Razorpay",
        "role": "Web Developer",
        "question": interview_start.get("question", "Describe payment idempotency."),
        "answer": "I use Redis Redlock with 15s TTL and DB unique constraints on idempotency_key.",
        "round_number": 1
    })
    check("POST /api/ai/interview/respond", st == 200 and "score" in data, f"-> Score: {data.get('score')}/10, +{data.get('xp_awarded')} XP")

    # 11. Community Squad & Memes
    print("\n--- 11. Study Squads & Tech Feed ---")
    st, data = api_call("/api/groups", headers=auth_headers)
    check("GET /api/groups", st == 200, f"({len(data) if isinstance(data, list) else 0} squads)")

    st, data = api_call("/api/feed", headers=auth_headers)
    check("GET /api/feed", st == 200, f"({len(data) if isinstance(data, list) else 0} memes)")

    # 12. Opportunities & Exams
    print("\n--- 12. Opportunities & Exams ---")
    st, data = api_call("/api/opportunities", headers=auth_headers)
    check("GET /api/opportunities", st == 200, f"({len(data) if isinstance(data, list) else 0} opportunities)")

    st, data = api_call("/api/exams/gate-cse/subjects")
    check("GET /api/exams/gate-cse/subjects", st == 200, f"({len(data) if isinstance(data, list) else 0} subjects)")

    print("\n==================================================")
    print(f"LIVE TEST SUMMARY: {len(passed)} PASSED, {len(failed)} FAILED")
    print("==================================================")

    if failed:
        print("\nFailed Endpoints:")
        for f in failed:
            print(f"  [FAIL] {f}")
        sys.exit(1)
    else:
        print("\n[SUCCESS] ALL ENDPOINTS VERIFIED & WORKING 100% END-TO-END!")

if __name__ == "__main__":
    run_live_e2e_suite()

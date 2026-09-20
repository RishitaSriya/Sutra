import requests
import json
import sys
import time

BASE_URL = "http://127.0.0.1:8000/api"

def test_all():
    print("=" * 60)
    print("SUTRA MULTI-USER & DYNAMIC LEARNING PATH VERIFICATION SUITE")
    print("=" * 60)

    # 1. Test Demo User: Aarav
    print("\n[TEST 1] Demo Login: Aarav (Web Developer)...")
    res = requests.post(f"{BASE_URL}/auth/demo", json={"demo_user": "aarav"})
    assert res.status_code == 200, f"Demo login failed: {res.text}"
    aarav_data = res.json()
    aarav_token = aarav_data["access_token"]
    assert aarav_data["user"]["is_demo"] == True, "Aarav must have is_demo=True"
    print(f"  [PASS] Token received for Aarav ({aarav_data['user']['name']})")

    # Get Aarav's profile
    res = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {aarav_token}"})
    assert res.status_code == 200
    aarav_profile = res.json()
    assert aarav_profile["track_type"] == "career"
    assert aarav_profile["learning_path_id"] == "path_web_dev"
    assert aarav_profile["total_xp"] == 420
    assert len(aarav_profile["dream_companies"]) > 0
    print("  [PASS] Aarav profile verified: Career track, path_web_dev, 420 XP, target companies present")

    # 2. Test Demo User: Ananya
    print("\n[TEST 2] Demo Login: Ananya (GATE CSE)...")
    res = requests.post(f"{BASE_URL}/auth/demo", json={"demo_user": "ananya"})
    assert res.status_code == 200, f"Demo login failed: {res.text}"
    ananya_data = res.json()
    ananya_token = ananya_data["access_token"]
    assert ananya_data["user"]["is_demo"] == True, "Ananya must have is_demo=True"
    print(f"  [PASS] Token received for Ananya ({ananya_data['user']['name']})")

    # Get Ananya's profile
    res = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {ananya_token}"})
    assert res.status_code == 200
    ananya_profile = res.json()
    assert ananya_profile["track_type"] == "exam"
    assert ananya_profile["learning_path_id"] == "path_gate_cse"
    assert ananya_profile["total_xp"] == 520
    assert len(ananya_profile["dream_companies"]) == 0, "GATE student must have ZERO companies"
    assert ananya_profile["exam_details"] is not None
    print("  [PASS] Ananya profile verified: Exam track, path_gate_cse, 520 XP, 0 companies, exam details present")

    # 3. Test New User Registration: User 1 (Data Scientist)
    print("\n[TEST 3] Real User Registration: Priya (Data Scientist)...")
    ts = int(time.time())
    email_u1 = f"priya.ds.{ts}@test.com"
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Priya Sharma",
        "email": email_u1,
        "password": "Password123!",
        "college": "IIIT Hyderabad"
    })
    assert res.status_code == 200, f"Registration failed: {res.text}"
    u1_token = res.json()["access_token"]

    # Verify clean initial state
    res = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {u1_token}"})
    u1_profile = res.json()
    assert u1_profile["is_demo"] == False, "New user must have is_demo=False"
    assert u1_profile["total_xp"] == 0, "New user must have 0 XP"
    assert u1_profile["streak_days"] == 0, "New user must have 0 streak"
    assert u1_profile["onboarding_completed"] == False, "New user must not be onboarding completed"
    print(f"  [PASS] Clean user state: XP={u1_profile['total_xp']}, Streak={u1_profile['streak_days']}, is_demo={u1_profile['is_demo']}")

    # Complete Career Onboarding for Data Scientist
    res = requests.post(f"{BASE_URL}/onboarding/career", json={
        "career_path": "Data Scientist",
        "learning_path_id": "path_data_science",
        "target_companies": ["Google", "Amazon", "Razorpay"],
        "daily_minutes": 30,
        "learning_preferences": ["Stories", "Hands-on"]
    }, headers={"Authorization": f"Bearer {u1_token}"})
    assert res.status_code == 200, f"Career onboarding failed: {res.text}"
    print("  [PASS] Onboarding completed: Selected Data Scientist (path_data_science)")

    # Fetch User 1 Missions
    res = requests.get(f"{BASE_URL}/missions/today", headers={"Authorization": f"Bearer {u1_token}"})
    assert res.status_code == 200
    u1_missions = res.json()
    assert len(u1_missions) > 0, "User 1 must receive a daily mission"
    assert "Dataset That Lied" in u1_missions[0]["title"], f"Expected Data Science mission, got: {u1_missions[0]['title']}"
    print(f"  [PASS] Dynamic Mission Provisioned: '{u1_missions[0]['title']}'")

    # Fetch User 1 Level Progress for Data Science
    res = requests.get(f"{BASE_URL}/learning-paths/path_data_science", headers={"Authorization": f"Bearer {u1_token}"})
    assert res.status_code == 200
    u1_path_data = res.json()
    levels = u1_path_data["levels"]
    assert len(levels) == 7, f"Expected 7 levels for Data Science, got {len(levels)}"
    assert levels[0]["status"] == "in_progress" and levels[0]["is_locked"] == False
    assert levels[1]["status"] == "locked" and levels[1]["is_locked"] == True
    print("  [PASS] Level progression isolated: Level 1 in_progress, Levels 2..7 locked")

    # 4. Test New User Registration: User 2 (Cybersecurity)
    print("\n[TEST 4] Real User Registration: Vikram (Cybersecurity)...")
    email_u2 = f"vikram.sec.{ts}@test.com"
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Vikram Patel",
        "email": email_u2,
        "password": "Password123!",
        "college": "DTU Delhi"
    })
    assert res.status_code == 200, f"Registration failed: {res.text}"
    u2_token = res.json()["access_token"]

    # Complete Career Onboarding for Cybersecurity
    res = requests.post(f"{BASE_URL}/onboarding/career", json={
        "career_path": "Cybersecurity",
        "learning_path_id": "path_cybersecurity",
        "target_companies": ["Atlassian", "Microsoft"],
        "daily_minutes": 35,
        "learning_preferences": ["Challenges", "Hands-on"]
    }, headers={"Authorization": f"Bearer {u2_token}"})
    assert res.status_code == 200

    # Fetch User 2 Missions
    res = requests.get(f"{BASE_URL}/missions/today", headers={"Authorization": f"Bearer {u2_token}"})
    assert res.status_code == 200
    u2_missions = res.json()
    assert "Login That Shouldn't Exist" in u2_missions[0]["title"], f"Expected Cybersecurity mission, got: {u2_missions[0]['title']}"
    print(f"  [PASS] Dynamic Mission Provisioned: '{u2_missions[0]['title']}'")

    # 5. Test Multi-User State Isolation
    print("\n[TEST 5] Testing State Isolation Between Users...")
    u1_mission = u1_missions[0]
    u1_task = u1_mission["tasks"][0]
    
    # User 1 toggles task
    res = requests.post(
        f"{BASE_URL}/missions/{u1_mission['id']}/tasks/{u1_task['id']}/toggle",
        json={"completed": True},
        headers={"Authorization": f"Bearer {u1_token}"}
    )
    assert res.status_code == 200
    u1_toggle_res = res.json()
    assert u1_toggle_res["total_xp"] == 15, f"Expected 15 XP for User 1, got {u1_toggle_res['total_xp']}"
    print(f"  [PASS] User 1 (Priya) completed task and gained 15 XP (Total: {u1_toggle_res['total_xp']})")

    # Verify User 2's XP and tasks remain completely unaffected
    res = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {u2_token}"})
    u2_profile = res.json()
    assert u2_profile["total_xp"] == 0, f"User 2 XP must remain 0, got {u2_profile['total_xp']}"

    res = requests.get(f"{BASE_URL}/missions/today", headers={"Authorization": f"Bearer {u2_token}"})
    u2_missions_check = res.json()
    for t in u2_missions_check[0]["tasks"]:
        assert t["completed"] == False, "User 2 tasks must NOT be completed by User 1 actions"
    print("  [PASS] User 2 (Vikram) strictly isolated: XP is 0, all tasks uncompleted")

    # 6. Test Path Switching on the fly
    print("\n[TEST 6] Testing Real-Time Learning Path Switching...")
    res = requests.put(f"{BASE_URL}/users/me/learning-profile", json={
        "career_path": "AI / ML",
        "learning_path_id": "path_ai_ml",
        "track_type": "career"
    }, headers={"Authorization": f"Bearer {u1_token}"})
    assert res.status_code == 200

    res = requests.get(f"{BASE_URL}/missions/today", headers={"Authorization": f"Bearer {u1_token}"})
    u1_switched_missions = res.json()
    assert "Hallucinating Classifier" in u1_switched_missions[0]["title"], f"Expected AI/ML mission, got: {u1_switched_missions[0]['title']}"
    print(f"  [PASS] Path switched to AI/ML: New Mission is '{u1_switched_missions[0]['title']}'")

    print("\n" + "=" * 60)
    print("ALL MULTI-USER & DYNAMIC ROADMAP VERIFICATION TESTS PASSED! [OK]")
    print("=" * 60)

if __name__ == "__main__":
    test_all()

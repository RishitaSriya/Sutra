# -*- coding: utf-8 -*-
import json
import urllib.request
import urllib.error
import sys

BASE_URL = "http://127.0.0.1:8000/api"

def make_request(endpoint, method="GET", data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    body = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            return response.status, json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        res_body = e.read().decode("utf-8")
        try:
            parsed = json.loads(res_body)
        except Exception:
            parsed = {"error": res_body}
        return e.code, parsed
    except Exception as e:
        return 500, {"error": str(e)}

def test_demo_user(demo_type, expected_role, expected_lesson_title, expected_level):
    print(f"\n[TEST] Testing Demo Login: '{demo_type}'...")
    status, res = make_request("/auth/demo", method="POST", data={"demo_user": demo_type})
    if status != 200:
        print(f"  [FAIL] Demo login failed: {status} {res}")
        return False
    token = res.get("access_token")

    # 1. Test /users/me/learning-path
    status, path_data = make_request("/users/me/learning-path", token=token)
    if status != 200:
        print(f"  [FAIL] /users/me/learning-path failed: {status} {path_data}")
        return False
    print(f"  [PASS] Learning Path: '{path_data.get('title')}'")

    # 2. Test /users/me/current-lesson
    status, lesson_data = make_request("/users/me/current-lesson", token=token)
    if status != 200:
        print(f"  [FAIL] /users/me/current-lesson failed: {status} {lesson_data}")
        return False
    actual_title = lesson_data.get("title")
    print(f"  [PASS] Current Lesson Title: '{actual_title}'")
    
    if actual_title != expected_lesson_title:
        print(f"  [FAIL] Expected lesson '{expected_lesson_title}', got '{actual_title}'")
        return False

    # 3. Verify lesson steps and interactive moments
    if not lesson_data.get("interactive_moment"):
        print(f"  [FAIL] Missing interactive_moment in lesson")
        return False
    print(f"  [PASS] Interactive Moment: '{lesson_data['interactive_moment'].get('prompt')[:40]}...'")

    # 4. Test /users/me/today-mission
    status, m_data = make_request("/users/me/today-mission", token=token)
    if status == 200:
        print(f"  [PASS] Today's Mission count: {len(m_data)}")

    print(f"  [SUCCESS] All checks passed for demo user '{demo_type}'!")
    return True

def test_dynamic_path_switch():
    print(f"\n[TEST] Testing Dynamic Learning Path Switching across all 9 tracks...")
    test_user_data = {
        "name": "Path Switch Tester",
        "email": "tester_switch@sutra.app",
        "password": "password123",
        "confirm_password": "password123",
        "college": "Test University"
    }
    status, res = make_request("/auth/register", method="POST", data=test_user_data)
    if status != 200:
        status, res = make_request("/auth/login", method="POST", data={"email": test_user_data["email"], "password": test_user_data["password"]})
    
    token = res.get("access_token")

    test_paths = [
        ("path_data_science", "Data Scientist", "The Dataset That Lied"),
        ("path_ai_ml", "AI / ML", "The Machine That Had to Guess"),
        ("path_cybersecurity", "Cybersecurity", "The Login That Shouldn't Exist"),
        ("path_sde", "Software Developer", "The Bug That Only Appeared on Friday"),
        ("path_full_stack", "Full Stack Developer", "The Button That Did Nothing"),
        ("path_app_dev", "App Developer", "The App That Forgot Everything"),
        ("path_product_design", "Product Designer", "The Button Everyone Ignored"),
        ("path_gate_cse", "GATE CSE Journey", "Four Programs. One Computer."),
        ("path_web_dev", "Web Developer", "The Website That Couldn't Talk")
    ]

    all_passed = True
    for path_id, path_name, expected_story in test_paths:
        is_gate = "gate" in path_id
        update_payload = {
            "career_path": path_name,
            "learning_path_id": path_id,
            "track_type": "exam" if is_gate else "career"
        }
        status, res_update = make_request("/users/me/learning-profile", method="PUT", data=update_payload, token=token)
        if status != 200:
            print(f"  [FAIL] Failed to update profile to {path_name}: {res_update}")
            all_passed = False
            continue

        status, lesson = make_request("/users/me/current-lesson", token=token)
        if status != 200:
            print(f"  [FAIL] Failed to get lesson for {path_name}: {lesson}")
            all_passed = False
            continue

        title = lesson.get("title")
        if title == expected_story:
            print(f"  [PASS] {path_name} -> '{title}'")
        else:
            print(f"  [FAIL] {path_name} expected '{expected_story}', but got '{title}'")
            all_passed = False

    return all_passed

if __name__ == "__main__":
    passed = True
    passed &= test_demo_user("aarav", "Web Developer", "The Website That Couldn't Talk", 1)
    passed &= test_demo_user("meera", "Data Scientist", "The Dataset That Lied", 1)
    passed &= test_demo_user("kabir", "Cybersecurity", "The Login That Shouldn't Exist", 1)
    passed &= test_demo_user("ananya", "GATE CSE", "Four Programs. One Computer.", 1)
    passed &= test_dynamic_path_switch()

    if passed:
        print("\n=======================================================")
        print("[SUCCESS] ALL DOMAIN STORY VERIFICATION TESTS PASSED SUCCESSFULLY!")
        print("=======================================================")
        sys.exit(0)
    else:
        print("\n[FAIL] SOME TESTS FAILED!")
        sys.exit(1)

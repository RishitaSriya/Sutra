import json
import urllib.request
import sys

sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000"

def req(method, path, data=None, headers=None):
    url = f"{BASE_URL}{path}"
    h = {"Content-Type": "application/json"}
    if headers:
        h.update(headers)
    body = json.dumps(data).encode("utf-8") if data is not None else None
    r = urllib.request.Request(url, data=body, headers=h, method=method)
    try:
        with urllib.request.urlopen(r) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

def test_sandbox():
    print("--- 1. Testing Sandbox Supported Languages ---")
    status, langs = req("GET", "/api/sandbox/languages")
    assert status == 200
    print(f"[PASS] Languages supported: {[l['name'] for l in langs]}")

    # Login demo Aarav
    status, r_login = req("POST", "/api/auth/demo", {"demo_user": "aarav"})
    assert status == 200
    headers = {"Authorization": f"Bearer {r_login['access_token']}"}

    print("--- 2. Testing Python Code Execution ---")
    py_code = """
nums = [1, 2, 3, 4, 5]
squared = [x**2 for x in nums]
print("Computed:", squared)
"""
    status, py_res = req("POST", "/api/sandbox/run", {
        "code": py_code,
        "language": "python"
    }, headers=headers)
    assert status == 200
    assert py_res["success"] is True
    assert "Computed: [1, 4, 9, 16, 25]" in py_res["stdout"]
    print(f"[PASS] Python stdout: {py_res['stdout'].strip()} (Runtime: {py_res['execution_time_ms']}ms)")

    print("--- 3. Testing Node.js / JavaScript Execution ---")
    js_code = """
const items = ['DNS', 'TCP', 'HTTP', 'DOM'];
console.log('Flow:', items.join(' -> '));
"""
    status, js_res = req("POST", "/api/sandbox/run", {
        "code": js_code,
        "language": "javascript"
    }, headers=headers)
    assert status == 200
    assert js_res["success"] is True
    assert "Flow: DNS -> TCP -> HTTP -> DOM" in js_res["stdout"]
    print(f"[PASS] JavaScript stdout: {js_res['stdout'].strip()} (Runtime: {js_res['execution_time_ms']}ms)")

    print("--- 4. Testing Timeout Protection Guardrail ---")
    infinite_loop = """
import time
while True:
    time.sleep(0.1)
"""
    status, timeout_res = req("POST", "/api/sandbox/run", {
        "code": infinite_loop,
        "language": "python"
    }, headers=headers)
    assert status == 200
    assert timeout_res["success"] is False
    assert "Timeout" in timeout_res["stderr"] or timeout_res["exit_code"] == 124
    print(f"[PASS] Infinite loop safely terminated by sandbox: {timeout_res['stderr'][:80]}...")

    print("--- 5. Testing Challenge Evaluation with Correct O(N) Hash Map Solution ---")
    correct_solution = """
def solve(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []
"""
    status, eval_res = req("POST", "/api/challenges/challenge_boss_01/evaluate", {
        "code": correct_solution,
        "language": "python"
    }, headers=headers)
    assert status == 200
    assert eval_res["passed"] is True
    assert eval_res["score"] == 100
    assert eval_res["passed_tests"] == eval_res["total_tests"]
    assert eval_res["xp_awarded"] > 0
    print(f"[PASS] Challenge Graded: 100% ({eval_res['passed_tests']}/{eval_res['total_tests']} test cases passed)")
    print(f"       AI Feedback: {eval_res['ai_feedback']}")
    print(f"       XP Awarded: +{eval_res['xp_awarded']} XP (Total XP: {eval_res['total_xp']})")

    print("\nALL SANDBOX & CHALLENGE EVALUATION TESTS PASSED PERFECTLY!")

if __name__ == "__main__":
    test_sandbox()

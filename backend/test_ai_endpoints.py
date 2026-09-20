import json
import urllib.request

BASE_URL = "http://127.0.0.1:8000"

def req(method, path, data=None, headers=None):
    url = f"{BASE_URL}{path}"
    h = {"Content-Type": "application/json"}
    if headers:
        h.update(headers)
    body = json.dumps(data).encode("utf-8") if data else None
    r = urllib.request.Request(url, data=body, headers=h, method=method)
    try:
        with urllib.request.urlopen(r) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

def test_ai():
    print("--- Testing AI Status ---")
    status, res = req("GET", "/api/ai/status")
    assert status == 200
    print(f"[PASS] AI Status: {res}")

    # Login demo Kabir (Cybersecurity)
    status, r_login = req("POST", "/api/auth/demo", {"demo_user": "kabir"})
    assert status == 200
    headers = {"Authorization": f"Bearer {r_login['access_token']}"}

    # Test AI Chat
    print("--- Testing SUTRA Socratic AI Chat (Kabir / Cyber) ---")
    status, chat_res = req("POST", "/api/ai/chat", {
        "message": "Why do raw SQL queries expose our system to SQL injection?",
        "lesson_context": "The Login That Shouldn't Exist"
    }, headers=headers)
    assert status == 200
    print(f"[PASS] Persona: {chat_res['role_persona']}")
    print(f"Reply: {chat_res['reply'][:150]}...\n")

    # Test AI Explain
    print("--- Testing AI Explain ---")
    status, exp_res = req("POST", "/api/ai/explain", {
        "query": "Bcrypt Salting and Hashing",
        "language": "python"
    }, headers=headers)
    assert status == 200
    print(f"[PASS] Title: {exp_res['title']}")
    print(f"Analogy: {exp_res['analogy']}")

    # Test Flashcard Generation
    print("--- Testing AI Flashcard Generation ---")
    status, cards_res = req("POST", "/api/ai/generate-cards", {
        "topic": "Zero Trust Architecture",
        "count": 2
    }, headers=headers)
    assert status == 200
    print(f"[PASS] Generated {len(cards_res)} flashcards: {[c['question'] for c in cards_res]}")

    print("\nALL AI BACKEND TESTS PASSED!")

if __name__ == "__main__":
    test_ai()

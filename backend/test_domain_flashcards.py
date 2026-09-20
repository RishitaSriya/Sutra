import json
import urllib.request
import urllib.parse
import sys

BASE_URL = "http://127.0.0.1:8000"

def request(method, path, data=None, headers=None):
    url = f"{BASE_URL}{path}"
    req_headers = {"Content-Type": "application/json"}
    if headers:
        req_headers.update(headers)
    
    body = None
    if data is not None:
        body = json.dumps(data).encode("utf-8")
    
    req = urllib.request.Request(url, data=body, headers=req_headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            content = resp.read().decode("utf-8")
            return status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        return e.code, json.loads(content) if content else {}

def test_demo_users_flashcards():
    print("--- Testing Demo Users Domain-Specific Flashcards ---")

    # 1. Aarav (Web Dev)
    status, r = request("POST", "/api/auth/demo", {"demo_user": "aarav"})
    assert status == 200, f"Aarav login failed: {r}"
    token_aarav = r["access_token"]
    headers_aarav = {"Authorization": f"Bearer {token_aarav}"}

    status, aarav_cards = request("GET", "/api/flashcards", headers=headers_aarav)
    assert status == 200, f"Aarav flashcards failed: {aarav_cards}"
    assert len(aarav_cards) >= 6, f"Expected >= 6 cards, got {len(aarav_cards)}"
    aarav_topics = [c["topic"] for c in aarav_cards]
    print(f"[PASS] Aarav (Web Dev) cards: {len(aarav_cards)} cards -> {aarav_topics}")
    assert any("HTTP" in c["question"] or "DOM" in c["question"] or "Closure" in c["question"] for c in aarav_cards)

    # 2. Meera (Data Science)
    status, r = request("POST", "/api/auth/demo", {"demo_user": "meera"})
    assert status == 200, f"Meera login failed: {r}"
    token_meera = r["access_token"]
    headers_meera = {"Authorization": f"Bearer {token_meera}"}

    status, meera_cards = request("GET", "/api/flashcards", headers=headers_meera)
    assert status == 200, f"Meera flashcards failed: {meera_cards}"
    assert len(meera_cards) >= 6, f"Expected >= 6 cards, got {len(meera_cards)}"
    meera_topics = [c["topic"] for c in meera_cards]
    print(f"[PASS] Meera (Data Science) cards: {len(meera_cards)} cards -> {meera_topics}")
    assert any("Median" in c["question"] or "IQR" in c["question"] or "Correlation" in c["question"] for c in meera_cards)
    # Ensure no Web Dev fallback
    assert not any("Virtual DOM" in c["question"] for c in meera_cards)

    # 3. Kabir (Cybersecurity)
    status, r = request("POST", "/api/auth/demo", {"demo_user": "kabir"})
    assert status == 200, f"Kabir login failed: {r}"
    token_kabir = r["access_token"]
    headers_kabir = {"Authorization": f"Bearer {token_kabir}"}

    status, kabir_cards = request("GET", "/api/flashcards", headers=headers_kabir)
    assert status == 200, f"Kabir flashcards failed: {kabir_cards}"
    assert len(kabir_cards) >= 6, f"Expected >= 6 cards, got {len(kabir_cards)}"
    kabir_topics = [c["topic"] for c in kabir_cards]
    print(f"[PASS] Kabir (Cybersecurity) cards: {len(kabir_cards)} cards -> {kabir_topics}")
    assert any("Authentication" in c["question"] or "Bcrypt" in c["question"] or "SQL Injection" in c["question"] for c in kabir_cards)
    assert not any("Virtual DOM" in c["question"] for c in kabir_cards)

    # 4. Ananya (GATE CSE)
    status, r = request("POST", "/api/auth/demo", {"demo_user": "ananya"})
    assert status == 200, f"Ananya login failed: {r}"
    token_ananya = r["access_token"]
    headers_ananya = {"Authorization": f"Bearer {token_ananya}"}

    status, ananya_cards = request("GET", "/api/flashcards", headers=headers_ananya)
    assert status == 200, f"Ananya flashcards failed: {ananya_cards}"
    assert len(ananya_cards) >= 6, f"Expected >= 6 cards, got {len(ananya_cards)}"
    ananya_topics = [c["topic"] for c in ananya_cards]
    print(f"[PASS] Ananya (GATE CSE) cards: {len(ananya_cards)} cards -> {ananya_topics}")
    assert any("Process" in c["question"] or "PCB" in c["question"] or "Coffman" in c["question"] for c in ananya_cards)
    assert not any("Virtual DOM" in c["question"] for c in ananya_cards)

    # 5. Test /api/users/me/flashcards endpoint
    status, user_cards = request("GET", "/api/users/me/flashcards", headers=headers_ananya)
    assert status == 200
    assert len(user_cards) == len(ananya_cards)
    print(f"[PASS] /api/users/me/flashcards returned {len(user_cards)} cards matching /api/flashcards")

    # 6. Test Path Switch & Verify Deck Dynamism for AI/ML and App Dev
    print("--- Testing Path Switching Dynamic Flashcards ---")
    
    # Switch Aarav to AI/ML
    status, _ = request("PUT", "/api/users/me/learning-profile", {
        "career_path": "AI & ML Engineer",
        "learning_path_id": "path_ai_ml",
        "track_type": "career"
    }, headers=headers_aarav)
    assert status == 200, f"Failed updating profile to AI/ML: {_}"
    status, aiml_cards = request("GET", "/api/flashcards", headers=headers_aarav)
    assert status == 200
    assert len(aiml_cards) >= 6
    aiml_topics = [c["topic"] for c in aiml_cards]
    print(f"[PASS] Switched to AI/ML: {len(aiml_cards)} cards -> {aiml_topics}")
    assert any("Gradient Descent" in c["question"] or "Overfitting" in c["question"] for c in aiml_cards)

    # Switch Aarav to Mobile App Dev
    status, _ = request("PUT", "/api/users/me/learning-profile", {
        "career_path": "Mobile App Developer",
        "learning_path_id": "path_app_dev",
        "track_type": "career"
    }, headers=headers_aarav)
    assert status == 200, f"Failed updating profile to App Dev: {_}"
    status, app_cards = request("GET", "/api/flashcards", headers=headers_aarav)
    assert status == 200
    assert len(app_cards) >= 6
    app_topics = [c["topic"] for c in app_cards]
    print(f"[PASS] Switched to App Dev: {len(app_cards)} cards -> {app_topics}")
    assert any("Stateful vs Stateless" in c["question"] or "AsyncStorage" in c["question"] for c in app_cards)

    # 7. Test Flashcard Review endpoint
    first_card_id = app_cards[0]["id"]
    status, rev_data = request("POST", f"/api/flashcards/{first_card_id}/review", {"remembered": True}, headers=headers_aarav)
    assert status == 200
    assert rev_data["success"] is True
    assert rev_data["times_reviewed"] >= 1
    assert rev_data["mastery_score"] > 0
    print(f"[PASS] Review Flashcard: id={first_card_id}, times_reviewed={rev_data['times_reviewed']}, mastery={rev_data['mastery_score']}%")

    print("\nALL FLASHCARD VERIFICATION TESTS PASSED PERFECTLY!")

if __name__ == "__main__":
    test_demo_users_flashcards()

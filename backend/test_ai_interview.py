import os
import sys
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.services.gemini_service import gemini_service

def test_mock_interview():
    print("=== Testing AI Mock Technical Interviewer ===")
    
    # 1. Test Start Interview for Razorpay
    print("\n[1] Starting Interview for Razorpay (Web Developer)...")
    start_res = gemini_service.start_mock_interview(
        user_name="Rishita",
        user_role="Web Developer",
        company="Razorpay",
        track_type="career"
    )
    print(f"Interview ID: {start_res['interview_id']}")
    print(f"Interviewer Persona: {start_res['interviewer_persona']}")
    print(f"Round {start_res['round_number']} of {start_res['total_rounds']}")
    print(f"Question: {start_res['question']}")
    print(f"Context Hint: {start_res['context_hint']}")
    
    assert start_res["round_number"] == 1
    assert "Razorpay" in start_res["company"] or "Razorpay" in start_res["interviewer_persona"]
    
    # 2. Test Evaluate Round 1 Answer
    print("\n[2] Submitting Candidate Answer for Round 1...")
    sample_answer = """
    To ensure idempotent payment processing at Razorpay, I would implement:
    1. Idempotency Keys: Require merchants or bank callbacks to supply a unique `idempotency_key` (UUID v4) stored in Redis with a 24-hour TTL and DB unique constraint.
    2. Distributed Locking: Use Redlock on Redis with a 15-second TTL per payment ID to serialize concurrent webhook deliveries and avoid double-crediting.
    3. State Machine: Strictly transition payment status: PENDING -> PROCESSING -> SUCCESS / FAILED. If a request arrives for an already SUCCESS transaction, immediately return the cached receipt without mutating balances.
    4. Dead Letter Queue: Route failed webhook deliveries to RabbitMQ DLQ with exponential backoff and jitter.
    """
    
    eval_res = gemini_service.evaluate_interview_answer(
        user_role="Web Developer",
        company="Razorpay",
        question=start_res["question"],
        answer=sample_answer,
        round_number=1
    )
    
    print(f"Score: {eval_res['score']}/10")
    print(f"Feedback: {eval_res['feedback'][:200]}...")
    print(f"Strengths: {eval_res['key_strengths']}")
    print(f"Improvements: {eval_res['improvements']}")
    print(f"XP Awarded: {eval_res['xp_awarded']}")
    print(f"Next Question (Round {eval_res['next_round']}): {eval_res['next_question']}")
    
    assert eval_res["score"] >= 1
    assert eval_res["next_round"] == 2
    assert not eval_res["is_completed"]
    
    # 3. Test Round 3 Final Evaluation & Verdict
    print("\n[3] Testing Round 3 Final Evaluation & Hiring Verdict...")
    final_eval = gemini_service.evaluate_interview_answer(
        user_role="Web Developer",
        company="Razorpay",
        question=eval_res.get("next_question", "How do you handle zero-downtime database schema migrations?"),
        answer="I use expand-and-contract migrations (dual writing, backfilling, then dropping old columns) with Prometheus P99 alerting and automated canary rollbacks.",
        round_number=3
    )
    
    print(f"Final Score: {final_eval['score']}/10")
    print(f"Verdict: {final_eval['verdict']}")
    print(f"XP Awarded: {final_eval['xp_awarded']}")
    print(f"Is Completed: {final_eval['is_completed']}")
    
    assert final_eval["is_completed"] is True
    assert final_eval["verdict"] in ["Strong Hire", "Hire", "Needs Practice"]
    print("\n[SUCCESS] AI Mock Interview service tested successfully!")

if __name__ == "__main__":
    test_mock_interview()

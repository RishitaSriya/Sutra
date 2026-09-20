from typing import Dict, Any, List, Optional
from app.services.gemini_service import gemini_service

class AIService:
    """
    Unified AI service layer connecting SUTRA to Google Gemini API
    with persona-based Socratic reasoning and curriculum generation.
    """
    def __init__(self):
        self.gemini = gemini_service

    def chat(self, user_name: str, user_role: str, track_type: str, message: str, context: str = ""):
        return self.gemini.chat_with_mentor(user_name, user_role, track_type, message, context)

    def explain(self, user_role: str, query: str, language: str = "javascript"):
        return self.gemini.explain_code_or_concept(user_role, query, language)

    def generate_flashcards(self, topic: str, user_role: str, count: int = 3):
        return self.gemini.generate_flashcards(topic, user_role, count)

    def generate_learning_story(self, topic: str, role_context: str, company: str) -> Dict[str, Any]:
        return {
            "title": f"The {topic} Dilemma at {company}",
            "role_context": f"Junior Engineer at {company}",
            "narrative": {
                "premise": f"You just joined {company}. Your team is preparing for a high-traffic release involving {topic}.",
                "dilemma": "A mysterious edge case causes sudden latency spikes under heavy concurrent requests.",
                "objective": f"Trace the system flow and master {topic} to ensure zero downtime."
            },
            "interactive_prompt": f"Arrange the architectural stages of {topic} in correct order:"
        }

    def generate_mission(self, level_title: str, user_role: str, time_minutes: int = 30) -> Dict[str, Any]:
        return {
            "title": f"Mission: {level_title} Sprint",
            "subtitle": f"Hands-on {user_role} challenge designed for {time_minutes} minutes",
            "duration_minutes": time_minutes,
            "tasks": [
                {"text": "Enter the story & diagnose the system flow", "type": "story", "xp": 15},
                {"text": "Understand core mechanisms & diagrams", "type": "concept", "xp": 15},
                {"text": "Complete the scenario challenge", "type": "challenge", "xp": 15},
                {"text": "Explain what you learned & write practice code", "type": "practice", "xp": 15},
            ]
        }

    def generate_mcq(self, concept_title: str, difficulty: str = "medium") -> Dict[str, Any]:
        return {
            "question": f"In a production system handling {concept_title}, what ensures idempotency across network retries?",
            "context": f"{concept_title} in Real-World Production",
            "options": [
                {"id": "opt_a", "label": "Use idempotent request headers (Idempotency-Key)", "isCorrect": True, "feedback": "Correct! Duplicate retries produce identical outcomes without duplicate side-effects."},
                {"id": "opt_b", "label": "Disable client timeouts completely", "isCorrect": False, "feedback": "Disabling timeouts causes client thread starvation."},
                {"id": "opt_c", "label": "Switch all POST calls to raw TCP sockets", "isCorrect": False, "feedback": "Raw sockets do not solve state deduplication."},
            ],
            "correct_option_id": "opt_a",
            "explanation": "Idempotency keys allow the server to cache and return the original response when identical requests arrive."
        }

    def generate_short_notes(self, concept_title: str) -> Dict[str, Any]:
        return {
            "title": f"{concept_title} in 60 Seconds",
            "read_time": "60 SEC READ",
            "what_it_is": f"{concept_title} provides reliable abstraction across modern web systems.",
            "think_of_it_like": "Ordering food at a busy cafe through a waiter rather than cooking in the kitchen.",
            "remember_this": [
                "Always validate inputs before dispatching across network.",
                "Understand the difference between sync and async execution."
            ],
            "common_mistake": "Assuming network requests never fail or retry."
        }

    def evaluate_answer(self, question_text: str, student_answer: str, rubric: str = "") -> Dict[str, Any]:
        return {
            "is_correct": True,
            "score": 95,
            "feedback": "Spot-on! Your explanation demonstrates strong architectural intuition.",
            "suggestions": ["Consider mentioning how status codes impact client caching."]
        }

    def calculate_mastery(self, attempts: int, scores: List[int]) -> int:
        if not scores:
            return 50
        avg = sum(scores) / len(scores)
        return min(100, max(10, int(avg)))

ai_service = AIService()

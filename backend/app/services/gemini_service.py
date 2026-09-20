import os
import json
from typing import Dict, Any, List, Optional
from datetime import datetime
from pathlib import Path
import re

def safe_json_loads(text: str) -> Any:
    text = text.strip()
    if "```json" in text:
        text = text.split("```json", 1)[1].split("```", 1)[0].strip()
    elif "```" in text:
        text = text.split("```", 1)[1].split("```", 1)[0].strip()
    
    try:
        return json.loads(text, strict=False)
    except Exception:
        pass
    
    first_brace = text.find('{')
    last_brace = text.rfind('}')
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        sub = text[first_brace:last_brace+1]
        try:
            return json.loads(sub, strict=False)
        except Exception:
            pass

    # Regex extraction fallback for interview/evaluation JSON structures
    extracted: Dict[str, Any] = {}
    score_m = re.search(r'"score"\s*:\s*(\d+)', text)
    if score_m:
        extracted["score"] = int(score_m.group(1))

    fb_m = re.search(r'"feedback"\s*:\s*"((?:[^"\\]|\\.)*)"', text, re.DOTALL) or re.search(r'"feedback"\s*:\s*"(.*?)(?="\s*,\s*"\w+"|\s*})', text, re.DOTALL)
    if fb_m:
        extracted["feedback"] = fb_m.group(1).replace('\\n', '\n').replace('\\"', '"').strip()

    q_m = re.search(r'"(?:question|next_question)"\s*:\s*"((?:[^"\\]|\\.)*)"', text, re.DOTALL) or re.search(r'"(?:question|next_question)"\s*:\s*"(.*?)(?="\s*,\s*"\w+"|\s*})', text, re.DOTALL)
    if q_m:
        extracted["question"] = q_m.group(1).replace('\\n', '\n').replace('\\"', '"').strip()
        extracted["next_question"] = extracted["question"]

    hint_m = re.search(r'"context_hint"\s*:\s*"((?:[^"\\]|\\.)*)"', text, re.DOTALL) or re.search(r'"context_hint"\s*:\s*"(.*?)(?="\s*,\s*"\w+"|\s*})', text, re.DOTALL)
    if hint_m:
        extracted["context_hint"] = hint_m.group(1).replace('\\n', '\n').replace('\\"', '"').strip()

    v_m = re.search(r'"verdict"\s*:\s*"([^"]+)"', text)
    if v_m:
        extracted["verdict"] = v_m.group(1).strip()

    # Extract list of strings for strengths and improvements
    def extract_list(field_name: str) -> List[str]:
        m = re.search(rf'"{field_name}"\s*:\s*\[(.*?)\]', text, re.DOTALL)
        if not m:
            return []
        items = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', m.group(1))
        return [item.replace('\\"', '"').strip() for item in items if item.strip()]

    strengths = extract_list("key_strengths")
    if strengths:
        extracted["key_strengths"] = strengths

    improvements = extract_list("improvements")
    if improvements:
        extracted["improvements"] = improvements

    if extracted and ("question" in extracted or "score" in extracted or "feedback" in extracted):
        return extracted

    raise ValueError(f"Could not parse valid JSON from: {text[:80]}...")


def get_gemini_key() -> str:
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if key:
        return key
    env_file = Path(__file__).resolve().parent.parent.parent / ".env"
    if env_file.exists():
        try:
            for line in env_file.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if line.startswith("GEMINI_API_KEY="):
                    return line.split("=", 1)[1].strip().strip("\"'")
        except Exception:
            pass
    return ""

def get_gemini_model():
    key = get_gemini_key()
    if not key:
        return None
    try:
        # pyrefly: ignore [missing-import]
        import google.generativeai as genai
        genai.configure(api_key=key)
        return genai.GenerativeModel(
            model_name="gemini-3.6-flash",
            generation_config={"temperature": 0.7, "max_output_tokens": 1024}
        )
    except Exception as e:
        print(f"[SUTRA AI] Gemini configuration note: {e}")
        return None


PERSONA_MAP = {
    "Web Developer": {
        "persona": "Senior Frontend Architect @ ChaiPay (Bengaluru)",
        "tone": "sharp, production-focused, loves clean architecture and performance optimizations",
        "sample_hint": "Think about how DNS resolution and TCP handshakes happen before the browser ever paints a single pixel!"
    },
    "Data Scientist": {
        "persona": "Principal Data Scientist @ QuickMart",
        "tone": "empirical, mathematically grounded, always questions data distribution and bias",
        "sample_hint": "Remember that extreme outliers skew the mean heavily, whereas the median remains resilient."
    },
    "AI / ML": {
        "persona": "Chief AI Scientist @ SpamShield AI",
        "tone": "probabilistic, focuses on loss functions, tensor geometry, and generalization error",
        "sample_hint": "Look at the confusion matrix: when false positives are catastrophic, prioritize Precision over Recall."
    },
    "Cybersecurity": {
        "persona": "SOC Incident Commander @ Fortress Bank",
        "tone": "vigilant, zero-trust mindset, breaks down exploits to build unbreakable defenses",
        "sample_hint": "Never trust raw client input. Prepared statements parameterize queries at the database driver level."
    },
    "Software Developer": {
        "persona": "Staff SDE @ RideNow (Hyderabad)",
        "tone": "pragmatic, obsessed with Big-O, concurrency safety, and cache-friendly data structures",
        "sample_hint": "Replacing a nested O(N^2) search with an O(1) hash map lookup transforms latency at scale."
    },
    "Full Stack": {
        "persona": "Principal Full Stack Architect @ SaaSify",
        "tone": "holistic, balances database ACID transactions with responsive React UI state",
        "sample_hint": "Keep your backend handlers idempotent and verify JWT signatures before mutating database records."
    },
    "App Developer": {
        "persona": "Lead Mobile Architect @ MetroGo (Delhi)",
        "tone": "battery-conscious, offline-first advocate, master of mobile frame rates",
        "sample_hint": "Store mission-critical state in local AsyncStorage/SQLite so the app survives offline network loss."
    },
    "Product Designer": {
        "persona": "Head of Product Experience @ EduLearn",
        "tone": "empathic, visual hierarchy purist, accessibility and UX researcher",
        "sample_hint": "Users scan in an F-shaped pattern. High visual contrast (WCAG 4.5:1) drives primary call-to-actions."
    },
    "GATE CSE Journey": {
        "persona": "GATE Rank-1 & IISc / IIT OS Professor",
        "tone": "rigorous, standard-textbook grounded (Galvin / Korth / Cormen), exam-smart",
        "sample_hint": "In OS scheduling, smaller time quantum reduces response time but incurs heavy context-switching overhead."
    }
}

def resolve_persona(role: Optional[str]) -> Dict[str, str]:
    if not role:
        return PERSONA_MAP["Web Developer"]
    for key, p in PERSONA_MAP.items():
        if key.lower() in role.lower() or role.lower() in key.lower():
            return p
    return PERSONA_MAP["Web Developer"]


class GeminiService:
    def get_status(self) -> Dict[str, Any]:
        has_key = bool(get_gemini_key())
        return {
            "gemini_configured": has_key,
            "provider": "Google Gemini (gemini-3.6-flash)" if has_key else "SUTRA Socratic AI Engine",
            "active_personas": list(PERSONA_MAP.keys()),
            "status": "online"
        }

    def chat_with_mentor(
        self,
        user_name: str,
        user_role: str,
        track_type: str,
        message: str,
        lesson_context: str = "",
        code_snippet: Optional[str] = None
    ) -> Dict[str, Any]:
        persona_info = resolve_persona(user_role)
        role_persona = persona_info["persona"]
        tone = persona_info["tone"]

        system_instruction = f"""
You are SUTRA AI Socratic Mentor.
Your Role Persona: {role_persona}
Your Tone: {tone}
Learner: {user_name} (studying {user_role}, {track_type} track)
Current Lesson / System Context: {lesson_context or 'General engineering mission'}

Rules for Teaching:
1. Teach Socratically: Guide the student with thoughtful intuition, intuitive real-world analogies, and step-by-step reasoning.
2. If the student asks for a solution or hint, explain the architectural WHY before the HOW.
3. Stay strictly in your technical persona.
4. Keep the response concise, punchy (2-4 short paragraphs), and formatting friendly with clean markdown.
5. End with 1 thought-provoking follow-up question to test their understanding.
"""
        user_prompt = f"Student says: {message}"
        if code_snippet:
            user_prompt += f"\n\nStudent code snippet:\n```{code_snippet}\n```"

        model = get_gemini_model()
        if model:
            try:
                full_prompt = f"{system_instruction}\n\n{user_prompt}"
                res = model.generate_content(full_prompt)
                reply_text = res.text
                return {
                    "reply": reply_text,
                    "role_persona": role_persona,
                    "suggested_followups": [
                        "Explain this with a real-world analogy",
                        "Show me the production code pattern",
                        "What is a common edge-case bug here?"
                    ],
                    "timestamp": datetime.utcnow().isoformat(),
                    "is_live_gemini": True
                }
            except Exception as err:
                print(f"[Gemini Error] Falling back to Socratic engine: {err}")

        # Deterministic High-Fidelity Socratic Fallback
        reply = (
            f"Hey {user_name}! In our team at {role_persona.split('@')[-1].strip()}, we see this pattern often.\n\n"
            f"Regarding **'{message}'**:\n"
            f"{persona_info['sample_hint']}\n\n"
            f"When tackling this in production, avoid making assumptions about system state. "
            f"Trace the data flow layer-by-layer: verify input invariants, observe how memory or network calls propagate, "
            f"and always ensure clean error boundaries."
        )

        return {
            "reply": reply,
            "role_persona": role_persona,
            "suggested_followups": [
                "Give me a step-by-step hint",
                "How does this appear in tech interviews?",
                "What is the Big-O time complexity?"
            ],
            "timestamp": datetime.utcnow().isoformat(),
            "is_live_gemini": False
        }

    def explain_code_or_concept(
        self,
        user_role: str,
        query: str,
        language: str = "javascript"
    ) -> Dict[str, Any]:
        persona_info = resolve_persona(user_role)
        role_persona = persona_info["persona"]

        model = get_gemini_model()
        if model:
            try:
                prompt = f"""
Role: {role_persona}
Explain the following code/concept for a {user_role} learner:
Query: {query}
Language: {language}

Provide JSON format:
{{
  "title": "Clear Title",
  "explanation": "2-3 sentence core explanation",
  "analogy": "A memorable real-world analogy",
  "common_pitfall": "The #1 bug developers make here",
  "key_takeaways": ["point 1", "point 2", "point 3"]
}}
"""
                res = model.generate_content(prompt)
                text = res.text.strip()
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0].strip()
                elif "```" in text:
                    text = text.split("```")[1].split("```")[0].strip()
                data = json.loads(text)
                data["role_persona"] = role_persona
                return data
            except Exception as e:
                print(f"[Gemini Explain Error]: {e}")

    def generate_short_note(
        self,
        topic: str,
        user_role: str = "Web Developer"
    ) -> Dict[str, Any]:
        persona_info = resolve_persona(user_role)
        role_persona = persona_info["persona"]

        model = get_gemini_model()
        if model:
            try:
                prompt = f"""
You are {role_persona}. Generate a high-yield 60-Second Short Revision Note for a {user_role} student on the topic: "{topic}".
Return ONLY a valid JSON object with the following schema:
{{
  "title": "Clear punchy concept title",
  "topic": "{topic}",
  "category": "{user_role}",
  "read_time": "60 SEC",
  "what_it_is": "A clear, precise 2-sentence explanation of what this concept is and why it exists in production.",
  "think_of_it_like": "A brilliant, memorable real-world analogy that makes the concept click instantly.",
  "remember_this": [
    "Crucial technical invariant 1",
    "Performance or Big-O consideration 2",
    "Production best practice 3"
  ],
  "common_mistake": "The #1 mistake junior or mid-level engineers make when designing or coding this."
}}
"""
                res = model.generate_content(prompt)
                data = safe_json_loads(res.text)
                return {
                    "id": f"note_{int(datetime.utcnow().timestamp())}",
                    "title": data.get("title", f"Mastering {topic}"),
                    "topic": topic,
                    "category": data.get("category", user_role),
                    "read_time": "60 SEC",
                    "what_it_is": data.get("what_it_is", f"{topic} defines critical execution rules in {user_role}."),
                    "think_of_it_like": data.get("think_of_it_like", "An automated checkpoint that validates data invariants."),
                    "remember_this": data.get("remember_this", [
                        "Always measure before optimizing",
                        "Ensure clean error boundaries",
                        "Keep operations idempotent across nodes"
                    ]),
                    "common_mistake": data.get("common_mistake", "Failing to account for asynchronous network latency and null bounds."),
                    "is_saved": True
                }
            except Exception as e:
                print(f"[Gemini Short Note Error]: {e}")

        # Deterministic fallback
        return {
            "id": f"note_{int(datetime.utcnow().timestamp())}",
            "title": f"Quick Guide: {topic}",
            "topic": topic,
            "category": user_role,
            "read_time": "60 SEC",
            "what_it_is": f"{topic} is a core foundation in {user_role} that ensures system correctness, predictable state, and optimal performance.",
            "think_of_it_like": "A traffic signal system preventing collisions across concurrent data streams.",
            "remember_this": [
                "Verify input invariants early at the boundary layer",
                "Minimize redundant state mutations and allocations",
                "Ensure resilient fallback paths on failure"
            ],
            "common_mistake": "Assuming network requests or database writes never fail or time out.",
            "is_saved": True
        }

    def generate_flashcards(
        self,
        topic: str,
        user_role: str,
        count: int = 3
    ) -> List[Dict[str, Any]]:
        persona_info = resolve_persona(user_role)

        model = get_gemini_model()
        if model:
            try:
                prompt = f"""
Generate {count} high-yield active-recall flashcards for a {user_role} student on the topic: "{topic}".
Return ONLY a valid JSON array of objects with the following schema:
[
  {{
    "topic": "{topic}",
    "category": "{user_role}",
    "question": "Question testing core concept or production trade-off",
    "answer": "Concise, precise explanation with key architectural insight",
    "difficulty": "medium",
    "code_snippet": "optional 1-3 line code example or null"
  }}
]
"""
                res = model.generate_content(prompt)
                text = res.text.strip()
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0].strip()
                elif "```" in text:
                    text = text.split("```")[1].split("```")[0].strip()
                cards = json.loads(text)
                for i, c in enumerate(cards):
                    c["id"] = f"gemini_fc_{int(datetime.utcnow().timestamp())}_{i+1}"
                    c["mastery_score"] = 0
                    c["times_reviewed"] = 0
                return cards
            except Exception as e:
                print(f"[Gemini Flashcards Error]: {e}")

        # Fallback synthesized cards
        return [
            {
                "id": f"gemini_fc_{int(datetime.utcnow().timestamp())}_1",
                "topic": topic,
                "category": user_role,
                "question": f"What is the primary architectural purpose of {topic}?",
                "answer": f"{topic} ensures fault isolation and deterministic state execution across {user_role} architectures.",
                "difficulty": "medium",
                "code_snippet": None,
                "mastery_score": 0,
                "times_reviewed": 0
            },
            {
                "id": f"gemini_fc_{int(datetime.utcnow().timestamp())}_2",
                "topic": topic,
                "category": user_role,
                "question": f"What is the major operational trade-off when implementing {topic}?",
                "answer": f"It optimizes execution speed and consistency at the cost of additional memory allocations or initialization latency.",
                "difficulty": "hard",
                "code_snippet": None,
                "mastery_score": 0,
                "times_reviewed": 0
            }
        ]

    def start_mock_interview(
        self,
        user_name: str,
        user_role: str,
        company: str = "Razorpay",
        track_type: str = "career"
    ) -> Dict[str, Any]:
        interviewer_personas = {
            "Razorpay": "Senior Staff Payments Architect @ Razorpay (Bengaluru)",
            "Google": "Principal SDE & Distributed Systems Bar Raiser @ Google",
            "Microsoft": "Principal Cloud Infrastructure Architect @ Microsoft",
            "CrowdStrike": "Senior Security & Systems Reliability Engineer @ CrowdStrike",
            "Swiggy": "Staff Logistics & Real-Time Engine Architect @ Swiggy",
            "General": f"Lead Technical Interviewer ({company})"
        }
        interviewer_persona = interviewer_personas.get(company, f"Lead Technical Bar Raiser @ {company}")

        model = get_gemini_model()
        if model:
            try:
                prompt = f"""
You are {interviewer_persona}. You are interviewing candidate {user_name} for a {user_role} role at {company}.
This is Round 1 of a 3-round technical interview.

Generate an authentic, challenging technical interview question tailored to {company}'s real-world engineering problems and the {user_role} role.
For example:
- If Razorpay: Focus on payment idempotency, webhook retries, transaction locks, double-spend prevention, or database consistency.
- If Google: Focus on high-scale distributed caching, consistent hashing, Trie/indexing, concurrency, or sub-10ms latency.
- If Microsoft: Focus on resilient cloud microservices, async message queues, dead-letter recovery, or stateful scaling.
- If CrowdStrike: Focus on kernel telemetry streaming, zero packet drop, low memory footprint, or security edge cases.
- If Swiggy: Focus on geospatial rider allocation, H3/geohash indexing, surge matching, or distributed rate limiting.

Return ONLY a JSON object with this exact structure:
{{
  "question": "Clear, immersive scenario-based technical question asking for architectural or algorithmic design with trade-offs",
  "context_hint": "A 1-2 sentence hint or constraint regarding scale, latency, or concurrency expectations"
}}
"""
                res = model.generate_content(prompt)
                data = safe_json_loads(res.text)
                return {
                    "interview_id": f"interview_{int(datetime.utcnow().timestamp())}",
                    "company": company,
                    "role": user_role,
                    "interviewer_persona": interviewer_persona,
                    "round_number": 1,
                    "total_rounds": 3,
                    "question": data.get("question", "Describe how you design an idempotent transaction handling service under high concurrency."),
                    "context_hint": data.get("context_hint", "Consider network timeouts, distributed lock expiration, and DB isolation levels."),
                    "timestamp": datetime.utcnow().isoformat()
                }
            except Exception as e:
                print(f"[Gemini Interview Start Error]: {e}")

        # Deterministic company fallbacks
        fallback_questions = {
            "Razorpay": {
                "question": "At Razorpay, we process millions of payment webhooks daily from partner banks. Occasionally, partner banks send duplicate webhooks or deliver them out of order during network congestion. How would you design a high-throughput, idempotent payment verification service that guarantees no user is double-credited and ensures exactly-once order finalization?",
                "context_hint": "Think about Idempotency Keys (UUIDs), Redis distributed locks (Redlock), DB unique constraints, and transaction isolation levels."
            },
            "Google": {
                "question": "Design a globally distributed URL shortening service (like bit.ly) that receives 500 million new URLs per month and serves 10 billion read requests per month with sub-10ms latency. How would you generate unique 7-character Base62 keys without cross-datacenter race conditions, and how would you structure the multi-layer caching tier?",
                "context_hint": "Consider key-generation services (KGS), ZooKeeper range allocation, LRU caching with Redis/Memcached, and bloom filters."
            },
            "Microsoft": {
                "question": "You are designing an asynchronous document processing pipeline for Office 365 that handles millions of uploaded attachments per hour. Workers must parse documents, scan for viruses, and generate thumbnails. How do you design the message broker, handle dead-letter poison pills, and ensure zero data loss during sudden worker node reboots?",
                "context_hint": "Think about Azure Service Bus / RabbitMQ acknowledgment mechanisms, exponential backoff with jitter, and blob storage checksums."
            },
            "CrowdStrike": {
                "question": "Design a high-throughput security telemetry ingestion agent that streams 50,000 process execution events per second from endpoints to a cloud security lake with zero dropped packets and strictly less than 2% CPU overhead. How do you handle ring buffers, backpressure, and local crash recovery?",
                "context_hint": "Consider lock-free ring buffers, batching with Snappy compression, local memory-mapped file write-ahead logs, and TCP socket pooling."
            },
            "Swiggy": {
                "question": "Design a real-time hyper-local delivery partner matching algorithm for Swiggy during peak rain surges. How do you ingest geospatial rider GPS coordinates every 3 seconds, calculate proximity using spatial indexing (e.g. Uber H3 / Geohash), and batch-dispatch orders while minimizing average customer wait time?",
                "context_hint": "Consider spatial geohashing / H3 hexagonal hierarchies, Redis geospatial indices (GEOADD/GEORADIUS), and Hungarian matching algorithm for batching."
            }
        }
        preset = fallback_questions.get(company, {
            "question": f"At {company}, we are scaling our core platform to handle 10x current traffic. How would you design a scalable, fault-tolerant backend service that balances low latency reads with high consistency writes under peak load?",
            "context_hint": "Discuss database partitioning, caching strategies, asynchronous message queues, and circuit breaker patterns."
        })

        return {
            "interview_id": f"interview_{int(datetime.utcnow().timestamp())}",
            "company": company,
            "role": user_role,
            "interviewer_persona": interviewer_persona,
            "round_number": 1,
            "total_rounds": 3,
            "question": preset["question"],
            "context_hint": preset["context_hint"],
            "timestamp": datetime.utcnow().isoformat()
        }

    def evaluate_interview_answer(
        self,
        user_role: str,
        company: str,
        question: str,
        answer: str,
        round_number: int
    ) -> Dict[str, Any]:
        is_completed = (round_number >= 3)
        interviewer_persona = f"Staff Engineer & Bar Raiser @ {company}"

        model = get_gemini_model()
        if model:
            try:
                if is_completed:
                    prompt = f"""
You are {interviewer_persona}. You are conducting the final Round 3 technical review for a {user_role} candidate at {company}.
The candidate just answered the final question:
Question: {question}
Candidate's Answer: {answer}

Provide a comprehensive, professional interview assessment in JSON format:
{{
  "score": 8,
  "feedback": "2-3 paragraphs of thorough technical feedback analyzing their engineering trade-offs, architecture choices, and clarity",
  "key_strengths": ["Clear strength 1", "Clear strength 2"],
  "improvements": ["Specific improvement 1", "Specific improvement 2"],
  "verdict": "Strong Hire"
}}
"""
                else:
                    prompt = f"""
You are {interviewer_persona}. You are conducting Round {round_number} of a 3-round technical interview for a {user_role} candidate at {company}.
The candidate just answered your question:
Question: {question}
Candidate's Answer: {answer}

Evaluate their answer and create a targeted follow-up question for Round {round_number + 1} that delves into edge cases, scalability limits, failure recovery, or concurrency trade-offs specific to {company}.

Return ONLY a JSON object:
{{
  "score": 8,
  "feedback": "1-2 concise paragraphs of actionable feedback on what they did well and where they left architectural gaps",
  "key_strengths": ["Point 1", "Point 2"],
  "improvements": ["Point 1", "Point 2"],
  "next_question": "A deep, realistic Round {round_number + 1} follow-up or edge-case question continuing the technical discussion"
}}
"""
                res = model.generate_content(prompt)
                data = safe_json_loads(res.text)

                score = int(data.get("score", 7))
                score = max(1, min(10, score))
                xp_awarded = score * 12 + (60 if is_completed else 0)

                return {
                    "score": score,
                    "feedback": data.get("feedback", "Good technical discussion with valid architectural intuition."),
                    "key_strengths": data.get("key_strengths", ["Addressed core problem requirements", "Clear communication style"]),
                    "improvements": data.get("improvements", ["Mention specific failure modes and monitoring metrics"]),
                    "is_completed": is_completed,
                    "next_question": None if is_completed else data.get("next_question", f"How would your architecture recover if a sudden network partition splits the database cluster in half?"),
                    "next_round": None if is_completed else (round_number + 1),
                    "verdict": data.get("verdict", "Hire" if score >= 7 else "Needs Practice") if is_completed else None,
                    "xp_awarded": xp_awarded
                }
            except Exception as e:
                print(f"[Gemini Interview Evaluation Error]: {e}")

        # High quality fallback evaluation
        ans_len = len(answer.strip())
        score = 8 if ans_len > 250 else (6 if ans_len > 80 else 4)
        xp_awarded = score * 12 + (60 if is_completed else 0)

        next_q = None
        if not is_completed:
            if round_number == 1:
                next_q = f"Great start on the high-level architecture. Now let's dig into failure modes: what happens if your primary database leader node suffers a hardware failure right in the middle of writing a state update? Walk me through your replica failover and consistency guarantees."
            else:
                next_q = f"Let's wrap up with observability and scale: what key metrics (P99 latency, error budgets, saturation) would you monitor with Prometheus/Grafana, and how would you configure automated canary deployments to prevent bad releases from breaking production?"

        verdict = "Strong Hire" if score >= 8 else ("Hire" if score >= 6 else "Needs Practice")

        return {
            "score": score,
            "feedback": (
                f"Your approach demonstrates a practical understanding of distributed systems at {company}. "
                f"You structured the components logically and touched upon the primary trade-offs. "
                f"To make this truly staff-level, be even more explicit about concrete numbers (QPS, storage volume), "
                f"exact failure protocols, and idempotency guarantees under partial network partitions."
            ),
            "key_strengths": [
                "Well-structured high-level system components",
                "Clear awareness of latency and data consistency trade-offs"
            ],
            "improvements": [
                "Quantify back-of-the-envelope calculations (QPS, IOPS, cache size)",
                "Elaborate on edge-case telemetry and alerting thresholds"
            ],
            "is_completed": is_completed,
            "next_question": next_q,
            "next_round": None if is_completed else (round_number + 1),
            "verdict": verdict if is_completed else None,
            "xp_awarded": xp_awarded
        }

    def generate_performance_coach_review(
        self,
        user_name: str,
        user_role: str,
        total_xp: int,
        streak_days: int,
        weekly_minutes: int,
        focus_topic: Optional[str] = None
    ) -> Dict[str, Any]:
        persona_info = resolve_persona(user_role)
        role_persona = persona_info["persona"]

        model = get_gemini_model()
        if model:
            try:
                prompt = f"""
You are the SUTRA Head of Engineering AI Performance Coach ({role_persona}).
Provide an individualized, motivating yet rigorous technical growth diagnosis for student {user_name}.

Student Profile:
- Role: {user_role}
- Total XP: {total_xp}
- Active Streak: {streak_days} days
- Study Time This Week: {weekly_minutes} minutes
- Specific Focus: {focus_topic or 'Core curriculum & architecture'}

Return ONLY a JSON object:
{{
  "summary": "2-3 sentences evaluating their learning velocity, consistency, and retention trajectory.",
  "strengths": ["Clear technical strength 1", "Clear technical strength 2"],
  "growth_areas": ["Targeted growth area with why it matters in interviews/jobs", "System design or depth gap to close"],
  "recommended_focus_this_week": ["Actionable goal 1", "Actionable goal 2", "Actionable goal 3"],
  "projected_readiness": "Tier-1 Tech Ready (85th percentile)",
  "mentor_quote": "A punchy, memorable piece of engineering wisdom."
}}
"""
                res = model.generate_content(prompt)
                data = safe_json_loads(res.text)
                return {
                    "summary": data.get("summary", f"{user_name} is showing excellent velocity with a strong {streak_days}-day streak. Hands-on coding retention is high, and conceptual fundamentals are stabilizing."),
                    "strengths": data.get("strengths", [
                        "Consistent daily execution habit and rapid debugging loops",
                        "High retention on system architecture analogies and trade-offs"
                    ]),
                    "growth_areas": data.get("growth_areas", [
                        "Increase exposure to high-concurrency race condition scenarios",
                        "Practice timed speedrun challenges to sharpen keyboard intuition"
                    ]),
                    "recommended_focus_this_week": data.get("recommended_focus_this_week", [
                        "Complete the Weekly Boss Challenge with sub-50ms execution",
                        "Review 10 flashcards under the Spaced Repetition SRS queue",
                        "Synthesize 2 short revision notes for tricky edge cases"
                    ]),
                    "projected_readiness": data.get("projected_readiness", "High-Growth Candidate (Top 15%)"),
                    "mentor_quote": data.get("mentor_quote", "Great engineers aren't the ones who know every syntax; they are the ones who understand how systems fail.")
                }
            except Exception as e:
                print(f"[Gemini Performance Review Error]: {e}")

        # Deterministic fallback review
        return {
            "summary": f"{user_name} has logged {weekly_minutes} productive minutes this week across {streak_days} consecutive streak days. Learning velocity is steady, with solid conceptual grasp of {user_role} foundations.",
            "strengths": [
                f"Consistent daily rhythm ({streak_days} consecutive days logged)",
                f"High retention of hands-on interactive challenges ({total_xp} Total XP)"
            ],
            "growth_areas": [
                "Push deeper into edge-case failure modes and non-blocking asynchronous patterns",
                "Solidify algorithmic time & space complexity justification"
            ],
            "recommended_focus_this_week": [
                "Crush the Multi-Track Weekly Boss Battle in the Sandbox",
                "Join the 25-Min Study Squad Pomodoro focus room for deep work",
                "Synthesize 60-second short notes for pre-interview revision"
            ],
            "projected_readiness": "On-Track for Tier-1 Roles (Top 18%)",
            "mentor_quote": "First make it work, then make it right, then make it fast."
        }


gemini_service = GeminiService()


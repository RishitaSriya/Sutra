import { apiClient } from './client';
import { Flashcard } from '../types';

export interface AiChatPayload {
  message: string;
  lesson_context?: string;
  code_snippet?: string;
}

export interface AiChatResponse {
  reply: string;
  role_persona: string;
  suggested_followups: string[];
  timestamp: string;
  is_live_gemini: boolean;
}

export interface AiExplainPayload {
  query: string;
  language?: string;
}

export interface AiExplainResponse {
  title: string;
  explanation: string;
  analogy: string;
  common_pitfall: string;
  key_takeaways: string[];
  role_persona: string;
}

export interface AiStatusResponse {
  gemini_configured: boolean;
  provider: string;
  active_personas: string[];
  status: string;
}

export interface InterviewStartPayload {
  company?: string;
  role?: string;
}

export interface InterviewStartResponse {
  interview_id: string;
  company: string;
  role: string;
  interviewer_persona: string;
  round_number: number;
  total_rounds: number;
  question: string;
  context_hint: string;
  timestamp: string;
}

export interface InterviewRespondPayload {
  interview_id: string;
  company: string;
  role: string;
  question: string;
  answer: string;
  round_number: number;
}

export interface InterviewRespondResponse {
  score: number;
  feedback: string;
  key_strengths: string[];
  improvements: string[];
  is_completed: boolean;
  next_question?: string | null;
  next_round?: number | null;
  verdict?: string | null;
  xp_awarded: number;
  total_xp: number;
}

export const aiApi = {
  async getStatus(): Promise<AiStatusResponse> {
    return apiClient<AiStatusResponse>('/ai/status');
  },

  async askMentor(payload: AiChatPayload): Promise<AiChatResponse> {
    return apiClient<AiChatResponse>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async explain(payload: AiExplainPayload): Promise<AiExplainResponse> {
    return apiClient<AiExplainResponse>('/ai/explain', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async generateFlashcards(topic: string, count: number = 3): Promise<Flashcard[]> {
    const data = await apiClient<any[]>('/ai/generate-cards', {
      method: 'POST',
      body: JSON.stringify({ topic, count }),
    });
    return data.map((c) => ({
      id: c.id,
      topic: c.topic,
      category: c.category,
      question: c.question,
      answer: c.answer,
      codeSnippet: c.code_snippet,
      difficulty: c.difficulty || 'medium',
      masteryScore: c.mastery_score || 0,
      timesReviewed: c.times_reviewed || 0,
    }));
  },

  async startInterview(payload: InterviewStartPayload): Promise<InterviewStartResponse> {
    return apiClient<InterviewStartResponse>('/ai/interview/start', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async respondInterview(payload: InterviewRespondPayload): Promise<InterviewRespondResponse> {
    return apiClient<InterviewRespondResponse>('/ai/interview/respond', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

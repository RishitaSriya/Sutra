import { apiClient } from './client';
import { Flashcard } from '../types';

export const flashcardApi = {
  async getFlashcards(): Promise<Flashcard[]> {
    const data = await apiClient<any[]>('/flashcards');
    return data.map((c) => ({
      id: c.id,
      topic: c.topic,
      category: c.category,
      question: c.question,
      answer: c.answer,
      codeSnippet: c.code_snippet,
      difficulty: c.difficulty,
      masteryScore: c.mastery_score,
      timesReviewed: c.times_reviewed,
    }));
  },

  async reviewFlashcard(
    cardId: string,
    remembered: boolean
  ): Promise<{
    success: boolean;
    flashcard_id: string;
    mastery_score: number;
    times_reviewed: number;
    xp_awarded: number;
    total_xp: number;
  }> {
    return apiClient(`/flashcards/${cardId}/review`, {
      method: 'POST',
      body: JSON.stringify({ remembered }),
    });
  },
};

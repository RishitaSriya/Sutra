import { apiClient } from './client';

export interface ProgressOverview {
  total_xp: number;
  streak_days: number;
  current_level: number;
  current_level_mastery: number;
  mastered_concepts_count: number;
  completed_missions_count: number;
  completed_challenges_count: number;
  levels_progress: {
    level_id: string;
    status: string;
    progress_percentage: number;
    xp: number;
  }[];
}

export const progressApi = {
  async getOverview(): Promise<ProgressOverview> {
    return apiClient<ProgressOverview>('/progress');
  },

  async answerQuestion(
    questionId: string,
    optionId: string
  ): Promise<{
    is_correct: boolean;
    feedback: string;
    explanation: string;
    xp_earned: number;
    mastery_score: number;
    total_xp: number;
  }> {
    return apiClient(`/questions/${questionId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ option_id: optionId }),
    });
  },
};

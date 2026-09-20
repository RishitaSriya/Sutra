import { apiClient } from './client';
import { BossChallenge } from '../types';

export const challengeApi = {
  async getChallenges(): Promise<BossChallenge[]> {
    const data = await apiClient<any[]>('/challenges');
    return data.map((ch) => ({
      id: ch.id,
      title: ch.title,
      difficulty: ch.difficulty,
      duration: ch.duration,
      skills: ch.skills || [],
      scenario: ch.scenario,
      objective: ch.objective,
      requirements: ch.requirements || [],
      xpReward: ch.xp_reward,
      badgeReward: ch.badge_reward,
      accepted: ch.accepted,
      completed: ch.completed,
      type: ch.type,
    }));
  },

  async acceptChallenge(challengeId: string): Promise<{ success: boolean; challenge_id: string; accepted: boolean }> {
    return apiClient(`/challenges/${challengeId}/accept`, {
      method: 'POST',
    });
  },

  async submitChallenge(
    challengeId: string,
    solutionCode: string = ''
  ): Promise<{
    passed: boolean;
    score: number;
    message: string;
    xp_awarded: number;
    badge_unlocked: string;
    total_xp: number;
  }> {
    return apiClient(`/challenges/${challengeId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ solution_code: solutionCode }),
    });
  },
};

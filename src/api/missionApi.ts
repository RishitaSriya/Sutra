import { apiClient } from './client';
import { Mission } from '../types';

export const missionApi = {
  async getTodayMissions(): Promise<Mission[]> {
    const data = await apiClient<any[]>('/missions/today');
    return data.map((m) => ({
      id: m.id,
      title: m.title,
      subtitle: m.subtitle,
      timeEstimate: m.time_estimate,
      durationCategory: m.duration_category,
      category: m.category,
      xpReward: m.xp_reward,
      completed: m.completed,
      skills: m.skills || [],
      tasks: (m.tasks || []).map((t: any) => ({
        id: t.id,
        text: t.text,
        completed: t.completed,
        xp: t.xp,
        type: t.type,
      })),
    }));
  },

  async toggleTask(
    missionId: string,
    taskId: string,
    completed?: boolean
  ): Promise<{
    success: boolean;
    task_id: string;
    completed: boolean;
    xp_earned: number;
    mission_completed: boolean;
    total_xp: number;
    streak_days: number;
  }> {
    return apiClient(`/missions/${missionId}/tasks/${taskId}/toggle`, {
      method: 'POST',
      body: JSON.stringify({ completed }),
    });
  },

  async completeMission(missionId: string): Promise<{
    success: boolean;
    mission_id: string;
    xp_earned: number;
    total_xp: number;
    streak_days: number;
  }> {
    return apiClient(`/missions/${missionId}/complete`, {
      method: 'POST',
    });
  },
};

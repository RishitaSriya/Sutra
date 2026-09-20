import { apiClient } from './client';
import { UserProfile } from '../types';

export const userApi = {
  async updateProfile(updates: Partial<UserProfile>): Promise<any> {
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.college !== undefined) payload.college = updates.college;
    if (updates.tier !== undefined) payload.tier = updates.tier;
    if (updates.year !== undefined) payload.year = updates.year;
    if (updates.currentRole !== undefined) payload.current_role = updates.currentRole;
    if (updates.dreamCompanies !== undefined) payload.dream_companies = updates.dreamCompanies;
    if (updates.learningStyles !== undefined) payload.learning_styles = updates.learningStyles;
    if (updates.dailyTimeMinutes !== undefined) payload.daily_time_minutes = updates.dailyTimeMinutes;
    if (updates.learningDna !== undefined) payload.learning_dna = updates.learningDna;

    return apiClient('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async completeOnboarding(data: {
    name: string;
    college: string;
    learningPathId: string;
    dailyMinutes: number;
    dreamCompanies: string[];
    learningPreferences: string[];
  }): Promise<any> {
    return apiClient('/users/onboarding', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        college: data.college,
        learning_path_id: data.learningPathId,
        daily_minutes: data.dailyMinutes,
        dream_companies: data.dreamCompanies,
        learning_preferences: data.learningPreferences,
      }),
    });
  },
};

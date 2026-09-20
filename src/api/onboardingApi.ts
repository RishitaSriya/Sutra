import { apiClient } from './client';
import { CareerOnboardingPayload, ExamOnboardingPayload } from '../types';

export const onboardingApi = {
  async onboardCareer(payload: CareerOnboardingPayload) {
    return await apiClient<any>('/onboarding/career', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async onboardExam(payload: ExamOnboardingPayload) {
    return await apiClient<any>('/onboarding/exam', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getLearningProfile() {
    return await apiClient<any>('/users/me/learning-profile');
  },

  async updateLearningProfile(updates: any) {
    return await apiClient<any>('/users/me/learning-profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

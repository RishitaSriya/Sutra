import { apiClient } from './client';
import { Opportunity } from '../types';

export const opportunityApi = {
  async getOpportunities(): Promise<Opportunity[]> {
    const data = await apiClient<any[]>('/opportunities');
    return data.map((o) => ({
      id: o.id,
      title: o.title,
      company: o.company,
      logo: o.logo,
      location: o.location,
      workType: o.work_type,
      type: o.type,
      stipendOrPrize: o.stipend_or_prize,
      deadline: o.deadline,
      daysLeft: o.days_left,
      skillTags: o.skill_tags || [],
      matchScore: o.match_score,
      description: o.description,
      eligibility: o.eligibility,
      saved: o.saved,
      applied: o.applied,
    }));
  },

  async toggleSave(oppId: string): Promise<{ success: boolean; opportunity_id: string; saved: boolean }> {
    return apiClient(`/opportunities/${oppId}/save`, {
      method: 'POST',
    });
  },

  async apply(oppId: string): Promise<{
    success: boolean;
    opportunity_id: string;
    applied: boolean;
    xp_awarded: number;
    total_xp: number;
  }> {
    return apiClient(`/opportunities/${oppId}/apply`, {
      method: 'POST',
    });
  },
};

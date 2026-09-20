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

export interface DailyActivityStat {
  date: string;
  day_name: string;
  minutes_spent: number;
  xp_earned: number;
  missions_completed: number;
  is_target_met: boolean;
}

export interface SkillMasteryStat {
  category: string;
  score: number;
  level_label: string;
  description: string;
}

export interface WeeklyAnalytics {
  week_start: string;
  week_end: string;
  total_minutes: number;
  total_xp: number;
  active_days: number;
  avg_minutes_per_day: number;
  streak_days: number;
  daily_breakdown: DailyActivityStat[];
}

export interface MonthlyAnalytics {
  month_name: string;
  year: number;
  total_hours: number;
  total_xp: number;
  completion_rate_percent: number;
  heatmap: { date: string; count: number; xp: number; minutes: number }[];
  skills_mastery: SkillMasteryStat[];
}

export interface UserAnalyticsResponse {
  weekly: WeeklyAnalytics;
  monthly: MonthlyAnalytics;
}

export interface AICoachReviewResponse {
  summary: string;
  strengths: string[];
  growth_areas: string[];
  recommended_focus_this_week: string[];
  projected_readiness: string;
  mentor_quote: string;
}

export const progressApi = {
  async getOverview(): Promise<ProgressOverview> {
    return apiClient<ProgressOverview>('/progress');
  },

  async getAnalytics(): Promise<UserAnalyticsResponse> {
    return apiClient<UserAnalyticsResponse>('/progress/analytics');
  },

  async getAICoachReview(focusTopic?: string): Promise<AICoachReviewResponse> {
    return apiClient<AICoachReviewResponse>('/progress/analytics/ai-coach', {
      method: 'POST',
      body: JSON.stringify({ focus_topic: focusTopic }),
    });
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


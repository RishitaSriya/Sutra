import { apiClient } from './client';
import { LearningPath, StoryLesson } from '../types';

export const learningApi = {
  async getPaths(): Promise<LearningPath[]> {
    const data = await apiClient<any[]>('/learning-paths');
    return data.map((p) => ({
      id: p.id,
      title: p.title,
      icon: p.icon,
      roleTag: p.role_tag,
      description: p.description,
      currentLevel: p.current_level,
      totalLevels: p.total_levels,
      estimatedWeeks: p.estimated_weeks,
      levels: (p.levels || []).map((l: any) => ({
        id: l.id,
        levelNumber: l.level_number,
        title: l.title,
        subtitle: l.subtitle,
        status: l.status,
        xpReward: l.xp_reward,
        estimatedTime: l.estimated_time,
        missionTitle: l.title,
        tags: l.tags || [],
        storySnippet: l.story_snippet,
      })),
    }));
  },

  async getPath(pathId: string): Promise<LearningPath> {
    const p = await apiClient<any>(`/learning-paths/${pathId}`);
    return {
      id: p.id,
      title: p.title,
      icon: p.icon,
      roleTag: p.role_tag,
      description: p.description,
      currentLevel: p.current_level,
      totalLevels: p.total_levels,
      estimatedWeeks: p.estimated_weeks,
      levels: (p.levels || []).map((l: any) => ({
        id: l.id,
        levelNumber: l.level_number,
        title: l.title,
        subtitle: l.subtitle,
        status: l.status,
        xpReward: l.xp_reward,
        estimatedTime: l.estimated_time,
        missionTitle: l.title,
        tags: l.tags || [],
        storySnippet: l.story_snippet,
      })),
    };
  },

  async getLesson(lessonId: string): Promise<StoryLesson> {
    const res = await apiClient<any>(`/lessons/${lessonId}`);
    return {
      id: res.id,
      levelId: res.level_id,
      levelNumber: res.level_number,
      levelTitle: res.level_title,
      title: res.title,
      roleContext: res.role_context,
      narrative: res.narrative,
      interactiveMoment: res.interactive_moment,
      conceptBreakdown: res.concept_breakdown,
      miniChallenge: res.mini_challenge,
      practiceTask: res.practice_task,
    };
  },

  async getCurrentLesson(): Promise<StoryLesson> {
    const res = await apiClient<any>('/users/me/current-lesson');
    return {
      id: res.id,
      levelId: res.level_id,
      levelNumber: res.level_number,
      levelTitle: res.level_title,
      title: res.title,
      roleContext: res.role_context,
      narrative: res.narrative,
      interactiveMoment: res.interactive_moment,
      conceptBreakdown: res.concept_breakdown,
      miniChallenge: res.mini_challenge,
      practiceTask: res.practice_task,
    };
  },

  async getUserLearningPath(): Promise<any> {
    return apiClient<any>('/users/me/learning-path');
  },

  async getUserJourney(): Promise<LearningPath> {
    const p = await apiClient<any>('/users/me/learning-journey');
    return {
      id: p.id,
      title: p.title,
      icon: p.icon,
      roleTag: p.role_tag,
      description: p.description,
      currentLevel: p.current_level,
      totalLevels: p.total_levels,
      estimatedWeeks: p.estimated_weeks,
      levels: (p.levels || []).map((l: any) => ({
        id: l.id,
        levelNumber: l.level_number,
        title: l.title,
        subtitle: l.subtitle,
        status: l.status,
        xpReward: l.xp_reward,
        estimatedTime: l.estimated_time,
        missionTitle: l.title,
        tags: l.tags || [],
        storySnippet: l.story_snippet,
      })),
    };
  },

  async completeLesson(lessonId: string): Promise<{
    success: boolean;
    xp_earned: number;
    total_xp: number;
    streak_days: number;
  }> {
    return apiClient(`/lessons/${lessonId}/complete`, {
      method: 'POST',
    });
  },
};

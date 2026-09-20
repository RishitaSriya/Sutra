import { apiClient } from './client';
import { TechMeme } from '../types';

export const feedApi = {
  async getMemes(): Promise<TechMeme[]> {
    const data = await apiClient<any[]>('/feed');
    return data.map((p) => ({
      id: p.id,
      author: p.author,
      handle: p.handle,
      avatar: p.avatar,
      college: p.college,
      category: p.category,
      memeCard: {
        headline: p.meme_card?.headline || '',
        type: p.meme_card?.type || 'relatable-quote',
        leftBlock: p.meme_card?.leftBlock,
        rightBlock: p.meme_card?.rightBlock,
        dialogue: p.meme_card?.dialogue,
        caption: p.meme_card?.caption || '',
      },
      likes: p.likes,
      liked: p.liked,
      commentsCount: p.comments_count,
      saved: p.saved,
      learningMissionBridge: {
        badgeText: p.learning_mission_bridge?.badgeText || '⚡ SUTRA LEARNING BRIDGE',
        hookTitle: p.learning_mission_bridge?.hookTitle || 'Explore Concept',
        duration: p.learning_mission_bridge?.duration || '15 min',
        xp: p.learning_mission_bridge?.xp || 40,
        targetTopic: p.learning_mission_bridge?.targetTopic || 'Web Development',
        targetLessonId: p.learning_mission_bridge?.targetLessonId || 'story_http_01',
      },
    }));
  },

  async likeMeme(postId: string): Promise<{ success: boolean; post_id: string; liked: boolean; likes_count: number }> {
    return apiClient(`/feed/posts/${postId}/like`, {
      method: 'POST',
    });
  },

  async saveMeme(postId: string): Promise<{ success: boolean; post_id: string; saved: boolean }> {
    return apiClient(`/feed/posts/${postId}/save`, {
      method: 'POST',
    });
  },

  async addComment(postId: string, content: string): Promise<any> {
    return apiClient(`/feed/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
};

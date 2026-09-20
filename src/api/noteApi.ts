import { apiClient } from './client';
import { ShortNote } from '../types';

export const noteApi = {
  async getNotes(): Promise<ShortNote[]> {
    const data = await apiClient<any[]>('/notes');
    return data.map((n) => ({
      id: n.id,
      title: n.title,
      readTime: n.read_time,
      topic: n.topic,
      category: n.category,
      whatItIs: n.what_it_is,
      thinkOfItLike: n.think_of_it_like,
      rememberThis: n.remember_this || [],
      commonMistake: n.common_mistake,
      isSaved: n.is_saved,
    }));
  },

  async toggleSaveNote(noteId: string): Promise<{ success: boolean; note_id: string; is_saved: boolean }> {
    return apiClient(`/notes/${noteId}/save`, {
      method: 'POST',
    });
  },
};

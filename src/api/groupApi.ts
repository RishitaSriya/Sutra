import { apiClient } from './client';
import { StudySquad } from '../types';

export const groupApi = {
  async getSquads(): Promise<StudySquad[]> {
    const data = await apiClient<any[]>('/groups');
    return data.map((g) => ({
      id: g.id,
      name: g.name,
      tag: g.tag,
      slogan: g.slogan,
      memberCount: g.member_count,
      maxMembers: g.max_members,
      activeNowCount: g.active_now_count,
      goal: g.goal,
      squadStreak: g.squad_streak,
      members: (g.members || []).map((m: any) => ({
        id: m.id,
        name: m.name,
        college: m.college,
        avatar: m.avatar,
        role: m.role,
        xpThisWeek: m.xp_this_week,
        online: m.online,
        currentMission: m.current_mission,
      })),
      messages: (g.messages || []).map((msg: any) => ({
        id: msg.id,
        senderName: msg.sender_name,
        senderAvatar: msg.sender_avatar,
        senderCollege: msg.sender_college,
        text: msg.text,
        timestamp: msg.timestamp,
        reactions: msg.reactions || [],
      })),
    }));
  },

  async getSquad(groupId: string): Promise<StudySquad> {
    const g = await apiClient<any>(`/groups/${groupId}`);
    return {
      id: g.id,
      name: g.name,
      tag: g.tag,
      slogan: g.slogan,
      memberCount: g.member_count,
      maxMembers: g.max_members,
      activeNowCount: g.active_now_count,
      goal: g.goal,
      squadStreak: g.squad_streak,
      members: (g.members || []).map((m: any) => ({
        id: m.id,
        name: m.name,
        college: m.college,
        avatar: m.avatar,
        role: m.role,
        xpThisWeek: m.xp_this_week,
        online: m.online,
        currentMission: m.current_mission,
      })),
      messages: (g.messages || []).map((msg: any) => ({
        id: msg.id,
        senderName: msg.sender_name,
        senderAvatar: msg.sender_avatar,
        senderCollege: msg.sender_college,
        text: msg.text,
        timestamp: msg.timestamp,
        reactions: msg.reactions || [],
      })),
    };
  },

  async sendMessage(
    groupId: string,
    text: string
  ): Promise<{
    id: string;
    sender_name: string;
    sender_avatar: string;
    sender_college: string;
    text: string;
    timestamp: string;
    reactions: any[];
  }> {
    return apiClient(`/groups/${groupId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  async joinSquad(groupId: string): Promise<{ success: boolean; group_id: string }> {
    return apiClient(`/groups/${groupId}/join`, {
      method: 'POST',
    });
  },
};

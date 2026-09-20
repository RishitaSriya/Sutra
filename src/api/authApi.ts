import { apiClient } from './client';
import { UserProfile } from '../types';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
    total_xp: number;
    streak_days: number;
  };
}

export const authApi = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    confirm_password?: string;
    college?: string;
  }): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.access_token) {
      localStorage.setItem('sutra_auth_token', res.access_token);
    }
    return res;
  },

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.access_token) {
      localStorage.setItem('sutra_auth_token', res.access_token);
    }
    return res;
  },

  async loginDemo(demoUser: 'aarav' | 'meera' | 'kabir' | 'ananya' = 'aarav'): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>('/auth/demo', {
      method: 'POST',
      body: JSON.stringify({ demo_user: demoUser }),
    });
    if (res.access_token) {
      localStorage.setItem('sutra_auth_token', res.access_token);
    }
    return res;
  },

  async getMe(): Promise<UserProfile> {
    const res = await apiClient<any>('/auth/me');
    return {
      id: res.id,
      name: res.name,
      email: res.email,
      college: res.college,
      tier: res.tier,
      year: res.year,
      avatar: res.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      currentRole: res.current_role || 'Web Developer',
      learningPathId: res.learning_path_id || 'path_web_dev',
      trackType: res.track_type || 'career',
      onboardingCompleted: Boolean(res.onboarding_completed),
      isDemo: Boolean(res.is_demo),
      level: 3,
      currentLevelMastery: 68,
      totalXp: res.total_xp,
      streakDays: res.streak_days,
      streakHistory: res.streak_history || [],
      dreamCompanies: res.dream_companies || [],
      learningStyles: res.learning_styles || ['Stories', 'Hands-on'],
      dailyTimeMinutes: res.daily_time_minutes || 30,
      learningDna: res.learning_dna || { handsOn: 45, stories: 30, challenges: 25, visualExploration: 20 },
      examDetails: res.exam_details || undefined,
      masteredConceptsCount: 24,
      completedMissionsCount: 12,
      completedChallengesCount: 3,
      badges: [
        { id: 'b1', name: 'DNS Detective', icon: '🔍', description: 'Discovered the hidden journey of packets across the world wide web.', unlockedAt: '2 days ago', rarity: 'rare' },
        { id: 'b2', name: '7-Day Streak Warrior', icon: '🔥', description: 'Showed up 7 days in a row without breaking daily momentum.', unlockedAt: 'Yesterday', rarity: 'epic' },
        { id: 'b3', name: 'Flexbox Alchemist', icon: '📐', description: 'Mastered 2D CSS layouts without float or clearfix.', unlockedAt: '5 days ago', rarity: 'common' },
        { id: 'b4', name: 'Squad Pillar', icon: '🛡️', description: 'Contributed 150+ XP toward Web Warriors weekly squad goal.', unlockedAt: '3 days ago', rarity: 'rare' },
        { id: 'b5', name: 'Bug Hunter Debut', icon: '🐞', description: 'Solved first asynchronous race condition mini challenge.', unlockedAt: '1 week ago', rarity: 'legendary' }
      ]
    };
  },

  async logout() {
    try {
      await apiClient<any>('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    localStorage.removeItem('sutra_auth_token');
  }
};


import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  ViewMode,
  UserProfile,
  LearningPath,
  StoryLesson,
  Mission,
  Flashcard,
  ShortNote,
  BossChallenge,
  StudySquad,
  TechMeme,
  Opportunity,
  CareerOnboardingPayload,
  ExamOnboardingPayload,
} from '../types';
import { initialUserProfile } from '../data/mockUser';
import { mockLearningPaths } from '../data/mockPaths';
import { mockStoryLessons } from '../data/mockStories';
import { mockDailyMissions } from '../data/mockMissions';
import { mockFlashcards } from '../data/mockFlashcards';
import { mockShortNotes } from '../data/mockNotes';
import { mockBossChallenges } from '../data/mockChallenges';
import { mockStudySquad } from '../data/mockSquads';
import { mockTechMemes } from '../data/mockMemes';
import { mockOpportunities } from '../data/mockOpportunities';
import {
  authApi,
  onboardingApi,
  learningApi,
  missionApi,
  flashcardApi,
  noteApi,
  challengeApi,
  feedApi,
  groupApi,
  opportunityApi,
  userApi,
} from '../api';

interface AppContextType {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => Promise<void>;
  loginWithDemoAarav: () => Promise<boolean>;
  loginWithDemoMeera: () => Promise<boolean>;
  loginWithDemoKabir: () => Promise<boolean>;
  loginWithDemoAnanya: () => Promise<boolean>;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isMockInterviewOpen: boolean;
  setIsMockInterviewOpen: (open: boolean) => void;
  onboardCareer: (payload: CareerOnboardingPayload) => Promise<void>;
  onboardExam: (payload: ExamOnboardingPayload) => Promise<void>;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  paths: LearningPath[];
  currentPath: LearningPath;
  setCurrentPathId: (pathId: string) => void;
  switchLearningPath: (pathId: string) => Promise<void>;
  storyLessons: StoryLesson[];
  activeStoryLesson: StoryLesson;
  startStoryLesson: (lessonId?: string) => Promise<void>;
  missions: Mission[];
  toggleMissionTask: (missionId: string, taskId: string) => void;
  flashcards: Flashcard[];
  addFlashcards: (cards: Flashcard[]) => void;
  reviewFlashcard: (cardId: string, remembered: boolean) => void;
  shortNotes: ShortNote[];
  toggleSaveNote: (noteId: string) => void;
  bossChallenges: BossChallenge[];
  acceptBossChallenge: (challengeId: string) => void;
  completeBossChallenge: (challengeId: string) => void;
  squad: StudySquad;
  sendSquadMessage: (text: string) => void;
  memes: TechMeme[];
  likeMeme: (memeId: string) => void;
  saveMeme: (memeId: string) => void;
  opportunities: Opportunity[];
  toggleSaveOpportunity: (oppId: string) => void;
  applyOpportunity: (oppId: string) => void;
  aiStatus: string | null;
  triggerAiSimulation: (actionText: string, durationMs?: number) => void;
  selectedTimeFilter: 'all' | '15m' | '30m' | '45m' | '60m';
  setSelectedTimeFilter: (time: 'all' | '15m' | '30m' | '45m' | '60m') => void;
  triggerConfetti: () => void;
  awardXp: (amount: number, reason: string) => void;
  recentXpGained: { amount: number; reason: string } | null;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setView] = useState<ViewMode>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isMockInterviewOpen, setIsMockInterviewOpen] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [paths, setPaths] = useState<LearningPath[]>(mockLearningPaths);
  const [currentPathId, setCurrentPathId] = useState<string>('path_web_dev');
  const [storyLessons, setStoryLessons] = useState<StoryLesson[]>(mockStoryLessons);
  const [activeStoryLessonId, setActiveStoryLessonId] = useState<string>('story_http_01');
  const [missions, setMissions] = useState<Mission[]>(mockDailyMissions);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(mockFlashcards);
  const [shortNotes, setShortNotes] = useState<ShortNote[]>(mockShortNotes);
  const [bossChallenges, setBossChallenges] = useState<BossChallenge[]>(mockBossChallenges);
  const [squad, setSquad] = useState<StudySquad>(mockStudySquad);
  const [memes, setMemes] = useState<TechMeme[]>(mockTechMemes);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [aiStatus, setAiStatus] = useState<string | null>(null);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<'all' | '15m' | '30m' | '45m' | '60m'>('all');
  const [recentXpGained, setRecentXpGained] = useState<{ amount: number; reason: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#E4A93A', '#244B3A', '#E9785A', '#6F8F72', '#F2C6A8'],
    });
  };

  const awardXp = (amount: number, reason: string) => {
    setUser((prev) => ({
      ...prev,
      totalXp: prev.totalXp + amount,
    }));
    setRecentXpGained({ amount, reason });
    setTimeout(() => {
      setRecentXpGained(null);
    }, 3500);
  };

  const triggerAiSimulation = (actionText: string, durationMs = 2800) => {
    setAiStatus(actionText);
    setTimeout(() => {
      setAiStatus(null);
    }, durationMs);
  };

  // Fetch all domain data for authenticated session
  const fetchDomainData = useCallback(async (userData: UserProfile) => {
    try {
      const [
        pathsRes,
        missionsRes,
        flashcardsRes,
        notesRes,
        challengesRes,
        squadsRes,
        feedRes,
        oppsRes,
        currentLessonRes,
      ] = await Promise.allSettled([
        learningApi.getPaths(),
        missionApi.getTodayMissions(),
        flashcardApi.getFlashcards(),
        noteApi.getNotes(),
        challengeApi.getChallenges(),
        groupApi.getSquads(),
        feedApi.getMemes(),
        opportunityApi.getOpportunities(),
        learningApi.getCurrentLesson(),
      ]);

      if (pathsRes.status === 'fulfilled' && pathsRes.value.length > 0) {
        setPaths(pathsRes.value);
        // Switch active path according to user's saved path or track
        const targetPathId = userData.learningPathId || (userData.trackType === 'exam' ? 'path_gate_cse' : 'path_web_dev');
        const resolvedPath = pathsRes.value.find((p) => p.id === targetPathId) || pathsRes.value[0];
        if (resolvedPath) {
          setCurrentPathId(resolvedPath.id);
        }
      }
      if (missionsRes.status === 'fulfilled' && missionsRes.value.length > 0) {
        setMissions(missionsRes.value);
      }
      if (flashcardsRes.status === 'fulfilled') {
        setFlashcards(flashcardsRes.value || []);
      }
      if (notesRes.status === 'fulfilled' && notesRes.value.length > 0) {
        setShortNotes(notesRes.value);
      }
      if (challengesRes.status === 'fulfilled' && challengesRes.value.length > 0) {
        setBossChallenges(challengesRes.value);
      }
      if (squadsRes.status === 'fulfilled' && squadsRes.value.length > 0) {
        setSquad(squadsRes.value[0]);
      }
      if (feedRes.status === 'fulfilled' && feedRes.value.length > 0) {
        setMemes(feedRes.value);
      }
      if (oppsRes.status === 'fulfilled' && oppsRes.value.length > 0) {
        setOpportunities(oppsRes.value);
      }
      if (currentLessonRes.status === 'fulfilled' && currentLessonRes.value) {
        const lesson = currentLessonRes.value;
        setActiveStoryLessonId(lesson.id);
        setStoryLessons((prev) => {
          const exists = prev.some((l) => l.id === lesson.id);
          return exists ? prev.map((l) => (l.id === lesson.id ? lesson : l)) : [lesson, ...prev];
        });
      }
    } catch (err) {
      console.warn('[Sutra App] Domain fetch error:', err);
    }
  }, []);

  // Initialize data on page load
  const initApp = useCallback(async () => {
    const token = localStorage.getItem('sutra_auth_token');
    if (!token) {
      setIsAuthenticated(false);
      setView('landing');
      return;
    }

    setIsLoading(true);
    try {
      const me = await authApi.getMe();
      if (me && me.id) {
        setUser(me);
        setIsAuthenticated(true);
        await fetchDomainData(me);

        if (!me.onboardingCompleted) {
          setIsOnboardingOpen(true);
          setView('landing');
        } else {
          setView('home');
        }
      } else {
        setIsAuthenticated(false);
        setView('landing');
      }
    } catch {
      localStorage.removeItem('sutra_auth_token');
      setIsAuthenticated(false);
      setView('landing');
    } finally {
      setIsLoading(false);
    }
  }, [fetchDomainData]);

  useEffect(() => {
    initApp();
  }, [initApp]);

  // Auth Functions
  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await authApi.login({ email, password });
    if (res && res.access_token) {
      const me = await authApi.getMe();
      setUser(me);
      setIsAuthenticated(true);
      closeAuthModal();
      await fetchDomainData(me);

      if (!me.onboardingCompleted) {
        setIsOnboardingOpen(true);
        setView('landing');
      } else {
        setView('home');
      }
      triggerAiSimulation(`👋 Welcome back, ${me.name}! Ready to continue your momentum.`);
      return true;
    }
    return false;
  };

  const register = async (data: any): Promise<boolean> => {
    const res = await authApi.register(data);
    if (res && res.access_token) {
      const me = await authApi.getMe();
      setUser(me);
      setIsAuthenticated(true);
      closeAuthModal();
      await fetchDomainData(me);

      // Open Onboarding immediately for new user
      setIsOnboardingOpen(true);
      setView('landing');
      triggerAiSimulation(`🎉 Account created! Let's personalize your learning adventure.`);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await authApi.logout();
    setIsAuthenticated(false);
    setUser(initialUserProfile);
    setView('landing');
    setIsOnboardingOpen(false);
    closeAuthModal();
  };

  const loginWithDemoAarav = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await authApi.loginDemo('aarav');
      if (res && res.access_token) {
        const me = await authApi.getMe();
        setUser(me);
        setIsAuthenticated(true);
        closeAuthModal();
        await fetchDomainData(me);
        setView('home');
        triggerAiSimulation(`👋 Welcome back, Aarav! Loaded Web Developer track.`);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Demo Aarav login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithDemoMeera = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await authApi.loginDemo('meera');
      if (res && res.access_token) {
        const me = await authApi.getMe();
        setUser(me);
        setIsAuthenticated(true);
        closeAuthModal();
        await fetchDomainData(me);
        setView('home');
        triggerAiSimulation(`👋 Welcome back, Meera! Loaded Data Scientist track.`);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Demo Meera login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithDemoKabir = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await authApi.loginDemo('kabir');
      if (res && res.access_token) {
        const me = await authApi.getMe();
        setUser(me);
        setIsAuthenticated(true);
        closeAuthModal();
        await fetchDomainData(me);
        setView('home');
        triggerAiSimulation(`👋 Welcome back, Kabir! Loaded Cybersecurity track.`);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Demo Kabir login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithDemoAnanya = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await authApi.loginDemo('ananya');
      if (res && res.access_token) {
        const me = await authApi.getMe();
        setUser(me);
        setIsAuthenticated(true);
        closeAuthModal();
        await fetchDomainData(me);
        setView('home');
        triggerAiSimulation(`👋 Welcome back, Ananya! Loaded GATE CSE Exam track.`);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Demo Ananya login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const switchLearningPath = async (pathId: string) => {
    setIsLoading(true);
    try {
      setCurrentPathId(pathId);
      const targetPath = paths.find((p) => p.id === pathId);
      const roleName = targetPath ? (targetPath.title || targetPath.name || pathId) : pathId;
      const isGate = pathId.includes('gate');

      await onboardingApi.updateLearningProfile({
        career_path: roleName,
        learning_path_id: pathId,
        track_type: isGate ? 'exam' : 'career',
      });

      const me = await authApi.getMe();
      setUser(me);
      await fetchDomainData(me);
      triggerAiSimulation(`🔄 Switched active learning path to ${roleName}!`);
    } catch (err) {
      console.warn('Switch learning path error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Onboarding submissions
  const onboardCareer = async (payload: CareerOnboardingPayload) => {
    setIsLoading(true);
    try {
      await onboardingApi.onboardCareer(payload);
      const me = await authApi.getMe();
      setUser(me);
      setIsOnboardingOpen(false);
      setView('home');
      triggerAiSimulation(`✨ Career track: Custom roadmap activated for ${payload.career_path}!`);
      triggerConfetti();
      await fetchDomainData(me);
    } catch (err) {
      console.error('Career onboarding error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onboardExam = async (payload: ExamOnboardingPayload) => {
    setIsLoading(true);
    try {
      await onboardingApi.onboardExam(payload);
      const me = await authApi.getMe();
      setUser(me);
      setIsOnboardingOpen(false);
      setView('home');
      triggerAiSimulation(`📚 GATE Journey: ${payload.exam_type} (${payload.target_year}) syllabus & daily drills activated!`);
      triggerConfetti();
      await fetchDomainData(me);
    } catch (err) {
      console.error('Exam onboarding error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentPath = paths.find((p) => p.id === currentPathId) || paths[0];
  const activeStoryLesson =
    storyLessons.find((s) => s.id === activeStoryLessonId) || storyLessons[0];

  const startStoryLesson = async (lessonId?: string) => {
    triggerAiSimulation('✨ AI Storyteller: Tailoring simulation context to your role...');
    setView('story-lesson');

    try {
      let lesson: StoryLesson | null = null;
      if (!lessonId || lessonId === 'current') {
        lesson = await learningApi.getCurrentLesson();
      } else {
        lesson = await learningApi.getLesson(lessonId);
      }

      if (lesson) {
        setActiveStoryLessonId(lesson.id);
        setStoryLessons((prev) => {
          const exists = prev.some((l) => l.id === lesson!.id);
          return exists ? prev.map((l) => (l.id === lesson!.id ? lesson! : l)) : [lesson!, ...prev];
        });
      }
    } catch (e) {
      console.log('Using local story lesson fallback', e);
      if (lessonId) {
        setActiveStoryLessonId(lessonId);
      }
    }
  };

  const toggleMissionTask = async (missionId: string, taskId: string) => {
    let earnedXp = 0;
    let taskJustCompleted = false;

    setMissions((prevMissions) =>
      prevMissions.map((m) => {
        if (m.id !== missionId) return m;

        const updatedTasks = m.tasks.map((t) => {
          if (t.id === taskId) {
            const nextCompleted = !t.completed;
            if (nextCompleted) {
              taskJustCompleted = true;
              earnedXp = t.xp;
            }
            return { ...t, completed: nextCompleted };
          }
          return t;
        });

        const allDone = updatedTasks.every((t) => t.completed);

        if (taskJustCompleted) {
          awardXp(earnedXp, `Completed: ${taskId}`);
          if (allDone) {
            triggerConfetti();
          }
        }

        return {
          ...m,
          tasks: updatedTasks,
          completed: allDone,
        };
      })
    );

    // Persist to backend
    try {
      const res = await missionApi.toggleTask(missionId, taskId);
      if (res && res.total_xp) {
        setUser((prev) => ({
          ...prev,
          totalXp: res.total_xp,
          streakDays: res.streak_days,
        }));
      }
    } catch (err) {
      console.warn('Backend mission toggle sync error:', err);
    }
  };

  const reviewFlashcard = async (cardId: string, remembered: boolean) => {
    setFlashcards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        const newScore = remembered
          ? Math.min(100, c.masteryScore + 10)
          : Math.max(20, c.masteryScore - 15);
        return {
          ...c,
          masteryScore: newScore,
          timesReviewed: c.timesReviewed + 1,
        };
      })
    );
    if (remembered) {
      awardXp(10, 'Flashcard Recall Mastery');
    }

    try {
      const res = await flashcardApi.reviewFlashcard(cardId, remembered);
      if (res && res.total_xp) {
        setUser((prev) => ({ ...prev, totalXp: res.total_xp }));
      }
    } catch (err) {
      console.warn('Backend flashcard review sync error:', err);
    }
  };

  const addFlashcards = (newCards: Flashcard[]) => {
    setFlashcards((prev) => [...newCards, ...prev]);
  };

  const toggleSaveNote = async (noteId: string) => {
    setShortNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isSaved: !n.isSaved } : n))
    );

    try {
      await noteApi.toggleSaveNote(noteId);
    } catch (err) {
      console.warn('Backend note save sync error:', err);
    }
  };

  const acceptBossChallenge = async (challengeId: string) => {
    setBossChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, accepted: true } : c))
    );
    triggerAiSimulation('⚔️ Boss System: Initializing challenge harness...');

    try {
      await challengeApi.acceptChallenge(challengeId);
    } catch (err) {
      console.warn('Backend challenge accept sync error:', err);
    }
  };

  const completeBossChallenge = async (challengeId: string) => {
    setBossChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, completed: true } : c))
    );
    awardXp(250, 'Defeated Weekly Boss Battle!');
    triggerConfetti();

    try {
      const res = await challengeApi.submitChallenge(challengeId);
      if (res && res.total_xp) {
        setUser((prev) => ({ ...prev, totalXp: res.total_xp }));
      }
    } catch (err) {
      console.warn('Backend challenge submit sync error:', err);
    }
  };

  const sendSquadMessage = async (text: string) => {
    if (!text.trim()) return;
    const optimisticId = `msg_${Date.now()}`;
    const newMsg = {
      id: optimisticId,
      senderName: `${user.name} (You)`,
      senderAvatar: user.avatar,
      senderCollege: user.college,
      text,
      timestamp: 'Just now',
      reactions: [{ emoji: '🔥', count: 1 }],
    };
    setSquad((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));
    awardXp(15, 'Squad Collaboration Contribution');

    try {
      const res = await groupApi.sendMessage(squad.id, text);
      if (res && res.id) {
        setSquad((prev) => ({
          ...prev,
          messages: prev.messages.map((m) => (m.id === optimisticId ? { ...m, id: res.id } : m)),
        }));
      }
    } catch (err) {
      console.warn('Backend squad message sync error:', err);
    }
  };

  const likeMeme = async (memeId: string) => {
    setMemes((prev) =>
      prev.map((m) => {
        if (m.id !== memeId) return m;
        return {
          ...m,
          liked: !m.liked,
          likes: m.liked ? m.likes - 1 : m.likes + 1,
        };
      })
    );

    try {
      await feedApi.likeMeme(memeId);
    } catch (err) {
      console.warn('Backend meme like sync error:', err);
    }
  };

  const saveMeme = async (memeId: string) => {
    setMemes((prev) =>
      prev.map((m) => (m.id === memeId ? { ...m, saved: !m.saved } : m))
    );

    try {
      await feedApi.saveMeme(memeId);
    } catch (err) {
      console.warn('Backend meme save sync error:', err);
    }
  };

  const toggleSaveOpportunity = async (oppId: string) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === oppId ? { ...o, saved: !o.saved } : o))
    );

    try {
      await opportunityApi.toggleSave(oppId);
    } catch (err) {
      console.warn('Backend opportunity save sync error:', err);
    }
  };

  const applyOpportunity = async (oppId: string) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === oppId ? { ...o, applied: true } : o))
    );
    awardXp(50, 'Opportunity Application Submitted');
    triggerConfetti();

    try {
      const res = await opportunityApi.apply(oppId);
      if (res && res.total_xp) {
        setUser((prev) => ({ ...prev, totalXp: res.total_xp }));
      }
    } catch (err) {
      console.warn('Backend opportunity apply sync error:', err);
    }
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));

    try {
      await userApi.updateProfile(updates);
    } catch (err) {
      console.warn('Backend user profile sync error:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setView,
        isAuthenticated,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        loginWithDemoAarav,
        loginWithDemoMeera,
        loginWithDemoKabir,
        loginWithDemoAnanya,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isMockInterviewOpen,
        setIsMockInterviewOpen,
        onboardCareer,
        onboardExam,
        user,
        updateUser,
        paths,
        currentPath,
        setCurrentPathId,
        switchLearningPath,
        storyLessons,
        activeStoryLesson,
        startStoryLesson,
        missions,
        toggleMissionTask,
        flashcards,
        addFlashcards,
        reviewFlashcard,
        shortNotes,
        toggleSaveNote,
        bossChallenges,
        acceptBossChallenge,
        completeBossChallenge,
        squad,
        sendSquadMessage,
        memes,
        likeMeme,
        saveMeme,
        opportunities,
        toggleSaveOpportunity,
        applyOpportunity,
        aiStatus,
        triggerAiSimulation,
        selectedTimeFilter,
        setSelectedTimeFilter,
        triggerConfetti,
        awardXp,
        recentXpGained,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

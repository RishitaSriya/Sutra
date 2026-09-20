export type ViewMode =
  | 'landing'
  | 'home'
  | 'learn'
  | 'story-lesson'
  | 'missions'
  | 'flashcards'
  | 'notes'
  | 'challenges'
  | 'squad'
  | 'memes'
  | 'opportunities'
  | 'profile';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  tier: string;
  year: string;
  avatar: string;
  currentRole: string;
  learningPathId?: string;
  trackType: 'career' | 'exam' | 'higher_studies';
  onboardingCompleted: boolean;
  isDemo?: boolean;
  level: number;
  currentLevelMastery: number; // percentage
  totalXp: number;
  streakDays: number;
  streakHistory: {
    day: string;
    date: string;
    completed: boolean;
    xpEarned: number;
  }[];
  dreamCompanies: string[];
  targetCompanies?: string[];
  learningStyles: string[];
  dailyTimeMinutes: number;
  learningDna: {
    challenges: number; // percentage
    stories: number;
    handsOn: number;
    visualExploration: number;
  };
  examDetails?: {
    exam_type?: string;
    target_year?: string;
    goals?: string[] | string;
    preparation_level?: string;
    subjects?: string[];
    examName?: string;
    targetYear?: string;
    preparationLevel?: string;
  };
  learningProfile?: {
    trackType?: string;
    careerPath?: string;
    targetCompanies?: string[];
    examType?: string;
    targetYear?: string;
    goals?: string[];
    preparationLevel?: string;
    subjects?: string[];
    dailyMinutes?: number;
  };
  masteredConceptsCount: number;
  completedMissionsCount: number;
  completedChallengesCount: number;
  badges: BadgeItem[];
}

export interface ExamSubject {
  id: string;
  name: string;
  code?: string;
  icon: string;
  weightage_percent: number;
  total_topics: number;
  topics: string[];
}

export interface Exam {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  color_accent: string;
  target_years: string[];
  total_subjects: number;
  subjects: ExamSubject[];
}

export interface CareerOnboardingPayload {
  career_path: string;
  learning_path_id?: string;
  target_companies?: string[];
  daily_minutes?: number;
  learning_preferences?: string[];
}

export interface ExamOnboardingPayload {
  exam_type: string;
  target_year: string;
  goals: string[];
  preparation_level: string;
  daily_minutes: number;
  subjects: string[];
  learning_preferences?: string[];
}


export interface BadgeItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LearningPath {
  id: string;
  title: string;
  name?: string;
  icon: string;
  roleTag: string;
  description: string;
  currentLevel: number;
  totalLevels: number;
  estimatedWeeks: number;
  levels: LevelNode[];
}

export interface LevelNode {
  id: string;
  levelNumber: number;
  title: string;
  subtitle: string;
  status: 'mastered' | 'current' | 'locked';
  xpReward: number;
  estimatedTime: string;
  missionTitle: string;
  tags: string[];
  storySnippet: string;
}

export interface MissionTask {
  id: string;
  text: string;
  completed: boolean;
  xp: number;
  type: 'story' | 'concept' | 'challenge' | 'reflect' | 'practice';
}

export interface Mission {
  id: string;
  title: string;
  subtitle?: string;
  timeEstimate: string;
  durationCategory: '15m' | '30m' | '45m' | '60m';
  category: 'main' | 'recall' | 'practice' | 'bonus';
  xpReward: number;
  completed: boolean;
  tasks: MissionTask[];
  skills: string[];
}

export interface StoryLesson {
  id: string;
  levelId: string;
  levelNumber: number;
  levelTitle: string;
  title: string;
  roleContext: string;
  narrative: {
    premise: string;
    dilemma: string;
    objective: string;
  };
  interactiveMoment: {
    prompt: string;
    correctOrder: string[];
    initialItems: string[];
    hints: string[];
    explanationAfterSuccess: string;
  };
  conceptBreakdown: {
    title: string;
    summary: string;
    realWorldAnalogy: {
      title: string;
      story: string;
      icon: string;
    };
    visualDiagramFlow: {
      step: number;
      actor: string;
      action: string;
      desc: string;
    }[];
    commonMistakes: string[];
    goldenRule: string;
  };
  miniChallenge: {
    question: string;
    context: string;
    options: {
      id: string;
      label: string;
      isCorrect: boolean;
      feedback: string;
    }[];
    correctFeedback: string;
    incorrectFeedback: string;
  };
  practiceTask: {
    title: string;
    description: string;
    problemType: 'coding' | 'system-design' | 'debugging';
    starterSnippet?: string;
    externalLinkText?: string;
    externalLinkUrl?: string;
    hint: string;
  };
}

export interface Flashcard {
  id: string;
  topic: string;
  question: string;
  answer: string;
  codeSnippet?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  masteryScore: number; // 0 to 100
  timesReviewed: number;
}

export interface ShortNote {
  id: string;
  title: string;
  readTime: string;
  topic: string;
  category: string;
  whatItIs: string;
  thinkOfItLike: string;
  rememberThis: string[];
  commonMistake: string;
  isSaved: boolean;
}

export interface BossChallenge {
  id: string;
  title: string;
  difficulty: number; // 1 to 5 stars
  duration: string;
  skills: string[];
  scenario: string;
  objective: string;
  requirements: string[];
  xpReward: number;
  badgeReward: string;
  accepted: boolean;
  completed: boolean;
  type: 'boss' | 'debug' | 'speedrun' | 'architect';
}

export interface SquadMember {
  id: string;
  name: string;
  college: string;
  avatar: string;
  role: string;
  xpThisWeek: number;
  online: boolean;
  currentMission: string;
}

export interface SquadMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  senderCollege: string;
  text: string;
  timestamp: string;
  isPinned?: boolean;
  reactions?: { emoji: string; count: number }[];
}

export interface StudySquad {
  id: string;
  name: string;
  tag: string;
  slogan: string;
  memberCount: number;
  maxMembers: number;
  activeNowCount: number;
  goal: {
    title: string;
    progressPercent: number;
    deadline: string;
    targetLevel: string;
  };
  squadStreak: number;
  members: SquadMember[];
  messages: SquadMessage[];
}

export interface TechMeme {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  college: string;
  category: 'Programming' | 'AI' | 'DSA' | 'College' | 'Debugging' | 'GATE' | 'DevLife';
  memeCard: {
    headline: string;
    type: 'code-vs-code' | 'relatable-quote' | 'dialogue-scene' | 'stat-punchline';
    leftBlock?: { title: string; code: string; language: string; badge: string };
    rightBlock?: { title: string; code: string; language: string; badge: string };
    dialogue?: { speaker: string; text: string; mood: string }[];
    caption: string;
  };
  likes: number;
  liked: boolean;
  commentsCount: number;
  saved: boolean;
  learningMissionBridge: {
    badgeText: string;
    hookTitle: string;
    duration: string;
    xp: number;
    targetTopic: string;
    targetLessonId: string;
  };
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  workType: 'Remote' | 'Hybrid' | 'On-site';
  type: 'Internship' | 'Hackathon' | 'Competition' | 'Scholarship' | 'Workshop';
  stipendOrPrize: string;
  deadline: string;
  daysLeft: number;
  skillTags: string[];
  matchScore: number;
  description: string;
  eligibility: string;
  saved: boolean;
  applied: boolean;
}

import React from 'react';
import { Flame, Zap, Users, Sparkles, SlidersHorizontal, BookOpen, LogOut, GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const TopHeader: React.FC = () => {
  const { user, squad, setView, setIsOnboardingOpen, setIsMockInterviewOpen, currentView, logout } = useApp();

  const isExamTrack = user.trackType === 'exam';

  const getPageTitle = () => {
    switch (currentView) {
      case 'home':
        return isExamTrack ? 'GATE Prep Dashboard' : 'Learning Dashboard';
      case 'learn':
        return isExamTrack ? 'Exam Syllabus & Knowledge Tree' : 'Learning Path & Level Map';
      case 'story-lesson':
        return 'Story-Driven Learning';
      case 'missions':
        return 'Today’s Productivity Missions';
      case 'flashcards':
        return isExamTrack ? 'GATE PYQ & Formula Flashcards' : 'Active Recall Flashcards';
      case 'notes':
        return '60-Second Short Notes';
      case 'challenges':
        return isExamTrack ? 'Speed Tests & Timed PYQs' : 'Weekly Boss Battles';
      case 'squad':
        return isExamTrack ? 'Study Squad — GATE CSE 2028' : 'Study Squad — Web Warriors';
      case 'memes':
        return 'Tech Meme Feed & Micro-Lessons';
      case 'opportunities':
        return isExamTrack ? 'Higher Studies & Research Fellowships' : 'Curated Opportunities & Matches';
      case 'profile':
        return 'Student Profile & Learning DNA';
      default:
        return 'Student Learning World';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-[#F7F1E3]/95 backdrop-blur-md border-b-2.5 border-[#171717] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: View Title & Tagline */}
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="font-display font-black text-lg sm:text-xl text-[#171717] tracking-tight">
            {getPageTitle()}
          </h1>
          <span className="hidden md:inline-flex">
            <Badge variant={isExamTrack ? 'marigold' : 'forest'} size="sm">
              {isExamTrack ? `${user.examDetails?.examName || 'GATE CSE'} ${user.examDetails?.targetYear || '2028'}` : `Level 0${user.level}`}
            </Badge>
          </span>
        </div>
        <p className="text-xs font-semibold text-[#575757] hidden sm:block">
          {isExamTrack
            ? 'Conceptual depth + continuous PYQ practice for Top IITs & IISc.'
            : 'Your syllabus tells you what to learn. We make you want to learn it.'}
        </p>
      </div>

      {/* Right: Gamified Stats & Quick Triggers */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Pill */}
        <div
          onClick={() => setView('profile')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E9785A]/15 border-2 border-[#171717] shadow-[2px_2px_0px_#171717] cursor-pointer hover:bg-[#E9785A]/25 transition-all select-none"
        >
          <Flame size={16} className="text-[#E9785A] fill-[#E9785A]" />
          <span className="font-display font-black text-xs sm:text-sm text-[#171717]">
            {user.streakDays}d
          </span>
        </div>

        {/* XP Pill */}
        <div
          onClick={() => setView('profile')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E4A93A]/20 border-2 border-[#171717] shadow-[2px_2px_0px_#171717] cursor-pointer hover:bg-[#E4A93A]/30 transition-all select-none"
        >
          <Zap size={16} className="text-[#E4A93A] fill-[#E4A93A]" />
          <span className="font-display font-black text-xs sm:text-sm text-[#171717]">
            {user.totalXp} XP
          </span>
        </div>

        {/* Squad Pulse */}
        <div
          onClick={() => setView('squad')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6EE] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] cursor-pointer hover:bg-[#ECE4D0] transition-all select-none"
        >
          <Users size={16} className="text-[#244B3A]" />
          <span className="font-display font-bold text-xs text-[#171717]">
            {squad.activeNowCount} Online
          </span>
        </div>

        {/* AI Mock Technical Interview Trigger */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsMockInterviewOpen(true)}
          className="hidden md:inline-flex items-center gap-1.5 bg-[#244B3A] text-[#FAF6EE] shadow-[2px_2px_0px_#171717]"
        >
          <span>🎯</span>
          <span>Mock Interview</span>
        </Button>

        {/* Onboarding / Persona Switcher */}
        <Button
          variant="secondary"
          size="sm"
          icon={<SlidersHorizontal size={14} />}
          onClick={() => setIsOnboardingOpen(true)}
          className="hidden sm:inline-flex"
        >
          Track & Goals
        </Button>

        {/* Logout Button */}
        <button
          onClick={() => logout()}
          title="Sign Out"
          className="p-2 rounded-xl bg-[#FAF6EE] hover:bg-[#E9785A]/20 border-2 border-[#171717] shadow-[2px_2px_0px_#171717] transition-all cursor-pointer text-[#575757] hover:text-[#171717]"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};

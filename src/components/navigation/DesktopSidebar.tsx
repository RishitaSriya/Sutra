import React from 'react';
import {
  Compass,
  Map,
  CheckSquare,
  Layers,
  FileText,
  Swords,
  Users,
  Sparkles,
  Briefcase,
  User,
  Flame,
  Zap,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ViewMode } from '../../types';
import { clsx } from 'clsx';
import { Badge } from '../common/Badge';

export const DesktopSidebar: React.FC = () => {
  const { currentView, setView, user, currentPath, setIsOnboardingOpen } = useApp();

  const isExamTrack = user.trackType === 'exam';

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Compass size={19} strokeWidth={2.2} /> },
    {
      id: 'learn',
      label: isExamTrack ? 'GATE Syllabus Tree' : 'Learn & Stories',
      icon: <Map size={19} strokeWidth={2.2} />,
      badge: isExamTrack ? 'Core CS' : 'Level 3',
    },
    { id: 'missions', label: 'Today’s Missions', icon: <CheckSquare size={19} strokeWidth={2.2} />, badge: '32m' },
    {
      id: 'flashcards',
      label: isExamTrack ? 'PYQ Flashcards' : 'Flashcards',
      icon: <Layers size={19} strokeWidth={2.2} />,
      badge: isExamTrack ? '25 PYQs' : '12',
    },
    { id: 'notes', label: '60s Short Notes', icon: <FileText size={19} strokeWidth={2.2} /> },
    {
      id: 'challenges',
      label: isExamTrack ? 'Speed Drills' : 'Weekly Boss',
      icon: <Swords size={19} strokeWidth={2.2} />,
      badge: isExamTrack ? 'Drill' : 'Boss',
    },
    {
      id: 'squad',
      label: isExamTrack ? 'GATE Study Squad' : 'Web Warriors Squad',
      icon: <Users size={19} strokeWidth={2.2} />,
      badge: '7 Online',
    },
    { id: 'memes', label: 'Tech Meme Feed', icon: <Sparkles size={19} strokeWidth={2.2} />, badge: '😂 Relatable' },
    {
      id: 'opportunities',
      label: isExamTrack ? 'Higher Studies & Labs' : 'Opportunities',
      icon: <Briefcase size={19} strokeWidth={2.2} />,
      badge: isExamTrack ? 'Top IITs' : '92% Match',
    },
    { id: 'profile', label: 'Profile & DNA', icon: <User size={19} strokeWidth={2.2} /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 h-screen sticky top-0 bg-[#FAF6EE] border-r-2.5 border-[#171717] p-5 justify-between overflow-y-auto z-30">
      {/* Brand & Identity */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b-2 border-[#171717]/10">
          <div
            onClick={() => setView('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#244B3A] text-[#F7F1E3] border-2 border-[#171717] shadow-[2.5px_2.5px_0px_#171717] flex items-center justify-center font-display font-black text-xl group-hover:bg-[#E4A93A] group-hover:text-[#171717] transition-all">
              ⚡
            </div>
            <div>
              <div className="font-display font-black text-2xl tracking-tighter text-[#171717] flex items-center gap-1.5">
                SUTRA <span className="text-xs bg-[#E4A93A] px-1.5 py-0.5 rounded-md border border-[#171717] font-bold">PRO</span>
              </div>
              <p className="text-[10px] font-bold font-display uppercase tracking-wider text-[#6F8F72]">
                {isExamTrack ? 'GATE Exam Prep' : 'Student-First Learning'}
              </p>
            </div>
          </div>
        </div>

        {/* Current Path Card */}
        <div className="p-3.5 rounded-2xl bg-[#F7F1E3] border-2 border-[#171717] shadow-[2.5px_2.5px_0px_#171717] mb-5">
          <div className="flex items-center justify-between text-xs font-bold font-display text-[#575757] mb-1.5">
            <span>{isExamTrack ? 'TARGET EXAM' : 'ACTIVE PATH'}</span>
            <span className="text-[#244B3A]">
              {isExamTrack ? (user.examDetails?.targetYear || '2028') : `LVL 0${currentPath.currentLevel}/0${currentPath.totalLevels}`}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl">{isExamTrack ? '🎓' : currentPath.icon}</span>
              <span className="font-display font-bold text-sm text-[#171717] truncate">
                {isExamTrack ? (user.examDetails?.examName || 'GATE CSE') : currentPath.title}
              </span>
            </div>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-[#FAF6EE] hover:bg-[#E4A93A] border border-[#171717] rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Switch
            </button>
          </div>
          <div className="w-full bg-[#ECE4D0] h-2 rounded-full mt-2.5 overflow-hidden border border-[#171717]/40">
            <div
              className="bg-[#244B3A] h-full rounded-full transition-all duration-500"
              style={{ width: `${user.currentLevelMastery}%` }}
            />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={clsx(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider border-2 transition-all cursor-pointer text-left',
                  isActive
                    ? 'bg-[#244B3A] text-[#F7F1E3] border-[#171717] shadow-[3px_3px_0px_#171717] translate-x-1'
                    : 'bg-transparent text-[#171717] border-transparent hover:bg-[#ECE4D0]/60 hover:border-[#171717]/40'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-[#E4A93A]' : 'text-[#575757]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={clsx(
                      'text-[9px] font-bold px-2 py-0.5 rounded-full border',
                      isActive
                        ? 'bg-[#E4A93A] text-[#171717] border-[#171717]'
                        : 'bg-[#F2C6A8] text-[#171717] border-[#171717]/60'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Profile Footer */}
      <div className="pt-4 border-t-2 border-[#171717]/10">
        <div
          onClick={() => setView('profile')}
          className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#F7F1E3] hover:bg-[#F2C6A8]/40 border-2 border-[#171717] shadow-[2px_2px_0px_#171717] cursor-pointer transition-all"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-xl object-cover border-2 border-[#171717]"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-sm text-[#171717] truncate">
                {user.name}
              </span>
              <span className="text-xs font-bold text-[#E9785A] flex items-center gap-0.5">
                <Flame size={13} /> {user.streakDays}d
              </span>
            </div>
            <p className="text-[10px] text-[#575757] font-semibold truncate flex items-center gap-1">
              <GraduationCap size={11} /> {user.tier}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

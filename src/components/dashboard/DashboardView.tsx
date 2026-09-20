import React from 'react';
import {
  Flame,
  Zap,
  CheckCircle2,
  Circle,
  ArrowRight,
  Clock,
  Sparkles,
  Users,
  Swords,
  BookOpen,
  Layers,
  ChevronRight,
  Target,
  Trophy,
  GraduationCap,
  Calendar,
  Compass,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { StatPill } from '../common/StatPill';
import { clsx } from 'clsx';

export const DashboardView: React.FC = () => {
  const {
    user,
    currentPath,
    missions,
    toggleMissionTask,
    startStoryLesson,
    setView,
    squad,
    bossChallenges,
    selectedTimeFilter,
    setSelectedTimeFilter,
    setIsOnboardingOpen,
  } = useApp();

  const isExamTrack = user.trackType === 'exam';

  const mainMission = missions && missions.length > 0 ? missions[0] : {
    id: 'm1',
    title: `${currentPath.title} Daily Mission`,
    subtitle: 'Track packets and inspect concepts',
    timeEstimate: '30 MIN',
    xpReward: 60,
    tasks: []
  };
  const completedCount = mainMission.tasks ? mainMission.tasks.filter((t) => t.completed).length : 0;
  const totalTasks = mainMission.tasks && mainMission.tasks.length > 0 ? mainMission.tasks.length : 1;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  // Dynamic milestones from the active learning path levels
  const currentMilestones = currentPath && currentPath.levels && currentPath.levels.length > 0
    ? currentPath.levels.map((lvl: any) => ({
        title: (lvl.title || `Level ${lvl.levelNumber || lvl.level_number}`).replace(/^Level \d+ — /, '').split('&')[0].trim(),
        lvl: lvl.levelNumber || lvl.level_number || 1,
        status: lvl.status === 'completed' || lvl.status === 'mastered'
          ? 'mastered'
          : lvl.status === 'in_progress' || lvl.status === 'current'
          ? 'current'
          : 'locked'
      }))
    : [
        { title: 'Foundations', lvl: 1, status: 'current' },
        { title: 'Core Concepts', lvl: 2, status: 'locked' },
        { title: 'Deep Dive', lvl: 3, status: 'locked' },
        { title: 'Mastery', lvl: 4, status: 'locked' },
      ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* 1. Personal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF6EE] p-5 sm:p-7 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#171717] tracking-tight">
              Hey {user.name} 👋
            </h2>
            <Badge variant={isExamTrack ? 'marigold' : 'peach'} size="sm">
              {isExamTrack
                ? `${user.examDetails?.examName || 'GATE CSE'} ${user.examDetails?.targetYear || '2028'}`
                : user.currentRole}
            </Badge>
            <Badge variant="forest" size="sm">
              {isExamTrack ? 'Higher Studies Track' : 'Industry Track'}
            </Badge>
          </div>
          <p className="font-display font-bold text-sm sm:text-base text-[#575757] mt-1">
            {isExamTrack
              ? `Preparing for ${user.examDetails?.examName || 'GATE CSE'} • Target: ${user.examDetails?.goals || 'M.Tech at Top IITs & IISc'}`
              : `Active Track: ${currentPath.title} • Let's keep that momentum rolling!`}
          </p>
        </div>

        {/* Quick Time Selector / Productivity Layer */}
        <div className="flex items-center gap-2 bg-[#F7F1E3] p-1.5 rounded-2xl border-2 border-[#171717] shadow-[2px_2px_0px_#171717] self-start sm:self-auto overflow-x-auto">
          <span className="text-[11px] font-display font-bold text-[#575757] px-2 uppercase">
            Time today:
          </span>
          {(['15m', '30m', '45m', '60m'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setSelectedTimeFilter(t);
                setView('missions');
              }}
              className={clsx(
                'px-2.5 py-1 rounded-xl text-xs font-display font-bold border transition-all cursor-pointer select-none',
                selectedTimeFilter === t
                  ? 'bg-[#E4A93A] text-[#171717] border-[#171717] shadow-[1.5px_1.5px_0px_#171717]'
                  : 'bg-[#FAF6EE] text-[#575757] border-[#171717]/30 hover:border-[#171717]'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Hero Section: TODAY'S MISSION */}
      <section className="bg-[#244B3A] text-[#F7F1E3] p-6 sm:p-8 rounded-3xl border-2.5 border-[#171717] shadow-[6px_6px_0px_#171717] relative overflow-hidden">
        {/* Subtle decorative background stamp */}
        <div className="absolute right-4 -bottom-6 opacity-10 text-9xl font-black select-none pointer-events-none">
          {isExamTrack ? 'GATE' : 'MISSION'}
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-display font-black bg-[#E4A93A] text-[#171717] px-3 py-1 rounded-full border border-[#171717] uppercase tracking-wider">
                {isExamTrack ? "TODAY'S SYLLABUS MISSION" : "TODAY'S MISSION"}
              </span>
              <span className="text-xs font-display font-bold bg-[#FAF6EE]/15 text-[#F7F1E3] px-3 py-1 rounded-full border border-[#FAF6EE]/30 flex items-center gap-1.5">
                <Clock size={13} /> {mainMission.timeEstimate || '30 MIN'}
              </span>
              <span className="text-xs font-display font-bold text-[#E4A93A] flex items-center gap-1">
                <Zap size={14} /> +{mainMission.xpReward} XP Reward
              </span>
            </div>

            <div>
              <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#FAF6EE] tracking-tight">
                {mainMission.title}
              </h3>
              <p className="font-display font-bold text-sm sm:text-base text-[#FAF6EE]/80 mt-1">
                {mainMission.subtitle}
              </p>
            </div>

            {/* Tasks Progress Bar & Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-display font-bold text-[#FAF6EE]/80">
                <span>PROGRESS: {completedCount} / {totalTasks} TASKS</span>
                <span>{progressPercent}% COMPLETE</span>
              </div>
              <div className="w-full bg-[#1A362A] h-3 rounded-full overflow-hidden border border-[#FAF6EE]/20">
                <div
                  className="bg-[#E4A93A] h-full rounded-full transition-all duration-500 shadow-inner"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Individual Tasks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {mainMission.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleMissionTask(mainMission.id, task.id)}
                    className={clsx(
                      'flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none text-xs font-display font-bold',
                      task.completed
                        ? 'bg-[#31624C] text-[#FAF6EE] border-[#FAF6EE]/40 line-through opacity-85'
                        : 'bg-[#1A362A] text-[#FAF6EE] border-[#FAF6EE]/20 hover:border-[#E4A93A]'
                    )}
                  >
                    {task.completed ? (
                      <CheckCircle2 size={16} className="text-[#E4A93A] shrink-0" />
                    ) : (
                      <Circle size={16} className="text-[#FAF6EE]/40 shrink-0" />
                    )}
                    <span className="truncate">{task.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA & Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
              iconPosition="right"
              onClick={() => startStoryLesson()}
            >
              Continue mission →
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={<BookOpen size={16} />}
              onClick={() => setView('learn')}
            >
              {isExamTrack ? 'View Exam Syllabus' : 'View Level Roadmap'}
            </Button>
          </div>
        </div>
      </section>

      {/* 3. YOUR JOURNEY (Interactive Learning Path & Milestones) */}
      <section className="bg-[#FAF6EE] p-6 sm:p-7 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-[#171717]/10">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-xl text-[#171717]">
                {isExamTrack ? 'GATE CSE SYLLABUS ROADMAP' : 'YOUR JOURNEY'}
              </h3>
              <Badge variant="forest" size="sm">
                {isExamTrack
                  ? `${user.examDetails?.examName || 'GATE CSE'} ${user.examDetails?.targetYear || '2028'}`
                  : currentPath.title.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs font-semibold text-[#575757]">
              {isExamTrack
                ? 'Subject 03 / 07 — Data Structures & Algorithms Core Concepts'
                : `Level 0${currentPath.currentLevel} / 0${currentPath.totalLevels} — Make It Beautiful & Responsive`}
            </p>
          </div>

          <button
            onClick={() => setView('learn')}
            className="flex items-center gap-1 text-xs font-display font-bold text-[#244B3A] hover:text-[#171717] transition-colors cursor-pointer self-start sm:self-auto"
          >
            {isExamTrack ? 'Explore Full Syllabus Map' : 'Explore Interactive Level Map'} <ChevronRight size={15} />
          </button>
        </div>

        {/* Milestone Steps Bar */}
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center justify-between min-w-[620px] gap-2 pt-2">
            {currentMilestones.map((ms, idx) => {
              const isMastered = ms.status === 'mastered';
              const isCurrent = ms.status === 'current';
              return (
                <React.Fragment key={ms.title}>
                  <div
                    onClick={() => setView('learn')}
                    className={clsx(
                      'flex flex-col items-center p-3 rounded-2xl border-2 transition-all cursor-pointer flex-1 text-center select-none',
                      isCurrent
                        ? 'bg-[#E4A93A] text-[#171717] border-[#171717] shadow-[3px_3px_0px_#171717] -translate-y-1'
                        : isMastered
                        ? 'bg-[#244B3A] text-[#F7F1E3] border-[#171717] shadow-[2px_2px_0px_#171717]'
                        : 'bg-[#F7F1E3] text-[#575757] border-[#171717]/30 opacity-70'
                    )}
                  >
                    <span className="text-[10px] font-display font-black uppercase tracking-wider mb-1">
                      {isMastered ? '✓ DONE' : isCurrent ? '⚡ CURRENT' : `SUB 0${ms.lvl}`}
                    </span>
                    <span className="font-display font-bold text-xs sm:text-sm">
                      {ms.title}
                    </span>
                  </div>
                  {idx < currentMilestones.length - 1 && (
                    <span className="font-bold text-[#171717]/40 text-sm">→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. TRACK SPECIFIC FOCUS BENTO (Career Context vs GATE Exam Focus) */}
      {isExamTrack ? (
        <section className="bg-[#FAF6EE] p-6 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="forest" size="sm" icon={<GraduationCap size={13} />}>
                GATE EXAM FOCUS
              </Badge>
              <h4 className="font-display font-bold text-lg text-[#171717]">
                {user.examDetails?.examName || 'GATE Computer Science & IT'} ({user.examDetails?.targetYear || '2028'})
              </h4>
            </div>
            <span className="text-xs font-bold text-[#244B3A]">
              🎯 Prep Level: {user.examDetails?.preparationLevel || 'Beginner'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-[#F7F1E3] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] space-y-1">
              <span className="text-[10px] font-display font-black text-[#575757] uppercase tracking-wider">
                Primary Ambition
              </span>
              <p className="font-display font-bold text-sm text-[#171717]">
                {user.examDetails?.goals || 'M.Tech at Top IITs (IIT Bombay/Delhi/Madras) & IISc'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F1E3] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] space-y-1">
              <span className="text-[10px] font-display font-black text-[#575757] uppercase tracking-wider">
                Targeted Core Subjects
              </span>
              <p className="font-display font-bold text-xs text-[#171717] line-clamp-2">
                {user.examDetails?.subjects && user.examDetails.subjects.length > 0
                  ? user.examDetails.subjects.join(', ')
                  : 'Engineering Math, Discrete Math, Data Structures, Algorithms, OS'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F1E3] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-display font-black text-[#575757] uppercase tracking-wider">
                  PYQ & Formula Speed Drills
                </span>
                <p className="text-xs font-semibold text-[#575757] mt-0.5">
                  15-year previous year question bank unlocked.
                </p>
              </div>
              <button
                onClick={() => setView('flashcards')}
                className="text-xs font-display font-bold text-[#244B3A] hover:underline text-left mt-2 cursor-pointer"
              >
                Practice PYQs Now →
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-[#FAF6EE] p-6 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="marigold" size="sm" icon={<Target size={13} />}>
                TARGET COMPANY CONTEXTS
              </Badge>
              <h4 className="font-display font-bold text-base text-[#171717]">
                Role: {user.learningProfile?.careerPath || user.currentRole}
              </h4>
            </div>
            <span className="text-xs font-semibold text-[#575757]">
              Used for contextual problem sets and case studies
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {(user.targetCompanies && user.targetCompanies.length > 0 ? user.targetCompanies : user.dreamCompanies).map(
              (c) => (
                <span
                  key={c}
                  className="px-3 py-1.5 rounded-xl bg-[#F7F1E3] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-display font-bold text-xs text-[#171717]"
                >
                  🏢 {c}
                </span>
              )
            )}
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#FAF6EE] border border-[#171717]/20 text-[11px] text-[#575757] mt-2">
            <AlertCircle size={14} className="text-[#E9785A] shrink-0 mt-0.5" />
            <span>
              <strong>Disclaimer:</strong> Target company selections are used solely to contextualize learning modules, system design scenarios, and interview problem sets. Sutra does not guarantee hiring or employment.
            </span>
          </div>
        </section>
      )}

      {/* 5. Quick Progress Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatPill
          label="Learning Streak"
          value={`${user.streakDays} DAYS`}
          subtext="🔥 100% On Time"
          variant="coral"
          icon={<Flame className="text-[#E9785A]" />}
          size="lg"
        />
        <StatPill
          label="Total Mastery XP"
          value={`${user.totalXp}`}
          subtext={isExamTrack ? '⚡ GATE Scholar' : '⚡ Level 03 Scholar'}
          variant="marigold"
          icon={<Zap className="text-[#E4A93A]" />}
          size="lg"
        />
        <StatPill
          label={isExamTrack ? 'Syllabus Mastery' : 'Current Level Mastery'}
          value={`${user.currentLevelMastery}%`}
          subtext={isExamTrack ? '📚 3 Subjects in Progress' : '🌱 4 Concepts To Next'}
          variant="forest"
          icon={<Target className="text-[#244B3A]" />}
          size="lg"
        />
        <StatPill
          label={isExamTrack ? 'PYQ Missions Done' : 'Missions Completed'}
          value={`${user.completedMissionsCount}`}
          subtext={isExamTrack ? '🎯 Core CS Questions' : '🎯 Across 3 Paths'}
          variant="peach"
          icon={<Trophy className="text-[#E9785A]" />}
          size="lg"
        />
      </section>

      {/* 6. Squad Pulse & Weekly Boss Dual Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Squad Pulse Card */}
        <div className="bg-[#FAF6EE] p-5 sm:p-6 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="forest" size="sm" icon={<Users size={12} />}>
                  {isExamTrack ? 'GATE CSE STUDY SQUAD' : 'STUDY SQUAD'}
                </Badge>
                <span className="text-xs font-bold text-[#575757]">
                  {squad.activeNowCount} active online
                </span>
              </div>
              <span className="text-xs font-bold text-[#E9785A]">
                🔥 {squad.squadStreak}d squad streak
              </span>
            </div>

            <h4 className="font-display font-bold text-xl text-[#171717]">
              {isExamTrack ? 'GATE CSE 2028 Warriors' : squad.name}
            </h4>
            <p className="text-xs text-[#575757] font-semibold mt-0.5">
              Goal: {isExamTrack ? 'Solve 100 Graph Theory & Discrete Math PYQs' : squad.goal.title}
            </p>

            {/* Squad Progress Bar */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-display font-bold text-[#575757]">
                <span>SQUAD COMPLETION</span>
                <span className="text-[#244B3A]">{squad.goal.progressPercent}%</span>
              </div>
              <div className="w-full bg-[#ECE4D0] h-2.5 rounded-full overflow-hidden border border-[#171717]/30">
                <div
                  className="bg-[#244B3A] h-full rounded-full"
                  style={{ width: `${squad.goal.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Mini Squad Members Avatars */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex -space-x-2 overflow-hidden">
                {squad.members.map((m) => (
                  <img
                    key={m.id}
                    src={m.avatar}
                    alt={m.name}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#FAF6EE] border border-[#171717] object-cover"
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#575757]">
                +13 other college peers
              </span>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={<Users size={16} />}
            onClick={() => setView('squad')}
          >
            Open Squad Hub & Chat →
          </Button>
        </div>

        {/* Weekly Boss Preview */}
        <div className="bg-[#FAF6EE] p-5 sm:p-6 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <Badge variant="coral" size="sm" icon={<Swords size={12} />}>
                {isExamTrack ? 'WEEKLY SPEED TEST BATTLE' : 'WEEKLY BOSS BATTLE'}
              </Badge>
              <span className="text-xs font-bold text-[#E4A93A]">
                ★★★☆☆ Intermediate
              </span>
            </div>

            <h4 className="font-display font-bold text-xl text-[#171717]">
              {isExamTrack ? 'GATE Speed Drill: Time Complexity & Recurrence Relations' : bossChallenges[0].title}
            </h4>
            <p className="text-xs text-[#575757] font-semibold mt-1 line-clamp-2">
              {isExamTrack
                ? 'Master the Master Theorem and recursion tree bounds under a strict 20-minute timer.'
                : bossChallenges[0].scenario}
            </p>

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {(isExamTrack ? ['Master Theorem', 'Graph Theory', 'Asymptotics'] : bossChallenges[0].skills).map((skill) => (
                <span
                  key={skill}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-[#F7F1E3] border border-[#171717]/40 font-bold text-[#171717]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <Button
            variant="coral"
            size="sm"
            icon={<Swords size={16} />}
            onClick={() => setView('challenges')}
          >
            {isExamTrack ? 'Start Speed Drill (+150 XP) →' : `Accept Boss Challenge (+${bossChallenges[0].xpReward} XP) →`}
          </Button>
        </div>
      </div>
    </div>
  );
};

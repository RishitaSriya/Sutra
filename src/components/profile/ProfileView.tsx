import React from 'react';
import {
  User,
  Flame,
  Zap,
  Target,
  Trophy,
  Sparkles,
  Award,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Bookmark,
  Layers,
  Settings,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { StatPill } from '../common/StatPill';
import { clsx } from 'clsx';

export const ProfileView: React.FC = () => {
  const { user, setIsOnboardingOpen, shortNotes, flashcards, setView } = useApp();

  const savedNotesCount = shortNotes.filter((n) => n.isSaved).length;

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* 1. Main Student Profile Header */}
      <div className="bg-[#FAF6EE] p-6 sm:p-8 rounded-3xl border-2.5 border-[#171717] shadow-[5px_5px_0px_#171717] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2.5 border-[#171717] shadow-[3px_3px_0px_#171717]"
          />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#171717]">
                {user.name}
              </h2>
              <Badge variant="forest" size="sm">
                LEVEL 0{user.level} {user.currentRole.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#575757] flex items-center gap-1.5">
              <GraduationCap size={15} /> {user.college} ({user.tier})
            </p>
            <p className="text-xs font-semibold text-[#575757]">
              {user.year} • {user.dailyTimeMinutes} min/day learning habit
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="md"
          icon={<SlidersHorizontal size={16} />}
          onClick={() => setIsOnboardingOpen(true)}
        >
          Edit Persona & Goals
        </Button>
      </div>

      {/* 2. 7-Day Streak Calendar Grid */}
      <div className="bg-[#FAF6EE] p-6 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="coral" size="sm" icon={<Flame size={13} />}>
              MOMENTUM TRACKER
            </Badge>
            <span className="font-display font-bold text-sm text-[#171717]">
              🔥 {user.streakDays} DAYS PERFECT LEARNING STREAK
            </span>
          </div>
          <span className="text-xs text-[#575757] font-semibold hidden sm:inline">
            Streaks only count on meaningful completed missions
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {user.streakHistory.map((sh) => (
            <div
              key={sh.day}
              className={clsx(
                'p-3 sm:p-4 rounded-2xl border-2 flex flex-col items-center justify-between text-center select-none shadow-[2px_2px_0px_#171717]',
                sh.completed
                  ? 'bg-[#244B3A] text-[#FAF6EE] border-[#171717]'
                  : 'bg-[#F7F1E3] text-[#575757] border-[#171717]/40'
              )}
            >
              <span className="text-[10px] font-display font-black uppercase tracking-wider text-[#E4A93A]">
                {sh.day}
              </span>
              <span className="font-display font-bold text-xs sm:text-sm my-1">
                {sh.date}
              </span>
              <span className="text-[10px] font-bold text-[#E4A93A]">
                {sh.completed ? '✓ DONE' : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. YOUR LEARNING DNA (Visual Learning Personality) */}
      <div className="bg-[#244B3A] text-[#FAF6EE] p-6 sm:p-8 rounded-3xl border-2.5 border-[#171717] shadow-[5px_5px_0px_#171717] space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs font-display font-black bg-[#E4A93A] text-[#171717] px-3 py-1 rounded-full uppercase tracking-wider">
              🧬 YOUR LEARNING DNA
            </span>
            <h3 className="font-display font-black text-2xl text-[#FAF6EE] mt-2">
              How Your Brain Learns Best
            </h3>
          </div>
          <span className="text-xs text-[#FAF6EE]/80 font-semibold">
            Based on completed missions & quiz speed
          </span>
        </div>

        {/* DNA Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-[#1A362A] rounded-2xl border border-[#FAF6EE]/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-display font-bold">
              <span>🛠️ HANDS-ON PRACTICE</span>
              <span className="text-[#E4A93A]">{user.learningDna.handsOn}%</span>
            </div>
            <div className="w-full bg-[#FAF6EE]/10 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#E4A93A] h-full rounded-full" style={{ width: `${user.learningDna.handsOn}%` }} />
            </div>
            <p className="text-[11px] text-[#FAF6EE]/70 font-medium">
              You retain 85% more when modifying real live code snippets.
            </p>
          </div>

          <div className="p-4 bg-[#1A362A] rounded-2xl border border-[#FAF6EE]/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-display font-bold">
              <span>🎬 STORY-DRIVEN NARRATIVES</span>
              <span className="text-[#E4A93A]">{user.learningDna.stories}%</span>
            </div>
            <div className="w-full bg-[#FAF6EE]/10 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#6F8F72] h-full rounded-full" style={{ width: `${user.learningDna.stories}%` }} />
            </div>
            <p className="text-[11px] text-[#FAF6EE]/70 font-medium">
              Real startup dilemmas build your engineering intuition faster than textbooks.
            </p>
          </div>

          <div className="p-4 bg-[#1A362A] rounded-2xl border border-[#FAF6EE]/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-display font-bold">
              <span>🎮 BOSS CHALLENGES</span>
              <span className="text-[#E4A93A]">{user.learningDna.challenges}%</span>
            </div>
            <div className="w-full bg-[#FAF6EE]/10 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#E9785A] h-full rounded-full" style={{ width: `${user.learningDna.challenges}%` }} />
            </div>
            <p className="text-[11px] text-[#FAF6EE]/70 font-medium">
              Time pressure tests your ability to make architectural trade-offs.
            </p>
          </div>

          <div className="p-4 bg-[#1A362A] rounded-2xl border border-[#FAF6EE]/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-display font-bold">
              <span>🖼️ VISUAL ANALOGIES</span>
              <span className="text-[#E4A93A]">{user.learningDna.visualExploration}%</span>
            </div>
            <div className="w-full bg-[#FAF6EE]/10 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#F2C6A8] h-full rounded-full" style={{ width: `${user.learningDna.visualExploration}%` }} />
            </div>
            <p className="text-[11px] text-[#FAF6EE]/70 font-medium">
              Chai-stall and fest analogies clarify complex distributed systems.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Track Specific Context (Dream Companies with Disclaimer vs GATE Exam Focus) */}
      {user.trackType === 'exam' ? (
        <div className="bg-[#FAF6EE] p-6 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="forest" size="sm" icon={<GraduationCap size={13} />}>
                GATE EXAM TRACK
              </Badge>
              <h4 className="font-display font-bold text-base text-[#171717]">
                {user.examDetails?.examName || 'GATE Computer Science & IT'} ({user.examDetails?.targetYear || '2028'})
              </h4>
            </div>
            <span className="text-xs font-bold text-[#244B3A]">
              Goal: {user.examDetails?.goals || 'Top IITs / IISc'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#F7F1E3] border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
              <span className="text-[10px] font-display font-black text-[#575757] uppercase tracking-wider block mb-1">
                Preparation Level
              </span>
              <p className="font-display font-bold text-sm text-[#171717]">
                {user.examDetails?.preparationLevel || 'Intermediate'}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F7F1E3] border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
              <span className="text-[10px] font-display font-black text-[#575757] uppercase tracking-wider block mb-1">
                Enrolled Core Subjects
              </span>
              <p className="font-display font-bold text-xs text-[#171717]">
                {user.examDetails?.subjects && user.examDetails.subjects.length > 0
                  ? user.examDetails.subjects.join(', ')
                  : 'Discrete Math, DSA, OS, Compilers'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#FAF6EE] p-6 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-black uppercase tracking-wider text-[#575757]">
              TARGET COMPANY CONTEXTS ({((user.targetCompanies && user.targetCompanies.length > 0) ? user.targetCompanies : user.dreamCompanies).length})
            </span>
            <span className="text-xs font-bold text-[#244B3A]">Personalizing story case studies</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {((user.targetCompanies && user.targetCompanies.length > 0) ? user.targetCompanies : user.dreamCompanies).map((c) => (
              <span
                key={c}
                className="px-3 py-1.5 rounded-xl bg-[#F7F1E3] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-display font-bold text-xs text-[#171717]"
              >
                🏢 {c}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-[#575757] pt-1">
            <strong>Disclaimer:</strong> Target company selections are used solely to contextualize learning modules and problem sets. Sutra does not guarantee hiring or employment.
          </p>
        </div>
      )}

      {/* 5. Mastered Badges Showcase */}
      <div className="bg-[#FAF6EE] p-6 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="marigold" size="sm" icon={<Award size={13} />}>
              HALL OF ACHIEVEMENTS
            </Badge>
            <span className="font-display font-bold text-sm text-[#171717]">
              {user.badges.length} BADGES EARNED
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {user.badges.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-[#F7F1E3] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{b.icon}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E4A93A] text-[#171717] border border-[#171717] uppercase">
                    {b.rarity}
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-[#171717] mt-2">
                  {b.name}
                </h4>
                <p className="text-xs text-[#575757] font-medium mt-0.5">
                  {b.description}
                </p>
              </div>
              <span className="text-[10px] text-[#575757] font-semibold pt-1 border-t border-[#171717]/10">
                Unlocked {b.unlockedAt}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

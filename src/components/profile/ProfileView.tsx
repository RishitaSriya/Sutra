import React, { useState, useEffect } from 'react';
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
  BarChart3,
  Calendar,
  Clock,
  TrendingUp,
  Activity,
  Bot,
  Loader2,
  Check,
  BrainCircuit,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { StatPill } from '../common/StatPill';
import { progressApi, UserAnalyticsResponse, AICoachReviewResponse } from '../../api/progressApi';
import { clsx } from 'clsx';

export const ProfileView: React.FC = () => {
  const { user, setIsOnboardingOpen, shortNotes, flashcards, setView, awardXp, triggerConfetti } = useApp();

  const [analyticsTab, setAnalyticsTab] = useState<'weekly' | 'monthly'>('weekly');
  const [analyticsData, setAnalyticsData] = useState<UserAnalyticsResponse | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(true);

  // AI Coach Review State
  const [aiCoachReview, setAiCoachReview] = useState<AICoachReviewResponse | null>(null);
  const [isLoadingCoach, setIsLoadingCoach] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoadingAnalytics(true);
        const data = await progressApi.getAnalytics();
        setAnalyticsData(data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoadingAnalytics(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleRequestAICoachReview = async () => {
    setIsLoadingCoach(true);
    try {
      const review = await progressApi.getAICoachReview(user.currentRole);
      setAiCoachReview(review);
      awardXp(25, 'Generated Gemini Performance Growth Review');
      triggerConfetti();
    } catch (err) {
      console.error('Failed to generate AI coach review:', err);
    } finally {
      setIsLoadingCoach(false);
    }
  };

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

      {/* 3. PERFORMANCE & LEARNING ANALYTICS HUB (Weekly & Monthly) */}
      <div className="bg-[#FAF6EE] p-6 sm:p-8 rounded-3xl border-2.5 border-[#171717] shadow-[5px_5px_0px_#171717] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#171717]/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="forest" size="sm" icon={<BarChart3 size={12} />}>
                PERFORMANCE INTELLIGENCE
              </Badge>
              <span className="text-xs font-bold text-[#244B3A]">
                WEEKLY & MONTHLY METRICS
              </span>
            </div>
            <h3 className="font-display font-black text-2xl text-[#171717]">
              User Learning Analytics & Growth
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-[#F7F1E3] p-1 rounded-2xl border-2 border-[#171717]">
              <button
                onClick={() => setAnalyticsTab('weekly')}
                className={clsx(
                  'px-3.5 py-1 rounded-xl text-xs font-display font-black transition-all',
                  analyticsTab === 'weekly'
                    ? 'bg-[#244B3A] text-[#FAF6EE] shadow-[1px_1px_0px_#171717]'
                    : 'text-[#171717] hover:bg-[#ECE4D0]'
                )}
              >
                7-Day Weekly
              </button>
              <button
                onClick={() => setAnalyticsTab('monthly')}
                className={clsx(
                  'px-3.5 py-1 rounded-xl text-xs font-display font-black transition-all',
                  analyticsTab === 'monthly'
                    ? 'bg-[#244B3A] text-[#FAF6EE] shadow-[1px_1px_0px_#171717]'
                    : 'text-[#171717] hover:bg-[#ECE4D0]'
                )}
              >
                30-Day Monthly
              </button>
            </div>
          </div>
        </div>

        {/* WEEKLY ANALYTICS VIEW */}
        {analyticsTab === 'weekly' && (
          <div className="space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-[#F7F1E3] rounded-2xl border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
                <span className="text-[10px] font-display font-black text-[#575757] uppercase tracking-wider block mb-1">
                  Total Study Time
                </span>
                <span className="text-2xl font-display font-black text-[#171717]">
                  {analyticsData?.weekly.total_minutes || 360}m
                </span>
                <span className="text-[10px] text-[#244B3A] font-bold block mt-0.5">
                  Avg {(analyticsData?.weekly.avg_minutes_per_day || 51.4)}m / day
                </span>
              </div>

              <div className="p-4 bg-[#F7F1E3] rounded-2xl border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
                <span className="text-[10px] font-display font-black text-[#575757] uppercase tracking-wider block mb-1">
                  XP Earned
                </span>
                <span className="text-2xl font-display font-black text-[#E9785A]">
                  +{analyticsData?.weekly.total_xp || 1110}
                </span>
                <span className="text-[10px] text-[#575757] font-bold block mt-0.5">
                  Across 7 Days
                </span>
              </div>

              <div className="p-4 bg-[#F7F1E3] rounded-2xl border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
                <span className="text-[10px] font-display font-black text-[#575757] uppercase tracking-wider block mb-1">
                  Active Days
                </span>
                <span className="text-2xl font-display font-black text-[#244B3A]">
                  7 / 7 Days
                </span>
                <span className="text-[10px] text-[#E4A93A] font-bold block mt-0.5">
                  100% Consistency
                </span>
              </div>

              <div className="p-4 bg-[#F7F1E3] rounded-2xl border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
                <span className="text-[10px] font-display font-black text-[#575757] uppercase tracking-wider block mb-1">
                  Daily Target
                </span>
                <span className="text-2xl font-display font-black text-[#171717]">
                  {user.dailyTimeMinutes}m
                </span>
                <span className="text-[10px] text-[#244B3A] font-bold block mt-0.5">
                  Target Met 6/7 days
                </span>
              </div>
            </div>

            {/* 7-Day Study Minutes Bar Chart */}
            <div className="p-5 sm:p-6 bg-[#F7F1E3] rounded-3xl border-2 border-[#171717] shadow-[3px_3px_0px_#171717] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-black uppercase text-[#171717]">
                  DAILY STUDY MINUTES BREAKDOWN
                </span>
                <span className="text-[11px] font-bold text-[#575757]">
                  Goal line: {user.dailyTimeMinutes} min/day
                </span>
              </div>

              {/* Responsive Bar Chart Canvas */}
              <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 pt-6 pb-2 border-b-2 border-[#171717]/20 relative">
                {/* Horizontal Goal Target Line */}
                <div
                  className="absolute w-full border-b-2 border-dashed border-[#E9785A]/70 z-10 pointer-events-none"
                  style={{ bottom: `${Math.min(100, (user.dailyTimeMinutes / 100) * 100)}%` }}
                >
                  <span className="absolute right-0 -top-4 text-[9px] font-bold text-[#E9785A] bg-[#FAF6EE] px-1 rounded">
                    Target: {user.dailyTimeMinutes}m
                  </span>
                </div>

                {(analyticsData?.weekly.daily_breakdown || [
                  { day_name: 'Mon', minutes_spent: 45, xp_earned: 120, is_target_met: true },
                  { day_name: 'Tue', minutes_spent: 60, xp_earned: 160, is_target_met: true },
                  { day_name: 'Wed', minutes_spent: 30, xp_earned: 90, is_target_met: true },
                  { day_name: 'Thu', minutes_spent: 75, xp_earned: 210, is_target_met: true },
                  { day_name: 'Fri', minutes_spent: 50, xp_earned: 140, is_target_met: true },
                  { day_name: 'Sat', minutes_spent: 90, xp_earned: 280, is_target_met: true },
                  { day_name: 'Sun', minutes_spent: 40, xp_earned: 110, is_target_met: true },
                ]).map((day, idx) => {
                  const maxMin = 100;
                  const heightPercent = Math.min(100, Math.max(15, (day.minutes_spent / maxMin) * 100));
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[10px] font-bold text-[#171717] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.minutes_spent}m (+{day.xp_earned}XP)
                      </span>
                      <div
                        className={clsx(
                          'w-full max-w-[36px] rounded-t-xl border-2 border-[#171717] transition-all duration-300 shadow-[2px_2px_0px_#171717] group-hover:scale-105',
                          day.minutes_spent >= user.dailyTimeMinutes
                            ? 'bg-[#244B3A]'
                            : 'bg-[#E4A93A]'
                        )}
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[11px] font-display font-bold text-[#171717] mt-1">
                        {day.day_name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MONTHLY ANALYTICS VIEW */}
        {analyticsTab === 'monthly' && (
          <div className="space-y-6">
            {/* 30-Day Activity Heatmap Grid */}
            <div className="p-5 sm:p-6 bg-[#F7F1E3] rounded-3xl border-2 border-[#171717] shadow-[3px_3px_0px_#171717] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-display font-black uppercase text-[#171717]">
                    30-DAY ACTIVITY & CONSISTENCY HEATMAP
                  </span>
                  <p className="text-[11px] text-[#575757] font-semibold">
                    Simulating daily commit velocity, hands-on labs, and boss challenges.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#575757]">
                  <span>Less</span>
                  <span className="w-3 h-3 rounded-sm bg-[#FAF6EE] border border-[#171717]/30" />
                  <span className="w-3 h-3 rounded-sm bg-[#6F8F72]/50 border border-[#171717]/30" />
                  <span className="w-3 h-3 rounded-sm bg-[#244B3A] border border-[#171717]/30" />
                  <span>More</span>
                </div>
              </div>

              {/* Heatmap Squares */}
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 pt-2">
                {(analyticsData?.monthly.heatmap || Array.from({ length: 30 })).map((h: any, idx: number) => {
                  const intensity = h?.count || ((idx % 4 === 0) ? 3 : (idx % 3 === 0 ? 2 : 1));
                  return (
                    <div
                      key={idx}
                      className={clsx(
                        'h-9 rounded-xl border-1.5 border-[#171717] flex flex-col items-center justify-center text-[10px] font-bold transition-all shadow-[1px_1px_0px_#171717] hover:scale-105 cursor-pointer',
                        intensity === 3
                          ? 'bg-[#244B3A] text-[#FAF6EE]'
                          : intensity === 2
                          ? 'bg-[#6F8F72] text-[#FAF6EE]'
                          : intensity === 1
                          ? 'bg-[#E4A93A]/60 text-[#171717]'
                          : 'bg-[#FAF6EE] text-[#575757]'
                      )}
                      title={`Day ${idx + 1}: ${intensity > 0 ? `${intensity * 30} mins` : 'Rest Day'}`}
                    >
                      <span>Day {idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Track-Specific Skill Mastery Breakdown */}
            <div className="p-5 sm:p-6 bg-[#F7F1E3] rounded-3xl border-2 border-[#171717] shadow-[3px_3px_0px_#171717] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-black uppercase text-[#171717]">
                  {user.currentRole.toUpperCase()} SKILLS MASTERY
                </span>
                <span className="text-xs font-bold text-[#244B3A]">
                  Weighted Mastery Index: 86/100
                </span>
              </div>

              <div className="space-y-3.5">
                {(analyticsData?.monthly.skills_mastery || [
                  { category: 'Frontend Architecture & DOM', score: 92, level_label: 'Master', description: 'CSS Grid, render cycle & microtasks' },
                  { category: 'JavaScript & Async Runtimes', score: 85, level_label: 'Advanced', description: 'Event loop, Promises & memory leaks' },
                  { category: 'Backend APIs & Database Design', score: 80, level_label: 'Proficient', description: 'REST endpoints, indexing & transaction locks' },
                  { category: 'System Design & Resiliency', score: 75, level_label: 'Intermediate', description: 'Rate limiting, caching & idempotency keys' },
                ]).map((skill, idx) => (
                  <div key={idx} className="space-y-1 bg-[#FAF6EE] p-3.5 rounded-2xl border border-[#171717]/15">
                    <div className="flex items-center justify-between text-xs font-display font-bold">
                      <span className="text-[#171717]">{skill.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#244B3A] text-[#FAF6EE]">
                          {skill.level_label}
                        </span>
                        <span className="text-[#E9785A] font-black">{skill.score}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-[#171717]/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#244B3A] h-full rounded-full transition-all duration-500"
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-[#575757] font-semibold">
                      {skill.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GEMINI AI PERFORMANCE DIAGNOSTIC COACH SECTION */}
        <div className="p-6 bg-[#244B3A] text-[#FAF6EE] rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-[#E4A93A] text-[#171717] flex items-center justify-center font-black">
                ✨
              </div>
              <div>
                <h4 className="font-display font-black text-lg text-[#FAF6EE]">
                  Gemini AI Performance Coach
                </h4>
                <span className="text-xs text-[#FAF6EE]/75 font-semibold">
                  Personalized engineering growth diagnostic
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              disabled={isLoadingCoach}
              icon={isLoadingCoach ? <Loader2 size={14} className="animate-spin" /> : <BrainCircuit size={14} />}
              onClick={handleRequestAICoachReview}
            >
              {isLoadingCoach ? 'Analyzing Metrics...' : aiCoachReview ? '✨ Refresh AI Review' : '✨ Ask Gemini Coach'}
            </Button>
          </div>

          {aiCoachReview ? (
            <div className="space-y-4 pt-2 border-t border-[#FAF6EE]/20 animate-in fade-in duration-300">
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-[#FAF6EE]/90">
                {aiCoachReview.summary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#1A362A] rounded-2xl border border-[#FAF6EE]/15 space-y-1.5">
                  <span className="text-[10px] font-display font-black text-[#E4A93A] uppercase tracking-wider block">
                    ✦ PROVEN STRENGTHS
                  </span>
                  <ul className="space-y-1 text-xs text-[#FAF6EE]/85">
                    {aiCoachReview.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#E4A93A]">✓</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-[#1A362A] rounded-2xl border border-[#FAF6EE]/15 space-y-1.5">
                  <span className="text-[10px] font-display font-black text-[#E9785A] uppercase tracking-wider block">
                    ⚠️ GROWTH FRONTIERS
                  </span>
                  <ul className="space-y-1 text-xs text-[#FAF6EE]/85">
                    {aiCoachReview.growth_areas.map((g, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#E9785A]">✦</span> {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Focus */}
              <div className="p-3.5 bg-[#1A362A] rounded-2xl border border-[#FAF6EE]/15 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-display font-black text-[#E4A93A] uppercase tracking-wider">
                    🎯 ACTIONABLE GOALS FOR THIS WEEK
                  </span>
                  <span className="text-[10px] font-bold text-[#E4A93A] bg-[#E4A93A]/15 px-2 py-0.5 rounded-full">
                    {aiCoachReview.projected_readiness}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {aiCoachReview.recommended_focus_this_week.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-[#244B3A] rounded-xl border border-[#FAF6EE]/10 text-xs font-semibold text-[#FAF6EE]">
                      {idx + 1}. {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentor Quote */}
              <div className="p-3 bg-[#E4A93A]/15 rounded-xl border border-[#E4A93A]/30 text-xs italic text-[#E4A93A] text-center">
                "{aiCoachReview.mentor_quote}"
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#FAF6EE]/70 italic pt-1">
              Click "Ask Gemini Coach" to evaluate your study habit, velocity, strengths, and generate a customized roadmap toward Tier-1 engineering roles.
            </p>
          )}
        </div>
      </div>

      {/* 4. YOUR LEARNING DNA (Visual Learning Personality) */}
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

      {/* 5. Track Specific Context (Dream Companies with Disclaimer vs GATE Exam Focus) */}
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

      {/* 6. Mastered Badges Showcase */}
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

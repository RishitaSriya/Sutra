import React, { useState, useEffect } from 'react';
import {
  Users,
  Flame,
  Zap,
  Send,
  Sparkles,
  MessageSquare,
  Trophy,
  Target,
  CheckCircle2,
  GraduationCap,
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Radio,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { mockTrackSquads } from '../../data/mockSquads';
import { clsx } from 'clsx';

export const SquadView: React.FC = () => {
  const { squad, sendSquadMessage, user, awardXp, triggerConfetti } = useApp();
  const [selectedSquadKey, setSelectedSquadKey] = useState<'web_dev' | 'data_science' | 'security' | 'gate_cse'>('web_dev');
  const [inputMsg, setInputMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'pomodoro' | 'leaderboard'>('chat');

  // Pomodoro Focus Room State
  const [pomodoroSeconds, setPomodoroSeconds] = useState<number>(25 * 60);
  const [isPomoRunning, setIsPomoRunning] = useState<boolean>(false);
  const [pomoMode, setPomoMode] = useState<'focus' | 'break'>('focus');
  const [ambientSound, setAmbientSound] = useState<'cafe' | 'rain' | 'whitenoise' | 'off'>('cafe');

  const activeSquad = mockTrackSquads[selectedSquadKey] || squad;

  // Pomodoro Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isPomoRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0) {
      if (pomoMode === 'focus') {
        awardXp(50, 'Completed 25-Min Squad Deep Focus Session');
        triggerConfetti();
        setPomoMode('break');
        setPomodoroSeconds(5 * 60);
      } else {
        setPomoMode('focus');
        setPomodoroSeconds(25 * 60);
      }
      setIsPomoRunning(false);
    }
    return () => clearInterval(interval);
  }, [isPomoRunning, pomodoroSeconds, pomoMode]);

  const formatPomoTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    sendSquadMessage(inputMsg);
    setInputMsg('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Squad Header Banner */}
      <div className="bg-[#FAF6EE] p-6 sm:p-8 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="forest" size="sm" icon={<Users size={12} />}>
              SQUAD #{activeSquad.tag}
            </Badge>
            <span className="text-xs font-bold text-[#E9785A] flex items-center gap-1">
              <Flame size={14} className="fill-[#E9785A]" /> {activeSquad.squadStreak}-Day Squad Streak
            </span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#171717]">
            {activeSquad.name}
          </h2>
          <p className="text-xs sm:text-sm text-[#575757] font-semibold mt-0.5 max-w-xl">
            {activeSquad.slogan}
          </p>
        </div>

        {/* Squad Quick Stats */}
        <div className="flex items-center gap-3 bg-[#F7F1E3] p-3 rounded-2xl border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
          <div className="text-center px-2">
            <span className="text-xl font-display font-black text-[#171717] block">
              {activeSquad.memberCount}/{activeSquad.maxMembers}
            </span>
            <span className="text-[10px] font-bold text-[#575757] uppercase">Members</span>
          </div>
          <div className="w-px h-8 bg-[#171717]/20" />
          <div className="text-center px-2">
            <span className="text-xl font-display font-black text-[#244B3A] block">
              {activeSquad.activeNowCount}
            </span>
            <span className="text-[10px] font-bold text-[#575757] uppercase">Online Now</span>
          </div>
        </div>
      </div>

      {/* Cohort Track Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'web_dev', label: '🌐 Web Warriors' },
          { key: 'data_science', label: '📊 Data Guild #404' },
          { key: 'security', label: '🛡️ Zero-Day Defend' },
          { key: 'gate_cse', label: '🎯 GATE Aspirants #101' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setSelectedSquadKey(t.key as any)}
            className={clsx(
              'px-4 py-2 rounded-2xl text-xs font-display font-black border-2 transition-all shadow-[2px_2px_0px_#171717] whitespace-nowrap',
              selectedSquadKey === t.key
                ? 'bg-[#244B3A] text-[#FAF6EE] border-[#171717]'
                : 'bg-[#FAF6EE] text-[#171717] border-[#171717] hover:bg-[#ECE4D0]'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Weekly Squad Goal Progress Card */}
      <div className="bg-[#244B3A] text-[#FAF6EE] p-6 sm:p-7 rounded-3xl border-2.5 border-[#171717] shadow-[5px_5px_0px_#171717] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-display font-black bg-[#E4A93A] text-[#171717] px-3 py-1 rounded-full uppercase tracking-wider">
            🎯 WEEKLY COHORT QUEST
          </span>
          <span className="text-xs font-display font-bold text-[#E4A93A]">
            Deadline: {activeSquad.goal.deadline}
          </span>
        </div>

        <div>
          <h3 className="font-display font-black text-xl sm:text-2xl text-[#FAF6EE]">
            {activeSquad.goal.title}
          </h3>
          <p className="text-xs text-[#FAF6EE]/80 mt-0.5">
            Target: {activeSquad.goal.targetLevel} • Reward: +300 Squad XP Boost
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-display font-bold text-[#FAF6EE]/90">
            <span>SQUAD COHORT PROGRESS</span>
            <span>{activeSquad.goal.progressPercent}%</span>
          </div>
          <div className="w-full bg-[#1A362A] h-3.5 rounded-full overflow-hidden border border-[#FAF6EE]/25">
            <div
              className="bg-[#E4A93A] h-full rounded-full transition-all duration-500 shadow-inner"
              style={{ width: `${activeSquad.goal.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sub-navigation Tabs: Chat | 25-Min Focus Pomodoro Room | Leaderboard */}
      <div className="flex items-center gap-2 border-b-2 border-[#171717]/15 pb-2">
        <button
          onClick={() => setActiveTab('chat')}
          className={clsx(
            'px-4 py-2 rounded-xl text-xs font-display font-black transition-all flex items-center gap-1.5',
            activeTab === 'chat'
              ? 'bg-[#171717] text-[#FAF6EE]'
              : 'bg-[#FAF6EE] text-[#171717] hover:bg-[#ECE4D0]'
          )}
        >
          <MessageSquare size={14} /> Squad Live Chat
        </button>
        <button
          onClick={() => setActiveTab('pomodoro')}
          className={clsx(
            'px-4 py-2 rounded-xl text-xs font-display font-black transition-all flex items-center gap-1.5',
            activeTab === 'pomodoro'
              ? 'bg-[#171717] text-[#FAF6EE]'
              : 'bg-[#FAF6EE] text-[#171717] hover:bg-[#ECE4D0]'
          )}
        >
          <Headphones size={14} /> 🎧 25-Min Focus Room ({activeSquad.activeNowCount} in room)
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={clsx(
            'px-4 py-2 rounded-xl text-xs font-display font-black transition-all flex items-center gap-1.5',
            activeTab === 'leaderboard'
              ? 'bg-[#171717] text-[#FAF6EE]'
              : 'bg-[#FAF6EE] text-[#171717] hover:bg-[#ECE4D0]'
          )}
        >
          <Trophy size={14} /> Weekly XP Leaderboard
        </button>
      </div>

      {/* Tab 1: SQUAD LIVE CHAT & MEMBERS */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Members List */}
          <div className="lg:col-span-5 bg-[#FAF6EE] p-5 sm:p-6 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#171717]/10">
              <span className="text-xs font-display font-black uppercase tracking-wider text-[#575757]">
                SQUAD MATES ({activeSquad.members.length})
              </span>
              <span className="text-xs font-bold text-[#244B3A]">Tier-2/3/4 Peers</span>
            </div>

            <div className="space-y-3">
              {activeSquad.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F1E3] border-2 border-[#171717] shadow-[2px_2px_0px_#171717]"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-xl object-cover border-2 border-[#171717]"
                      />
                      {member.online && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#6F8F72] border-2 border-[#171717]" />
                      )}
                    </div>
                    <div>
                      <span className="font-display font-bold text-sm text-[#171717]">
                        {member.name}
                      </span>
                      <p className="text-[10px] font-semibold text-[#575757] flex items-center gap-1">
                        <GraduationCap size={11} /> {member.college}
                      </p>
                      <p className="text-[10px] font-bold text-[#244B3A]">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-display font-black text-[#E9785A]">
                      {member.xpThisWeek} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Squad Live Discussion Thread */}
          <div className="lg:col-span-7 bg-[#FAF6EE] p-5 sm:p-6 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#171717]/10">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-[#244B3A]" />
                <span className="text-xs font-display font-black uppercase text-[#171717]">
                  REAL-TIME COHORT DISCUSSIONS
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#575757]">Active</span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {activeSquad.messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-9 h-9 rounded-xl object-cover border-2 border-[#171717] shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-black text-xs text-[#171717]">
                        {msg.senderName}
                      </span>
                      <span className="text-[10px] text-[#575757] font-semibold">
                        {msg.senderCollege} • {msg.timestamp}
                      </span>
                    </div>

                    <div className="p-3 bg-[#F7F1E3] rounded-2xl rounded-tl-sm border-2 border-[#171717] shadow-[2px_2px_0px_#171717] text-xs text-[#171717] font-medium leading-relaxed">
                      {msg.text}
                    </div>

                    {msg.reactions && (
                      <div className="flex items-center gap-1.5 pt-0.5">
                        {msg.reactions.map((r, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full bg-[#FAF6EE] border border-[#171717]/30 text-[10px] font-bold cursor-pointer hover:scale-105"
                          >
                            {r.emoji} {r.count}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} className="pt-3 border-t-2 border-[#171717]/10 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask doubts, share code insights or tips..."
                className="flex-1 px-4 py-2.5 bg-[#F7F1E3] border-2 border-[#171717] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#244B3A]"
              />
              <Button type="submit" variant="primary" size="md" icon={<Send size={14} />}>
                Send
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: 25-MIN ACTIVE FOCUS POMODORO ROOM */}
      {activeTab === 'pomodoro' && (
        <div className="bg-[#FAF6EE] p-6 sm:p-8 rounded-3xl border-2.5 border-[#171717] shadow-[5px_5px_0px_#171717] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Pomodoro Clock & Controls */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-[#244B3A] text-[#FAF6EE] rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] space-y-5">
            <div className="flex items-center gap-2">
              <Badge variant={pomoMode === 'focus' ? 'coral' : 'peach'} size="sm">
                {pomoMode === 'focus' ? '🔥 25-MIN DEEP WORK FOCUS' : '☕ 5-MIN RECOVERY BREAK'}
              </Badge>
            </div>

            {/* Giant Clock Display */}
            <div className="text-6xl sm:text-7xl font-display font-black tracking-tight text-[#E4A93A] drop-shadow-[2px_2px_0px_#171717]">
              {formatPomoTime(pomodoroSeconds)}
            </div>

            {/* Play/Pause Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant={isPomoRunning ? 'secondary' : 'primary'}
                size="lg"
                icon={isPomoRunning ? <Pause size={18} /> : <Play size={18} />}
                onClick={() => setIsPomoRunning(!isPomoRunning)}
              >
                {isPomoRunning ? 'Pause Session' : 'Start Focus Session'}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon={<RotateCcw size={16} />}
                onClick={() => {
                  setIsPomoRunning(false);
                  setPomodoroSeconds(pomoMode === 'focus' ? 25 * 60 : 5 * 60);
                }}
              >
                Reset
              </Button>
            </div>

            {/* Ambient Sound Selector */}
            <div className="w-full pt-3 border-t border-[#FAF6EE]/20 flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5"><Radio size={13} /> Ambient Sound:</span>
              <div className="flex gap-1">
                {(['cafe', 'rain', 'whitenoise', 'off'] as const).map((snd) => (
                  <button
                    key={snd}
                    onClick={() => setAmbientSound(snd)}
                    className={clsx(
                      'px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all',
                      ambientSound === snd ? 'bg-[#E4A93A] text-[#171717]' : 'bg-[#1A362A] text-[#FAF6EE]/70 hover:text-white'
                    )}
                  >
                    {snd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Peers Studying in the Room */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <span className="text-xs font-display font-black text-[#244B3A] uppercase tracking-wider flex items-center gap-1.5">
                <Users size={14} /> ACTIVE FOCUS ROOM PEERS ({activeSquad.activeNowCount})
              </span>
              <h3 className="font-display font-black text-2xl text-[#171717] mt-1">
                You are not coding alone.
              </h3>
              <p className="text-xs sm:text-sm text-[#575757] font-semibold mt-0.5">
                Peers from NITs, IIITs, and state engineering colleges studying in this exact Pomodoro block.
              </p>
            </div>

            {/* Peer Avatars Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {activeSquad.members.map((m) => (
                <div
                  key={m.id}
                  className="p-3 bg-[#F7F1E3] rounded-2xl border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center gap-2.5"
                >
                  <div className="relative">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-9 h-9 rounded-xl object-cover border-2 border-[#171717]"
                    />
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border border-black animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#171717] block truncate">
                      {m.name}
                    </span>
                    <span className="text-[10px] font-semibold text-[#575757] block truncate">
                      {m.college.split(',')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-[#F2C6A8]/40 rounded-2xl border-2 border-[#171717] text-xs font-bold text-[#171717]">
              💡 Complete a 25-minute Pomodoro session to automatically earn <span className="text-[#E9785A]">+50 XP</span> and contribute to your squad's weekly streak!
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: SQUAD LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="bg-[#FAF6EE] p-6 sm:p-8 rounded-3xl border-2.5 border-[#171717] shadow-[5px_5px_0px_#171717] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#171717]/10">
            <div>
              <h3 className="font-display font-black text-xl text-[#171717]">
                Weekly Cohort XP Leaderboard
              </h3>
              <p className="text-xs font-semibold text-[#575757]">
                Top performers in #{activeSquad.tag} this week. Resets Sunday 11:59 PM.
              </p>
            </div>
            <span className="text-xs font-display font-black text-[#244B3A] bg-[#244B3A]/10 px-3 py-1 rounded-full">
              🏆 Top 3 earn SUTRA Titan Badges
            </span>
          </div>

          <div className="space-y-2.5">
            {activeSquad.members
              .slice()
              .sort((a, b) => b.xpThisWeek - a.xpThisWeek)
              .map((member, rank) => {
                const isTop3 = rank < 3;
                return (
                  <div
                    key={member.id}
                    className={clsx(
                      'p-4 rounded-2xl border-2 flex items-center justify-between shadow-[2px_2px_0px_#171717]',
                      rank === 0
                        ? 'bg-[#E4A93A]/25 border-[#171717]'
                        : isTop3
                        ? 'bg-[#FAF6EE] border-[#171717]'
                        : 'bg-[#F7F1E3] border-[#171717]/40'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-display font-black text-base w-6 text-center text-[#171717]">
                        {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `#${rank + 1}`}
                      </span>
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-xl object-cover border-2 border-[#171717]"
                      />
                      <div>
                        <span className="font-display font-bold text-sm text-[#171717]">
                          {member.name}
                        </span>
                        <p className="text-[11px] font-semibold text-[#575757]">
                          {member.college} • {member.role}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-display font-black text-sm sm:text-base text-[#E9785A]">
                        {member.xpThisWeek} XP
                      </span>
                      <span className="text-[10px] text-[#575757] font-bold block">this week</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

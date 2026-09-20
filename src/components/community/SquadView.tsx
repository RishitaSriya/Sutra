import React, { useState } from 'react';
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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { clsx } from 'clsx';

export const SquadView: React.FC = () => {
  const { squad, sendSquadMessage, user } = useApp();
  const [inputMsg, setInputMsg] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    sendSquadMessage(inputMsg);
    setInputMsg('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Squad Banner */}
      <div className="bg-[#FAF6EE] p-6 sm:p-8 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="forest" size="sm" icon={<Users size={12} />}>
              YOUR SQUAD #{squad.tag}
            </Badge>
            <span className="text-xs font-bold text-[#E9785A] flex items-center gap-1">
              <Flame size={14} className="fill-[#E9785A]" /> {squad.squadStreak}-Day Squad Streak
            </span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#171717]">
            {squad.name}
          </h2>
          <p className="text-xs sm:text-sm text-[#575757] font-semibold mt-0.5 max-w-xl">
            {squad.slogan}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#F7F1E3] p-3 rounded-2xl border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
          <div className="text-center px-2">
            <span className="text-xl font-display font-black text-[#171717] block">
              {squad.memberCount}/{squad.maxMembers}
            </span>
            <span className="text-[10px] font-bold text-[#575757] uppercase">Members</span>
          </div>
          <div className="w-px h-8 bg-[#171717]/20" />
          <div className="text-center px-2">
            <span className="text-xl font-display font-black text-[#244B3A] block">
              {squad.activeNowCount}
            </span>
            <span className="text-[10px] font-bold text-[#575757] uppercase">Online</span>
          </div>
        </div>
      </div>

      {/* Weekly Squad Goal Progress Card */}
      <div className="bg-[#244B3A] text-[#FAF6EE] p-6 sm:p-7 rounded-3xl border-2.5 border-[#171717] shadow-[5px_5px_0px_#171717] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-display font-black bg-[#E4A93A] text-[#171717] px-3 py-1 rounded-full uppercase tracking-wider">
            🎯 WEEKLY SQUAD QUEST
          </span>
          <span className="text-xs font-display font-bold text-[#E4A93A]">
            Deadline: {squad.goal.deadline}
          </span>
        </div>

        <div>
          <h3 className="font-display font-black text-xl sm:text-2xl text-[#FAF6EE]">
            {squad.goal.title}
          </h3>
          <p className="text-xs text-[#FAF6EE]/80 mt-0.5">
            Target: {squad.goal.targetLevel} • Reward: +300 Squad XP Boost
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-display font-bold text-[#FAF6EE]/90">
            <span>SQUAD COHORT PROGRESS</span>
            <span>{squad.goal.progressPercent}%</span>
          </div>
          <div className="w-full bg-[#1A362A] h-3.5 rounded-full overflow-hidden border border-[#FAF6EE]/25">
            <div
              className="bg-[#E4A93A] h-full rounded-full transition-all duration-500 shadow-inner"
              style={{ width: `${squad.goal.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Squad Grid: Active Members (Left) & Live Squad Chat (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Members List */}
        <div className="lg:col-span-5 bg-[#FAF6EE] p-5 sm:p-6 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#171717]/10">
            <span className="text-xs font-display font-black uppercase tracking-wider text-[#575757]">
              SQUAD MATES ({squad.members.length})
            </span>
            <span className="text-xs font-bold text-[#244B3A]">Tier-2/3/4 Peers</span>
          </div>

          <div className="space-y-3">
            {squad.members.map((member) => (
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
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-bold text-sm text-[#171717]">
                        {member.name}
                      </span>
                    </div>
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

        {/* Live Squad Activity & Chat Stream */}
        <div className="lg:col-span-7 bg-[#FAF6EE] p-5 sm:p-6 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] flex flex-col justify-between h-[520px]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#171717]/10">
              <span className="text-xs font-display font-black uppercase tracking-wider text-[#575757] flex items-center gap-1.5">
                <MessageSquare size={14} /> SQUAD DISCUSSIONS & CELEBRATIONS
              </span>
              <span className="text-xs font-bold text-[#6F8F72]">Live sync active</span>
            </div>

            {/* Chat Messages */}
            <div className="space-y-3.5 overflow-y-auto max-h-[340px] pr-1">
              {squad.messages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-2xl bg-[#F7F1E3] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-6 h-6 rounded-lg object-cover border border-[#171717]"
                      />
                      <span className="font-display font-bold text-xs text-[#171717]">
                        {msg.senderName}
                      </span>
                      <span className="text-[10px] text-[#575757]">
                        ({msg.senderCollege})
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#575757]">
                      {msg.timestamp}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-[#171717] pl-8">
                    {msg.text}
                  </p>

                  {msg.reactions && (
                    <div className="flex items-center gap-1.5 pl-8 pt-1">
                      {msg.reactions.map((r, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-[#FAF6EE] text-[11px] font-bold border border-[#171717] flex items-center gap-1"
                        >
                          <span>{r.emoji}</span>
                          <span>{r.count}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Composer */}
          <form onSubmit={handleSend} className="flex items-center gap-2 pt-3 border-t-2 border-[#171717]/10">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask squad mates, share a breakthrough or drop a tip..."
              className="flex-1 bg-[#F7F1E3] border-2 border-[#171717] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium focus:outline-none focus:bg-white"
            />
            <Button variant="primary" size="md" icon={<Send size={15} />}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

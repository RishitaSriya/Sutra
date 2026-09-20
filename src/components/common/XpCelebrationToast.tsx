import React from 'react';
import { Sparkles, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const XpCelebrationToast: React.FC = () => {
  const { recentXpGained } = useApp();

  if (!recentXpGained) return null;

  return (
    <div className="fixed bottom-20 right-6 sm:bottom-8 sm:right-8 z-50 flex items-center gap-3 px-5 py-3 bg-[#E4A93A] text-[#171717] border-2.5 border-[#171717] rounded-2xl shadow-[5px_5px_0px_#171717] animate-in slide-in-from-bottom duration-200">
      <div className="w-9 h-9 rounded-xl bg-[#171717] text-[#E4A93A] flex items-center justify-center font-bold">
        <Flame size={20} className="text-[#E9785A] animate-pulse" />
      </div>
      <div>
        <div className="font-display font-black text-lg leading-tight flex items-center gap-1.5">
          +{recentXpGained.amount} XP EARNED! <Sparkles size={16} className="text-[#244B3A]" />
        </div>
        <div className="text-xs font-semibold text-[#171717]/80">
          {recentXpGained.reason}
        </div>
      </div>
    </div>
  );
};

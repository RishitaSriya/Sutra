import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIThinkingBanner: React.FC = () => {
  const { aiStatus } = useApp();

  if (!aiStatus) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-2.5 bg-[#171717] text-[#FAF6EE] border-2 border-[#E4A93A] rounded-full shadow-[4px_4px_0px_#E4A93A] animate-bounce">
      <Sparkles size={18} className="text-[#E4A93A] animate-spin" />
      <span className="text-xs sm:text-sm font-display font-semibold tracking-wide">
        {aiStatus}
      </span>
      <Loader2 size={14} className="animate-spin text-[#E4A93A]" />
    </div>
  );
};

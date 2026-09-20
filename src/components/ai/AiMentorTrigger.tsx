import React, { useState } from 'react';
import { Sparkles, Bot } from 'lucide-react';
import { AiMentorModal } from './AiMentorModal';
import { useApp } from '../../context/AppContext';

export const AiMentorTrigger: React.FC = () => {
  const { isAuthenticated, user } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) return null;

  const roleName = user.learningProfile?.careerPath || (user.trackType === 'exam' ? 'GATE CSE' : 'Web Dev');

  return (
    <>
      {/* Floating Action Button in bottom-right */}
      <div className="fixed bottom-20 sm:bottom-6 right-5 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#244B3A] text-[#FAF6EE] border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] hover:shadow-[2px_2px_0px_#171717] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer select-none"
        >
          <div className="relative">
            <Sparkles size={18} className="text-[#F39C12] animate-bounce" />
          </div>
          <span className="font-display font-black text-xs uppercase tracking-wider hidden sm:inline">
            Ask AI Mentor
          </span>
          <span className="font-display font-black text-xs uppercase tracking-wider sm:hidden">
            AI Mentor
          </span>
        </button>
      </div>

      {/* Modal */}
      <AiMentorModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

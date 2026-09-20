import React, { useState } from 'react';
import {
  Compass,
  Map,
  CheckSquare,
  Users,
  User,
  MoreHorizontal,
  Layers,
  FileText,
  Swords,
  Sparkles,
  Briefcase,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ViewMode } from '../../types';
import { clsx } from 'clsx';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setView, setIsOnboardingOpen } = useApp();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const primaryTabs: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Compass size={20} strokeWidth={2.4} /> },
    { id: 'learn', label: 'Learn', icon: <Map size={20} strokeWidth={2.4} /> },
    { id: 'missions', label: 'Missions', icon: <CheckSquare size={20} strokeWidth={2.4} /> },
    { id: 'squad', label: 'Squad', icon: <Users size={20} strokeWidth={2.4} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} strokeWidth={2.4} /> },
  ];

  const secondaryTabs: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'flashcards', label: 'Flashcards', icon: <Layers size={18} />, badge: '12 Cards' },
    { id: 'notes', label: '60s Short Notes', icon: <FileText size={18} /> },
    { id: 'challenges', label: 'Weekly Boss', icon: <Swords size={18} />, badge: 'Boss Battle' },
    { id: 'memes', label: 'Tech Meme Feed', icon: <Sparkles size={18} />, badge: '😂 Memes' },
    { id: 'opportunities', label: 'Opportunities', icon: <Briefcase size={18} />, badge: '92% Match' },
  ];

  const handleTabClick = (viewId: ViewMode) => {
    setView(viewId);
    setIsMoreOpen(false);
  };

  return (
    <>
      {/* Secondary Drawer on Mobile */}
      {isMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-[#171717]/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
          <div
            className="flex-1"
            onClick={() => setIsMoreOpen(false)}
            aria-hidden="true"
          />
          <div className="bg-[#FAF6EE] border-t-2.5 border-[#171717] rounded-t-3xl p-5 shadow-[0px_-6px_0px_#171717] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#171717]/15">
              <span className="font-display font-black text-lg text-[#171717]">
                More Features
              </span>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1.5 rounded-lg bg-[#F7F1E3] border border-[#171717]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {secondaryTabs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={clsx(
                    'flex flex-col items-start p-3 rounded-2xl border-2 font-display text-xs font-bold text-left transition-all',
                    currentView === item.id
                      ? 'bg-[#244B3A] text-[#F7F1E3] border-[#171717] shadow-[2.5px_2.5px_0px_#171717]'
                      : 'bg-[#F7F1E3] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#ECE4D0]'
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span>{item.icon}</span>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#E4A93A] text-[#171717] border border-[#171717]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setIsMoreOpen(false);
                setIsOnboardingOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#E4A93A] text-[#171717] font-display font-bold text-xs uppercase tracking-wider rounded-xl border-2 border-[#171717] shadow-[2px_2px_0px_#171717]"
            >
              <SlidersHorizontal size={14} /> Customize Goals & Persona
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FAF6EE] border-t-2.5 border-[#171717] px-2 py-1.5 shadow-[0px_-3px_0px_#171717]">
        <div className="flex items-center justify-around">
          {primaryTabs.map((tab) => {
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={clsx(
                  'flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer select-none',
                  isActive
                    ? 'text-[#244B3A] font-black'
                    : 'text-[#575757] hover:text-[#171717] font-bold'
                )}
              >
                <div
                  className={clsx(
                    'p-1 rounded-lg transition-all',
                    isActive && 'bg-[#244B3A] text-[#F7F1E3] shadow-[1.5px_1.5px_0px_#171717]'
                  )}
                >
                  {tab.icon}
                </div>
                <span className="text-[10px] font-display mt-0.5 tracking-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* More Toggle */}
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={clsx(
              'flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer select-none',
              isMoreOpen ? 'text-[#E9785A] font-black' : 'text-[#575757] font-bold'
            )}
          >
            <div className="p-1 rounded-lg">
              <MoreHorizontal size={20} strokeWidth={2.4} />
            </div>
            <span className="text-[10px] font-display mt-0.5 tracking-tight">
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

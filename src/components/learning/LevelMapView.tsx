import React, { useState } from 'react';
import {
  Map,
  CheckCircle2,
  Lock,
  Play,
  Sparkles,
  ArrowRight,
  Clock,
  Zap,
  Target,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { LevelNode } from '../../types';
import { clsx } from 'clsx';

export const LevelMapView: React.FC = () => {
  const { paths, currentPath, setCurrentPathId, startStoryLesson, setView } = useApp();
  const [selectedLevel, setSelectedLevel] = useState<LevelNode>(
    currentPath.levels.find((l) => l.status === 'current') || currentPath.levels[0]
  );

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Path Header & Path Switcher */}
      <div className="bg-[#FAF6EE] p-5 sm:p-7 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl">{currentPath.icon}</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#171717]">
              {currentPath.title} Journey
            </h2>
            <Badge variant="forest" size="sm">
              {currentPath.totalLevels} LEVELS
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#575757] font-semibold max-w-xl">
            {currentPath.description}
          </p>
        </div>

        {/* Path Picker Tabs */}
        <div className="flex items-center gap-2 self-start md:self-auto overflow-x-auto p-1 bg-[#F7F1E3] rounded-2xl border-2 border-[#171717]">
          {paths.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setCurrentPathId(p.id);
                setSelectedLevel(p.levels.find((l) => l.status === 'current') || p.levels[0]);
              }}
              className={clsx(
                'px-3 py-1.5 rounded-xl font-display font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer select-none',
                p.id === currentPath.id
                  ? 'bg-[#244B3A] text-[#F7F1E3] shadow-[1.5px_1.5px_0px_#171717]'
                  : 'text-[#575757] hover:text-[#171717]'
              )}
            >
              <span>{p.icon}</span>
              <span>{p.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: Level Progression Map (Left) & Level Mission Detail Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Level Progression Visual Map */}
        <div className="lg:col-span-7 bg-[#FAF6EE] p-6 sm:p-8 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] space-y-6">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#171717]/10">
            <span className="font-display font-black text-sm uppercase tracking-wider text-[#575757]">
              MISSION PROGRESSION MAP
            </span>
            <span className="text-xs font-bold text-[#244B3A]">
              Click any node to inspect mission
            </span>
          </div>

          {/* Stepping Path Nodes */}
          <div className="relative space-y-4">
            {currentPath.levels.map((lvl, index) => {
              const isSelected = selectedLevel.id === lvl.id;
              const isMastered = lvl.status === 'mastered';
              const isCurrent = lvl.status === 'current';
              const isLocked = lvl.status === 'locked';

              return (
                <div key={lvl.id} className="relative">
                  {/* Connector Line */}
                  {index < currentPath.levels.length - 1 && (
                    <div
                      className={clsx(
                        'absolute left-6 top-12 bottom-[-16px] w-1 z-0 transition-colors',
                        isMastered ? 'bg-[#244B3A]' : 'bg-[#171717]/20'
                      )}
                    />
                  )}

                  <div
                    onClick={() => setSelectedLevel(lvl)}
                    className={clsx(
                      'relative z-10 p-4 sm:p-5 rounded-2xl border-2.5 transition-all cursor-pointer flex items-center justify-between gap-4 select-none',
                      isSelected
                        ? 'border-[#171717] shadow-[4px_4px_0px_#171717] -translate-y-0.5'
                        : 'border-[#171717]/50 shadow-[2px_2px_0px_#171717] hover:border-[#171717]',
                      isCurrent
                        ? 'bg-[#E4A93A]'
                        : isMastered
                        ? 'bg-[#244B3A] text-[#F7F1E3]'
                        : 'bg-[#F7F1E3] text-[#575757]'
                    )}
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4">
                      {/* Node Icon Avatar */}
                      <div
                        className={clsx(
                          'w-11 h-11 rounded-xl border-2 border-[#171717] flex items-center justify-center font-display font-black text-base shadow-[1.5px_1.5px_0px_#171717]',
                          isCurrent
                            ? 'bg-[#171717] text-[#E4A93A] animate-pulse'
                            : isMastered
                            ? 'bg-[#FAF6EE] text-[#244B3A]'
                            : 'bg-[#ECE4D0] text-[#575757]'
                        )}
                      >
                        {isMastered ? (
                          <CheckCircle2 size={20} className="text-[#244B3A]" />
                        ) : isCurrent ? (
                          `0${lvl.levelNumber}`
                        ) : (
                          <Lock size={18} className="text-[#575757]" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={clsx(
                              'text-[10px] font-display font-black uppercase tracking-wider',
                              isMastered
                                ? 'text-[#E4A93A]'
                                : isCurrent
                                ? 'text-[#171717]'
                                : 'text-[#575757]'
                            )}
                          >
                            LEVEL 0{lvl.levelNumber} • {lvl.estimatedTime}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#171717] text-[#FAF6EE] border border-[#171717]">
                              ACTIVE LEVEL
                            </span>
                          )}
                        </div>
                        <h4
                          className={clsx(
                            'font-display font-black text-base sm:text-lg leading-tight',
                            isMastered
                              ? 'text-[#FAF6EE]'
                              : isCurrent
                              ? 'text-[#171717]'
                              : 'text-[#171717]'
                          )}
                        >
                          {lvl.title}
                        </h4>
                        <p
                          className={clsx(
                            'text-xs mt-0.5 line-clamp-1',
                            isMastered
                              ? 'text-[#FAF6EE]/80'
                              : isCurrent
                              ? 'text-[#171717]/85'
                              : 'text-[#575757]'
                          )}
                        >
                          {lvl.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={clsx(
                          'text-xs font-display font-black flex items-center gap-1',
                          isMastered ? 'text-[#E4A93A]' : isCurrent ? 'text-[#171717]' : 'text-[#575757]'
                        )}
                      >
                        <Zap size={14} /> +{lvl.xpReward} XP
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level Inspector Panel (Right) */}
        <div className="lg:col-span-5 sticky top-24 bg-[#FAF6EE] p-6 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#171717]/10">
            <Badge
              variant={
                selectedLevel.status === 'mastered'
                  ? 'forest'
                  : selectedLevel.status === 'current'
                  ? 'marigold'
                  : 'paper'
              }
              size="sm"
            >
              LEVEL 0{selectedLevel.levelNumber} INSPECTOR
            </Badge>
            <span className="text-xs font-bold text-[#575757]">
              {selectedLevel.estimatedTime}
            </span>
          </div>

          <div>
            <h3 className="font-display font-black text-2xl text-[#171717]">
              {selectedLevel.title}
            </h3>
            <p className="text-xs font-bold text-[#244B3A] mt-0.5">
              {selectedLevel.subtitle}
            </p>
          </div>

          {/* Story Snippet Box */}
          <div className="bg-[#F7F1E3] p-4 rounded-2xl border-2 border-[#171717] shadow-[2px_2px_0px_#171717] space-y-2">
            <span className="text-[10px] font-display font-black text-[#E9785A] uppercase tracking-wider flex items-center gap-1">
              🎬 Narrative Scenario
            </span>
            <p className="text-xs text-[#171717] font-medium leading-relaxed italic">
              “{selectedLevel.storySnippet}”
            </p>
          </div>

          {/* Skills & Tags */}
          <div>
            <span className="text-xs font-display font-bold text-[#575757] uppercase tracking-wider block mb-2">
              Key Concepts & Skills:
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedLevel.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-[#FAF6EE] text-[#171717] rounded-lg border-1.5 border-[#171717] text-xs font-bold font-display shadow-[1px_1px_0px_#171717]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            {selectedLevel.status === 'locked' ? (
              <div className="p-3 bg-[#ECE4D0] rounded-2xl border-2 border-[#171717] text-center space-y-1">
                <p className="text-xs font-bold text-[#171717] flex items-center justify-center gap-1.5">
                  <Lock size={14} /> Level Locked
                </p>
                <p className="text-[11px] text-[#575757]">
                  Complete Level 0{selectedLevel.levelNumber - 1} missions to unlock this story chapter.
                </p>
              </div>
            ) : (
              <Button
                variant={selectedLevel.status === 'current' ? 'primary' : 'forest'}
                size="lg"
                className="w-full"
                icon={<Play size={18} fill="currentColor" />}
                iconPosition="left"
                onClick={() => startStoryLesson()}
              >
                {selectedLevel.status === 'mastered'
                  ? 'Replay Story Lesson ↺'
                  : 'Enter Story Mission →'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

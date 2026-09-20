import React from 'react';
import {
  Clock,
  Zap,
  CheckCircle2,
  Circle,
  Play,
  Filter,
  Sparkles,
  ArrowRight,
  Flame,
  CheckSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { clsx } from 'clsx';

export const DailyMissionsView: React.FC = () => {
  const {
    missions,
    toggleMissionTask,
    startStoryLesson,
    selectedTimeFilter,
    setSelectedTimeFilter,
    user,
  } = useApp();

  const filteredMissions =
    selectedTimeFilter === 'all'
      ? missions
      : missions.filter((m) => m.durationCategory === selectedTimeFilter);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Top Banner: Productivity Matrix Header */}
      <div className="bg-[#FAF6EE] p-6 sm:p-8 rounded-3xl border-2.5 border-[#171717] shadow-[4px_4px_0px_#171717] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="marigold" size="sm" icon={<Clock size={12} />}>
              TODAY’S PRODUCTIVITY ENGINE
            </Badge>
            <span className="text-xs font-bold text-[#244B3A]">
              {user.dailyTimeMinutes} MIN COMMITTED
            </span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#171717]">
            Choose Missions Based on Your Free Time
          </h2>
          <p className="text-xs sm:text-sm text-[#575757] font-semibold mt-1 max-w-xl">
            15 minutes between college lectures? Do Quick Recall. 30 minutes in the library? Conquer the Main Mission.
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-2 p-1.5 bg-[#F7F1E3] rounded-2xl border-2 border-[#171717] shadow-[2px_2px_0px_#171717] self-start md:self-auto overflow-x-auto">
          {(['all', '15m', '30m', '45m', '60m'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTimeFilter(t)}
              className={clsx(
                'px-3 py-1.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer select-none',
                selectedTimeFilter === t
                  ? 'bg-[#244B3A] text-[#F7F1E3] shadow-[1.5px_1.5px_0px_#171717]'
                  : 'text-[#575757] hover:text-[#171717]'
              )}
            >
              {t === 'all' ? 'All Missions' : `${t} Free`}
            </button>
          ))}
        </div>
      </div>

      {/* Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMissions.map((mission) => {
          const completedCount = mission.tasks.filter((t) => t.completed).length;
          const totalTasks = mission.tasks.length;
          const isDone = completedCount === totalTasks;

          return (
            <div
              key={mission.id}
              className={clsx(
                'p-6 rounded-3xl border-2.5 transition-all flex flex-col justify-between select-none',
                isDone
                  ? 'bg-[#6F8F72]/15 border-[#244B3A] shadow-[3px_3px_0px_#244B3A]'
                  : mission.category === 'main'
                  ? 'bg-[#FAF6EE] border-[#171717] shadow-[5px_5px_0px_#171717]'
                  : 'bg-[#FAF6EE] border-[#171717] shadow-[4px_4px_0px_#171717]'
              )}
            >
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        mission.category === 'main'
                          ? 'marigold'
                          : mission.category === 'recall'
                          ? 'peach'
                          : mission.category === 'practice'
                          ? 'forest'
                          : 'coral'
                      }
                      size="sm"
                    >
                      {mission.category.toUpperCase()} MISSION
                    </Badge>
                    <span className="text-xs font-bold text-[#575757] flex items-center gap-1">
                      <Clock size={12} /> {mission.timeEstimate}
                    </span>
                  </div>

                  <span className="text-xs font-display font-black text-[#E9785A] flex items-center gap-1">
                    <Zap size={14} /> +{mission.xpReward} XP
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-black text-xl text-[#171717] leading-snug">
                    {mission.title}
                  </h3>
                  {mission.subtitle && (
                    <p className="text-xs text-[#575757] font-semibold mt-0.5">
                      {mission.subtitle}
                    </p>
                  )}
                </div>

                {/* Task Checklist */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-display font-bold text-[#575757]">
                    <span>TASKS ({completedCount}/{totalTasks})</span>
                    <span>{Math.round((completedCount / totalTasks) * 100)}%</span>
                  </div>

                  <div className="space-y-1.5">
                    {mission.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleMissionTask(mission.id, task.id)}
                        className={clsx(
                          'flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none text-xs font-display font-bold',
                          task.completed
                            ? 'bg-[#244B3A] text-[#F7F1E3] border-[#171717] line-through opacity-85'
                            : 'bg-[#F7F1E3] text-[#171717] border-[#171717]/40 hover:border-[#171717]'
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {task.completed ? (
                            <CheckCircle2 size={15} className="text-[#E4A93A] shrink-0" />
                          ) : (
                            <Circle size={15} className="text-[#575757] shrink-0" />
                          )}
                          <span className="truncate">{task.text}</span>
                        </div>
                        <span className="text-[10px] font-black shrink-0 text-[#E4A93A]">
                          +{task.xp} XP
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {mission.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[#F7F1E3] border border-[#171717]/30 font-bold text-[#575757]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4 border-t-2 border-[#171717]/10">
                {isDone ? (
                  <div className="flex items-center justify-center gap-2 py-2 text-xs font-display font-black text-[#244B3A]">
                    <CheckCircle2 size={16} /> MISSION COMPLETED!
                  </div>
                ) : (
                  <Button
                    variant={mission.category === 'main' ? 'primary' : 'forest'}
                    size="md"
                    className="w-full"
                    icon={<Play size={15} fill="currentColor" />}
                    onClick={() => startStoryLesson()}
                  >
                    Launch Mission →
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

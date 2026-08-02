'use client';

import * as React from 'react';
import { Flame, CheckCircle2, Circle, Trophy, Clock } from 'lucide-react';
import type { DailyCoachStreakData, DailyCoachTaskData } from '../../types/career.types';
import { cn } from '@/lib/utils';

interface DailyCoachWidgetProps {
  streakData: DailyCoachStreakData;
}

export function DailyCoachWidget({ streakData }: DailyCoachWidgetProps) {
  const [tasks, setTasks] = React.useState<DailyCoachTaskData[]>(streakData.dailyTasks);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalXpEarned = tasks.filter((t) => t.isCompleted).reduce((acc, t) => acc + t.xpReward, 0);

  return (
    <div
      id="daily-coach-widget-container"
      className="space-y-4 rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-950/20 to-black/40 p-5 shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-orange-500/20 pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/20 text-orange-400">
            <Flame className="h-5 w-5 animate-pulse fill-orange-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Daily AI Career Coach</h3>
            <p className="text-xs text-gray-300">
              5 daily micro-challenges tailored to keep your streak active.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs font-black text-orange-300">
            <Flame className="h-4 w-4 fill-orange-400 text-orange-400" />
            <span>{streakData.currentStreak} Day Streak!</span>
          </div>

          <div className="flex items-center space-x-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-300">
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span>+{totalXpEarned} XP</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-300">
          <span>
            Daily Goals Completed ({completedCount} / {tasks.length})
          </span>
          <span className="font-bold text-orange-300">
            {Math.round((completedCount / tasks.length) * 100)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all"
            style={{ width: `${(completedCount / tasks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2 pt-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={cn(
              'flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs transition-all',
              task.isCompleted
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-[var(--text-primary)] hover:border-orange-500/30'
            )}
          >
            <div className="flex items-center space-x-3">
              {task.isCompleted ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-gray-400" />
              )}
              <span
                className={cn('font-semibold', task.isCompleted && 'text-gray-400 line-through')}
              >
                {task.title}
              </span>
            </div>

            <div className="flex shrink-0 items-center space-x-2">
              <span className="flex items-center space-x-1 text-[10px] text-gray-400">
                <Clock className="h-3 w-3 text-orange-400" />
                <span>{task.estimatedMinutes}m</span>
              </span>
              <span className="rounded border border-amber-500/30 bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                +{task.xpReward} XP
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

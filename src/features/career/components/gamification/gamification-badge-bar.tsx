'use client';

import * as React from 'react';
import { Award, Zap } from 'lucide-react';
import type { GamificationData } from '../../types/career.types';

interface GamificationBadgeBarProps {
  data: GamificationData;
}

export function GamificationBadgeBar({ data }: GamificationBadgeBarProps) {
  const currentMilestone =
    data.milestones.find((m) => !m.isReached) || data.milestones[data.milestones.length - 1];
  const nextTargetXp = currentMilestone ? currentMilestone.targetXp : 1000;
  const progressPct = Math.min(100, Math.round((data.currentXp / nextTargetXp) * 100));

  return (
    <div
      id="gamification-badge-bar-container"
      className="space-y-4 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/30 via-slate-900 to-black/40 p-5 shadow-sm"
    >
      <div className="flex flex-col items-start justify-between space-y-2 border-b border-purple-500/20 pb-3 sm:flex-row sm:items-center sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-lg font-black text-white shadow-md">
            L{data.currentLevel}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Level {data.currentLevel} Candidate Specialist
            </h3>
            <p className="text-xs text-purple-200">
              Earn XP by completing daily coaching tasks, mock interviews, and system design
              exercises.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-black text-amber-300">
            <Zap className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>
              {data.currentXp} / {nextTargetXp} XP
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-purple-200">
          <span>Next Tier Progress</span>
          <span className="font-bold">{progressPct}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Unlocked Badges */}
      <div className="pt-2">
        <span className="mb-2 block text-xs font-bold tracking-wider text-gray-300 uppercase">
          Unlocked Mastery Badges
        </span>
        <div className="flex flex-wrap gap-2">
          {data.unlockedBadges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-center space-x-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-xs font-bold text-purple-200"
            >
              <Award className="h-4 w-4 text-amber-400" />
              <div>
                <span className="block font-bold text-white">{badge.title}</span>
                <span className="text-[10px] font-normal text-purple-300">{badge.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

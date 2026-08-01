'use client';

import * as React from 'react';
import { Target, TrendingUp, Sparkles } from 'lucide-react';
import type { HiringRecommendationType } from '../types/evaluation.types';

interface HiringReadinessTrendProps {
  trend: {
    currentStatus: HiringRecommendationType;
    readyPercentage: number;
    improvementRate: number;
  };
}

export function HiringReadinessTrend({ trend }: HiringReadinessTrendProps) {
  return (
    <div
      id="hiring-readiness-trend-card"
      className="space-y-4 rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 to-indigo-950/40 p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Target Hiring Readiness Index</h3>
        </div>
        <span className="rounded-full border border-purple-500/30 bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300">
          Status: {trend.currentStatus}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-3xl font-black text-purple-300">{trend.readyPercentage}%</span>
          <span className="block text-[11px] text-gray-300">Overall Hiring Readiness Index</span>
        </div>

        <div className="flex items-center space-x-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
          <TrendingUp className="h-4 w-4" />
          <span>+{trend.improvementRate}% Growth Rate</span>
        </div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700/40">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-400 to-emerald-400 transition-all duration-700"
          style={{ width: `${trend.readyPercentage}%` }}
        />
      </div>

      <p className="text-xs text-gray-300">
        <Sparkles className="mr-1 inline-block h-3.5 w-3.5 text-purple-400" />
        You are currently performing within the top tier bar for your targeted role level.
      </p>
    </div>
  );
}

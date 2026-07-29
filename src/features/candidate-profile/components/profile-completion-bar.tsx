'use client';

import * as React from 'react';
import { Award, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileCompletionBarProps {
  percentage: number;
  className?: string;
}

export function ProfileCompletionBar({ percentage, className }: ProfileCompletionBarProps) {
  const getBadgeInfo = (score: number) => {
    if (score >= 90) {
      return {
        label: 'All-Star Profile',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      };
    }
    if (score >= 65) {
      return {
        label: 'Advanced Profile',
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      };
    }
    if (score >= 35) {
      return {
        label: 'Intermediate Profile',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      };
    }
    return { label: 'Starter Profile', color: 'text-zinc-400 bg-zinc-800 border-zinc-700' };
  };

  const badge = getBadgeInfo(percentage);

  return (
    <div
      className={cn(
        'space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            {percentage >= 90 ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : percentage >= 50 ? (
              <Sparkles className="h-4 w-4 text-blue-400" />
            ) : (
              <TrendingUp className="h-4 w-4 text-amber-400" />
            )}
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[var(--text-primary)]">Profile Strength</h4>
            <p className="text-[11px] text-[var(--text-secondary)]">
              {percentage >= 90
                ? 'Your profile is fully optimized for AI interviews!'
                : 'Complete all steps to stand out to mock interviewers.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
              badge.color
            )}
          >
            <Award className="mr-1 h-3 w-3" />
            {badge.label}
          </span>
          <span className="text-sm font-bold text-[var(--text-primary)]">{percentage}%</span>
        </div>
      </div>

      <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            percentage >= 90
              ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400'
              : percentage >= 50
                ? 'bg-gradient-to-r from-blue-600 to-cyan-400'
                : 'bg-gradient-to-r from-amber-500 to-yellow-400'
          )}
          style={{ width: `${Math.max(percentage, 5)}%` }}
        />
      </div>
    </div>
  );
}

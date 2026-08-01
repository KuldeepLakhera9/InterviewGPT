'use client';

import * as React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface WeakStrongTopicsCardProps {
  weakTopics: { topic: string; occurrenceCount: number; averageDeficitScore: number }[];
  strongTopics: { topic: string; occurrenceCount: number; averageMasteryScore: number }[];
}

export function WeakStrongTopicsCard({ weakTopics, strongTopics }: WeakStrongTopicsCardProps) {
  return (
    <div id="weak-strong-topics-card" className="grid gap-4 sm:grid-cols-2">
      {/* Strong Topics */}
      <div className="space-y-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
          <ShieldCheck className="h-4 w-4" />
          <span>Top Demonstrated Mastered Topics</span>
        </div>
        <div className="space-y-2">
          {strongTopics.map((item) => (
            <div
              key={item.topic}
              className="flex items-center justify-between rounded-lg bg-[var(--bg-surface-1)] p-2.5 text-xs"
            >
              <div>
                <span className="font-semibold text-[var(--text-primary)]">{item.topic}</span>
                <span className="block text-[10px] text-[var(--text-tertiary)]">
                  Seen in {item.occurrenceCount} sessions
                </span>
              </div>
              <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400">
                {item.averageMasteryScore}% Mastery
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weak Topics */}
      <div className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
          <AlertTriangle className="h-4 w-4" />
          <span>Frequently Missed Topics (Remediation Needed)</span>
        </div>
        <div className="space-y-2">
          {weakTopics.map((item) => (
            <div
              key={item.topic}
              className="flex items-center justify-between rounded-lg bg-[var(--bg-surface-1)] p-2.5 text-xs"
            >
              <div>
                <span className="font-semibold text-[var(--text-primary)]">{item.topic}</span>
                <span className="block text-[10px] text-[var(--text-tertiary)]">
                  Flags in {item.occurrenceCount} sessions
                </span>
              </div>
              <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-400">
                {item.averageDeficitScore}% Score
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

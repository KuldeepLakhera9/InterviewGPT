'use client';

import * as React from 'react';
import { TrendingUp, Award } from 'lucide-react';
import type { ProgressTimelineEvent } from '../types/evaluation.types';

interface ProgressTimelineProps {
  timeline: ProgressTimelineEvent[];
}

export function ProgressTimeline({ timeline }: ProgressTimelineProps) {
  return (
    <div
      id="progress-timeline-container"
      className="space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5"
    >
      <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-primary)]">
        <TrendingUp className="h-4 w-4 text-purple-400" />
        <span>Candidate Practice Progress & Growth Milestones</span>
      </div>

      <div className="relative ml-3 space-y-6 border-l-2 border-purple-500/30 pl-4">
        {timeline.map((event, idx) => (
          <div key={idx} className="relative">
            <span className="absolute top-1 -left-[23px] flex h-3 w-3 items-center justify-center rounded-full bg-purple-500 ring-4 ring-[var(--bg-surface-1)]" />

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-semibold text-[var(--text-tertiary)]">
                  {event.date}
                </span>
                {event.badge && (
                  <span className="rounded border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                    <Award className="mr-1 inline-block h-3 w-3" />
                    {event.badge}
                  </span>
                )}
                {event.scoreChange !== 0 && (
                  <span className="text-[10px] font-bold text-emerald-400">
                    +{event.scoreChange} pts
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-[var(--text-primary)]">{event.title}</h4>
              <p className="text-xs text-[var(--text-secondary)]">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

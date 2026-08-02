'use client';

import * as React from 'react';
import { Activity } from 'lucide-react';
import type { SpeechMetricsData } from '../../types/multimodal.types';

interface SpeechAnalyticsPanelProps {
  metrics: SpeechMetricsData;
}

export function SpeechAnalyticsPanel({ metrics }: SpeechAnalyticsPanelProps) {
  return (
    <div
      id="speech-analytics-panel"
      className="space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm"
    >
      <div className="flex items-center space-x-2">
        <Activity className="h-4 w-4 text-blue-400" />
        <h4 className="text-xs font-bold text-[var(--text-primary)]">Real-Time Speech Analytics</h4>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        {/* Speaking Pace */}
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-2 text-center">
          <span className="block text-[10px] text-[var(--text-tertiary)]">Speaking Pace</span>
          <span className="font-bold text-blue-400">{metrics.speakingPaceWpm} WPM</span>
        </div>

        {/* Avg Response Duration */}
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-2 text-center">
          <span className="block text-[10px] text-[var(--text-tertiary)]">Avg Duration</span>
          <span className="font-bold text-[var(--text-primary)]">
            {metrics.averageResponseDurationSeconds}s
          </span>
        </div>

        {/* Filler Word Density */}
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-2 text-center">
          <span className="block text-[10px] text-[var(--text-tertiary)]">Filler Density</span>
          <span className="font-bold text-purple-400">{metrics.fillerDensityPercentage}%</span>
        </div>

        {/* Long Pauses */}
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-2 text-center">
          <span className="block text-[10px] text-[var(--text-tertiary)]">
            Long Pauses (&gt;3s)
          </span>
          <span className="font-bold text-amber-400">{metrics.longPauseCount}</span>
        </div>
      </div>

      {/* Filler Words Found Pills */}
      {metrics.fillerWordsFound.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-semibold text-[var(--text-tertiary)]">
            Detected Fillers Count:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {metrics.fillerWordsFound.map((f) => (
              <span
                key={f.word}
                className="rounded border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-300"
              >
                &quot;{f.word}&quot;: {f.count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

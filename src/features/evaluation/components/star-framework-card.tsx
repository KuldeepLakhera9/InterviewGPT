'use client';

import * as React from 'react';
import { Target, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import type { StarFrameworkData } from '../types/evaluation.types';

interface StarFrameworkCardProps {
  starData: StarFrameworkData;
}

export function StarFrameworkCard({ starData }: StarFrameworkCardProps) {
  const phases = [
    {
      key: 'Situation',
      data: starData.situation,
      color: 'text-blue-400',
      border: 'border-blue-500/20',
    },
    { key: 'Task', data: starData.task, color: 'text-indigo-400', border: 'border-indigo-500/20' },
    {
      key: 'Action',
      data: starData.action,
      color: 'text-purple-400',
      border: 'border-purple-500/20',
    },
    {
      key: 'Result',
      data: starData.result,
      color: 'text-emerald-400',
      border: 'border-emerald-500/20',
    },
  ];

  return (
    <div
      id="star-framework-card"
      className="space-y-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-purple-400" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            STAR Behavioral Framework Analysis
          </h3>
        </div>
        <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300">
          STAR Score: {starData.overallStarScore} / 100
        </div>
      </div>

      {/* 4 Phases Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {phases.map(({ key, data, color, border }) => (
          <div
            key={key}
            className={`rounded-lg border ${border} flex flex-col justify-between bg-[var(--bg-surface-2)] p-4`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black tracking-wider uppercase ${color}`}>
                  {key}
                </span>
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {data.score}/100
                </span>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                {data.summary}
              </p>
            </div>

            <div className="mt-3 border-t border-[var(--border-subtle)] pt-2">
              {data.isMissing ? (
                <span className="inline-flex items-center text-[11px] font-medium text-amber-400">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Section Missing
                </span>
              ) : (
                <span className="inline-flex items-center text-[11px] font-medium text-emerald-400">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Structure Covered
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Missing Sections Alert */}
      {starData.missingSections.length > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
          <span className="font-bold">Missing STAR Structural Components: </span>
          {starData.missingSections.join(', ')}
        </div>
      )}

      {/* Actionable Suggestions */}
      <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-purple-300">
          <Lightbulb className="h-4 w-4 text-purple-400" />
          <span>STAR Improvement Suggestions:</span>
        </div>
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-[var(--text-secondary)]">
          {starData.improvementSuggestions.map((s, idx) => (
            <li key={idx}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { Clock, Map, CheckCircle2 } from 'lucide-react';
import type { PersonalizedRoadmapData } from '../../types/career.types';
import { cn } from '@/lib/utils';

interface LearningRoadmapTimelineProps {
  roadmap: PersonalizedRoadmapData;
}

export function LearningRoadmapTimeline({ roadmap }: LearningRoadmapTimelineProps) {
  const [activeTab, setActiveTab] = React.useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>(
    'daily'
  );

  return (
    <div
      id="learning-roadmap-timeline-container"
      className="space-y-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5 shadow-sm"
    >
      <div className="flex flex-col items-start justify-between space-y-2 border-b border-[var(--border-subtle)] pb-3 sm:flex-row sm:items-center sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Map className="h-5 w-5 text-purple-400" />
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">{roadmap.title}</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Multi-tier learning roadmap automatically updated based on mock interview evaluation
              reports.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
          <span>Completion Progress: {roadmap.completionStatus}%</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto border-b border-[var(--border-subtle)] pb-2 text-xs">
        {[
          { id: 'daily', label: 'Daily Study Units' },
          { id: 'weekly', label: 'Weekly Themes' },
          { id: 'monthly', label: 'Monthly Pillars' },
          { id: 'quarterly', label: 'Quarterly Milestones' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              'rounded-lg px-3 py-1.5 font-semibold whitespace-nowrap transition-all',
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Daily Units */}
      {activeTab === 'daily' && (
        <div className="space-y-3 pt-2">
          {roadmap.dailyPlan.map((unit) => (
            <div
              key={unit.day}
              className={cn(
                'flex flex-col justify-between space-y-2 rounded-xl border p-4 text-xs transition-all sm:flex-row sm:items-center sm:space-y-0',
                unit.isCompleted
                  ? 'border-emerald-500/30 bg-emerald-500/5 text-gray-200'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-[var(--text-primary)]'
              )}
            >
              <div className="flex items-start space-x-3">
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    unit.isCompleted ? 'bg-emerald-600 text-white' : 'bg-purple-600 text-white'
                  )}
                >
                  {unit.day}
                </span>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-white">{unit.focusTopic}</h4>
                  <p className="text-xs text-[var(--text-secondary)]">{unit.activity}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center space-x-2 self-end sm:self-auto">
                <span className="flex items-center space-x-1 rounded bg-[var(--bg-surface-1)] px-2 py-1 text-[11px] text-[var(--text-tertiary)]">
                  <Clock className="h-3 w-3 text-purple-400" />
                  <span>{unit.estimatedHours} hrs</span>
                </span>
                {unit.isCompleted && (
                  <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Done</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Weekly Plan */}
      {activeTab === 'weekly' && (
        <div className="grid gap-3 pt-2 text-xs sm:grid-cols-2">
          {roadmap.weeklyPlan.map((unit) => (
            <div
              key={unit.week}
              className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300">
                  Week {unit.week}: {unit.theme}
                </span>
              </div>
              <ul className="list-inside list-disc space-y-1 text-xs text-[var(--text-secondary)]">
                {unit.goals.map((g, idx) => (
                  <li key={idx}>{g}</li>
                ))}
              </ul>
              <div className="border-t border-[var(--border-subtle)] pt-2 text-[11px] font-semibold text-emerald-400">
                Milestone: {unit.milestone}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Monthly Plan */}
      {activeTab === 'monthly' && (
        <div className="space-y-3 pt-2 text-xs">
          {roadmap.monthlyPlan.map((unit) => (
            <div
              key={unit.month}
              className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4"
            >
              <h4 className="font-bold text-blue-300">
                Month {unit.month}: {unit.focusPillar}
              </h4>
              <ul className="list-inside list-disc space-y-1 text-xs text-[var(--text-secondary)]">
                {unit.outcomes.map((o, idx) => (
                  <li key={idx}>{o}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Quarterly Plan */}
      {activeTab === 'quarterly' && (
        <div className="space-y-3 pt-2 text-xs">
          {roadmap.quarterlyPlan.map((unit) => (
            <div
              key={unit.quarter}
              className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4"
            >
              <h4 className="font-bold text-amber-300">
                Q{unit.quarter}: {unit.headlineGoal}
              </h4>
              <ul className="list-inside list-disc space-y-1 text-xs text-[var(--text-secondary)]">
                {unit.keyDeliverables.map((d, idx) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

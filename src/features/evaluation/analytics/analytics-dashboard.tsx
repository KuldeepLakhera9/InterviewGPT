'use client';

import * as React from 'react';
import { BarChart2, Activity } from 'lucide-react';
import type { CandidateAnalyticsSummary } from '../types/evaluation.types';
import { HiringReadinessTrend } from './hiring-readiness-trend';
import { SkillRadarChart } from './skill-radar-chart';
import { ScoreTrendsChart } from './score-trends-chart';
import { WeakStrongTopicsCard } from './weak-strong-topics-card';
import { ProgressTimeline } from './progress-timeline';

interface AnalyticsDashboardProps {
  initialSummary: CandidateAnalyticsSummary;
}

export function AnalyticsDashboard({ initialSummary }: AnalyticsDashboardProps) {
  const summary = initialSummary;

  return (
    <div id="analytics-dashboard-container" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart2 className="h-5 w-5 text-purple-400" />
            <h1 className="text-xl font-black tracking-tight text-[var(--text-primary)]">
              Candidate Performance Analytics Dashboard
            </h1>
          </div>
          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
            Aggregated skill radar, score trend trajectories, topic mastery deficits, and interview
            readiness timelines.
          </p>
        </div>
      </div>

      {/* Top Level Metric Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 text-center">
          <span className="text-[10px] font-bold tracking-wider text-[var(--text-tertiary)] uppercase">
            Interviews Completed
          </span>
          <div className="mt-1 text-2xl font-black text-[var(--text-primary)]">
            {summary.totalInterviewsCompleted}
          </div>
          <span className="text-[10px] text-gray-400">Total Sessions</span>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 text-center">
          <span className="text-[10px] font-bold tracking-wider text-[var(--text-tertiary)] uppercase">
            Avg Overall Score
          </span>
          <div className="mt-1 text-2xl font-black text-purple-400">
            {summary.averageOverallScore}
          </div>
          <span className="text-[10px] text-gray-400">Historical Average</span>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 text-center">
          <span className="text-[10px] font-bold tracking-wider text-[var(--text-tertiary)] uppercase">
            Avg Technical Depth
          </span>
          <div className="mt-1 text-2xl font-black text-blue-400">
            {summary.averageTechnicalScore}
          </div>
          <span className="text-[10px] text-gray-400">Technical Pillar</span>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 text-center">
          <span className="text-[10px] font-bold tracking-wider text-[var(--text-tertiary)] uppercase">
            Avg Communication
          </span>
          <div className="mt-1 text-2xl font-black text-indigo-400">
            {summary.averageCommunicationScore}
          </div>
          <span className="text-[10px] text-gray-400">Fluency & Tone</span>
        </div>
      </div>

      {/* Hiring Readiness Banner */}
      <HiringReadinessTrend trend={summary.hiringReadinessTrend} />

      {/* Grid: Skill Radar & Score Trends */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Skill Radar */}
        <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5">
          <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-primary)]">
            <Activity className="h-4 w-4 text-purple-400" />
            <span>Candidate Multi-Dimensional Skill Radar</span>
          </div>
          <SkillRadarChart data={summary.skillRadar} />
        </div>

        {/* Score Trends Chart */}
        <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5">
          <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-primary)]">
            <BarChart2 className="h-4 w-4 text-blue-400" />
            <span>Historical Interview Score Trajectory</span>
          </div>
          <ScoreTrendsChart trends={summary.scoreTrends} />
        </div>
      </div>

      {/* Weak vs Strong Topics */}
      <WeakStrongTopicsCard weakTopics={summary.weakTopics} strongTopics={summary.strongTopics} />

      {/* Progress Timeline */}
      <ProgressTimeline timeline={summary.progressTimeline} />
    </div>
  );
}

'use client';

import * as React from 'react';
import { Compass, Calendar, CheckSquare, Rocket, BookOpen, Clock } from 'lucide-react';
import type { LearningRoadmapData } from '../types/evaluation.types';

interface LearningRoadmapViewProps {
  roadmap: LearningRoadmapData;
}

export function LearningRoadmapView({ roadmap }: LearningRoadmapViewProps) {
  const [activeTab, setActiveTab] = React.useState<'daily' | 'weekly' | 'monthly' | 'projects'>(
    'daily'
  );

  return (
    <div id="learning-roadmap-view" className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-500/10 p-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Compass className="h-5 w-5 text-purple-400" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Personalized Candidate Learning Roadmap
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Tailored action plan based on your resume, candidate profile, interview performance, and
            target job role bar.
          </p>
        </div>

        <div className="text-right">
          <span className="block text-[10px] font-semibold text-[var(--text-tertiary)] uppercase">
            Practice Cadence
          </span>
          <span className="text-sm font-bold text-purple-300">
            {roadmap.practiceSchedule.recommendedInterviewsPerWeek} Interviews / Week
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-[var(--border-subtle)] pb-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('daily')}
          className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 font-semibold transition-all ${
            activeTab === 'daily'
              ? 'bg-purple-600 text-white'
              : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>7-Day Daily Action Plan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('weekly')}
          className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 font-semibold transition-all ${
            activeTab === 'weekly'
              ? 'bg-purple-600 text-white'
              : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>4-Week Roadmap</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('monthly')}
          className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 font-semibold transition-all ${
            activeTab === 'monthly'
              ? 'bg-purple-600 text-white'
              : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
          }`}
        >
          <CheckSquare className="h-3.5 w-3.5" />
          <span>3-Month Milestones</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 font-semibold transition-all ${
            activeTab === 'projects'
              ? 'bg-purple-600 text-white'
              : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
          }`}
        >
          <Rocket className="h-3.5 w-3.5" />
          <span>Recommended Projects</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'daily' && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roadmap.dailyPlan.map((item) => (
            <div
              key={item.day}
              className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="rounded border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-xs font-bold text-purple-400">
                  Day #{item.day}
                </span>
                <span className="text-[11px] text-[var(--text-tertiary)]">
                  {item.estimatedHours} hrs
                </span>
              </div>
              <h4 className="text-xs font-bold text-[var(--text-primary)]">{item.focusTopic}</h4>
              <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                {item.activity}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'weekly' && (
        <div className="space-y-3">
          {roadmap.weeklyRoadmap.map((item) => (
            <div
              key={item.week}
              className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400">
                  Week #{item.week}: {item.theme}
                </span>
                <span className="text-[11px] font-semibold text-emerald-400">
                  Milestone: {item.milestone}
                </span>
              </div>
              <ul className="list-inside list-disc space-y-1 text-xs text-[var(--text-secondary)]">
                {item.goals.map((g, idx) => (
                  <li key={idx}>{g}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'monthly' && (
        <div className="grid gap-3 sm:grid-cols-3">
          {roadmap.monthlyRoadmap.map((item) => (
            <div
              key={item.month}
              className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4"
            >
              <span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-400">
                Month #{item.month}
              </span>
              <h4 className="text-xs font-bold text-[var(--text-primary)]">
                {item.milestoneTitle}
              </h4>
              <ul className="list-inside list-disc space-y-1 text-xs text-[var(--text-secondary)]">
                {item.keyDeliverables.map((d, idx) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {roadmap.recommendedProjects.map((p) => (
            <div
              key={p.title}
              className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[var(--text-primary)]">{p.title}</h4>
                <span className="rounded border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-300 capitalize">
                  {p.difficulty}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">{p.description}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {p.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-[var(--bg-surface-2)] px-2 py-0.5 text-[10px] text-[var(--text-secondary)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommended Practice Questions & Resources */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-primary)]">
            <BookOpen className="h-4 w-4 text-purple-400" />
            <span>Recommended Interview Practice Questions</span>
          </div>
          <div className="space-y-2">
            {roadmap.recommendedQuestions.map((q, idx) => (
              <div key={idx} className="rounded-lg bg-[var(--bg-surface-2)] p-2.5 text-xs">
                <span className="font-semibold text-purple-300">
                  [{q.category.toUpperCase()}] {q.topic}:
                </span>
                <p className="mt-0.5 text-[var(--text-secondary)]">{q.questionText}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-primary)]">
            <Compass className="h-4 w-4 text-indigo-400" />
            <span>Curated Learning Resources</span>
          </div>
          <div className="space-y-2">
            {roadmap.learningResources.map((res, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between rounded-lg bg-[var(--bg-surface-2)] p-2.5 text-xs"
              >
                <div>
                  <span className="font-semibold text-[var(--text-primary)]">{res.title}</span>
                  <span className="block text-[10px] text-[var(--text-tertiary)]">
                    {res.urlOrReference}
                  </span>
                </div>
                <span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] text-indigo-300 capitalize">
                  {res.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

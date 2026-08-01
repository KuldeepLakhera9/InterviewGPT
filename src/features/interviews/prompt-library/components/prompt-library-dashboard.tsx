'use client';

import * as React from 'react';
import {
  BookOpen,
  Terminal,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import type { PromptCategory, PromptDefinition } from '../types/prompt-library.types';
import { getAllPromptsAction } from '../actions/prompt-library.actions';
import { cn } from '@/lib/utils';

interface PromptLibraryDashboardProps {
  initialPrompts?: PromptDefinition<unknown, unknown>[];
}

const CATEGORY_TABS: { label: string; value: PromptCategory | 'all' }[] = [
  { label: 'All Prompts', value: 'all' },
  { label: 'Technical Coding', value: 'technical' },
  { label: 'System Design', value: 'system_design' },
  { label: 'STAR Behavioral', value: 'behavioral' },
  { label: 'AI Generator', value: 'question_generator' },
  { label: 'Adaptive Evaluator', value: 'followup_evaluator' },
];

export function PromptLibraryDashboard({ initialPrompts = [] }: PromptLibraryDashboardProps) {
  const [prompts, setPrompts] =
    React.useState<PromptDefinition<unknown, unknown>[]>(initialPrompts);
  const [activeCategory, setActiveCategory] = React.useState<PromptCategory | 'all'>('all');
  const [selectedPromptId, setSelectedPromptId] = React.useState<string>(
    initialPrompts[0]?.id || 'prompt_technical_interviewer_v1'
  );

  const fetchPrompts = React.useCallback(async () => {
    try {
      const res = await getAllPromptsAction();
      if (res.success && res.data) {
        setPrompts(res.data);
        if (!selectedPromptId && res.data[0]) {
          setSelectedPromptId(res.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch prompt library:', err);
    }
  }, [selectedPromptId]);

  React.useEffect(() => {
    if (prompts.length === 0) {
      fetchPrompts();
    }
  }, [fetchPrompts, prompts.length]);

  const filteredPrompts = React.useMemo(() => {
    if (activeCategory === 'all') return prompts;
    return prompts.filter((p) => p.category === activeCategory);
  }, [prompts, activeCategory]);

  const selectedPrompt = prompts.find((p) => p.id === selectedPromptId) || filteredPrompts[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center space-x-2 text-xl font-bold tracking-tight text-[var(--text-primary)]">
            <BookOpen className="h-5 w-5 text-indigo-400" />
            <span>Prompt Library Inspector</span>
          </h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Centralized registry of decoupled LLM prompt templates, rules, schemas, and failure
            fallback strategies.
          </p>
        </div>

        <span className="inline-flex items-center space-x-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>{prompts.length} Registered Templates</span>
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-3 shadow-sm">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setActiveCategory(tab.value);
                const firstMatch = prompts.find(
                  (p) => tab.value === 'all' || p.category === tab.value
                );
                if (firstMatch) setSelectedPromptId(firstMatch.id);
              }}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                  : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid: Left List, Right Inspector Detail */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left List of Prompts */}
        <div className="space-y-2 lg:col-span-4">
          {filteredPrompts.map((p) => {
            const isSelected = selectedPrompt?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPromptId(p.id)}
                className={cn(
                  'cursor-pointer space-y-2 rounded-xl border p-4 shadow-sm transition-all',
                  isSelected
                    ? 'border-indigo-500/50 bg-indigo-500/10 ring-1 ring-indigo-500/30'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface-1)] hover:border-[var(--border-strong)]'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-indigo-300 uppercase">
                    {p.category.replace('_', ' ')}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                    v{p.version}
                  </span>
                </div>

                <h3 className="text-xs leading-snug font-bold text-[var(--text-primary)]">
                  {p.name}
                </h3>
                <p className="line-clamp-2 text-[11px] text-[var(--text-secondary)]">
                  {p.objective}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Inspector Detail */}
        {selectedPrompt && (
          <div className="space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5 shadow-sm lg:col-span-8">
            {/* Header */}
            <div className="space-y-1 border-b border-[var(--border-subtle)] pb-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center space-x-2 text-base font-extrabold text-[var(--text-primary)]">
                  <Terminal className="h-4 w-4 text-indigo-400" />
                  <span>{selectedPrompt.name}</span>
                </h3>
                <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300 uppercase">
                  {selectedPrompt.category.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">{selectedPrompt.objective}</p>
            </div>

            {/* Rules Section */}
            <div className="space-y-2">
              <h4 className="flex items-center space-x-1.5 text-xs font-bold tracking-wider text-emerald-400 uppercase">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Behavioral Rules ({selectedPrompt.rules.length})</span>
              </h4>
              <ul className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3 text-xs text-[var(--text-secondary)]">
                {selectedPrompt.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="font-bold text-emerald-400">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Constraints Section */}
            <div className="space-y-2">
              <h4 className="flex items-center space-x-1.5 text-xs font-bold tracking-wider text-amber-400 uppercase">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Strict Output Constraints ({selectedPrompt.constraints.length})</span>
              </h4>
              <ul className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3 text-xs text-[var(--text-secondary)]">
                {selectedPrompt.constraints.map((constraint, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="font-bold text-amber-400">•</span>
                    <span>{constraint}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Failure Handling Strategy Section */}
            <div className="space-y-2">
              <h4 className="flex items-center space-x-1.5 text-xs font-bold tracking-wider text-purple-400 uppercase">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Failure Fallback Strategy</span>
              </h4>
              <div className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3 text-xs">
                <p className="font-semibold text-purple-300">
                  Strategy: {selectedPrompt.failureHandling.recoveryStrategy}
                </p>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Retry Limit: {selectedPrompt.failureHandling.retryLimit} attempts
                </p>
                <pre className="mt-2 overflow-x-auto rounded bg-black/40 p-2 font-mono text-[10px] text-slate-300">
                  {JSON.stringify(selectedPrompt.failureHandling.fallbackResponse, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

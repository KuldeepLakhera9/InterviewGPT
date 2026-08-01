'use client';

import * as React from 'react';
import { Search, Filter, Archive } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { QuestionDifficulty } from '../../question-bank/types/question-bank.types';
import type { InterviewStatusFilter } from '../types/history-system.types';
import { cn } from '@/lib/utils';

interface HistoryFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: InterviewStatusFilter;
  onStatusChange: (status: InterviewStatusFilter) => void;
  trackFilter: string;
  onTrackChange: (track: string) => void;
  difficultyFilter: QuestionDifficulty | 'all';
  onDifficultyChange: (diff: QuestionDifficulty | 'all') => void;
  showArchived: boolean;
  onToggleShowArchived: (val: boolean) => void;
}

const STATUS_TABS: { label: string; value: InterviewStatusFilter }[] = [
  { label: 'All Sessions', value: 'all' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Paused', value: 'paused' },
  { label: 'Completed', value: 'completed' },
  { label: 'Archived', value: 'archived' },
];

export function HistoryFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  trackFilter,
  onTrackChange,
  difficultyFilter,
  onDifficultyChange,
  showArchived,
  onToggleShowArchived,
}: HistoryFilterBarProps) {
  return (
    <div className="space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm">
      {/* Top Status Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onStatusChange(tab.value)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                    : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onToggleShowArchived(!showArchived)}
          className={cn(
            'flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
            showArchived
              ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
              : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
          )}
        >
          <Archive className="h-3.5 w-3.5" />
          <span>Archived Only</span>
        </button>
      </div>

      {/* Search Input & Select Dropdowns Grid */}
      <div className="grid gap-3 sm:grid-cols-12">
        {/* Search Bar */}
        <div className="relative sm:col-span-6">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-[var(--text-secondary)]" />
          <Input
            placeholder="Search history by role, company name, or track..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-[var(--bg-surface-2)] pl-9 text-xs"
          />
        </div>

        {/* Track Select */}
        <div className="sm:col-span-3">
          <Select value={trackFilter} onValueChange={onTrackChange}>
            <SelectTrigger className="h-9 bg-[var(--bg-surface-2)] text-xs">
              <div className="flex items-center space-x-1.5 truncate">
                <Filter className="h-3.5 w-3.5 text-blue-400" />
                <SelectValue placeholder="All Tracks" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Interview Tracks</SelectItem>
              <SelectItem value="technical">Technical Coding</SelectItem>
              <SelectItem value="system_design">System Design</SelectItem>
              <SelectItem value="behavioral">STAR Behavioral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Difficulty Select */}
        <div className="sm:col-span-3">
          <Select
            value={difficultyFilter}
            onValueChange={(val) => onDifficultyChange(val as QuestionDifficulty | 'all')}
          >
            <SelectTrigger className="h-9 bg-[var(--bg-surface-2)] text-xs">
              <SelectValue placeholder="All Difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

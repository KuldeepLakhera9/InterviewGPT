'use client';

import * as React from 'react';
import { Search, Filter, Database, Sparkles, Layers, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  QuestionBankItemData,
  QuestionCategory,
  QuestionDifficulty,
  QuestionQueryResult,
  QuestionSource,
} from '../types/question-bank.types';
import { getQuestionsAction, seedQuestionBankAction } from '../actions/question-bank.actions';
import { QuestionCard } from './question-card';
import { QuestionDetailModal } from './question-detail-modal';
import { CreateQuestionModal } from './create-question-modal';
import { QuestionGeneratorDialog } from '../../ai-generator/components/question-generator-dialog';
import { cn } from '@/lib/utils';

interface QuestionBankDashboardProps {
  initialData: QuestionQueryResult;
}

const CATEGORY_TABS: { label: string; value: QuestionCategory | 'all' }[] = [
  { label: 'All Categories', value: 'all' },
  { label: 'Technical', value: 'technical' },
  { label: 'System Design', value: 'system_design' },
  { label: 'Behavioral STAR', value: 'behavioral' },
  { label: 'Coding', value: 'coding' },
  { label: 'Architecture', value: 'architecture' },
];

export function QuestionBankDashboard({ initialData }: QuestionBankDashboardProps) {
  const [data, setData] = React.useState<QuestionQueryResult>(initialData);
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<QuestionCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<QuestionDifficulty | 'all'>(
    'all'
  );
  const [selectedSource, setSelectedSource] = React.useState<QuestionSource | 'all'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [previewQuestion, setPreviewQuestion] = React.useState<QuestionBankItemData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const fetchFilteredQuestions = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getQuestionsAction({
        category: activeCategory,
        difficulty: selectedDifficulty,
        source: selectedSource,
        searchQuery: searchQuery.trim() || undefined,
        page: 1,
        limit: 20,
      });
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch filtered questions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, selectedDifficulty, selectedSource, searchQuery]);

  React.useEffect(() => {
    fetchFilteredQuestions();
  }, [fetchFilteredQuestions]);

  const handleQuestionCreated = (newQuestion: QuestionBankItemData) => {
    setData((prev) => ({
      ...prev,
      items: [newQuestion, ...prev.items],
      total: prev.total + 1,
    }));
  };

  const handleSeedRepository = async () => {
    setIsLoading(true);
    await seedQuestionBankAction();
    await fetchFilteredQuestions();
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center space-x-2 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            <Database className="h-6 w-6 text-blue-400" />
            <span>Interview Question Bank</span>
          </h1>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Structured repository of technical algorithms, system design, and STAR behavioral
            questions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <QuestionGeneratorDialog onQuestionsGenerated={fetchFilteredQuestions} />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSeedRepository}
            disabled={isLoading}
            className="space-x-1 text-xs"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isLoading && 'animate-spin')} />
            <span>Reseed Bank</span>
          </Button>

          <CreateQuestionModal onQuestionCreated={handleQuestionCreated} />
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-[var(--border-subtle)] pb-3">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveCategory(tab.value)}
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

        {/* Search & Secondary Filters Grid */}
        <div className="grid gap-3 sm:grid-cols-12">
          {/* Search Bar */}
          <div className="relative sm:col-span-6">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-[var(--text-secondary)]" />
            <Input
              placeholder="Search by title, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[var(--bg-surface-2)] pl-9 text-xs"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="sm:col-span-3">
            <Select
              value={selectedDifficulty}
              onValueChange={(val) => setSelectedDifficulty(val as QuestionDifficulty | 'all')}
            >
              <SelectTrigger className="bg-[var(--bg-surface-2)] text-xs">
                <div className="flex items-center space-x-1.5">
                  <Filter className="h-3.5 w-3.5 text-blue-400" />
                  <SelectValue placeholder="Difficulty" />
                </div>
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

          {/* Source Filter */}
          <div className="sm:col-span-3">
            <Select
              value={selectedSource}
              onValueChange={(val) => setSelectedSource(val as QuestionSource | 'all')}
            >
              <SelectTrigger className="bg-[var(--bg-surface-2)] text-xs">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  <SelectValue placeholder="Question Source" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="system">System Standard</SelectItem>
                <SelectItem value="ai_generated">AI Generated</SelectItem>
                <SelectItem value="user_custom">User Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)]">
        <span>
          Showing {data.items.length} of {data.total} Repository Questions
        </span>
        {isLoading && <span className="animate-pulse text-blue-400">Updating results...</span>}
      </div>

      {/* Question Cards Grid */}
      {data.items.length === 0 ? (
        <div className="space-y-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-12 text-center">
          <Layers className="mx-auto h-10 w-10 text-[var(--text-secondary)]" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            No questions match current filters
          </h3>
          <p className="mx-auto max-w-sm text-xs text-[var(--text-secondary)]">
            Try adjusting your search query, clearing difficulty filters, or adding custom
            questions.
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setActiveCategory('all');
              setSelectedDifficulty('all');
              setSelectedSource('all');
              setSearchQuery('');
            }}
            className="text-xs"
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              onPreview={(question) => {
                setPreviewQuestion(question);
                setIsDetailOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Detail Inspection Modal */}
      <QuestionDetailModal
        question={previewQuestion}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}

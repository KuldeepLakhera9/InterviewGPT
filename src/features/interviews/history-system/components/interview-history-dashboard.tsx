'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  History,
  Plus,
  Play,
  CheckCircle2,
  Archive,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import type {
  HistoryFilterParams,
  HistoryQueryResult,
  InterviewStatusFilter,
} from '../types/history-system.types';
import type { QuestionDifficulty } from '../../question-bank/types/question-bank.types';
import {
  deleteSessionHistoryAction,
  duplicateSessionAction,
  getInterviewHistoryAction,
  toggleArchiveSessionAction,
} from '../actions/history-system.actions';
import { HistoryFilterBar } from './history-filter-bar';
import { SessionHistoryCard } from './session-history-card';

interface InterviewHistoryDashboardProps {
  initialData: HistoryQueryResult;
}

export function InterviewHistoryDashboard({ initialData }: InterviewHistoryDashboardProps) {
  const { toast } = useToast();
  const [data, setData] = React.useState<HistoryQueryResult>(initialData);
  const [isLoading, setIsLoading] = React.useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<InterviewStatusFilter>('all');
  const [trackFilter, setTrackFilter] = React.useState('all');
  const [difficultyFilter, setDifficultyFilter] = React.useState<QuestionDifficulty | 'all'>('all');
  const [showArchived, setShowArchived] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const fetchFilteredHistory = React.useCallback(
    async (overridePage?: number) => {
      setIsLoading(true);
      const targetPage = overridePage ?? page;
      try {
        const filterParams: HistoryFilterParams = {
          searchQuery: searchQuery.trim() || undefined,
          status: statusFilter,
          track: trackFilter,
          difficulty: difficultyFilter,
          showArchivedOnly: showArchived,
          page: targetPage,
          limit: 9,
        };

        const res = await getInterviewHistoryAction(filterParams);
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery, statusFilter, trackFilter, difficultyFilter, showArchived, page]
  );

  React.useEffect(() => {
    fetchFilteredHistory();
  }, [fetchFilteredHistory]);

  const handleToggleArchive = async (sessionId: string, isArchived: boolean) => {
    try {
      const res = await toggleArchiveSessionAction(sessionId, isArchived);
      if (res.success) {
        toast({
          title: isArchived ? 'Session Archived' : 'Session Restored',
          description: isArchived
            ? 'Session moved to archive.'
            : 'Session restored to active list.',
        });
        fetchFilteredHistory();
      } else {
        toast({ variant: 'danger', title: 'Archive Error', description: res.error });
      }
    } catch {
      toast({ variant: 'danger', title: 'Error archiving session' });
    }
  };

  const handleDuplicate = async (sessionId: string) => {
    try {
      const res = await duplicateSessionAction(sessionId);
      if (res.success && res.data) {
        toast({
          title: 'Session Duplicated!',
          description: `Created clone: ${res.data.roleTitle}`,
        });
        fetchFilteredHistory();
      } else {
        toast({ variant: 'danger', title: 'Duplicate Failed', description: res.error });
      }
    } catch {
      toast({ variant: 'danger', title: 'Error duplicating session' });
    }
  };

  const handleDelete = async (sessionId: string) => {
    try {
      const res = await deleteSessionHistoryAction(sessionId);
      if (res.success) {
        toast({ title: 'Session Deleted Permanently' });
        fetchFilteredHistory();
      } else {
        toast({ variant: 'danger', title: 'Delete Failed', description: res.error });
      }
    } catch {
      toast({ variant: 'danger', title: 'Error deleting session' });
    }
  };

  const { stats } = data;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center space-x-2 text-xl font-bold tracking-tight text-[var(--text-primary)]">
            <History className="h-5 w-5 text-blue-400" />
            <span>Interview Session History Hub</span>
          </h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Manage long-running mock interview sessions, archive finished setups, duplicate
            configurations, and resume active rooms.
          </p>
        </div>

        <Button asChild size="sm" className="bg-blue-600 text-xs font-semibold text-white">
          <Link href="/interviews/setup">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            <span>Configure New Session</span>
          </Link>
        </Button>
      </div>

      {/* Stats Summary Cards Bar */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="space-y-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Total Sessions</span>
            <History className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-xl font-extrabold text-[var(--text-primary)]">{stats.totalSessions}</p>
        </div>

        <div className="space-y-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>In Progress</span>
            <Play className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-emerald-400">{stats.inProgressSessions}</p>
        </div>

        <div className="space-y-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Completed</span>
            <CheckCircle2 className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-xl font-extrabold text-blue-400">{stats.completedSessions}</p>
        </div>

        <div className="space-y-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Archived</span>
            <Archive className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-xl font-extrabold text-indigo-300">{stats.archivedSessions}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <HistoryFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(st) => {
          setStatusFilter(st);
          setPage(1);
        }}
        trackFilter={trackFilter}
        onTrackChange={(tr) => {
          setTrackFilter(tr);
          setPage(1);
        }}
        difficultyFilter={difficultyFilter}
        onDifficultyChange={(df) => {
          setDifficultyFilter(df);
          setPage(1);
        }}
        showArchived={showArchived}
        onToggleShowArchived={(val) => {
          setShowArchived(val);
          setPage(1);
        }}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="animate-pulse text-[11px] font-semibold text-blue-400">
          Updating session history results...
        </div>
      )}

      {/* Session Cards Grid */}
      {data.items.length === 0 ? (
        <div className="space-y-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-12 text-center">
          <History className="mx-auto h-10 w-10 text-[var(--text-secondary)]" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            No interview sessions found
          </h3>
          <p className="mx-auto max-w-sm text-xs text-[var(--text-secondary)]">
            No mock interview sessions match the active search or filter criteria.
          </p>
          <Button asChild size="sm" variant="outline" className="text-xs">
            <Link href="/interviews/setup">
              <span>Start Setup Wizard</span>
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((session) => (
            <SessionHistoryCard
              key={session.id}
              session={session}
              onToggleArchive={handleToggleArchive}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-4 text-xs">
          <span className="text-[var(--text-secondary)]">
            Page <strong className="text-[var(--text-primary)]">{data.page}</strong> of{' '}
            <strong className="text-[var(--text-primary)]">{data.totalPages}</strong> ({data.total}{' '}
            total sessions)
          </span>

          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => {
                const nextP = page - 1;
                setPage(nextP);
                fetchFilteredHistory(nextP);
              }}
              className="h-8 px-2 text-xs"
            >
              <ChevronLeft className="mr-1 h-3.5 w-3.5" />
              <span>Previous</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= data.totalPages}
              onClick={() => {
                const nextP = page + 1;
                setPage(nextP);
                fetchFilteredHistory(nextP);
              }}
              className="h-8 px-2 text-xs"
            >
              <span>Next</span>
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

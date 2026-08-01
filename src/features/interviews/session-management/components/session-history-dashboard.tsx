'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Clock,
  Building2,
  Layers,
  Flame,
  Search,
  Trash2,
  ArrowRight,
  History,
  MessageSquare,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import type { SessionHistoryQueryResult, SessionStatus } from '../types/session-management.types';
import {
  deleteSessionAction,
  getSessionsHistoryAction,
} from '../actions/session-management.actions';
import { cn } from '@/lib/utils';

interface SessionHistoryDashboardProps {
  initialData: SessionHistoryQueryResult;
}

const STATUS_TABS: { label: string; value: SessionStatus | 'all' }[] = [
  { label: 'All Sessions', value: 'all' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Paused', value: 'paused' },
  { label: 'Completed', value: 'completed' },
];

export function SessionHistoryDashboard({ initialData }: SessionHistoryDashboardProps) {
  const { toast } = useToast();
  const [data, setData] = React.useState<SessionHistoryQueryResult>(initialData);
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeStatus, setActiveStatus] = React.useState<SessionStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const fetchFilteredHistory = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getSessionsHistoryAction({
        status: activeStatus,
        searchQuery: searchQuery.trim() || undefined,
        page: 1,
        limit: 10,
      });
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch session history:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeStatus, searchQuery]);

  React.useEffect(() => {
    fetchFilteredHistory();
  }, [fetchFilteredHistory]);

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const res = await deleteSessionAction(sessionId);
      if (res.success) {
        toast({ title: 'Session Deleted' });
        setData((prev) => ({
          ...prev,
          items: prev.items.filter((s) => s.id !== sessionId),
          total: Math.max(prev.total - 1, 0),
        }));
      } else {
        toast({ variant: 'danger', title: 'Delete Failed', description: res.error });
      }
    } catch {
      toast({ variant: 'danger', title: 'Error deleting session' });
    }
  };

  const formatElapsed = (sec: number) => {
    const mins = Math.floor(sec / 60);
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center space-x-2 text-xl font-bold tracking-tight text-[var(--text-primary)]">
            <History className="h-5 w-5 text-blue-400" />
            <span>Interview Session History</span>
          </h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Track and resume your long-running mock interview sessions.
          </p>
        </div>

        <Button asChild size="sm" className="bg-blue-600 text-xs font-semibold text-white">
          <Link href="/interviews/setup">
            <span>Configure New Session</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-[var(--border-subtle)] pb-3">
          {STATUS_TABS.map((tab) => {
            const isActive = activeStatus === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveStatus(tab.value)}
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

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-[var(--text-secondary)]" />
          <Input
            placeholder="Search session history by role or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[var(--bg-surface-2)] pl-9 text-xs"
          />
        </div>
        {isLoading && (
          <div className="animate-pulse pt-1 text-[11px] font-semibold text-blue-400">
            Updating session history...
          </div>
        )}
      </div>

      {/* Session Cards Grid */}
      {data.items.length === 0 ? (
        <div className="space-y-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-12 text-center">
          <History className="mx-auto h-10 w-10 text-[var(--text-secondary)]" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            No interview sessions found
          </h3>
          <p className="mx-auto max-w-sm text-xs text-[var(--text-secondary)]">
            You haven&apos;t created any interview sessions matching this filter yet.
          </p>
          <Button asChild size="sm" variant="outline" className="text-xs">
            <Link href="/interviews/setup">Start Your First Session</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((s) => (
            <div
              key={s.id}
              className="flex flex-col justify-between space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm transition-all hover:border-[var(--border-strong)]"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm leading-snug font-bold text-[var(--text-primary)]">
                      {s.roleTitle}
                    </h3>
                    <p className="mt-0.5 flex items-center space-x-1 text-xs font-medium text-purple-400">
                      <Building2 className="h-3 w-3" />
                      <span>
                        {s.companyName} ({s.companyTier.toUpperCase()})
                      </span>
                    </p>
                  </div>

                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase',
                      s.status === 'in_progress' &&
                        'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
                      s.status === 'paused' &&
                        'border border-amber-500/20 bg-amber-500/10 text-amber-400',
                      s.status === 'completed' &&
                        'border border-blue-500/20 bg-blue-500/10 text-blue-400',
                      s.status === 'created' &&
                        'border border-gray-500/20 bg-gray-500/10 text-gray-400'
                    )}
                  >
                    {s.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-[var(--text-secondary)]">
                  <div className="flex items-center space-x-1">
                    <Layers className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="capitalize">{s.track.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Flame className="h-3.5 w-3.5 text-amber-400" />
                    <span className="capitalize">{s.difficulty}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                    <span>
                      {formatElapsed(s.elapsedSeconds)} / {s.durationMinutes}m
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-3.5 w-3.5 text-purple-400" />
                    <span>{s.turnsCount} turns</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-3 text-xs">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteSession(s.id)}
                  className="h-7 px-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>

                <Button
                  asChild
                  size="sm"
                  className="h-7 bg-blue-600 text-xs font-semibold text-white"
                >
                  <Link href={`/interviews/${s.id}`}>
                    {s.status === 'completed' ? (
                      <>
                        <RotateCcw className="mr-1 h-3 w-3" />
                        <span>Review Room</span>
                      </>
                    ) : (
                      <>
                        <Play className="mr-1 h-3 w-3" />
                        <span>Resume Room</span>
                      </>
                    )}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

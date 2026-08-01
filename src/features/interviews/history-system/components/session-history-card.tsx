'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Clock,
  Building2,
  Layers,
  Flame,
  Trash2,
  Play,
  RotateCcw,
  Archive,
  Copy,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { HistorySessionItem } from '../types/history-system.types';
import { cn } from '@/lib/utils';

interface SessionHistoryCardProps {
  session: HistorySessionItem;
  onToggleArchive: (id: string, isArchived: boolean) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SessionHistoryCard({
  session,
  onToggleArchive,
  onDuplicate,
  onDelete,
}: SessionHistoryCardProps) {
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  const formatElapsed = (sec: number) => {
    const mins = Math.floor(sec / 60);
    return `${mins}m`;
  };

  return (
    <div className="flex flex-col justify-between space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm transition-all hover:border-[var(--border-strong)]">
      <div className="space-y-2">
        {/* Header Badges */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm leading-snug font-bold text-[var(--text-primary)]">
              {session.roleTitle}
            </h3>
            <p className="mt-0.5 flex items-center space-x-1 text-xs font-medium text-purple-400">
              <Building2 className="h-3 w-3" />
              <span>
                {session.companyName} ({session.companyTier.toUpperCase()})
              </span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase',
                session.status === 'in_progress' &&
                  'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
                session.status === 'paused' &&
                  'border border-amber-500/20 bg-amber-500/10 text-amber-400',
                session.status === 'completed' &&
                  'border border-blue-500/20 bg-blue-500/10 text-blue-400',
                session.status === 'created' &&
                  'border border-gray-500/20 bg-gray-500/10 text-gray-400'
              )}
            >
              {session.status.replace('_', ' ')}
            </span>
            {session.isArchived && (
              <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[9px] font-bold text-indigo-300 uppercase">
                Archived
              </span>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center space-x-1">
            <Layers className="h-3.5 w-3.5 text-emerald-400" />
            <span className="capitalize">{session.track.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span className="capitalize">{session.difficulty}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span>
              {formatElapsed(session.elapsedSeconds)} / {session.durationMinutes}m
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-3.5 w-3.5 text-purple-400" />
            <span>{session.turnsCount} turns</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-3 text-xs">
        <div className="flex items-center space-x-1">
          {/* Archive Action */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onToggleArchive(session.id, !session.isArchived)}
            className="h-7 px-2 text-xs text-[var(--text-secondary)] hover:text-white"
            title={session.isArchived ? 'Unarchive Session' : 'Archive Session'}
          >
            <Archive className={cn('h-3.5 w-3.5', session.isArchived && 'text-indigo-400')} />
          </Button>

          {/* Duplicate Action */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDuplicate(session.id)}
            className="h-7 px-2 text-xs text-[var(--text-secondary)] hover:text-white"
            title="Duplicate Session Configuration"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>

          {/* Delete Action Modal */}
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                title="Delete Session"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Delete Interview Session?</span>
                </DialogTitle>
                <DialogDescription className="pt-2 text-xs text-[var(--text-secondary)]">
                  Are you sure you want to permanently delete this session for{' '}
                  <strong className="text-[var(--text-primary)]">{session.roleTitle}</strong>? All
                  recorded turns and transcripts will be permanently removed.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4 flex space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDeleteOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    onDelete(session.id);
                    setIsDeleteOpen(false);
                  }}
                  className="bg-red-600 text-xs font-semibold text-white hover:bg-red-500"
                >
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Continue / Review Launcher */}
        <Button asChild size="sm" className="h-7 bg-blue-600 text-xs font-semibold text-white">
          <Link href={`/interviews/${session.id}`}>
            {session.status === 'completed' ? (
              <>
                <RotateCcw className="mr-1 h-3 w-3" />
                <span>Review Room</span>
              </>
            ) : (
              <>
                <Play className="mr-1 h-3 w-3" />
                <span>Continue</span>
              </>
            )}
          </Link>
        </Button>
      </div>
    </div>
  );
}

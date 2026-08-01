'use client';

import * as React from 'react';
import { Play, Pause, RotateCcw, StopCircle, Clock, Save, ShieldCheck } from 'lucide-react';
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
import type { SessionStatus } from '../types/session-management.types';
import {
  endSessionAction,
  pauseSessionAction,
  restartSessionAction,
  resumeSessionAction,
} from '../actions/session-management.actions';
import { cn } from '@/lib/utils';

interface SessionControlBarProps {
  sessionId: string;
  status: SessionStatus;
  elapsedSeconds: number;
  lastSavedAt?: string | Date | null;
  onStatusChange?: (newStatus: SessionStatus) => void;
}

export function SessionControlBar({
  sessionId,
  status,
  elapsedSeconds: initialElapsed,
  lastSavedAt,
  onStatusChange,
}: SessionControlBarProps) {
  const [currentStatus, setCurrentStatus] = React.useState<SessionStatus>(status);
  const [seconds, setSeconds] = React.useState(initialElapsed);
  const [isRestartDialogOpen, setIsRestartDialogOpen] = React.useState(false);
  const [isEnding, setIsEnding] = React.useState(false);

  React.useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  React.useEffect(() => {
    setSeconds(initialElapsed);
  }, [initialElapsed]);

  // Timer ticker when session is in_progress
  React.useEffect(() => {
    if (currentStatus !== 'in_progress') return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStatus]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTogglePause = async () => {
    if (currentStatus === 'in_progress') {
      setCurrentStatus('paused');
      const res = await pauseSessionAction(sessionId);
      if (res.success && res.data) {
        onStatusChange?.(res.data.status);
      }
    } else if (currentStatus === 'paused' || currentStatus === 'created') {
      setCurrentStatus('in_progress');
      const res = await resumeSessionAction(sessionId);
      if (res.success && res.data) {
        onStatusChange?.(res.data.status);
      }
    }
  };

  const handleRestart = async () => {
    setIsRestartDialogOpen(false);
    setSeconds(0);
    setCurrentStatus('created');
    const res = await restartSessionAction(sessionId);
    if (res.success && res.data) {
      onStatusChange?.(res.data.status);
    }
  };

  const handleEndSession = async () => {
    setIsEnding(true);
    setCurrentStatus('completed');
    const res = await endSessionAction(sessionId, 'completed');
    if (res.success && res.data) {
      onStatusChange?.(res.data.status);
    }
    setIsEnding(false);
  };

  const isCompleted = currentStatus === 'completed' || currentStatus === 'terminated';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-3 text-xs shadow-sm">
      {/* Timer & Status Badge */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-2.5 py-1 font-mono text-sm font-bold text-[var(--text-primary)]">
          <Clock className="h-4 w-4 text-cyan-400" />
          <span>{formatTime(seconds)}</span>
        </div>

        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase',
            currentStatus === 'in_progress' &&
              'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
            currentStatus === 'paused' &&
              'animate-pulse border border-amber-500/20 bg-amber-500/10 text-amber-400',
            currentStatus === 'created' && 'border border-blue-500/20 bg-blue-500/10 text-blue-400',
            isCompleted && 'border border-gray-500/20 bg-gray-500/10 text-gray-400'
          )}
        >
          {currentStatus.replace('_', ' ')}
        </span>

        {/* Autosave Status */}
        <div className="hidden items-center space-x-1 text-[11px] text-[var(--text-secondary)] sm:flex">
          {lastSavedAt ? (
            <>
              <Save className="h-3 w-3 text-emerald-400" />
              <span>
                Autosaved at{' '}
                {typeof lastSavedAt === 'string'
                  ? lastSavedAt
                  : lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </>
          ) : (
            <>
              <ShieldCheck className="h-3 w-3 text-blue-400" />
              <span>Session Synced</span>
            </>
          )}
        </div>
      </div>

      {/* Control Actions */}
      {!isCompleted && (
        <div className="flex items-center space-x-2">
          {/* Pause / Resume Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTogglePause}
            className="space-x-1 text-xs"
          >
            {currentStatus === 'in_progress' ? (
              <>
                <Pause className="h-3.5 w-3.5 text-amber-400" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-emerald-400" />
                <span>Resume</span>
              </>
            )}
          </Button>

          {/* Restart Confirmation Dialog */}
          <Dialog open={isRestartDialogOpen} onOpenChange={setIsRestartDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="space-x-1 text-xs text-[var(--text-secondary)] hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Restart</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
              <DialogHeader>
                <DialogTitle className="text-base font-bold">
                  Restart Interview Session?
                </DialogTitle>
                <DialogDescription className="text-xs text-[var(--text-secondary)]">
                  This will clear all turn history for this session and start over from Question 1.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRestartDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="button" variant="danger" size="sm" onClick={handleRestart}>
                  Confirm Restart
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* End Session Button */}
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleEndSession}
            disabled={isEnding}
            className="space-x-1 text-xs"
          >
            <StopCircle className="h-3.5 w-3.5" />
            <span>End Session</span>
          </Button>
        </div>
      )}
    </div>
  );
}

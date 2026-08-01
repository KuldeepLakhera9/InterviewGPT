'use client';

import * as React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Bot,
  User,
  Film,
  Zap,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { InterviewTranscriptData } from '../types/transcript-system.types';
import { cn } from '@/lib/utils';

interface SessionReplayPlayerProps {
  transcript: InterviewTranscriptData;
}

export function SessionReplayPlayer({ transcript }: SessionReplayPlayerProps) {
  const turns = transcript.turns;
  const totalTurns = turns.length;

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [playbackSpeed, setPlaybackSpeed] = React.useState<1 | 1.5 | 2>(1);

  // Auto-play timer
  React.useEffect(() => {
    if (!isPlaying || totalTurns === 0) return;

    const baseDelayMs = 2500;
    const intervalMs = baseDelayMs / playbackSpeed;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= totalTurns - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, totalTurns]);

  const currentTurn = turns[currentIndex] || turns[0];
  const isInterviewer = currentTurn?.speaker === 'interviewer';

  const handleStepBack = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleStepForward = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalTurns - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  if (totalTurns === 0) {
    return (
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-8 text-center text-xs text-[var(--text-secondary)]">
        No turns recorded in session transcript for replay.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Replay Header */}
      <div className="flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center space-x-2 text-xl font-bold tracking-tight text-[var(--text-primary)]">
            <Film className="h-5 w-5 text-purple-400" />
            <span>Session Replay Simulator</span>
          </h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Replay turn-by-turn conversation flow with speed controls and timeline scrubber.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold text-blue-300">
            Turn {currentIndex + 1} of {totalTurns}
          </span>
        </div>
      </div>

      {/* Control Player Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm">
        {/* Play/Pause/Step Controls */}
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleStepBack}
            disabled={currentIndex === 0}
            className="h-8 w-8 p-0"
          >
            <SkipBack className="h-3.5 w-3.5" />
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-8 space-x-1.5 bg-purple-600 px-3 font-semibold text-white hover:bg-purple-500"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Play Replay</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleStepForward}
            disabled={currentIndex === totalTurns - 1}
            className="h-8 w-8 p-0"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Timeline Scrubber Range Input */}
        <div className="flex min-w-[200px] flex-1 items-center space-x-3 px-2">
          <input
            type="range"
            min={0}
            max={totalTurns - 1}
            value={currentIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentIndex(Number(e.target.value));
            }}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[var(--bg-surface-2)] accent-purple-500"
          />
        </div>

        {/* Speed Selector */}
        <div className="flex items-center space-x-1">
          <span className="mr-1 text-[10px] font-semibold text-[var(--text-secondary)]">
            Speed:
          </span>
          {([1, 1.5, 2] as const).map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => setPlaybackSpeed(spd)}
              className={cn(
                'rounded px-2 py-0.5 text-[10px] font-bold transition-all',
                playbackSpeed === spd
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:text-white'
              )}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Active Turn Spotlight Card */}
      {currentTurn && (
        <div className="space-y-4">
          <div
            className={cn(
              'space-y-3 rounded-2xl border p-6 shadow-md transition-all duration-300',
              isInterviewer
                ? 'border-blue-500/30 bg-gradient-to-r from-blue-950/30 to-indigo-950/20'
                : 'border-purple-500/30 bg-gradient-to-r from-purple-950/30 to-slate-900/20'
            )}
          >
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 text-xs">
              <div className="flex items-center space-x-2 font-bold">
                {isInterviewer ? (
                  <>
                    <Bot className="h-5 w-5 text-blue-400" />
                    <span className="text-sm text-blue-300">AI Lead Interviewer</span>
                  </>
                ) : (
                  <>
                    <User className="h-5 w-5 text-purple-400" />
                    <span className="text-sm text-purple-300">Candidate</span>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-[var(--text-secondary)]">
                <span className="rounded bg-[var(--bg-surface-2)] px-2.5 py-0.5 font-bold tracking-wider text-purple-300 uppercase">
                  {currentTurn.phase}
                </span>
                <span>
                  {new Date(currentTurn.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {currentTurn.questionTitle && (
              <div className="space-y-1 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs">
                <span className="flex items-center space-x-1.5 font-bold text-blue-300">
                  <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                  <span>Target Question: {currentTurn.questionTitle}</span>
                </span>
                {currentTurn.questionText && (
                  <p className="leading-relaxed text-[var(--text-secondary)] italic">
                    {currentTurn.questionText}
                  </p>
                )}
              </div>
            )}

            <p className="pt-1 text-sm leading-relaxed font-medium whitespace-pre-wrap text-[var(--text-primary)]">
              {currentTurn.messageText}
            </p>

            {currentTurn.metadata?.extractedStrength && (
              <div className="flex items-center space-x-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <Zap className="h-3.5 w-3.5 text-emerald-400" />
                <span>Extracted Strength: {currentTurn.metadata.extractedStrength}</span>
              </div>
            )}
          </div>

          {/* Full Session Timeline Strip */}
          <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm">
            <h3 className="text-xs font-bold tracking-wider text-[var(--text-primary)] uppercase">
              Replay Timeline Overview ({totalTurns} Turns)
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {turns.map((t, idx) => {
                const isActive = idx === currentIndex;
                const isSpkInterviewer = t.speaker === 'interviewer';
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentIndex(idx);
                    }}
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all',
                      isActive
                        ? 'scale-110 bg-purple-600 text-white shadow-md ring-2 ring-purple-400'
                        : isSpkInterviewer
                          ? 'bg-blue-500/10 text-blue-300 hover:bg-blue-500/20'
                          : 'bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
                    )}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

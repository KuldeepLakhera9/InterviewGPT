'use client';

import * as React from 'react';
import { Bot, Play, Pause, Square, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AiVoiceAvatarProps {
  isSpeaking: boolean;
  isPaused: boolean;
  interviewerName?: string;
  onPause: () => void;
  onResume: () => void;
  onInterrupt: () => void;
}

export function AiVoiceAvatar({
  isSpeaking,
  isPaused,
  interviewerName = 'InterviewGPT AI Lead',
  onPause,
  onResume,
  onInterrupt,
}: AiVoiceAvatarProps) {
  return (
    <div
      id="ai-voice-avatar-card"
      className="relative flex flex-col items-center justify-center rounded-2xl border border-purple-500/20 bg-gradient-to-b from-purple-950/40 to-black/60 p-6 text-center shadow-lg backdrop-blur-md"
    >
      {/* Animated Soundwave Aura */}
      <div className="relative flex items-center justify-center">
        {isSpeaking && (
          <>
            <div className="absolute h-28 w-28 animate-ping rounded-full bg-purple-500/20 duration-1000" />
            <div className="absolute h-24 w-24 animate-pulse rounded-full bg-indigo-500/30" />
          </>
        )}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-md ring-4 ring-purple-500/30">
          <Bot className="h-10 w-10 text-white" />
        </div>
      </div>

      {/* Interviewer Name & Speaking Status */}
      <div className="mt-4 space-y-1">
        <div className="flex items-center justify-center space-x-1.5">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <h4 className="text-sm font-bold text-white">{interviewerName}</h4>
        </div>
        <p className="text-xs font-semibold text-purple-300">
          {isSpeaking
            ? isPaused
              ? 'Paused Speech'
              : 'Speaking Question...'
            : 'Listening to Candidate...'}
        </p>
      </div>

      {/* Equalizer Bars Animation */}
      {isSpeaking && !isPaused && (
        <div className="mt-3 flex items-center justify-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="h-4 w-1 animate-bounce rounded-full bg-purple-400"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      )}

      {/* Control Buttons */}
      {isSpeaking && (
        <div className="mt-4 flex items-center space-x-2">
          {isPaused ? (
            <Button
              type="button"
              onClick={onResume}
              variant="outline"
              size="sm"
              className="h-7 space-x-1 text-xs"
            >
              <Play className="h-3 w-3" />
              <span>Resume</span>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onPause}
              variant="outline"
              size="sm"
              className="h-7 space-x-1 text-xs"
            >
              <Pause className="h-3 w-3" />
              <span>Pause</span>
            </Button>
          )}

          <Button
            type="button"
            onClick={onInterrupt}
            variant="outline"
            size="sm"
            className="h-7 space-x-1 border-rose-500/40 bg-rose-500/10 text-xs text-rose-300 hover:bg-rose-500/20"
          >
            <Square className="h-3 w-3" />
            <span>Interrupt</span>
          </Button>
        </div>
      )}
    </div>
  );
}

'use client';

import * as React from 'react';
import { Send, Bot, User, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { InterviewTurnData } from '../../conversation-engine/types/conversation-engine.types';
import { cn } from '@/lib/utils';

interface LiveTranscriptStreamProps {
  turns: InterviewTurnData[];
  isCompleted: boolean;
  isSending: boolean;
  messageInput: string;
  onInputChange: (val: string) => void;
  onSendTurn: (text?: string) => void;
  quickReplies?: string[];
  lastSavedAt?: Date | string | null;
}

export function LiveTranscriptStream({
  turns,
  isCompleted,
  isSending,
  messageInput,
  onInputChange,
  onSendTurn,
  quickReplies = [],
  lastSavedAt,
}: LiveTranscriptStreamProps) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendTurn();
    }
  };

  return (
    <div className="flex h-[75vh] flex-col space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm">
      {/* Stream Messages Container */}
      <div className="flex-1 scrollbar-thin space-y-3 overflow-y-auto pr-2">
        {turns.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-[var(--text-secondary)] italic">
            Session starting... Interviewer will introduce the first topic shortly.
          </div>
        ) : (
          turns.map((turn) => {
            const isInterviewer = turn.speaker === 'interviewer';
            return (
              <div
                key={turn.id}
                className={cn(
                  'flex max-w-[90%] flex-col space-y-1',
                  isInterviewer ? 'self-start' : 'ml-auto items-end self-end'
                )}
              >
                {/* Speaker Header */}
                <div className="flex items-center space-x-1.5 text-[11px] text-[var(--text-secondary)]">
                  {isInterviewer ? (
                    <>
                      <Bot className="h-3.5 w-3.5 text-blue-400" />
                      <span className="font-bold text-blue-300">AI Lead Interviewer</span>
                    </>
                  ) : (
                    <>
                      <User className="h-3.5 w-3.5 text-purple-400" />
                      <span className="font-bold text-purple-300">You (Candidate)</span>
                    </>
                  )}
                  <span>•</span>
                  <span>
                    {new Date(turn.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Message Bubble */}
                <div
                  className={cn(
                    'rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap shadow-sm',
                    isInterviewer
                      ? 'rounded-tl-sm border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-[var(--text-primary)]'
                      : 'rounded-tr-sm bg-blue-600 text-white'
                  )}
                >
                  {turn.messageText}
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* Quick Replies Bar */}
      {quickReplies.length > 0 && !isCompleted && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSendTurn(reply)}
              className="rounded-lg border border-blue-500/20 bg-[var(--bg-surface-2)] px-2.5 py-1 text-[11px] font-medium text-blue-300 transition-all hover:bg-blue-600/20 hover:text-white"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input Composer */}
      <div className="space-y-2 border-t border-[var(--border-subtle)] pt-2">
        {isCompleted ? (
          <div className="flex items-center justify-center space-x-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-xs font-bold text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Interview Session Completed! Evaluation transcript is ready.</span>
          </div>
        ) : (
          <div className="relative">
            <Textarea
              placeholder="Type your response to the interviewer... (Press Enter to send, Shift+Enter for newline)"
              value={messageInput}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              disabled={isSending}
              className="resize-none border-[var(--border-subtle)] bg-[var(--bg-surface-2)] pr-12 text-xs"
            />
            <Button
              type="button"
              size="sm"
              onClick={() => onSendTurn()}
              disabled={!messageInput.trim() || isSending}
              className="absolute right-2.5 bottom-2.5 h-8 w-8 bg-blue-600 p-0 text-white hover:bg-blue-500"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between px-1 text-[10px] text-[var(--text-secondary)]">
          <span>Shift + Enter for new lines</span>
          {lastSavedAt && (
            <span className="flex items-center space-x-1 text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              <span>Draft Autosaved</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

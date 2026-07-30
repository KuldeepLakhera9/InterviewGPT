'use client';

import * as React from 'react';
import {
  Bot,
  CheckCircle2,
  Clock,
  HelpCircle,
  History,
  Lightbulb,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
  User,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type {
  ResumeAssistantMessageRecord,
  ResumeAssistantSessionRecord,
} from '../types/resume.types';

interface ResumeAssistantViewProps {
  currentSession: ResumeAssistantSessionRecord | null;
  sessions: ResumeAssistantSessionRecord[];
  messages: ResumeAssistantMessageRecord[];
  isLoading: boolean;
  onSendMessage: (content: string, sessionId?: string) => Promise<void>;
  onSelectSession: (sessionId: string) => Promise<void>;
  onNewSession: () => void;
}

export function ResumeAssistantView({
  currentSession,
  sessions,
  messages,
  isLoading,
  onSendMessage,
  onSelectSession,
  onNewSession,
}: ResumeAssistantViewProps) {
  const [inputMessage, setInputMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const chatBottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSubmitting]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSubmitting) return;

    const content = inputMessage.trim();
    setInputMessage('');
    setIsSubmitting(true);
    try {
      await onSendMessage(content, currentSession?.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChipClick = async (chipText: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSendMessage(chipText, currentSession?.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickChips = [
    { label: 'Explain my ATS score', icon: Zap },
    { label: 'Why is my experience section weak?', icon: HelpCircle },
    { label: 'Recommend high-impact improvements', icon: Lightbulb },
    { label: 'Explain recruiter feedback', icon: Sparkles },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Column: Sessions List & Quick Questions */}
      <div className="space-y-6 lg:col-span-4">
        {/* Quick Action Chips Card */}
        <Card className="border border-blue-500/30 bg-gradient-to-b from-blue-950/20 via-[var(--bg-surface-1)] to-[var(--bg-surface-1)]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span>RAG Assistant Capabilities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickChips.map((chip, idx) => {
              const IconComp = chip.icon;
              return (
                <Button
                  key={idx}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleChipClick(chip.label)}
                  disabled={isSubmitting}
                  className="h-auto w-full justify-start border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 py-2 text-left text-xs text-[var(--text-primary)] hover:border-blue-500/40 hover:bg-blue-500/10"
                >
                  <IconComp className="mr-2 h-3.5 w-3.5 shrink-0 text-blue-400" />
                  <span className="truncate">{chip.label}</span>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Sessions History Drawer */}
        <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
              <History className="h-4 w-4 text-purple-400" />
              <span>Chat Threads ({sessions.length})</span>
            </CardTitle>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onNewSession}
              className="h-7 text-xs text-blue-400 hover:text-blue-300"
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> New Thread
            </Button>
          </CardHeader>
          <CardContent className="max-h-72 space-y-2 overflow-y-auto">
            {sessions.length === 0 ? (
              <p className="py-4 text-center text-xs text-[var(--text-secondary)] italic">
                No active conversations yet.
              </p>
            ) : (
              sessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onSelectSession(s.id)}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-2.5 text-xs ${
                    currentSession?.id === s.id
                      ? 'border-blue-500/40 bg-blue-500/10 font-bold text-blue-300'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface-2)] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                    <span className="truncate">{s.title}</span>
                  </div>
                  <span className="shrink-0 text-[10px] text-[var(--text-secondary)]">
                    {new Date(s.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Interactive Chat Thread */}
      <div className="lg:col-span-8">
        <Card className="flex h-[620px] flex-col border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          {/* Header */}
          <CardHeader className="border-b border-[var(--border-subtle)] pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-bold text-[var(--text-primary)]">
              <span className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-blue-400" />
                <span>Resume AI Career Coach</span>
              </span>
              <Badge
                variant="outline"
                className="border-blue-500/30 bg-blue-500/10 text-[10px] text-blue-400"
              >
                <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-400" /> RAG Context Active
              </Badge>
            </CardTitle>
          </CardHeader>

          {/* Messages Scroll View */}
          <CardContent className="flex-1 space-y-4 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-xs text-[var(--text-secondary)]">
                Loading session messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                  <Bot className="h-6 w-6" />
                </div>
                <div className="max-w-sm space-y-1">
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">
                    Ask me anything about your resume!
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">
                    I have full RAG access to your parsed sections, ATS analysis scores, and
                    weakness feedback.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-lg rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-tr-none bg-blue-600 text-white'
                        : 'rounded-tl-none border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="font-sans whitespace-pre-wrap">{msg.content}</div>

                    <div className="mt-2 flex items-center justify-between border-t stroke-zinc-700/50 pt-1 text-[10px] text-zinc-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="mr-0.5 h-3 w-3 opacity-70" />
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </span>

                      {msg.role === 'assistant' && Boolean(msg.metadata?.contextSources) && (
                        <span className="font-medium text-emerald-400">RAG Verified Context</span>
                      )}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))
            )}

            {isSubmitting && (
              <div className="flex items-center space-x-3 text-xs text-blue-400">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10">
                  <Bot className="h-4 w-4 animate-spin" />
                </div>
                <span className="animate-pulse">
                  Retrieving RAG resume context & generating response...
                </span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </CardContent>

          {/* Input Footer */}
          <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4">
            <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Ask about ATS score, weaknesses, improvements, or recruiter feedback..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isSubmitting}
                className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)] text-xs focus-visible:ring-blue-500"
              />
              <Button
                type="submit"
                disabled={isSubmitting || !inputMessage.trim()}
                className="bg-blue-600 px-4 text-xs text-white hover:bg-blue-500"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}

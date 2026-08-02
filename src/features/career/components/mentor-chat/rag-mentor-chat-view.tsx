'use client';

import * as React from 'react';
import { Bot, Send, User, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import type { RagMentorMessage } from '../../types/career.types';
import { sendRagMentorMessageAction } from '../../actions/career.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function RagMentorChatView() {
  const [messages, setMessages] = React.useState<RagMentorMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content:
        'Hello! I am your AI Career Mentor. I have full context on your resume, active career target (Google Senior Full Stack Engineer), recent mock interview evaluations, and skill graph. How can I help guide your preparation today?',
      citedSources: [
        'Candidate Profile & Resume Data',
        'Google Career Target Profile',
        'Recent Evaluation Scorecards',
      ],
      recommendedAction:
        'Ask me about ATS resume optimization or technical system design practice.',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [inputMsg, setInputMsg] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || isLoading) return;

    const userText = inputMsg;
    setInputMsg('');

    const userMessageObj: RagMentorMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessageObj]);
    setIsLoading(true);

    const res = await sendRagMentorMessageAction(userText);
    setIsLoading(false);

    if (res.success && res.data) {
      setMessages((prev) => [...prev, res.data!]);
    }
  };

  return (
    <div
      id="rag-mentor-chat-container"
      className="flex h-[550px] flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">RAG AI Career Mentor</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Personalized advice powered by RAG over your resume, evaluations, and goals.
            </p>
          </div>
        </div>

        <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-[10px] font-bold text-purple-300">
          RAG Context Connected
        </span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 space-y-4 overflow-y-auto py-4 pr-1 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
              }`}
            >
              {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div
                className={`rounded-xl p-3.5 leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-gray-200'
                }`}
              >
                <p>{msg.content}</p>
              </div>

              {/* Cited RAG Sources */}
              {msg.citedSources && msg.citedSources.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1 text-[9px]">
                  <span className="self-center text-gray-400">Cited Data:</span>
                  {msg.citedSources.map((source, idx) => (
                    <span
                      key={idx}
                      className="rounded border border-purple-500/20 bg-purple-500/10 px-1.5 py-0.5 font-semibold text-purple-300"
                    >
                      <ShieldCheck className="mr-0.5 inline h-2.5 w-2.5 text-purple-400" />
                      {source}
                    </span>
                  ))}
                </div>
              )}

              {/* Recommended Action Pill */}
              {msg.recommendedAction && (
                <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-left text-[11px] font-semibold text-emerald-300">
                  <span>Action: {msg.recommendedAction}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-purple-300 italic">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing candidate resume, evaluation reports, and target role specs...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="flex items-center space-x-2 border-t border-[var(--border-subtle)] pt-3"
      >
        <Input
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Ask your mentor (e.g. 'How should I improve my resume for Google?')..."
          className="bg-[var(--bg-surface-2)] text-xs text-white"
        />
        <Button
          type="submit"
          disabled={isLoading || !inputMsg.trim()}
          className="shrink-0 bg-purple-600 text-white hover:bg-purple-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

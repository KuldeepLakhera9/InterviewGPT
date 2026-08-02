'use client';

import * as React from 'react';
import { BookOpen } from 'lucide-react';
import type { LearningHubItemData } from '../../types/career.types';
import { cn } from '@/lib/utils';

interface LearningHubViewProps {
  items: LearningHubItemData[];
}

export function LearningHubView({ items }: LearningHubViewProps) {
  const [activeType, setActiveType] = React.useState<string>('all');
  const [flippedCards, setFlippedCards] = React.useState<Record<string, boolean>>({});
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, number>>({});

  const filteredItems = activeType === 'all' ? items : items.filter((i) => i.type === activeType);

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      id="learning-hub-container"
      className="space-y-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5 shadow-sm"
    >
      <div className="flex flex-col items-start justify-between space-y-2 border-b border-[var(--border-subtle)] pb-3 sm:flex-row sm:items-center sm:space-y-0">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-purple-400" />
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Centralized Learning Hub
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              AI-generated flashcards, practice quizzes, saved notes, and architectural resources.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'note', label: 'Study Notes' },
          { id: 'flashcard', label: 'AI Flashcards' },
          { id: 'quiz', label: 'AI Quizzes' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveType(tab.id)}
            className={cn(
              'rounded-lg px-3 py-1.5 font-semibold whitespace-nowrap transition-all',
              activeType === tab.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Item Display Grid */}
      <div className="grid gap-4 pt-2 sm:grid-cols-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{item.title}</span>
              <span className="rounded border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-300 uppercase">
                {item.type}
              </span>
            </div>

            {/* Note Type */}
            {item.type === 'note' && item.content.text && (
              <p className="rounded-lg border border-white/5 bg-black/40 p-3 text-xs leading-relaxed text-gray-300">
                {item.content.text}
              </p>
            )}

            {/* Flashcard Type */}
            {item.type === 'flashcard' && item.content.flashcards && (
              <div className="space-y-2">
                {item.content.flashcards.map((fc, idx) => {
                  const cardKey = `${item.id}-${idx}`;
                  const isFlipped = Boolean(flippedCards[cardKey]);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleFlip(cardKey)}
                      className="cursor-pointer space-y-2 rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 text-center text-xs transition-all hover:border-purple-400"
                    >
                      <span className="block text-[10px] font-bold text-purple-300 uppercase">
                        {isFlipped ? 'Answer (Click to Flip)' : 'Question (Click to Reveal Answer)'}
                      </span>
                      <p className="font-semibold text-white">
                        {isFlipped ? fc.answer : fc.question}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quiz Type */}
            {item.type === 'quiz' && item.content.quiz && (
              <div className="space-y-3 text-xs">
                {item.content.quiz.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="space-y-2 rounded-lg border border-white/5 bg-black/40 p-3"
                  >
                    <p className="font-bold text-white">{q.question}</p>
                    <div className="space-y-1">
                      {q.options.map((opt, optIdx) => {
                        const selectedKey = `${item.id}-${qIdx}`;
                        const isSelected = selectedAnswers[selectedKey] === optIdx;
                        const isCorrect = optIdx === q.correctAnswerIndex;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() =>
                              setSelectedAnswers((prev) => ({ ...prev, [selectedKey]: optIdx }))
                            }
                            className={cn(
                              'w-full rounded border p-2 text-left text-xs font-semibold transition-all',
                              isSelected
                                ? isCorrect
                                  ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                                  : 'border-rose-500/50 bg-rose-500/20 text-rose-300'
                                : 'border-[var(--border-subtle)] bg-[var(--bg-surface-1)] text-gray-300 hover:bg-slate-800'
                            )}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

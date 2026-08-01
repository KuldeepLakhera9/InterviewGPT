'use client';

import * as React from 'react';
import type { ConversationEngineState } from '../../conversation-engine/types/conversation-engine.types';
import { QuestionPanel } from './question-panel';
import { NotesPanel } from './notes-panel';
import { LiveTranscriptStream } from './live-transcript-stream';
import { InterviewProgressBar } from './interview-progress-bar';

interface LiveInterviewWorkspaceProps {
  sessionId: string;
  state: ConversationEngineState;
  isSending: boolean;
  messageInput: string;
  onInputChange: (val: string) => void;
  onSendTurn: (text?: string) => void;
  onStatusChange?: () => void;
  lastSavedAt?: Date | string | null;
}

export function LiveInterviewWorkspace({
  sessionId,
  state,
  isSending,
  messageInput,
  onInputChange,
  onSendTurn,
  onStatusChange,
  lastSavedAt,
}: LiveInterviewWorkspaceProps) {
  const activeQuestion = state.activeQuestion;
  const lastTurn = [...state.turns].reverse().find((t) => t.speaker === 'interviewer');
  const quickReplies = lastTurn?.metadata?.suggestedQuickReplies || [];

  return (
    <div className="space-y-4">
      {/* Top Header: Session Info, Progress Bar, Timer, & Interview Controls */}
      <InterviewProgressBar
        sessionId={sessionId}
        roleTitle={state.roleTitle}
        status={
          state.isCompleted
            ? 'completed'
            : state.phase === 'introduction'
              ? 'created'
              : 'in_progress'
        }
        currentQuestionIndex={state.currentQuestionIndex}
        totalQuestions={state.questions.length || 1}
        elapsedSeconds={0}
        durationMinutes={45}
        lastSavedAt={lastSavedAt}
        onStatusChange={onStatusChange}
      />

      {/* Main Minimal 3-Column Workspace Grid */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Left Column: Active Question Panel */}
        <div className="space-y-4 lg:col-span-4">
          <QuestionPanel
            question={
              activeQuestion
                ? {
                    questionId: activeQuestion.id,
                    title: activeQuestion.title,
                    questionText: activeQuestion.questionText,
                    category: activeQuestion.category,
                    topic: activeQuestion.topic,
                    difficulty: activeQuestion.difficulty,
                    expectedDurationMinutes: activeQuestion.expectedDurationSeconds
                      ? Math.round(activeQuestion.expectedDurationSeconds / 60)
                      : undefined,
                    companyTags: activeQuestion.companyTags,
                    roleTags: activeQuestion.roleTags,
                    evaluationCriteriaFocus: ((activeQuestion as unknown as Record<string, unknown>)
                      .evaluationCriteriaFocus as string[]) || [
                      'Algorithmic Correctness & Time/Space Complexity',
                      'Edge Case & Failure Mode Analysis',
                      'Communication & Structured Explanation',
                    ],
                  }
                : null
            }
            questionIndex={state.currentQuestionIndex}
            totalQuestions={state.questions.length || 1}
          />
        </div>

        {/* Center Column: Live Transcript Stream & Composer */}
        <div className="lg:col-span-5">
          <LiveTranscriptStream
            turns={state.turns}
            isCompleted={state.isCompleted}
            isSending={isSending}
            messageInput={messageInput}
            onInputChange={onInputChange}
            onSendTurn={onSendTurn}
            quickReplies={quickReplies}
            lastSavedAt={lastSavedAt}
          />
        </div>

        {/* Right Column: Private Candidate Notes Panel */}
        <div className="lg:col-span-3">
          <NotesPanel sessionId={sessionId} />
        </div>
      </div>
    </div>
  );
}

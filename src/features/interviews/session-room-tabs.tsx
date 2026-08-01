'use client';

import * as React from 'react';
import { MessageSquare, FileText, Film, Award, Loader2 } from 'lucide-react';
import { InterviewConversationRoom } from './conversation-engine/components/interview-conversation-room';
import { TranscriptViewer } from './transcript-system/components/transcript-viewer';
import { SessionReplayPlayer } from './transcript-system/components/session-replay-player';
import type { InterviewTranscriptData } from './transcript-system/types/transcript-system.types';
import { getInterviewTranscriptAction } from './transcript-system/actions/transcript-system.actions';
import {
  getSessionEvaluationAction,
  CandidateIntelligenceReportView,
  type CandidateIntelligenceReportData,
} from '../evaluation';
import { cn } from '@/lib/utils';

interface SessionRoomTabsProps {
  sessionId: string;
  initialTranscript?: InterviewTranscriptData | null;
}

export function SessionRoomTabs({ sessionId, initialTranscript }: SessionRoomTabsProps) {
  const [activeTab, setActiveTab] = React.useState<'room' | 'transcript' | 'replay' | 'evaluation'>(
    'room'
  );
  const [transcript, setTranscript] = React.useState<InterviewTranscriptData | null>(
    initialTranscript || null
  );
  const [evaluationReport, setEvaluationReport] =
    React.useState<CandidateIntelligenceReportData | null>(null);
  const [isLoadingTranscript, setIsLoadingTranscript] = React.useState(false);
  const [isLoadingEvaluation, setIsLoadingEvaluation] = React.useState(false);

  const fetchTranscriptData = React.useCallback(async () => {
    setIsLoadingTranscript(true);
    try {
      const res = await getInterviewTranscriptAction(sessionId);
      if (res.success && res.data) {
        setTranscript(res.data);
      }
    } catch (err) {
      console.error('Failed to load session transcript:', err);
    } finally {
      setIsLoadingTranscript(false);
    }
  }, [sessionId]);

  const fetchEvaluationData = React.useCallback(async () => {
    setIsLoadingEvaluation(true);
    try {
      const res = await getSessionEvaluationAction(sessionId);
      if (res.success && res.data) {
        setEvaluationReport(res.data);
      }
    } catch (err) {
      console.error('Failed to load evaluation report:', err);
    } finally {
      setIsLoadingEvaluation(false);
    }
  }, [sessionId]);

  const handleTabChange = (tab: 'room' | 'transcript' | 'replay' | 'evaluation') => {
    setActiveTab(tab);
    if ((tab === 'transcript' || tab === 'replay') && !transcript) {
      fetchTranscriptData();
    }
    if (tab === 'evaluation' && !evaluationReport) {
      fetchEvaluationData();
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Tab Switcher */}
      <div className="flex items-center space-x-1 overflow-x-auto border-b border-[var(--border-subtle)] pb-2 text-xs">
        <button
          type="button"
          onClick={() => handleTabChange('room')}
          className={cn(
            'flex items-center space-x-1.5 rounded-lg px-3 py-1.5 font-semibold transition-all',
            activeTab === 'room'
              ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
              : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
          )}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Live Conversation Room</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('transcript')}
          className={cn(
            'flex items-center space-x-1.5 rounded-lg px-3 py-1.5 font-semibold transition-all',
            activeTab === 'transcript'
              ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
              : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
          )}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Transcript Inspector</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('replay')}
          className={cn(
            'flex items-center space-x-1.5 rounded-lg px-3 py-1.5 font-semibold transition-all',
            activeTab === 'replay'
              ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
              : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
          )}
        >
          <Film className="h-3.5 w-3.5" />
          <span>Session Replay</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('evaluation')}
          className={cn(
            'flex items-center space-x-1.5 rounded-lg px-3 py-1.5 font-semibold transition-all',
            activeTab === 'evaluation'
              ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
              : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
          )}
        >
          <Award className="h-3.5 w-3.5 text-emerald-300" />
          <span>AI Evaluation Report</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'room' && <InterviewConversationRoom sessionId={sessionId} />}

      {activeTab === 'transcript' && (
        <>
          {isLoadingTranscript || !transcript ? (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-8 text-center text-xs text-[var(--text-secondary)]">
              Loading transcript data...
            </div>
          ) : (
            <TranscriptViewer transcript={transcript} />
          )}
        </>
      )}

      {activeTab === 'replay' && (
        <>
          {isLoadingTranscript || !transcript ? (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-8 text-center text-xs text-[var(--text-secondary)]">
              Loading session replay data...
            </div>
          ) : (
            <SessionReplayPlayer transcript={transcript} />
          )}
        </>
      )}

      {activeTab === 'evaluation' && (
        <>
          {isLoadingEvaluation || !evaluationReport ? (
            <div className="flex flex-col items-center justify-center space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-12 text-center text-xs text-[var(--text-secondary)]">
              <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
              <span>
                Analyzing interview transcript & generating Candidate Intelligence Report...
              </span>
            </div>
          ) : (
            <CandidateIntelligenceReportView report={evaluationReport} />
          )}
        </>
      )}
    </div>
  );
}

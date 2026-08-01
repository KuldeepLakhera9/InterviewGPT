import type { QuestionDifficulty } from '../../question-bank/types/question-bank.types';

export type SessionStatus = 'created' | 'in_progress' | 'paused' | 'completed' | 'terminated';

export type SessionLifecycleAction = 'start' | 'pause' | 'resume' | 'restart' | 'end' | 'terminate';

export interface SessionSummaryData {
  id: string;
  userId: string;
  workspaceId: string;
  roleTitle: string;
  seniorityLevel: string;
  companyName: string;
  companyTier: string;
  track: string;
  difficulty: QuestionDifficulty;
  durationMinutes: number;
  focusAreas: string[];
  adaptiveMode: boolean;
  status: SessionStatus;
  startedAt?: string | null;
  pausedAt?: string | null;
  endedAt?: string | null;
  elapsedSeconds: number;
  turnsCount: number;
  lastActiveTopic?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SessionFilterParams {
  status?: SessionStatus | 'all';
  track?: string | 'all';
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export interface SessionHistoryQueryResult {
  items: SessionSummaryData[];
  total: number;
  page: number;
  totalPages: number;
}

export interface SessionAutosaveDraft {
  sessionId: string;
  draftText: string;
  lastSavedAt: string;
}

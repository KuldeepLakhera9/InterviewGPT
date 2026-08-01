import type { QuestionDifficulty } from '../../question-bank/types/question-bank.types';

export type InterviewStatusFilter =
  'all' | 'created' | 'in_progress' | 'paused' | 'completed' | 'archived' | 'terminated';

export interface HistorySessionItem {
  id: string;
  roleTitle: string;
  seniorityLevel: string;
  companyName: string;
  companyTier: string;
  track: string;
  difficulty: QuestionDifficulty;
  durationMinutes: number;
  status: string;
  isArchived: boolean;
  startedAt?: string | null;
  endedAt?: string | null;
  elapsedSeconds: number;
  turnsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryFilterParams {
  searchQuery?: string;
  status?: InterviewStatusFilter;
  track?: string | 'all';
  difficulty?: QuestionDifficulty | 'all';
  showArchivedOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface HistoryQueryResult {
  items: HistorySessionItem[];
  total: number;
  page: number;
  totalPages: number;
  stats: {
    totalSessions: number;
    inProgressSessions: number;
    completedSessions: number;
    archivedSessions: number;
  };
}

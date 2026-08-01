import type { QuestionDifficulty } from '../../question-bank/types/question-bank.types';
import type {
  TurnSpeaker,
  InterviewPhase,
} from '../../conversation-engine/types/conversation-engine.types';

export type { TurnSpeaker, InterviewPhase };
export type ExportFormat = 'json' | 'markdown' | 'text';

export interface TranscriptTurnItem {
  id: string;
  turnIndex: number;
  speaker: TurnSpeaker;
  messageText: string;
  questionId?: string | null;
  questionTitle?: string | null;
  questionText?: string | null;
  phase: InterviewPhase;
  topic?: string | null;
  difficulty?: QuestionDifficulty | null;
  metadata?: {
    extractedStrength?: string;
    extractedGap?: string;
    mentionedExperience?: string;
    suggestedQuickReplies?: string[];
    followUpCount?: number;
  };
  createdAt: string;
}

export interface TranscriptMetadata {
  sessionId: string;
  roleTitle: string;
  seniorityLevel: string;
  companyName: string;
  companyTier: string;
  track: string;
  difficulty: QuestionDifficulty;
  durationMinutes: number;
  status: string;
  startedAt?: string | null;
  endedAt?: string | null;
  elapsedSeconds: number;
  totalTurns: number;
}

export interface InterviewTranscriptData {
  metadata: TranscriptMetadata;
  turns: TranscriptTurnItem[];
}

export interface TranscriptSearchParams {
  query?: string;
  speaker?: TurnSpeaker | 'all';
  phase?: InterviewPhase | 'all';
  topic?: string | 'all';
}

export interface ReplayState {
  currentTurnIndex: number;
  isPlaying: boolean;
  playbackSpeed: 1 | 1.5 | 2;
  totalTurns: number;
}

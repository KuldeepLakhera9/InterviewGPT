import type { QuestionDifficulty } from '../../question-bank/types/question-bank.types';

export interface CandidateNotesState {
  sessionId: string;
  notesText: string;
  lastSavedAt: string | null;
}

export interface QuestionPanelData {
  questionId?: string;
  title: string;
  questionText: string;
  category: string;
  topic: string;
  difficulty: QuestionDifficulty;
  expectedDurationMinutes?: number;
  companyTags?: string[];
  roleTags?: string[];
  evaluationCriteriaFocus?: string[];
}

import type {
  QuestionBankItemData,
  QuestionDifficulty,
} from '../../question-bank/types/question-bank.types';

export type InterviewPhase =
  'introduction' | 'question_presentation' | 'followup_probe' | 'topic_transition' | 'wrap_up';

export type TurnSpeaker = 'interviewer' | 'candidate' | 'system';

export interface InterviewTurnData {
  id: string;
  sessionId: string;
  turnIndex: number;
  speaker: TurnSpeaker;
  messageText: string;
  questionId?: string | null;
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

export interface InterviewMemoryState {
  candidateStrengths: string[];
  candidateGaps: string[];
  topicsCovered: string[];
  discussedExperiences: string[];
  currentFollowUpCount: number;
}

export interface ConversationEngineState {
  sessionId: string;
  roleTitle: string;
  seniorityLevel: string;
  companyName: string;
  track: string;
  difficulty: QuestionDifficulty;
  adaptiveMode: boolean;
  phase: InterviewPhase;
  currentQuestionIndex: number;
  activeQuestion: QuestionBankItemData | null;
  questions: QuestionBankItemData[];
  memory: InterviewMemoryState;
  turns: InterviewTurnData[];
  isCompleted: boolean;
}

export interface FollowUpDecision {
  action: 'ask_followup' | 'transition_next_question' | 'wrap_up_interview';
  probeType?: 'shallow' | 'intermediate' | 'deep' | 'challenge';
  reason: string;
  nextDifficulty?: QuestionDifficulty;
}

export interface InterviewerTurnResult {
  interviewerMessage: string;
  phase: InterviewPhase;
  suggestedQuickReplies?: string[];
  memoryNotes?: {
    extractedStrength?: string;
    extractedGap?: string;
    mentionedExperience?: string;
  };
  isFallback?: boolean;
}

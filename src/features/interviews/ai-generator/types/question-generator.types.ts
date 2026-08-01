import type {
  EvaluationMetadata,
  FollowUpReference,
  QuestionBankItemData,
  QuestionCategory,
  QuestionDifficulty,
} from '../../question-bank/types/question-bank.types';

export interface QuestionGeneratorInput {
  roleTitle: string;
  seniorityLevel: 'junior' | 'mid' | 'senior' | 'staff';
  companyName?: string;
  companyTier: 'faang' | 'startup' | 'enterprise' | 'fintech' | 'early_stage';
  track: 'technical' | 'system_design' | 'behavioral' | 'full_loop';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  targetQuestionCount?: number; // default: 3
  resumeId?: string;
  resumeText?: string;
  resumeSkills?: string[];
  candidateProfileHeadline?: string;
  candidateProfileBio?: string;
  jobDescriptionText?: string;
  existingQuestionTitles?: string[];
  saveToQuestionBank?: boolean;
}

export interface GeneratedQuestionItem {
  title: string;
  questionText: string;
  category: QuestionCategory;
  topic: string;
  difficulty: QuestionDifficulty;
  companyTags: string[];
  roleTags: string[];
  expectedDurationSeconds: number;
  followUpReferences: FollowUpReference[];
  evaluationMetadata: EvaluationMetadata;
}

export interface GeneratedQuestionSet {
  generationSummary: string;
  questions: GeneratedQuestionItem[];
}

export interface GenerateQuestionsResult {
  success: boolean;
  data?: {
    summary: string;
    questions: QuestionBankItemData[];
    isFallback: boolean;
  };
  error?: string;
}

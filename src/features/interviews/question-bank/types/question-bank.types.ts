export type QuestionCategory =
  'technical' | 'system_design' | 'behavioral' | 'coding' | 'architecture';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type QuestionSource = 'system' | 'ai_generated' | 'user_custom';

export interface FollowUpReference {
  id: string;
  promptText: string;
  targetDepth: 'shallow' | 'intermediate' | 'deep';
  hint?: string;
}

export interface ScoringCriterion {
  pillar: 'technical_depth' | 'communication' | 'problem_solving' | 'star_framework';
  weight: number; // 0.0 to 1.0
  description: string;
}

export interface EvaluationMetadata {
  idealAnswerOutline: string;
  keyConcepts: string[];
  tradeOffPoints: string[];
  scoringCriteria: ScoringCriterion[];
  sampleGoodResponse?: string;
  sampleWeakResponse?: string;
}

export interface QuestionBankItemData {
  id: string;
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
  isAiGenerated: boolean;
  source: QuestionSource;
  createdById?: string | null;
  workspaceId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionInput {
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
  isAiGenerated?: boolean;
  source?: QuestionSource;
}

export interface QuestionFilterParams {
  category?: QuestionCategory | 'all';
  difficulty?: QuestionDifficulty | 'all';
  topic?: string;
  companyTag?: string;
  roleTag?: string;
  source?: QuestionSource | 'all';
  isAiGenerated?: boolean;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export interface QuestionQueryResult {
  items: QuestionBankItemData[];
  total: number;
  page: number;
  totalPages: number;
  availableCategories: string[];
  availableTopics: string[];
  availableCompanyTags: string[];
  availableRoleTags: string[];
}

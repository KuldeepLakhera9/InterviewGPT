export type SeniorityLevel = 'junior' | 'mid' | 'senior' | 'staff';
export type CompanyTier = 'faang' | 'startup' | 'enterprise' | 'fintech' | 'early_stage';
export type InterviewTrack = 'technical' | 'system_design' | 'behavioral' | 'full_loop';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';
export type InterviewDuration = 15 | 30 | 45 | 60;

export interface InterviewConfigData {
  roleTitle: string;
  seniorityLevel: SeniorityLevel;
  companyName: string;
  companyTier: CompanyTier;
  track: InterviewTrack;
  difficulty: DifficultyLevel;
  durationMinutes: InterviewDuration;
  focusAreas: string[];
  adaptiveDifficulty: boolean;
}

export interface StepStatus {
  stepNumber: number;
  title: string;
  subtitle: string;
  isCompleted: boolean;
  isValid: boolean;
}

export interface InterviewPresetItem {
  id: string;
  name: string;
  description?: string;
  config: InterviewConfigData;
  isSystem?: boolean;
  createdAt?: string;
}

export interface ResumeRecommendationItem {
  resumeId: string;
  resumeFileName: string;
  suggestedRoleTitle: string;
  suggestedSeniority: SeniorityLevel;
  suggestedTrack: InterviewTrack;
  suggestedDifficulty: DifficultyLevel;
  suggestedFocusAreas: string[];
  matchScore: number;
  rationale: string;
}

export interface InterviewWizardState {
  currentStep: number;
  completionPercentage: number;
  data: InterviewConfigData;
  presets: InterviewPresetItem[];
  recommendation?: ResumeRecommendationItem;
  updatedAt?: string;
}

export interface SaveInterviewDraftResult {
  success: boolean;
  message?: string;
  error?: string;
  completionPercentage?: number;
}

export interface SaveInterviewPresetResult {
  success: boolean;
  preset?: InterviewPresetItem;
  message?: string;
  error?: string;
}

export interface DeleteInterviewPresetResult {
  success: boolean;
  presetId?: string;
  message?: string;
  error?: string;
}

export interface CreateInterviewSessionResult {
  success: boolean;
  sessionId?: string;
  redirectTo?: string;
  message?: string;
  error?: string;
}

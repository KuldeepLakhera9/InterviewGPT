export interface ResumeItem {
  id: string;
  workspaceId: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileKey: string;
  fileSize: number;
  mimeType: string;
  version: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeActionResult {
  success: boolean;
  message?: string;
  error?: string;
  resume?: ResumeItem;
  resumes?: ResumeItem[];
}

export interface ResumeUploadProgress {
  status: 'idle' | 'validating' | 'uploading' | 'completed' | 'error';
  progress: number;
  fileName?: string;
  error?: string;
}

export interface ParsedResumeRecord {
  id: string;
  resumeId: string;
  rawText: string;
  cleanedText: string;
  structuredData: Record<string, unknown>;
  confidenceScores: Record<string, number>;
  overallConfidence: number;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedResumeActionResult {
  success: boolean;
  message?: string;
  error?: string;
  parsedResume?: ParsedResumeRecord;
}

export interface AtsWeakSection {
  section: string;
  issue: string;
  recommendation: string;
}

export interface AtsSuggestion {
  category: string;
  suggestion: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface AtsFormattingFeedback {
  item: string;
  status: 'Pass' | 'Warning' | 'Fail';
  details: string;
}

export interface AtsAnalysisRecord {
  id: string;
  resumeId: string;
  atsScore: number;
  recruiterScore: number;
  missingKeywords: string[];
  weakSections: AtsWeakSection[];
  strengths: string[];
  suggestions: AtsSuggestion[];
  formattingFeedback: AtsFormattingFeedback[];
  createdAt: string;
  updatedAt: string;
}

export interface AtsAnalysisActionResult {
  success: boolean;
  message?: string;
  error?: string;
  atsAnalysis?: AtsAnalysisRecord;
}

export interface OptimisedBullet {
  original: string;
  rewritten: string;
  actionVerb: string;
  impactGain: string;
}

export interface ActionVerbSuggestion {
  weakVerb: string;
  suggestedVerbs: string[];
}

export interface MeasurableImpactSuggestion {
  bullet: string;
  metricSuggestion: string;
}

export interface ResumeOptimisationRecord {
  id: string;
  resumeId: string;
  originalSummary: string;
  optimisedSummary: string;
  originalBullets: string[];
  optimisedBullets: OptimisedBullet[];
  strongerActionVerbs: ActionVerbSuggestion[];
  measurableImpactItems: MeasurableImpactSuggestion[];
  optimisedTextContent: string;
  createdAt: string;
}

export interface ResumeOptimisationActionResult {
  success: boolean;
  message?: string;
  error?: string;
  optimisation?: ResumeOptimisationRecord;
  history?: ResumeOptimisationRecord[];
}

export interface KeywordGapItem {
  keyword: string;
  significance: string;
}

export interface RecommendedImprovementItem {
  area: string;
  suggestion: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface LearningResourceItem {
  title: string;
  platform: string;
  link: string;
  reason: string;
}

export interface JobMatchRecord {
  id: string;
  resumeId: string;
  jobTitle: string;
  companyName: string;
  jobDescriptionText: string;
  overallMatchPercentage: number;
  missingSkills: string[];
  keywordGaps: KeywordGapItem[];
  recommendedImprovements: RecommendedImprovementItem[];
  recommendedLearningResources: LearningResourceItem[];
  createdAt: string;
}

export interface JobMatchActionResult {
  success: boolean;
  message?: string;
  error?: string;
  jobMatch?: JobMatchRecord;
  history?: JobMatchRecord[];
}

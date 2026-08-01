export type HiringRecommendationType =
  'Strong Hire' | 'Hire' | 'Lean Hire' | 'Lean Reject' | 'Reject';

export type ReadinessRating =
  'ready_now' | 'ready_with_minor_coaching' | 'needs_significant_upskilling' | 'not_recommended';

export type VerbosityAssessment = 'concise' | 'balanced' | 'overly_verbose' | 'brief';

export interface AnswerScores {
  technicalAccuracy: number;
  completeness: number;
  relevance: number;
  clarity: number;
  structure: number;
  examplesUsed: number;
  depthOfKnowledge: number;
  communication: number;
}

export interface AnswerEvaluationData {
  turnId: string;
  turnIndex: number;
  questionText: string;
  candidateAnswer: string;
  scores: AnswerScores;
  overallAnswerScore: number;
  strengths: string[];
  gaps: string[];
  keyConceptsCovered: string[];
  keyConceptsMissed: string[];
  feedbackSummary: string;
  improvedAnswerOutline: string;
}

export interface FillerWordMetric {
  word: string;
  count: number;
}

export interface CommunicationMetricsData {
  grammarScore: number;
  vocabularyScore: number;
  clarityScore: number;
  sentenceStructureScore: number;
  concisenessScore: number;
  professionalToneScore: number;
  readabilityGrade: string;
  overallCommunicationScore: number;
  fillerWordMetrics: {
    totalFillerCount: number;
    frequentlyUsedFillers: FillerWordMetric[];
    fillerDensityPercentage: number;
  };
  responseLengthAnalysis: {
    averageWordsPerTurn: number;
    verbosityAssessment: VerbosityAssessment;
    totalWords: number;
  };
  feedback: {
    strengths: string[];
    actionableTips: string[];
  };
}

export interface StarPhaseData {
  score: number;
  summary: string;
  isMissing: boolean;
  hasQuantifiableMetrics?: boolean;
}

export interface StarFrameworkData {
  isStarApplicable: boolean;
  overallStarScore: number;
  situation: StarPhaseData;
  task: StarPhaseData;
  action: StarPhaseData;
  result: StarPhaseData;
  missingSections: string[];
  improvementSuggestions: string[];
}

export type SkillCategory =
  | 'programming_languages'
  | 'frameworks'
  | 'libraries'
  | 'databases'
  | 'cloud_platforms'
  | 'devops_tools'
  | 'ai_ml_skills'
  | 'soft_skills';

export interface IdentifiedSkill {
  name: string;
  category: SkillCategory;
  proficiencyScore: number; // 0-100
  demonstratedDepth: 'basic' | 'intermediate' | 'expert';
  mentionCount: number;
}

export interface SkillGraphData {
  skills: IdentifiedSkill[];
  categoryBreakdown: Record<SkillCategory, number>;
  topSkills: string[];
  skillsToDevelop: string[];
}

export interface KnowledgeGapItem {
  concept: string;
  topic: string;
  severity: 'critical' | 'moderate' | 'minor';
  missingTerminology: string[];
  observedDeficit: string;
  recommendation: string;
  priorityOrder: number;
}

export interface ConfidenceAnalysisData {
  overallConfidenceScore: number; // 0-100
  consistencyScore: number; // 0-100
  explanationQualityScore: number; // 0-100
  decisionJustificationScore: number; // 0-100
  uncertaintyLanguageFrequency: {
    count: number;
    phrases: string[];
  };
  keyObservations: string[];
  disclaimerNote: string;
}

export interface HiringRecommendationData {
  recommendation: HiringRecommendationType;
  recommendationScore: number;
  confidenceScore: number;
  executiveSummary: string;
  evidenceJustification: {
    technicalEvidence: string[];
    communicationEvidence: string[];
    culturalAndBehaviouralEvidence: string[];
    concernsAndRisks: string[];
  };
  readinessRating: ReadinessRating;
  nextStepsForRecruiter: string[];
}

export interface DailyPlanItem {
  day: number;
  focusTopic: string;
  activity: string;
  estimatedHours: number;
}

export interface WeeklyRoadmapItem {
  week: number;
  theme: string;
  goals: string[];
  milestone: string;
}

export interface MonthlyRoadmapItem {
  month: number;
  milestoneTitle: string;
  keyDeliverables: string[];
}

export interface RecommendedProject {
  title: string;
  description: string;
  technologies: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface RecommendedQuestion {
  questionText: string;
  topic: string;
  category: 'technical' | 'system_design' | 'behavioral';
}

export interface LearningResource {
  title: string;
  type: 'documentation' | 'book' | 'video' | 'interactive_lab';
  urlOrReference: string;
}

export interface LearningRoadmapData {
  dailyPlan: DailyPlanItem[];
  weeklyRoadmap: WeeklyRoadmapItem[];
  monthlyRoadmap: MonthlyRoadmapItem[];
  recommendedProjects: RecommendedProject[];
  recommendedQuestions: RecommendedQuestion[];
  learningResources: LearningResource[];
  practiceSchedule: {
    recommendedInterviewsPerWeek: number;
    targetAreasToPractice: string[];
  };
}

export interface RecommendedNextSession {
  roleTitle: string;
  track: string;
  difficulty: string;
  focusAreas: string[];
}

export interface CandidateIntelligenceReportData {
  id?: string;
  sessionId: string;
  workspaceId: string;
  userId: string;
  executiveSummary: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  behaviouralScore: number;
  strengths: string[];
  weaknesses: string[];
  hiringRecommendation: HiringRecommendationType;
  hiringJustification: string;
  answerEvaluations: AnswerEvaluationData[];
  communicationMetrics: CommunicationMetricsData;
  starFramework: StarFrameworkData;
  skillGraph: SkillGraphData;
  knowledgeGaps: KnowledgeGapItem[];
  confidenceAnalysis: ConfidenceAnalysisData;
  learningRoadmap: LearningRoadmapData;
  recommendedNextSession: RecommendedNextSession;
  createdAt?: string;
}

export interface ScoreTrendPoint {
  date: string;
  sessionId: string;
  roleTitle: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  behaviouralScore: number;
}

export interface ProgressTimelineEvent {
  date: string;
  title: string;
  description: string;
  scoreChange: number; // e.g. +5
  badge?: string;
}

export interface CandidateAnalyticsSummary {
  totalInterviewsCompleted: number;
  averageOverallScore: number;
  averageTechnicalScore: number;
  averageCommunicationScore: number;
  averageBehaviouralScore: number;
  hiringReadinessTrend: {
    currentStatus: HiringRecommendationType;
    readyPercentage: number; // 0-100
    improvementRate: number; // e.g. +12% over last 5 interviews
  };
  scoreTrends: ScoreTrendPoint[];
  skillRadar: {
    subject: string;
    score: number; // 0-100
    fullMark: number;
  }[];
  weakTopics: { topic: string; occurrenceCount: number; averageDeficitScore: number }[];
  strongTopics: { topic: string; occurrenceCount: number; averageMasteryScore: number }[];
  progressTimeline: ProgressTimelineEvent[];
}

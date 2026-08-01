import { z } from 'zod';

export const hiringRecommendationSchema = z.enum([
  'Strong Hire',
  'Hire',
  'Lean Hire',
  'Lean Reject',
  'Reject',
]);

export const answerScoresSchema = z.object({
  technicalAccuracy: z.number().min(0).max(100),
  completeness: z.number().min(0).max(100),
  relevance: z.number().min(0).max(100),
  clarity: z.number().min(0).max(100),
  structure: z.number().min(0).max(100),
  examplesUsed: z.number().min(0).max(100),
  depthOfKnowledge: z.number().min(0).max(100),
  communication: z.number().min(0).max(100),
});

export const answerEvaluationSchema = z.object({
  turnId: z.string(),
  turnIndex: z.number(),
  questionText: z.string(),
  candidateAnswer: z.string(),
  scores: answerScoresSchema,
  overallAnswerScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  keyConceptsCovered: z.array(z.string()),
  keyConceptsMissed: z.array(z.string()),
  feedbackSummary: z.string(),
  improvedAnswerOutline: z.string(),
});

export const communicationMetricsSchema = z.object({
  grammarScore: z.number().min(0).max(100),
  vocabularyScore: z.number().min(0).max(100),
  clarityScore: z.number().min(0).max(100),
  sentenceStructureScore: z.number().min(0).max(100),
  concisenessScore: z.number().min(0).max(100),
  professionalToneScore: z.number().min(0).max(100),
  readabilityGrade: z.string(),
  overallCommunicationScore: z.number().min(0).max(100),
  fillerWordMetrics: z.object({
    totalFillerCount: z.number(),
    frequentlyUsedFillers: z.array(z.object({ word: z.string(), count: z.number() })),
    fillerDensityPercentage: z.number(),
  }),
  responseLengthAnalysis: z.object({
    averageWordsPerTurn: z.number(),
    verbosityAssessment: z.enum(['concise', 'balanced', 'overly_verbose', 'brief']),
    totalWords: z.number(),
  }),
  feedback: z.object({
    strengths: z.array(z.string()),
    actionableTips: z.array(z.string()),
  }),
});

export const starPhaseSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  isMissing: z.boolean(),
  hasQuantifiableMetrics: z.boolean().optional(),
});

export const starFrameworkSchema = z.object({
  isStarApplicable: z.boolean(),
  overallStarScore: z.number().min(0).max(100),
  situation: starPhaseSchema,
  task: starPhaseSchema,
  action: starPhaseSchema,
  result: starPhaseSchema,
  missingSections: z.array(z.string()),
  improvementSuggestions: z.array(z.string()),
});

export const skillCategorySchema = z.enum([
  'programming_languages',
  'frameworks',
  'libraries',
  'databases',
  'cloud_platforms',
  'devops_tools',
  'ai_ml_skills',
  'soft_skills',
]);

export const identifiedSkillSchema = z.object({
  name: z.string(),
  category: skillCategorySchema,
  proficiencyScore: z.number().min(0).max(100),
  demonstratedDepth: z.enum(['basic', 'intermediate', 'expert']),
  mentionCount: z.number(),
});

export const skillGraphSchema = z.object({
  skills: z.array(identifiedSkillSchema),
  categoryBreakdown: z.record(z.string(), z.number()),
  topSkills: z.array(z.string()),
  skillsToDevelop: z.array(z.string()),
});

export const knowledgeGapItemSchema = z.object({
  concept: z.string(),
  topic: z.string(),
  severity: z.enum(['critical', 'moderate', 'minor']),
  missingTerminology: z.array(z.string()),
  observedDeficit: z.string(),
  recommendation: z.string(),
  priorityOrder: z.number(),
});

export const confidenceAnalysisSchema = z.object({
  overallConfidenceScore: z.number().min(0).max(100),
  consistencyScore: z.number().min(0).max(100),
  explanationQualityScore: z.number().min(0).max(100),
  decisionJustificationScore: z.number().min(0).max(100),
  uncertaintyLanguageFrequency: z.object({
    count: z.number(),
    phrases: z.array(z.string()),
  }),
  keyObservations: z.array(z.string()),
  disclaimerNote: z.string(),
});

export const hiringRecommendationDataSchema = z.object({
  recommendation: hiringRecommendationSchema,
  recommendationScore: z.number().min(0).max(100),
  confidenceScore: z.number().min(0).max(100),
  executiveSummary: z.string(),
  evidenceJustification: z.object({
    technicalEvidence: z.array(z.string()),
    communicationEvidence: z.array(z.string()),
    culturalAndBehaviouralEvidence: z.array(z.string()),
    concernsAndRisks: z.array(z.string()),
  }),
  readinessRating: z.enum([
    'ready_now',
    'ready_with_minor_coaching',
    'needs_significant_upskilling',
    'not_recommended',
  ]),
  nextStepsForRecruiter: z.array(z.string()),
});

export const learningRoadmapSchema = z.object({
  dailyPlan: z.array(
    z.object({
      day: z.number(),
      focusTopic: z.string(),
      activity: z.string(),
      estimatedHours: z.number(),
    })
  ),
  weeklyRoadmap: z.array(
    z.object({
      week: z.number(),
      theme: z.string(),
      goals: z.array(z.string()),
      milestone: z.string(),
    })
  ),
  monthlyRoadmap: z.array(
    z.object({
      month: z.number(),
      milestoneTitle: z.string(),
      keyDeliverables: z.array(z.string()),
    })
  ),
  recommendedProjects: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    })
  ),
  recommendedQuestions: z.array(
    z.object({
      questionText: z.string(),
      topic: z.string(),
      category: z.enum(['technical', 'system_design', 'behavioral']),
    })
  ),
  learningResources: z.array(
    z.object({
      title: z.string(),
      type: z.enum(['documentation', 'book', 'video', 'interactive_lab']),
      urlOrReference: z.string(),
    })
  ),
  practiceSchedule: z.object({
    recommendedInterviewsPerWeek: z.number(),
    targetAreasToPractice: z.array(z.string()),
  }),
});

export const candidateReportSchema = z.object({
  id: z.string().optional(),
  sessionId: z.string(),
  workspaceId: z.string(),
  userId: z.string(),
  executiveSummary: z.string(),
  overallScore: z.number().min(0).max(100),
  technicalScore: z.number().min(0).max(100),
  communicationScore: z.number().min(0).max(100),
  behaviouralScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  hiringRecommendation: hiringRecommendationSchema,
  hiringJustification: z.string(),
  answerEvaluations: z.array(answerEvaluationSchema),
  communicationMetrics: communicationMetricsSchema,
  starFramework: starFrameworkSchema,
  skillGraph: skillGraphSchema,
  knowledgeGaps: z.array(knowledgeGapItemSchema),
  confidenceAnalysis: confidenceAnalysisSchema,
  learningRoadmap: learningRoadmapSchema,
  recommendedNextSession: z.object({
    roleTitle: z.string(),
    track: z.string(),
    difficulty: z.string(),
    focusAreas: z.array(z.string()),
  }),
  createdAt: z.string().optional(),
});

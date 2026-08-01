import { z } from 'zod';

export const followUpReferenceSchema = z.object({
  id: z
    .string()
    .default(() => `followup-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`),
  promptText: z.string().min(5, 'Follow-up prompt text must be at least 5 characters.'),
  targetDepth: z.enum(['shallow', 'intermediate', 'deep']),
  hint: z.string().optional(),
});

export const scoringCriterionSchema = z.object({
  pillar: z.enum(['technical_depth', 'communication', 'problem_solving', 'star_framework']),
  weight: z.number().min(0).max(1),
  description: z.string().min(5, 'Scoring description required.'),
});

export const evaluationMetadataSchema = z.object({
  idealAnswerOutline: z.string().min(10, 'Ideal answer outline must be at least 10 characters.'),
  keyConcepts: z.array(z.string()).min(1, 'At least one key concept is required.'),
  tradeOffPoints: z.array(z.string()).default([]),
  scoringCriteria: z.array(scoringCriterionSchema).default([]),
  sampleGoodResponse: z.string().optional(),
  sampleWeakResponse: z.string().optional(),
});

export const createQuestionSchema = z.object({
  title: z
    .string()
    .min(3, 'Question title must be at least 3 characters.')
    .max(150, 'Title must not exceed 150 characters.'),
  questionText: z
    .string()
    .min(10, 'Question text must be at least 10 characters.')
    .max(2000, 'Question text must not exceed 2000 characters.'),
  category: z.enum(['technical', 'system_design', 'behavioral', 'coding', 'architecture']),
  topic: z.string().min(2, 'Topic is required.'),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']),
  companyTags: z.array(z.string()).default([]),
  roleTags: z.array(z.string()).default([]),
  expectedDurationSeconds: z.number().int().min(60).max(3600).default(300),
  followUpReferences: z.array(followUpReferenceSchema).default([]),
  evaluationMetadata: evaluationMetadataSchema,
  isAiGenerated: z.boolean().default(false),
  source: z.enum(['system', 'ai_generated', 'user_custom']).default('system'),
});

export const questionFilterSchema = z.object({
  category: z
    .enum(['technical', 'system_design', 'behavioral', 'coding', 'architecture', 'all'])
    .default('all'),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert', 'all']).default('all'),
  topic: z.string().optional(),
  companyTag: z.string().optional(),
  roleTag: z.string().optional(),
  source: z.enum(['system', 'ai_generated', 'user_custom', 'all']).default('all'),
  isAiGenerated: z.boolean().optional(),
  searchQuery: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

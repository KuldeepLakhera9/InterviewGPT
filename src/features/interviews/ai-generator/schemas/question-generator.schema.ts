import { z } from 'zod';
import {
  evaluationMetadataSchema,
  followUpReferenceSchema,
} from '../../question-bank/schemas/question-bank.schema';

export const generatedQuestionItemSchema = z.object({
  title: z.string().min(3).max(150),
  questionText: z.string().min(10).max(2000),
  category: z.enum(['technical', 'system_design', 'behavioral', 'coding', 'architecture']),
  topic: z.string().min(2),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']),
  companyTags: z.array(z.string()).default([]),
  roleTags: z.array(z.string()).default([]),
  expectedDurationSeconds: z.number().int().min(60).max(3600).default(300),
  followUpReferences: z.array(followUpReferenceSchema).default([]),
  evaluationMetadata: evaluationMetadataSchema,
});

export const generatedQuestionSetSchema = z.object({
  generationSummary: z
    .string()
    .default('AI tailored questions generated based on candidate experience.'),
  questions: z.array(generatedQuestionItemSchema).min(1),
});

export const questionGeneratorInputSchema = z.object({
  roleTitle: z.string().min(2),
  seniorityLevel: z.enum(['junior', 'mid', 'senior', 'staff']),
  companyName: z.string().optional().default(''),
  companyTier: z.enum(['faang', 'startup', 'enterprise', 'fintech', 'early_stage']),
  track: z.enum(['technical', 'system_design', 'behavioral', 'full_loop']),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']),
  targetQuestionCount: z.number().int().min(1).max(10).default(3),
  resumeId: z.string().optional(),
  resumeText: z.string().optional(),
  candidateProfileHeadline: z.string().optional(),
  candidateProfileBio: z.string().optional(),
  jobDescriptionText: z.string().optional(),
  existingQuestionTitles: z.array(z.string()).optional().default([]),
  saveToQuestionBank: z.boolean().default(true),
});

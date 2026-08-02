import { z } from 'zod';

export const skillCategorySchema = z.enum([
  'programming_languages',
  'frameworks',
  'databases',
  'devops',
  'cloud',
  'ai_ml',
  'soft_skills',
  'system_design',
  'dsa',
  'communication',
]);

export const createCareerGoalSchema = z.object({
  dreamCompany: z.string().min(2, 'Dream company must be at least 2 characters'),
  targetRole: z.string().min(2, 'Target role must be at least 2 characters'),
  experienceLevel: z.string().min(1, 'Experience level is required'),
  salaryGoal: z.string().optional(),
  preferredIndustry: z.string().optional(),
  preferredLocation: z.string().optional(),
  targetTimeline: z.string().min(1, 'Timeline is required'),
  isPrimary: z.boolean().default(true),
});

export const skillItemSchema = z.object({
  name: z.string(),
  category: skillCategorySchema,
  currentLevel: z.number().min(0).max(100),
  targetLevel: z.number().min(0).max(100),
  confidenceScore: z.number().min(0).max(100),
  evidenceSources: z.array(z.string()),
  lastUpdated: z.string(),
});

export const createLearningHubItemSchema = z.object({
  type: z.enum(['note', 'resource', 'flashcard', 'quiz', 'practice_set']),
  title: z.string().min(2),
  category: z.string(),
  content: z.object({
    text: z.string().optional(),
    url: z.string().optional(),
    flashcards: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .optional(),
    quiz: z
      .array(
        z.object({
          question: z.string(),
          options: z.array(z.string()),
          correctAnswerIndex: z.number(),
          explanation: z.string(),
        })
      )
      .optional(),
  }),
});

export const sendMentorMessageSchema = z.object({
  message: z.string().min(2, 'Message cannot be empty'),
});

import { z } from 'zod';

export const historyFilterSchema = z.object({
  searchQuery: z.string().optional(),
  status: z
    .enum(['all', 'created', 'in_progress', 'paused', 'completed', 'archived', 'terminated'])
    .default('all'),
  track: z.enum(['all', 'technical', 'system_design', 'behavioral']).default('all'),
  difficulty: z.enum(['all', 'easy', 'medium', 'hard', 'expert']).default('all'),
  showArchivedOnly: z.boolean().default(false),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(9),
});

export const toggleArchiveSchema = z.object({
  sessionId: z.string().uuid(),
  isArchived: z.boolean(),
});

export const duplicateSessionSchema = z.object({
  sessionId: z.string().uuid(),
});

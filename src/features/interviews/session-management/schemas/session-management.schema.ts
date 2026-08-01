import { z } from 'zod';

export const sessionLifecycleActionSchema = z.object({
  sessionId: z.string().uuid(),
  action: z.enum(['start', 'pause', 'resume', 'restart', 'end', 'terminate']),
  reason: z.string().optional(),
});

export const sessionFilterSchema = z.object({
  status: z
    .enum(['created', 'in_progress', 'paused', 'completed', 'terminated', 'all'])
    .default('all'),
  track: z.string().default('all'),
  searchQuery: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
});

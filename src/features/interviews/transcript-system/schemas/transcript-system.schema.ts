import { z } from 'zod';

export const transcriptSearchSchema = z.object({
  query: z.string().optional(),
  speaker: z.enum(['interviewer', 'candidate', 'system', 'all']).default('all'),
  phase: z
    .enum([
      'introduction',
      'question_presentation',
      'followup_probe',
      'topic_transition',
      'wrap_up',
      'all',
    ])
    .default('all'),
  topic: z.string().default('all'),
});

export const transcriptExportSchema = z.object({
  sessionId: z.string().uuid(),
  format: z.enum(['json', 'markdown', 'text']),
});

import { z } from 'zod';
import type { PromptDefinition } from '../types/prompt-library.types';

export interface SystemDesignPromptInput {
  roleTitle: string;
  seniorityLevel: string;
  companyTier: string;
  questionTitle: string;
  candidateResponse: string;
}

export interface SystemDesignPromptOutput {
  interviewerMessage: string;
  phase: 'followup_probe' | 'topic_transition' | 'wrap_up';
  suggestedQuickReplies?: string[];
  extractedStrength?: string;
  extractedGap?: string;
}

export const systemDesignPromptInputSchema = z.object({
  roleTitle: z.string(),
  seniorityLevel: z.string(),
  companyTier: z.string(),
  questionTitle: z.string(),
  candidateResponse: z.string(),
});

export const systemDesignPromptOutputSchema = z.object({
  interviewerMessage: z.string(),
  phase: z.enum(['followup_probe', 'topic_transition', 'wrap_up']),
  suggestedQuickReplies: z.array(z.string()).optional(),
  extractedStrength: z.string().optional(),
  extractedGap: z.string().optional(),
});

export const SYSTEM_DESIGN_PROMPT: PromptDefinition<
  SystemDesignPromptInput,
  SystemDesignPromptOutput
> = {
  id: 'prompt_system_design_interviewer_v1',
  name: 'System Design & Distributed Architecture Prompt',
  category: 'system_design',
  objective:
    'Evaluate high-level component architecture, data partitioning, caching strategies, load balancing, and failure resilience.',
  version: '1.0.0',
  inputSchema: systemDesignPromptInputSchema,
  outputSchema: systemDesignPromptOutputSchema,
  rules: [
    'Act as a Systems Architect interviewing for a scale system.',
    'Focus on bottlenecks, CAP theorem trade-offs, database indexing, and cache invalidation.',
    'Challenge candidate assumptions on single points of failure (SPOF) and latency spikes.',
  ],
  constraints: [
    'Do NOT design the entire system architecture for the candidate.',
    'Limit follow-up questions to 1 core architectural concern at a time.',
  ],
  failureHandling: {
    retryLimit: 2,
    fallbackResponse: {
      interviewerMessage:
        'That addresses component decoupling. How would you handle database partitioning and replication under 100k writes/sec?',
      phase: 'followup_probe',
      suggestedQuickReplies: [
        'Use Sharding by User ID',
        'Add Read Replicas',
        'Use Redis Cache Ahead',
      ],
    },
    recoveryStrategy: 'Return structured system design fallback targeting data partitioning.',
  },
  templateBuilder: (inputs) => `
OBJECTIVE: Conduct a Distributed System Design interview for ${inputs.roleTitle} at a ${inputs.companyTier.toUpperCase()} company.

SYSTEM SCENARIO: ${inputs.questionTitle}

CANDIDATE RESPONSE:
"${inputs.candidateResponse}"

INSTRUCTIONS:
Critique the architectural design. Probe caching, database scaling, or failure tolerance.
Return valid JSON matching output schema.
`,
};

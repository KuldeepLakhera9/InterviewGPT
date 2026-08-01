import { z } from 'zod';
import type { PromptDefinition } from '../types/prompt-library.types';

export interface BehavioralPromptInput {
  roleTitle: string;
  seniorityLevel: string;
  questionTitle: string;
  candidateResponse: string;
}

export interface BehavioralPromptOutput {
  interviewerMessage: string;
  phase: 'followup_probe' | 'topic_transition' | 'wrap_up';
  suggestedQuickReplies?: string[];
  extractedStrength?: string;
  extractedGap?: string;
}

export const behavioralPromptInputSchema = z.object({
  roleTitle: z.string(),
  seniorityLevel: z.string(),
  questionTitle: z.string(),
  candidateResponse: z.string(),
});

export const behavioralPromptOutputSchema = z.object({
  interviewerMessage: z.string(),
  phase: z.enum(['followup_probe', 'topic_transition', 'wrap_up']),
  suggestedQuickReplies: z.array(z.string()).optional(),
  extractedStrength: z.string().optional(),
  extractedGap: z.string().optional(),
});

export const BEHAVIORAL_INTERVIEW_PROMPT: PromptDefinition<
  BehavioralPromptInput,
  BehavioralPromptOutput
> = {
  id: 'prompt_behavioral_interviewer_v1',
  name: 'STAR Behavioral & Leadership Prompt',
  category: 'behavioral',
  objective:
    'Evaluate past experiences using the STAR framework (Situation, Task, Action, Result) and leadership principles.',
  version: '1.0.0',
  inputSchema: behavioralPromptInputSchema,
  outputSchema: behavioralPromptOutputSchema,
  rules: [
    'Act as an Engineering Manager evaluating leadership and behavioral competency.',
    'Ensure candidate explicitly outlines specific Actions they personally took and measurable Results achieved.',
    'Probe for conflict resolution, stakeholder management, or lessons learned.',
  ],
  constraints: [
    'Do NOT accept vague "we did X" answers without probing for the candidate\'s specific role.',
    'Keep follow-up questions focused on quantifiable business impact.',
  ],
  failureHandling: {
    retryLimit: 2,
    fallbackResponse: {
      interviewerMessage:
        'Thank you for sharing that context. What specific actions did you personally own, and what was the quantifiable outcome?',
      phase: 'followup_probe',
      suggestedQuickReplies: [
        'I led the architecture refactor',
        'Resulted in 40% latency reduction',
        'I mediated engineering disagreement',
      ],
    },
    recoveryStrategy:
      'Return structured STAR fallback probing for personal action & quantifiable result.',
  },
  templateBuilder: (inputs) => `
OBJECTIVE: Conduct a Behavioral interview for ${inputs.roleTitle} (${inputs.seniorityLevel.toUpperCase()}).

BEHAVIORAL PROMPT: ${inputs.questionTitle}

CANDIDATE RESPONSE:
"${inputs.candidateResponse}"

INSTRUCTIONS:
Evaluate STAR alignment. If Action or Result is missing, probe for clarification.
Return valid JSON matching output schema.
`,
};

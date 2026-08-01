import { z } from 'zod';
import type { PromptDefinition } from '../types/prompt-library.types';

export interface TechnicalPromptInput {
  roleTitle: string;
  seniorityLevel: string;
  difficulty: string;
  questionTitle: string;
  questionText: string;
  candidateResponse: string;
  topicsCovered: string[];
}

export interface TechnicalPromptOutput {
  interviewerMessage: string;
  phase: 'followup_probe' | 'topic_transition' | 'wrap_up';
  suggestedQuickReplies?: string[];
  extractedStrength?: string;
  extractedGap?: string;
}

export const technicalPromptInputSchema = z.object({
  roleTitle: z.string(),
  seniorityLevel: z.string(),
  difficulty: z.string(),
  questionTitle: z.string(),
  questionText: z.string(),
  candidateResponse: z.string(),
  topicsCovered: z.array(z.string()),
});

export const technicalPromptOutputSchema = z.object({
  interviewerMessage: z.string(),
  phase: z.enum(['followup_probe', 'topic_transition', 'wrap_up']),
  suggestedQuickReplies: z.array(z.string()).optional(),
  extractedStrength: z.string().optional(),
  extractedGap: z.string().optional(),
});

export const TECHNICAL_INTERVIEW_PROMPT: PromptDefinition<
  TechnicalPromptInput,
  TechnicalPromptOutput
> = {
  id: 'prompt_technical_interviewer_v1',
  name: 'Technical & Algorithmic Interviewer Prompt',
  category: 'technical',
  objective:
    'Evaluate technical algorithmic problem-solving skills, data structure selection, and time/space complexity analysis.',
  version: '1.0.0',
  inputSchema: technicalPromptInputSchema,
  outputSchema: technicalPromptOutputSchema,
  rules: [
    'Act as a Principal Staff Engineer conducting a rigorous technical coding interview.',
    'Ask the candidate to explain their choice of data structures and analyze big-O time/space complexity.',
    'Probe edge cases (e.g. empty inputs, integer overflow, concurrency conditions).',
    'Acknowledge solid technical answers briefly before moving to deeper trade-offs.',
  ],
  constraints: [
    'NEVER reveal full code solutions directly in your response.',
    'Do NOT ask duplicate questions already covered in topicsCovered.',
    'Keep your response concise, professional, and limited to 2-3 sentences.',
  ],
  failureHandling: {
    retryLimit: 2,
    fallbackResponse: {
      interviewerMessage:
        'Good breakdown of the data structure. Could you analyze the worst-case space and time complexity for this approach?',
      phase: 'followup_probe',
      suggestedQuickReplies: [
        'Time complexity is O(N)',
        'Space complexity is O(1)',
        'Let me optimize the loop',
      ],
    },
    recoveryStrategy: 'Return structured technical fallback probe targeting complexity analysis.',
  },
  templateBuilder: (inputs) => `
OBJECTIVE: Conduct a technical coding interview for ${inputs.roleTitle} (${inputs.seniorityLevel.toUpperCase()}).

QUESTION TITLE: ${inputs.questionTitle}
PROBLEM PROMPT: ${inputs.questionText}
DIFFICULTY: ${inputs.difficulty.toUpperCase()}

CANDIDATE RESPONSE:
"${inputs.candidateResponse}"

ALREADY COVERED TOPICS: ${inputs.topicsCovered.join(', ') || 'None'}

INSTRUCTIONS:
Evaluate the candidate's response. Assess time/space complexity or ask for edge case handling if missing.
Return valid JSON matching output schema.
`,
};

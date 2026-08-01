import { z } from 'zod';
import type { PromptDefinition } from '../types/prompt-library.types';

export interface QuestionGeneratorPromptInput {
  roleTitle: string;
  seniorityLevel: string;
  companyName: string;
  track: string;
  difficulty: string;
  count?: number;
}

export interface GeneratedQuestionItem {
  title: string;
  category: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  questionText: string;
  expectedDurationMinutes: number;
  evaluationCriteriaFocus: string[];
  followUpReferences: string[];
}

export interface QuestionGeneratorPromptOutput {
  questions: GeneratedQuestionItem[];
}

export const generatedQuestionItemSchema = z.object({
  title: z.string(),
  category: z.string(),
  topic: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']),
  questionText: z.string(),
  expectedDurationMinutes: z.number(),
  evaluationCriteriaFocus: z.array(z.string()),
  followUpReferences: z.array(z.string()),
});

export const questionGeneratorOutputSchema = z.object({
  questions: z.array(generatedQuestionItemSchema),
});

export const questionGeneratorInputSchema = z.object({
  roleTitle: z.string(),
  seniorityLevel: z.string(),
  companyName: z.string(),
  track: z.string(),
  difficulty: z.string(),
  count: z.number().optional(),
});

export const QUESTION_GENERATOR_PROMPT: PromptDefinition<
  QuestionGeneratorPromptInput,
  QuestionGeneratorPromptOutput
> = {
  id: 'prompt_question_generator_v1',
  name: 'AI Interview Question Generator Prompt',
  category: 'question_generator',
  objective:
    'Generate highly customized, natural, non-repetitive interview questions tailored to candidate role, seniority, and company tier.',
  version: '1.0.0',
  inputSchema: questionGeneratorInputSchema,
  outputSchema: questionGeneratorOutputSchema,
  rules: [
    'Generate realistic interview questions used by top tech companies.',
    'Ensure questions increase in complexity gradually.',
    'Include clear evaluation criteria and relevant follow-up references.',
  ],
  constraints: [
    'Do NOT generate duplicate questions.',
    'Return strictly JSON format without markdown fences or extra commentary.',
  ],
  failureHandling: {
    retryLimit: 2,
    fallbackResponse: {
      questions: [
        {
          title: 'System Scalability & Sharding',
          category: 'System Design',
          topic: 'Distributed Systems',
          difficulty: 'hard',
          questionText:
            'How would you architect a globally distributed rate-limiting service handling 500,000 requests per second with low latency?',
          expectedDurationMinutes: 15,
          evaluationCriteriaFocus: [
            'Data partitioning strategy',
            'Consistency vs Availability trade-offs',
            'Redis/Memcached caching layer',
          ],
          followUpReferences: [
            'How do you handle cache invalidation?',
            'What happens if a shard goes down?',
          ],
        },
      ],
    },
    recoveryStrategy: 'Return structured seed question set fallback.',
  },
  templateBuilder: (inputs) => `
OBJECTIVE: Generate ${inputs.count} tailored interview questions for a ${inputs.seniorityLevel.toUpperCase()} ${inputs.roleTitle} at ${inputs.companyName}.

TRACK: ${inputs.track.toUpperCase()}
BASE DIFFICULTY: ${inputs.difficulty.toUpperCase()}

REQUIREMENTS:
- Return JSON object with a "questions" array.
- Each item must include: title, category, topic, difficulty, questionText, expectedDurationMinutes, evaluationCriteriaFocus, followUpReferences.
`,
};

import { z } from 'zod';
import type { PromptDefinition } from '../types/prompt-library.types';

export interface FollowUpEvaluatorPromptInput {
  currentQuestionIndex: number;
  totalQuestions: number;
  currentFollowUpCount: number;
  maxFollowUpsAllowed: number;
  extractedStrength?: string;
  extractedGap?: string;
}

export interface FollowUpEvaluatorPromptOutput {
  action: 'ask_followup' | 'transition_next_question' | 'wrap_up_interview';
  probeType?: 'shallow' | 'intermediate' | 'deep' | 'challenge';
  reason: string;
  nextDifficulty?: 'easy' | 'medium' | 'hard' | 'expert';
}

export const followupEvaluatorInputSchema = z.object({
  currentQuestionIndex: z.number(),
  totalQuestions: z.number(),
  currentFollowUpCount: z.number(),
  maxFollowUpsAllowed: z.number(),
  extractedStrength: z.string().optional(),
  extractedGap: z.string().optional(),
});

export const followupEvaluatorOutputSchema = z.object({
  action: z.enum(['ask_followup', 'transition_next_question', 'wrap_up_interview']),
  probeType: z.enum(['shallow', 'intermediate', 'deep', 'challenge']).optional(),
  reason: z.string(),
  nextDifficulty: z.enum(['easy', 'medium', 'hard', 'expert']).optional(),
});

export const FOLLOWUP_EVALUATOR_PROMPT: PromptDefinition<
  FollowUpEvaluatorPromptInput,
  FollowUpEvaluatorPromptOutput
> = {
  id: 'prompt_followup_evaluator_v1',
  name: 'Adaptive Follow-Up & Topic Progression Evaluator',
  category: 'followup_evaluator',
  objective:
    'Determine whether to ask a follow-up probe, transition to the next topic, or wrap up the interview based on question count and depth limits.',
  version: '1.0.0',
  inputSchema: followupEvaluatorInputSchema,
  outputSchema: followupEvaluatorOutputSchema,
  rules: [
    'Enforce max follow-up count per question strictly (maximum 2 follow-ups per question).',
    'If candidate demonstrates deep understanding, adapt difficulty upward.',
    'If candidate reaches max follow-up count, transition to next topic.',
  ],
  constraints: [
    'Never allow currentFollowUpCount to exceed maxFollowUpsAllowed.',
    'If currentQuestionIndex >= totalQuestions - 1 and max follow-ups reached, select wrap_up_interview.',
  ],
  failureHandling: {
    retryLimit: 2,
    fallbackResponse: {
      action: 'transition_next_question',
      reason: 'Reached maximum probe depth limit for current question topic.',
    },
    recoveryStrategy: 'Transition to next question on decision evaluation failure.',
  },
  templateBuilder: (inputs) => `
OBJECTIVE: Evaluate interview flow progression.

CURRENT STATE:
- Question Index: ${inputs.currentQuestionIndex + 1} of ${inputs.totalQuestions}
- Current Question Follow-Up Count: ${inputs.currentFollowUpCount} (Max Allowed: ${inputs.maxFollowUpsAllowed})
- Last Extracted Strength: ${inputs.extractedStrength || 'None'}
- Last Extracted Gap: ${inputs.extractedGap || 'None'}

DECISION RULES:
If currentFollowUpCount < maxFollowUpsAllowed AND extractedGap exists -> ask_followup
If currentFollowUpCount >= maxFollowUpsAllowed -> transition_next_question
If last question and max follow-ups reached -> wrap_up_interview

Return valid JSON matching output schema.
`,
};

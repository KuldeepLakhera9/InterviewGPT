import { z } from 'zod';

export type PromptCategory =
  'technical' | 'system_design' | 'behavioral' | 'question_generator' | 'followup_evaluator';

export interface PromptFailureStrategy<TOutput = unknown> {
  retryLimit: number;
  fallbackResponse: TOutput;
  recoveryStrategy: string;
}

export interface PromptDefinition<TInput = Record<string, unknown>, TOutput = unknown> {
  id: string;
  name: string;
  category: PromptCategory;
  objective: string;
  version: string;
  inputSchema: z.ZodType<TInput>;
  outputSchema: z.ZodType<TOutput>;
  rules: string[];
  constraints: string[];
  failureHandling: PromptFailureStrategy<TOutput>;
  templateBuilder: (inputs: TInput) => string;
}

export type PromptRegistryMap = Record<string, PromptDefinition<unknown, unknown>>;

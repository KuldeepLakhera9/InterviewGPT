import type { PromptCategory, PromptDefinition } from '../types/prompt-library.types';
import { TECHNICAL_INTERVIEW_PROMPT } from '../registry/technical.prompt';
import { SYSTEM_DESIGN_PROMPT } from '../registry/system-design.prompt';
import { BEHAVIORAL_INTERVIEW_PROMPT } from '../registry/behavioral.prompt';
import { QUESTION_GENERATOR_PROMPT } from '../registry/question-generator.prompt';
import { FOLLOWUP_EVALUATOR_PROMPT } from '../registry/followup-evaluator.prompt';

// Centralized Prompt Library Registry
const PROMPT_REGISTRY: Record<string, PromptDefinition<unknown, unknown>> = {
  [TECHNICAL_INTERVIEW_PROMPT.id]: TECHNICAL_INTERVIEW_PROMPT as unknown as PromptDefinition<
    unknown,
    unknown
  >,
  [SYSTEM_DESIGN_PROMPT.id]: SYSTEM_DESIGN_PROMPT as unknown as PromptDefinition<unknown, unknown>,
  [BEHAVIORAL_INTERVIEW_PROMPT.id]: BEHAVIORAL_INTERVIEW_PROMPT as unknown as PromptDefinition<
    unknown,
    unknown
  >,
  [QUESTION_GENERATOR_PROMPT.id]: QUESTION_GENERATOR_PROMPT as unknown as PromptDefinition<
    unknown,
    unknown
  >,
  [FOLLOWUP_EVALUATOR_PROMPT.id]: FOLLOWUP_EVALUATOR_PROMPT as unknown as PromptDefinition<
    unknown,
    unknown
  >,
};

export function getAllPrompts(): PromptDefinition<unknown, unknown>[] {
  return Object.values(PROMPT_REGISTRY);
}

export function getPromptDefinition(id: string): PromptDefinition<unknown, unknown> | null {
  return PROMPT_REGISTRY[id] || null;
}

export function getPromptsByCategory(
  category: PromptCategory
): PromptDefinition<unknown, unknown>[] {
  return getAllPrompts().filter((p) => p.category === category);
}

export function renderPromptText<TInput>(promptId: string, inputs: TInput): string {
  const prompt = getPromptDefinition(promptId);
  if (!prompt) {
    throw new Error(`Prompt definition not found in library: ${promptId}`);
  }

  // Validate inputs against input schema
  const parsedInputs = prompt.inputSchema.parse(inputs);
  return prompt.templateBuilder(parsedInputs);
}

export function validatePromptOutput<TOutput>(promptId: string, outputData: unknown): TOutput {
  const prompt = getPromptDefinition(promptId);
  if (!prompt) {
    throw new Error(`Prompt definition not found in library: ${promptId}`);
  }

  return prompt.outputSchema.parse(outputData) as TOutput;
}

export function getPromptFallbackResponse<TOutput>(promptId: string): TOutput {
  const prompt = getPromptDefinition(promptId);
  if (!prompt) {
    throw new Error(`Prompt definition not found in library: ${promptId}`);
  }

  return prompt.failureHandling.fallbackResponse as TOutput;
}

'use server';

import type { PromptCategory, PromptDefinition } from '../types/prompt-library.types';
import {
  getAllPrompts,
  getPromptsByCategory,
  renderPromptText,
} from '../services/prompt-library.service';

export interface PromptActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getAllPromptsAction(): Promise<
  PromptActionResult<PromptDefinition<unknown, unknown>[]>
> {
  try {
    const prompts = getAllPrompts();
    return { success: true, data: prompts };
  } catch (err) {
    console.error('Failed to retrieve prompts:', err);
    return { success: false, error: 'Failed to retrieve prompt library.' };
  }
}

export async function getPromptsByCategoryAction(
  category: PromptCategory
): Promise<PromptActionResult<PromptDefinition<unknown, unknown>[]>> {
  try {
    const prompts = getPromptsByCategory(category);
    return { success: true, data: prompts };
  } catch (err) {
    console.error('Failed to retrieve prompts by category:', err);
    return { success: false, error: 'Failed to retrieve prompts for category.' };
  }
}

export async function renderPromptTextAction(
  promptId: string,
  inputs: Record<string, unknown>
): Promise<PromptActionResult<string>> {
  try {
    const text = renderPromptText(promptId, inputs);
    return { success: true, data: text };
  } catch (err) {
    console.error('Failed to render prompt text:', err);
    return { success: false, error: 'Failed to build prompt template text.' };
  }
}

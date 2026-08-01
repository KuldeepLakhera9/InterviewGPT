import { describe, expect, it } from 'vitest';
import {
  getAllPrompts,
  getPromptDefinition,
  getPromptFallbackResponse,
  getPromptsByCategory,
  renderPromptText,
  validatePromptOutput,
} from '../prompt-library/services/prompt-library.service';

describe('Prompt Library Registry & Service Suite', () => {
  it('should register prompts across all 5 interview categories', () => {
    const all = getAllPrompts();
    expect(all.length).toBeGreaterThanOrEqual(5);

    const categories = all.map((p) => p.category);
    expect(categories).toContain('technical');
    expect(categories).toContain('system_design');
    expect(categories).toContain('behavioral');
    expect(categories).toContain('question_generator');
    expect(categories).toContain('followup_evaluator');
  });

  it('should enforce prompt schema definitions (Objective, Rules, Constraints, Failure Handling)', () => {
    const technical = getPromptDefinition('prompt_technical_interviewer_v1');
    expect(technical).not.toBeNull();
    expect(technical?.objective).toBeDefined();
    expect(technical?.rules.length).toBeGreaterThan(0);
    expect(technical?.constraints.length).toBeGreaterThan(0);
    expect(technical?.failureHandling.fallbackResponse).toBeDefined();
  });

  it('should filter prompts by category', () => {
    const sysDesignPrompts = getPromptsByCategory('system_design');
    expect(sysDesignPrompts.length).toBeGreaterThan(0);
    expect(sysDesignPrompts[0].category).toBe('system_design');
  });

  it('should validate inputs and render template text', () => {
    const rendered = renderPromptText('prompt_technical_interviewer_v1', {
      roleTitle: 'Senior Backend Engineer',
      seniorityLevel: 'senior',
      difficulty: 'hard',
      questionTitle: 'LRU Cache Design',
      questionText: 'Design a Data Structure for LRU Cache with O(1) ops.',
      candidateResponse: 'I will use a HashMap coupled with a Doubly Linked List.',
      topicsCovered: ['Data Structures'],
    });

    expect(rendered).toContain('Senior Backend Engineer');
    expect(rendered).toContain('LRU Cache Design');
    expect(rendered).toContain('HashMap coupled with a Doubly Linked List');
  });

  it('should validate output schema and handle fallback recovery strategy', () => {
    const fallback = getPromptFallbackResponse<{ action: string }>('prompt_followup_evaluator_v1');
    expect(fallback).toBeDefined();
    expect(fallback.action).toBe('transition_next_question');

    const validOutput = {
      interviewerMessage: 'Nice analysis. What is the time complexity?',
      phase: 'followup_probe',
      suggestedQuickReplies: ['O(N)', 'O(1)'],
    };

    const validated = validatePromptOutput('prompt_technical_interviewer_v1', validOutput);
    expect(validated).toEqual(validOutput);
  });
});

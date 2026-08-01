import { describe, expect, it } from 'vitest';
import {
  buildQuestionGeneratorUserPrompt,
  QUESTION_GENERATOR_SYSTEM_PROMPT,
} from '../ai-generator/prompts/question-generator.prompt';

import {
  generatedQuestionSetSchema,
  questionGeneratorInputSchema,
} from '../ai-generator/schemas/question-generator.schema';

import { generateFallbackAiQuestionSet } from '../ai-generator/pipeline/question-generator-llm.provider';
import { generateQuestionSet } from '../ai-generator/services/question-generator.service';
import type { QuestionGeneratorInput } from '../ai-generator/types/question-generator.types';

describe('AI Question Generator Domain Suite', () => {
  it('should store prompt templates separately and assemble user prompt', () => {
    expect(QUESTION_GENERATOR_SYSTEM_PROMPT).toContain('Strict Structured JSON Output');
    expect(QUESTION_GENERATOR_SYSTEM_PROMPT).toContain('Gradual Difficulty Escalation');

    const promptText = buildQuestionGeneratorUserPrompt({
      roleTitle: 'Senior Systems Architect',
      seniorityLevel: 'senior',
      companyName: 'Stripe',
      companyTier: 'startup',
      track: 'system_design',
      difficulty: 'hard',
      targetQuestionCount: 3,
      resumeText: 'Experienced with high-concurrency microservices, Kafka, Redis, and PostgreSQL.',
      candidateProfileHeadline: 'Senior Infrastructure Lead',
      jobDescriptionText: 'Looking for a Staff Engineer to lead API Gateway architecture.',
      existingQuestionTitles: ['Design Rate Limiter'],
    });

    expect(promptText).toContain('Senior Systems Architect');
    expect(promptText).toContain('Stripe');
    expect(promptText).toContain('SYSTEM_DESIGN');
    expect(promptText).toContain('Kafka, Redis');
    expect(promptText).toContain('API Gateway');
    expect(promptText).toContain('Design Rate Limiter');
  });

  it('should validate question generator input schema', () => {
    const validInput: QuestionGeneratorInput = {
      roleTitle: 'Frontend Engineer',
      seniorityLevel: 'mid',
      companyName: 'Vercel',
      companyTier: 'startup',
      track: 'technical',
      difficulty: 'medium',
      targetQuestionCount: 3,
      saveToQuestionBank: true,
    };

    const result = questionGeneratorInputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('should validate generated question set JSON output against Zod schema', () => {
    const mockJsonOutput = {
      generationSummary: 'Tailored 3 system design questions for Stripe Senior Systems Architect.',
      questions: [
        {
          title: 'Warm-up: High-Level API Gateway Routing',
          questionText:
            'Given your experience with microservices, how would you design API routing at Stripe?',
          category: 'architecture',
          topic: 'API Gateway',
          difficulty: 'medium',
          companyTags: ['Stripe', 'STARTUP'],
          roleTags: ['Senior Systems Architect'],
          expectedDurationSeconds: 300,
          followUpReferences: [
            {
              id: 'fu-1',
              promptText: 'How do you handle JWT verification at the gateway level?',
              targetDepth: 'intermediate',
            },
          ],
          evaluationMetadata: {
            idealAnswerOutline:
              '1. Centralized auth\n2. Reverse proxy routing\n3. Circuit breaking',
            keyConcepts: ['API Gateway', 'JWT', 'Circuit Breaker'],
            tradeOffPoints: ['Centralized gateway latency vs decentralized sidecars'],
            scoringCriteria: [
              {
                pillar: 'technical_depth',
                weight: 0.5,
                description: 'Understands API gateway latency constraints.',
              },
            ],
          },
        },
      ],
    };

    const parsed = generatedQuestionSetSchema.safeParse(mockJsonOutput);
    expect(parsed.success).toBe(true);
  });

  it('should generate questions with gradual difficulty escalation', () => {
    const input: QuestionGeneratorInput = {
      roleTitle: 'Full Stack Engineer',
      seniorityLevel: 'senior',
      companyName: 'Google',
      companyTier: 'faang',
      track: 'technical',
      difficulty: 'easy',
      targetQuestionCount: 4,
    };

    const result = generateFallbackAiQuestionSet(input);
    expect(result.questions.length).toBe(4);

    // Difficulty escalation check
    const difficulties = result.questions.map((q) => q.difficulty);
    expect(difficulties[0]).toBe('easy');
    expect(difficulties[1]).toBe('medium');
    expect(difficulties[2]).toBe('hard');
    expect(difficulties[3]).toBe('expert');
  });

  it('should generate structured questions referencing candidate role and company', async () => {
    const input: QuestionGeneratorInput = {
      roleTitle: 'Systems Architect',
      seniorityLevel: 'staff',
      companyName: 'OpenAI',
      companyTier: 'startup',
      track: 'system_design',
      difficulty: 'hard',
      targetQuestionCount: 3,
      resumeText: 'Built real-time WebSocket streaming services and vector database pipelines.',
    };

    const res = await generateQuestionSet(input);
    expect(res.questions.length).toBe(3);
    expect(res.summary).toContain('Systems Architect');
    expect(res.summary).toContain('OpenAI');

    res.questions.forEach((q) => {
      expect(q.isAiGenerated).toBe(true);
      expect(q.source).toBe('ai_generated');
      expect(q.evaluationMetadata.idealAnswerOutline).toBeDefined();
      expect(q.evaluationMetadata.keyConcepts.length).toBeGreaterThan(0);
      expect(q.followUpReferences.length).toBeGreaterThan(0);
    });
  });
});

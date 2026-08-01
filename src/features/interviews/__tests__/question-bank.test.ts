import { describe, expect, it } from 'vitest';
import {
  createQuestionSchema,
  questionFilterSchema,
} from '../question-bank/schemas/question-bank.schema';
import {
  createQuestion,
  getQuestionById,
  getQuestions,
} from '../question-bank/services/question-bank.service';
import type { CreateQuestionInput } from '../question-bank/types/question-bank.types';

describe('Interview Question Bank Domain Suite', () => {
  it('should validate complete question creation input schema', () => {
    const validQuestion: CreateQuestionInput = {
      title: 'Design a Real-Time Distributed Notification Engine',
      questionText:
        'Design a high-throughput notification service delivering 10M pushes/sec. Compare WebSockets vs SSE vs APNS/FCM.',
      category: 'system_design',
      topic: 'Distributed Systems',
      difficulty: 'hard',
      companyTags: ['Google', 'Uber', 'Meta'],
      roleTags: ['Systems Architect', 'Senior Backend Engineer'],
      expectedDurationSeconds: 600,
      followUpReferences: [
        {
          id: 'fu-test-1',
          promptText: 'How do you handle device offline queuing?',
          targetDepth: 'intermediate',
        },
      ],
      evaluationMetadata: {
        idealAnswerOutline:
          '1. Push Gateway Architecture\n2. Connection Management\n3. Redis Pub/Sub routing',
        keyConcepts: ['WebSockets', 'APNS', 'Redis Pub/Sub'],
        tradeOffPoints: ['Long Polling latency vs WebSocket memory state'],
        scoringCriteria: [
          {
            pillar: 'technical_depth',
            weight: 0.5,
            description: 'Understands WebSocket connection pooling.',
          },
        ],
      },
      isAiGenerated: true,
      source: 'ai_generated',
    };

    const result = createQuestionSchema.safeParse(validQuestion);
    expect(result.success).toBe(true);
  });

  it('should reject invalid question creation input', () => {
    const invalidQuestion = {
      title: 'Hi', // too short
      questionText: 'Short', // too short
      category: 'invalid_category',
    };

    const result = createQuestionSchema.safeParse(invalidQuestion);
    expect(result.success).toBe(false);
  });

  it('should filter seed questions by Category and Difficulty', async () => {
    const sysDesignRes = await getQuestions({ category: 'system_design' });
    expect(sysDesignRes.items.length).toBeGreaterThan(0);
    sysDesignRes.items.forEach((item) => {
      expect(item.category).toBe('system_design');
    });

    const hardRes = await getQuestions({ difficulty: 'hard' });
    expect(hardRes.items.length).toBeGreaterThan(0);
    hardRes.items.forEach((item) => {
      expect(item.difficulty).toBe('hard');
    });
  });

  it('should filter questions by company tag and role tag', async () => {
    const googleRes = await getQuestions({ companyTag: 'Google' });
    expect(googleRes.items.length).toBeGreaterThan(0);
    googleRes.items.forEach((item) => {
      expect(item.companyTags.map((c) => c.toLowerCase())).toContain('google');
    });
  });

  it('should support searching by keyword in title or topic', async () => {
    const searchRes = await getQuestions({ searchQuery: 'Rate Limiter' });
    expect(searchRes.items.length).toBeGreaterThan(0);
    expect(searchRes.items[0]?.title.toLowerCase()).toContain('rate limiter');
  });

  it('should support AI-generated questions flag and metadata', async () => {
    const aiRes = await getQuestions({ isAiGenerated: true });
    expect(aiRes.items.length).toBeGreaterThan(0);
    expect(aiRes.items[0]?.isAiGenerated).toBe(true);
    expect(aiRes.items[0]?.source).toBe('ai_generated');
  });

  it('should create and retrieve custom questions with evaluation metadata', async () => {
    const newQuestionInput: CreateQuestionInput = {
      title: 'Custom Testing Question for Unit Test',
      questionText: 'What is the difference between integration and unit testing in Next.js?',
      category: 'technical',
      topic: 'Testing Methodology',
      difficulty: 'easy',
      companyTags: ['Startup'],
      roleTags: ['Frontend Engineer'],
      expectedDurationSeconds: 300,
      followUpReferences: [],
      evaluationMetadata: {
        idealAnswerOutline: '1. Scope of tests\n2. Mocking boundaries\n3. Speed vs Confidence',
        keyConcepts: ['Vitest', 'Testing Library', 'Mocks'],
        tradeOffPoints: [],
        scoringCriteria: [],
      },
      isAiGenerated: false,
      source: 'user_custom',
    };

    const created = await createQuestion(newQuestionInput);
    expect(created.id).toBeDefined();
    expect(created.title).toBe(newQuestionInput.title);
    expect(created.evaluationMetadata.keyConcepts).toContain('Vitest');

    const fetched = await getQuestionById(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.title).toBe(newQuestionInput.title);
  });

  it('should parse valid question filter schema defaults', () => {
    const parsed = questionFilterSchema.parse({});
    expect(parsed.category).toBe('all');
    expect(parsed.difficulty).toBe('all');
    expect(parsed.page).toBe(1);
    expect(parsed.limit).toBe(10);
  });
});

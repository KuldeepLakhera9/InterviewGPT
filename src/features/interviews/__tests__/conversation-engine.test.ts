import { describe, expect, it } from 'vitest';
import {
  buildInterviewerTurnUserPrompt,
  CONVERSATION_SYSTEM_PROMPT,
} from '../conversation-engine/prompts/conversation-engine.prompt';
import {
  createInitialMemoryState,
  formatMemorySummary,
  updateMemoryState,
} from '../conversation-engine/services/interview-memory.service';
import {
  adaptDifficulty,
  evaluateFollowUpStrategy,
  MAX_FOLLOWUP_PROBES_PER_QUESTION,
} from '../conversation-engine/services/followup-strategy.service';
import { computeNextPhase } from '../conversation-engine/services/topic-progression.service';
import { generateFallbackInterviewerTurn } from '../conversation-engine/pipeline/conversation-llm.provider';
import type {
  ConversationEngineState,
  InterviewTurnData,
} from '../conversation-engine/types/conversation-engine.types';

describe('Interview Conversation Engine Suite', () => {
  it('should maintain prompt template separation and format user turn prompt', () => {
    expect(CONVERSATION_SYSTEM_PROMPT).toContain('Realistic Interviewer Persona');
    expect(CONVERSATION_SYSTEM_PROMPT).toContain('Follow-Up Probes');

    const promptText = buildInterviewerTurnUserPrompt({
      roleTitle: 'Staff Backend Lead',
      seniorityLevel: 'staff',
      companyName: 'Stripe',
      track: 'SYSTEM_DESIGN',
      difficulty: 'HARD',
      phase: 'FOLLOWUP_PROBE',
      currentQuestionTitle: 'Design Payment Idempotency Engine',
      currentQuestionPrompt: 'How do you guarantee exactly-once processing across API timeouts?',
      idealAnswerOutline: 'Idempotency keys, atomic Redis locks, database constraints',
      recentTurnsSummary: 'INTERVIEWER: Welcome!\nCANDIDATE: Ready to start.',
      candidateLastMessage: 'I use UUID idempotency keys stored in Redis cache with 24hr TTL.',
      memoryBufferSummary: 'Observed Strengths: API contract stability',
      followUpCount: 1,
    });

    expect(promptText).toContain('Staff Backend Lead');
    expect(promptText).toContain('Stripe');
    expect(promptText).toContain('Design Payment Idempotency Engine');
    expect(promptText).toContain('UUID idempotency keys');
  });

  it('should extract candidate strengths, gaps, and past experiences into memory state', () => {
    let memory = createInitialMemoryState();

    const turn1: InterviewTurnData = {
      id: 'turn-1',
      sessionId: 'sess-1',
      turnIndex: 1,
      speaker: 'interviewer',
      messageText: 'Welcome!',
      phase: 'introduction',
      createdAt: new Date().toISOString(),
      metadata: {
        extractedStrength: 'Strong distributed caching knowledge',
        mentionedExperience: 'Senior Tech Lead at Uber',
      },
    };

    const turn2: InterviewTurnData = {
      id: 'turn-2',
      sessionId: 'sess-1',
      turnIndex: 2,
      speaker: 'candidate',
      messageText: 'At Uber, we handled microservice routing using envoy.',
      phase: 'question_presentation',
      topic: 'API Routing',
      createdAt: new Date().toISOString(),
      metadata: {
        extractedGap: 'Needs deeper understanding of zero-downtime database migrations',
      },
    };

    memory = updateMemoryState(memory, turn1);
    memory = updateMemoryState(memory, turn2);

    expect(memory.candidateStrengths).toContain('Strong distributed caching knowledge');
    expect(memory.discussedExperiences).toContain('Senior Tech Lead at Uber');
    expect(memory.candidateGaps).toContain(
      'Needs deeper understanding of zero-downtime database migrations'
    );
    expect(memory.topicsCovered).toContain('API Routing');

    const formatted = formatMemorySummary(memory);
    expect(formatted).toContain('Observed Strengths');
    expect(formatted).toContain('Observed Gaps');
  });

  it('should enforce follow-up probe limits (max 2 probes per core question)', () => {
    const mockState: ConversationEngineState = {
      sessionId: 'sess-test',
      roleTitle: 'Systems Engineer',
      seniorityLevel: 'senior',
      companyName: 'Meta',
      track: 'system_design',
      difficulty: 'hard',
      adaptiveMode: true,
      phase: 'followup_probe',
      currentQuestionIndex: 0,
      activeQuestion: {
        id: 'q-1',
        title: 'Distributed Rate Limiter',
        questionText: 'Design a distributed rate limiter.',
        category: 'system_design',
        topic: 'Rate Limiting',
        difficulty: 'hard',
        companyTags: ['Meta'],
        roleTags: ['Systems Engineer'],
        expectedDurationSeconds: 450,
        followUpReferences: [],
        evaluationMetadata: {
          idealAnswerOutline: '1. Sliding window log\n2. Token bucket\n3. Redis atomicity',
          keyConcepts: ['Token Bucket'],
          tradeOffPoints: [],
          scoringCriteria: [],
        },
        isAiGenerated: false,
        source: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      questions: [
        {
          id: 'q-1',
          title: 'Distributed Rate Limiter',
          questionText: 'Design a distributed rate limiter.',
          category: 'system_design',
          topic: 'Rate Limiting',
          difficulty: 'hard',
          companyTags: ['Meta'],
          roleTags: ['Systems Engineer'],
          expectedDurationSeconds: 450,
          followUpReferences: [],
          evaluationMetadata: {
            idealAnswerOutline: 'Outline',
            keyConcepts: [],
            tradeOffPoints: [],
            scoringCriteria: [],
          },
          isAiGenerated: false,
          source: 'system',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'q-2',
          title: 'Log Collector Pipeline',
          questionText: 'Design a log collector.',
          category: 'system_design',
          topic: 'Logging',
          difficulty: 'hard',
          companyTags: ['Meta'],
          roleTags: ['Systems Engineer'],
          expectedDurationSeconds: 450,
          followUpReferences: [],
          evaluationMetadata: {
            idealAnswerOutline: 'Outline 2',
            keyConcepts: [],
            tradeOffPoints: [],
            scoringCriteria: [],
          },
          isAiGenerated: false,
          source: 'system',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      memory: {
        candidateStrengths: [],
        candidateGaps: [],
        topicsCovered: ['Rate Limiting'],
        discussedExperiences: [],
        currentFollowUpCount: 1,
      },
      turns: [],
      isCompleted: false,
    };

    // First follow up probe allowed
    const decision1 = evaluateFollowUpStrategy(
      mockState,
      'I will use a sliding window counter algorithm.'
    );
    expect(decision1.action).toBe('ask_followup');

    // When follow-up count reaches MAX (2), trigger topic transition
    mockState.memory.currentFollowUpCount = MAX_FOLLOWUP_PROBES_PER_QUESTION;
    const decision2 = evaluateFollowUpStrategy(
      mockState,
      'I use Redis Lua scripts for atomic increment.'
    );
    expect(decision2.action).toBe('transition_next_question');
  });

  it('should adapt difficulty dynamically', () => {
    expect(adaptDifficulty('easy', 'increase')).toBe('medium');
    expect(adaptDifficulty('medium', 'increase')).toBe('hard');
    expect(adaptDifficulty('hard', 'increase')).toBe('expert');
    expect(adaptDifficulty('expert', 'increase')).toBe('expert');

    expect(adaptDifficulty('hard', 'decrease')).toBe('medium');
    expect(adaptDifficulty('easy', 'decrease')).toBe('easy');
  });

  it('should compute next phase transitions accurately', () => {
    const mockState: ConversationEngineState = {
      sessionId: 'sess-1',
      roleTitle: 'Frontend Engineer',
      seniorityLevel: 'mid',
      companyName: 'Airbnb',
      track: 'technical',
      difficulty: 'medium',
      adaptiveMode: true,
      phase: 'question_presentation',
      currentQuestionIndex: 0,
      activeQuestion: null,
      questions: [
        {
          id: 'q1',
          title: 'Q1',
          questionText: 'P1',
          category: 'technical',
          topic: 'Topic 1',
          difficulty: 'medium',
          companyTags: [],
          roleTags: [],
          expectedDurationSeconds: 300,
          followUpReferences: [],
          evaluationMetadata: {
            idealAnswerOutline: '',
            keyConcepts: [],
            tradeOffPoints: [],
            scoringCriteria: [],
          },
          isAiGenerated: false,
          source: 'system',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'q2',
          title: 'Q2',
          questionText: 'P2',
          category: 'technical',
          topic: 'Topic 2',
          difficulty: 'medium',
          companyTags: [],
          roleTags: [],
          expectedDurationSeconds: 300,
          followUpReferences: [],
          evaluationMetadata: {
            idealAnswerOutline: '',
            keyConcepts: [],
            tradeOffPoints: [],
            scoringCriteria: [],
          },
          isAiGenerated: false,
          source: 'system',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      memory: createInitialMemoryState(),
      turns: [],
      isCompleted: false,
    };

    const next1 = computeNextPhase(mockState, 'ask_followup');
    expect(next1.nextPhase).toBe('followup_probe');
    expect(next1.nextQuestionIndex).toBe(0);

    const next2 = computeNextPhase(mockState, 'transition_next_question');
    expect(next2.nextPhase).toBe('topic_transition');
    expect(next2.nextQuestionIndex).toBe(1);

    const next3 = computeNextPhase(mockState, 'wrap_up_interview');
    expect(next3.nextPhase).toBe('wrap_up');
  });

  it('should generate fallback interviewer turns for all phases', () => {
    const introTurn = generateFallbackInterviewerTurn({
      roleTitle: 'Architect',
      seniorityLevel: 'senior',
      companyName: 'Netflix',
      track: 'system_design',
      difficulty: 'hard',
      phase: 'introduction',
      currentQuestionTitle: 'Q1',
      currentQuestionPrompt: 'P1',
      idealAnswerOutline: '',
      recentTurnsSummary: '',
      candidateLastMessage: '',
      memoryBufferSummary: '',
      followUpCount: 0,
    });
    expect(introTurn.interviewerMessage).toContain('Welcome!');
    expect(introTurn.phase).toBe('introduction');

    const wrapUpTurn = generateFallbackInterviewerTurn({
      roleTitle: 'Architect',
      seniorityLevel: 'senior',
      companyName: 'Netflix',
      track: 'system_design',
      difficulty: 'hard',
      phase: 'wrap_up',
      currentQuestionTitle: 'Q1',
      currentQuestionPrompt: 'P1',
      idealAnswerOutline: '',
      recentTurnsSummary: '',
      candidateLastMessage: '',
      memoryBufferSummary: '',
      followUpCount: 0,
    });
    expect(wrapUpTurn.interviewerMessage).toContain('wraps up');
    expect(wrapUpTurn.phase).toBe('wrap_up');
  });
});

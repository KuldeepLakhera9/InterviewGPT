import { renderPromptText } from '../../prompt-library/services/prompt-library.service';
import { QUESTION_GENERATOR_SYSTEM_PROMPT } from '../prompts/question-generator.prompt';
import type {
  GeneratedQuestionSet,
  QuestionGeneratorInput,
} from '../types/question-generator.types';
import { generatedQuestionSetSchema } from '../schemas/question-generator.schema';
import type { QuestionDifficulty } from '../../question-bank/types/question-bank.types';

export async function runLlmQuestionGenerator(
  input: QuestionGeneratorInput
): Promise<{ questionSet: GeneratedQuestionSet; isFallback: boolean }> {
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  const openAiApiKey = process.env.OPENAI_API_KEY;

  // Retrieve user prompt via Prompt Library Service
  let userPrompt = '';
  try {
    userPrompt = renderPromptText('prompt_question_generator_v1', {
      roleTitle: input.roleTitle,
      seniorityLevel: input.seniorityLevel,
      companyName: input.companyName || 'Target Company',
      track: input.track,
      difficulty: input.difficulty,
      count: input.targetQuestionCount || 3,
    });
  } catch {
    userPrompt = `Generate ${input.targetQuestionCount || 3} tailored interview questions for ${input.roleTitle} (${input.seniorityLevel}) at ${input.companyName}. Track: ${input.track}, Difficulty: ${input.difficulty}.`;
  }

  if (geminiApiKey) {
    try {
      const res = await callGeminiQuestionApi(
        geminiApiKey,
        QUESTION_GENERATOR_SYSTEM_PROMPT,
        userPrompt
      );
      if (res) return { questionSet: res, isFallback: false };
    } catch (err) {
      console.warn('Gemini AI API call failed, using fallback AI question engine:', err);
    }
  }

  if (openAiApiKey) {
    try {
      const res = await callOpenAiQuestionApi(
        openAiApiKey,
        QUESTION_GENERATOR_SYSTEM_PROMPT,
        userPrompt
      );
      if (res) return { questionSet: res, isFallback: false };
    } catch (err) {
      console.warn('OpenAI API call failed, using fallback AI question engine:', err);
    }
  }

  return { questionSet: generateFallbackAiQuestionSet(input), isFallback: true };
}

async function callGeminiQuestionApi(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<GeneratedQuestionSet | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error ${response.status}`);
  }

  const data = await response.json();
  const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (textContent) {
    const parsed = JSON.parse(textContent);
    const validated = generatedQuestionSetSchema.safeParse(parsed);
    if (validated.success) {
      return validated.data;
    }
  }
  return null;
}

async function callOpenAiQuestionApi(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<GeneratedQuestionSet | null> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (content) {
    const parsed = JSON.parse(content);
    const validated = generatedQuestionSetSchema.safeParse(parsed);
    if (validated.success) {
      return validated.data;
    }
  }
  return null;
}

export function generateFallbackAiQuestionSet(input: QuestionGeneratorInput): GeneratedQuestionSet {
  const count = input.targetQuestionCount || 3;
  const companyName = input.companyName || 'Target Company';
  const roleTitle = input.roleTitle;

  const difficultyLadder: QuestionDifficulty[] = ['easy', 'medium', 'hard', 'expert'];
  const baseDiffIdx = difficultyLadder.indexOf(input.difficulty);

  const questions = Array.from({ length: count }, (_, idx) => {
    // Escalating difficulty
    const currentDiffIdx = Math.min(baseDiffIdx + idx, 3);
    const currentDifficulty = difficultyLadder[currentDiffIdx] || 'medium';

    if (input.track === 'system_design') {
      if (idx === 0) {
        return {
          title: `Warm-up: High-Level ${roleTitle} Service Boundaries`,
          questionText: `Based on your experience as a ${roleTitle}, how do you establish service boundaries and data models when building features for ${companyName}? What key metrics signal when a monolithic service should be split?`,
          category: 'architecture' as const,
          topic: 'Service Decomposition',
          difficulty: 'medium' as const,
          companyTags: [companyName, input.companyTier.toUpperCase()],
          roleTags: [roleTitle],
          expectedDurationSeconds: 360,
          followUpReferences: [
            {
              id: 'fu-gen-1',
              promptText: 'How do you prevent circular dependencies between microservices?',
              targetDepth: 'intermediate' as const,
              hint: 'Domain events or asynchronous pub/sub messaging queues.',
            },
          ],
          evaluationMetadata: {
            idealAnswerOutline:
              '1. Domain-driven design (DDD) bounded contexts.\n2. API contract stability.\n3. Shared database anti-pattern awareness.',
            keyConcepts: ['Domain Driven Design', 'Bounded Contexts', 'API Contracts'],
            tradeOffPoints: ['Monolith simplicity vs Microservices deployment overhead'],
            scoringCriteria: [
              {
                pillar: 'technical_depth' as const,
                weight: 0.5,
                description: 'Understands service boundary patterns.',
              },
            ],
          },
        };
      }
      return {
        title: `Deep-Dive #${idx + 1}: ${companyName} Distributed Scale & Fault Tolerance`,
        questionText: `Suppose ${companyName} experiences a 10x traffic surge causing database connection pool exhaustion. How would you redesign the caching topology, connection pooling, and circuit breaking to ensure system resilience?`,
        category: 'system_design' as const,
        topic: 'Distributed Fault Tolerance',
        difficulty: currentDifficulty,
        companyTags: [companyName, input.companyTier.toUpperCase()],
        roleTags: [roleTitle],
        expectedDurationSeconds: 450 + idx * 60,
        followUpReferences: [
          {
            id: `fu-gen-${idx + 1}`,
            promptText:
              'What cascading failure modes occur if your Redis cache node restarts under load?',
            targetDepth: 'deep' as const,
            hint: 'Cache stampede / thundering herd problem.',
          },
        ],
        evaluationMetadata: {
          idealAnswerOutline:
            '1. Circuit breaker pattern.\n2. Connection pooling tuning (PgBouncer).\n3. Cache stampede mitigation using mutex locks or probabilistic early expiration.',
          keyConcepts: ['Circuit Breakers', 'Thundering Herd', 'Connection Pooling'],
          tradeOffPoints: ['Stale cache data tolerance vs database load protection'],
          scoringCriteria: [
            {
              pillar: 'problem_solving' as const,
              weight: 0.6,
              description: 'Analyzes root causes of connection pool exhaustion.',
            },
          ],
        },
      };
    }

    if (input.track === 'behavioral') {
      return {
        title: `Behavioral #${idx + 1}: Cross-Functional Leadership & ${companyName} Culture`,
        questionText: `Tell me about a time as a ${roleTitle} when you had to balance urgent product deadline demands with critical technical debt refactoring at ${companyName}. How did you prioritize requirements and align stakeholders?`,
        category: 'behavioral' as const,
        topic: 'Stakeholder Alignment & Tech Debt',
        difficulty: currentDifficulty,
        companyTags: [companyName, input.companyTier.toUpperCase()],
        roleTags: [roleTitle],
        expectedDurationSeconds: 300,
        followUpReferences: [
          {
            id: `fu-beh-${idx + 1}`,
            promptText:
              'What metrics did you track post-release to prove the refactoring succeeded?',
            targetDepth: 'intermediate' as const,
            hint: 'Defect rate reduction, deployment velocity, latency improvement.',
          },
        ],
        evaluationMetadata: {
          idealAnswerOutline:
            '1. Situation: High stakeholder pressure & brittle legacy code.\n2. Task: Balance sprint velocity with refactoring.\n3. Action: Incremental refactoring alongside feature work.\n4. Result: Zero regressions and faster lead time for changes.',
          keyConcepts: ['STAR Method', 'Stakeholder Management', 'Technical Debt'],
          tradeOffPoints: ['Short-term feature velocity vs long-term code maintainability'],
          scoringCriteria: [
            {
              pillar: 'star_framework' as const,
              weight: 0.5,
              description: 'Follows Situation, Task, Action, Result framing.',
            },
          ],
        },
      };
    }

    // Default Technical Track
    return {
      title: `Technical #${idx + 1}: ${roleTitle} State Synchronization & Concurrency`,
      questionText: `In your work as a ${roleTitle}, how do you manage race conditions when multiple concurrent client actions mutate shared application state? Detail your strategy for optimistic UI updates vs server confirmation.`,
      category: 'technical' as const,
      topic: 'State Management & Concurrency',
      difficulty: currentDifficulty,
      companyTags: [companyName, input.companyTier.toUpperCase()],
      roleTags: [roleTitle],
      expectedDurationSeconds: 360 + idx * 60,
      followUpReferences: [
        {
          id: `fu-tech-${idx + 1}`,
          promptText:
            'How do you rollback optimistic updates cleanly if the server HTTP request times out?',
          targetDepth: 'intermediate' as const,
          hint: 'Snapshot rollback states and display actionable error toasts.',
        },
      ],
      evaluationMetadata: {
        idealAnswerOutline:
          '1. Optimistic state mutation pattern.\n2. Transaction rollback mechanism.\n3. Idempotent API endpoints with unique mutation keys.',
        keyConcepts: ['Optimistic UI', 'Idempotency', 'State Rollbacks'],
        tradeOffPoints: ['Perceived UI speed vs data consistency risk'],
        scoringCriteria: [
          {
            pillar: 'technical_depth' as const,
            weight: 0.5,
            description: 'Mastery of async state management and rollback UI.',
          },
        ],
      },
    };
  });

  return {
    generationSummary: `AI Question Engine generated ${count} tailored questions for a ${input.seniorityLevel.toUpperCase()} ${roleTitle} targeting ${companyName} (${input.companyTier.toUpperCase()}). Questions feature gradual difficulty escalation from ${input.difficulty.toUpperCase()} to ${questions[count - 1]?.difficulty.toUpperCase()}.`,
    questions,
  };
}

import type { AnswerEvaluationData } from '../types/evaluation.types';
import { answerEvaluationSchema } from '../schemas/evaluation.schema';
import { runLlmEvaluation } from '../pipeline/evaluation-llm.provider';

export interface AnswerEvaluationInput {
  turnId: string;
  turnIndex: number;
  questionText: string;
  candidateAnswer: string;
  roleTitle: string;
  seniorityLevel: string;
  track: string;
  difficulty: string;
}

export async function evaluateCandidateAnswer(
  input: AnswerEvaluationInput
): Promise<AnswerEvaluationData> {
  const { data } = await runLlmEvaluation(
    'answer-evaluation',
    input as unknown as Record<string, unknown>,
    answerEvaluationSchema,
    generateFallbackAnswerEvaluation
  );
  return data;
}

export function generateFallbackAnswerEvaluation(
  input: Record<string, unknown>
): AnswerEvaluationData {
  const turnId = String(input.turnId || 'turn-1');
  const turnIndex = Number(input.turnIndex || 1);
  const questionText = String(input.questionText || 'Interview Question');
  const candidateAnswer = String(input.candidateAnswer || '');
  const wordCount = candidateAnswer.split(/\s+/).filter(Boolean).length;

  let baseScore = 70;
  if (wordCount > 80) baseScore += 12;
  else if (wordCount > 40) baseScore += 6;
  else if (wordCount < 15) baseScore -= 20;

  const hasExample = /for example|instance|such as|in my previous project|at my last company/i.test(
    candidateAnswer
  );
  const hasTradeoffs =
    /trade-off|tradeoff|however|on the other hand|alternatively|versus|pros and cons/i.test(
      candidateAnswer
    );

  const technicalAccuracy = Math.min(100, Math.max(40, baseScore + (hasTradeoffs ? 10 : 0)));
  const completeness = Math.min(100, Math.max(35, baseScore + (wordCount > 60 ? 8 : -10)));
  const relevance = Math.min(100, Math.max(50, baseScore + 5));
  const clarity = Math.min(100, Math.max(45, baseScore + (wordCount < 150 ? 5 : -5)));
  const structure = Math.min(100, Math.max(40, baseScore + (hasExample ? 8 : 0)));
  const examplesUsed = hasExample ? 85 : 50;
  const depthOfKnowledge = Math.min(100, Math.max(35, baseScore + (hasTradeoffs ? 12 : -5)));
  const communication = Math.min(100, Math.max(45, baseScore));

  const overallAnswerScore = Math.round(
    (technicalAccuracy +
      completeness +
      relevance +
      clarity +
      structure +
      examplesUsed +
      depthOfKnowledge +
      communication) /
      8
  );

  return {
    turnId,
    turnIndex,
    questionText,
    candidateAnswer,
    scores: {
      technicalAccuracy,
      completeness,
      relevance,
      clarity,
      structure,
      examplesUsed,
      depthOfKnowledge,
      communication,
    },
    overallAnswerScore,
    strengths: [
      wordCount > 40 ? 'Sufficient detailed response length' : 'Direct response tone',
      hasExample ? 'Provided concrete practical examples' : 'Relevant problem addressing',
      hasTradeoffs ? 'Demonstrated awareness of architectural trade-offs' : 'Clear communication',
    ],
    gaps: [
      !hasExample ? 'Lacks specific real-world project examples' : '',
      !hasTradeoffs ? 'Could expand further on trade-offs and edge cases' : '',
      wordCount < 30 ? 'Response is relatively brief' : '',
    ].filter(Boolean),
    keyConceptsCovered: ['Core Concepts', 'Domain Problem Solving'],
    keyConceptsMissed: ['Quantitative Benchmark Metrics', 'Edge Case Failure Handling'],
    feedbackSummary:
      overallAnswerScore >= 75
        ? 'Solid response demonstrating key technical concepts and good clarity.'
        : 'Good foundation, but expand with more concrete project examples and operational trade-offs.',
    improvedAnswerOutline: `1. State high-level architecture/approach.\n2. Explain step-by-step implementation details.\n3. Mention trade-offs, scaling limits, and monitoring metrics.\n4. Conclude with measurable result or metric achieved.`,
  };
}

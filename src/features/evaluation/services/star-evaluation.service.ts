import type { StarFrameworkData } from '../types/evaluation.types';
import { starFrameworkSchema } from '../schemas/evaluation.schema';
import { runLlmEvaluation } from '../pipeline/evaluation-llm.provider';

export interface StarEvaluationInput {
  questionText: string;
  candidateAnswer: string;
  seniorityLevel: string;
}

export async function evaluateStarFramework(
  input: StarEvaluationInput
): Promise<StarFrameworkData> {
  const { data } = await runLlmEvaluation(
    'star-framework',
    input as unknown as Record<string, unknown>,
    starFrameworkSchema,
    generateFallbackStarEvaluation
  );
  return data;
}

export function generateFallbackStarEvaluation(input: Record<string, unknown>): StarFrameworkData {
  const answer = String(input.candidateAnswer || '');

  const hasSituation =
    /situation|when I was|at my previous|project context|team was building|faced a challenge/i.test(
      answer
    );
  const hasTask =
    /my task|my role|responsible for|objective was|assigned to|needed to resolve/i.test(answer);
  const hasAction =
    /I designed|I wrote|I refactored|I led|I implemented|I set up|I configured|I automated/i.test(
      answer
    );
  const hasResult =
    /as a result|which led to|reduced|improved|increased|saved|delivered|outcome was|successfully/i.test(
      answer
    );
  const hasMetrics = /(\d+%|\$\d+|\d+x|\d+\s*(ms|seconds|hours|days|users)|zero downtime)/i.test(
    answer
  );

  const situationScore = hasSituation ? 85 : 45;
  const taskScore = hasTask ? 80 : 40;
  const actionScore = hasAction ? 88 : 50;
  const resultScore = hasResult ? (hasMetrics ? 92 : 72) : 35;

  const overallStarScore = Math.round((situationScore + taskScore + actionScore + resultScore) / 4);

  const missingSections: string[] = [];
  if (!hasSituation) missingSections.push('Situation');
  if (!hasTask) missingSections.push('Task');
  if (!hasAction) missingSections.push('Action');
  if (!hasResult) missingSections.push('Result');

  const improvementSuggestions: string[] = [];
  if (missingSections.length > 0) {
    improvementSuggestions.push(
      `Structure your response explicitly with the STAR framework: start by setting the Situation, clarifying your specific Task, detailing your personal Actions, and concluding with the quantifiable Result.`
    );
  }
  if (!hasMetrics) {
    improvementSuggestions.push(
      `Quantify the Result with metrics (e.g. "% latency reduction", "x% sprint velocity increase", or "$ saved in cloud infrastructure").`
    );
  }

  return {
    isStarApplicable: true,
    overallStarScore,
    situation: {
      score: situationScore,
      summary: hasSituation
        ? 'Context and business challenge established effectively.'
        : 'Context was implicit or brief; state the organizational environment clearly.',
      isMissing: !hasSituation,
    },
    task: {
      score: taskScore,
      summary: hasTask
        ? 'Personal ownership and core responsibility defined.'
        : 'Differentiate your specific personal assignment from overall team goals.',
      isMissing: !hasTask,
    },
    action: {
      score: actionScore,
      summary: hasAction
        ? 'Detailed specific technical and tactical steps executed.'
        : 'Highlight "I" actions explicitly rather than general team efforts.',
      isMissing: !hasAction,
    },
    result: {
      score: resultScore,
      summary: hasResult
        ? 'Concrete outcomes articulated.'
        : 'Always conclude with quantifiable business impact or team productivity metrics.',
      isMissing: !hasResult,
      hasQuantifiableMetrics: hasMetrics,
    },
    missingSections,
    improvementSuggestions:
      improvementSuggestions.length > 0
        ? improvementSuggestions
        : [
            'Exemplary STAR story delivery. Maintain this structured format in all behavioural interviews.',
          ],
  };
}

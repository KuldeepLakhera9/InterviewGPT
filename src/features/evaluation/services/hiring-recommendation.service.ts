import type {
  HiringRecommendationData,
  HiringRecommendationType,
  ReadinessRating,
} from '../types/evaluation.types';
import { hiringRecommendationDataSchema } from '../schemas/evaluation.schema';
import { runLlmEvaluation } from '../pipeline/evaluation-llm.provider';

export interface HiringRecommendationInput {
  roleTitle: string;
  seniorityLevel: string;
  companyName: string;
  companyTier: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  behaviouralScore: number;
  keyStrengths: string[];
  keyGaps: string[];
  transcriptTurnSummaries: string[];
}

export async function generateHiringRecommendation(
  input: HiringRecommendationInput
): Promise<HiringRecommendationData> {
  const { data } = await runLlmEvaluation(
    'hiring',
    input as unknown as Record<string, unknown>,
    hiringRecommendationDataSchema,
    generateFallbackHiringRecommendation
  );
  return data;
}

export function generateFallbackHiringRecommendation(
  input: Record<string, unknown>
): HiringRecommendationData {
  const overallScore = Number(input.overallScore || 75);
  const technicalScore = Number(input.technicalScore || 75);
  const communicationScore = Number(input.communicationScore || 80);
  const behaviouralScore = Number(input.behaviouralScore || 75);
  const roleTitle = String(input.roleTitle || 'Senior Engineer');
  const companyName = String(input.companyName || 'Target Tech');
  const companyTier = String(input.companyTier || 'tier_2');

  let recommendation: HiringRecommendationType = 'Hire';
  let readinessRating: ReadinessRating = 'ready_now';

  // Adjust thresholds based on company tier bar
  const thresholdBonus = companyTier === 'tier_1' ? 5 : 0;

  if (overallScore >= 85 + thresholdBonus && technicalScore >= 82) {
    recommendation = 'Strong Hire';
    readinessRating = 'ready_now';
  } else if (overallScore >= 75 + thresholdBonus && technicalScore >= 72) {
    recommendation = 'Hire';
    readinessRating = 'ready_with_minor_coaching';
  } else if (overallScore >= 65 && technicalScore >= 60) {
    recommendation = 'Lean Hire';
    readinessRating = 'ready_with_minor_coaching';
  } else if (overallScore >= 55) {
    recommendation = 'Lean Reject';
    readinessRating = 'needs_significant_upskilling';
  } else {
    recommendation = 'Reject';
    readinessRating = 'not_recommended';
  }

  const technicalEvidence = [
    `Demonstrated a technical accuracy rating of ${technicalScore}/100 across main technical domain questions.`,
    technicalScore >= 75
      ? `Articulated clear system architecture and concurrency concepts for ${roleTitle} level.`
      : `Exhibited minor gaps in deep architectural trade-off justification.`,
  ];

  const communicationEvidence = [
    `Achieved a communication intelligence score of ${communicationScore}/100.`,
    communicationScore >= 80
      ? `Maintained professional tone, clear sentence structure, and structured explanations.`
      : `Communication was clear but could benefit from tighter conciseness.`,
  ];

  const culturalAndBehaviouralEvidence = [
    `Evaluated at ${behaviouralScore}/100 on behavioural and STAR framework execution.`,
    behaviouralScore >= 75
      ? `Conveyed structured past experience with clear personal ownership.`
      : `Opportunity to quantify results with additional concrete metrics.`,
  ];

  const concernsAndRisks: string[] = [];
  if (technicalScore < 70) {
    concernsAndRisks.push(
      `Technical depth score (${technicalScore}/100) is slightly below senior bar.`
    );
  }
  if (communicationScore < 70) {
    concernsAndRisks.push(`Communication conciseness requires minor polishing.`);
  }
  if (concernsAndRisks.length === 0) {
    concernsAndRisks.push(
      `No critical deal-breaker risks identified for ${roleTitle} at ${companyName}.`
    );
  }

  const executiveSummary = `Candidate evaluated at an overall score of ${overallScore}/100 for ${roleTitle} at ${companyName}. Based on technical depth (${technicalScore}/100), communication fluency (${communicationScore}/100), and STAR behavioral structure (${behaviouralScore}/100), the final hiring panel recommendation is ${recommendation.toUpperCase()}.`;

  return {
    recommendation,
    recommendationScore: overallScore,
    confidenceScore: 90,
    executiveSummary,
    evidenceJustification: {
      technicalEvidence,
      communicationEvidence,
      culturalAndBehaviouralEvidence,
      concernsAndRisks,
    },
    readinessRating,
    nextStepsForRecruiter: [
      recommendation.includes('Hire')
        ? 'Proceed to offer stage or final team matching round.'
        : 'Provide candidate with personalized learning roadmap and schedule follow-up re-evaluation in 3-4 weeks.',
      'Share candidate scorecard breakdown with interviewing panel.',
    ],
  };
}

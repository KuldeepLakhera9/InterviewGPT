import type { CommunicationMetricsData } from '../types/evaluation.types';
import { communicationMetricsSchema } from '../schemas/evaluation.schema';
import { runLlmEvaluation } from '../pipeline/evaluation-llm.provider';

export interface CommunicationIntelligenceInput {
  candidateTurnsText: string[];
}

const COMMON_FILLER_WORDS = [
  'um',
  'uh',
  'like',
  'you know',
  'basically',
  'actually',
  'literally',
  'sort of',
  'kind of',
];

export async function analyzeCommunicationIntelligence(
  input: CommunicationIntelligenceInput
): Promise<CommunicationMetricsData> {
  const totalWords = input.candidateTurnsText.join(' ').split(/\s+/).filter(Boolean).length;
  const avgLength =
    input.candidateTurnsText.length > 0
      ? Math.round(totalWords / input.candidateTurnsText.length)
      : 0;

  const payload = {
    candidateTurnsText: input.candidateTurnsText,
    totalWords,
    averageResponseLengthWords: avgLength,
  };

  const { data } = await runLlmEvaluation(
    'communication',
    payload,
    communicationMetricsSchema,
    generateFallbackCommunicationMetrics
  );
  return data;
}

export function generateFallbackCommunicationMetrics(
  input: Record<string, unknown>
): CommunicationMetricsData {
  const turnsText = (input.candidateTurnsText as string[]) || [];
  const fullText = turnsText.join(' ');
  const words = fullText.split(/\s+/).filter((w) => w.trim().length > 0);
  const totalWords = words.length;

  const fillerCounts: Record<string, number> = {};
  let totalFillers = 0;

  COMMON_FILLER_WORDS.forEach((filler) => {
    const regex = new RegExp(`\\b${filler.replace(' ', '\\s+')}\\b`, 'gi');
    const matches = fullText.match(regex);
    const count = matches ? matches.length : 0;
    if (count > 0) {
      fillerCounts[filler] = count;
      totalFillers += count;
    }
  });

  const fillerDensityPercentage =
    totalWords > 0 ? Number(((totalFillers / totalWords) * 100).toFixed(1)) : 0;

  const averageWordsPerTurn = turnsText.length > 0 ? Math.round(totalWords / turnsText.length) : 0;

  let verbosityAssessment: 'concise' | 'balanced' | 'overly_verbose' | 'brief' = 'balanced';
  if (averageWordsPerTurn > 150) verbosityAssessment = 'overly_verbose';
  else if (averageWordsPerTurn < 30) verbosityAssessment = 'brief';
  else if (averageWordsPerTurn < 70) verbosityAssessment = 'concise';

  const frequentlyUsedFillers = Object.entries(fillerCounts)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);

  const grammarScore = 82;
  const vocabularyScore = 80;
  let clarityScore = 84;
  const sentenceStructureScore = 81;
  let concisenessScore = 83;
  let professionalToneScore = 86;

  if (fillerDensityPercentage > 5) {
    clarityScore -= 10;
    professionalToneScore -= 8;
  }
  if (verbosityAssessment === 'overly_verbose') {
    concisenessScore -= 15;
  } else if (verbosityAssessment === 'brief') {
    clarityScore -= 8;
  }

  const overallCommunicationScore = Math.round(
    (grammarScore +
      vocabularyScore +
      clarityScore +
      sentenceStructureScore +
      concisenessScore +
      professionalToneScore) /
      6
  );

  return {
    grammarScore,
    vocabularyScore,
    clarityScore,
    sentenceStructureScore,
    concisenessScore,
    professionalToneScore,
    readabilityGrade: 'Grade 11 / Professional Standard',
    overallCommunicationScore,
    fillerWordMetrics: {
      totalFillerCount: totalFillers,
      frequentlyUsedFillers,
      fillerDensityPercentage,
    },
    responseLengthAnalysis: {
      averageWordsPerTurn,
      verbosityAssessment,
      totalWords,
    },
    feedback: {
      strengths: [
        'Maintained professional tone and industry terminology',
        'Articulated ideas with clear sentence boundaries',
        'Good pace and conversational fluency',
      ],
      actionableTips: [
        totalFillers > 3 ? 'Minimize reliance on filler words during transition pauses' : '',
        verbosityAssessment === 'overly_verbose'
          ? 'Aim for tighter 45-60 second structural summaries'
          : '',
        'Incorporate explicit transition phrases when moving between technical details',
      ].filter(Boolean),
    },
  };
}

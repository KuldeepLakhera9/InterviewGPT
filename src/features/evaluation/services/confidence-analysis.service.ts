import type { ConfidenceAnalysisData, AnswerEvaluationData } from '../types/evaluation.types';

const UNCERTAINTY_PHRASES = [
  'i think',
  'maybe',
  'i guess',
  'not sure',
  'probably',
  'i believe',
  'kind of',
  'sort of',
  "don't know",
  'might be',
  'possibly',
];

export function analyzeConfidenceAndConsistency(
  candidateTurnsText: string[],
  answerEvaluations: AnswerEvaluationData[]
): ConfidenceAnalysisData {
  const fullText = candidateTurnsText.join(' ').toLowerCase();

  let uncertaintyCount = 0;
  const detectedPhrases: string[] = [];

  UNCERTAINTY_PHRASES.forEach((phrase) => {
    const regex = new RegExp(`\\b${phrase.replace("'", "\\'")}\\b`, 'gi');
    const matches = fullText.match(regex);
    if (matches && matches.length > 0) {
      uncertaintyCount += matches.length;
      if (!detectedPhrases.includes(phrase)) {
        detectedPhrases.push(phrase);
      }
    }
  });

  const avgClarity =
    answerEvaluations.length > 0
      ? Math.round(
          answerEvaluations.reduce((sum, e) => sum + e.scores.clarity, 0) / answerEvaluations.length
        )
      : 80;

  const avgCompleteness =
    answerEvaluations.length > 0
      ? Math.round(
          answerEvaluations.reduce((sum, e) => sum + e.scores.completeness, 0) /
            answerEvaluations.length
        )
      : 82;

  const avgStructure =
    answerEvaluations.length > 0
      ? Math.round(
          answerEvaluations.reduce((sum, e) => sum + e.scores.structure, 0) /
            answerEvaluations.length
        )
      : 80;

  // Calculate consistency across turn scores (low standard deviation = high consistency)
  const answerScores = answerEvaluations.map((e) => e.overallAnswerScore);
  let consistencyScore = 85;
  if (answerScores.length > 1) {
    const mean = answerScores.reduce((a, b) => a + b, 0) / answerScores.length;
    const variance =
      answerScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / answerScores.length;
    const stdDev = Math.sqrt(variance);
    consistencyScore = Math.min(100, Math.max(50, Math.round(100 - stdDev * 2.5)));
  }

  let confidenceBase = Math.round((avgClarity + avgCompleteness + avgStructure) / 3);
  if (uncertaintyCount > 5) confidenceBase -= 12;
  else if (uncertaintyCount > 2) confidenceBase -= 6;

  const overallConfidenceScore = Math.min(100, Math.max(40, confidenceBase));
  const explanationQualityScore = avgClarity;
  const decisionJustificationScore = Math.round((avgCompleteness + avgStructure) / 2);

  const keyObservations: string[] = [
    `Demonstrated steady explanation structure with consistency index of ${consistencyScore}/100.`,
    uncertaintyCount <= 2
      ? 'Rare usage of hedging or uncertainty language, reflecting assertive technical conviction.'
      : `Used uncertainty language (${uncertaintyCount} instances) during complex trade-off probes.`,
    `Justified architectural choices with an average decision clarity rating of ${explanationQualityScore}/100.`,
  ];

  return {
    overallConfidenceScore,
    consistencyScore,
    explanationQualityScore,
    decisionJustificationScore,
    uncertaintyLanguageFrequency: {
      count: uncertaintyCount,
      phrases: detectedPhrases,
    },
    keyObservations,
    disclaimerNote:
      'Confidence metrics are inferred strictly from linguistic structure, response completeness, and explanation consistency within the text transcript. They do not represent physiological or emotion detection.',
  };
}

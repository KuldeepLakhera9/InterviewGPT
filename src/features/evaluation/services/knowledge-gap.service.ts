import type { KnowledgeGapItem, AnswerEvaluationData } from '../types/evaluation.types';

export function detectKnowledgeGaps(
  answerEvaluations: AnswerEvaluationData[],
  track: string
): KnowledgeGapItem[] {
  const gaps: KnowledgeGapItem[] = [];
  let priorityCounter = 1;

  answerEvaluations.forEach((evalData) => {
    if (evalData.scores.technicalAccuracy < 70 || evalData.scores.depthOfKnowledge < 70) {
      gaps.push({
        concept: `In-depth ${evalData.keyConceptsMissed[0] || 'Technical Deep-Dive'}`,
        topic: evalData.questionText.slice(0, 45) + '...',
        severity: evalData.scores.technicalAccuracy < 55 ? 'critical' : 'moderate',
        missingTerminology: evalData.keyConceptsMissed.slice(0, 3),
        observedDeficit: `Candidate answer scored ${evalData.scores.depthOfKnowledge}/100 on depth of knowledge for question: "${evalData.questionText}".`,
        recommendation: `Review key architectural tradeoffs, internal data structures, and edge case failure handling for ${evalData.keyConceptsMissed.join(', ')}.`,
        priorityOrder: priorityCounter++,
      });
    }

    if (evalData.scores.examplesUsed < 60) {
      gaps.push({
        concept: 'Concrete Production Example Grounding',
        topic: 'Real-World System Implementation',
        severity: 'moderate',
        missingTerminology: ['Production Metrics', 'SLA / SLO', 'Telemetry'],
        observedDeficit:
          'Explanation was theoretical without concrete real-world project examples.',
        recommendation:
          'Prepare 2-3 detailed stories referencing measurable metrics and production impact.',
        priorityOrder: priorityCounter++,
      });
    }
  });

  if (gaps.length === 0) {
    if (track === 'system_design') {
      gaps.push({
        concept: 'Distributed Consistency vs Availability Trade-offs',
        topic: 'CAP Theorem & Quorum Consensus',
        severity: 'minor',
        missingTerminology: ['Saga Pattern', 'Two-Phase Commit', 'Eventual Consistency'],
        observedDeficit:
          'Answer provided solid general architecture, but could emphasize distributed transactions.',
        recommendation: 'Deepen understanding of distributed transaction protocols (Saga vs 2PC).',
        priorityOrder: 1,
      });
    } else {
      gaps.push({
        concept: 'Async Task Queue Dead-Letter Handling',
        topic: 'Message Queue Resilience',
        severity: 'minor',
        missingTerminology: ['Idempotency Keys', 'Dead-Letter Queue (DLQ)', 'Backoff Jitter'],
        observedDeficit: 'Minor opportunity to expand on retries and exponential backoff jitter.',
        recommendation: 'Review message queue retry patterns and idempotent message consumption.',
        priorityOrder: 1,
      });
    }
  }

  return gaps.sort((a, b) => {
    const severityMap = { critical: 1, moderate: 2, minor: 3 };
    return severityMap[a.severity] - severityMap[b.severity] || a.priorityOrder - b.priorityOrder;
  });
}

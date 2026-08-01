import type { InterviewMemoryState, InterviewTurnData } from '../types/conversation-engine.types';

export function createInitialMemoryState(): InterviewMemoryState {
  return {
    candidateStrengths: [],
    candidateGaps: [],
    topicsCovered: [],
    discussedExperiences: [],
    currentFollowUpCount: 0,
  };
}

export function updateMemoryState(
  currentMemory: InterviewMemoryState,
  newTurn: InterviewTurnData
): InterviewMemoryState {
  const updated: InterviewMemoryState = { ...currentMemory };

  if (newTurn.metadata?.extractedStrength) {
    const strength = newTurn.metadata.extractedStrength.trim();
    if (strength && !updated.candidateStrengths.includes(strength)) {
      updated.candidateStrengths = [...updated.candidateStrengths, strength];
    }
  }

  if (newTurn.metadata?.extractedGap) {
    const gap = newTurn.metadata.extractedGap.trim();
    if (gap && !updated.candidateGaps.includes(gap)) {
      updated.candidateGaps = [...updated.candidateGaps, gap];
    }
  }

  if (newTurn.metadata?.mentionedExperience) {
    const exp = newTurn.metadata.mentionedExperience.trim();
    if (exp && !updated.discussedExperiences.includes(exp)) {
      updated.discussedExperiences = [...updated.discussedExperiences, exp];
    }
  }

  if (newTurn.topic && !updated.topicsCovered.includes(newTurn.topic)) {
    updated.topicsCovered = [...updated.topicsCovered, newTurn.topic];
  }

  if (typeof newTurn.metadata?.followUpCount === 'number') {
    updated.currentFollowUpCount = newTurn.metadata.followUpCount;
  }

  return updated;
}

export function formatMemorySummary(memory: InterviewMemoryState): string {
  const parts: string[] = [];

  if (memory.candidateStrengths.length > 0) {
    parts.push(`Observed Strengths: ${memory.candidateStrengths.slice(-4).join('; ')}`);
  }

  if (memory.candidateGaps.length > 0) {
    parts.push(`Observed Gaps: ${memory.candidateGaps.slice(-4).join('; ')}`);
  }

  if (memory.discussedExperiences.length > 0) {
    parts.push(`Referenced Experiences: ${memory.discussedExperiences.slice(-4).join('; ')}`);
  }

  if (memory.topicsCovered.length > 0) {
    parts.push(`Topics Covered: ${memory.topicsCovered.join(', ')}`);
  }

  return parts.length > 0 ? parts.join('\n') : 'No specific candidate memory logged yet.';
}

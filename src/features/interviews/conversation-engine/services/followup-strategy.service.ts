import type { QuestionDifficulty } from '../../question-bank/types/question-bank.types';
import type { ConversationEngineState, FollowUpDecision } from '../types/conversation-engine.types';

export const MAX_FOLLOWUP_PROBES_PER_QUESTION = 2;

export function evaluateFollowUpStrategy(
  state: ConversationEngineState,
  candidateLastMessage: string
): FollowUpDecision {
  const currentFollowUpCount = state.memory.currentFollowUpCount || 0;
  const isLastQuestion = state.currentQuestionIndex >= state.questions.length - 1;
  const messageLength = candidateLastMessage.trim().length;

  // If candidate gave a very short/vague response (< 30 chars), probe for detail
  if (messageLength < 30 && currentFollowUpCount < MAX_FOLLOWUP_PROBES_PER_QUESTION) {
    return {
      action: 'ask_followup',
      probeType: 'shallow',
      reason: 'Candidate answer was brief. Probing for specific implementation details.',
      nextDifficulty: state.difficulty,
    };
  }

  // If we haven't reached max follow-up limit and candidate provided a detailed response, ask a deep architectural challenge probe
  if (currentFollowUpCount < MAX_FOLLOWUP_PROBES_PER_QUESTION) {
    const nextDiff = adaptDifficulty(state.difficulty, 'increase');
    return {
      action: 'ask_followup',
      probeType: 'deep',
      reason: 'Candidate provided good detail. Escalating to deep failure mode probe.',
      nextDifficulty: nextDiff,
    };
  }

  // If max follow-ups reached for current question
  if (isLastQuestion) {
    return {
      action: 'wrap_up_interview',
      reason: 'All core questions and follow-ups completed.',
    };
  }

  // Transition to next core question
  return {
    action: 'transition_next_question',
    reason: 'Completed core question and follow-up probes. Moving to next topic.',
    nextDifficulty: state.difficulty,
  };
}

export function adaptDifficulty(
  current: QuestionDifficulty,
  direction: 'increase' | 'decrease' | 'maintain'
): QuestionDifficulty {
  const ladder: QuestionDifficulty[] = ['easy', 'medium', 'hard', 'expert'];
  const idx = ladder.indexOf(current);

  if (direction === 'increase') {
    return ladder[Math.min(idx + 1, 3)] || 'expert';
  }
  if (direction === 'decrease') {
    return ladder[Math.max(idx - 1, 0)] || 'easy';
  }
  return current;
}

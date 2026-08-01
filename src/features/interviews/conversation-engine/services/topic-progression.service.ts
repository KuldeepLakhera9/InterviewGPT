import type { ConversationEngineState, InterviewPhase } from '../types/conversation-engine.types';
import type { QuestionBankItemData } from '../../question-bank/types/question-bank.types';

export function computeNextPhase(
  currentState: ConversationEngineState,
  decisionAction: 'ask_followup' | 'transition_next_question' | 'wrap_up_interview'
): {
  nextPhase: InterviewPhase;
  nextQuestionIndex: number;
  activeQuestion: QuestionBankItemData | null;
} {
  if (decisionAction === 'wrap_up_interview') {
    return {
      nextPhase: 'wrap_up',
      nextQuestionIndex: currentState.currentQuestionIndex,
      activeQuestion: currentState.activeQuestion,
    };
  }

  if (decisionAction === 'ask_followup') {
    return {
      nextPhase: 'followup_probe',
      nextQuestionIndex: currentState.currentQuestionIndex,
      activeQuestion: currentState.activeQuestion,
    };
  }

  // transition_next_question
  const nextIdx = currentState.currentQuestionIndex + 1;
  const nextQuestion = currentState.questions[nextIdx] || null;

  if (!nextQuestion) {
    return {
      nextPhase: 'wrap_up',
      nextQuestionIndex: currentState.currentQuestionIndex,
      activeQuestion: currentState.activeQuestion,
    };
  }

  return {
    nextPhase: 'topic_transition',
    nextQuestionIndex: nextIdx,
    activeQuestion: nextQuestion,
  };
}

export function getNaturalTransitionPhrase(
  previousTopic: string,
  newTopic: string,
  roleTitle: string
): string {
  const transitionPhrases = [
    `Thanks for walking through that. Shifting gears a bit, let's explore ${newTopic} in your role as a ${roleTitle}.`,
    `Great insights on ${previousTopic}. Now, I'd like to move on to ${newTopic}.`,
    `Appreciate the depth there. Let's transition to our next key domain: ${newTopic}.`,
  ];
  const idx = Math.abs((previousTopic.length + newTopic.length) % transitionPhrases.length);
  return transitionPhrases[idx] || transitionPhrases[0];
}

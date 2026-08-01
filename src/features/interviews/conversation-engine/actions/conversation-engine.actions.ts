'use server';

import type { ConversationEngineState } from '../types/conversation-engine.types';
import {
  getConversationState,
  processCandidateTurn,
  startConversation,
} from '../services/conversation-engine.service';

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getInterviewStateAction(
  sessionId: string
): Promise<ActionResult<ConversationEngineState>> {
  try {
    const state = await getConversationState(sessionId);
    if (!state) {
      return { success: false, error: 'Interview session not found.' };
    }
    return { success: true, data: state };
  } catch (err) {
    console.error('Failed to get interview state:', err);
    return { success: false, error: 'Failed to retrieve conversation state.' };
  }
}

export async function startInterviewAction(
  sessionId: string
): Promise<ActionResult<ConversationEngineState>> {
  try {
    const state = await startConversation(sessionId);
    return { success: true, data: state };
  } catch (err) {
    console.error('Failed to start interview conversation:', err);
    return { success: false, error: 'Failed to initialize conversation engine.' };
  }
}

export async function submitCandidateTurnAction(
  sessionId: string,
  messageText: string
): Promise<ActionResult<ConversationEngineState>> {
  if (!messageText || !messageText.trim()) {
    return { success: false, error: 'Message content cannot be empty.' };
  }

  try {
    const updatedState = await processCandidateTurn(sessionId, messageText);
    return { success: true, data: updatedState };
  } catch (err) {
    console.error('Failed to process candidate response turn:', err);
    return { success: false, error: 'Failed to process response turn in conversation engine.' };
  }
}

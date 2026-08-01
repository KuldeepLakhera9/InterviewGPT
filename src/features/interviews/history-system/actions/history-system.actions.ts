'use server';

import { cookies } from 'next/headers';
import type {
  HistoryFilterParams,
  HistoryQueryResult,
  HistorySessionItem,
} from '../types/history-system.types';
import {
  deleteSessionHistory,
  duplicateSession,
  getInterviewHistory,
  toggleArchiveSession,
} from '../services/history-system.service';

const AUTH_COOKIE_NAME = 'interview_gpt_session';

export interface HistoryActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const DEFAULT_USER_REF = {
  userId: 'user-default-candidate',
  workspaceId: 'ws-default-workspace',
};

async function getCurrentUserRef(): Promise<{ userId: string; workspaceId: string }> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
    if (sessionCookie?.value) {
      try {
        const parts = sessionCookie.value.split('_');
        const email = parts.slice(2).join('_');
        if (email) return DEFAULT_USER_REF;
      } catch {}
    }
    return DEFAULT_USER_REF;
  } catch {
    return DEFAULT_USER_REF;
  }
}

export async function getInterviewHistoryAction(
  params: HistoryFilterParams = {}
): Promise<HistoryActionResult<HistoryQueryResult>> {
  const userRef = await getCurrentUserRef();
  try {
    const res = await getInterviewHistory(params, userRef?.userId, userRef?.workspaceId);
    return { success: true, data: res };
  } catch (err) {
    console.error('Failed to get interview history:', err);
    return { success: false, error: 'Failed to retrieve interview history.' };
  }
}

export async function toggleArchiveSessionAction(
  sessionId: string,
  isArchived: boolean
): Promise<HistoryActionResult<boolean>> {
  try {
    const res = await toggleArchiveSession(sessionId, isArchived);
    return { success: true, data: res };
  } catch (err) {
    console.error('Failed to toggle archive session:', err);
    return { success: false, error: 'Failed to update session archive status.' };
  }
}

export async function duplicateSessionAction(
  sessionId: string
): Promise<HistoryActionResult<HistorySessionItem>> {
  try {
    const res = await duplicateSession(sessionId);
    return { success: true, data: res };
  } catch (err) {
    console.error('Failed to duplicate session:', err);
    return { success: false, error: 'Failed to duplicate interview session.' };
  }
}

export async function deleteSessionHistoryAction(
  sessionId: string
): Promise<HistoryActionResult<boolean>> {
  try {
    const res = await deleteSessionHistory(sessionId);
    return { success: true, data: res };
  } catch (err) {
    console.error('Failed to delete session history:', err);
    return { success: false, error: 'Failed to delete interview session.' };
  }
}

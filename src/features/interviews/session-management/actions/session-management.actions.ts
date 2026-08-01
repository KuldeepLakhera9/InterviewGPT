'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import type {
  SessionFilterParams,
  SessionHistoryQueryResult,
  SessionSummaryData,
} from '../types/session-management.types';
import {
  deleteSession,
  endSession,
  getSessionsHistory,
  pauseSession,
  restartSession,
  resumeSession,
  startSession,
} from '../services/session-management.service';

const AUTH_COOKIE_NAME = 'interview_gpt_session';

export interface SessionActionResult<T> {
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
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      try {
        const defaultUser = await prisma.user.findFirst({
          where: { deletedAt: null },
        });
        if (defaultUser) {
          return { userId: defaultUser.id, workspaceId: defaultUser.workspaceId };
        }
      } catch (err) {
        console.warn('Prisma user lookup failed in session actions:', err);
      }
      return DEFAULT_USER_REF;
    }

    const parts = sessionCookie.split('_');
    const email = parts.slice(2).join('_') || 'admin@interviewgpt.com';

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      return { userId: user.id, workspaceId: user.workspaceId };
    }
    return DEFAULT_USER_REF;
  } catch {
    return DEFAULT_USER_REF;
  }
}

export async function startSessionAction(
  sessionId: string
): Promise<SessionActionResult<SessionSummaryData>> {
  try {
    const res = await startSession(sessionId);
    return { success: true, data: res };
  } catch (err) {
    console.error('Failed to start session:', err);
    return { success: false, error: 'Failed to start interview session.' };
  }
}

export async function pauseSessionAction(
  sessionId: string
): Promise<SessionActionResult<SessionSummaryData>> {
  try {
    const res = await pauseSession(sessionId);
    return { success: true, data: res };
  } catch (err) {
    console.error('Failed to pause session:', err);
    return { success: false, error: 'Failed to pause interview session.' };
  }
}

export async function resumeSessionAction(
  sessionId: string
): Promise<SessionActionResult<SessionSummaryData>> {
  try {
    const res = await resumeSession(sessionId);
    return { success: true, data: res };
  } catch (err) {
    console.error('Failed to resume session:', err);
    return { success: false, error: 'Failed to resume interview session.' };
  }
}

export async function restartSessionAction(
  sessionId: string
): Promise<SessionActionResult<SessionSummaryData>> {
  try {
    const res = await restartSession(sessionId);
    return { success: true, data: res };
  } catch (err) {
    console.error('Failed to restart session:', err);
    return { success: false, error: 'Failed to restart interview session.' };
  }
}

export async function endSessionAction(
  sessionId: string,
  finalStatus: 'completed' | 'terminated' = 'completed'
): Promise<SessionActionResult<SessionSummaryData>> {
  try {
    const res = await endSession(sessionId, finalStatus);
    return { success: true, data: res };
  } catch (err) {
    console.error('Failed to end session:', err);
    return { success: false, error: 'Failed to end interview session.' };
  }
}

export async function deleteSessionAction(
  sessionId: string
): Promise<SessionActionResult<boolean>> {
  try {
    const res = await deleteSession(sessionId);
    return { success: true, data: res };
  } catch (err) {
    console.error('Failed to delete session:', err);
    return { success: false, error: 'Failed to delete interview session.' };
  }
}

export async function getSessionsHistoryAction(
  params: SessionFilterParams = {}
): Promise<SessionActionResult<SessionHistoryQueryResult>> {
  const userRef = await getCurrentUserRef();
  try {
    const res = await getSessionsHistory(params, userRef?.userId, userRef?.workspaceId);
    return { success: true, data: res };
  } catch (err) {
    console.error('Failed to fetch session history:', err);
    return { success: false, error: 'Failed to fetch interview session history.' };
  }
}

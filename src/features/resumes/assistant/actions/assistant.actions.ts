'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import type { ResumeAssistantActionResult } from '../../types/resume.types';
import { assistantService } from '../services/assistant.service';

const AUTH_COOKIE_NAME = 'interview_gpt_session';

async function getCurrentUserRef(): Promise<{ userId: string; workspaceId: string } | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      const defaultUser = await prisma.user.findFirst({
        where: { deletedAt: null },
      });
      if (defaultUser) {
        return { userId: defaultUser.id, workspaceId: defaultUser.workspaceId };
      }
      return null;
    }

    const parts = sessionCookie.split('_');
    const email = parts.slice(2).join('_') || 'admin@interviewgpt.com';

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      let workspace = await prisma.workspace.findFirst();
      if (!workspace) {
        workspace = await prisma.workspace.create({
          data: {
            name: 'Default Workspace',
            slug: `default-${Date.now()}`,
          },
        });
      }

      user = await prisma.user.create({
        data: {
          email,
          workspaceId: workspace.id,
          role: 'MEMBER',
        },
      });
    }

    return { userId: user.id, workspaceId: user.workspaceId };
  } catch (err) {
    console.error('Error getting user ref for Assistant actions:', err);
    return null;
  }
}

export async function sendAssistantMessageAction(
  resumeId: string,
  sessionId: string | undefined,
  messageContent: string
): Promise<ResumeAssistantActionResult> {
  const userRef = await getCurrentUserRef();

  if (!userRef) {
    return { success: false, error: 'Authentication required.' };
  }

  if (!messageContent || !messageContent.trim()) {
    return { success: false, error: 'Please provide a valid question or message.' };
  }

  try {
    const res = await assistantService.sendMessage(
      userRef.userId,
      resumeId,
      sessionId,
      messageContent
    );

    const messages = await assistantService.getSessionMessages(userRef.userId, res.session.id);
    const sessions = await assistantService.getSessions(userRef.userId, resumeId);

    return {
      success: true,
      session: res.session,
      messages,
      sessions,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send message to AI Assistant.';
    return { success: false, error: message };
  }
}

export async function getAssistantSessionsAction(
  resumeId: string
): Promise<ResumeAssistantActionResult> {
  const userRef = await getCurrentUserRef();

  if (!userRef) {
    return { success: false, error: 'Authentication required.' };
  }

  try {
    const sessions = await assistantService.getSessions(userRef.userId, resumeId);
    let messages: ReturnType<typeof assistantService.getSessionMessages> extends Promise<infer T>
      ? T
      : never = [];

    if (sessions.length > 0) {
      messages = await assistantService.getSessionMessages(userRef.userId, sessions[0].id);
    }

    return {
      success: true,
      session: sessions.length > 0 ? sessions[0] : undefined,
      sessions,
      messages,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to get assistant sessions.';
    return { success: false, error: message };
  }
}

export async function getAssistantSessionMessagesAction(
  sessionId: string
): Promise<ResumeAssistantActionResult> {
  const userRef = await getCurrentUserRef();

  if (!userRef) {
    return { success: false, error: 'Authentication required.' };
  }

  try {
    const messages = await assistantService.getSessionMessages(userRef.userId, sessionId);
    return {
      success: true,
      messages,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to get session messages.';
    return { success: false, error: message };
  }
}

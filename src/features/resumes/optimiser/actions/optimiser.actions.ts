'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import type { ResumeOptimisationActionResult } from '../../types/resume.types';
import { optimiserService } from '../services/optimiser.service';

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
    console.error('Error getting user ref for Optimiser actions:', err);
    return null;
  }
}

export async function optimiseResumeAction(
  resumeId: string
): Promise<ResumeOptimisationActionResult> {
  const userRef = await getCurrentUserRef();

  if (!userRef) {
    return { success: false, error: 'Authentication required.' };
  }

  try {
    const optimisation = await optimiserService.optimiseResume(userRef.userId, resumeId);
    const history = await optimiserService.getOptimisationHistory(userRef.userId, resumeId);

    return {
      success: true,
      message: 'Resume optimized successfully!',
      optimisation,
      history,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to optimize resume.';
    return { success: false, error: message };
  }
}

export async function getOptimisationHistoryAction(
  resumeId: string
): Promise<ResumeOptimisationActionResult> {
  const userRef = await getCurrentUserRef();

  if (!userRef) {
    return { success: false, error: 'Authentication required.' };
  }

  try {
    const history = await optimiserService.getOptimisationHistory(userRef.userId, resumeId);
    return {
      success: true,
      optimisation: history.length > 0 ? history[0] : undefined,
      history,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to get optimization history.';
    return { success: false, error: message };
  }
}

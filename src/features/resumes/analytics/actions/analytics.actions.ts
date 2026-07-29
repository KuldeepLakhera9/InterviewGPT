'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import type { ResumeAnalyticsActionResult } from '../../types/resume.types';
import { analyticsService } from '../services/analytics.service';

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
    console.error('Error getting user ref for Analytics actions:', err);
    return null;
  }
}

export async function getResumeAnalyticsAction(
  resumeId?: string
): Promise<ResumeAnalyticsActionResult> {
  const userRef = await getCurrentUserRef();

  if (!userRef) {
    return { success: false, error: 'Authentication required.' };
  }

  try {
    const analytics = await analyticsService.getResumeAnalytics(userRef.userId, resumeId);
    return {
      success: true,
      analytics,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve resume analytics.';
    return { success: false, error: message };
  }
}

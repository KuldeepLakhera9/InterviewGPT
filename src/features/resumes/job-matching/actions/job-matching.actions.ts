'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import type { JobMatchActionResult } from '../../types/resume.types';
import { jobMatchingService } from '../services/job-matching.service';

const AUTH_COOKIE_NAME = 'interview_gpt_session';

async function getCurrentUserRef(): Promise<{ userId: string; workspaceId: string } | null> {
  if (!process.env.DATABASE_URL) return null;
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
    console.error('Error getting user ref for Job Matching actions:', err);
    return null;
  }
}

export async function compareJobDescriptionAction(
  resumeId: string,
  jobDescriptionText: string,
  jobTitle?: string,
  companyName?: string
): Promise<JobMatchActionResult> {
  const userRef = await getCurrentUserRef();

  if (!userRef) {
    return { success: false, error: 'Authentication required.' };
  }

  if (!jobDescriptionText || jobDescriptionText.trim().length < 20) {
    return {
      success: false,
      error: 'Please provide a valid Job Description (at least 20 characters).',
    };
  }

  try {
    const matchRecord = await jobMatchingService.compareResumeWithJobDescription(
      userRef.userId,
      resumeId,
      jobDescriptionText,
      jobTitle,
      companyName
    );

    const history = await jobMatchingService.getJobMatchHistory(userRef.userId, resumeId);

    return {
      success: true,
      message: 'Job Description matching comparison completed!',
      jobMatch: matchRecord,
      history,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to compare resume with Job Description.';
    return { success: false, error: message };
  }
}

export async function getJobMatchHistoryAction(resumeId: string): Promise<JobMatchActionResult> {
  const userRef = await getCurrentUserRef();

  if (!userRef) {
    return { success: false, error: 'Authentication required.' };
  }

  try {
    const history = await jobMatchingService.getJobMatchHistory(userRef.userId, resumeId);
    return {
      success: true,
      jobMatch: history.length > 0 ? history[0] : undefined,
      history,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to get job match history.';
    return { success: false, error: message };
  }
}

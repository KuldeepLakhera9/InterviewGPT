'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import type { AtsAnalysisActionResult } from '../../types/resume.types';
import { atsService } from '../services/ats.service';

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
    console.error('Error getting user ref for ATS actions:', err);
    return null;
  }
}

export async function analyzeResumeAtsAction(resumeId: string): Promise<AtsAnalysisActionResult> {
  const userRef = await getCurrentUserRef();

  if (!userRef) {
    return { success: false, error: 'Authentication required.' };
  }

  try {
    const atsAnalysis = await atsService.analyzeResumeAts(userRef.userId, resumeId);
    return {
      success: true,
      message: 'ATS analysis completed successfully.',
      atsAnalysis,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to analyze resume for ATS.';
    return { success: false, error: message };
  }
}

export async function getAtsAnalysisAction(resumeId: string): Promise<AtsAnalysisActionResult> {
  const userRef = await getCurrentUserRef();

  if (!userRef) {
    return { success: false, error: 'Authentication required.' };
  }

  try {
    const atsAnalysis = await atsService.getAtsAnalysis(userRef.userId, resumeId);
    if (!atsAnalysis) {
      return { success: false, error: 'ATS analysis not available yet.' };
    }

    return {
      success: true,
      atsAnalysis,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to get ATS analysis.';
    return { success: false, error: message };
  }
}

'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import type { ResumeActionResult, ResumeItem } from '../types/resume.types';
import { resumeService } from '../services/resume.service';

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
          profile: {
            create: {
              fullName: email.split('@')[0] || 'Candidate',
            },
          },
        },
      });
    }

    return { userId: user.id, workspaceId: user.workspaceId };
  } catch (error) {
    console.error('Failed to get current user ref:', error);
    return null;
  }
}

export async function getResumesAction(): Promise<{ resumes: ResumeItem[]; error?: string }> {
  const userRef = await getCurrentUserRef();

  if (!userRef) {
    return { resumes: [], error: 'User session not found.' };
  }

  try {
    const resumes = await resumeService.getUserResumes(userRef.userId);
    return { resumes };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch resumes.';
    return { resumes: [], error: message };
  }
}

export async function uploadResumeAction(formData: FormData): Promise<ResumeActionResult> {
  const userRef = await getCurrentUserRef();

  if (!userRef) {
    return { success: false, error: 'Authentication required to upload resume.' };
  }

  const file = formData.get('file') as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: 'Please select a valid PDF or DOCX file.' };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await resumeService.uploadResume(
      userRef.userId,
      userRef.workspaceId,
      buffer,
      file.name,
      file.type
    );

    const updatedResumes = await resumeService.getUserResumes(userRef.userId);

    return {
      success: true,
      message: `Resume "${file.name}" uploaded successfully (v${uploaded.version}).`,
      resume: uploaded,
      resumes: updatedResumes,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to upload resume.';
    return { success: false, error: message };
  }
}

export async function replaceResumeAction(
  existingResumeId: string,
  formData: FormData
): Promise<ResumeActionResult> {
  const userRef = await getCurrentUserRef();

  if (!userRef) {
    return { success: false, error: 'Authentication required.' };
  }

  const file = formData.get('file') as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: 'Please select a valid replacement file.' };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const replaced = await resumeService.replaceResume(
      userRef.userId,
      userRef.workspaceId,
      existingResumeId,
      buffer,
      file.name,
      file.type
    );

    const updatedResumes = await resumeService.getUserResumes(userRef.userId);

    return {
      success: true,
      message: `Resume replaced with "${file.name}" (v${replaced.version}).`,
      resume: replaced,
      resumes: updatedResumes,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to replace resume.';
    return { success: false, error: message };
  }
}

export async function setActiveResumeVersionAction(resumeId: string): Promise<ResumeActionResult> {
  const userRef = await getCurrentUserRef();

  if (!userRef) {
    return { success: false, error: 'Authentication required.' };
  }

  try {
    await resumeService.setActiveVersion(userRef.userId, resumeId);
    const updatedResumes = await resumeService.getUserResumes(userRef.userId);

    return {
      success: true,
      message: 'Active resume version updated.',
      resumes: updatedResumes,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update active version.';
    return { success: false, error: message };
  }
}

export async function deleteResumeAction(resumeId: string): Promise<ResumeActionResult> {
  const userRef = await getCurrentUserRef();

  if (!userRef) {
    return { success: false, error: 'Authentication required.' };
  }

  try {
    await resumeService.deleteResume(userRef.userId, resumeId);
    const updatedResumes = await resumeService.getUserResumes(userRef.userId);

    return {
      success: true,
      message: 'Resume deleted successfully.',
      resumes: updatedResumes,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete resume.';
    return { success: false, error: message };
  }
}

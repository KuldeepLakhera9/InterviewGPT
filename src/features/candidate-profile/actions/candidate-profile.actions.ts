'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import type {
  CandidateProfileData,
  CandidateProfileState,
  SaveDraftResult,
  SubmitProfileResult,
} from '../types/candidate-profile.types';
import { candidateProfileSchema } from '../schemas/candidate-profile.schema';
import {
  calculateProfileCompletion,
  getDefaultCandidateProfileData,
} from '../services/candidate-profile.service';

const AUTH_COOKIE_NAME = 'interview_gpt_session';

async function getCurrentUserId(): Promise<{ userId: string; email: string } | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      // Return default mock user for dev/testing if not logged in
      const defaultUser = await prisma.user.findFirst({
        where: { deletedAt: null },
      });
      if (defaultUser) {
        return { userId: defaultUser.id, email: defaultUser.email };
      }
      return null;
    }

    // Session cookie format: session_timestamp_email
    const parts = sessionCookie.split('_');
    const email = parts.slice(2).join('_') || 'admin@interviewgpt.com';

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Find workspace or create default fallback workspace
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

    return { userId: user.id, email: user.email };
  } catch (error) {
    console.error('Failed to resolve current user:', error);
    return null;
  }
}

export async function getCandidateProfileAction(): Promise<CandidateProfileState> {
  const userRef = await getCurrentUserId();
  const defaultData = getDefaultCandidateProfileData();

  if (!userRef) {
    return {
      currentStep: 1,
      completionPercentage: 0,
      isSubmitted: false,
      data: defaultData,
    };
  }

  try {
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: userRef.userId },
    });

    if (!profile) {
      // Populate personal info defaults if user profile exists
      const userWithProfile = await prisma.user.findUnique({
        where: { id: userRef.userId },
        include: { profile: true },
      });

      if (userWithProfile?.profile) {
        defaultData.personalInfo.fullName = userWithProfile.profile.fullName || '';
        defaultData.personalInfo.email = userRef.email;
        defaultData.personalInfo.avatarUrl = userWithProfile.profile.avatarUrl || '';
        defaultData.personalInfo.headline = userWithProfile.profile.headline || '';
        defaultData.personalInfo.bio = userWithProfile.profile.bio || '';
      }

      return {
        currentStep: 1,
        completionPercentage: calculateProfileCompletion(defaultData),
        isSubmitted: false,
        data: defaultData,
      };
    }

    const savedDraft = (profile.draftData as unknown as Partial<CandidateProfileData>) || {};
    const mergedData: CandidateProfileData = {
      personalInfo: { ...defaultData.personalInfo, ...savedDraft.personalInfo },
      professionalInfo: { ...defaultData.professionalInfo, ...savedDraft.professionalInfo },
      skillsInfo: { ...defaultData.skillsInfo, ...savedDraft.skillsInfo },
      educationInfo: { ...defaultData.educationInfo, ...savedDraft.educationInfo },
      experienceInfo: { ...defaultData.experienceInfo, ...savedDraft.experienceInfo },
      projectsInfo: { ...defaultData.projectsInfo, ...savedDraft.projectsInfo },
      certificationsInfo: { ...defaultData.certificationsInfo, ...savedDraft.certificationsInfo },
      careerGoalsInfo: { ...defaultData.careerGoalsInfo, ...savedDraft.careerGoalsInfo },
    };

    const completion = calculateProfileCompletion(mergedData);

    return {
      currentStep: profile.currentStep || 1,
      completionPercentage: completion,
      isSubmitted: profile.isSubmitted || false,
      data: mergedData,
      updatedAt: profile.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Failed to get candidate profile:', error);
    return {
      currentStep: 1,
      completionPercentage: 0,
      isSubmitted: false,
      data: defaultData,
    };
  }
}

export async function saveCandidateProfileDraftAction(
  currentStep: number,
  draftData: CandidateProfileData
): Promise<SaveDraftResult> {
  const userRef = await getCurrentUserId();

  if (!userRef) {
    return {
      success: false,
      error: 'User authentication session not found.',
    };
  }

  try {
    const completionPercentage = calculateProfileCompletion(draftData);

    await prisma.candidateProfile.upsert({
      where: { userId: userRef.userId },
      create: {
        userId: userRef.userId,
        currentStep,
        completionStatus: completionPercentage,
        draftData: draftData as unknown as object,
      },
      update: {
        currentStep,
        completionStatus: completionPercentage,
        draftData: draftData as unknown as object,
      },
    });

    return {
      success: true,
      message: 'Draft saved successfully.',
      completionPercentage,
    };
  } catch (error) {
    console.error('Error saving candidate profile draft:', error);
    return {
      success: false,
      error: 'Failed to save draft. Please try again.',
    };
  }
}

export async function submitCandidateProfileAction(
  finalData: CandidateProfileData
): Promise<SubmitProfileResult> {
  const userRef = await getCurrentUserId();

  if (!userRef) {
    return {
      success: false,
      error: 'User authentication session not found.',
    };
  }

  // Validate entire profile
  const validation = candidateProfileSchema.safeParse(finalData);
  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message || 'Profile validation failed.';
    return {
      success: false,
      error: `Validation Error: ${firstError}`,
    };
  }

  try {
    const completionPercentage = calculateProfileCompletion(finalData);

    // Update candidate profile
    await prisma.candidateProfile.upsert({
      where: { userId: userRef.userId },
      create: {
        userId: userRef.userId,
        currentStep: 9,
        completionStatus: completionPercentage,
        isSubmitted: true,
        draftData: finalData as unknown as object,
      },
      update: {
        currentStep: 9,
        completionStatus: completionPercentage,
        isSubmitted: true,
        draftData: finalData as unknown as object,
      },
    });

    // Also sync key identity details to user profile table
    await prisma.profile.upsert({
      where: { userId: userRef.userId },
      create: {
        userId: userRef.userId,
        fullName: finalData.personalInfo.fullName,
        avatarUrl: finalData.personalInfo.avatarUrl || null,
        headline: finalData.personalInfo.headline || null,
        bio: finalData.personalInfo.bio || null,
      },
      update: {
        fullName: finalData.personalInfo.fullName,
        avatarUrl: finalData.personalInfo.avatarUrl || null,
        headline: finalData.personalInfo.headline || null,
        bio: finalData.personalInfo.bio || null,
      },
    });

    return {
      success: true,
      message: 'Candidate Profile submitted successfully!',
      redirectTo: '/dashboard',
    };
  } catch (error) {
    console.error('Failed to submit candidate profile:', error);
    return {
      success: false,
      error: 'An unexpected database error occurred during submission.',
    };
  }
}

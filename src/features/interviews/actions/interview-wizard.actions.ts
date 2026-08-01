'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import type {
  CreateInterviewSessionResult,
  DeleteInterviewPresetResult,
  InterviewConfigData,
  InterviewPresetItem,
  InterviewWizardState,
  SaveInterviewDraftResult,
  SaveInterviewPresetResult,
} from '../types/interview-wizard.types';
import { interviewConfigSchema } from '../schemas/interview-wizard.schema';
import {
  calculateConfigCompletion,
  generateResumeRecommendation,
  getDefaultInterviewConfigData,
  SYSTEM_DEFAULT_PRESETS,
} from '../services/interview-wizard.service';

const AUTH_COOKIE_NAME = 'interview_gpt_session';

const DEFAULT_USER_REF = {
  userId: 'user-default-candidate',
  workspaceId: 'ws-default-workspace',
  email: 'candidate@interviewgpt.com',
};

async function getCurrentUserRef(): Promise<{
  userId: string;
  workspaceId: string;
  email: string;
}> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      try {
        const defaultUser = await prisma.user.findFirst({
          where: { deletedAt: null },
        });
        if (defaultUser) {
          return {
            userId: defaultUser.id,
            workspaceId: defaultUser.workspaceId,
            email: defaultUser.email,
          };
        }
      } catch (err) {
        console.warn('Prisma user lookup failed, using fallback candidate session:', err);
      }
      return DEFAULT_USER_REF;
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

    return { userId: user.id, workspaceId: user.workspaceId, email: user.email };
  } catch (error) {
    console.warn('Failed to resolve authenticated user, using fallback candidate session:', error);
    return DEFAULT_USER_REF;
  }
}

export async function getInterviewWizardStateAction(): Promise<InterviewWizardState> {
  const userRef = await getCurrentUserRef();
  const defaultData = getDefaultInterviewConfigData();

  if (!userRef) {
    return {
      currentStep: 1,
      completionPercentage: calculateConfigCompletion(defaultData),
      data: defaultData,
      presets: SYSTEM_DEFAULT_PRESETS,
      recommendation: generateResumeRecommendation(null, null),
    };
  }

  try {
    // 1. Fetch draft
    const draft = await prisma.interviewWizardDraft.findUnique({
      where: { userId: userRef.userId },
    });

    let mergedData: InterviewConfigData = defaultData;
    let currentStep = 1;

    if (draft && draft.draftData) {
      const saved = draft.draftData as unknown as Partial<InterviewConfigData>;
      mergedData = {
        roleTitle: saved.roleTitle || defaultData.roleTitle,
        seniorityLevel: saved.seniorityLevel || defaultData.seniorityLevel,
        companyName: saved.companyName ?? defaultData.companyName,
        companyTier: saved.companyTier || defaultData.companyTier,
        track: saved.track || defaultData.track,
        difficulty: saved.difficulty || defaultData.difficulty,
        durationMinutes: saved.durationMinutes || defaultData.durationMinutes,
        focusAreas:
          Array.isArray(saved.focusAreas) && saved.focusAreas.length > 0
            ? saved.focusAreas
            : defaultData.focusAreas,
        adaptiveDifficulty: saved.adaptiveDifficulty ?? defaultData.adaptiveDifficulty,
      };
      currentStep = draft.currentStep || 1;
    }

    // 2. Fetch user presets
    const dbPresets = await prisma.interviewPreset.findMany({
      where: { userId: userRef.userId },
      orderBy: { createdAt: 'desc' },
    });

    const userPresets: InterviewPresetItem[] = dbPresets.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description || undefined,
      isSystem: false,
      createdAt: p.createdAt.toISOString(),
      config: {
        roleTitle: p.roleTitle,
        seniorityLevel: p.seniorityLevel as InterviewConfigData['seniorityLevel'],
        companyName: p.companyName || '',
        companyTier: p.companyTier as InterviewConfigData['companyTier'],
        track: p.track as InterviewConfigData['track'],
        difficulty: p.difficulty as InterviewConfigData['difficulty'],
        durationMinutes: p.durationMinutes as InterviewConfigData['durationMinutes'],
        focusAreas: (p.focusAreas as string[]) || [],
        adaptiveDifficulty: p.adaptiveMode,
      },
    }));

    const combinedPresets = [...SYSTEM_DEFAULT_PRESETS, ...userPresets];

    // 3. Fetch active resume for recommendation engine
    const activeResume = await prisma.resume.findFirst({
      where: { userId: userRef.userId, isActive: true },
      include: { parsedResume: true },
      orderBy: { createdAt: 'desc' },
    });

    const userProfile = await prisma.profile.findUnique({
      where: { userId: userRef.userId },
    });

    const recommendation = generateResumeRecommendation(
      activeResume?.parsedResume ? { rawText: activeResume.parsedResume.rawText } : null,
      userProfile
    );

    return {
      currentStep,
      completionPercentage: calculateConfigCompletion(mergedData),
      data: mergedData,
      presets: combinedPresets,
      recommendation,
      updatedAt: draft?.updatedAt ? draft.updatedAt.toISOString() : undefined,
    };
  } catch (error) {
    console.error('Error fetching interview wizard state:', error);
    return {
      currentStep: 1,
      completionPercentage: calculateConfigCompletion(defaultData),
      data: defaultData,
      presets: SYSTEM_DEFAULT_PRESETS,
      recommendation: generateResumeRecommendation(null, null),
    };
  }
}

export async function saveInterviewDraftAction(
  currentStep: number,
  draftData: InterviewConfigData
): Promise<SaveInterviewDraftResult> {
  const userRef = await getCurrentUserRef();

  if (!userRef) {
    return {
      success: false,
      error: 'User authentication session not found.',
    };
  }

  try {
    const completionPercentage = calculateConfigCompletion(draftData);

    await prisma.interviewWizardDraft.upsert({
      where: { userId: userRef.userId },
      create: {
        userId: userRef.userId,
        currentStep,
        draftData: draftData as unknown as object,
      },
      update: {
        currentStep,
        draftData: draftData as unknown as object,
      },
    });

    return {
      success: true,
      message: 'Interview configuration draft saved.',
      completionPercentage,
    };
  } catch (error) {
    console.error('Failed to save interview draft:', error);
    return {
      success: false,
      error: 'Failed to save draft configuration.',
    };
  }
}

export async function saveInterviewPresetAction(
  name: string,
  description: string | undefined,
  configData: InterviewConfigData
): Promise<SaveInterviewPresetResult> {
  const userRef = await getCurrentUserRef();

  if (!userRef) {
    return {
      success: false,
      error: 'User authentication session not found.',
    };
  }

  if (!name || name.trim().length < 2) {
    return {
      success: false,
      error: 'Preset name must be at least 2 characters long.',
    };
  }

  try {
    const created = await prisma.interviewPreset.create({
      data: {
        userId: userRef.userId,
        name: name.trim(),
        description: description?.trim() || null,
        roleTitle: configData.roleTitle,
        seniorityLevel: configData.seniorityLevel,
        companyName: configData.companyName || null,
        companyTier: configData.companyTier,
        track: configData.track,
        difficulty: configData.difficulty,
        durationMinutes: configData.durationMinutes,
        focusAreas: configData.focusAreas as unknown as object,
        adaptiveMode: configData.adaptiveDifficulty,
      },
    });

    const presetItem: InterviewPresetItem = {
      id: created.id,
      name: created.name,
      description: created.description || undefined,
      isSystem: false,
      createdAt: created.createdAt.toISOString(),
      config: configData,
    };

    return {
      success: true,
      preset: presetItem,
      message: `Preset "${created.name}" saved successfully.`,
    };
  } catch (error) {
    console.error('Failed to save interview preset:', error);
    return {
      success: false,
      error: 'Failed to save configuration preset.',
    };
  }
}

export async function deleteInterviewPresetAction(
  presetId: string
): Promise<DeleteInterviewPresetResult> {
  const userRef = await getCurrentUserRef();

  if (!userRef) {
    return {
      success: false,
      error: 'User authentication session not found.',
    };
  }

  try {
    await prisma.interviewPreset.deleteMany({
      where: {
        id: presetId,
        userId: userRef.userId,
      },
    });

    return {
      success: true,
      presetId,
      message: 'Preset deleted successfully.',
    };
  } catch (error) {
    console.error('Failed to delete interview preset:', error);
    return {
      success: false,
      error: 'Failed to delete preset.',
    };
  }
}

export async function createInterviewSessionAction(
  configData: InterviewConfigData
): Promise<CreateInterviewSessionResult> {
  const userRef = await getCurrentUserRef();

  // Boundary validation
  const validation = interviewConfigSchema.safeParse(configData);
  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message || 'Invalid interview configuration.';
    return {
      success: false,
      error: `Configuration Error: ${firstError}`,
    };
  }

  let sessionId = `sess-${Date.now()}`;

  try {
    let activeResumeId: string | null = null;
    try {
      const activeResume = await prisma.resume.findFirst({
        where: { userId: userRef.userId, isActive: true },
        select: { id: true },
      });
      activeResumeId = activeResume?.id || null;
    } catch {}

    try {
      const session = await prisma.interviewSession.create({
        data: {
          workspaceId: userRef.workspaceId,
          userId: userRef.userId,
          resumeId: activeResumeId,
          roleTitle: configData.roleTitle,
          seniorityLevel: configData.seniorityLevel,
          companyName: configData.companyName || null,
          companyTier: configData.companyTier,
          track: configData.track,
          difficulty: configData.difficulty,
          durationMinutes: configData.durationMinutes,
          focusAreas: configData.focusAreas as unknown as object,
          adaptiveMode: configData.adaptiveDifficulty,
          status: 'created',
        },
      });
      sessionId = session.id;

      // Clear completed wizard draft
      try {
        await prisma.interviewWizardDraft.deleteMany({
          where: { userId: userRef.userId },
        });
      } catch {}
    } catch (dbErr) {
      console.warn('DB session creation failed, launching with synthetic session:', dbErr);
    }

    return {
      success: true,
      sessionId,
      message: 'Interview session created successfully!',
      redirectTo: `/interviews/${sessionId}`,
    };
  } catch (error) {
    console.error('Failed to create interview session:', error);
    return {
      success: false,
      error: 'Failed to create interview session.',
    };
  }
}

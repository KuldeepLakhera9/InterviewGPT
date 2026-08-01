'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import type {
  GenerateQuestionsResult,
  QuestionGeneratorInput,
} from '../types/question-generator.types';
import { questionGeneratorInputSchema } from '../schemas/question-generator.schema';
import { generateQuestionSet } from '../services/question-generator.service';

const AUTH_COOKIE_NAME = 'interview_gpt_session';

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
        console.warn('Prisma lookup failed in question-generator.actions:', err);
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

export async function generateQuestionsAction(
  input: QuestionGeneratorInput
): Promise<GenerateQuestionsResult> {
  const userRef = await getCurrentUserRef();

  const validation = questionGeneratorInputSchema.safeParse(input);
  if (!validation.success) {
    const firstErr = validation.error.issues[0]?.message || 'Input validation failed.';
    return {
      success: false,
      error: `Validation Error: ${firstErr}`,
    };
  }

  try {
    const result = await generateQuestionSet(
      validation.data,
      userRef?.userId,
      userRef?.workspaceId
    );
    return {
      success: true,
      data: result,
    };
  } catch (err) {
    console.error('Failed to generate AI questions:', err);
    return {
      success: false,
      error: 'Failed to generate interview questions using AI engine.',
    };
  }
}

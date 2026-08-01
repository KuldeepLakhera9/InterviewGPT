'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import type {
  CreateQuestionInput,
  QuestionBankItemData,
  QuestionFilterParams,
  QuestionQueryResult,
} from '../types/question-bank.types';
import { createQuestionSchema, questionFilterSchema } from '../schemas/question-bank.schema';
import {
  createQuestion,
  getQuestionById,
  getQuestions,
  seedQuestionBankIfEmpty,
} from '../services/question-bank.service';

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
        console.warn('Prisma lookup failed in question-bank.actions:', err);
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

export async function getQuestionsAction(
  filters: QuestionFilterParams = {}
): Promise<{ success: boolean; data?: QuestionQueryResult; error?: string }> {
  try {
    const validatedFilters = questionFilterSchema.parse(filters);
    const result = await getQuestions(validatedFilters);
    return { success: true, data: result };
  } catch (err) {
    console.error('Failed to get questions:', err);
    return { success: false, error: 'Failed to retrieve question bank items.' };
  }
}

export async function getQuestionByIdAction(
  id: string
): Promise<{ success: boolean; data?: QuestionBankItemData; error?: string }> {
  try {
    const item = await getQuestionById(id);
    if (!item) {
      return { success: false, error: 'Question not found.' };
    }
    return { success: true, data: item };
  } catch (err) {
    console.error('Failed to get question by ID:', err);
    return { success: false, error: 'Failed to retrieve question.' };
  }
}

export async function createQuestionAction(
  input: CreateQuestionInput
): Promise<{ success: boolean; data?: QuestionBankItemData; error?: string }> {
  const userRef = await getCurrentUserRef();

  const valResult = createQuestionSchema.safeParse(input);
  if (!valResult.success) {
    const firstErr = valResult.error.issues[0]?.message || 'Validation error.';
    return { success: false, error: `Invalid Question Input: ${firstErr}` };
  }

  try {
    const created = await createQuestion(valResult.data, userRef?.userId, userRef?.workspaceId);
    return { success: true, data: created };
  } catch (err) {
    console.error('Failed to create question:', err);
    return { success: false, error: 'Failed to create question in database.' };
  }
}

export async function seedQuestionBankAction(): Promise<{
  success: boolean;
  insertedCount?: number;
  error?: string;
}> {
  try {
    const count = await seedQuestionBankIfEmpty();
    return { success: true, insertedCount: count };
  } catch (err) {
    console.error('Failed to seed question bank:', err);
    return { success: false, error: 'Failed to seed question repository.' };
  }
}

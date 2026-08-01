import { prisma } from '@/lib/prisma';
import type { QuestionBankItemData } from '../../question-bank/types/question-bank.types';
import { createQuestion } from '../../question-bank/services/question-bank.service';
import type { QuestionGeneratorInput } from '../types/question-generator.types';
import { questionGeneratorInputSchema } from '../schemas/question-generator.schema';
import { runLlmQuestionGenerator } from '../pipeline/question-generator-llm.provider';

export interface GeneratedQuestionSetResponse {
  summary: string;
  questions: QuestionBankItemData[];
  isFallback: boolean;
}

export async function generateQuestionSet(
  input: QuestionGeneratorInput,
  userId?: string,
  workspaceId?: string
): Promise<GeneratedQuestionSetResponse> {
  const validatedInput = questionGeneratorInputSchema.parse(input);

  let resumeText = validatedInput.resumeText || '';
  let resumeSkills: string[] = [];
  let candidateHeadline = validatedInput.candidateProfileHeadline || '';
  let candidateBio = validatedInput.candidateProfileBio || '';

  // 1. Fetch Resume Context if resumeId or active user resume exists
  try {
    let targetResumeId = validatedInput.resumeId;
    if (!targetResumeId && userId) {
      const activeResume = await prisma.resume.findFirst({
        where: { userId, isActive: true },
        select: { id: true },
      });
      targetResumeId = activeResume?.id;
    }

    if (targetResumeId) {
      const dbResume = await prisma.resume.findUnique({
        where: { id: targetResumeId },
        include: { parsedResume: true },
      });
      if (dbResume?.parsedResume) {
        resumeText = dbResume.parsedResume.rawText;
        const struct = dbResume.parsedResume.structuredData as Record<string, unknown>;
        if (Array.isArray(struct?.skills)) {
          resumeSkills = struct.skills as string[];
        }
      }
    }
  } catch (err) {
    console.warn('Resume data lookup failed for question generator:', err);
  }

  // 2. Fetch Candidate Profile Context
  try {
    if (userId && (!candidateHeadline || !candidateBio)) {
      const profile = await prisma.profile.findUnique({
        where: { userId },
      });
      if (profile) {
        candidateHeadline = candidateHeadline || profile.headline || '';
        candidateBio = candidateBio || profile.bio || '';
      }
    }
  } catch (err) {
    console.warn('Candidate profile lookup failed for question generator:', err);
  }

  // 3. Execute LLM Generator Pipeline
  const { questionSet, isFallback } = await runLlmQuestionGenerator({
    ...validatedInput,
    resumeText,
    resumeSkills,
    candidateProfileHeadline: candidateHeadline,
    candidateProfileBio: candidateBio,
  });

  // 4. Save to Question Bank database repository if requested
  const persistedQuestions: QuestionBankItemData[] = [];

  for (const q of questionSet.questions) {
    const createdItem = await createQuestion(
      {
        title: q.title,
        questionText: q.questionText,
        category: q.category,
        topic: q.topic,
        difficulty: q.difficulty,
        companyTags: q.companyTags,
        roleTags: q.roleTags,
        expectedDurationSeconds: q.expectedDurationSeconds,
        followUpReferences: q.followUpReferences,
        evaluationMetadata: q.evaluationMetadata,
        isAiGenerated: true,
        source: 'ai_generated',
      },
      userId,
      workspaceId
    );
    persistedQuestions.push(createdItem);
  }

  return {
    summary: questionSet.generationSummary,
    questions: persistedQuestions,
    isFallback,
  };
}

import { prisma } from '@/lib/prisma';
import type {
  CreateQuestionInput,
  EvaluationMetadata,
  FollowUpReference,
  QuestionBankItemData,
  QuestionCategory,
  QuestionDifficulty,
  QuestionFilterParams,
  QuestionQueryResult,
  QuestionSource,
} from '../types/question-bank.types';
import { SEED_QUESTION_BANK } from '../data/seed-questions';

export function mapDbToQuestionItem(item: {
  id: string;
  title: string;
  questionText: string;
  category: string;
  topic: string;
  difficulty: string;
  companyTags: unknown;
  roleTags: unknown;
  expectedDurationSeconds: number;
  followUpReferences: unknown;
  evaluationMetadata: unknown;
  isAiGenerated: boolean;
  source: string;
  createdById?: string | null;
  workspaceId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}): QuestionBankItemData {
  return {
    id: item.id,
    title: item.title,
    questionText: item.questionText,
    category: item.category as QuestionCategory,
    topic: item.topic,
    difficulty: item.difficulty as QuestionDifficulty,
    companyTags: Array.isArray(item.companyTags) ? (item.companyTags as string[]) : [],
    roleTags: Array.isArray(item.roleTags) ? (item.roleTags as string[]) : [],
    expectedDurationSeconds: item.expectedDurationSeconds || 300,
    followUpReferences: Array.isArray(item.followUpReferences)
      ? (item.followUpReferences as FollowUpReference[])
      : [],
    evaluationMetadata: (item.evaluationMetadata as EvaluationMetadata) || {
      idealAnswerOutline: '',
      keyConcepts: [],
      tradeOffPoints: [],
      scoringCriteria: [],
    },
    isAiGenerated: item.isAiGenerated ?? false,
    source: (item.source as QuestionSource) || 'system',
    createdById: item.createdById || null,
    workspaceId: item.workspaceId || null,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export function mapSeedToQuestionItem(
  seed: CreateQuestionInput,
  index: number
): QuestionBankItemData {
  const now = new Date().toISOString();
  return {
    id: `seed-q-${index + 1}`,
    title: seed.title,
    questionText: seed.questionText,
    category: seed.category,
    topic: seed.topic,
    difficulty: seed.difficulty,
    companyTags: seed.companyTags || [],
    roleTags: seed.roleTags || [],
    expectedDurationSeconds: seed.expectedDurationSeconds || 300,
    followUpReferences: seed.followUpReferences || [],
    evaluationMetadata: seed.evaluationMetadata,
    isAiGenerated: seed.isAiGenerated ?? false,
    source: seed.source || 'system',
    createdById: null,
    workspaceId: null,
    createdAt: now,
    updatedAt: now,
  };
}

export async function seedQuestionBankIfEmpty(): Promise<number> {
  try {
    const count = await prisma.questionBankItem.count();
    if (count > 0) return count;

    let inserted = 0;
    for (const q of SEED_QUESTION_BANK) {
      await prisma.questionBankItem.create({
        data: {
          title: q.title,
          questionText: q.questionText,
          category: q.category,
          topic: q.topic,
          difficulty: q.difficulty,
          companyTags: q.companyTags as unknown as object,
          roleTags: q.roleTags as unknown as object,
          expectedDurationSeconds: q.expectedDurationSeconds,
          followUpReferences: q.followUpReferences as unknown as object,
          evaluationMetadata: q.evaluationMetadata as unknown as object,
          isAiGenerated: q.isAiGenerated ?? false,
          source: q.source || 'system',
        },
      });
      inserted++;
    }
    return inserted;
  } catch (err) {
    console.error('Failed to seed question bank in DB:', err);
    return 0;
  }
}

export async function getQuestions(
  filters: QuestionFilterParams = {}
): Promise<QuestionQueryResult> {
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const limit = filters.limit && filters.limit > 0 ? filters.limit : 10;

  try {
    // Attempt DB query
    await seedQuestionBankIfEmpty();

    const where: Record<string, unknown> = {};

    if (filters.category && filters.category !== 'all') {
      where.category = filters.category;
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      where.difficulty = filters.difficulty;
    }
    if (filters.source && filters.source !== 'all') {
      where.source = filters.source;
    }
    if (typeof filters.isAiGenerated === 'boolean') {
      where.isAiGenerated = filters.isAiGenerated;
    }
    if (filters.topic) {
      where.topic = { contains: filters.topic, mode: 'insensitive' };
    }
    if (filters.searchQuery) {
      where.OR = [
        { title: { contains: filters.searchQuery, mode: 'insensitive' } },
        { questionText: { contains: filters.searchQuery, mode: 'insensitive' } },
        { topic: { contains: filters.searchQuery, mode: 'insensitive' } },
      ];
    }

    const [dbItems, totalCount] = await Promise.all([
      prisma.questionBankItem.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.questionBankItem.count({ where }),
    ]);

    const mapped = dbItems.map(mapDbToQuestionItem);

    // Compute tag aggregates
    const allDbQuestions = await prisma.questionBankItem.findMany({
      select: { category: true, topic: true, companyTags: true, roleTags: true },
    });

    const categories = Array.from(new Set(allDbQuestions.map((q) => q.category)));
    const topics = Array.from(new Set(allDbQuestions.map((q) => q.topic)));
    const companyTags = Array.from(
      new Set(
        allDbQuestions.flatMap((q) =>
          Array.isArray(q.companyTags) ? (q.companyTags as string[]) : []
        )
      )
    );
    const roleTags = Array.from(
      new Set(
        allDbQuestions.flatMap((q) => (Array.isArray(q.roleTags) ? (q.roleTags as string[]) : []))
      )
    );

    return {
      items: mapped,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
      availableCategories: categories,
      availableTopics: topics,
      availableCompanyTags: companyTags,
      availableRoleTags: roleTags,
    };
  } catch (err) {
    console.warn('Falling back to seed questions repository:', err);

    // In-memory fallback
    let items = SEED_QUESTION_BANK.map(mapSeedToQuestionItem);

    if (filters.category && filters.category !== 'all') {
      items = items.filter((q) => q.category === filters.category);
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      items = items.filter((q) => q.difficulty === filters.difficulty);
    }
    if (filters.source && filters.source !== 'all') {
      items = items.filter((q) => q.source === filters.source);
    }
    if (typeof filters.isAiGenerated === 'boolean') {
      items = items.filter((q) => q.isAiGenerated === filters.isAiGenerated);
    }
    if (filters.topic) {
      items = items.filter((q) => q.topic.toLowerCase().includes(filters.topic!.toLowerCase()));
    }
    if (filters.companyTag) {
      items = items.filter((q) =>
        q.companyTags.some((c) => c.toLowerCase() === filters.companyTag!.toLowerCase())
      );
    }
    if (filters.roleTag) {
      items = items.filter((q) =>
        q.roleTags.some((r) => r.toLowerCase() === filters.roleTag!.toLowerCase())
      );
    }
    if (filters.searchQuery) {
      const qLower = filters.searchQuery.toLowerCase();
      items = items.filter(
        (q) =>
          q.title.toLowerCase().includes(qLower) ||
          q.questionText.toLowerCase().includes(qLower) ||
          q.topic.toLowerCase().includes(qLower)
      );
    }

    const total = items.length;
    const paginated = items.slice((page - 1) * limit, page * limit);

    const allSeed = SEED_QUESTION_BANK.map(mapSeedToQuestionItem);
    const categories = Array.from(new Set(allSeed.map((q) => q.category)));
    const topics = Array.from(new Set(allSeed.map((q) => q.topic)));
    const companyTags = Array.from(new Set(allSeed.flatMap((q) => q.companyTags)));
    const roleTags = Array.from(new Set(allSeed.flatMap((q) => q.roleTags)));

    return {
      items: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      availableCategories: categories,
      availableTopics: topics,
      availableCompanyTags: companyTags,
      availableRoleTags: roleTags,
    };
  }
}

const customFallbackQuestions: QuestionBankItemData[] = [];

export async function getQuestionById(id: string): Promise<QuestionBankItemData | null> {
  try {
    const item = await prisma.questionBankItem.findUnique({
      where: { id },
    });
    if (item) {
      return mapDbToQuestionItem(item);
    }
  } catch (err) {
    console.warn('DB lookup failed, checking seed repository for ID:', id, err);
  }

  // Fallback check
  const seedItems = [...SEED_QUESTION_BANK.map(mapSeedToQuestionItem), ...customFallbackQuestions];
  const found = seedItems.find((q) => q.id === id);
  return found || null;
}

export async function createQuestion(
  input: CreateQuestionInput,
  createdById?: string,
  workspaceId?: string
): Promise<QuestionBankItemData> {
  try {
    const created = await prisma.questionBankItem.create({
      data: {
        title: input.title,
        questionText: input.questionText,
        category: input.category,
        topic: input.topic,
        difficulty: input.difficulty,
        companyTags: input.companyTags as unknown as object,
        roleTags: input.roleTags as unknown as object,
        expectedDurationSeconds: input.expectedDurationSeconds,
        followUpReferences: input.followUpReferences as unknown as object,
        evaluationMetadata: input.evaluationMetadata as unknown as object,
        isAiGenerated: input.isAiGenerated ?? false,
        source: input.source || 'user_custom',
        createdById: createdById || null,
        workspaceId: workspaceId || null,
      },
    });
    return mapDbToQuestionItem(created);
  } catch (err) {
    console.warn('Failed to insert question into DB, returning local object:', err);
    const mockId = `custom-q-${Date.now()}`;
    const now = new Date().toISOString();
    const fallbackItem: QuestionBankItemData = {
      id: mockId,
      title: input.title,
      questionText: input.questionText,
      category: input.category,
      topic: input.topic,
      difficulty: input.difficulty,
      companyTags: input.companyTags,
      roleTags: input.roleTags,
      expectedDurationSeconds: input.expectedDurationSeconds,
      followUpReferences: input.followUpReferences,
      evaluationMetadata: input.evaluationMetadata,
      isAiGenerated: input.isAiGenerated ?? false,
      source: input.source || 'user_custom',
      createdById: createdById || null,
      workspaceId: workspaceId || null,
      createdAt: now,
      updatedAt: now,
    };
    customFallbackQuestions.push(fallbackItem);
    return fallbackItem;
  }
}

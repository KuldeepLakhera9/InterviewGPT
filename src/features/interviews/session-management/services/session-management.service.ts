import { prisma } from '@/lib/prisma';
import type { QuestionDifficulty } from '../../question-bank/types/question-bank.types';
import type {
  SessionFilterParams,
  SessionHistoryQueryResult,
  SessionStatus,
  SessionSummaryData,
} from '../types/session-management.types';

export async function getSessionById(sessionId: string): Promise<SessionSummaryData | null> {
  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      turns: {
        select: { id: true, topic: true },
        orderBy: { turnIndex: 'desc' },
      },
    },
  });

  if (!session) return null;

  return {
    id: session.id,
    userId: session.userId,
    workspaceId: session.workspaceId,
    roleTitle: session.roleTitle,
    seniorityLevel: session.seniorityLevel,
    companyName: session.companyName || 'Target Company',
    companyTier: session.companyTier,
    track: session.track,
    difficulty: session.difficulty as QuestionDifficulty,
    durationMinutes: session.durationMinutes,
    focusAreas: (session.focusAreas as string[]) || [],
    adaptiveMode: session.adaptiveMode,
    status: session.status as SessionStatus,
    startedAt: session.startedAt?.toISOString() || null,
    pausedAt: session.pausedAt?.toISOString() || null,
    endedAt: session.endedAt?.toISOString() || null,
    elapsedSeconds: session.elapsedSeconds || 0,
    turnsCount: session.turns.length,
    lastActiveTopic: session.turns[0]?.topic || null,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
  };
}

export async function startSession(sessionId: string): Promise<SessionSummaryData> {
  const session = await prisma.interviewSession.findUnique({ where: { id: sessionId } });
  if (!session) throw new Error(`Session not found: ${sessionId}`);

  const updated = await prisma.interviewSession.update({
    where: { id: sessionId },
    data: {
      status: 'in_progress',
      startedAt: session.startedAt || new Date(),
      pausedAt: null,
    },
  });

  return (await getSessionById(updated.id))!;
}

export async function pauseSession(sessionId: string): Promise<SessionSummaryData> {
  const session = await prisma.interviewSession.findUnique({ where: { id: sessionId } });
  if (!session) throw new Error(`Session not found: ${sessionId}`);

  const now = new Date();
  let additionalSeconds = 0;

  if (session.startedAt && session.status === 'in_progress') {
    additionalSeconds = Math.max(
      Math.floor((now.getTime() - session.startedAt.getTime()) / 1000),
      0
    );
  }

  const updated = await prisma.interviewSession.update({
    where: { id: sessionId },
    data: {
      status: 'paused',
      pausedAt: now,
      elapsedSeconds: (session.elapsedSeconds || 0) + additionalSeconds,
    },
  });

  return (await getSessionById(updated.id))!;
}

export async function resumeSession(sessionId: string): Promise<SessionSummaryData> {
  const session = await prisma.interviewSession.findUnique({ where: { id: sessionId } });
  if (!session) throw new Error(`Session not found: ${sessionId}`);

  const updated = await prisma.interviewSession.update({
    where: { id: sessionId },
    data: {
      status: 'in_progress',
      startedAt: new Date(),
      pausedAt: null,
    },
  });

  return (await getSessionById(updated.id))!;
}

export async function restartSession(sessionId: string): Promise<SessionSummaryData> {
  // Delete associated turns
  await prisma.interviewTurn.deleteMany({
    where: { sessionId },
  });

  const updated = await prisma.interviewSession.update({
    where: { id: sessionId },
    data: {
      status: 'created',
      startedAt: null,
      pausedAt: null,
      endedAt: null,
      elapsedSeconds: 0,
    },
  });

  return (await getSessionById(updated.id))!;
}

export async function endSession(
  sessionId: string,
  finalStatus: 'completed' | 'terminated' = 'completed'
): Promise<SessionSummaryData> {
  const session = await prisma.interviewSession.findUnique({ where: { id: sessionId } });
  if (!session) throw new Error(`Session not found: ${sessionId}`);

  const now = new Date();
  let additionalSeconds = 0;

  if (session.startedAt && session.status === 'in_progress') {
    additionalSeconds = Math.max(
      Math.floor((now.getTime() - session.startedAt.getTime()) / 1000),
      0
    );
  }

  const updated = await prisma.interviewSession.update({
    where: { id: sessionId },
    data: {
      status: finalStatus,
      endedAt: now,
      elapsedSeconds: (session.elapsedSeconds || 0) + additionalSeconds,
    },
  });

  return (await getSessionById(updated.id))!;
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  try {
    await prisma.interviewSession.delete({
      where: { id: sessionId },
    });
    return true;
  } catch (err) {
    console.error('Failed to delete interview session:', err);
    return false;
  }
}

export async function getSessionsHistory(
  params: SessionFilterParams = {},
  userId?: string,
  workspaceId?: string
): Promise<SessionHistoryQueryResult> {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const whereClause: Record<string, unknown> = {};

  if (userId) whereClause.userId = userId;
  if (workspaceId) whereClause.workspaceId = workspaceId;

  if (params.status && params.status !== 'all') {
    whereClause.status = params.status;
  }

  if (params.track && params.track !== 'all') {
    whereClause.track = params.track;
  }

  if (params.searchQuery && params.searchQuery.trim()) {
    const q = params.searchQuery.trim();
    whereClause.OR = [
      { roleTitle: { contains: q, mode: 'insensitive' } },
      { companyName: { contains: q, mode: 'insensitive' } },
    ];
  }

  try {
    const [dbSessions, totalCount] = await Promise.all([
      prisma.interviewSession.findMany({
        where: whereClause,
        include: {
          turns: {
            select: { id: true, topic: true },
            orderBy: { turnIndex: 'desc' },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.interviewSession.count({ where: whereClause }),
    ]);

    const items: SessionSummaryData[] = dbSessions.map((s) => ({
      id: s.id,
      userId: s.userId,
      workspaceId: s.workspaceId,
      roleTitle: s.roleTitle,
      seniorityLevel: s.seniorityLevel,
      companyName: s.companyName || 'Target Company',
      companyTier: s.companyTier,
      track: s.track,
      difficulty: s.difficulty as QuestionDifficulty,
      durationMinutes: s.durationMinutes,
      focusAreas: (s.focusAreas as string[]) || [],
      adaptiveMode: s.adaptiveMode,
      status: s.status as SessionStatus,
      startedAt: s.startedAt?.toISOString() || null,
      pausedAt: s.pausedAt?.toISOString() || null,
      endedAt: s.endedAt?.toISOString() || null,
      elapsedSeconds: s.elapsedSeconds || 0,
      turnsCount: s.turns.length,
      lastActiveTopic: s.turns[0]?.topic || null,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    }));

    return {
      items,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
    };
  } catch (err) {
    console.warn('DB session history query failed, returning empty result:', err);
    return {
      items: [],
      total: 0,
      page,
      totalPages: 1,
    };
  }
}

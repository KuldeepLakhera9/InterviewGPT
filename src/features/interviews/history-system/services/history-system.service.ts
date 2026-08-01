import { prisma } from '@/lib/prisma';
import type { QuestionDifficulty } from '../../question-bank/types/question-bank.types';
import type {
  HistoryFilterParams,
  HistoryQueryResult,
  HistorySessionItem,
} from '../types/history-system.types';

// In-memory fallback dataset when DB is offline or unconfigured
const IN_MEMORY_HISTORY: HistorySessionItem[] = [
  {
    id: 'seed-sess-1',
    roleTitle: 'Senior Frontend Engineer',
    seniorityLevel: 'senior',
    companyName: 'Google',
    companyTier: 'faang',
    track: 'technical',
    difficulty: 'hard',
    durationMinutes: 45,
    status: 'in_progress',
    isArchived: false,
    startedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    endedAt: null,
    elapsedSeconds: 1200,
    turnsCount: 6,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: 'seed-sess-2',
    roleTitle: 'Staff Distributed Systems Architect',
    seniorityLevel: 'staff',
    companyName: 'Amazon Web Services',
    companyTier: 'tier_1',
    track: 'system_design',
    difficulty: 'expert',
    durationMinutes: 60,
    status: 'completed',
    isArchived: false,
    startedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    endedAt: new Date(Date.now() - 2 * 86400000 + 3600 * 1000).toISOString(),
    elapsedSeconds: 3600,
    turnsCount: 14,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000 + 3600 * 1000).toISOString(),
  },
];

export async function getInterviewHistory(
  params: HistoryFilterParams = {},
  userId?: string,
  workspaceId?: string
): Promise<HistoryQueryResult> {
  const page = Math.max(params.page || 1, 1);
  const limit = Math.max(params.limit || 9, 1);
  const skip = (page - 1) * limit;

  try {
    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (workspaceId) where.workspaceId = workspaceId;

    // Archiving filter
    if (params.status === 'archived' || params.showArchivedOnly) {
      where.isArchived = true;
    } else {
      where.isArchived = false;
      if (params.status && params.status !== 'all') {
        where.status = params.status;
      }
    }

    if (params.track && params.track !== 'all') {
      where.track = params.track;
    }

    if (params.difficulty && params.difficulty !== 'all') {
      where.difficulty = params.difficulty;
    }

    if (params.searchQuery && params.searchQuery.trim()) {
      const q = params.searchQuery.trim();
      where.OR = [
        { roleTitle: { contains: q, mode: 'insensitive' } },
        { companyName: { contains: q, mode: 'insensitive' } },
        { track: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [dbSessions, totalCount] = await Promise.all([
      prisma.interviewSession.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          turns: { select: { id: true } },
        },
      }),
      prisma.interviewSession.count({ where }),
    ]);

    // Aggregate stats
    const [totalSess, inProgSess, compSess, archSess] = await Promise.all([
      prisma.interviewSession.count({ where: { userId, workspaceId } }),
      prisma.interviewSession.count({
        where: { userId, workspaceId, status: 'in_progress', isArchived: false },
      }),
      prisma.interviewSession.count({
        where: { userId, workspaceId, status: 'completed', isArchived: false },
      }),
      prisma.interviewSession.count({ where: { userId, workspaceId, isArchived: true } }),
    ]);

    const items: HistorySessionItem[] = dbSessions.map((s) => ({
      id: s.id,
      roleTitle: s.roleTitle,
      seniorityLevel: s.seniorityLevel,
      companyName: s.companyName || 'Target Company',
      companyTier: s.companyTier,
      track: s.track,
      difficulty: s.difficulty as QuestionDifficulty,
      durationMinutes: s.durationMinutes,
      status: s.status,
      isArchived: s.isArchived,
      startedAt: s.startedAt?.toISOString() || null,
      endedAt: s.endedAt?.toISOString() || null,
      elapsedSeconds: s.elapsedSeconds,
      turnsCount: s.turns.length,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    }));

    return {
      items,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
      stats: {
        totalSessions: totalSess,
        inProgressSessions: inProgSess,
        completedSessions: compSess,
        archivedSessions: archSess,
      },
    };
  } catch (err) {
    console.warn('DB history lookup failed, using fallback repository:', err);

    let filtered = [...IN_MEMORY_HISTORY];

    if (params.status === 'archived' || params.showArchivedOnly) {
      filtered = filtered.filter((s) => s.isArchived);
    } else {
      filtered = filtered.filter((s) => !s.isArchived);
      if (params.status && params.status !== 'all') {
        filtered = filtered.filter((s) => s.status === params.status);
      }
    }

    if (params.track && params.track !== 'all') {
      filtered = filtered.filter((s) => s.track === params.track);
    }

    if (params.difficulty && params.difficulty !== 'all') {
      filtered = filtered.filter((s) => s.difficulty === params.difficulty);
    }

    if (params.searchQuery && params.searchQuery.trim()) {
      const q = params.searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.roleTitle.toLowerCase().includes(q) ||
          s.companyName.toLowerCase().includes(q) ||
          s.track.toLowerCase().includes(q)
      );
    }

    const paginated = filtered.slice(skip, skip + limit);

    return {
      items: paginated,
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit) || 1,
      stats: {
        totalSessions: IN_MEMORY_HISTORY.length,
        inProgressSessions: IN_MEMORY_HISTORY.filter((s) => s.status === 'in_progress').length,
        completedSessions: IN_MEMORY_HISTORY.filter((s) => s.status === 'completed').length,
        archivedSessions: IN_MEMORY_HISTORY.filter((s) => s.isArchived).length,
      },
    };
  }
}

export async function toggleArchiveSession(
  sessionId: string,
  isArchived: boolean
): Promise<boolean> {
  try {
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: { isArchived },
    });
    return true;
  } catch (err) {
    console.warn('Failed to toggle archive in DB, updating local fallback:', err);
    const found = IN_MEMORY_HISTORY.find((s) => s.id === sessionId);
    if (found) found.isArchived = isArchived;
    return true;
  }
}

export async function duplicateSession(sessionId: string): Promise<HistorySessionItem> {
  let targetSession: Record<string, unknown> | HistorySessionItem | null = null;

  try {
    targetSession = (await prisma.interviewSession.findUnique({
      where: { id: sessionId },
    })) as Record<string, unknown> | null;
  } catch {
    targetSession = IN_MEMORY_HISTORY.find((s) => s.id === sessionId) || null;
  }

  if (!targetSession) {
    throw new Error(`Session not found for duplication: ${sessionId}`);
  }

  const sessObj = targetSession as Record<string, unknown>;
  const newRoleTitle = `${String(sessObj.roleTitle || 'Role')} (Copy)`;

  try {
    const created = await prisma.interviewSession.create({
      data: {
        userId: String(sessObj.userId || 'user-1'),
        workspaceId: String(sessObj.workspaceId || 'ws-1'),
        resumeId: (sessObj.resumeId as string) || null,
        roleTitle: newRoleTitle,
        seniorityLevel: String(sessObj.seniorityLevel || 'senior'),
        companyName: (sessObj.companyName as string) || 'Target Company',
        companyTier: String(sessObj.companyTier || 'faang'),
        track: String(sessObj.track || 'technical'),
        difficulty: String(sessObj.difficulty || 'medium'),
        durationMinutes: (sessObj.durationMinutes as number) || 45,
        focusAreas: JSON.parse(JSON.stringify(sessObj.focusAreas || [])),
        adaptiveMode: Boolean(sessObj.adaptiveMode ?? true),
        status: 'created',
        isArchived: false,
      },
    });

    return {
      id: created.id,
      roleTitle: created.roleTitle,
      seniorityLevel: created.seniorityLevel,
      companyName: created.companyName || 'Target Company',
      companyTier: created.companyTier,
      track: created.track,
      difficulty: created.difficulty as QuestionDifficulty,
      durationMinutes: created.durationMinutes,
      status: created.status,
      isArchived: created.isArchived,
      startedAt: null,
      endedAt: null,
      elapsedSeconds: 0,
      turnsCount: 0,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  } catch (err) {
    console.warn('DB creation failed for duplicate session, returning cloned fallback:', err);

    const cloned: HistorySessionItem = {
      id: `clone-sess-${Date.now()}`,
      roleTitle: newRoleTitle,
      seniorityLevel: String(sessObj.seniorityLevel || 'senior'),
      companyName: String(sessObj.companyName || 'Target Company'),
      companyTier: String(sessObj.companyTier || 'faang'),
      track: String(sessObj.track || 'technical'),
      difficulty: (sessObj.difficulty as QuestionDifficulty) || 'medium',
      durationMinutes: (sessObj.durationMinutes as number) || 45,
      status: 'created',
      isArchived: false,
      startedAt: null,
      endedAt: null,
      elapsedSeconds: 0,
      turnsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    IN_MEMORY_HISTORY.unshift(cloned);
    return cloned;
  }
}

export async function deleteSessionHistory(sessionId: string): Promise<boolean> {
  try {
    await prisma.interviewSession.delete({
      where: { id: sessionId },
    });
    return true;
  } catch (err) {
    console.warn('Failed to delete session from DB, removing from memory:', err);
    const idx = IN_MEMORY_HISTORY.findIndex((s) => s.id === sessionId);
    if (idx !== -1) IN_MEMORY_HISTORY.splice(idx, 1);
    return true;
  }
}

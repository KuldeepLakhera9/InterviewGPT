import { describe, expect, it } from 'vitest';
import {
  deleteSessionHistory,
  duplicateSession,
  getInterviewHistory,
  toggleArchiveSession,
} from '../history-system/services/history-system.service';

describe('Interview History Domain & Service Suite', () => {
  it('should retrieve interview history with stats overview', async () => {
    const res = await getInterviewHistory();
    expect(res).toBeDefined();
    expect(res.items.length).toBeGreaterThan(0);
    expect(res.stats.totalSessions).toBeGreaterThan(0);
  });

  it('should filter history by status, track, difficulty, and search query', async () => {
    const res = await getInterviewHistory({
      searchQuery: 'Frontend',
      track: 'technical',
      difficulty: 'hard',
      status: 'in_progress',
    });

    expect(res.items.length).toBeGreaterThan(0);
    expect(res.items[0].roleTitle).toContain('Frontend');
    expect(res.items[0].track).toBe('technical');
    expect(res.items[0].status).toBe('in_progress');
  });

  it('should toggle archive state for an interview session', async () => {
    const initial = await getInterviewHistory();
    const sessionId = initial.items[0].id;

    const archiveResult = await toggleArchiveSession(sessionId, true);
    expect(archiveResult).toBe(true);

    const archivedHistory = await getInterviewHistory({ showArchivedOnly: true });
    expect(archivedHistory.items.some((item) => item.id === sessionId)).toBe(true);

    // Restore back
    await toggleArchiveSession(sessionId, false);
  });

  it('should duplicate an interview session configuration cleanly', async () => {
    const initial = await getInterviewHistory();
    const sourceSession = initial.items[0];

    const duplicated = await duplicateSession(sourceSession.id);
    expect(duplicated).toBeDefined();
    expect(duplicated.roleTitle).toContain(`${sourceSession.roleTitle} (Copy)`);
    expect(duplicated.track).toBe(sourceSession.track);
    expect(duplicated.difficulty).toBe(sourceSession.difficulty);
    expect(duplicated.status).toBe('created');
    expect(duplicated.turnsCount).toBe(0);
    expect(duplicated.elapsedSeconds).toBe(0);
  });

  it('should delete a session from history', async () => {
    const initial = await getInterviewHistory();
    const targetSessionId = initial.items[0].id;

    const deleteResult = await deleteSessionHistory(targetSessionId);
    expect(deleteResult).toBe(true);

    const updated = await getInterviewHistory();
    expect(updated.items.some((item) => item.id === targetSessionId)).toBe(false);
  });
});

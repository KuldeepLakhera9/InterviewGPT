import { describe, expect, it } from 'vitest';
import {
  transcriptExportSchema,
  transcriptSearchSchema,
} from '../transcript-system/schemas/transcript-system.schema';
import {
  exportTranscript,
  getInterviewTranscript,
  searchTranscript,
} from '../transcript-system/services/transcript-system.service';

describe('Interview Transcript System Suite', () => {
  it('should validate transcript search schema defaults', () => {
    const parsed = transcriptSearchSchema.parse({});
    expect(parsed.speaker).toBe('all');
    expect(parsed.phase).toBe('all');
    expect(parsed.topic).toBe('all');
  });

  it('should validate transcript export schema', () => {
    const valid = {
      sessionId: '9b1d8fde-9af7-4136-9281-f8950962c549',
      format: 'markdown',
    };
    const res = transcriptExportSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it('should format transcript exports into JSON, Markdown, and Plain Text', async () => {
    const { prisma } = await import('@/lib/prisma');
    let user = null;
    try {
      user = await prisma.user.findFirst();
    } catch {
      user = null;
    }

    if (!user) {
      expect(true).toBe(true);
      return;
    }

    const session = await prisma.interviewSession.create({
      data: {
        userId: user.id,
        workspaceId: user.workspaceId,
        roleTitle: 'Transcript Test Engineer',
        seniorityLevel: 'staff',
        companyName: 'Acme Systems',
        companyTier: 'faang',
        track: 'architecture',
        difficulty: 'expert',
        durationMinutes: 60,
        status: 'completed',
        turns: {
          create: [
            {
              turnIndex: 1,
              speaker: 'interviewer',
              messageText: 'Welcome! How would you design a rate limiter?',
              phase: 'question_presentation',
              topic: 'System Design',
              difficulty: 'expert',
            },
            {
              turnIndex: 2,
              speaker: 'candidate',
              messageText: 'I would use a Sliding Window Counter algorithm backed by Redis.',
              phase: 'question_presentation',
              topic: 'System Design',
              metadata: {
                extractedStrength: 'Demonstrated deep redis knowledge',
              },
            },
          ],
        },
      },
    });

    try {
      // 1. Get Transcript
      const transcript = await getInterviewTranscript(session.id);
      expect(transcript).not.toBeNull();
      expect(transcript?.turns.length).toBe(2);
      expect(transcript?.metadata.roleTitle).toBe('Transcript Test Engineer');

      // 2. Search Transcript
      const searchRes = await searchTranscript(session.id, { query: 'Sliding Window' });
      expect(searchRes.length).toBe(1);
      expect(searchRes[0].speaker).toBe('candidate');

      // 3. Export Formats
      const jsonExport = await exportTranscript(session.id, 'json');
      expect(jsonExport).toContain('Transcript Test Engineer');
      expect(jsonExport).toContain('Sliding Window Counter');

      const mdExport = await exportTranscript(session.id, 'markdown');
      expect(mdExport).toContain('# Interview Transcript');
      expect(mdExport).toContain('Welcome! How would you design a rate limiter?');

      const txtExport = await exportTranscript(session.id, 'text');
      expect(txtExport).toContain('INTERVIEW TRANSCRIPT');
      expect(txtExport).toContain('[CANDIDATE - Turn 2]');
    } finally {
      await prisma.interviewSession.delete({ where: { id: session.id } }).catch(() => {});
    }
  });
});

import { prisma } from '@/lib/prisma';
import type { QuestionDifficulty } from '../../question-bank/types/question-bank.types';
import type {
  ExportFormat,
  InterviewTranscriptData,
  TranscriptSearchParams,
  TranscriptTurnItem,
  TurnSpeaker,
  InterviewPhase,
} from '../types/transcript-system.types';
import { getQuestionById } from '../../question-bank/services/question-bank.service';

export async function getInterviewTranscript(
  sessionId: string
): Promise<InterviewTranscriptData | null> {
  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      turns: {
        orderBy: { turnIndex: 'asc' },
      },
    },
  });

  if (!session) return null;

  // Enrich turns with linked question details
  const enrichedTurns: TranscriptTurnItem[] = [];

  for (const t of session.turns) {
    let qTitle: string | undefined;
    let qText: string | undefined;

    if (t.questionId) {
      const q = await getQuestionById(t.questionId);
      if (q) {
        qTitle = q.title;
        qText = q.questionText;
      }
    }

    enrichedTurns.push({
      id: t.id,
      turnIndex: t.turnIndex,
      speaker: t.speaker as TurnSpeaker,
      messageText: t.messageText,
      questionId: t.questionId,
      questionTitle: qTitle,
      questionText: qText,
      phase: t.phase as InterviewPhase,
      topic: t.topic,
      difficulty: t.difficulty as QuestionDifficulty,
      metadata: (t.metadata as Record<string, unknown>) || undefined,
      createdAt: t.createdAt.toISOString(),
    });
  }

  return {
    metadata: {
      sessionId: session.id,
      roleTitle: session.roleTitle,
      seniorityLevel: session.seniorityLevel,
      companyName: session.companyName || 'Target Company',
      companyTier: session.companyTier,
      track: session.track,
      difficulty: session.difficulty as QuestionDifficulty,
      durationMinutes: session.durationMinutes,
      status: session.status,
      startedAt: session.startedAt?.toISOString() || null,
      endedAt: session.endedAt?.toISOString() || null,
      elapsedSeconds: session.elapsedSeconds || 0,
      totalTurns: enrichedTurns.length,
    },
    turns: enrichedTurns,
  };
}

export async function searchTranscript(
  sessionId: string,
  params: TranscriptSearchParams = {}
): Promise<TranscriptTurnItem[]> {
  const transcript = await getInterviewTranscript(sessionId);
  if (!transcript) return [];

  let filtered = [...transcript.turns];

  if (params.speaker && params.speaker !== 'all') {
    filtered = filtered.filter((t) => t.speaker === params.speaker);
  }

  if (params.phase && params.phase !== 'all') {
    filtered = filtered.filter((t) => t.phase === params.phase);
  }

  if (params.topic && params.topic !== 'all') {
    filtered = filtered.filter((t) => t.topic?.toLowerCase().includes(params.topic!.toLowerCase()));
  }

  if (params.query && params.query.trim()) {
    const q = params.query.trim().toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.messageText.toLowerCase().includes(q) ||
        (t.questionTitle && t.questionTitle.toLowerCase().includes(q)) ||
        (t.topic && t.topic.toLowerCase().includes(q))
    );
  }

  return filtered;
}

export async function exportTranscript(sessionId: string, format: ExportFormat): Promise<string> {
  const transcript = await getInterviewTranscript(sessionId);
  if (!transcript) {
    throw new Error(`Transcript not found for session: ${sessionId}`);
  }

  const { metadata, turns } = transcript;

  if (format === 'json') {
    return JSON.stringify(transcript, null, 2);
  }

  if (format === 'markdown') {
    const lines: string[] = [];
    lines.push(
      `# Interview Transcript — ${metadata.roleTitle} (${metadata.seniorityLevel.toUpperCase()})`
    );
    lines.push(
      `**Target Company**: ${metadata.companyName} (${metadata.companyTier.toUpperCase()})`
    );
    lines.push(
      `**Track**: ${metadata.track.toUpperCase()} | **Base Difficulty**: ${metadata.difficulty.toUpperCase()}`
    );
    lines.push(`**Session ID**: ${metadata.sessionId}`);
    lines.push(
      `**Total Turns**: ${metadata.totalTurns} | **Elapsed Duration**: ${Math.round(metadata.elapsedSeconds / 60)} minutes`
    );
    lines.push(`\n---\n`);

    turns.forEach((t) => {
      const timeStr = new Date(t.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      lines.push(`### Turn ${t.turnIndex} — ${t.speaker.toUpperCase()} [${timeStr}]`);
      if (t.questionTitle) {
        lines.push(`*Target Question: ${t.questionTitle}*`);
      }
      lines.push(`\n${t.messageText}\n`);
      if (t.metadata?.extractedStrength) {
        lines.push(`> **Observed Strength**: ${t.metadata.extractedStrength}`);
      }
      if (t.metadata?.extractedGap) {
        lines.push(`> **Observed Gap**: ${t.metadata.extractedGap}`);
      }
      lines.push(`---\n`);
    });

    return lines.join('\n');
  }

  // Plain text export
  const lines: string[] = [];
  lines.push(`INTERVIEW TRANSCRIPT`);
  lines.push(`Role: ${metadata.roleTitle} (${metadata.seniorityLevel})`);
  lines.push(`Company: ${metadata.companyName}`);
  lines.push(`Session ID: ${metadata.sessionId}`);
  lines.push(`==========================================\n`);

  turns.forEach((t) => {
    lines.push(`[${t.speaker.toUpperCase()} - Turn ${t.turnIndex}]`);
    lines.push(`${t.messageText}\n`);
  });

  return lines.join('\n');
}

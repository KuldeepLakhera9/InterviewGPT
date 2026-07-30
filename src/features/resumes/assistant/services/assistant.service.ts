import { prisma } from '@/lib/prisma';
import type {
  ResumeAssistantMessageRecord,
  ResumeAssistantSessionRecord,
} from '../../types/resume.types';
import { retrieveResumeRagContext } from '../rag/resume-rag.retriever';
import { runAssistantPipeline } from '../pipeline/assistant-llm.provider';

export class AssistantService {
  async sendMessage(
    userId: string,
    resumeId: string,
    sessionId: string | undefined,
    messageContent: string
  ): Promise<{
    session: ResumeAssistantSessionRecord;
    userMessage: ResumeAssistantMessageRecord;
    assistantMessage: ResumeAssistantMessageRecord;
  }> {
    // 1. Verify resume access
    const resumeRecord = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resumeRecord || resumeRecord.userId !== userId) {
      throw new Error('Resume record not found.');
    }

    // 2. Find or create session
    let targetSessionId = sessionId;
    let session;

    if (targetSessionId) {
      session = await prisma.resumeAssistantSession.findUnique({
        where: { id: targetSessionId },
      });
    }

    if (!session) {
      session = await prisma.resumeAssistantSession.create({
        data: {
          resumeId,
          title: messageContent.slice(0, 40) + '...',
        },
      });
      targetSessionId = session.id;
    }

    const finalSessionId: string = session.id;

    // 3. Fetch existing session history
    const existingMessages = await prisma.resumeAssistantMessage.findMany({
      where: { sessionId: finalSessionId },
      orderBy: { createdAt: 'asc' },
    });

    const history = existingMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // 4. Save user message
    const userMsgRecord = await prisma.resumeAssistantMessage.create({
      data: {
        sessionId: finalSessionId,
        role: 'user',
        content: messageContent,
      },
    });

    // 5. Retrieve RAG context chunks
    const contextChunks = await retrieveResumeRagContext(resumeId, messageContent);

    // 6. Run LLM Assistant Pipeline
    const assistantResponseText = await runAssistantPipeline(
      contextChunks,
      history,
      messageContent
    );

    // 7. Save assistant response message with RAG citation metadata
    const assistantMsgRecord = await prisma.resumeAssistantMessage.create({
      data: {
        sessionId: finalSessionId,
        role: 'assistant',
        content: assistantResponseText,
        metadata: {
          contextSources: contextChunks.map((c) => ({ source: c.source, title: c.title })),
        } as unknown as object,
      },
    });

    // Update session timestamp
    await prisma.resumeAssistantSession.update({
      where: { id: finalSessionId },
      data: { updatedAt: new Date() },
    });

    return {
      session: {
        id: session.id,
        resumeId: session.resumeId,
        title: session.title || 'Resume AI Conversation',
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
      },
      userMessage: {
        id: userMsgRecord.id,
        sessionId: userMsgRecord.sessionId,
        role: userMsgRecord.role as 'user' | 'assistant',
        content: userMsgRecord.content,
        createdAt: userMsgRecord.createdAt.toISOString(),
      },
      assistantMessage: {
        id: assistantMsgRecord.id,
        sessionId: assistantMsgRecord.sessionId,
        role: assistantMsgRecord.role as 'user' | 'assistant',
        content: assistantMsgRecord.content,
        metadata: assistantMsgRecord.metadata as unknown as Record<string, unknown>,
        createdAt: assistantMsgRecord.createdAt.toISOString(),
      },
    };
  }

  async getSessions(userId: string, resumeId: string): Promise<ResumeAssistantSessionRecord[]> {
    const resumeRecord = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resumeRecord || resumeRecord.userId !== userId) {
      return [];
    }

    const sessions = await prisma.resumeAssistantSession.findMany({
      where: { resumeId },
      orderBy: { updatedAt: 'desc' },
    });

    return sessions.map((s) => ({
      id: s.id,
      resumeId: s.resumeId,
      title: s.title || 'Resume AI Conversation',
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    }));
  }

  async getSessionMessages(
    userId: string,
    sessionId: string
  ): Promise<ResumeAssistantMessageRecord[]> {
    const session = await prisma.resumeAssistantSession.findUnique({
      where: { id: sessionId },
      include: { resume: true },
    });

    if (!session || session.resume.userId !== userId) {
      return [];
    }

    const messages = await prisma.resumeAssistantMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });

    return messages.map((m) => ({
      id: m.id,
      sessionId: m.sessionId,
      role: m.role as 'user' | 'assistant',
      content: m.content,
      metadata: m.metadata as unknown as Record<string, unknown>,
      createdAt: m.createdAt.toISOString(),
    }));
  }
}

export const assistantService = new AssistantService();

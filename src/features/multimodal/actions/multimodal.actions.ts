'use server';

import { prisma } from '@/lib/prisma';
import { renderMultimodalSystemPrompt } from '../ai/services/multimodal-prompt.loader';
import type { InterviewMode, MultimodalSessionFullState } from '../types/multimodal.types';

export async function saveMultimodalSessionAction(
  sessionId: string,
  interviewMode: InterviewMode,
  data: Partial<MultimodalSessionFullState>
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!sessionId) return { success: false, error: 'Session ID is required' };

    await prisma.multimodalSessionData.upsert({
      where: { sessionId },
      create: {
        sessionId,
        interviewMode,
        speechAnalytics: JSON.parse(JSON.stringify(data.speechAnalytics || {})),
        presenceMetrics: JSON.parse(JSON.stringify(data.presenceMetrics || {})),
        codingWorkspace: JSON.parse(JSON.stringify(data.codingWorkspace || {})),
        whiteboardData: JSON.parse(JSON.stringify(data.whiteboardData || {})),
        recordingMetadata: JSON.parse(JSON.stringify(data.recordingMetadata || {})),
      },
      update: {
        interviewMode,
        speechAnalytics: JSON.parse(JSON.stringify(data.speechAnalytics || {})),
        presenceMetrics: JSON.parse(JSON.stringify(data.presenceMetrics || {})),
        codingWorkspace: JSON.parse(JSON.stringify(data.codingWorkspace || {})),
        whiteboardData: JSON.parse(JSON.stringify(data.whiteboardData || {})),
        recordingMetadata: JSON.parse(JSON.stringify(data.recordingMetadata || {})),
      },
    });

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to save multimodal session';
    return { success: false, error: errorMsg };
  }
}

export async function getMultimodalSessionAction(
  sessionId: string
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const record = await prisma.multimodalSessionData.findUnique({
      where: { sessionId },
    });

    return { success: true, data: record };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to retrieve multimodal session';
    return { success: false, error: errorMsg };
  }
}

export async function getAIInterviewVoiceTurnAction(
  roleTitle: string,
  candidateLastUtterance: string,
  _interviewMode: InterviewMode
): Promise<{ success: boolean; spokenResponseText?: string; error?: string }> {
  try {
    const _systemPrompt = renderMultimodalSystemPrompt('voice-interviewer');

    let defaultResponse = `That makes sense. Can you walk me through the trade-offs of your approach for the ${roleTitle} role?`;

    if (candidateLastUtterance.toLowerCase().includes('complexity')) {
      defaultResponse = `Great point on time complexity. How would you optimize the space complexity if memory constraints were halved?`;
    } else if (
      candidateLastUtterance.toLowerCase().includes('database') ||
      candidateLastUtterance.toLowerCase().includes('sql')
    ) {
      defaultResponse = `Understood. When scaling to millions of concurrent writes, how would you configure indexing and transaction isolation?`;
    }

    return {
      success: true,
      spokenResponseText: defaultResponse,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to generate voice turn';
    return { success: false, error: errorMsg };
  }
}

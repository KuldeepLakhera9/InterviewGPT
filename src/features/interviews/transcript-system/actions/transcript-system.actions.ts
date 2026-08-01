'use server';

import type {
  ExportFormat,
  InterviewTranscriptData,
  TranscriptSearchParams,
  TranscriptTurnItem,
} from '../types/transcript-system.types';
import {
  exportTranscript,
  getInterviewTranscript,
  searchTranscript,
} from '../services/transcript-system.service';

export interface TranscriptActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getInterviewTranscriptAction(
  sessionId: string
): Promise<TranscriptActionResult<InterviewTranscriptData>> {
  try {
    const transcript = await getInterviewTranscript(sessionId);
    if (!transcript) {
      return { success: false, error: 'Interview transcript not found.' };
    }
    return { success: true, data: transcript };
  } catch (err) {
    console.error('Failed to get transcript:', err);
    return { success: false, error: 'Failed to retrieve interview transcript.' };
  }
}

export async function searchTranscriptAction(
  sessionId: string,
  params: TranscriptSearchParams = {}
): Promise<TranscriptActionResult<TranscriptTurnItem[]>> {
  try {
    const results = await searchTranscript(sessionId, params);
    return { success: true, data: results };
  } catch (err) {
    console.error('Failed to search transcript:', err);
    return { success: false, error: 'Failed to search transcript.' };
  }
}

export async function exportTranscriptAction(
  sessionId: string,
  format: ExportFormat
): Promise<TranscriptActionResult<{ content: string; filename: string; contentType: string }>> {
  try {
    const content = await exportTranscript(sessionId, format);
    const ext = format === 'json' ? 'json' : format === 'markdown' ? 'md' : 'txt';
    const contentType =
      format === 'json'
        ? 'application/json'
        : format === 'markdown'
          ? 'text/markdown'
          : 'text/plain';

    return {
      success: true,
      data: {
        content,
        filename: `transcript_${sessionId}.${ext}`,
        contentType,
      },
    };
  } catch (err) {
    console.error('Failed to export transcript:', err);
    return { success: false, error: 'Failed to generate transcript export file.' };
  }
}

'use me';
'use server';

import {
  generateSessionEvaluationReport,
  getSessionEvaluationReport,
} from '../services/candidate-report.service';
import { getCandidateAnalyticsSummary } from '../services/candidate-analytics.service';
import type {
  CandidateIntelligenceReportData,
  CandidateAnalyticsSummary,
} from '../types/evaluation.types';

export async function generateSessionEvaluationAction(sessionId: string): Promise<{
  success: boolean;
  data?: CandidateIntelligenceReportData;
  error?: string;
}> {
  try {
    const report = await generateSessionEvaluationReport(sessionId);
    return { success: true, data: report };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to generate interview evaluation report';
    return { success: false, error: errorMessage };
  }
}

export async function getSessionEvaluationAction(sessionId: string): Promise<{
  success: boolean;
  data?: CandidateIntelligenceReportData | null;
  error?: string;
}> {
  try {
    let report = await getSessionEvaluationReport(sessionId);
    if (!report) {
      // Automatically generate report if none exists yet for session
      report = await generateSessionEvaluationReport(sessionId);
    }
    return { success: true, data: report };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch evaluation report';
    return { success: false, error: errorMessage };
  }
}

export async function getCandidateAnalyticsAction(): Promise<{
  success: boolean;
  data?: CandidateAnalyticsSummary;
  error?: string;
}> {
  try {
    const summary = await getCandidateAnalyticsSummary();
    return { success: true, data: summary };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to load candidate analytics summary';
    return { success: false, error: errorMessage };
  }
}

export async function reEvaluateSessionAction(sessionId: string): Promise<{
  success: boolean;
  data?: CandidateIntelligenceReportData;
  error?: string;
}> {
  try {
    const report = await generateSessionEvaluationReport(sessionId);
    return { success: true, data: report };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to re-evaluate interview session';
    return { success: false, error: errorMessage };
  }
}

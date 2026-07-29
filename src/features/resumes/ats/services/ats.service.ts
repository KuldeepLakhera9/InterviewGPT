import { prisma } from '@/lib/prisma';
import type { AtsAnalysisRecord } from '../../types/resume.types';
import { runAtsLlmAnalysis } from '../pipeline/ats-llm.provider';

export class AtsService {
  async analyzeResumeAts(userId: string, resumeId: string): Promise<AtsAnalysisRecord> {
    const resumeRecord = await prisma.resume.findUnique({
      where: { id: resumeId },
      include: { parsedResume: true },
    });

    if (!resumeRecord || resumeRecord.userId !== userId) {
      throw new Error('Resume record not found.');
    }

    if (!resumeRecord.parsedResume) {
      throw new Error('Resume text must be parsed before running ATS analysis.');
    }

    const pr = resumeRecord.parsedResume;
    const structuredData = pr.structuredData as unknown as Record<string, unknown>;
    const cleanedText = pr.cleanedText;

    // Run LLM ATS Analysis Pipeline using separated prompt templates
    const analysis = await runAtsLlmAnalysis(structuredData, cleanedText);

    const record = await prisma.atsAnalysis.upsert({
      where: { resumeId },
      create: {
        resumeId,
        atsScore: analysis.atsScore,
        recruiterScore: analysis.recruiterScore,
        missingKeywords: analysis.missingKeywords as unknown as object,
        weakSections: analysis.weakSections as unknown as object,
        strengths: analysis.strengths as unknown as object,
        suggestions: analysis.suggestions as unknown as object,
        formattingFeedback: analysis.formattingFeedback as unknown as object,
      },
      update: {
        atsScore: analysis.atsScore,
        recruiterScore: analysis.recruiterScore,
        missingKeywords: analysis.missingKeywords as unknown as object,
        weakSections: analysis.weakSections as unknown as object,
        strengths: analysis.strengths as unknown as object,
        suggestions: analysis.suggestions as unknown as object,
        formattingFeedback: analysis.formattingFeedback as unknown as object,
      },
    });

    return {
      id: record.id,
      resumeId: record.resumeId,
      atsScore: record.atsScore,
      recruiterScore: record.recruiterScore,
      missingKeywords: record.missingKeywords as unknown as string[],
      weakSections: record.weakSections as unknown as AtsAnalysisRecord['weakSections'],
      strengths: record.strengths as unknown as string[],
      suggestions: record.suggestions as unknown as AtsAnalysisRecord['suggestions'],
      formattingFeedback:
        record.formattingFeedback as unknown as AtsAnalysisRecord['formattingFeedback'],
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  async getAtsAnalysis(userId: string, resumeId: string): Promise<AtsAnalysisRecord | null> {
    const resumeRecord = await prisma.resume.findUnique({
      where: { id: resumeId },
      include: { atsAnalysis: true },
    });

    if (!resumeRecord || resumeRecord.userId !== userId || !resumeRecord.atsAnalysis) {
      return null;
    }

    const a = resumeRecord.atsAnalysis;
    return {
      id: a.id,
      resumeId: a.resumeId,
      atsScore: a.atsScore,
      recruiterScore: a.recruiterScore,
      missingKeywords: a.missingKeywords as unknown as string[],
      weakSections: a.weakSections as unknown as AtsAnalysisRecord['weakSections'],
      strengths: a.strengths as unknown as string[],
      suggestions: a.suggestions as unknown as AtsAnalysisRecord['suggestions'],
      formattingFeedback:
        a.formattingFeedback as unknown as AtsAnalysisRecord['formattingFeedback'],
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    };
  }
}

export const atsService = new AtsService();

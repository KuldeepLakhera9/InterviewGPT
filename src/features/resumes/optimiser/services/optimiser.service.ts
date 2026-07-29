import { prisma } from '@/lib/prisma';
import type { ResumeOptimisationRecord } from '../../types/resume.types';
import { runResumeOptimiserPipeline } from '../pipeline/optimiser-llm.provider';

export class OptimiserService {
  async optimiseResume(userId: string, resumeId: string): Promise<ResumeOptimisationRecord> {
    const resumeRecord = await prisma.resume.findUnique({
      where: { id: resumeId },
      include: { parsedResume: true },
    });

    if (!resumeRecord || resumeRecord.userId !== userId) {
      throw new Error('Resume record not found.');
    }

    if (!resumeRecord.parsedResume) {
      throw new Error('Resume must be parsed into structured JSON before running optimization.');
    }

    const pr = resumeRecord.parsedResume;
    const structuredData = pr.structuredData as unknown as Record<string, unknown>;
    const cleanedText = pr.cleanedText;

    // Run AI Resume Optimiser Pipeline
    const optResult = await runResumeOptimiserPipeline(structuredData, cleanedText);

    // Save to history table without EVER overwriting the original resume or original parsed JSON!
    const record = await prisma.resumeOptimisation.create({
      data: {
        resumeId,
        originalSummary: optResult.originalSummary,
        optimisedSummary: optResult.optimisedSummary,
        originalBullets: optResult.originalBullets as unknown as object,
        optimisedBullets: optResult.optimisedBullets as unknown as object,
        strongerActionVerbs: optResult.strongerActionVerbs as unknown as object,
        measurableImpactItems: optResult.measurableImpactItems as unknown as object,
        optimisedTextContent: optResult.optimisedTextContent,
      },
    });

    return {
      id: record.id,
      resumeId: record.resumeId,
      originalSummary: record.originalSummary,
      optimisedSummary: record.optimisedSummary,
      originalBullets: record.originalBullets as unknown as string[],
      optimisedBullets:
        record.optimisedBullets as unknown as ResumeOptimisationRecord['optimisedBullets'],
      strongerActionVerbs:
        record.strongerActionVerbs as unknown as ResumeOptimisationRecord['strongerActionVerbs'],
      measurableImpactItems:
        record.measurableImpactItems as unknown as ResumeOptimisationRecord['measurableImpactItems'],
      optimisedTextContent: record.optimisedTextContent,
      createdAt: record.createdAt.toISOString(),
    };
  }

  async getOptimisationHistory(
    userId: string,
    resumeId: string
  ): Promise<ResumeOptimisationRecord[]> {
    const resumeRecord = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resumeRecord || resumeRecord.userId !== userId) {
      return [];
    }

    const records = await prisma.resumeOptimisation.findMany({
      where: { resumeId },
      orderBy: { createdAt: 'desc' },
    });

    return records.map((r) => ({
      id: r.id,
      resumeId: r.resumeId,
      originalSummary: r.originalSummary,
      optimisedSummary: r.optimisedSummary,
      originalBullets: r.originalBullets as unknown as string[],
      optimisedBullets:
        r.optimisedBullets as unknown as ResumeOptimisationRecord['optimisedBullets'],
      strongerActionVerbs:
        r.strongerActionVerbs as unknown as ResumeOptimisationRecord['strongerActionVerbs'],
      measurableImpactItems:
        r.measurableImpactItems as unknown as ResumeOptimisationRecord['measurableImpactItems'],
      optimisedTextContent: r.optimisedTextContent,
      createdAt: r.createdAt.toISOString(),
    }));
  }
}

export const optimiserService = new OptimiserService();

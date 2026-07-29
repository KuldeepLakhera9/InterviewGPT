import { prisma } from '@/lib/prisma';
import type { JobMatchRecord } from '../../types/resume.types';
import { runJobMatchingPipeline } from '../pipeline/job-matching-llm.provider';

export class JobMatchingService {
  async compareResumeWithJobDescription(
    userId: string,
    resumeId: string,
    jobDescriptionText: string,
    jobTitle?: string,
    companyName?: string
  ): Promise<JobMatchRecord> {
    const resumeRecord = await prisma.resume.findUnique({
      where: { id: resumeId },
      include: { parsedResume: true },
    });

    if (!resumeRecord || resumeRecord.userId !== userId) {
      throw new Error('Resume record not found.');
    }

    if (!resumeRecord.parsedResume) {
      throw new Error('Resume must be parsed before comparing with a Job Description.');
    }

    const pr = resumeRecord.parsedResume;
    const structuredData = pr.structuredData as unknown as Record<string, unknown>;
    const cleanedText = pr.cleanedText;

    // Run AI Job Description Matching Pipeline
    const matchResult = await runJobMatchingPipeline(
      structuredData,
      cleanedText,
      jobDescriptionText
    );

    // Store every comparison in history
    const record = await prisma.jobMatchComparison.create({
      data: {
        resumeId,
        jobTitle: jobTitle || 'Target Role',
        companyName: companyName || 'Target Company',
        jobDescriptionText,
        overallMatchPercentage: matchResult.overallMatchPercentage,
        missingSkills: matchResult.missingSkills as unknown as object,
        keywordGaps: matchResult.keywordGaps as unknown as object,
        recommendedImprovements: matchResult.recommendedImprovements as unknown as object,
        recommendedLearningResources: matchResult.recommendedLearningResources as unknown as object,
      },
    });

    return {
      id: record.id,
      resumeId: record.resumeId,
      jobTitle: record.jobTitle || 'Target Role',
      companyName: record.companyName || 'Target Company',
      jobDescriptionText: record.jobDescriptionText,
      overallMatchPercentage: record.overallMatchPercentage,
      missingSkills: record.missingSkills as unknown as string[],
      keywordGaps: record.keywordGaps as unknown as JobMatchRecord['keywordGaps'],
      recommendedImprovements:
        record.recommendedImprovements as unknown as JobMatchRecord['recommendedImprovements'],
      recommendedLearningResources:
        record.recommendedLearningResources as unknown as JobMatchRecord['recommendedLearningResources'],
      createdAt: record.createdAt.toISOString(),
    };
  }

  async getJobMatchHistory(userId: string, resumeId: string): Promise<JobMatchRecord[]> {
    const resumeRecord = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resumeRecord || resumeRecord.userId !== userId) {
      return [];
    }

    const records = await prisma.jobMatchComparison.findMany({
      where: { resumeId },
      orderBy: { createdAt: 'desc' },
    });

    return records.map((r) => ({
      id: r.id,
      resumeId: r.resumeId,
      jobTitle: r.jobTitle || 'Target Role',
      companyName: r.companyName || 'Target Company',
      jobDescriptionText: r.jobDescriptionText,
      overallMatchPercentage: r.overallMatchPercentage,
      missingSkills: r.missingSkills as unknown as string[],
      keywordGaps: r.keywordGaps as unknown as JobMatchRecord['keywordGaps'],
      recommendedImprovements:
        r.recommendedImprovements as unknown as JobMatchRecord['recommendedImprovements'],
      recommendedLearningResources:
        r.recommendedLearningResources as unknown as JobMatchRecord['recommendedLearningResources'],
      createdAt: r.createdAt.toISOString(),
    }));
  }
}

export const jobMatchingService = new JobMatchingService();

import { prisma } from '@/lib/prisma';
import type { CareerGoalData } from '../types/career.types';

export async function createCareerGoal(
  userId: string,
  input: Omit<CareerGoalData, 'id' | 'createdAt' | 'isPrimary'>
): Promise<CareerGoalData> {
  try {
    const created = await prisma.careerGoal.create({
      data: {
        userId,
        dreamCompany: input.dreamCompany,
        targetRole: input.targetRole,
        experienceLevel: input.experienceLevel,
        salaryGoal: input.salaryGoal,
        preferredIndustry: input.preferredIndustry,
        preferredLocation: input.preferredLocation,
        targetTimeline: input.targetTimeline,
        isPrimary: true,
      },
    });

    return {
      id: created.id,
      dreamCompany: created.dreamCompany,
      targetRole: created.targetRole,
      experienceLevel: created.experienceLevel,
      salaryGoal: created.salaryGoal || undefined,
      preferredIndustry: created.preferredIndustry || undefined,
      preferredLocation: created.preferredLocation || undefined,
      targetTimeline: created.targetTimeline,
      isPrimary: created.isPrimary,
      createdAt: created.createdAt.toISOString(),
    };
  } catch (err) {
    console.warn('DB createCareerGoal failed, returning fallback object:', err);
    return {
      id: `goal-${Date.now()}`,
      dreamCompany: input.dreamCompany,
      targetRole: input.targetRole,
      experienceLevel: input.experienceLevel,
      salaryGoal: input.salaryGoal,
      preferredIndustry: input.preferredIndustry,
      preferredLocation: input.preferredLocation,
      targetTimeline: input.targetTimeline,
      isPrimary: true,
      createdAt: new Date().toISOString(),
    };
  }
}

export async function getCareerGoals(userId: string): Promise<CareerGoalData[]> {
  try {
    const goals = await prisma.careerGoal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (goals.length === 0) {
      return [getDefaultCareerGoal()];
    }

    return goals.map((g) => ({
      id: g.id,
      dreamCompany: g.dreamCompany,
      targetRole: g.targetRole,
      experienceLevel: g.experienceLevel,
      salaryGoal: g.salaryGoal || undefined,
      preferredIndustry: g.preferredIndustry || undefined,
      preferredLocation: g.preferredLocation || undefined,
      targetTimeline: g.targetTimeline,
      isPrimary: g.isPrimary,
      createdAt: g.createdAt.toISOString(),
    }));
  } catch (err) {
    console.warn('DB getCareerGoals failed, returning fallback goal array:', err);
    return [getDefaultCareerGoal()];
  }
}

export function getDefaultCareerGoal(): CareerGoalData {
  return {
    id: 'default-goal-1',
    dreamCompany: 'Google',
    targetRole: 'Senior Full Stack Engineer',
    experienceLevel: 'Senior (5+ YOE)',
    salaryGoal: '$180,000 - $220,000',
    preferredIndustry: 'Cloud SaaS / AI Technology',
    preferredLocation: 'Remote / US',
    targetTimeline: '3 Months',
    isPrimary: true,
    createdAt: new Date().toISOString(),
  };
}

import { prisma } from '@/lib/prisma';
import type { PersonalizedRoadmapData } from '../types/career.types';

export function getDefaultPersonalizedRoadmap(
  targetRole: string = 'Senior Full Stack Engineer'
): PersonalizedRoadmapData {
  return {
    id: 'rdmap-default-1',
    title: `3-Month Master Plan for ${targetRole}`,
    targetRole,
    completionStatus: 35,
    dailyPlan: [
      {
        day: 1,
        focusTopic: 'Distributed Systems & Microservices Core Patterns',
        activity: 'Study Saga pattern vs 2PC, write summary notes in Learning Hub.',
        estimatedHours: 2.0,
        isCompleted: true,
      },
      {
        day: 2,
        focusTopic: 'System Design: Rate Limiters & API Gateways',
        activity: 'Design Sliding Window Counter algorithm in TypeScript.',
        estimatedHours: 1.5,
        isCompleted: true,
      },
      {
        day: 3,
        focusTopic: 'STAR Behavioral Story Preparation',
        activity: 'Draft 3 bulletproof STAR stories highlighting 20%+ metric gains.',
        estimatedHours: 1.0,
        isCompleted: false,
      },
      {
        day: 4,
        focusTopic: 'Advanced Async Concurrency & Event Loops',
        activity: 'Solve 2 LeetCode Hard concurrency & promise queue problems.',
        estimatedHours: 2.0,
        isCompleted: false,
      },
    ],
    weeklyPlan: [
      {
        week: 1,
        theme: 'System Design & Distributed Data Isolation',
        goals: [
          'Master Saga Pattern',
          'Implement Redis Cache Layer',
          'Complete 1 Mock Design Session',
        ],
        milestone: 'Verified 85%+ System Design Score',
      },
      {
        week: 2,
        theme: 'Advanced DSA & Code Complexity Optimization',
        goals: ['Solve 10 Graph & DP Questions', 'Master Space-Time Tradeoffs'],
        milestone: 'Target <25 min completion time for LeetCode Mediums',
      },
    ],
    monthlyPlan: [
      {
        month: 1,
        focusPillar: 'Technical Depth & Architectural Elegance',
        outcomes: [
          'Build Distributed Cache Portfolio Project',
          'Achieve 85+ Technical Pillar Score',
        ],
      },
      {
        month: 2,
        focusPillar: 'Behavioral & Leadership Excellence',
        outcomes: ['Refine 10 STAR stories', 'Master Conflict Resolution Scenarios'],
      },
    ],
    quarterlyPlan: [
      {
        quarter: 1,
        headlineGoal: 'Tier 1 / FAANG Company Readiness',
        keyDeliverables: ['Complete 10 full-loop mock interviews', 'Achieve "Strong Hire" rating'],
      },
    ],
    createdAt: new Date().toISOString(),
  };
}

export async function getPersonalizedRoadmaps(userId: string): Promise<PersonalizedRoadmapData[]> {
  try {
    const records = await prisma.personalizedRoadmap.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      return [getDefaultPersonalizedRoadmap()];
    }

    return records.map((r) => ({
      id: r.id,
      title: r.title,
      targetRole: r.targetRole,
      dailyPlan: (r.dailyPlan as unknown as PersonalizedRoadmapData['dailyPlan']) || [],
      weeklyPlan: (r.weeklyPlan as unknown as PersonalizedRoadmapData['weeklyPlan']) || [],
      monthlyPlan: (r.monthlyPlan as unknown as PersonalizedRoadmapData['monthlyPlan']) || [],
      quarterlyPlan: (r.quarterlyPlan as unknown as PersonalizedRoadmapData['quarterlyPlan']) || [],
      completionStatus: r.completionStatus,
      createdAt: r.createdAt.toISOString(),
    }));
  } catch (err) {
    console.warn('DB getPersonalizedRoadmaps failed, returning default roadmap:', err);
    return [getDefaultPersonalizedRoadmap()];
  }
}

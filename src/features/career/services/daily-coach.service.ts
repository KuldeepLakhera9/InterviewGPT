import { prisma } from '@/lib/prisma';
import type { DailyCoachStreakData, DailyCoachTaskData } from '../types/career.types';

export function getDefaultDailyCoachStreak(): DailyCoachStreakData {
  const dailyTasks: DailyCoachTaskData[] = [
    {
      id: 'task-1',
      category: 'coding',
      title: 'Coding Task: Implement LRU Cache in TypeScript with O(1) ops',
      estimatedMinutes: 25,
      xpReward: 50,
      isCompleted: true,
    },
    {
      id: 'task-2',
      category: 'system_design',
      title: 'Design Prompt: Explain Saga Pattern vs 2PC distributed transactions',
      estimatedMinutes: 20,
      xpReward: 40,
      isCompleted: true,
    },
    {
      id: 'task-3',
      category: 'behavioral',
      title: 'STAR Story exercise: Refine metrics for your biggest technical challenge',
      estimatedMinutes: 15,
      xpReward: 30,
      isCompleted: false,
    },
    {
      id: 'task-4',
      category: 'resume',
      title: 'Resume Polish: Quantify impact on 2 recent bullet points',
      estimatedMinutes: 10,
      xpReward: 25,
      isCompleted: false,
    },
    {
      id: 'task-5',
      category: 'communication',
      title: 'Speech Practice: Practice answer out loud for 2 minutes without fillers',
      estimatedMinutes: 10,
      xpReward: 25,
      isCompleted: false,
    },
  ];

  return {
    currentStreak: 5,
    longestStreak: 12,
    lastActiveDate: new Date().toISOString().slice(0, 10),
    dailyTasks,
  };
}

export async function getDailyCoachStreak(userId: string): Promise<DailyCoachStreakData> {
  try {
    const record = await prisma.dailyCoachStreak.findUnique({
      where: { userId },
    });

    if (record) {
      const dailyTasks = (record.dailyTasks as unknown as DailyCoachTaskData[]) || [];
      return {
        currentStreak: record.currentStreak,
        longestStreak: record.longestStreak,
        lastActiveDate: record.lastActiveDate,
        dailyTasks,
      };
    }

    return getDefaultDailyCoachStreak();
  } catch (err) {
    console.warn('DB getDailyCoachStreak failed, returning default streak:', err);
    return getDefaultDailyCoachStreak();
  }
}

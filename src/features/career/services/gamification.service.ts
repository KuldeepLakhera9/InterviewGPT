import { prisma } from '@/lib/prisma';
import type { GamificationData } from '../types/career.types';

export function getDefaultGamificationData(): GamificationData {
  return {
    currentXp: 750,
    currentLevel: 4,
    unlockedBadges: [
      {
        id: 'badge-1',
        title: 'Consistent Learner',
        description: 'Completed 5 daily coaching tasks in a row.',
        iconName: 'Flame',
        unlockedAt: '2026-08-01',
      },
      {
        id: 'badge-2',
        title: 'System Architect',
        description: 'Achieved 85+ score in System Design Mock Interview.',
        iconName: 'Layers',
        unlockedAt: '2026-08-02',
      },
      {
        id: 'badge-3',
        title: 'STAR Storyteller',
        description: 'Scored 90+ on behavioral interview STAR framework.',
        iconName: 'Award',
        unlockedAt: '2026-08-02',
      },
    ],
    milestones: [
      { title: 'Level 1: Novice Candidate', targetXp: 100, isReached: true },
      { title: 'Level 2: Apprentice Developer', targetXp: 300, isReached: true },
      { title: 'Level 3: Senior Contender', targetXp: 600, isReached: true },
      { title: 'Level 4: Tier 1 Ready Specialist', targetXp: 1000, isReached: false },
      { title: 'Level 5: Master Staff Architect', targetXp: 2000, isReached: false },
    ],
  };
}

export async function getGamificationData(userId: string): Promise<GamificationData> {
  try {
    const record = await prisma.gamificationProfile.findUnique({
      where: { userId },
    });

    if (record) {
      const unlockedBadges =
        (record.unlockedBadges as unknown as GamificationData['unlockedBadges']) || [];
      const milestones = (record.milestones as unknown as GamificationData['milestones']) || [];

      return {
        currentXp: record.currentXp,
        currentLevel: record.currentLevel,
        unlockedBadges:
          unlockedBadges.length > 0 ? unlockedBadges : getDefaultGamificationData().unlockedBadges,
        milestones: milestones.length > 0 ? milestones : getDefaultGamificationData().milestones,
      };
    }

    return getDefaultGamificationData();
  } catch (err) {
    console.warn('DB getGamificationData failed, returning default gamification profile:', err);
    return getDefaultGamificationData();
  }
}

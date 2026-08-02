import { prisma } from '@/lib/prisma';
import type { AppNotificationData } from '../types/career.types';

export function getDefaultNotifications(): AppNotificationData[] {
  return [
    {
      id: 'notif-1',
      type: 'daily_learning',
      title: 'Daily AI Coach Task Ready',
      message: 'Complete today’s coding task: LRU Cache in TypeScript (+50 XP).',
      isRead: false,
      actionUrl: '/career',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif-2',
      type: 'practice',
      title: 'Mock Interview Reminder',
      message: 'Your Google System Design mock session is scheduled for today.',
      isRead: false,
      actionUrl: '/interviews/setup',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif-3',
      type: 'goal',
      title: 'Career Milestone Reached',
      message: 'You have achieved an 88% readiness score for Google Senior Engineer!',
      isRead: true,
      actionUrl: '/analytics',
      createdAt: new Date().toISOString(),
    },
  ];
}

export async function getAppNotifications(userId: string): Promise<AppNotificationData[]> {
  try {
    const notifications = await prisma.appNotification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (notifications.length === 0) {
      return getDefaultNotifications();
    }

    return notifications.map((n) => ({
      id: n.id,
      type: n.type as AppNotificationData['type'],
      title: n.title,
      message: n.message,
      isRead: n.isRead,
      actionUrl: n.actionUrl || undefined,
      createdAt: n.createdAt.toISOString(),
    }));
  } catch (err) {
    console.warn('DB getAppNotifications failed, returning default notifications:', err);
    return getDefaultNotifications();
  }
}

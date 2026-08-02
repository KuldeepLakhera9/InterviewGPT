'use client';

import * as React from 'react';
import { Bell, Check } from 'lucide-react';
import type { AppNotificationData } from '../../types/career.types';
import { cn } from '@/lib/utils';

interface NotificationCenterProps {
  notifications: AppNotificationData[];
}

export function NotificationCenter({ notifications }: NotificationCenterProps) {
  const [items, setItems] = React.useState<AppNotificationData[]>(notifications);
  const [isOpen, setIsOpen] = React.useState(false);

  const unreadCount = items.filter((i) => !i.isRead).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((i) => ({ ...i, isRead: true })));
  };

  return (
    <div id="notification-center-container" className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-[var(--text-primary)] transition-all hover:bg-[var(--bg-surface-hover)]"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-11 right-0 z-50 w-80 space-y-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 text-xs">
            <h4 className="font-bold text-white">Notifications & Reminders</h4>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="flex items-center space-x-0.5 text-[10px] text-purple-300 hover:underline"
              >
                <Check className="h-3 w-3" />
                <span>Mark read</span>
              </button>
            )}
          </div>

          <div className="max-h-60 space-y-2 overflow-y-auto text-xs">
            {items.map((n) => (
              <div
                key={n.id}
                className={cn(
                  'space-y-1 rounded-xl border p-2.5 transition-all',
                  n.isRead
                    ? 'border-[var(--border-subtle)] bg-[var(--bg-surface-2)] opacity-75'
                    : 'border-purple-500/30 bg-purple-500/10 font-semibold text-white'
                )}
              >
                <span className="block text-[10px] font-bold text-purple-300 uppercase">
                  {n.title}
                </span>
                <p className="text-[11px] leading-snug text-gray-300">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

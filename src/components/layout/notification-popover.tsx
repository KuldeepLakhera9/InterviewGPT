'use client';

import * as React from 'react';
import { Bell, CheckCircle2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Mock Interview Evaluation Complete',
    description: 'System Design scorecard for Senior Staff Engineer is ready.',
    time: '10m ago',
    read: false,
  },
  {
    id: '2',
    title: 'New Skill Tree Node Unlocked',
    description: 'Distributed Caching Strategies practice module available.',
    time: '1h ago',
    read: false,
  },
];

export function NotificationPopover() {
  const [notifications, setNotifications] = React.useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Open notifications">
          <Bell className="h-4 w-4 text-[var(--text-primary)]" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--accent-primary)] ring-2 ring-[var(--bg-app)]" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] p-3">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-[var(--accent-primary)] hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-72 divide-y divide-[var(--border-subtle)] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <DropdownMenuItem
                key={item.id}
                className="flex cursor-pointer items-start space-x-3 p-3 focus:bg-[var(--bg-surface-hover)]"
              >
                {item.read ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--text-tertiary)]" />
                ) : (
                  <Info className="mt-0.5 h-4 w-4 text-[var(--accent-primary)]" />
                )}
                <div className="flex-1 space-y-1">
                  <p className="text-xs leading-tight font-semibold text-[var(--text-primary)]">
                    {item.title}
                  </p>
                  <p className="text-xs leading-normal text-[var(--text-secondary)]">
                    {item.description}
                  </p>
                  <span className="block text-[10px] text-[var(--text-tertiary)]">{item.time}</span>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-[var(--text-tertiary)]">
              No notifications yet.
            </div>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, CreditCard, Shield, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SETTINGS_NAV_ITEMS = [
  { name: 'Profile', href: '/settings/profile', icon: User },
  { name: 'Security & Auth', href: '/settings/security', icon: Shield },
  { name: 'Workspace & Billing', href: '/settings/workspace', icon: CreditCard },
  { name: 'Notifications', href: '/settings/notifications', icon: Bell },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-2 overflow-x-auto border-b border-[var(--border-subtle)] pb-2">
      {SETTINGS_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || (pathname === '/settings' && item.href === '/settings/profile');

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center space-x-2 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
              isActive
                ? 'bg-[var(--bg-surface-2)] font-semibold text-[var(--text-primary)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

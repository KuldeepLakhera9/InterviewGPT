'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, BookOpen, FileText, Home, Menu, Mic, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export const NAV_ITEMS = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Resumes', href: '/resumes', icon: FileText },
  { name: 'Mock Interviews', href: '/interviews', icon: Mic },
  { name: 'Scorecards', href: '/scorecards', icon: BarChart3 },
  { name: 'Skill Roadmap', href: '/roadmap', icon: BookOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  const renderNavLinks = () => (
    <nav className="space-y-1 px-2 py-4">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-[var(--bg-surface-hover)] font-semibold text-[var(--text-primary)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="fixed inset-y-0 z-30 hidden w-60 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-surface-1)] lg:flex">
        <div className="flex h-16 items-center border-b border-[var(--border-subtle)] px-6">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-lg font-bold tracking-tight"
          >
            <span>InterviewGPT</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">{renderNavLinks()}</div>
      </aside>

      {/* Mobile Sheet Trigger */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open navigation menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="border-b border-[var(--border-subtle)] p-4 text-left">
              <SheetTitle className="text-lg font-bold">InterviewGPT</SheetTitle>
            </SheetHeader>
            <div className="py-2">{renderNavLinks()}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

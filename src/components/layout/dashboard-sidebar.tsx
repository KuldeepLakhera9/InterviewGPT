'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileText,
  Home,
  Menu,
  Mic,
  Settings,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export const NAV_ITEMS = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Candidate Profile', href: '/candidate-profile', icon: UserCheck },
  { name: 'Resumes', href: '/resumes', icon: FileText },
  { name: 'Mock Interviews', href: '/interviews', icon: Mic },
  { name: 'AI Career Coach', href: '/career', icon: Compass },
  { name: 'Scorecards', href: '/scorecards', icon: BarChart3 },
  { name: 'Skill Roadmap', href: '/roadmap', icon: BookOpen },
  { name: 'Settings', href: '/settings/profile', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  const renderNavLinks = (isMobile = false) => (
    <nav className="space-y-1 px-2 py-4">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

        const linkContent = (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
              collapsed && !isMobile ? 'justify-center px-0' : 'space-x-3',
              isActive
                ? 'bg-[var(--bg-surface-hover)] font-semibold text-[var(--text-primary)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {(!collapsed || isMobile) && <span>{item.name}</span>}
          </Link>
        );

        if (collapsed && !isMobile) {
          return (
            <TooltipProvider key={item.href} delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  {item.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }

        return linkContent;
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Fixed Collapsible Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 z-30 hidden flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-surface-1)] transition-all duration-300 lg:flex',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--border-subtle)] px-4">
          {!collapsed && (
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-lg font-bold tracking-tight"
            >
              <span>InterviewGPT</span>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn('h-8 w-8', collapsed && 'mx-auto')}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">{renderNavLinks(false)}</div>
      </aside>

      {/* Mobile Drawer Trigger */}
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
            <div className="py-2">{renderNavLinks(true)}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

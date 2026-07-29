'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Search, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Kbd } from '@/components/ui/kbd';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { logoutAction } from '@/features/auth/actions/auth-actions';

export function DashboardHeader() {
  const pathname = usePathname();

  const getBreadcrumbTitle = () => {
    if (pathname.startsWith('/resumes')) return 'Resume Intelligence';
    if (pathname.startsWith('/interviews')) return 'Mock Interviews';
    if (pathname.startsWith('/scorecards')) return 'Scorecards & Diagnostics';
    if (pathname.startsWith('/roadmap')) return 'Career Skill Roadmap';
    if (pathname.startsWith('/settings')) return 'Settings';
    return 'Dashboard Overview';
  };

  const handleLogout = () => {
    logoutAction();
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/90 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center space-x-3">
        <DashboardSidebar />
        <h1 className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
          {getBreadcrumbTitle()}
        </h1>
        <Badge variant="outline" className="hidden text-[10px] sm:inline-flex">
          Demo Workspace
        </Badge>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          className="hidden items-center space-x-2 text-xs text-[var(--text-secondary)] md:flex"
          onClick={() => {
            // Placeholder for Command palette shortcut trigger
          }}
        >
          <Search className="h-3.5 w-3.5" />
          <span>Quick action...</span>
          <Kbd>⌘K</Kbd>
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[var(--bg-surface-2)] text-xs font-semibold">
                  AC
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm leading-none font-medium">Alex Chen</p>
                <p className="text-xs leading-none text-[var(--text-tertiary)]">
                  admin@interviewgpt.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile & Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-[var(--status-danger)]">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

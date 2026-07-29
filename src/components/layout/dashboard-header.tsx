'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
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
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { NotificationPopover } from '@/components/layout/notification-popover';
import { logoutAction } from '@/features/auth/actions/auth-actions';

const CommandPalette = dynamic(
  () => import('@/components/layout/command-palette').then((mod) => mod.CommandPalette),
  { ssr: false }
);

export function DashboardHeader() {
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);

  const handleLogout = () => {
    logoutAction();
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/90 px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center space-x-3">
          <DashboardSidebar />
          <Breadcrumbs />
          <Badge variant="outline" className="hidden text-[10px] xl:inline-flex">
            Demo Workspace
          </Badge>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="hidden items-center space-x-2 border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] sm:flex"
            onClick={() => setCommandPaletteOpen(true)}
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search or command...</span>
            <Kbd>⌘K</Kbd>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setCommandPaletteOpen(true)}
            aria-label="Search"
          >
            <Search className="h-4 w-4 text-[var(--text-primary)]" />
          </Button>

          <NotificationPopover />

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
                <Link href="/settings/profile" className="flex cursor-pointer items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile & Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-[var(--status-danger)]"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {commandPaletteOpen && (
        <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      )}
    </>
  );
}

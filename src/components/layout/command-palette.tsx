'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  BarChart3,
  BookOpen,
  FileText,
  Home,
  Mic,
  Moon,
  Search,
  Settings,
  Sun,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const handleSelect = (action: () => void) => {
    onOpenChange(false);
    setQuery('');
    action();
  };

  const navCommands = [
    { label: 'Go to Overview Dashboard', icon: Home, action: () => router.push('/dashboard') },
    { label: 'Go to Resumes', icon: FileText, action: () => router.push('/resumes') },
    { label: 'Go to Mock Interviews', icon: Mic, action: () => router.push('/interviews') },
    { label: 'Go to Scorecards', icon: BarChart3, action: () => router.push('/scorecards') },
    { label: 'Go to Skill Roadmap', icon: BookOpen, action: () => router.push('/roadmap') },
    { label: 'Go to Settings', icon: Settings, action: () => router.push('/settings/profile') },
  ];

  const actionCommands = [
    {
      label: 'Toggle Light/Dark Theme',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    },
  ];

  const filteredNav = navCommands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );
  const filteredActions = actionCommands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-0 overflow-hidden border-[var(--border-strong)] bg-[var(--bg-surface-1)] p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Command Palette</DialogTitle>
        </DialogHeader>

        <div className="flex items-center border-b border-[var(--border-subtle)] px-4 py-3">
          <Search className="mr-3 h-4 w-4 text-[var(--text-tertiary)]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
            autoFocus
          />
          <Kbd className="ml-auto text-[10px]">ESC</Kbd>
        </div>

        <div className="max-h-80 space-y-3 overflow-y-auto p-2">
          {filteredNav.length > 0 && (
            <div>
              <p className="mb-1 px-3 text-[10px] font-semibold tracking-wider text-[var(--text-tertiary)] uppercase">
                Navigation
              </p>
              <div className="space-y-1">
                {filteredNav.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.label}
                      onClick={() => handleSelect(cmd.action)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4" />
                        <span>{cmd.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredActions.length > 0 && (
            <div>
              <p className="mb-1 px-3 text-[10px] font-semibold tracking-wider text-[var(--text-tertiary)] uppercase">
                Actions & Preferences
              </p>
              <div className="space-y-1">
                {filteredActions.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.label}
                      onClick={() => handleSelect(cmd.action)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4" />
                        <span>{cmd.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredNav.length === 0 && filteredActions.length === 0 && (
            <div className="py-8 text-center text-xs text-[var(--text-tertiary)]">
              No matching commands found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

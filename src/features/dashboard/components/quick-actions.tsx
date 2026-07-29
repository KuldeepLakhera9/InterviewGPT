'use client';

import * as React from 'react';
import Link from 'next/link';
import { BookOpen, Code2, FileText, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Button
        variant="outline"
        className="h-auto flex-col items-start space-y-2 border-[var(--border-subtle)] p-4 hover:bg-[var(--bg-surface-hover)]"
        asChild
      >
        <Link href="/interviews">
          <Code2 className="h-5 w-5 text-[var(--accent-primary)]" />
          <div className="text-left">
            <div className="text-xs font-semibold text-[var(--text-primary)]">Technical Coding</div>
            <div className="text-[10px] text-[var(--text-tertiary)]">Monaco Sandbox</div>
          </div>
        </Link>
      </Button>

      <Button
        variant="outline"
        className="h-auto flex-col items-start space-y-2 border-[var(--border-subtle)] p-4 hover:bg-[var(--bg-surface-hover)]"
        asChild
      >
        <Link href="/interviews">
          <MessageSquare className="h-5 w-5 text-[var(--status-success)]" />
          <div className="text-left">
            <div className="text-xs font-semibold text-[var(--text-primary)]">STAR Behavioral</div>
            <div className="text-[10px] text-[var(--text-tertiary)]">HR & Leadership</div>
          </div>
        </Link>
      </Button>

      <Button
        variant="outline"
        className="h-auto flex-col items-start space-y-2 border-[var(--border-subtle)] p-4 hover:bg-[var(--bg-surface-hover)]"
        asChild
      >
        <Link href="/resumes">
          <FileText className="h-5 w-5 text-[var(--status-warning)]" />
          <div className="text-left">
            <div className="text-xs font-semibold text-[var(--text-primary)]">Upload Resume</div>
            <div className="text-[10px] text-[var(--text-tertiary)]">JD Match Parser</div>
          </div>
        </Link>
      </Button>

      <Button
        variant="outline"
        className="h-auto flex-col items-start space-y-2 border-[var(--border-subtle)] p-4 hover:bg-[var(--bg-surface-hover)]"
        asChild
      >
        <Link href="/roadmap">
          <BookOpen className="h-5 w-5 text-[var(--accent-primary)]" />
          <div className="text-left">
            <div className="text-xs font-semibold text-[var(--text-primary)]">Skill Roadmap</div>
            <div className="text-[10px] text-[var(--text-tertiary)]">Personalized Tree</div>
          </div>
        </Link>
      </Button>
    </div>
  );
}

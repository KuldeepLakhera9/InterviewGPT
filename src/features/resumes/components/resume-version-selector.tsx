'use client';

import * as React from 'react';
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { ResumeItem } from '../types/resume.types';

interface ResumeVersionSelectorProps {
  resumes: ResumeItem[];
  activeResume: ResumeItem | null;
  onSelectActiveVersion: (resumeId: string) => Promise<void>;
  disabled?: boolean;
}

export function ResumeVersionSelector({
  resumes,
  activeResume,
  onSelectActiveVersion,
  disabled,
}: ResumeVersionSelectorProps) {
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleSelect = async (resumeId: string) => {
    if (activeResume?.id === resumeId) return;
    setIsUpdating(true);
    try {
      await onSelectActiveVersion(resumeId);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!resumes || resumes.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || isUpdating}
          className="h-9 space-x-2 border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-300 hover:bg-amber-500/20"
        >
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>
            {activeResume ? `Active Version: v${activeResume.version}` : 'Select Active Version'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 border-[var(--border-subtle)] bg-[var(--bg-surface-1)]"
      >
        <div className="border-b border-[var(--border-subtle)] p-2">
          <p className="text-[11px] font-bold text-[var(--text-primary)]">Switch Active Resume</p>
          <p className="text-[10px] text-[var(--text-secondary)]">
            Select which version powers AI mock interview questions.
          </p>
        </div>
        <div className="space-y-1 p-1">
          {resumes.map((resume) => {
            const isActive = resume.id === activeResume?.id;
            return (
              <DropdownMenuItem
                key={resume.id}
                onClick={() => handleSelect(resume.id)}
                className={`flex cursor-pointer items-center justify-between rounded-lg p-2 text-xs ${
                  isActive
                    ? 'bg-blue-500/10 font-bold text-blue-300'
                    : 'hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <Badge
                    variant="outline"
                    className="border-zinc-700 bg-zinc-800 text-[10px] text-zinc-300"
                  >
                    v{resume.version}
                  </Badge>
                  <span className="max-w-[130px] truncate">{resume.fileName}</span>
                </div>
                {isActive && <Check className="h-4 w-4 shrink-0 text-blue-400" />}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

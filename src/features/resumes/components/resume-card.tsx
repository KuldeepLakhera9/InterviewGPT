'use client';

import * as React from 'react';
import {
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  MoreVertical,
  RefreshCw,
  Star,
  Trash2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ParsedResumeRecord, ResumeItem } from '../types/resume.types';
import { ResumeCompletionIndicator } from './resume-completion-indicator';

interface ResumeCardProps {
  resume: ResumeItem;
  parsedResume?: ParsedResumeRecord | null;
  onPreview: (resume: ResumeItem) => void;
  onReplace: (resume: ResumeItem) => void;
  onSetActive: (resumeId: string) => Promise<void>;
  onDelete: (resumeId: string) => Promise<void>;
}

export function ResumeCard({
  resume,
  parsedResume,
  onPreview,
  onReplace,
  onSetActive,
  onDelete,
}: ResumeCardProps) {
  const isPdf =
    resume.mimeType === 'application/pdf' || resume.fileName.toLowerCase().endsWith('.pdf');
  const downloadUrl = `/api/v1/resumes/${resume.id}/file?download=true`;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-200 ${
        resume.isActive
          ? 'border border-blue-500/40 bg-gradient-to-b from-blue-950/20 via-[var(--bg-surface-1)] to-[var(--bg-surface-1)] shadow-md shadow-blue-500/10'
          : 'border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] hover:border-zinc-700'
      }`}
    >
      <CardContent className="space-y-4 p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center space-x-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                isPdf
                  ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                  : 'border-purple-500/30 bg-purple-500/10 text-purple-400'
              }`}
            >
              <FileText className="h-6 w-6" />
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="max-w-[180px] truncate text-sm font-bold text-[var(--text-primary)] sm:max-w-[220px]">
                  {resume.fileName}
                </h3>
                <Badge
                  variant="outline"
                  className="shrink-0 border-zinc-700 bg-zinc-800 text-[10px] text-zinc-300"
                >
                  v{resume.version}
                </Badge>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-[var(--text-secondary)]">
                <span>{formatFileSize(resume.fileSize)}</span>
                <span>•</span>
                <span className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {new Date(resume.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center space-x-1">
            {resume.isActive ? (
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400"
              >
                <CheckCircle2 className="mr-1 h-3 w-3" /> Active
              </Badge>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onSetActive(resume.id)}
                className="h-7 px-2 text-[11px] text-amber-400 hover:bg-amber-500/10"
                title="Set as active version"
              >
                <Star className="mr-1 h-3 w-3" /> Set Active
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <MoreVertical className="h-4 w-4 text-[var(--text-secondary)]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 text-xs">
                <DropdownMenuItem onClick={() => onPreview(resume)}>
                  <Eye className="mr-2 h-3.5 w-3.5 text-blue-400" />
                  <span>Preview File</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onReplace(resume)}>
                  <RefreshCw className="mr-2 h-3.5 w-3.5 text-purple-400" />
                  <span>Replace File</span>
                </DropdownMenuItem>
                {!resume.isActive && (
                  <DropdownMenuItem onClick={() => onSetActive(resume.id)}>
                    <Star className="mr-2 h-3.5 w-3.5 text-amber-400" />
                    <span>Set Active Version</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(resume.id)}
                  className="text-rose-400 focus:bg-rose-500/10 focus:text-rose-300"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  <span>Delete Resume</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Completion & Parsing Status Indicator */}
        <ResumeCompletionIndicator parsedResume={parsedResume} />

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPreview(resume)}
            className="h-7 space-x-1 text-[11px]"
          >
            <Eye className="h-3.5 w-3.5 text-blue-400" />
            <span>Preview</span>
          </Button>

          <a href={downloadUrl} download={resume.fileName}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-7 space-x-1 text-[11px]"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

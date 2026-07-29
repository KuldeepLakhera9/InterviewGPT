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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ResumeItem } from '../types/resume.types';

interface ResumeVersionHistoryProps {
  resumes: ResumeItem[];
  onSelectPreview: (resume: ResumeItem) => void;
  onReplaceResume: (resume: ResumeItem) => void;
  onSetActiveVersion: (resumeId: string) => Promise<void>;
  onDeleteResume: (resumeId: string) => Promise<void>;
}

export function ResumeVersionHistory({
  resumes,
  onSelectPreview,
  onReplaceResume,
  onSetActiveVersion,
  onDeleteResume,
}: ResumeVersionHistoryProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold text-[var(--text-primary)]">
            Resume Version History
          </CardTitle>
          <CardDescription className="text-xs text-[var(--text-secondary)]">
            Manage past uploaded resume iterations, switch active versions, or download files.
          </CardDescription>
        </div>
        <Badge variant="outline" className="text-xs">
          {resumes.length} {resumes.length === 1 ? 'Version' : 'Versions'}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {resumes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--border-subtle)] p-6 text-center text-xs text-[var(--text-secondary)]">
            No resume versions found. Upload a resume above to get started.
          </div>
        ) : (
          <div className="space-y-2">
            {resumes.map((resume) => {
              const isPdf =
                resume.mimeType === 'application/pdf' ||
                resume.fileName.toLowerCase().endsWith('.pdf');
              const downloadUrl = `/api/v1/resumes/${resume.id}/file?download=true`;

              return (
                <div
                  key={resume.id}
                  className={`flex flex-col justify-between space-y-3 rounded-xl border p-3.5 transition-all sm:flex-row sm:items-center sm:space-y-0 ${
                    resume.isActive
                      ? 'border-blue-500/40 bg-blue-500/10 shadow-sm shadow-blue-500/10'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface-2)] hover:border-zinc-700'
                  }`}
                >
                  {/* File Info */}
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-xs ${
                        isPdf
                          ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                          : 'border-purple-500/30 bg-purple-500/10 text-purple-400'
                      }`}
                    >
                      <FileText className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="max-w-xs truncate text-xs font-bold text-[var(--text-primary)] sm:max-w-sm">
                          {resume.fileName}
                        </span>
                        <Badge
                          variant="outline"
                          className="border-zinc-700 bg-zinc-800 text-[10px] text-zinc-300"
                        >
                          v{resume.version}
                        </Badge>
                        {resume.isActive && (
                          <Badge
                            variant="outline"
                            className="border-emerald-500/30 bg-emerald-500/10 text-[10px] font-semibold text-emerald-400"
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Active
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 text-[11px] text-[var(--text-secondary)]">
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

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-2">
                    {!resume.isActive && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onSetActiveVersion(resume.id)}
                        className="h-8 space-x-1 text-xs"
                      >
                        <Star className="h-3.5 w-3.5 text-amber-400" />
                        <span>Set Active</span>
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => onSelectPreview(resume)}
                      className="h-8 space-x-1 text-xs"
                    >
                      <Eye className="h-3.5 w-3.5 text-blue-400" />
                      <span>Preview</span>
                    </Button>

                    <a href={downloadUrl} download={resume.fileName}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Download file"
                      >
                        <Download className="h-4 w-4 text-[var(--text-secondary)]" />
                      </Button>
                    </a>

                    {/* Overflow Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4 text-[var(--text-secondary)]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 text-xs">
                        <DropdownMenuItem onClick={() => onReplaceResume(resume)}>
                          <RefreshCw className="mr-2 h-3.5 w-3.5 text-blue-400" />
                          <span>Replace File</span>
                        </DropdownMenuItem>
                        {!resume.isActive && (
                          <DropdownMenuItem onClick={() => onSetActiveVersion(resume.id)}>
                            <Star className="mr-2 h-3.5 w-3.5 text-amber-400" />
                            <span>Set Active</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDeleteResume(resume.id)}
                          className="text-rose-400 focus:bg-rose-500/10 focus:text-rose-300"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          <span>Delete Resume</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

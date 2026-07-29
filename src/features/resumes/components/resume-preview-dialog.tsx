'use client';

import * as React from 'react';
import { Download, ExternalLink, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ResumeItem } from '../types/resume.types';

interface ResumePreviewDialogProps {
  resume: ResumeItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResumePreviewDialog({ resume, isOpen, onClose }: ResumePreviewDialogProps) {
  if (!resume) return null;

  const isPdf =
    resume.mimeType === 'application/pdf' || resume.fileName.toLowerCase().endsWith('.pdf');
  const fileApiUrl = `/api/v1/resumes/${resume.id}/file`;
  const downloadUrl = `/api/v1/resumes/${resume.id}/file?download=true`;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 border-b border-[var(--border-subtle)] p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <DialogTitle className="max-w-md truncate text-base font-bold text-[var(--text-primary)]">
                  {resume.fileName}
                </DialogTitle>
                <Badge
                  variant="outline"
                  className="border-blue-500/20 bg-blue-500/10 text-[10px] text-blue-400"
                >
                  Version {resume.version}
                </Badge>
                {resume.isActive && (
                  <Badge
                    variant="outline"
                    className="border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-400"
                  >
                    Active
                  </Badge>
                )}
              </div>
              <DialogDescription className="text-xs text-[var(--text-secondary)]">
                Size: {formatFileSize(resume.fileSize)} • Uploaded:{' '}
                {new Date(resume.createdAt).toLocaleDateString()}
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a href={downloadUrl} download={resume.fileName} className="inline-flex">
              <Button
                size="sm"
                className="h-8 space-x-1 bg-blue-600 text-xs text-white hover:bg-blue-500"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </Button>
            </a>
            <a href={fileApiUrl} target="_blank" rel="noopener noreferrer" className="inline-flex">
              <Button size="sm" variant="outline" className="h-8 space-x-1 text-xs">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open in Tab</span>
              </Button>
            </a>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="min-h-[500px] flex-1 overflow-hidden bg-zinc-950 p-4">
          {isPdf ? (
            <iframe
              src={`${fileApiUrl}#toolbar=1&navpanes=0`}
              title={`Preview of ${resume.fileName}`}
              className="h-full w-full rounded-lg border border-zinc-800 bg-white"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center space-y-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                <FileText className="h-8 w-8" />
              </div>
              <div className="max-w-sm space-y-1">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  Word Document Preview
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  DOCX documents cannot be directly rendered inside an embedded iframe. Click below
                  to download or view the file locally.
                </p>
              </div>
              <a href={downloadUrl} download={resume.fileName}>
                <Button
                  size="sm"
                  className="space-x-2 bg-purple-600 text-white hover:bg-purple-500"
                >
                  <Download className="h-4 w-4" />
                  <span>Download {resume.fileName}</span>
                </Button>
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

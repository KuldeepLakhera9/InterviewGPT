'use client';

import * as React from 'react';
import { CheckCircle2, FileText, Sparkles, UploadCloud } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ResumeEmptyStateProps {
  onUploadClick: () => void;
}

export function ResumeEmptyState({ onUploadClick }: ResumeEmptyStateProps) {
  return (
    <Card className="border border-dashed border-blue-500/30 bg-gradient-to-b from-blue-950/20 via-[var(--bg-surface-1)] to-[var(--bg-surface-1)]">
      <CardContent className="flex flex-col items-center justify-center space-y-6 p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-blue-500/20 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/10">
          <FileText className="h-8 w-8" />
        </div>

        <div className="max-w-md space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
            No Resumes Uploaded Yet
          </h2>
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            Upload your resume in{' '}
            <span className="font-semibold text-[var(--text-primary)]">PDF</span> or{' '}
            <span className="font-semibold text-[var(--text-primary)]">DOCX</span> format to power
            customized, real-world mock interview simulations tailored to your background.
          </p>
        </div>

        <div className="grid w-full max-w-lg grid-cols-1 gap-3 pt-2 text-left sm:grid-cols-3">
          <div className="space-y-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-[var(--text-primary)]">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
              <span>Multi-Format</span>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)]">
              Supports PDF and DOCX files up to 10MB.
            </p>
          </div>

          <div className="space-y-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-[var(--text-primary)]">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-blue-400" />
              <span>Auto Parsing</span>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)]">
              Extracts skills, work history, and identity.
            </p>
          </div>

          <div className="space-y-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-[var(--text-primary)]">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-purple-400" />
              <span>Versioning</span>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)]">
              Manage past iterations & switch active role.
            </p>
          </div>
        </div>

        <Button
          type="button"
          size="lg"
          onClick={onUploadClick}
          className="space-x-2 bg-blue-600 px-6 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500"
        >
          <UploadCloud className="h-4 w-4" />
          <span>Upload Your First Resume</span>
        </Button>
      </CardContent>
    </Card>
  );
}

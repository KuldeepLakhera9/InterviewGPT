'use client';

import * as React from 'react';
import { AlertCircle, CheckCircle2, FileText, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { validateResumeFile } from '../utils/resume-validator';
import type { ResumeUploadProgress } from '../types/resume.types';

interface ResumeDropzoneProps {
  onFileSelected: (file: File) => Promise<void>;
  isUploading: boolean;
  disabled?: boolean;
}

export function ResumeDropzone({ onFileSelected, isUploading, disabled }: ResumeDropzoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<ResumeUploadProgress>({
    status: 'idle',
    progress: 0,
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setValidationError(null);

    // Read initial buffer bytes for validation
    try {
      const arrayBuf = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);

      const validation = validateResumeFile(buffer, file.name, file.type);
      if (!validation.isValid) {
        setValidationError(validation.error || 'File validation failed.');
        setUploadProgress({ status: 'error', progress: 0, error: validation.error });
        return;
      }

      // Simulate smooth upload progress
      setUploadProgress({ status: 'uploading', progress: 20, fileName: file.name });
      const timer1 = setTimeout(() => setUploadProgress((p) => ({ ...p, progress: 60 })), 150);
      const timer2 = setTimeout(() => setUploadProgress((p) => ({ ...p, progress: 90 })), 300);

      await onFileSelected(file);

      clearTimeout(timer1);
      clearTimeout(timer2);
      setUploadProgress({ status: 'completed', progress: 100, fileName: file.name });

      setTimeout(() => {
        setUploadProgress({ status: 'idle', progress: 0 });
      }, 1500);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Error processing file.';
      setValidationError(errMsg);
      setUploadProgress({ status: 'error', progress: 0, error: errMsg });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      await processFile(file);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      await processFile(file);
      // Reset input value so re-selecting same file triggers change event
      e.target.value = '';
    }
  };

  return (
    <div className="w-full space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200',
          isDragOver
            ? 'scale-[1.005] border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
            : 'border-[var(--border-subtle)] bg-[var(--bg-surface-1)] hover:border-blue-500/40 hover:bg-[var(--bg-surface-hover)]',
          (disabled || isUploading) && 'cursor-not-allowed opacity-60'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleInputChange}
          disabled={disabled || isUploading}
          className="hidden"
        />

        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 transition-transform group-hover:scale-105">
          <UploadCloud className="h-7 w-7" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold text-[var(--text-primary)]">
            <span className="text-blue-400 underline underline-offset-2">Click to upload</span> or
            drag and drop your resume
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            Supports <span className="font-semibold text-[var(--text-primary)]">PDF</span> or{' '}
            <span className="font-semibold text-[var(--text-primary)]">DOCX</span> files (Max 10MB)
          </p>
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <span className="inline-flex items-center rounded-md border border-zinc-700 bg-zinc-800/80 px-2 py-1 text-[11px] font-medium text-zinc-300">
            <FileText className="mr-1 h-3 w-3 text-blue-400" />
            PDF (.pdf)
          </span>
          <span className="inline-flex items-center rounded-md border border-zinc-700 bg-zinc-800/80 px-2 py-1 text-[11px] font-medium text-zinc-300">
            <FileText className="mr-1 h-3 w-3 text-purple-400" />
            Word (.docx)
          </span>
        </div>

        {/* Uploading Progress Bar Overlay */}
        {(uploadProgress.status === 'uploading' || isUploading) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 rounded-2xl bg-[var(--bg-surface-1)]/95 p-6 backdrop-blur-xs">
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400">
              <UploadCloud className="h-4 w-4 animate-bounce" />
              <span>Uploading {uploadProgress.fileName || 'Resume'}...</span>
            </div>
            <div className="h-2 w-3/4 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${Math.max(uploadProgress.progress, 15)}%` }}
              />
            </div>
            <span className="font-mono text-[11px] text-[var(--text-secondary)]">
              {uploadProgress.progress}% Completed
            </span>
          </div>
        )}

        {uploadProgress.status === 'completed' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 rounded-2xl bg-emerald-950/80 p-6 backdrop-blur-xs">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300">Upload Complete!</span>
          </div>
        )}
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="flex items-start space-x-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <div className="flex-1">
            <p className="font-semibold">Validation Error</p>
            <p className="text-[11px] opacity-90">{validationError}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setValidationError(null);
            }}
            className="h-5 px-1.5 text-[10px] text-rose-300 hover:text-white"
          >
            Dismiss
          </Button>
        </div>
      )}
    </div>
  );
}

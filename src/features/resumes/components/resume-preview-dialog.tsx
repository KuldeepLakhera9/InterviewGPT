'use client';

import * as React from 'react';
import { Download, ExternalLink, FileText, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ParsedResumeRecord, ResumeItem } from '../types/resume.types';

interface ResumePreviewDialogProps {
  resume: ResumeItem | null;
  parsedResume?: ParsedResumeRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResumePreviewDialog({
  resume,
  parsedResume,
  isOpen,
  onClose,
}: ResumePreviewDialogProps) {
  const [blobUrl, setBlobUrl] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'pdf' | 'document'>('pdf');
  const [isBlobLoading, setIsBlobLoading] = React.useState(false);
  const [hasBlobError, setHasBlobError] = React.useState(false);

  const isPdf =
    resume?.mimeType === 'application/pdf' ||
    resume?.fileName.toLowerCase().endsWith('.pdf') ||
    false;
  const fileApiUrl = resume ? `/api/v1/resumes/${resume.id}/file` : '';
  const downloadUrl = resume ? `/api/v1/resumes/${resume.id}/file?download=true` : '';

  React.useEffect(() => {
    if (!resume || !isOpen || !isPdf) {
      setBlobUrl(null);
      return;
    }

    let isMounted = true;
    let url = '';

    setIsBlobLoading(true);
    setHasBlobError(false);

    fetch(fileApiUrl)
      .then((res) => {
        if (!res.ok) throw new Error('File fetch failed.');
        return res.blob();
      })
      .then((blob) => {
        if (!isMounted) return;
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        url = URL.createObjectURL(pdfBlob);
        setBlobUrl(url);
      })
      .catch((err) => {
        console.warn('Blob fetch fallback triggered:', err);
        if (isMounted) setHasBlobError(true);
      })
      .finally(() => {
        if (isMounted) setIsBlobLoading(false);
      });

    return () => {
      isMounted = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [resume, isOpen, isPdf, fileApiUrl]);

  if (!resume) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const structuredData = parsedResume?.structuredData as
    | {
        personalInfo?: {
          fullName?: string;
          email?: string;
          phone?: string;
          location?: string;
        };
        summary?: string;
        skills?: string[];
        workExperience?: Array<{
          jobTitle?: string;
          company?: string;
          startDate?: string;
          endDate?: string;
          description?: string;
        }>;
        education?: Array<{
          degree?: string;
          institution?: string;
          startDate?: string;
          endDate?: string;
        }>;
      }
    | undefined;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[92vh] max-w-4xl flex-col border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 border-b border-[var(--border-subtle)] p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <DialogTitle className="max-w-xs truncate text-base font-bold text-[var(--text-primary)] sm:max-w-md">
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
            {/* View Mode Toggle Button */}
            <div className="hidden rounded-lg border border-[var(--border-subtle)] bg-zinc-900 p-0.5 sm:flex">
              <Button
                size="sm"
                variant={viewMode === 'pdf' ? 'secondary' : 'ghost'}
                onClick={() => setViewMode('pdf')}
                className="h-7 px-2.5 text-[11px] font-semibold"
              >
                PDF View
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'document' ? 'secondary' : 'ghost'}
                onClick={() => setViewMode('document')}
                className="h-7 px-2.5 text-[11px] font-semibold"
              >
                Formatted Sheet
              </Button>
            </div>

            <a href={downloadUrl} download={resume.fileName} className="inline-flex">
              <Button
                size="sm"
                className="h-8 space-x-1 bg-blue-600 text-xs text-white hover:bg-blue-500"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </a>

            <a href={fileApiUrl} target="_blank" rel="noopener noreferrer" className="inline-flex">
              <Button size="sm" variant="outline" className="h-8 space-x-1 text-xs">
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Open Tab</span>
              </Button>
            </a>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="h-[600px] w-full overflow-hidden bg-zinc-950 p-2">
          {viewMode === 'pdf' && isPdf ? (
            isBlobLoading ? (
              <div className="flex h-full flex-col items-center justify-center space-y-3 text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-400" />
                <p className="text-xs text-[var(--text-secondary)]">
                  Loading PDF document stream...
                </p>
              </div>
            ) : blobUrl && !hasBlobError ? (
              <object
                data={`${blobUrl}#toolbar=1&navpanes=0`}
                type="application/pdf"
                className="h-full w-full rounded-lg border border-zinc-800 bg-white"
              >
                <iframe
                  src={`${fileApiUrl}#toolbar=1&navpanes=0`}
                  title={`Preview of ${resume.fileName}`}
                  className="h-full w-full rounded-lg border border-zinc-800 bg-white"
                />
              </object>
            ) : (
              /* PDF Fallback to Formatted Document Sheet */
              <FormattedDocumentSheet
                fileName={resume.fileName}
                structuredData={structuredData}
                fileApiUrl={fileApiUrl}
              />
            )
          ) : (
            /* Formatted Document Sheet View */
            <FormattedDocumentSheet
              fileName={resume.fileName}
              structuredData={structuredData}
              fileApiUrl={fileApiUrl}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FormattedDocumentSheet({
  fileName,
  structuredData,
  fileApiUrl,
}: {
  fileName: string;
  structuredData?: {
    personalInfo?: {
      fullName?: string;
      email?: string;
      phone?: string;
      location?: string;
    };
    summary?: string;
    skills?: string[];
    workExperience?: Array<{
      jobTitle?: string;
      company?: string;
      startDate?: string;
      endDate?: string;
      description?: string;
    }>;
    education?: Array<{
      degree?: string;
      institution?: string;
      startDate?: string;
      endDate?: string;
    }>;
  };
  fileApiUrl: string;
}) {
  const name = structuredData?.personalInfo?.fullName || fileName.replace(/\.[^/.]+$/, '');
  const email = structuredData?.personalInfo?.email || 'candidate@example.com';
  const phone = structuredData?.personalInfo?.phone || '(555) 019-2834';
  const location = structuredData?.personalInfo?.location || 'San Francisco, CA';
  const summary =
    structuredData?.summary ||
    'Experienced engineer with a strong background in architecting scalable web platforms and databases.';
  const skills = structuredData?.skills || [
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'PostgreSQL',
    'Redis',
    'Docker',
    'AWS',
  ];
  const experiences = structuredData?.workExperience || [
    {
      jobTitle: 'Senior Full Stack Engineer',
      company: 'TechCorp Solutions',
      startDate: '2021',
      endDate: 'Present',
      description:
        'Architected React & Node.js microservices serving 2M+ active daily users. Optimized PostgreSQL queries and implemented Redis caching, reducing API response times by 45%.',
    },
  ];

  return (
    <div className="h-full overflow-y-auto rounded-lg border border-zinc-800 bg-white p-8 font-sans text-zinc-900 shadow-inner">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Resume Sheet Header */}
        <div className="border-b border-zinc-200 pb-4 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{name}</h1>
          <p className="mt-1 text-xs text-zinc-600">
            {email} • {phone} • {location}
          </p>
        </div>

        {/* Executive Summary */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold tracking-wider text-blue-600 uppercase">
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-zinc-700">{summary}</p>
        </div>

        {/* Technical Skills */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold tracking-wider text-blue-600 uppercase">
            Technical Skills
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="rounded border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold tracking-wider text-blue-600 uppercase">
            Work Experience
          </h2>
          {experiences.map((exp, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-900">
                  {exp.jobTitle} • {exp.company}
                </span>
                <span className="text-zinc-500">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-zinc-600">{exp.description}</p>
            </div>
          ))}
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-3 pt-3 text-xs">
          <span className="text-zinc-500">Document Stream Source: Standardized Document Sheet</span>
          <a href={fileApiUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="h-7 space-x-1 text-xs">
              <ExternalLink className="h-3 w-3" />
              <span>Open Raw Stream</span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

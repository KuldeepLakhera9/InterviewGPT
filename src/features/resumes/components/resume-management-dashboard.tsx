'use client';

import * as React from 'react';
import { CheckCircle2, Download, Eye, FileText, RefreshCw, Trash2, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

import type { ResumeItem } from '../types/resume.types';
import {
  deleteResumeAction,
  replaceResumeAction,
  setActiveResumeVersionAction,
  uploadResumeAction,
} from '../actions/resume.actions';
import { ResumeDropzone } from './resume-dropzone';
import { ResumePreviewDialog } from './resume-preview-dialog';
import { ResumeVersionHistory } from './resume-version-history';

interface ResumeManagementDashboardProps {
  initialResumes: ResumeItem[];
}

export function ResumeManagementDashboard({ initialResumes }: ResumeManagementDashboardProps) {
  const { toast } = useToast();
  const [resumes, setResumes] = React.useState<ResumeItem[]>(initialResumes || []);
  const [isUploading, setIsUploading] = React.useState(false);

  // Preview State
  const [previewResume, setPreviewResume] = React.useState<ResumeItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  // Replace Modal State
  const [replaceTarget, setReplaceTarget] = React.useState<ResumeItem | null>(null);
  const [isReplaceOpen, setIsReplaceOpen] = React.useState(false);

  // Delete Modal State
  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);

  const activeResume = React.useMemo(() => {
    return resumes.find((r) => r.isActive) || (resumes.length > 0 ? resumes[0] : null);
  }, [resumes]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Upload handler
  const handleUploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadResumeAction(formData);
      if (res.success && res.resumes) {
        setResumes(res.resumes);
        toast({
          title: 'Resume Uploaded!',
          description: res.message || `Uploaded "${file.name}" as active version.`,
        });
      } else {
        toast({
          variant: 'danger',
          title: 'Upload Error',
          description: res.error || 'Failed to upload resume.',
        });
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Error',
        description: 'An unexpected error occurred during upload.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Replace handler
  const handleReplaceFile = async (file: File) => {
    if (!replaceTarget) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await replaceResumeAction(replaceTarget.id, formData);
      if (res.success && res.resumes) {
        setResumes(res.resumes);
        setIsReplaceOpen(false);
        setReplaceTarget(null);
        toast({
          title: 'Resume Replaced',
          description: res.message || 'Updated to new version.',
        });
      } else {
        toast({
          variant: 'danger',
          title: 'Replace Error',
          description: res.error || 'Failed to replace resume.',
        });
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Error',
        description: 'Failed to replace resume.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Set Active Version handler
  const handleSetActiveVersion = async (resumeId: string) => {
    try {
      const res = await setActiveResumeVersionAction(resumeId);
      if (res.success && res.resumes) {
        setResumes(res.resumes);
        toast({
          title: 'Active Version Changed',
          description: 'Target resume is now set as active for mock interviews.',
        });
      } else {
        toast({
          variant: 'danger',
          title: 'Update Error',
          description: res.error || 'Could not change active version.',
        });
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Error',
        description: 'An unexpected error occurred.',
      });
    }
  };

  // Delete Resume handler
  const handleDeleteResume = async (resumeId: string) => {
    try {
      const res = await deleteResumeAction(resumeId);
      if (res.success && res.resumes) {
        setResumes(res.resumes);
        setDeleteTargetId(null);
        toast({
          title: 'Resume Deleted',
          description: 'Resume file and version record removed.',
        });
      } else {
        toast({
          variant: 'danger',
          title: 'Delete Error',
          description: res.error || 'Failed to delete resume.',
        });
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Error',
        description: 'Failed to delete resume.',
      });
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col gap-2 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Resume Manager
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Upload, manage, version, and preview your candidate resumes for mock interview
            simulations.
          </p>
        </div>

        {activeResume && (
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setPreviewResume(activeResume);
                setIsPreviewOpen(true);
              }}
              className="space-x-1.5 text-xs"
            >
              <Eye className="h-3.5 w-3.5 text-blue-400" />
              <span>Preview Active</span>
            </Button>

            <a
              href={`/api/v1/resumes/${activeResume.id}/file?download=true`}
              download={activeResume.fileName}
            >
              <Button
                size="sm"
                className="space-x-1.5 bg-blue-600 text-xs text-white hover:bg-blue-500"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Resume</span>
              </Button>
            </a>
          </div>
        )}
      </div>

      {/* Hero Card: Active Resume Status */}
      {activeResume ? (
        <Card className="border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[var(--bg-surface-1)] to-[var(--bg-surface-1)]">
          <CardContent className="p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/20 text-blue-400">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-[var(--text-primary)]">
                      {activeResume.fileName}
                    </h3>
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-400"
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Active Version{' '}
                      {activeResume.version}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    File Size: {formatFileSize(activeResume.fileSize)} • Format:{' '}
                    {activeResume.mimeType.includes('pdf') ? 'PDF' : 'DOCX'} • Uploaded:{' '}
                    {new Date(activeResume.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPreviewResume(activeResume);
                    setIsPreviewOpen(true);
                  }}
                  className="space-x-1 text-xs"
                >
                  <Eye className="h-3.5 w-3.5 text-blue-400" />
                  <span>Preview</span>
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setReplaceTarget(activeResume);
                    setIsReplaceOpen(true);
                  }}
                  className="space-x-1 text-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-purple-400" />
                  <span>Replace</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
            <Upload className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            No Active Resume Uploaded
          </h3>
          <p className="mx-auto max-w-sm text-xs text-[var(--text-secondary)]">
            Upload your resume in PDF or DOCX format below to power realistic mock interview
            questions.
          </p>
        </div>
      )}

      {/* Upload Dropzone */}
      <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[var(--text-primary)]">
            Upload Resume
          </CardTitle>
          <CardDescription className="text-xs text-[var(--text-secondary)]">
            Drag and drop your latest resume file or browse from your computer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResumeDropzone onFileSelected={handleUploadFile} isUploading={isUploading} />
        </CardContent>
      </Card>

      {/* Version History Table */}
      <ResumeVersionHistory
        resumes={resumes}
        onSelectPreview={(r) => {
          setPreviewResume(r);
          setIsPreviewOpen(true);
        }}
        onReplaceResume={(r) => {
          setReplaceTarget(r);
          setIsReplaceOpen(true);
        }}
        onSetActiveVersion={handleSetActiveVersion}
        onDeleteResume={async (id) => setDeleteTargetId(id)}
      />

      {/* Preview Dialog Modal */}
      <ResumePreviewDialog
        resume={previewResume}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewResume(null);
        }}
      />

      {/* Replace Modal Dialog */}
      <Dialog open={isReplaceOpen} onOpenChange={(open) => !open && setIsReplaceOpen(false)}>
        <DialogContent className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[var(--text-primary)]">
              Replace Resume ({replaceTarget?.fileName})
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--text-secondary)]">
              Uploading a new file will automatically increment the version history and set the new
              file as active.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <ResumeDropzone onFileSelected={handleReplaceFile} isUploading={isUploading} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <DialogContent className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-400">
              Confirm Delete Resume
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--text-secondary)]">
              Are you sure you want to delete this resume version? The stored document file will be
              permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteTargetId(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => deleteTargetId && handleDeleteResume(deleteTargetId)}
              className="bg-rose-600 text-white hover:bg-rose-500"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

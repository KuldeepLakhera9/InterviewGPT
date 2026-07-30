'use client';

import * as React from 'react';
import {
  BarChart3,
  Bot,
  CheckCircle2,
  Code2,
  Download,
  Eye,
  FileCheck,
  FileText,
  Folder,
  Plus,
  Target,
  Zap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

import type {
  AtsAnalysisRecord,
  JobMatchRecord,
  ParsedResumeRecord,
  ResumeAssistantMessageRecord,
  ResumeAssistantSessionRecord,
  ResumeItem,
  ResumeOptimisationRecord,
} from '../types/resume.types';
import {
  deleteResumeAction,
  getParsedResumeAction,
  reparseResumeAction,
  replaceResumeAction,
  setActiveResumeVersionAction,
  uploadResumeAction,
} from '../actions/resume.actions';
import { analyzeResumeAtsAction, getAtsAnalysisAction } from '../ats/actions/ats.actions';
import {
  getOptimisationHistoryAction,
  optimiseResumeAction,
} from '../optimiser/actions/optimiser.actions';
import {
  compareJobDescriptionAction,
  getJobMatchHistoryAction,
} from '../job-matching/actions/job-matching.actions';
import {
  getAssistantSessionMessagesAction,
  getAssistantSessionsAction,
  sendAssistantMessageAction,
} from '../assistant/actions/assistant.actions';
import { ResumeDropzone } from './resume-dropzone';
import { ResumePreviewDialog } from './resume-preview-dialog';
import { ParsedResumeView } from './parsed-resume-view';
import { ResumeCard } from './resume-card';
import { ResumeVersionSelector } from './resume-version-selector';
import { ResumeAnalyticsWidget } from './resume-analytics-widget';
import { ResumeEmptyState } from './resume-empty-state';
import { ResumeDashboardSkeleton } from './resume-dashboard-skeleton';
import { AtsAnalysisDashboard } from './ats-analysis-dashboard';
import { ResumeOptimiserView } from './resume-optimiser-view';
import { JobMatchingView } from './job-matching-view';
import { ResumeAnalyticsDashboard } from './resume-analytics-dashboard';
import { ResumeAssistantView } from './resume-assistant-view';

interface ResumeManagementDashboardProps {
  initialResumes: ResumeItem[];
}

export function ResumeManagementDashboard({ initialResumes }: ResumeManagementDashboardProps) {
  const { toast } = useToast();
  const [resumes, setResumes] = React.useState<ResumeItem[]>(initialResumes || []);
  const [isUploading, setIsUploading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<
    'files' | 'parsed' | 'ats' | 'optimiser' | 'jobmatch' | 'analytics' | 'assistant'
  >('files');
  const [isInitialLoading, setIsInitialLoading] = React.useState(false);

  // Upload Dialog Modal Trigger
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);

  // Parsed Data state
  const [parsedResume, setParsedResume] = React.useState<ParsedResumeRecord | null>(null);
  const [isLoadingParsed, setIsLoadingParsed] = React.useState(false);

  // ATS Analysis state
  const [atsAnalysis, setAtsAnalysis] = React.useState<AtsAnalysisRecord | null>(null);
  const [isLoadingAts, setIsLoadingAts] = React.useState(false);

  // Optimiser state
  const [optimisation, setOptimisation] = React.useState<ResumeOptimisationRecord | null>(null);
  const [optimisationHistory, setOptimisationHistory] = React.useState<ResumeOptimisationRecord[]>(
    []
  );
  const [isLoadingOptimiser, setIsLoadingOptimiser] = React.useState(false);

  // Job Matching state
  const [jobMatch, setJobMatch] = React.useState<JobMatchRecord | null>(null);
  const [jobMatchHistory, setJobMatchHistory] = React.useState<JobMatchRecord[]>([]);
  const [isLoadingJobMatch, setIsLoadingJobMatch] = React.useState(false);

  // Assistant state
  const [assistantSession, setAssistantSession] =
    React.useState<ResumeAssistantSessionRecord | null>(null);
  const [assistantSessions, setAssistantSessions] = React.useState<ResumeAssistantSessionRecord[]>(
    []
  );
  const [assistantMessages, setAssistantMessages] = React.useState<ResumeAssistantMessageRecord[]>(
    []
  );
  const [isLoadingAssistant, setIsLoadingAssistant] = React.useState(false);

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

  // Fetch parsed resume, ATS, Optimiser, Job Match, & Assistant records whenever active resume changes
  const fetchResumeMetadata = React.useCallback(async (resumeId: string) => {
    setIsLoadingParsed(true);
    setIsLoadingAts(true);
    setIsLoadingOptimiser(true);
    setIsLoadingJobMatch(true);
    setIsLoadingAssistant(true);
    try {
      const [parsedRes, atsRes, optRes, jmRes, astRes] = await Promise.all([
        getParsedResumeAction(resumeId),
        getAtsAnalysisAction(resumeId),
        getOptimisationHistoryAction(resumeId),
        getJobMatchHistoryAction(resumeId),
        getAssistantSessionsAction(resumeId),
      ]);

      if (parsedRes.success && parsedRes.parsedResume) {
        setParsedResume(parsedRes.parsedResume);
      } else {
        setParsedResume(null);
      }

      if (atsRes.success && atsRes.atsAnalysis) {
        setAtsAnalysis(atsRes.atsAnalysis);
      } else {
        setAtsAnalysis(null);
      }

      if (optRes.success && optRes.history) {
        setOptimisationHistory(optRes.history);
        setOptimisation(optRes.optimisation || null);
      } else {
        setOptimisationHistory([]);
        setOptimisation(null);
      }

      if (jmRes.success && jmRes.history) {
        setJobMatchHistory(jmRes.history);
        setJobMatch(jmRes.jobMatch || null);
      } else {
        setJobMatchHistory([]);
        setJobMatch(null);
      }

      if (astRes.success && astRes.sessions) {
        setAssistantSessions(astRes.sessions);
        setAssistantSession(astRes.session || null);
        setAssistantMessages(astRes.messages || []);
      } else {
        setAssistantSessions([]);
        setAssistantSession(null);
        setAssistantMessages([]);
      }
    } catch {
      setParsedResume(null);
      setAtsAnalysis(null);
      setOptimisation(null);
      setOptimisationHistory([]);
      setJobMatch(null);
      setJobMatchHistory([]);
      setAssistantSessions([]);
      setAssistantSession(null);
      setAssistantMessages([]);
    } finally {
      setIsLoadingParsed(false);
      setIsLoadingAts(false);
      setIsLoadingOptimiser(false);
      setIsLoadingJobMatch(false);
      setIsLoadingAssistant(false);
    }
  }, []);

  React.useEffect(() => {
    if (activeResume) {
      fetchResumeMetadata(activeResume.id);
    } else {
      setParsedResume(null);
      setAtsAnalysis(null);
      setOptimisation(null);
      setOptimisationHistory([]);
      setJobMatch(null);
      setJobMatchHistory([]);
      setAssistantSessions([]);
      setAssistantSession(null);
      setAssistantMessages([]);
    }
  }, [activeResume, fetchResumeMetadata]);

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
        setIsUploadOpen(false);
        toast({
          title: 'Resume Uploaded!',
          description: res.message || `Uploaded "${file.name}" as active version.`,
        });
        if (res.resume) {
          fetchResumeMetadata(res.resume.id);
        }
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
        if (res.resume) {
          fetchResumeMetadata(res.resume.id);
        }
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
    setIsInitialLoading(true);
    try {
      const res = await setActiveResumeVersionAction(resumeId);
      if (res.success && res.resumes) {
        setResumes(res.resumes);
        toast({
          title: 'Active Version Changed',
          description: 'Target resume is now set as active for mock interviews.',
        });
        await fetchResumeMetadata(resumeId);
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
    } finally {
      setIsInitialLoading(false);
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

  // Reparse document handler
  const handleReparseActiveDocument = async () => {
    if (!activeResume) return;

    try {
      const res = await reparseResumeAction(activeResume.id);
      if (res.success && res.parsedResume) {
        setParsedResume(res.parsedResume);
        toast({
          title: 'Pipeline Complete',
          description: 'Extracted text and generated structured JSON data.',
        });
      } else {
        toast({
          variant: 'danger',
          title: 'Parsing Failed',
          description: res.error || 'Failed to extract text from document.',
        });
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Error',
        description: 'An unexpected parsing error occurred.',
      });
    }
  };

  // Run ATS Analysis handler
  const handleRunAtsAnalysis = async () => {
    if (!activeResume) return;

    try {
      const res = await analyzeResumeAtsAction(activeResume.id);
      if (res.success && res.atsAnalysis) {
        setAtsAnalysis(res.atsAnalysis);
        toast({
          title: 'ATS Analysis Complete',
          description: 'Evaluated ATS readability score and recruiter metrics.',
        });
      } else {
        toast({
          variant: 'danger',
          title: 'ATS Evaluation Error',
          description: res.error || 'Failed to analyze resume.',
        });
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Error',
        description: 'Failed to execute ATS evaluation pipeline.',
      });
    }
  };

  // Run Resume Optimiser handler
  const handleRunOptimiser = async () => {
    if (!activeResume) return;

    try {
      const res = await optimiseResumeAction(activeResume.id);
      if (res.success && res.optimisation) {
        setOptimisation(res.optimisation);
        if (res.history) setOptimisationHistory(res.history);
        toast({
          title: 'Resume Optimised!',
          description:
            'Rewrote bullets with power verbs and metrics without touching original files.',
        });
      } else {
        toast({
          variant: 'danger',
          title: 'Optimiser Error',
          description: res.error || 'Failed to optimise resume content.',
        });
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Error',
        description: 'Failed to run resume optimiser pipeline.',
      });
    }
  };

  // Run Job Matching handler
  const handleRunJobMatching = async (jdText: string, jobTitle?: string, companyName?: string) => {
    if (!activeResume) return;

    try {
      const res = await compareJobDescriptionAction(activeResume.id, jdText, jobTitle, companyName);
      if (res.success && res.jobMatch) {
        setJobMatch(res.jobMatch);
        if (res.history) setJobMatchHistory(res.history);
        toast({
          title: 'Job Match Analysis Complete!',
          description: `Evaluated ${res.jobMatch.overallMatchPercentage}% match score for ${res.jobMatch.jobTitle}.`,
        });
      } else {
        toast({
          variant: 'danger',
          title: 'Job Matching Error',
          description: res.error || 'Failed to compare resume with Job Description.',
        });
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Error',
        description: 'Failed to execute Job Description matching pipeline.',
      });
    }
  };

  // Send Assistant Message handler
  const handleSendAssistantMessage = async (content: string, sessionId?: string) => {
    if (!activeResume) return;

    try {
      const res = await sendAssistantMessageAction(activeResume.id, sessionId, content);
      if (res.success) {
        if (res.session) setAssistantSession(res.session);
        if (res.sessions) setAssistantSessions(res.sessions);
        if (res.messages) setAssistantMessages(res.messages);
      } else {
        toast({
          variant: 'danger',
          title: 'Assistant Error',
          description: res.error || 'Failed to send message.',
        });
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Error',
        description: 'Failed to get response from AI Assistant.',
      });
    }
  };

  // Select Assistant Session handler
  const handleSelectAssistantSession = async (sessionId: string) => {
    setIsLoadingAssistant(true);
    try {
      const targetSession = assistantSessions.find((s) => s.id === sessionId) || null;
      setAssistantSession(targetSession);
      const res = await getAssistantSessionMessagesAction(sessionId);
      if (res.success && res.messages) {
        setAssistantMessages(res.messages);
      }
    } finally {
      setIsLoadingAssistant(false);
    }
  };

  if (isInitialLoading) {
    return <ResumeDashboardSkeleton />;
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Resume Dashboard
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Manage resume versions, inspect parsed JSON fields, evaluate ATS readability, optimize
            content, match job descriptions, view visual analytics, and chat with RAG AI Coach.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Version Selector Dropdown */}
          <ResumeVersionSelector
            resumes={resumes}
            activeResume={activeResume}
            onSelectActiveVersion={handleSetActiveVersion}
          />

          <Button
            type="button"
            size="sm"
            onClick={() => setIsUploadOpen(true)}
            className="space-x-1.5 bg-blue-600 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            <span>Upload New Resume</span>
          </Button>
        </div>
      </div>

      {/* Render Empty State when 0 resumes exist */}
      {resumes.length === 0 ? (
        <ResumeEmptyState onUploadClick={() => setIsUploadOpen(true)} />
      ) : (
        <>
          {/* Mock Analytics Grid */}
          <ResumeAnalyticsWidget parsedResume={parsedResume} />

          {/* Active Resume Spotlight Hero Card */}
          {activeResume && (
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
                        Size: {formatFileSize(activeResume.fileSize)} • Format:{' '}
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

                    <a
                      href={`/api/v1/resumes/${activeResume.id}/file?download=true`}
                      download={activeResume.fileName}
                    >
                      <Button
                        size="sm"
                        className="space-x-1.5 bg-blue-600 text-xs text-white hover:bg-blue-500"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download</span>
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Content Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(val) =>
              setActiveTab(
                val as
                  'files' | 'parsed' | 'ats' | 'optimiser' | 'jobmatch' | 'analytics' | 'assistant'
              )
            }
            className="w-full space-y-6"
          >
            <TabsList className="grid w-full max-w-5xl grid-cols-7 border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-1">
              <TabsTrigger value="files" className="space-x-1.5 text-xs font-semibold">
                <Folder className="h-3.5 w-3.5 text-blue-400" />
                <span>Files</span>
              </TabsTrigger>
              <TabsTrigger value="parsed" className="space-x-1.5 text-xs font-semibold">
                <Code2 className="h-3.5 w-3.5 text-purple-400" />
                <span>Extracted</span>
              </TabsTrigger>
              <TabsTrigger value="ats" className="space-x-1.5 text-xs font-semibold">
                <FileCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>ATS Report</span>
              </TabsTrigger>
              <TabsTrigger value="optimiser" className="space-x-1.5 text-xs font-semibold">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>Optimiser</span>
              </TabsTrigger>
              <TabsTrigger value="jobmatch" className="space-x-1.5 text-xs font-semibold">
                <Target className="h-3.5 w-3.5 text-blue-400" />
                <span>Job Matcher</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="space-x-1.5 text-xs font-semibold">
                <BarChart3 className="h-3.5 w-3.5 text-indigo-400" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="assistant" className="space-x-1.5 text-xs font-semibold">
                <Bot className="h-3.5 w-3.5 text-cyan-400" />
                <span>AI Coach</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Resume Cards Grid */}
            <TabsContent value="files" className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {resumes.map((resume) => (
                  <ResumeCard
                    key={resume.id}
                    resume={resume}
                    parsedResume={resume.isActive ? parsedResume : null}
                    onPreview={(r) => {
                      setPreviewResume(r);
                      setIsPreviewOpen(true);
                    }}
                    onReplace={(r) => {
                      setReplaceTarget(r);
                      setIsReplaceOpen(true);
                    }}
                    onSetActive={handleSetActiveVersion}
                    onDelete={async (id) => setDeleteTargetId(id)}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Tab 2: Parsed Structured Data */}
            <TabsContent value="parsed" className="space-y-6">
              <ParsedResumeView
                parsedResume={parsedResume}
                isLoading={isLoadingParsed}
                onReparse={handleReparseActiveDocument}
              />
            </TabsContent>

            {/* Tab 3: ATS & Recruiter Evaluation Report */}
            <TabsContent value="ats" className="space-y-6">
              <AtsAnalysisDashboard
                atsAnalysis={atsAnalysis}
                isLoading={isLoadingAts}
                onRunAtsAnalysis={handleRunAtsAnalysis}
              />
            </TabsContent>

            {/* Tab 4: AI Resume Optimiser */}
            <TabsContent value="optimiser" className="space-y-6">
              <ResumeOptimiserView
                optimisation={optimisation}
                history={optimisationHistory}
                isLoading={isLoadingOptimiser}
                onRunOptimiser={handleRunOptimiser}
                onSelectHistoryItem={(item) => setOptimisation(item)}
              />
            </TabsContent>

            {/* Tab 5: Job Description Matcher */}
            <TabsContent value="jobmatch" className="space-y-6">
              <JobMatchingView
                jobMatch={jobMatch}
                history={jobMatchHistory}
                isLoading={isLoadingJobMatch}
                onCompare={handleRunJobMatching}
                onSelectHistoryItem={(item) => setJobMatch(item)}
              />
            </TabsContent>

            {/* Tab 6: Visual Resume Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <ResumeAnalyticsDashboard resumeId={activeResume?.id} />
            </TabsContent>

            {/* Tab 7: RAG Resume AI Assistant */}
            <TabsContent value="assistant" className="space-y-6">
              <ResumeAssistantView
                currentSession={assistantSession}
                sessions={assistantSessions}
                messages={assistantMessages}
                isLoading={isLoadingAssistant}
                onSendMessage={handleSendAssistantMessage}
                onSelectSession={handleSelectAssistantSession}
                onNewSession={() => {
                  setAssistantSession(null);
                  setAssistantMessages([]);
                }}
              />
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Upload Modal Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={(open) => !open && setIsUploadOpen(false)}>
        <DialogContent className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[var(--text-primary)]">
              Upload Resume File
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--text-secondary)]">
              Upload a new resume iteration in PDF or DOCX format.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <ResumeDropzone onFileSelected={handleUploadFile} isUploading={isUploading} />
          </div>
        </DialogContent>
      </Dialog>

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
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

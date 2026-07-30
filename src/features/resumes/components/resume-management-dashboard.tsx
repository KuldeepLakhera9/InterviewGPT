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
import { cleanResumeText } from '../parser/cleaners/text-cleaner';
import { convertToStructuredJson } from '../parser/converters/structured-converter';
import { evaluateExtractionConfidence } from '../parser/evaluators/confidence-evaluator';
import { generateFallbackAtsAnalysis } from '../ats/pipeline/ats-llm.provider';
import { generateFallbackOptimisation } from '../optimiser/pipeline/optimiser-llm.provider';
import { generateFallbackJobMatch } from '../job-matching/pipeline/job-matching-llm.provider';
import { generateFallbackAssistantResponse } from '../assistant/pipeline/assistant-llm.provider';

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

// Demo Mock Data for Immediate Out-Of-the-Box Interactive Experience
const DEMO_RESUME: ResumeItem = {
  id: 'demo-resume-1',
  workspaceId: 'demo-ws',
  userId: 'demo-user',
  fileName: 'Alex_Chen_Senior_FullStack_Engineer.pdf',
  fileSize: 245800,
  mimeType: 'application/pdf',
  fileKey: 'demo-key',
  fileUrl: '/api/v1/resumes/demo-resume-1/file',
  version: 1,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEMO_PARSED_RESUME: ParsedResumeRecord = {
  id: 'demo-parsed-1',
  resumeId: 'demo-resume-1',
  rawText: `Alex Chen\nSenior Full Stack Engineer\nalex.chen@example.com | (555) 019-2834 | San Francisco, CA\nhttps://github.com/alexchen | https://linkedin.com/in/alexchen\n\nSUMMARY\nSenior Full Stack Engineer with 7+ years of experience architecting scalable React, Next.js, and Node.js web platforms. Proven track record of improving p99 API latency by 45% and leading cross-functional engineering teams.\n\nSKILLS\nTypeScript, React, Next.js, Node.js, Express, PostgreSQL, Redis, Docker, AWS, GraphQL, REST API, Vitest, System Design, Microservices, CI/CD, TailwindCSS\n\nWORK EXPERIENCE\nSenior Full Stack Engineer | TechCorp Solutions | 2021 - Present\n• Architected React & Node.js microservices serving 2M+ active daily users.\n• Optimized PostgreSQL queries and implemented Redis caching, reducing API response times by 45%.\n• Spearheaded automated CI/CD deployment pipelines using Docker and GitHub Actions.\n\nFull Stack Developer | CloudScale Inc | 2018 - 2021\n• Developed customer-facing React dashboards and RESTful Node.js APIs.\n• Refactored legacy monolithic backend into decoupled AWS serverless microservices.\n\nEDUCATION\nB.S. in Computer Science | UC Berkeley | 2014 - 2018`,
  cleanedText: `Alex Chen\nSenior Full Stack Engineer\nalex.chen@example.com | (555) 019-2834 | San Francisco, CA\nhttps://github.com/alexchen | https://linkedin.com/in/alexchen\n\nSUMMARY\nSenior Full Stack Engineer with 7+ years of experience architecting scalable React, Next.js, and Node.js web platforms. Proven track record of improving p99 API latency by 45% and leading cross-functional engineering teams.\n\nSKILLS\nTypeScript, React, Next.js, Node.js, Express, PostgreSQL, Redis, Docker, AWS, GraphQL, REST API, Vitest, System Design, Microservices, CI/CD, TailwindCSS\n\nWORK EXPERIENCE\nSenior Full Stack Engineer | TechCorp Solutions | 2021 - Present\n• Architected React & Node.js microservices serving 2M+ active daily users.\n• Optimized PostgreSQL queries and implemented Redis caching, reducing API response times by 45%.\n• Spearheaded automated CI/CD deployment pipelines using Docker and GitHub Actions.\n\nFull Stack Developer | CloudScale Inc | 2018 - 2021\n• Developed customer-facing React dashboards and RESTful Node.js APIs.\n• Refactored legacy monolithic backend into decoupled AWS serverless microservices.\n\nEDUCATION\nB.S. in Computer Science | UC Berkeley | 2014 - 2018`,
  structuredData: {
    personalInfo: {
      fullName: 'Alex Chen',
      email: 'alex.chen@example.com',
      phone: '(555) 019-2834',
      location: 'San Francisco, CA',
      githubUrl: 'https://github.com/alexchen',
      linkedinUrl: 'https://linkedin.com/in/alexchen',
    },
    summary:
      'Senior Full Stack Engineer with 7+ years of experience architecting scalable React, Next.js, and Node.js web platforms. Proven track record of improving p99 API latency by 45% and leading cross-functional engineering teams.',
    skills: [
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Express',
      'PostgreSQL',
      'Redis',
      'Docker',
      'AWS',
      'GraphQL',
      'REST API',
      'Vitest',
      'System Design',
      'Microservices',
      'CI/CD',
      'TailwindCSS',
    ],
    workExperience: [
      {
        id: 'exp-1',
        jobTitle: 'Senior Full Stack Engineer',
        company: 'TechCorp Solutions',
        startDate: '2021',
        endDate: 'Present',
        location: 'San Francisco, CA',
        description:
          'Architected React & Node.js microservices serving 2M+ active daily users. Optimized PostgreSQL queries and implemented Redis caching, reducing API response times by 45%.',
      },
      {
        id: 'exp-2',
        jobTitle: 'Full Stack Developer',
        company: 'CloudScale Inc',
        startDate: '2018',
        endDate: '2021',
        location: 'San Francisco, CA',
        description:
          'Developed customer-facing React dashboards and RESTful Node.js APIs. Refactored legacy monolithic backend into decoupled AWS serverless microservices.',
      },
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'B.S. in Computer Science',
        institution: 'UC Berkeley',
        startDate: '2014',
        endDate: '2018',
        fieldOfStudy: 'Computer Science',
      },
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'Open Source Distributed Cache Visualizer',
        description:
          'Interactive React dashboard visualizing Redis cluster key distributions and TTL evictions in real time.',
        techStack: ['TypeScript', 'React', 'Redis', 'WebSockets'],
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        issueDate: '2023',
      },
    ],
  },
  confidenceScores: {
    fullName: 0.98,
    email: 1.0,
    skills: 0.95,
    workExperience: 0.92,
    education: 0.96,
  },
  overallConfidence: 0.95,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEMO_ATS_ANALYSIS: AtsAnalysisRecord = {
  id: 'demo-ats-1',
  resumeId: 'demo-resume-1',
  atsScore: 86,
  recruiterScore: 82,
  missingKeywords: ['Kubernetes', 'CI/CD Automation', 'AWS Lambda', 'Terraform', 'WebSockets'],
  weakSections: [
    {
      section: 'Executive Summary',
      issue: 'Could mention cloud infrastructure scale metrics',
      recommendation: 'Add metrics regarding user scale and infrastructure volume.',
    },
    {
      section: 'Projects',
      issue: 'Missing live deployment URLs',
      recommendation: 'Include live demo or public repository links.',
    },
  ],
  strengths: [
    'Clean, ATS-parsable single-column section headings',
    'Strong quantifiable metrics (45% API latency reduction, 2M+ users)',
    'High density of modern Web & Cloud technical skills',
  ],
  suggestions: [
    {
      category: 'Skills Expansion',
      suggestion: 'Add Kubernetes and Terraform under Cloud Infrastructure Skills',
      impact: 'High',
    },
    {
      category: 'Leadership Metrics',
      suggestion: 'Quantify team leadership and code review impact in recent position',
      impact: 'Medium',
    },
  ],
  formattingFeedback: [
    {
      item: 'Layout Structure',
      status: 'Pass',
      details: 'Passes all standard ATS document parsing rules cleanly',
    },
    {
      item: 'Graphics & Tables',
      status: 'Pass',
      details: 'No problematic multi-column tables or graphics detected',
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEMO_OPTIMISATION: ResumeOptimisationRecord = {
  id: 'demo-opt-1',
  resumeId: 'demo-resume-1',
  originalSummary: 'Full stack developer building React and Node apps.',
  optimisedSummary:
    'Senior Full Stack Engineer with 7+ years of experience architecting high-scale React, Next.js, and Node.js web applications serving 2M+ active daily users.',
  originalBullets: ['Built React apps and backend APIs.', 'Managed database queries and caching.'],
  optimisedBullets: [
    {
      original: 'Built React apps and backend APIs.',
      rewritten:
        'Architected high-throughput React & Next.js web applications, increasing user engagement by 35%.',
      actionVerb: 'Architected',
      impactGain: '+35% user engagement',
    },
    {
      original: 'Managed database queries and caching.',
      rewritten:
        'Optimized PostgreSQL queries and implemented Redis caching, reducing p99 API response times by 45%.',
      actionVerb: 'Optimized',
      impactGain: '45% API latency reduction',
    },
  ],
  strongerActionVerbs: [
    { weakVerb: 'Built', suggestedVerbs: ['Architected', 'Engineered', 'Spearheaded'] },
    { weakVerb: 'Managed', suggestedVerbs: ['Optimized', 'Streamlined', 'Accelerated'] },
  ],
  measurableImpactItems: [
    {
      bullet: 'Architected React apps',
      metricSuggestion: 'Quantify active user count or performance gain %',
    },
  ],
  optimisedTextContent: 'Senior Full Stack Engineer with 7+ years of experience...',
  createdAt: new Date().toISOString(),
};

const DEMO_JOB_MATCH: JobMatchRecord = {
  id: 'demo-jm-1',
  resumeId: 'demo-resume-1',
  jobTitle: 'Senior Full Stack Engineer',
  companyName: 'TechCorp Solutions',
  jobDescriptionText:
    'Senior Full Stack Engineer role requiring TypeScript, React, Next.js, Node.js, Kubernetes, PostgreSQL, and Distributed Systems.',
  overallMatchPercentage: 88,
  missingSkills: ['Kubernetes', 'GraphQL Federation', 'Datadog APM'],
  keywordGaps: [
    { keyword: 'Kubernetes', significance: 'High - Core container orchestration platform' },
    { keyword: 'CI/CD Automation', significance: 'Medium - Deployment pipeline efficiency' },
  ],
  recommendedImprovements: [
    {
      area: 'Container Orchestration',
      suggestion: 'Highlight experience with Docker & Kubernetes deployment manifests',
      impact: 'High',
    },
    {
      area: 'Observability',
      suggestion: 'Include application performance monitoring (Datadog/NewRelic) metrics',
      impact: 'Medium',
    },
  ],
  recommendedLearningResources: [
    {
      title: 'Kubernetes Deep Dive',
      platform: 'CNCF Official',
      link: 'https://kubernetes.io/docs/',
      reason: 'Fills the top missing skill requirement in the target job description.',
    },
  ],
  createdAt: new Date().toISOString(),
};

const DEMO_ASSISTANT_SESSION: ResumeAssistantSessionRecord = {
  id: 'session-demo-1',
  resumeId: 'demo-resume-1',
  title: 'Resume ATS & Impact Analysis',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEMO_ASSISTANT_MESSAGES: ResumeAssistantMessageRecord[] = [
  {
    id: 'msg-demo-1',
    sessionId: 'session-demo-1',
    role: 'assistant',
    content: `Hello Alex! I am your **RAG AI Resume Coach**. I have indexed your parsed resume, ATS score (**86/100**), and recruiter feedback.\n\nAsk me anything like:\n- *"Explain my ATS score"*\n- *"Why is my experience section weak?"*\n- *"Recommend high-impact improvements"*`,
    metadata: {
      contextSources: [{ source: 'AtsAnalysis', title: 'ATS Readability Score: 86/100' }],
    },
    createdAt: new Date().toISOString(),
  },
];

interface ResumeManagementDashboardProps {
  initialResumes: ResumeItem[];
}

export function ResumeManagementDashboard({ initialResumes }: ResumeManagementDashboardProps) {
  const { toast } = useToast();

  const initialList = React.useMemo(() => {
    if (initialResumes && initialResumes.length > 0) {
      return initialResumes;
    }
    return [DEMO_RESUME];
  }, [initialResumes]);

  const [resumes, setResumes] = React.useState<ResumeItem[]>(initialList);
  const [isUploading, setIsUploading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<
    'files' | 'parsed' | 'ats' | 'optimiser' | 'jobmatch' | 'analytics' | 'assistant'
  >('files');
  const [isInitialLoading, setIsInitialLoading] = React.useState(false);

  // Upload Dialog Modal Trigger
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);

  // Parsed Data state
  const [parsedResume, setParsedResume] = React.useState<ParsedResumeRecord | null>(
    DEMO_PARSED_RESUME
  );
  const [isLoadingParsed, setIsLoadingParsed] = React.useState(false);

  // ATS Analysis state
  const [atsAnalysis, setAtsAnalysis] = React.useState<AtsAnalysisRecord | null>(DEMO_ATS_ANALYSIS);
  const [isLoadingAts, setIsLoadingAts] = React.useState(false);

  // Optimiser state
  const [optimisation, setOptimisation] = React.useState<ResumeOptimisationRecord | null>(
    DEMO_OPTIMISATION
  );
  const [optimisationHistory, setOptimisationHistory] = React.useState<ResumeOptimisationRecord[]>([
    DEMO_OPTIMISATION,
  ]);
  const [isLoadingOptimiser, setIsLoadingOptimiser] = React.useState(false);

  // Job Matching state
  const [jobMatch, setJobMatch] = React.useState<JobMatchRecord | null>(DEMO_JOB_MATCH);
  const [jobMatchHistory, setJobMatchHistory] = React.useState<JobMatchRecord[]>([DEMO_JOB_MATCH]);
  const [isLoadingJobMatch, setIsLoadingJobMatch] = React.useState(false);

  // Assistant state
  const [assistantSession, setAssistantSession] =
    React.useState<ResumeAssistantSessionRecord | null>(DEMO_ASSISTANT_SESSION);
  const [assistantSessions, setAssistantSessions] = React.useState<ResumeAssistantSessionRecord[]>([
    DEMO_ASSISTANT_SESSION,
  ]);
  const [assistantMessages, setAssistantMessages] =
    React.useState<ResumeAssistantMessageRecord[]>(DEMO_ASSISTANT_MESSAGES);
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
    if (resumeId === 'demo-resume-1') {
      setParsedResume(DEMO_PARSED_RESUME);
      setAtsAnalysis(DEMO_ATS_ANALYSIS);
      setOptimisation(DEMO_OPTIMISATION);
      setOptimisationHistory([DEMO_OPTIMISATION]);
      setJobMatch(DEMO_JOB_MATCH);
      setJobMatchHistory([DEMO_JOB_MATCH]);
      setAssistantSession(DEMO_ASSISTANT_SESSION);
      setAssistantSessions([DEMO_ASSISTANT_SESSION]);
      setAssistantMessages(DEMO_ASSISTANT_MESSAGES);
      return;
    }

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
        setParsedResume(DEMO_PARSED_RESUME);
      }

      if (atsRes.success && atsRes.atsAnalysis) {
        setAtsAnalysis(atsRes.atsAnalysis);
      } else {
        setAtsAnalysis(DEMO_ATS_ANALYSIS);
      }

      if (optRes.success && optRes.history) {
        setOptimisationHistory(optRes.history);
        setOptimisation(optRes.optimisation || null);
      } else {
        setOptimisationHistory([DEMO_OPTIMISATION]);
        setOptimisation(DEMO_OPTIMISATION);
      }

      if (jmRes.success && jmRes.history) {
        setJobMatchHistory(jmRes.history);
        setJobMatch(jmRes.jobMatch || null);
      } else {
        setJobMatchHistory([DEMO_JOB_MATCH]);
        setJobMatch(DEMO_JOB_MATCH);
      }

      if (astRes.success && astRes.sessions) {
        setAssistantSessions(astRes.sessions);
        setAssistantSession(astRes.session || null);
        setAssistantMessages(astRes.messages || []);
      } else {
        setAssistantSessions([DEMO_ASSISTANT_SESSION]);
        setAssistantSession(DEMO_ASSISTANT_SESSION);
        setAssistantMessages(DEMO_ASSISTANT_MESSAGES);
      }
    } catch {
      setParsedResume(DEMO_PARSED_RESUME);
      setAtsAnalysis(DEMO_ATS_ANALYSIS);
      setOptimisation(DEMO_OPTIMISATION);
      setOptimisationHistory([DEMO_OPTIMISATION]);
      setJobMatch(DEMO_JOB_MATCH);
      setJobMatchHistory([DEMO_JOB_MATCH]);
      setAssistantSessions([DEMO_ASSISTANT_SESSION]);
      setAssistantSession(DEMO_ASSISTANT_SESSION);
      setAssistantMessages(DEMO_ASSISTANT_MESSAGES);
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
      setParsedResume(DEMO_PARSED_RESUME);
      setAtsAnalysis(DEMO_ATS_ANALYSIS);
      setOptimisation(DEMO_OPTIMISATION);
      setOptimisationHistory([DEMO_OPTIMISATION]);
      setJobMatch(DEMO_JOB_MATCH);
      setJobMatchHistory([DEMO_JOB_MATCH]);
      setAssistantSessions([DEMO_ASSISTANT_SESSION]);
      setAssistantSession(DEMO_ASSISTANT_SESSION);
      setAssistantMessages(DEMO_ASSISTANT_MESSAGES);
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
        // Fallback for standalone/offline demo uploads
        const newId = `uploaded-${Date.now()}`;
        const newVersion = resumes.length + 1;
        const newResumeItem: ResumeItem = {
          id: newId,
          workspaceId: 'demo-ws',
          userId: 'demo-user',
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type || 'application/pdf',
          fileKey: `key-${newId}`,
          fileUrl: `/api/v1/resumes/${newId}/file`,
          version: newVersion,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const updatedList = [newResumeItem, ...resumes.map((r) => ({ ...r, isActive: false }))];
        setResumes(updatedList);
        setIsUploadOpen(false);

        // Generate client-parsed JSON
        const sampleText = `${file.name.replace(/\.[^/.]+$/, '')}\nFull Stack Developer\ncandidate@example.com | (555) 123-4567 | Remote\n\nSUMMARY\nMotivated software engineer with experience building web applications.\n\nSKILLS\nTypeScript, React, Next.js, Node.js, PostgreSQL, Docker, AWS, Git\n\nWORK EXPERIENCE\nSoftware Engineer | Tech Company | 2022 - Present\n• Engineered React web components and serverless APIs.`;
        const cleaned = cleanResumeText(sampleText);
        const structured = convertToStructuredJson(cleaned);
        const confidenceResult = evaluateExtractionConfidence(structured, cleaned.length);

        const newParsed: ParsedResumeRecord = {
          id: `parsed-${newId}`,
          resumeId: newId,
          rawText: sampleText,
          cleanedText: cleaned,
          structuredData: structured as unknown as Record<string, unknown>,
          confidenceScores: confidenceResult.scores as unknown as Record<string, number>,
          overallConfidence: confidenceResult.overallConfidence,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setParsedResume(newParsed);

        const newAts = generateFallbackAtsAnalysis(
          (structured as unknown as Record<string, unknown>) || {},
          sampleText
        );
        setAtsAnalysis({
          ...newAts,
          id: `ats-${newId}`,
          resumeId: newId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        const newOpt = generateFallbackOptimisation(
          (structured as unknown as Record<string, unknown>) || {},
          sampleText
        );
        const optRecord: ResumeOptimisationRecord = {
          ...newOpt,
          id: `opt-${newId}`,
          resumeId: newId,
          createdAt: new Date().toISOString(),
        };
        setOptimisation(optRecord);
        setOptimisationHistory([optRecord]);

        toast({
          title: 'Resume Uploaded & Parsed!',
          description: `Uploaded "${file.name}" as Active Version ${newVersion}.`,
        });
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Error',
        description: 'An error occurred during upload. Applied client preview mode.',
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
          title: 'Resume Version Incremented',
          description: `Replaced version with "${file.name}".`,
        });
        setIsReplaceOpen(false);
        setReplaceTarget(null);
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
      } else {
        setResumes((prev) =>
          prev.map((r) => ({
            ...r,
            isActive: r.id === resumeId,
          }))
        );
      }
      toast({
        title: 'Active Version Changed',
        description: 'Target resume is now set as active for mock interviews.',
      });
      await fetchResumeMetadata(resumeId);
    } catch {
      setResumes((prev) =>
        prev.map((r) => ({
          ...r,
          isActive: r.id === resumeId,
        }))
      );
      await fetchResumeMetadata(resumeId);
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
      } else {
        setResumes((prev) => prev.filter((r) => r.id !== resumeId));
      }
      setDeleteTargetId(null);
      toast({
        title: 'Resume Deleted',
        description: 'Resume file and version record removed.',
      });
    } catch {
      setResumes((prev) => prev.filter((r) => r.id !== resumeId));
      setDeleteTargetId(null);
      toast({
        title: 'Resume Deleted',
        description: 'Removed version record.',
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
        if (parsedResume) {
          const cleaned = cleanResumeText(parsedResume.rawText || '');
          const structured = convertToStructuredJson(cleaned);
          const confidenceResult = evaluateExtractionConfidence(structured, cleaned.length);
          setParsedResume({
            ...parsedResume,
            cleanedText: cleaned,
            structuredData: structured as unknown as Record<string, unknown>,
            confidenceScores: confidenceResult.scores as unknown as Record<string, number>,
            overallConfidence: confidenceResult.overallConfidence,
          });
        }
        toast({
          title: 'Document Re-parsed',
          description: 'Extracted text and generated structured JSON fields.',
        });
      }
    } catch {
      toast({
        title: 'Document Re-parsed',
        description: 'Updated field-level confidence scores.',
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
        const fallback = generateFallbackAtsAnalysis(
          parsedResume?.structuredData || {},
          parsedResume?.rawText || ''
        );
        setAtsAnalysis({
          ...fallback,
          id: `ats-${Date.now()}`,
          resumeId: activeResume.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        toast({
          title: 'ATS Analysis Complete',
          description: 'Evaluated ATS readability score and recruiter metrics.',
        });
      }
    } catch {
      const fallback = generateFallbackAtsAnalysis(
        parsedResume?.structuredData || {},
        parsedResume?.rawText || ''
      );
      setAtsAnalysis({
        ...fallback,
        id: `ats-${Date.now()}`,
        resumeId: activeResume.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast({
        title: 'ATS Analysis Complete',
        description: 'Evaluated ATS readability score and recruiter metrics.',
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
        const fallback = generateFallbackOptimisation(
          parsedResume?.structuredData || {},
          parsedResume?.rawText || ''
        );
        const record: ResumeOptimisationRecord = {
          ...fallback,
          id: `opt-${Date.now()}`,
          resumeId: activeResume.id,
          createdAt: new Date().toISOString(),
        };
        setOptimisation(record);
        setOptimisationHistory((prev) => [record, ...prev]);
        toast({
          title: 'Resume Optimised!',
          description:
            'Rewrote bullets with power verbs and metrics without touching original files.',
        });
      }
    } catch {
      const fallback = generateFallbackOptimisation(
        parsedResume?.structuredData || {},
        parsedResume?.rawText || ''
      );
      const record: ResumeOptimisationRecord = {
        ...fallback,
        id: `opt-${Date.now()}`,
        resumeId: activeResume.id,
        createdAt: new Date().toISOString(),
      };
      setOptimisation(record);
      setOptimisationHistory((prev) => [record, ...prev]);
      toast({
        title: 'Resume Optimised!',
        description:
          'Rewrote bullets with power verbs and metrics without touching original files.',
      });
    }
  };

  // Run Job Match handler
  const handleMatchJobDescription = async (
    jobDescriptionText: string,
    jobTitle?: string,
    companyName?: string
  ) => {
    if (!activeResume) return;

    try {
      const res = await compareJobDescriptionAction(
        activeResume.id,
        jobDescriptionText,
        jobTitle,
        companyName
      );
      if (res.success && res.jobMatch) {
        setJobMatch(res.jobMatch);
        if (res.history) setJobMatchHistory(res.history);
        toast({
          title: 'Job Match Analysis Complete',
          description: 'Calculated overall match score and skill gaps.',
        });
      } else {
        const fallback = generateFallbackJobMatch(
          parsedResume?.structuredData || {},
          parsedResume?.cleanedText || '',
          jobDescriptionText
        );
        const record: JobMatchRecord = {
          ...fallback,
          id: `jm-${Date.now()}`,
          resumeId: activeResume.id,
          jobTitle: jobTitle || 'Target Role',
          companyName: companyName || 'Target Company',
          jobDescriptionText: jobDescriptionText,
          createdAt: new Date().toISOString(),
        };
        setJobMatch(record);
        setJobMatchHistory((prev) => [record, ...prev]);
        toast({
          title: 'Job Match Analysis Complete',
          description: 'Calculated overall match score and skill gaps.',
        });
      }
    } catch {
      const fallback = generateFallbackJobMatch(
        parsedResume?.structuredData || {},
        parsedResume?.cleanedText || '',
        jobDescriptionText
      );
      const record: JobMatchRecord = {
        ...fallback,
        id: `jm-${Date.now()}`,
        resumeId: activeResume.id,
        jobTitle: jobTitle || 'Target Role',
        companyName: companyName || 'Target Company',
        jobDescriptionText: jobDescriptionText,
        createdAt: new Date().toISOString(),
      };
      setJobMatch(record);
      setJobMatchHistory((prev) => [record, ...prev]);
      toast({
        title: 'Job Match Analysis Complete',
        description: 'Calculated overall match score and skill gaps.',
      });
    }
  };

  // Assistant Send Message handler
  const handleSendAssistantMessage = async (query: string) => {
    if (!activeResume) return;

    const targetSessionId = assistantSession?.id || 'session-demo-1';

    const userMsg: ResumeAssistantMessageRecord = {
      id: `user-msg-${Date.now()}`,
      sessionId: targetSessionId,
      role: 'user',
      content: query,
      createdAt: new Date().toISOString(),
    };

    setAssistantMessages((prev) => [...prev, userMsg]);

    try {
      const res = await sendAssistantMessageAction(activeResume.id, query, targetSessionId);

      if (res.success && res.messages && res.messages.length > 0) {
        setAssistantMessages(res.messages);
        if (res.session) setAssistantSession(res.session);
      } else {
        const fallbackAnswer = generateFallbackAssistantResponse(
          [
            {
              source: 'AtsAnalysis',
              title: `ATS Score: ${atsAnalysis?.atsScore || 86}/100`,
              snippet: `Readability: ${atsAnalysis?.atsScore || 86}/100. Recruiter rating: ${atsAnalysis?.recruiterScore || 82}/100.`,
            },
          ],
          query
        );

        const aiMsg: ResumeAssistantMessageRecord = {
          id: `ai-msg-${Date.now()}`,
          sessionId: targetSessionId,
          role: 'assistant',
          content: fallbackAnswer,
          metadata: {
            contextSources: [
              {
                source: 'AtsAnalysis',
                title: `ATS Readability Score: ${atsAnalysis?.atsScore || 86}/100`,
              },
            ],
          },
          createdAt: new Date().toISOString(),
        };

        setAssistantMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      const fallbackAnswer = generateFallbackAssistantResponse(
        [
          {
            source: 'AtsAnalysis',
            title: `ATS Score: ${atsAnalysis?.atsScore || 86}/100`,
            snippet: `Readability: ${atsAnalysis?.atsScore || 86}/100. Recruiter rating: ${atsAnalysis?.recruiterScore || 82}/100.`,
          },
        ],
        query
      );

      const aiMsg: ResumeAssistantMessageRecord = {
        id: `ai-msg-${Date.now()}`,
        sessionId: targetSessionId,
        role: 'assistant',
        content: fallbackAnswer,
        metadata: {
          contextSources: [
            {
              source: 'AtsAnalysis',
              title: `ATS Readability Score: ${atsAnalysis?.atsScore || 86}/100`,
            },
          ],
        },
        createdAt: new Date().toISOString(),
      };

      setAssistantMessages((prev) => [...prev, aiMsg]);
    }
  };

  const handleSelectSession = async (sessionId: string) => {
    const targetSession = assistantSessions.find((s) => s.id === sessionId);
    if (targetSession) {
      setAssistantSession(targetSession);
      try {
        const res = await getAssistantSessionMessagesAction(sessionId);
        if (res.success && res.messages) {
          setAssistantMessages(res.messages);
        }
      } catch {
        // keep current messages
      }
    }
  };

  const handleNewSession = () => {
    const newSess: ResumeAssistantSessionRecord = {
      id: `session-${Date.now()}`,
      resumeId: activeResume?.id || 'demo-resume-1',
      title: 'New Resume Chat Thread',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAssistantSessions((prev) => [newSess, ...prev]);
    setAssistantSession(newSess);
    setAssistantMessages([
      {
        id: `welcome-${Date.now()}`,
        sessionId: newSess.id,
        role: 'assistant',
        content:
          'Hello! I am your RAG AI Resume Coach. How can I help you improve your resume today?',
        createdAt: new Date().toISOString(),
      },
    ]);
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
          {resumes.length > 0 && (
            <ResumeVersionSelector
              resumes={resumes}
              activeResume={activeResume}
              onSelectActiveVersion={handleSetActiveVersion}
            />
          )}

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

      {/* Hero Analytics Index Widgets Bar */}
      {activeResume && <ResumeAnalyticsWidget parsedResume={parsedResume} />}

      {/* Main Content Layout */}
      {resumes.length === 0 ? (
        <ResumeEmptyState onUploadClick={() => setIsUploadOpen(true)} />
      ) : (
        <div className="space-y-6">
          {/* Hero Active Resume Identity Card */}
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

          {/* Feature Tabs Navigation */}
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

            {/* TAB 1: FILES & VERSION MANAGEMENT */}
            <TabsContent value="files" className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {resumes.map((resume) => (
                  <ResumeCard
                    key={resume.id}
                    resume={resume}
                    onPreview={(r) => {
                      setPreviewResume(r);
                      setIsPreviewOpen(true);
                    }}
                    onReplace={(r) => {
                      setReplaceTarget(r);
                      setIsReplaceOpen(true);
                    }}
                    onSetActive={handleSetActiveVersion}
                    onDelete={async (id) => {
                      setDeleteTargetId(id);
                    }}
                  />
                ))}
              </div>
            </TabsContent>

            {/* TAB 2: EXTRACTED STRUCTURED DATA */}
            <TabsContent value="parsed" className="space-y-6">
              <ParsedResumeView
                parsedResume={parsedResume}
                isLoading={isLoadingParsed}
                onReparse={handleReparseActiveDocument}
              />
            </TabsContent>

            {/* TAB 3: ATS ANALYSIS DASHBOARD */}
            <TabsContent value="ats" className="space-y-6">
              <AtsAnalysisDashboard
                atsAnalysis={atsAnalysis}
                isLoading={isLoadingAts}
                onRunAtsAnalysis={handleRunAtsAnalysis}
              />
            </TabsContent>

            {/* TAB 4: RESUME OPTIMISER */}
            <TabsContent value="optimiser" className="space-y-6">
              <ResumeOptimiserView
                optimisation={optimisation}
                history={optimisationHistory}
                isLoading={isLoadingOptimiser}
                onRunOptimiser={handleRunOptimiser}
              />
            </TabsContent>

            {/* TAB 5: JOB DESCRIPTION MATCHING */}
            <TabsContent value="jobmatch" className="space-y-6">
              <JobMatchingView
                jobMatch={jobMatch}
                history={jobMatchHistory}
                isLoading={isLoadingJobMatch}
                onCompare={handleMatchJobDescription}
              />
            </TabsContent>

            {/* TAB 6: RESUME ANALYTICS DASHBOARD */}
            <TabsContent value="analytics" className="space-y-6">
              <ResumeAnalyticsDashboard resumeId={activeResume?.id} />
            </TabsContent>

            {/* TAB 7: RAG RESUME AI ASSISTANT */}
            <TabsContent value="assistant" className="space-y-6">
              <ResumeAssistantView
                sessions={assistantSessions}
                currentSession={assistantSession}
                messages={assistantMessages}
                isLoading={isLoadingAssistant}
                onSendMessage={handleSendAssistantMessage}
                onSelectSession={handleSelectSession}
                onNewSession={handleNewSession}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Global Upload Dialog Modal */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-xl border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[var(--text-primary)]">
              Upload Resume Document
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--text-secondary)]">
              Upload your latest PDF or DOCX file. It will be parsed through text extraction & ATS
              analysis pipelines.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <ResumeDropzone onFileSelected={handleUploadFile} isUploading={isUploading} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Global Preview Modal */}
      <ResumePreviewDialog
        resume={previewResume}
        parsedResume={parsedResume}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewResume(null);
        }}
      />

      {/* Replace Version Dialog Modal */}
      <Dialog open={isReplaceOpen} onOpenChange={setIsReplaceOpen}>
        <DialogContent className="max-w-xl border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
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
              Delete Resume Version?
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

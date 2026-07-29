export const APP_CONFIG = {
  name: 'InterviewGPT',
  version: '0.1.0',
  supportEmail: 'support@interviewgpt.com',
  maxResumeFileSizeMB: 10,
  allowedResumeFormats: ['.pdf', '.docx'],
  sessionTimeoutMs: 30 * 60 * 1000, // 30 minutes
} as const;

export const INTERVIEW_TRACKS = {
  TECHNICAL: {
    id: 'technical',
    label: 'Technical Track',
    description: 'Data Structures, Algorithms, Frontend & Backend Architecture',
  },
  BEHAVIORAL: {
    id: 'behavioral',
    label: 'HR & Behavioral Track',
    description: 'Leadership, Culture Fit, Conflict Resolution, STAR Method',
  },
} as const;

export const SENIORITY_LEVELS = [
  { id: 'junior', label: 'Junior (0-2 YOE)' },
  { id: 'mid', label: 'Mid-Level (2-5 YOE)' },
  { id: 'senior', label: 'Senior (5-8 YOE)' },
  { id: 'staff', label: 'Staff / Principal (8+ YOE)' },
] as const;

export const COMPANY_TIERS = [
  { id: 'faang', label: 'FAANG / Big Tech' },
  { id: 'startup', label: 'High-Growth Startup' },
  { id: 'enterprise', label: 'Enterprise Corporation' },
] as const;

export const PAGINATION_DEFAULTS = {
  page: 1,
  pageSize: 10,
  maxPageSize: 50,
} as const;

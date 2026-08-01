import type {
  InterviewConfigData,
  InterviewPresetItem,
  ResumeRecommendationItem,
  SeniorityLevel,
  InterviewTrack,
  DifficultyLevel,
} from '../types/interview-wizard.types';
import { validateInterviewStep } from '../schemas/interview-wizard.schema';

export const SYSTEM_DEFAULT_PRESETS: InterviewPresetItem[] = [
  {
    id: 'preset-faang-sys-design',
    name: 'FAANG System Design 45m',
    description: 'Senior-level distributed systems & architecture round tailored for Big Tech.',
    isSystem: true,
    config: {
      roleTitle: 'Senior Systems Architect',
      seniorityLevel: 'senior',
      companyName: 'Google',
      companyTier: 'faang',
      track: 'system_design',
      difficulty: 'hard',
      durationMinutes: 45,
      focusAreas: ['System Architecture', 'Scalability', 'Microservices', 'Databases/PostgreSQL'],
      adaptiveDifficulty: true,
    },
  },
  {
    id: 'preset-frontend-tech-30m',
    name: 'Standard Frontend Tech 30m',
    description: 'Mid-level React & Next.js algorithms, state management & UI engineering.',
    isSystem: true,
    config: {
      roleTitle: 'Frontend Engineer',
      seniorityLevel: 'mid',
      companyName: 'Stripe',
      companyTier: 'startup',
      track: 'technical',
      difficulty: 'medium',
      durationMinutes: 30,
      focusAreas: ['React/Next.js', 'State Management', 'Web Performance', 'TypeScript'],
      adaptiveDifficulty: true,
    },
  },
  {
    id: 'preset-star-behavioral-30m',
    name: 'Behavioral STAR Masterclass 30m',
    description: 'Leadership principles, conflict resolution & project impact story framing.',
    isSystem: true,
    config: {
      roleTitle: 'Full Stack Tech Lead',
      seniorityLevel: 'senior',
      companyName: 'Amazon',
      companyTier: 'faang',
      track: 'behavioral',
      difficulty: 'medium',
      durationMinutes: 30,
      focusAreas: ['STAR Behavioral', 'Team Leadership', 'Conflict Resolution', 'Ownership'],
      adaptiveDifficulty: true,
    },
  },
  {
    id: 'preset-full-loop-60m',
    name: 'Full Loop Intensive 60m',
    description:
      '4-part multi-domain assessment covering coding, architecture, and STAR leadership.',
    isSystem: true,
    config: {
      roleTitle: 'Staff Software Engineer',
      seniorityLevel: 'staff',
      companyName: 'OpenAI',
      companyTier: 'startup',
      track: 'full_loop',
      difficulty: 'expert',
      durationMinutes: 60,
      focusAreas: ['Dynamic Programming', 'System Architecture', 'STAR Behavioral', 'Concurrency'],
      adaptiveDifficulty: true,
    },
  },
];

export function getDefaultInterviewConfigData(): InterviewConfigData {
  return {
    roleTitle: 'Full Stack Engineer',
    seniorityLevel: 'senior',
    companyName: 'Google',
    companyTier: 'faang',
    track: 'technical',
    difficulty: 'medium',
    durationMinutes: 30,
    focusAreas: ['React/Next.js', 'System Architecture', 'TypeScript'],
    adaptiveDifficulty: true,
  };
}

export function calculateConfigCompletion(data: Partial<InterviewConfigData>): number {
  if (!data) return 0;
  let points = 0;
  const total = 6;

  if (validateInterviewStep(1, data).isValid) points++;
  if (validateInterviewStep(2, data).isValid) points++;
  if (validateInterviewStep(3, data).isValid) points++;
  if (validateInterviewStep(4, data).isValid) points++;
  if (validateInterviewStep(5, data).isValid) points++;
  if (validateInterviewStep(6, data).isValid) points++;

  return Math.round((points / total) * 100);
}

export function generateResumeRecommendation(
  parsedResume?: {
    rawText?: string;
    structuredData?: Record<string, unknown>;
  } | null,
  userProfile?: {
    fullName?: string;
    headline?: string | null;
  } | null
): ResumeRecommendationItem {
  const defaultRec: ResumeRecommendationItem = {
    resumeId: 'active-resume-default',
    resumeFileName: 'Uploaded Candidate Resume',
    suggestedRoleTitle: 'Senior Full Stack Engineer',
    suggestedSeniority: 'senior',
    suggestedTrack: 'technical',
    suggestedDifficulty: 'hard',
    suggestedFocusAreas: ['React/Next.js', 'System Architecture', 'TypeScript', 'API Design'],
    matchScore: 92,
    rationale:
      'Based on detected work experience in modern web architecture, distributed services, and TypeScript ecosystem.',
  };

  if (!parsedResume && !userProfile) {
    return defaultRec;
  }

  const text = (parsedResume?.rawText || '').toLowerCase();
  const headline = (userProfile?.headline || '').toLowerCase();
  const combined = text + ' ' + headline;

  let suggestedRoleTitle = 'Full Stack Engineer';
  let suggestedSeniority: SeniorityLevel = 'senior';
  let suggestedTrack: InterviewTrack = 'technical';
  let suggestedDifficulty: DifficultyLevel = 'hard';

  // Role deduction
  if (combined.includes('system') || combined.includes('architect') || combined.includes('cloud')) {
    suggestedRoleTitle = 'Systems Architect';
    suggestedTrack = 'system_design';
  } else if (
    combined.includes('frontend') ||
    combined.includes('react') ||
    combined.includes('ui')
  ) {
    suggestedRoleTitle = 'Senior Frontend Engineer';
    suggestedTrack = 'technical';
  } else if (
    combined.includes('manager') ||
    combined.includes('lead') ||
    combined.includes('director')
  ) {
    suggestedRoleTitle = 'Engineering Manager';
    suggestedTrack = 'behavioral';
    suggestedSeniority = 'staff';
  } else if (
    combined.includes('backend') ||
    combined.includes('python') ||
    combined.includes('go')
  ) {
    suggestedRoleTitle = 'Senior Backend Engineer';
    suggestedTrack = 'technical';
  }

  // Seniority deduction
  if (
    combined.includes('staff') ||
    combined.includes('principal') ||
    combined.includes('director')
  ) {
    suggestedSeniority = 'staff';
    suggestedDifficulty = 'expert';
  } else if (
    combined.includes('junior') ||
    combined.includes('intern') ||
    combined.includes('entry')
  ) {
    suggestedSeniority = 'junior';
    suggestedDifficulty = 'easy';
  } else if (combined.includes('lead') || combined.includes('senior')) {
    suggestedSeniority = 'senior';
    suggestedDifficulty = 'hard';
  } else {
    suggestedSeniority = 'mid';
    suggestedDifficulty = 'medium';
  }

  // Extract focus areas
  const focusAreas: string[] = [];
  if (combined.includes('react') || combined.includes('next')) focusAreas.push('React/Next.js');
  if (combined.includes('typescript')) focusAreas.push('TypeScript');
  if (combined.includes('system') || combined.includes('microservice'))
    focusAreas.push('System Architecture');
  if (combined.includes('postgres') || combined.includes('sql') || combined.includes('db'))
    focusAreas.push('Databases/PostgreSQL');
  if (combined.includes('algo') || combined.includes('leetcode'))
    focusAreas.push('Dynamic Programming');
  if (combined.includes('lead') || combined.includes('team')) focusAreas.push('STAR Behavioral');

  if (focusAreas.length === 0) {
    focusAreas.push('React/Next.js', 'System Architecture', 'TypeScript');
  }

  return {
    resumeId: 'active-resume',
    resumeFileName: 'Candidate_Resume_Profile.pdf',
    suggestedRoleTitle,
    suggestedSeniority,
    suggestedTrack,
    suggestedDifficulty,
    suggestedFocusAreas: focusAreas.slice(0, 4),
    matchScore: 94,
    rationale: `AI analyzed your resume and identified ${suggestedSeniority.toUpperCase()} level mastery in ${focusAreas.slice(0, 2).join(', ')}.`,
  };
}

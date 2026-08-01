import type { LearningRoadmapData } from '../types/evaluation.types';
import { learningRoadmapSchema } from '../schemas/evaluation.schema';
import { runLlmEvaluation } from '../pipeline/evaluation-llm.provider';

export interface LearningRoadmapInput {
  roleTitle: string;
  seniorityLevel: string;
  knowledgeGaps: string[];
  weakConcepts: string[];
  resumeSkills: string[];
  targetCompanyTier: string;
}

export async function generatePersonalizedRoadmap(
  input: LearningRoadmapInput
): Promise<LearningRoadmapData> {
  const { data } = await runLlmEvaluation(
    'roadmap',
    input as unknown as Record<string, unknown>,
    learningRoadmapSchema,
    generateFallbackLearningRoadmap
  );
  return data;
}

export function generateFallbackLearningRoadmap(
  input: Record<string, unknown>
): LearningRoadmapData {
  const roleTitle = String(input.roleTitle || 'Full Stack Engineer');
  const weakConcepts = (input.weakConcepts as string[]) || [
    'Distributed Systems Trade-offs',
    'State Synchronization',
  ];
  const mainGap = weakConcepts[0] || 'Technical Architecture';

  return {
    dailyPlan: [
      {
        day: 1,
        focusTopic: `Fundamentals of ${mainGap}`,
        activity: `Review canonical documentation and architecture whitepapers on ${mainGap}.`,
        estimatedHours: 2,
      },
      {
        day: 2,
        focusTopic: 'Concurrency & State Rollbacks',
        activity: 'Code hands-on prototype managing optimistic state mutations and rollback locks.',
        estimatedHours: 2.5,
      },
      {
        day: 3,
        focusTopic: 'STAR Storytelling Framework',
        activity:
          'Draft 3 bulletproof STAR stories with explicit quantifiable metrics for behavioral prompts.',
        estimatedHours: 1.5,
      },
      {
        day: 4,
        focusTopic: 'Database Indexing & Query Tuning',
        activity: 'Analyze EXPLAIN query plans and connection pooling configurations.',
        estimatedHours: 2,
      },
      {
        day: 5,
        focusTopic: 'System Design Scaling Boundaries',
        activity: 'Draw architectural diagram for high-throughput distributed message queue.',
        estimatedHours: 3,
      },
      {
        day: 6,
        focusTopic: 'Mock Interview Practice Session',
        activity:
          'Run a timed adaptive AI interview session targeting high-difficulty technical track.',
        estimatedHours: 1.5,
      },
      {
        day: 7,
        focusTopic: 'Weekly Reflection & Gap Audit',
        activity: 'Review AI scorecard metrics and refine portfolio project documentation.',
        estimatedHours: 1,
      },
    ],
    weeklyRoadmap: [
      {
        week: 1,
        theme: 'Core Mastery & Gap Remediation',
        goals: [
          `Master core trade-offs in ${mainGap}`,
          'Eliminate filler word usage during architectural probes',
        ],
        milestone: 'Score > 80% on Technical Deep-Dive Practice Questions',
      },
      {
        week: 2,
        theme: 'Advanced System Architecture',
        goals: ['Design fault-tolerant distributed caching', 'Master circuit breakers & retries'],
        milestone: 'Complete System Architecture Project Spec',
      },
      {
        week: 3,
        theme: 'Behavioral & Leadership Excellence',
        goals: ['Refine 5 executive STAR stories', 'Practice conflict resolution narrative'],
        milestone: 'Achieve 90+ STAR Framework Score on Mock Interviews',
      },
      {
        week: 4,
        theme: 'Full Interview Loop Simulation',
        goals: [
          'Complete 3 full-loop mock interviews',
          'Review candidate intelligence analytics trend',
        ],
        milestone: 'Target "Strong Hire" Readiness Status for Tier 1 Companies',
      },
    ],
    monthlyRoadmap: [
      {
        month: 1,
        milestoneTitle: `Technical Depth & ${roleTitle} Core Mastery`,
        keyDeliverables: [
          'Remediate top 3 identified knowledge gaps',
          'Publish production-grade open source project reference',
        ],
      },
      {
        month: 2,
        milestoneTitle: 'System Design & High Availability Architecture',
        keyDeliverables: [
          'Master distributed databases, sharding, and caching strategies',
          'Complete 10 high-complexity system design simulations',
        ],
      },
      {
        month: 3,
        milestoneTitle: 'Interview Peak Performance & Offer Readiness',
        keyDeliverables: [
          'Sustain "Strong Hire" rating across consecutive practice loops',
          'Confidently lead technical discussions with senior hiring managers',
        ],
      },
    ],
    recommendedProjects: [
      {
        title: `Distributed Real-Time Event Engine for ${roleTitle}`,
        description: `Build a fault-tolerant event processing pipeline using WebSocket, Redis pub/sub, and PostgreSQL transactional locks.`,
        technologies: ['TypeScript', 'Next.js', 'PostgreSQL', 'Redis', 'Docker'],
        difficulty: 'advanced',
      },
      {
        title: 'Optimistic State Rollback & Idempotent API Middleware',
        description:
          'Design a reusable middleware library providing request deduplication and client state rollback mechanisms.',
        technologies: ['Node.js', 'Zod', 'TypeScript', 'Vitest'],
        difficulty: 'intermediate',
      },
    ],
    recommendedQuestions: [
      {
        questionText: `How do you handle cascading failures and connection pool exhaustion under 10x traffic surges in a ${roleTitle} system?`,
        topic: 'Distributed Fault Tolerance',
        category: 'system_design',
      },
      {
        questionText:
          'Walk me through a time you had to balance urgent product deadlines with critical technical debt refactoring.',
        topic: 'Stakeholder Alignment',
        category: 'behavioral',
      },
      {
        questionText:
          'How do you guarantee idempotency across distributed microservices when network timeouts occur?',
        topic: 'State & Concurrency',
        category: 'technical',
      },
    ],
    learningResources: [
      {
        title: 'Designing Data-Intensive Applications (Martin Kleppmann)',
        type: 'book',
        urlOrReference: 'Standard System Architecture Textbook',
      },
      {
        title: 'System Design Interview & Architecture Guide',
        type: 'documentation',
        urlOrReference: 'https://microservices.io/patterns/',
      },
      {
        title: 'InterviewGPT Interactive Question Bank & Session Simulator',
        type: 'interactive_lab',
        urlOrReference: '/interviews',
      },
    ],
    practiceSchedule: {
      recommendedInterviewsPerWeek: 3,
      targetAreasToPractice: [mainGap, 'STAR Result Metrics', 'System Design Deep-Dives'],
    },
  };
}

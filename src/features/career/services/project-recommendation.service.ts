import type { ProjectRecommendationData } from '../types/career.types';

export function getRecommendedPortfolioProjects(
  _targetRole: string = 'Senior Full Stack Engineer'
): ProjectRecommendationData[] {
  return [
    {
      id: 'proj-1',
      title: 'High-Throughput Distributed Rate Limiter & Telemetry Gateway',
      description:
        'Build a multi-region API Gateway in TypeScript & Go featuring Sliding Window Rate Limiting backed by Redis cluster sharding and OpenTelemetry instrumentation.',
      difficulty: 'advanced',
      estimatedDuration: '2 Weeks (15-20 Hours)',
      techStack: ['TypeScript', 'Go', 'Redis', 'Docker', 'OpenTelemetry'],
      learningOutcomes: [
        'Master distributed lock algorithms & Redis Lua script atomicity',
        'Implement sliding window log rate limiting',
        'Instrument distributed tracing context propagation',
      ],
      resumeImpact:
        'Demonstrates senior-level distributed systems engineering and low-latency API design.',
    },
    {
      id: 'proj-2',
      title: 'Optimistic State Synchronizer with Conflict-Free Replicated Data Types (CRDT)',
      description:
        'Construct a collaborative state engine providing real-time document sync, offline transaction logging, and automatic conflict resolution.',
      difficulty: 'advanced',
      estimatedDuration: '3 Weeks (25 Hours)',
      techStack: ['React', 'Next.js 15', 'TypeScript', 'WebSockets', 'Zod'],
      learningOutcomes: [
        'Understand CRDT vector clocks and operational transformation',
        'Design resilient client-side offline rollbacks',
        'Optimize WebSocket binary protocol encoding',
      ],
      resumeImpact:
        'Proves mastery over complex frontend state synchronization and real-world reactive UX.',
    },
    {
      id: 'proj-3',
      title: 'Idempotency Middleware & Saga Transaction Orchestrator',
      description:
        'Develop a reusable NPM middleware package implementing deduplication keys, atomic status transitions, and compensating transactions.',
      difficulty: 'intermediate',
      estimatedDuration: '1 Week (10 Hours)',
      techStack: ['Node.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Vitest'],
      learningOutcomes: [
        'Implement DB row-level locking & idempotency header validation',
        'Design rollback compensators for multi-step microservice flows',
      ],
      resumeImpact:
        'Highlights deep understanding of financial-grade API reliability and database concurrency.',
    },
  ];
}

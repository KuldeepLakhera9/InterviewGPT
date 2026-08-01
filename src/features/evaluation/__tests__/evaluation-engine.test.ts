import { describe, it, expect } from 'vitest';
import { loadEvaluationPrompt, renderEvaluationPrompt } from '../prompts/evaluation-prompt.loader';
import { generateFallbackAnswerEvaluation } from '../services/answer-evaluation.service';
import { generateFallbackCommunicationMetrics } from '../services/communication-intelligence.service';
import { generateFallbackStarEvaluation } from '../services/star-evaluation.service';
import { analyzeTechnicalSkills } from '../services/skill-intelligence.service';
import { detectKnowledgeGaps } from '../services/knowledge-gap.service';
import { analyzeConfidenceAndConsistency } from '../services/confidence-analysis.service';
import { generateFallbackHiringRecommendation } from '../services/hiring-recommendation.service';
import { generateFallbackLearningRoadmap } from '../services/learning-roadmap.service';
import { generateFallbackCandidateAnalytics } from '../services/candidate-analytics.service';

describe('Phase 5: AI Evaluation & Candidate Intelligence Engine', () => {
  describe('1. Prompt Loader & Markdown Templates', () => {
    it('should read markdown prompt metadata for answer-evaluation', () => {
      const meta = loadEvaluationPrompt('answer-evaluation');
      expect(meta.id).toBe('answer-evaluation');
      expect(meta.filename).toBe('answer-evaluation.md');
      expect(meta.objective).toContain('Evaluate a candidate');
      expect(meta.constraints.length).toBeGreaterThan(0);
    });

    it('should render system and user prompt with constraints and JSON inputs', () => {
      const rendered = renderEvaluationPrompt('answer-evaluation', {
        questionText: 'What is a deadlock?',
        candidateAnswer: 'When two processes wait on resources held by each other.',
      });
      expect(rendered.systemPrompt).toContain('Principal Interview Evaluation AI Engine');
      expect(rendered.userPrompt).toContain('What is a deadlock?');
    });
  });

  describe('2. Answer Evaluation Engine', () => {
    it('should evaluate candidate answer and return structured 8 scores', async () => {
      const evalResult = generateFallbackAnswerEvaluation({
        turnId: 't-1',
        turnIndex: 1,
        questionText: 'Explain race condition mitigation in TypeScript.',
        candidateAnswer:
          'In my previous project at ACME, I prevented race conditions by using optimistic state rollbacks and unique mutation locks in Redis. For example, when two concurrent writes occurred, the secondary write received a lock timeout.',
        roleTitle: 'Senior Full Stack Engineer',
        seniorityLevel: 'senior',
        track: 'technical',
        difficulty: 'medium',
      });

      expect(evalResult.turnId).toBe('t-1');
      expect(evalResult.scores.technicalAccuracy).toBeGreaterThanOrEqual(60);
      expect(evalResult.scores.examplesUsed).toBe(85);
      expect(evalResult.overallAnswerScore).toBeGreaterThan(70);
      expect(evalResult.strengths.length).toBeGreaterThan(0);
      expect(evalResult.improvedAnswerOutline).toContain('State high-level architecture');
    });
  });

  describe('3. Communication Intelligence', () => {
    it('should analyze filler words, verbosity, and readability grade', () => {
      const commMetrics = generateFallbackCommunicationMetrics({
        candidateTurnsText: [
          'Um, basically I think we should, like, use Redis for caching and, you know, handle state cleanly.',
          'Actually, literally the database connection pool was exhausted so we tuned PgBouncer.',
        ],
      });

      expect(commMetrics.grammarScore).toBeGreaterThan(50);
      expect(commMetrics.fillerWordMetrics.totalFillerCount).toBeGreaterThan(0);
      expect(commMetrics.fillerWordMetrics.frequentlyUsedFillers.length).toBeGreaterThan(0);
      expect(commMetrics.readabilityGrade).toContain('Grade 11');
    });
  });

  describe('4. STAR Framework Evaluation', () => {
    it('should evaluate Situation, Task, Action, Result for behavioural prompts', () => {
      const star = generateFallbackStarEvaluation({
        candidateAnswer:
          'When I was at TechCorp (Situation), my task was to resolve sprint delays (Task). I implemented automated CI/CD pipelines with parallelized Vitest suites (Action), which reduced deployment time by 45% and saved 10 hours per week (Result with 45% metric).',
        seniorityLevel: 'senior',
      });

      expect(star.overallStarScore).toBeGreaterThan(80);
      expect(star.situation.isMissing).toBe(false);
      expect(star.result.hasQuantifiableMetrics).toBe(true);
      expect(star.missingSections).toHaveLength(0);
    });
  });

  describe('5. Technical Skill Intelligence', () => {
    it('should extract programming languages, databases, cloud, and devops skills', () => {
      const skillGraph = analyzeTechnicalSkills([
        'I built a Next.js and React frontend with TypeScript, connected to PostgreSQL and Redis using Prisma.',
        'Deployed on AWS with Docker containers and GitHub Actions CI/CD.',
      ]);

      expect(skillGraph.topSkills).toContain('React');
      expect(skillGraph.topSkills).toContain('TypeScript');
      expect(skillGraph.categoryBreakdown.databases).toBeGreaterThan(0);
      expect(skillGraph.skills.length).toBeGreaterThan(4);
    });
  });

  describe('6. Knowledge Gap Detection', () => {
    it('should generate prioritized improvement list for weak scores', () => {
      const answerEvals = [
        generateFallbackAnswerEvaluation({
          turnId: 't-1',
          turnIndex: 1,
          questionText: 'Explain Distributed Caching',
          candidateAnswer: 'I use cache.',
          roleTitle: 'Senior Full Stack Engineer',
        }),
      ];

      const gaps = detectKnowledgeGaps(answerEvals, 'technical');
      expect(gaps.length).toBeGreaterThan(0);
      expect(gaps[0].severity).toBeDefined();
      expect(gaps[0].priorityOrder).toBe(1);
    });
  });

  describe('7. Confidence & Consistency Analysis', () => {
    it('should infer confidence from text without emotion claims', () => {
      const answerEvals = [
        generateFallbackAnswerEvaluation({
          turnId: 't-1',
          turnIndex: 1,
          questionText: 'System Design Question',
          candidateAnswer:
            'In my work at ACME, I designed the distributed event streaming pipeline using Kafka and PostgreSQL. We guaranteed exact-once processing by issuing unique idempotency keys for every event and storing state rollbacks in Redis.',
        }),
      ];

      const answerText =
        'In my work at ACME, I designed the distributed event streaming pipeline using Kafka and PostgreSQL. We guaranteed exact-once processing by issuing unique idempotency keys for every event and storing state rollbacks in Redis.';

      const confidence = analyzeConfidenceAndConsistency([answerText], answerEvals);

      expect(confidence.overallConfidenceScore).toBeGreaterThan(50);
      expect(confidence.disclaimerNote).toContain('text transcript');
    });
  });

  describe('8. Hiring Recommendation Engine', () => {
    it('should generate Strong Hire, Hire, Lean Hire, Lean Reject, or Reject with evidence', () => {
      const rec = generateFallbackHiringRecommendation({
        roleTitle: 'Senior Full Stack Engineer',
        overallScore: 88,
        technicalScore: 86,
        communicationScore: 90,
        behaviouralScore: 85,
        companyTier: 'tier_2',
      });

      expect(rec.recommendation).toBe('Strong Hire');
      expect(rec.evidenceJustification.technicalEvidence.length).toBeGreaterThan(0);
      expect(rec.executiveSummary).toContain('88/100');
    });
  });

  describe('9. Personalized Learning Roadmap', () => {
    it('should generate daily, weekly, monthly plans and recommended projects', () => {
      const roadmap = generateFallbackLearningRoadmap({
        roleTitle: 'Full Stack Engineer',
        weakConcepts: ['Distributed Caching'],
      });

      expect(roadmap.dailyPlan.length).toBe(7);
      expect(roadmap.weeklyRoadmap.length).toBe(4);
      expect(roadmap.monthlyRoadmap.length).toBe(3);
      expect(roadmap.recommendedProjects.length).toBeGreaterThan(0);
    });
  });

  describe('10. Analytics Dashboard', () => {
    it('should return aggregated candidate analytics summary', async () => {
      const summary = generateFallbackCandidateAnalytics();

      expect(summary.totalInterviewsCompleted).toBeGreaterThan(0);
      expect(summary.skillRadar.length).toBeGreaterThan(3);
      expect(summary.scoreTrends.length).toBeGreaterThan(1);
      expect(summary.hiringReadinessTrend.currentStatus).toBe('Hire');
    });
  });
});

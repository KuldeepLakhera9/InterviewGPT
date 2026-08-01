'use client';

import * as React from 'react';
import { ShieldCheck, Zap, AlertTriangle, Layers } from 'lucide-react';
import type { CandidateIntelligenceReportData } from '../types/evaluation.types';
import { HiringRecommendationBanner } from './hiring-recommendation-banner';
import { AnswerEvaluationCard } from './answer-evaluation-card';
import { CommunicationMetricsView } from './communication-metrics-view';
import { StarFrameworkCard } from './star-framework-card';
import { LearningRoadmapView } from './learning-roadmap-view';
import { PdfExportButton } from './pdf-export-button';

interface CandidateIntelligenceReportViewProps {
  report: CandidateIntelligenceReportData;
}

export function CandidateIntelligenceReportView({ report }: CandidateIntelligenceReportViewProps) {
  const [activeSection, setActiveSection] = React.useState<
    'summary' | 'answers' | 'communication' | 'star' | 'skills' | 'gaps' | 'roadmap'
  >('summary');

  return (
    <div id="candidate-intelligence-report-container" className="space-y-6">
      {/* Top Header Bar with PDF Export */}
      <div className="flex flex-col items-start justify-between space-y-3 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-md border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
              Module 9 Active
            </span>
            <h1 className="text-xl font-black tracking-tight text-[var(--text-primary)]">
              Recruiter-Grade Candidate Intelligence Report
            </h1>
          </div>
          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
            Multi-perspective AI scorecards, hiring recommendations, skill graph, and actionable
            coaching roadmap.
          </p>
        </div>

        <PdfExportButton reportTitle={`InterviewGPT_Candidate_Report_${report.sessionId}`} />
      </div>

      {/* Hiring Recommendation Banner */}
      <HiringRecommendationBanner
        recommendation={report.hiringRecommendation}
        executiveSummary={report.executiveSummary}
        evidence={{
          technicalEvidence: [
            `Technical depth score: ${report.technicalScore}/100 across interview turns.`,
            `Demonstrated top proficiency in ${report.skillGraph.topSkills.join(', ')}.`,
          ],
          communicationEvidence: [
            `Overall communication score: ${report.communicationScore}/100 with ${report.communicationMetrics.readabilityGrade}.`,
          ],
          culturalAndBehaviouralEvidence: [
            `STAR behavioral story rating: ${report.behaviouralScore}/100.`,
          ],
          concernsAndRisks: report.weaknesses,
        }}
        readinessRating={report.overallScore >= 80 ? 'ready_now' : 'ready_with_minor_coaching'}
        nextSteps={['Share report with hiring manager', 'Proceed to next round or practice loop']}
      />

      {/* 4 Pillar Scorecards Header */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 text-center">
          <span className="text-[10px] font-bold tracking-wider text-[var(--text-tertiary)] uppercase">
            Overall Score
          </span>
          <div className="mt-1 text-3xl font-black text-purple-400">{report.overallScore}</div>
          <span className="text-[10px] text-gray-400">Weighted Aggregate</span>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 text-center">
          <span className="text-[10px] font-bold tracking-wider text-[var(--text-tertiary)] uppercase">
            Technical Score
          </span>
          <div className="mt-1 text-3xl font-black text-blue-400">{report.technicalScore}</div>
          <span className="text-[10px] text-gray-400">Technical Depth & Accuracy</span>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 text-center">
          <span className="text-[10px] font-bold tracking-wider text-[var(--text-tertiary)] uppercase">
            Communication
          </span>
          <div className="mt-1 text-3xl font-black text-indigo-400">
            {report.communicationScore}
          </div>
          <span className="text-[10px] text-gray-400">Tone, Fillers & Clarity</span>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 text-center">
          <span className="text-[10px] font-bold tracking-wider text-[var(--text-tertiary)] uppercase">
            Behavioural (STAR)
          </span>
          <div className="mt-1 text-3xl font-black text-emerald-400">{report.behaviouralScore}</div>
          <span className="text-[10px] text-gray-400">STAR Structure & Metrics</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto border-b border-[var(--border-subtle)] pb-2 text-xs">
        {[
          { id: 'summary', label: 'Executive Summary & Strengths' },
          { id: 'answers', label: `Answer Scorecards (${report.answerEvaluations.length})` },
          { id: 'communication', label: 'Communication Intelligence' },
          { id: 'star', label: 'STAR Framework' },
          { id: 'skills', label: 'Skill Graph' },
          { id: 'gaps', label: `Knowledge Gaps (${report.knowledgeGaps.length})` },
          { id: 'roadmap', label: 'Learning Roadmap' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id as typeof activeSection)}
            className={`rounded-lg px-3 py-1.5 font-semibold whitespace-nowrap transition-all ${
              activeSection === tab.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section 1: Executive Summary & Strengths */}
      {activeSection === 'summary' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Top Strengths */}
            <div className="space-y-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Validated Key Strengths</span>
              </div>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                {report.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Areas for Growth */}
            <div className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                <span>Priority Improvement Opportunities</span>
              </div>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                {report.weaknesses.map((w, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Confidence & Consistency Card */}
          <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-primary)]">
                <Zap className="h-4 w-4 text-purple-400" />
                <span>Confidence & Linguistic Consistency Analysis</span>
              </div>
              <span className="rounded border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-xs font-bold text-purple-300">
                Confidence Index: {report.confidenceAnalysis.overallConfidenceScore} / 100
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded bg-[var(--bg-surface-2)] p-2">
                <span className="block text-[10px] text-[var(--text-tertiary)]">
                  Consistency Score
                </span>
                <span className="font-bold text-[var(--text-primary)]">
                  {report.confidenceAnalysis.consistencyScore}/100
                </span>
              </div>
              <div className="rounded bg-[var(--bg-surface-2)] p-2">
                <span className="block text-[10px] text-[var(--text-tertiary)]">
                  Explanation Quality
                </span>
                <span className="font-bold text-[var(--text-primary)]">
                  {report.confidenceAnalysis.explanationQualityScore}/100
                </span>
              </div>
              <div className="rounded bg-[var(--bg-surface-2)] p-2">
                <span className="block text-[10px] text-[var(--text-tertiary)]">
                  Decision Justification
                </span>
                <span className="font-bold text-[var(--text-primary)]">
                  {report.confidenceAnalysis.decisionJustificationScore}/100
                </span>
              </div>
            </div>

            <ul className="list-inside list-disc space-y-1 text-xs text-[var(--text-secondary)]">
              {report.confidenceAnalysis.keyObservations.map((obs, idx) => (
                <li key={idx}>{obs}</li>
              ))}
            </ul>

            <p className="border-t border-[var(--border-subtle)] pt-2 text-[10px] text-[var(--text-tertiary)] italic">
              {report.confidenceAnalysis.disclaimerNote}
            </p>
          </div>
        </div>
      )}

      {/* Section 2: Turn-by-Turn Answer Scorecards */}
      {activeSection === 'answers' && (
        <div className="space-y-4">
          {report.answerEvaluations.map((evalData) => (
            <AnswerEvaluationCard key={evalData.turnId} evaluation={evalData} />
          ))}
        </div>
      )}

      {/* Section 3: Communication Intelligence */}
      {activeSection === 'communication' && (
        <CommunicationMetricsView metrics={report.communicationMetrics} />
      )}

      {/* Section 4: STAR Framework Analysis */}
      {activeSection === 'star' && <StarFrameworkCard starData={report.starFramework} />}

      {/* Section 5: Technical Skill Graph */}
      {activeSection === 'skills' && (
        <div className="space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5">
          <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-primary)]">
            <Layers className="h-4 w-4 text-blue-400" />
            <span>Extracted Candidate Technical Skill Graph</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {report.skillGraph.skills.map((skill) => (
              <div
                key={skill.name}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)]">{skill.name}</span>
                  <span className="rounded border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-300 capitalize">
                    {skill.demonstratedDepth}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                  <span>Proficiency Rating:</span>
                  <span className="font-bold text-[var(--text-primary)]">
                    {skill.proficiencyScore} / 100
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-700/30">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${skill.proficiencyScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 6: Knowledge Gaps & Prioritized Improvement List */}
      {activeSection === 'gaps' && (
        <div className="space-y-3">
          {report.knowledgeGaps.map((gap) => (
            <div
              key={gap.concept}
              className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="rounded border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400 uppercase">
                    Priority #{gap.priorityOrder} • {gap.severity}
                  </span>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">{gap.concept}</h4>
                </div>
                <span className="text-[11px] text-[var(--text-tertiary)]">{gap.topic}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">{gap.observedDeficit}</p>
              <div className="rounded bg-[var(--bg-surface-2)] p-2 text-xs text-purple-300">
                <span className="font-semibold">Action Plan: </span>
                {gap.recommendation}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section 7: Learning Roadmap */}
      {activeSection === 'roadmap' && <LearningRoadmapView roadmap={report.learningRoadmap} />}
    </div>
  );
}

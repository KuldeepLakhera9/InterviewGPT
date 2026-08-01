'use client';

import * as React from 'react';
import { MessageSquare, Mic, Volume2, Sparkles } from 'lucide-react';
import type { CommunicationMetricsData } from '../types/evaluation.types';

interface CommunicationMetricsViewProps {
  metrics: CommunicationMetricsData;
}

export function CommunicationMetricsView({ metrics }: CommunicationMetricsViewProps) {
  return (
    <div id="communication-metrics-container" className="space-y-6">
      {/* Overview Banner */}
      <div className="flex flex-col items-start justify-between rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-purple-900/20 p-5 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">Communication Intelligence Overview</h3>
          </div>
          <p className="text-xs text-gray-300">
            Readability Level:{' '}
            <span className="font-semibold text-blue-300">{metrics.readabilityGrade}</span> •
            Average Verbosity:{' '}
            <span className="font-semibold text-purple-300">
              {metrics.responseLengthAnalysis.verbosityAssessment.replace('_', ' ')}
            </span>
          </p>
        </div>

        <div className="mt-3 flex items-center space-x-3 sm:mt-0">
          <div className="text-right">
            <span className="block text-[10px] font-semibold text-gray-400 uppercase">
              Communication Score
            </span>
            <span className="text-2xl font-black text-blue-400">
              {metrics.overallCommunicationScore} / 100
            </span>
          </div>
        </div>
      </div>

      {/* 6 Sub-Scores Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { title: 'Grammar', score: metrics.grammarScore },
          { title: 'Vocabulary', score: metrics.vocabularyScore },
          { title: 'Clarity', score: metrics.clarityScore },
          { title: 'Sentence Structure', score: metrics.sentenceStructureScore },
          { title: 'Conciseness', score: metrics.concisenessScore },
          { title: 'Professional Tone', score: metrics.professionalToneScore },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm"
          >
            <span className="text-xs font-semibold text-[var(--text-secondary)]">{item.title}</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-bold text-[var(--text-primary)]">{item.score}</span>
              <span className="text-[10px] text-gray-400">/ 100</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-700/30">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400"
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Filler Words & Response Length Analytics */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Filler Word Analysis */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5">
          <div className="flex items-center space-x-2">
            <Mic className="h-4 w-4 text-purple-400" />
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">
              Filler Word Detection
            </h4>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs text-[var(--text-secondary)]">
              <span>Total Filler Count:</span>
              <span className="font-bold text-[var(--text-primary)]">
                {metrics.fillerWordMetrics.totalFillerCount}
              </span>
            </div>
            <div className="flex justify-between text-xs text-[var(--text-secondary)]">
              <span>Filler Density:</span>
              <span className="font-bold text-[var(--text-primary)]">
                {metrics.fillerWordMetrics.fillerDensityPercentage}%
              </span>
            </div>

            <div className="mt-3 border-t border-[var(--border-subtle)] pt-2">
              <span className="text-[11px] font-semibold text-[var(--text-tertiary)]">
                Frequently Used Fillers:
              </span>
              {metrics.fillerWordMetrics.frequentlyUsedFillers.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {metrics.fillerWordMetrics.frequentlyUsedFillers.map((f) => (
                    <span
                      key={f.word}
                      className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-xs text-purple-300"
                    >
                      &quot;{f.word}&quot;: {f.count}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-xs text-emerald-400">
                  Zero excessive filler word patterns detected.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Response Length & Speed */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5">
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-indigo-400" />
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">
              Turn Length & Verbosity
            </h4>
          </div>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>Total Transcript Words:</span>
              <span className="font-bold text-[var(--text-primary)]">
                {metrics.responseLengthAnalysis.totalWords} words
              </span>
            </div>
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>Average Turn Length:</span>
              <span className="font-bold text-[var(--text-primary)]">
                {metrics.responseLengthAnalysis.averageWordsPerTurn} words
              </span>
            </div>
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>Verbosity Classification:</span>
              <span className="font-semibold text-indigo-300 capitalize">
                {metrics.responseLengthAnalysis.verbosityAssessment.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="mt-4 border-t border-[var(--border-subtle)] pt-2">
            <span className="text-[11px] font-semibold text-[var(--text-tertiary)]">
              Actionable Communication Tips:
            </span>
            <ul className="mt-1.5 space-y-1 text-xs text-[var(--text-secondary)]">
              {metrics.feedback.actionableTips.map((tip, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-purple-400" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

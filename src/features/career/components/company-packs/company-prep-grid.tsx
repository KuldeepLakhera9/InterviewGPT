'use client';

import * as React from 'react';
import { Building2, ChevronRight, Clock, X } from 'lucide-react';
import type { CompanyPrepPackData } from '../../types/career.types';
import { cn } from '@/lib/utils';

interface CompanyPrepGridProps {
  packs: CompanyPrepPackData[];
}

export function CompanyPrepGrid({ packs }: CompanyPrepGridProps) {
  const [selectedPack, setSelectedPack] = React.useState<CompanyPrepPackData | null>(null);

  return (
    <div
      id="company-prep-grid-container"
      className="space-y-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5 shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-blue-400" />
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Company-Specific Preparation Packs
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Curated preparation roadmaps, interview loops, and topic weights for top tech tier
              companies.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Company Cards */}
      <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3 lg:grid-cols-4">
        {packs.map((pack) => (
          <div
            key={pack.id}
            onClick={() => setSelectedPack(pack)}
            className="group cursor-pointer space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4 shadow-sm transition-all hover:border-blue-500/40 hover:bg-slate-800/80"
          >
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl text-base font-black text-white shadow-sm',
                  pack.badgeColor
                )}
              >
                {pack.logoInitial}
              </div>

              <span className="flex items-center space-x-1 text-[10px] font-bold text-gray-400">
                <Clock className="h-3 w-3 text-blue-400" />
                <span>{pack.preparationTimelineWeeks} wks</span>
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white transition-colors group-hover:text-blue-300">
                {pack.companyName}
              </h4>
              <p className="mt-1 line-clamp-2 text-[11px] text-gray-400">{pack.overview}</p>
            </div>

            <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-2 text-xs font-semibold text-blue-400">
              <span>View Prep Pack</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Selected Company Pack Modal */}
      {selectedPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl border border-blue-500/30 bg-[var(--bg-surface-1)] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedPack(null)}
              className="absolute top-4 right-4 rounded-lg bg-[var(--bg-surface-2)] p-2 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-xl text-xl font-black text-white shadow-md',
                  selectedPack.badgeColor
                )}
              >
                {selectedPack.logoInitial}
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  {selectedPack.companyName} Preparation Pack
                </h3>
                <p className="text-xs text-gray-300">{selectedPack.overview}</p>
              </div>
            </div>

            {/* Pattern & Topics Grid */}
            <div className="grid gap-4 pt-2 text-xs sm:grid-cols-2">
              <div className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4">
                <h4 className="font-bold text-blue-300">Interview Loop Pattern</h4>
                <ul className="list-inside list-disc space-y-1.5 text-gray-300">
                  {selectedPack.interviewPattern.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4">
                <h4 className="font-bold text-purple-300">Frequently Asked Topics</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedPack.frequentlyAskedTopics.map((topic, idx) => (
                    <span
                      key={idx}
                      className="rounded border border-purple-500/30 bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-200"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Questions & Projects */}
            <div className="space-y-2 pt-2 text-xs">
              <h4 className="font-bold text-emerald-300">Sample High-Probability Questions</h4>
              <ul className="list-inside list-disc space-y-1 rounded-lg border border-white/5 bg-black/40 p-3 text-gray-300">
                {selectedPack.practiceQuestions.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

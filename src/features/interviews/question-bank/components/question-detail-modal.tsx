'use client';

import * as React from 'react';
import {
  Clock,
  Sparkles,
  Building2,
  Briefcase,
  HelpCircle,
  Award,
  CheckCircle2,
  BookOpen,
  FileText,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { QuestionBankItemData } from '../types/question-bank.types';

interface QuestionDetailModalProps {
  question: QuestionBankItemData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuestionDetailModal({ question, isOpen, onClose }: QuestionDetailModalProps) {
  if (!question) return null;

  const durationMinutes = Math.round(question.expectedDurationSeconds / 60);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold tracking-wider text-blue-400 uppercase">
              {question.category.replace('_', ' ')}
            </span>
            <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-300 capitalize">
              {question.difficulty}
            </span>
            {question.isAiGenerated && (
              <span className="inline-flex items-center space-x-1 rounded-full border border-indigo-500/30 bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
                <Sparkles className="h-3 w-3 text-indigo-400" />
                <span>AI Generated</span>
              </span>
            )}
          </div>

          <DialogTitle className="pt-1 text-xl font-bold tracking-tight text-[var(--text-primary)]">
            {question.title}
          </DialogTitle>
          <DialogDescription className="flex items-center space-x-3 text-xs text-[var(--text-secondary)]">
            <span>
              Topic: <strong className="text-[var(--text-primary)]">{question.topic}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-cyan-400">
              <Clock className="h-3.5 w-3.5" />
              <span>Expected Duration: {durationMinutes} mins</span>
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-3">
          {/* Question Text Box */}
          <div className="space-y-2 rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
            <h4 className="flex items-center space-x-1.5 text-xs font-bold tracking-wider text-blue-400 uppercase">
              <FileText className="h-4 w-4" />
              <span>Question Prompt</span>
            </h4>
            <p className="text-sm leading-relaxed font-medium whitespace-pre-line text-[var(--text-primary)]">
              {question.questionText}
            </p>
          </div>

          {/* Tags Section */}
          <div className="grid gap-3 sm:grid-cols-2">
            {question.companyTags.length > 0 && (
              <div className="space-y-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3">
                <span className="flex items-center space-x-1 text-xs font-semibold text-[var(--text-secondary)]">
                  <Building2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>Target Company Tags</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {question.companyTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {question.roleTags.length > 0 && (
              <div className="space-y-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3">
                <span className="flex items-center space-x-1 text-xs font-semibold text-[var(--text-secondary)]">
                  <Briefcase className="h-3.5 w-3.5 text-blue-400" />
                  <span>Target Role Tags</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {question.roleTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ideal Answer Rubric Outline */}
          <div className="space-y-2">
            <h4 className="flex items-center space-x-1.5 text-xs font-bold tracking-wider text-purple-400 uppercase">
              <BookOpen className="h-4 w-4" />
              <span>Evaluation Rubric & Ideal Answer Outline</span>
            </h4>
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4 text-xs leading-relaxed whitespace-pre-line text-[var(--text-primary)]">
              {question.evaluationMetadata.idealAnswerOutline}
            </div>
          </div>

          {/* Key Concepts & Trade-offs Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Key Concepts */}
            <div className="space-y-2">
              <h4 className="flex items-center space-x-1.5 text-xs font-bold tracking-wider text-emerald-400 uppercase">
                <CheckCircle2 className="h-4 w-4" />
                <span>Required Key Concepts</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {question.evaluationMetadata.keyConcepts.map((concept) => (
                  <span
                    key={concept}
                    className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            {/* Trade-off Points */}
            {question.evaluationMetadata.tradeOffPoints.length > 0 && (
              <div className="space-y-2">
                <h4 className="flex items-center space-x-1.5 text-xs font-bold tracking-wider text-amber-400 uppercase">
                  <Zap className="h-4 w-4" />
                  <span>Architecture Trade-offs</span>
                </h4>
                <ul className="list-inside list-disc space-y-1 text-xs text-[var(--text-secondary)]">
                  {question.evaluationMetadata.tradeOffPoints.map((tradeoff, i) => (
                    <li key={i}>{tradeoff}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Scoring Criteria */}
          {question.evaluationMetadata.scoringCriteria.length > 0 && (
            <div className="space-y-2">
              <h4 className="flex items-center space-x-1.5 text-xs font-bold tracking-wider text-blue-400 uppercase">
                <Award className="h-4 w-4" />
                <span>Pillar Scoring Weights</span>
              </h4>
              <div className="grid gap-2 sm:grid-cols-3">
                {question.evaluationMetadata.scoringCriteria.map((sc, i) => (
                  <div
                    key={i}
                    className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-[var(--text-primary)]">
                      <span className="capitalize">{sc.pillar.replace('_', ' ')}</span>
                      <span className="text-blue-400">{Math.round(sc.weight * 100)}%</span>
                    </div>
                    <p className="text-[11px] leading-snug text-[var(--text-secondary)]">
                      {sc.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up References */}
          {question.followUpReferences.length > 0 && (
            <div className="space-y-3">
              <h4 className="flex items-center space-x-1.5 text-xs font-bold tracking-wider text-indigo-400 uppercase">
                <HelpCircle className="h-4 w-4" />
                <span>Follow-up Probing References ({question.followUpReferences.length})</span>
              </h4>

              <div className="space-y-2">
                {question.followUpReferences.map((fu, idx) => (
                  <div
                    key={fu.id || idx}
                    className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-indigo-300">Follow-up #{idx + 1}</span>
                      <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 capitalize">
                        Depth: {fu.targetDepth}
                      </span>
                    </div>
                    <p className="font-medium text-[var(--text-primary)]">{fu.promptText}</p>
                    {fu.hint && (
                      <p className="text-[11px] text-[var(--text-secondary)] italic">
                        Hint: {fu.hint}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sample Responses if present */}
          {question.evaluationMetadata.sampleGoodResponse && (
            <div className="space-y-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs">
              <span className="flex items-center space-x-1 font-bold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Sample High-Performing Candidate Response</span>
              </span>
              <p className="leading-relaxed text-[var(--text-primary)] italic">
                &quot;{question.evaluationMetadata.sampleGoodResponse}&quot;
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-[var(--border-subtle)] pt-3">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Close Inspector
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

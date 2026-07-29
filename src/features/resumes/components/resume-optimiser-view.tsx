'use client';

import * as React from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  FileText,
  History,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import type { ResumeOptimisationRecord } from '../types/resume.types';

interface ResumeOptimiserViewProps {
  optimisation: ResumeOptimisationRecord | null;
  history: ResumeOptimisationRecord[];
  isLoading: boolean;
  onRunOptimiser: () => Promise<void>;
  onSelectHistoryItem?: (item: ResumeOptimisationRecord) => void;
}

export function ResumeOptimiserView({
  optimisation,
  history,
  isLoading,
  onRunOptimiser,
  onSelectHistoryItem,
}: ResumeOptimiserViewProps) {
  const { toast } = useToast();
  const [isOptimising, setIsOptimising] = React.useState(false);

  const handleOptimiseClick = async () => {
    setIsOptimising(true);
    try {
      await onRunOptimiser();
    } finally {
      setIsOptimising(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `Copied ${label} to clipboard.`,
    });
  };

  const exportOptimisedFile = (format: 'txt' | 'md') => {
    if (!optimisation || !optimisation.optimisedTextContent) return;

    const content = optimisation.optimisedTextContent;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimised_resume.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Resume Exported!',
      description: `Downloaded file as optimised_resume.${format}`,
    });
  };

  if (isLoading) {
    return (
      <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
        <CardContent className="space-y-3 p-12 text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-xs font-medium text-[var(--text-secondary)]">
            Enhancing summaries, rewriting bullet points & suggesting power verbs...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!optimisation) {
    return (
      <Card className="border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-[var(--bg-surface-1)] to-[var(--bg-surface-1)]">
        <CardContent className="space-y-4 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <Zap className="h-7 w-7" />
          </div>
          <div className="mx-auto max-w-md space-y-2">
            <h3 className="text-base font-bold text-[var(--text-primary)]">AI Resume Optimiser</h3>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              Transform passive work bullets into power achievements, elevate your summary
              narrative, and export polished content without overwriting original files.
            </p>
          </div>
          <Button
            type="button"
            size="lg"
            onClick={handleOptimiseClick}
            disabled={isOptimising}
            className="space-x-2 bg-emerald-600 px-6 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-500"
          >
            <Sparkles className={`h-4 w-4 ${isOptimising ? 'animate-spin' : ''}`} />
            <span>{isOptimising ? 'Optimising Content...' : 'Run Resume Optimiser'}</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar: Actions & Export */}
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                AI Optimised Resume Iteration
              </h3>
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-400"
              >
                Preserved Original File
              </Badge>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Optimised on {new Date(optimisation.createdAt).toLocaleDateString()} at{' '}
              {new Date(optimisation.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOptimiseClick}
            disabled={isOptimising}
            className="space-x-1.5 text-xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-emerald-400 ${isOptimising ? 'animate-spin' : ''}`}
            />
            <span>Re-optimise</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => exportOptimisedFile('txt')}
            className="space-x-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-500"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Text (.txt)</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              copyToClipboard(optimisation.optimisedTextContent, 'Full Optimised Resume')
            }
            className="space-x-1 text-xs"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copy All</span>
          </Button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Summary Enhancer & Stronger Action Verbs */}
        <div className="space-y-6 lg:col-span-5">
          {/* Summary Enhancer */}
          <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm font-bold text-[var(--text-primary)]">
                <span className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span>Enhanced Professional Summary</span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(optimisation.optimisedSummary, 'Optimised Summary')
                  }
                  className="h-6 px-1.5 text-[10px]"
                >
                  <Copy className="mr-1 h-3 w-3" /> Copy
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3">
                <span className="block text-[10px] font-bold text-zinc-400 uppercase">
                  Original Summary
                </span>
                <p className="text-[var(--text-secondary)] italic">
                  {optimisation.originalSummary}
                </p>
              </div>

              <div className="space-y-1 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                <span className="flex items-center text-[10px] font-bold text-emerald-400">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Optimised Narrative
                </span>
                <p className="leading-relaxed font-medium text-[var(--text-primary)]">
                  {optimisation.optimisedSummary}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stronger Action Verbs Suggestions */}
          <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
                <Zap className="h-4 w-4 text-amber-400" />
                <span>Stronger Action Verb Upgrades</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {optimisation.strongerActionVerbs.map((item, i) => (
                <div
                  key={i}
                  className="space-y-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-2.5"
                >
                  <div className="flex items-center space-x-2 text-[11px]">
                    <span className="font-semibold text-rose-400 line-through">
                      &quot;{item.weakVerb}&quot;
                    </span>
                    <ArrowRight className="h-3 w-3 text-zinc-500" />
                    <span className="font-bold text-emerald-400">Power Verbs</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.suggestedVerbs.map((verb, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-300"
                      >
                        {verb}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Optimisation History */}
          {history.length > 1 && (
            <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
                  <History className="h-4 w-4 text-blue-400" />
                  <span>Optimisation History ({history.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {history.map((h, i) => (
                  <div
                    key={h.id}
                    onClick={() => onSelectHistoryItem && onSelectHistoryItem(h)}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-2 text-xs ${
                      h.id === optimisation.id
                        ? 'border-emerald-500/40 bg-emerald-500/10 font-bold text-emerald-300'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface-2)] hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Iteration #{history.length - i}</span>
                    </div>
                    <span className="text-[10px] text-[var(--text-secondary)]">
                      {new Date(h.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Rewritten Bullet Points & Measurable Impact */}
        <div className="space-y-6 lg:col-span-7">
          {/* Rewritten Bullet Points */}
          <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm font-bold text-[var(--text-primary)]">
                <span className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-400" />
                  <span>Rewritten Work Experience Bullet Points</span>
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {optimisation.optimisedBullets.length} Bullets Rewritten
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {optimisation.optimisedBullets.map((bullet, i) => (
                <div
                  key={i}
                  className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="border-blue-500/30 bg-blue-500/10 text-[10px] text-blue-400"
                    >
                      Verb: {bullet.actionVerb}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/10 text-[10px] font-bold text-emerald-400"
                    >
                      {bullet.impactGain}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-zinc-500 uppercase">
                      Original Passive Bullet
                    </span>
                    <p className="text-[var(--text-secondary)] line-through opacity-80">
                      {bullet.original}
                    </p>
                  </div>

                  <div className="space-y-1 border-t border-[var(--border-subtle)] pt-1">
                    <span className="flex items-center text-[10px] font-bold text-emerald-400">
                      <Check className="mr-1 h-3 w-3" /> Rewritten Power Bullet
                    </span>
                    <p className="leading-relaxed font-semibold text-[var(--text-primary)]">
                      {bullet.rewritten}
                    </p>
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(bullet.rewritten, `Bullet #${i + 1}`)}
                      className="h-6 text-[10px] text-blue-400 hover:text-blue-300"
                    >
                      <Copy className="mr-1 h-3 w-3" /> Copy Bullet
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Measurable Impact Suggestions */}
          <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm font-bold text-[var(--text-primary)]">
                <Lightbulb className="h-4 w-4 text-purple-400" />
                <span>Measurable Metric Enhancements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {optimisation.measurableImpactItems.map((item, i) => (
                <div
                  key={i}
                  className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3"
                >
                  <span className="font-bold text-[var(--text-primary)]">{item.bullet}</span>
                  <p className="text-[11px] text-purple-300">{item.metricSuggestion}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Mic, Plus, Sparkles, Play, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getInterviewWizardStateAction,
  getInterviewHistoryAction,
  InterviewHistoryDashboard,
  SYSTEM_DEFAULT_PRESETS,
} from '@/features/interviews';

export const metadata: Metadata = {
  title: 'Mock Interviews | InterviewGPT',
  description: 'AI-Powered dynamic mock interview setup hub, session manager, and history.',
};

export default async function MockInterviewsHubPage() {
  const wizardState = await getInterviewWizardStateAction();
  const historyResult = await getInterviewHistoryAction({ page: 1, limit: 9 });
  const initialHistory = historyResult.data || {
    items: [],
    total: 0,
    page: 1,
    totalPages: 1,
    stats: {
      totalSessions: 0,
      inProgressSessions: 0,
      completedSessions: 0,
      archivedSessions: 0,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/50 via-indigo-950/40 to-slate-900/60 p-6 shadow-md backdrop-blur-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
              <Mic className="h-3.5 w-3.5" />
              <span>Interactive Mock Simulator</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Mock Interview Launcher
            </h1>
            <p className="max-w-xl text-xs text-slate-300">
              Customize real-time technical algorithms, distributed system design, and STAR
              behavioral interviews with session state control and long-running history tracking.
            </p>
          </div>

          <div className="flex shrink-0 items-center space-x-3">
            <Button
              asChild
              size="lg"
              className="space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-lg hover:from-blue-500 hover:to-indigo-500 sm:text-sm"
            >
              <Link href="/interviews/setup">
                <Plus className="h-4 w-4" />
                <span>Configure New Interview</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Active Draft Banner */}
      {wizardState.data && wizardState.completionPercentage > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Active Configuration Draft Found</span>
            </span>
            <p className="text-xs text-[var(--text-primary)]">
              Draft Progress:{' '}
              <span className="font-semibold">{wizardState.completionPercentage}%</span> — Role:{' '}
              <span className="font-semibold">{wizardState.data.roleTitle}</span> (
              {wizardState.data.track})
            </p>
          </div>

          <Button
            asChild
            size="sm"
            className="shrink-0 space-x-1.5 bg-amber-600 text-xs font-medium text-white hover:bg-amber-500"
          >
            <Link href="/interviews/setup">
              <span>Resume Setup</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      )}

      {/* Quick Launch Presets Gallery */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              Quick-Start Recommended Presets
            </h2>
          </div>
          <Link
            href="/interviews/setup"
            className="flex items-center space-x-1 text-xs font-medium text-blue-400 hover:underline"
          >
            <span>Custom Wizard</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SYSTEM_DEFAULT_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="group relative flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm transition-all hover:border-blue-500/60 hover:bg-[var(--bg-surface-hover)]"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                    Preset
                  </span>
                  <span className="text-[10px] font-medium text-purple-400">
                    {preset.config.durationMinutes}m
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-blue-400">
                  {preset.name}
                </h3>

                <p className="line-clamp-2 text-xs text-[var(--text-secondary)]">
                  {preset.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
                <span className="text-[10px] font-medium text-[var(--text-secondary)] capitalize">
                  {preset.config.difficulty}
                </span>

                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="space-x-1 border-blue-500/30 text-xs hover:border-blue-500 hover:bg-blue-500/10"
                >
                  <Link href="/interviews/setup">
                    <Play className="h-3 w-3 fill-current text-blue-400" />
                    <span>Launch</span>
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session History Dashboard Section */}
      <InterviewHistoryDashboard initialData={initialHistory} />
    </div>
  );
}

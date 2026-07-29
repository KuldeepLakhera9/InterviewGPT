import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Overview | InterviewGPT',
};

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Candidate Dashboard</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Welcome back, Alex. Here is your interview readiness snapshot.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--text-secondary)] uppercase">
              Average Readiness Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-[var(--accent-primary)]">84.5 / 100</div>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">+4.2% from last week</p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--text-secondary)] uppercase">
              Completed Mock Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">12</div>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">Technical & STAR HR sessions</p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-[var(--text-secondary)] uppercase">
              Target JD Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-[var(--status-success)]">91%</div>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">
              Senior Full-Stack Role Alignment
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

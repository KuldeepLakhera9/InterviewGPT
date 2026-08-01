import type { Metadata } from 'next';
import { getCandidateAnalyticsSummary } from '@/features/evaluation';
import { AnalyticsDashboard } from '@/features/evaluation';

export const metadata: Metadata = {
  title: 'Candidate Analytics & Intelligence Dashboard | InterviewGPT',
  description:
    'Aggregated Skill Radar, Score Trajectory Trends, Topic Mastery, and Hiring Readiness',
};

export default async function AnalyticsPage() {
  const summary = await getCandidateAnalyticsSummary();

  return (
    <div className="container mx-auto max-w-7xl space-y-6 py-6">
      <AnalyticsDashboard initialSummary={summary} />
    </div>
  );
}

import type { Metadata } from 'next';
import {
  GoalWidget,
  KpiGrid,
  ProgressCards,
  QuickActions,
  ReadinessChart,
  RecentActivity,
  UpcomingPractice,
  WelcomeSection,
} from '@/features/dashboard';

export const metadata: Metadata = {
  title: 'Overview | InterviewGPT',
  description: 'AI-Powered interview preparation candidate dashboard.',
};

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <WelcomeSection />

      <QuickActions />

      <KpiGrid />

      <div className="grid gap-6 md:grid-cols-2">
        <ReadinessChart />
        <ProgressCards />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <GoalWidget />
          <UpcomingPractice />
        </div>
      </div>
    </div>
  );
}

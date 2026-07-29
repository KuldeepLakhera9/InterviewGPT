import type { Metadata } from 'next';
import { DashboardHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Dashboard | InterviewGPT',
  description: 'InterviewGPT candidate practice workspace and analytics dashboard.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--bg-app)]">
      {/* Desktop sidebar offset */}
      <div className="flex flex-1 flex-col lg:pl-60">
        <DashboardHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

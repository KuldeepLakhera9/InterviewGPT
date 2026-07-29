import type { Metadata } from 'next';
import { LandingFooter, LandingHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'InterviewGPT — AI Technical & HR Mock Interview Preparation Platform',
  description:
    'Master technical coding, system design, and STAR behavioral interviews with real-time AI feedback and personalized career roadmaps.',
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-app)]">
      <LandingHeader />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </div>
  );
}

import type { Metadata } from 'next';
import { SettingsNav } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Settings | InterviewGPT',
  description: 'Manage your profile, authentication, workspace, and notifications.',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Account Settings</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Manage your candidate profile, workspace configuration, and preferences
        </p>
      </div>

      <SettingsNav />

      <div className="pt-2">{children}</div>
    </div>
  );
}

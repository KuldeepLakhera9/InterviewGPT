import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Profile Settings | InterviewGPT',
};

export default function SettingsProfilePage() {
  return (
    <Card className="max-w-2xl border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Candidate Profile</CardTitle>
        <CardDescription className="text-xs text-[var(--text-secondary)]">
          Update your public profile details used during mock interview simulations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--text-secondary)]">Full Name</label>
          <Input defaultValue="Alex Chen" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--text-secondary)]">Headline</label>
          <Input defaultValue="Senior Full-Stack Software Engineer" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--text-secondary)]">Email Address</label>
          <Input defaultValue="admin@interviewgpt.com" disabled />
        </div>
        <Button size="sm">Save Changes</Button>
      </CardContent>
    </Card>
  );
}

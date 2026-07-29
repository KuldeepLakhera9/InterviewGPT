import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ResetPasswordForm } from '@/features/auth';
import { Spinner } from '@/components/ui/spinner';

export const metadata: Metadata = {
  title: 'Reset Password | InterviewGPT',
  description: 'Enter a new password for your InterviewGPT account.',
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Spinner size="lg" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

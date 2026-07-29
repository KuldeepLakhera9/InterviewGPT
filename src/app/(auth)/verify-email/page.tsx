import type { Metadata } from 'next';
import { VerifyEmailForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Verify Email | InterviewGPT',
  description: 'Verify your email address to complete your InterviewGPT registration.',
};

export default function VerifyEmailPage() {
  return <VerifyEmailForm />;
}

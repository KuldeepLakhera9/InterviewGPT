import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Forgot Password | InterviewGPT',
  description: 'Request a password reset link for your InterviewGPT account.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

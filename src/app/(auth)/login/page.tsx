import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Sign In | InterviewGPT',
  description: 'Sign in to access your AI interview preparation workspace.',
};

export default function LoginPage() {
  return <LoginForm />;
}

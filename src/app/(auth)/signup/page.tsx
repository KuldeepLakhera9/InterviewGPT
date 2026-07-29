import type { Metadata } from 'next';
import { SignupForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Sign Up | InterviewGPT',
  description: 'Create an account to master technical and HR interviews with AI.',
};

export default function SignupPage() {
  return <SignupForm />;
}

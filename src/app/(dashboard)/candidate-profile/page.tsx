import type { Metadata } from 'next';
import { getCandidateProfileAction } from '@/features/candidate-profile/actions/candidate-profile.actions';
import { CandidateProfileWizard } from '@/features/candidate-profile/components/candidate-profile-wizard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Candidate Profile Wizard | InterviewGPT',
  description: 'Build your multi-step candidate profile to personalize AI mock interview sessions.',
};

export default async function CandidateProfilePage() {
  const initialState = await getCandidateProfileAction();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <CandidateProfileWizard initialState={initialState} />
    </div>
  );
}

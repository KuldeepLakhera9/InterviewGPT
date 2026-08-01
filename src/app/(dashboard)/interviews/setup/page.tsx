import type { Metadata } from 'next';
import { getInterviewWizardStateAction, InterviewWizard } from '@/features/interviews';

export const metadata: Metadata = {
  title: 'Interview Setup Wizard | InterviewGPT',
  description: 'Configure your custom mock interview parameters, track, difficulty, and duration.',
};

export default async function InterviewSetupPage() {
  const wizardState = await getInterviewWizardStateAction();

  return (
    <div className="container mx-auto max-w-6xl py-6">
      <InterviewWizard initialState={wizardState} />
    </div>
  );
}

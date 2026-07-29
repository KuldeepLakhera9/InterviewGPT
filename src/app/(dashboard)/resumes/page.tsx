import type { Metadata } from 'next';
import { getResumesAction } from '@/features/resumes/actions/resume.actions';
import { ResumeManagementDashboard } from '@/features/resumes/components/resume-management-dashboard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Resume Manager | InterviewGPT',
  description: 'Upload, manage, version, and preview candidate resumes for AI mock interviews.',
};

export default async function ResumesPage() {
  const { resumes } = await getResumesAction();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <ResumeManagementDashboard initialResumes={resumes} />
    </div>
  );
}

import type { Metadata } from 'next';
import { getQuestionsAction, QuestionBankDashboard } from '@/features/interviews';

export const metadata: Metadata = {
  title: 'Question Bank | InterviewGPT',
  description:
    'Explore structured interview questions, evaluation rubrics, and trade-off matrices.',
};

export default async function QuestionBankPage() {
  const result = await getQuestionsAction({ page: 1, limit: 20 });
  const initialData = result.data || {
    items: [],
    total: 0,
    page: 1,
    totalPages: 1,
    availableCategories: [],
    availableTopics: [],
    availableCompanyTags: [],
    availableRoleTags: [],
  };

  return (
    <div className="container mx-auto max-w-7xl py-6">
      <QuestionBankDashboard initialData={initialData} />
    </div>
  );
}

import { ThemeToggle } from '@/components/common/theme-toggle';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <h1 className="text-4xl font-bold tracking-tight">InterviewGPT</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        AI-Powered Technical & HR Interview Preparation Platform
      </p>
    </main>
  );
}

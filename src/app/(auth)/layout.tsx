import type { Metadata } from 'next';
import Link from 'next/link';
import { ThemeToggle } from '@/components/common/theme-toggle';

export const metadata: Metadata = {
  title: 'Authentication',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[var(--bg-app)] p-4">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <header className="mb-6 flex flex-col items-center">
        <Link href="/" className="flex items-center space-x-2 text-2xl font-bold tracking-tight">
          <span>InterviewGPT</span>
        </Link>
      </header>

      <main className="flex w-full justify-center">{children}</main>
    </div>
  );
}

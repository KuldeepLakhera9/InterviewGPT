import Link from 'next/link';
import { FileQuestion, Home, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-app)] p-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-surface-2)] text-[var(--text-secondary)]">
        <FileQuestion className="h-8 w-8" />
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">404</h1>
      <h2 className="mt-2 text-xl font-bold tracking-tight text-[var(--text-primary)]">
        Page Not Found
      </h2>
      <p className="mt-2 max-w-sm text-xs leading-relaxed text-[var(--text-secondary)]">
        The page you are looking for does not exist, has been removed, or is temporarily
        unavailable.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button size="sm" asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}

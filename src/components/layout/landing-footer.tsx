import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-bold tracking-tight">InterviewGPT</h3>
            <p className="max-w-xs text-xs leading-relaxed text-[var(--text-secondary)]">
              AI-powered technical and behavioral interview preparation platform for software
              engineers and technology leaders.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-wider text-[var(--text-primary)] uppercase">
              Product
            </h4>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li>
                <Link href="#features" className="hover:text-[var(--text-primary)]">
                  Resume Intelligence
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-[var(--text-primary)]">
                  Mock Interview Engine
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-[var(--text-primary)]">
                  Scorecard Telemetry
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-[var(--text-primary)]">
                  Career Skill Tree
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-wider text-[var(--text-primary)] uppercase">
              Resources
            </h4>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li>
                <Link href="/docs" className="hover:text-[var(--text-primary)]">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-[var(--text-primary)]">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-[var(--text-primary)]">
                  System Status
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-wider text-[var(--text-primary)] uppercase">
              Legal & Safety
            </h4>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li>
                <Link href="/privacy" className="hover:text-[var(--text-primary)]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[var(--text-primary)]">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-[var(--text-primary)]">
                  Security (SOC 2)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-t border-[var(--border-subtle)] pt-6 text-xs text-[var(--text-tertiary)] sm:flex-row">
          <p>© {new Date().getFullYear()} InterviewGPT, Inc. All rights reserved.</p>
          <div className="mt-2 flex space-x-4 sm:mt-0">
            <Link href="https://github.com" className="hover:text-[var(--text-primary)]">
              GitHub
            </Link>
            <Link href="https://twitter.com" className="hover:text-[var(--text-primary)]">
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

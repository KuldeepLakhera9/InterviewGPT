import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
      <Badge variant="secondary" className="mb-4 text-xs font-semibold">
        AI-Powered Interview Intelligence Engine
      </Badge>
      <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-6xl">
        Ace Your Technical & HR Interviews with Real-Time AI Feedback
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
        Upload your resume, paste your target job description, and practice realistic system design,
        coding, and behavioral STAR interviews with instant telemetry.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button size="lg" asChild>
          <Link href="/signup">Start Free Practice</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/docs">Explore Documentation</Link>
        </Button>
      </div>

      <div
        id="features"
        className="mt-24 grid w-full max-w-6xl grid-cols-1 gap-6 text-left sm:grid-cols-3"
      >
        <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Resume & JD Intelligence</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[var(--text-secondary)]">
            Deep entity extraction parsing skills, work history, and generating target job
            description match alignment indices.
          </CardContent>
        </Card>

        <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Interactive Voice & Code Sandbox</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[var(--text-secondary)]">
            Low-latency audio turn-taking with live WPM telemetry and embedded Monaco IDE code
            execution.
          </CardContent>
        </Card>

        <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Scorecard & Career Tree</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[var(--text-secondary)]">
            Instant 4-pillar evaluation reports with verbatim transcripts and dynamic skill gap
            roadmaps.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

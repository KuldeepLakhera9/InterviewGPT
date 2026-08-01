import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { SessionRoomTabs } from '@/features/interviews/session-room-tabs';

interface SessionDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Interview Room & Transcript Inspector | InterviewGPT',
  description: 'Interactive AI Interview Conversation Room, Transcript Inspector & Replay',
};

export default async function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { id } = await params;

  let session = null;
  try {
    session = await prisma.interviewSession.findUnique({
      where: { id },
    });
  } catch {
    session = null;
  }

  const effectiveSessionId = session?.id || id;

  return (
    <div className="container mx-auto max-w-7xl space-y-6 py-6">
      {/* Top Nav Back Link */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="space-x-1.5 text-xs">
          <Link href="/interviews">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Interviews Hub</span>
          </Link>
        </Button>

        <span className="inline-flex items-center space-x-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span>Ticket 6: Transcript System & Session Replay Active</span>
        </span>
      </div>

      {/* Interactive Session Room Tabs */}
      <SessionRoomTabs sessionId={effectiveSessionId} />
    </div>
  );
}

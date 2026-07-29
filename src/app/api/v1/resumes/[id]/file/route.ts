import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { resumeService } from '@/features/resumes/services/resume.service';

const AUTH_COOKIE_NAME = 'interview_gpt_session';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: resumeId } = await params;
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    let user = null;
    if (sessionCookie) {
      const parts = sessionCookie.split('_');
      const email = parts.slice(2).join('_');
      if (email) {
        user = await prisma.user.findUnique({ where: { email } });
      }
    }

    if (!user) {
      user = await prisma.user.findFirst({ where: { deletedAt: null } });
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fileData = await resumeService.getResumeFileBuffer(user.id, resumeId);
    const searchParams = request.nextUrl.searchParams;
    const isDownload = searchParams.get('download') === 'true';

    const disposition = isDownload ? 'attachment' : 'inline';

    return new NextResponse(new Uint8Array(fileData.buffer), {
      status: 200,
      headers: {
        'Content-Type': fileData.mimeType,
        'Content-Disposition': `${disposition}; filename="${encodeURIComponent(fileData.fileName)}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Failed to serve resume file:', error);
    return NextResponse.json({ error: 'File not found or access denied.' }, { status: 404 });
  }
}

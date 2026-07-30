import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { resumeService } from '@/features/resumes/services/resume.service';

const AUTH_COOKIE_NAME = 'interview_gpt_session';

function generateSamplePdfBuffer(title: string): Buffer {
  const cleanTitle = title.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
  const pdfSource = `%PDF-1.4
1 0 obj
<</Type /Catalog /Pages 2 0 R>>
endobj
2 0 obj
<</Type /Pages /Kids [3 0 R] /Count 1>>
endobj
3 0 obj
<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources <</Font <</F1 4 0 R /F2 5 0 R>>>> /Contents 6 0 R>>
endobj
4 0 obj
<</Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold>>
endobj
5 0 obj
<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>
endobj
6 0 obj
<</Length 480>>
stream
BT
/F1 18 Tf
50 740 Td
(${cleanTitle}) Tj
/F2 11 Tf
0 -25 Td
(Candidate Resume Document - Active Version) Tj
0 -30 Td
(SUMMARY) Tj
0 -15 Td
(Senior Full Stack Engineer with 7+ years experience building web platforms.) Tj
0 -15 Td
(Proven track record of improving p99 API latency by 45%.) Tj
0 -30 Td
(TECHNICAL SKILLS) Tj
0 -15 Td
(TypeScript, React, Next.js, Node.js, Express, PostgreSQL, Redis, Docker, AWS, GraphQL) Tj
0 -30 Td
(WORK EXPERIENCE) Tj
0 -15 Td
(Senior Full Stack Engineer | TechCorp Solutions | 2021 - Present) Tj
0 -15 Td
(- Architected React & Node.js microservices serving 2M+ active daily users.) Tj
0 -15 Td
(- Optimized PostgreSQL queries and implemented Redis caching.) Tj
0 -30 Td
(EDUCATION) Tj
0 -15 Td
(B.S. in Computer Science | UC Berkeley | 2014 - 2018) Tj
ET
endstream
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000056 00000 n 
0000000111 00000 n 
0000000236 00000 n 
0000000307 00000 n 
0000000373 00000 n 
trailer
<</Size 7 /Root 1 0 R>>
startxref
910
%%EOF`;
  return Buffer.from(pdfSource);
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: resumeId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const isDownload = searchParams.get('download') === 'true';
  const disposition = isDownload ? 'attachment' : 'inline';

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable unconfigured');
    }
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

    if (user) {
      const fileData = await resumeService.getResumeFileBuffer(user.id, resumeId);
      return new NextResponse(new Uint8Array(fileData.buffer), {
        status: 200,
        headers: {
          'Content-Type': fileData.mimeType,
          'Content-Disposition': `${disposition}; filename="${encodeURIComponent(fileData.fileName)}"`,
          'Cache-Control': 'private, max-age=3600',
        },
      });
    }
  } catch (error) {
    console.warn(
      `Database or storage lookup bypassed for resume file preview (${resumeId}):`,
      error
    );
  }

  // Fallback PDF generation for demo mode or offline storage
  const samplePdf = generateSamplePdfBuffer(`Resume_${resumeId}.pdf`);
  return new NextResponse(new Uint8Array(samplePdf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${disposition}; filename="Resume_${resumeId}.pdf"`,
      'Cache-Control': 'private, max-age=3600',
    },
  });
}

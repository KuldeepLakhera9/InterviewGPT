import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getStorageService } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const key = request.nextUrl.searchParams.get('key');
    if (!key) {
      return NextResponse.json({ error: 'Missing file key.' }, { status: 400 });
    }

    const storage = getStorageService();
    const fileData = await storage.getFile(key);

    if (!fileData) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 });
    }

    const isDownload = request.nextUrl.searchParams.get('download') === 'true';
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
    console.error('Failed to serve storage file:', error);
    return NextResponse.json({ error: 'Error serving file.' }, { status: 500 });
  }
}

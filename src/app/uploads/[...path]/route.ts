import path from 'node:path';

import { NextResponse } from 'next/server';

import { CONTENT_TYPES, readUpload } from '@/lib/cms/server';

/**
 * Serves files uploaded in the admin at /uploads/…, from MongoDB (GridFS)
 * or, without a database, from cms-data/uploads.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const name = path.basename((await params).path.join('/'));
  const data = await readUpload(name).catch((error: Error) => {
    console.error('[cms] Could not read an upload:', error.message);
    return null;
  });
  if (!data) return new NextResponse('Not found', { status: 404 });
  const type = CONTENT_TYPES[path.extname(name).toLowerCase()] ?? 'application/octet-stream';
  return new NextResponse(new Uint8Array(data), {
    headers: {
      'Content-Type': type,
      'Cache-Control': 'public, max-age=31536000, immutable',
      // SVG uploads cannot run script when opened directly.
      ...(type === 'image/svg+xml'
        ? { 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'" }
        : {}),
    },
  });
}

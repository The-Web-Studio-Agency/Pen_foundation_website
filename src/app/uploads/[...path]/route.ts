import fs from 'node:fs';
import path from 'node:path';

import { NextResponse } from 'next/server';

import { UPLOAD_DIR } from '@/lib/cms/server';

const TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
};

/**
 * Serves files uploaded in the admin from cms-data/uploads at /uploads/….
 * A route rather than /public, because Next only serves files that were in
 * /public when the server started.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const parts = (await params).path;
  const file = path.join(UPLOAD_DIR, path.basename(parts.join('/')));
  if (!file.startsWith(UPLOAD_DIR) || !fs.existsSync(file)) {
    return new NextResponse('Not found', { status: 404 });
  }
  const type = TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
  return new NextResponse(fs.readFileSync(file), {
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

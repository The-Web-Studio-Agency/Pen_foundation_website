import { NextResponse, type NextRequest } from 'next/server';

import { adminFrom, unauthorized } from '@/lib/cms/api';
import { isAllowedUpload, MAX_UPLOAD_BYTES, saveUpload } from '@/lib/cms/server';

/** POST multipart `file` → { url } under /uploads. */
export async function POST(request: NextRequest) {
  if (!adminFrom(request)) return unauthorized();
  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Choose a file to upload.' }, { status: 400 });
  }
  if (!isAllowedUpload(file.name)) {
    return NextResponse.json(
      { error: 'Images (PNG, JPG, WebP, AVIF, GIF, SVG), MP4/WebM video or PDF only.' },
      { status: 400 },
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: 'Files must be 15 MB or smaller.' }, { status: 400 });
  }
  const url = saveUpload(file.name, Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url });
}

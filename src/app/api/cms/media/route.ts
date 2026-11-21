import { NextResponse, type NextRequest } from 'next/server';

import { adminFrom, unauthorized } from '@/lib/cms/api';
import { deleteUpload, listMedia } from '@/lib/cms/server';

/** Every uploaded file, then the site's own images. */
export async function GET(request: NextRequest) {
  if (!adminFrom(request)) return unauthorized();
  return NextResponse.json({ items: await listMedia() });
}

/** DELETE ?url=/uploads/… — uploaded files only; the site's own stay. */
export async function DELETE(request: NextRequest) {
  if (!adminFrom(request)) return unauthorized();
  const url = request.nextUrl.searchParams.get('url') ?? '';
  if (!(await deleteUpload(url))) {
    return NextResponse.json({ error: 'Only uploaded files can be deleted.' }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

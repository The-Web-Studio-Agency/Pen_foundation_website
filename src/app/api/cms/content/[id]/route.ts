import { NextResponse, type NextRequest } from 'next/server';

import { adminFrom, refreshSite, unauthorized } from '@/lib/cms/api';
import { defaultsFor, getEntry } from '@/designs/v2/admin/registry';
import { readContent, resetContent, writeContent } from '@/lib/cms/server';

type Ctx = { params: Promise<{ id: string }> };

/** The current version (saved or original) and the original. */
export async function GET(request: NextRequest, { params }: Ctx) {
  if (!adminFrom(request)) return unauthorized();
  const { id } = await params;
  if (!getEntry(id)) return NextResponse.json({ error: 'Unknown section.' }, { status: 404 });
  const original = defaultsFor(id);
  const saved = readContent(id);
  return NextResponse.json({ value: saved ?? original, original, edited: saved !== undefined });
}

/** Save a new version. The shape must match the original's. */
export async function PUT(request: NextRequest, { params }: Ctx) {
  const user = adminFrom(request);
  if (!user) return unauthorized();
  const { id } = await params;
  if (!getEntry(id)) return NextResponse.json({ error: 'Unknown section.' }, { status: 404 });
  const body = (await request.json().catch(() => null)) as { value?: unknown } | null;
  const original = defaultsFor(id);
  if (!body || body.value === undefined) {
    return NextResponse.json({ error: 'Nothing to save.' }, { status: 400 });
  }
  if (
    Array.isArray(original) !== Array.isArray(body.value) ||
    typeof original !== typeof body.value
  ) {
    return NextResponse.json({ error: 'That content has the wrong shape.' }, { status: 400 });
  }
  await writeContent(id, body.value, user);
  refreshSite();
  return NextResponse.json({ ok: true });
}

/** Back to the original. */
export async function DELETE(request: NextRequest, { params }: Ctx) {
  if (!adminFrom(request)) return unauthorized();
  const { id } = await params;
  await resetContent(id, defaultsFor(id));
  refreshSite();
  return NextResponse.json({ ok: true });
}

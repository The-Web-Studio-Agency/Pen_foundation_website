import { NextResponse, type NextRequest } from 'next/server';

import { addLead } from '@/lib/cms/server';

/**
 * Public: the site's forms post every enquiry here as well as opening
 * WhatsApp, so no lead is lost if the visitor never presses send.
 *
 * Light abuse guards: a hidden "website" field real visitors never fill,
 * length caps, and a per-address limit of 20 submissions an hour.
 */

const recent = new Map<string, number[]>();

function limited(key: string) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < 3600_000);
  hits.push(now);
  recent.set(key, hits);
  return hits.length > 20;
}

const clip = (value: unknown, max: number) => String(value ?? '').slice(0, max);

function clean(record: unknown, maxKeys: number, maxLen: number): Record<string, string> {
  if (!record || typeof record !== 'object') return {};
  return Object.fromEntries(
    Object.entries(record as Record<string, unknown>)
      .slice(0, maxKeys)
      .map(([k, v]) => [clip(k, 60), clip(v, maxLen).trim()] as const)
      .filter(([, v]) => v),
  );
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    source?: string;
    page?: string;
    fields?: unknown;
    campaign?: unknown;
    website?: string;
  } | null;
  if (!body) return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  // Honeypot: pretend success so bots learn nothing.
  if (body.website) return NextResponse.json({ ok: true });

  const key = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (limited(key)) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });

  const fields = clean(body.fields, 20, 4000);
  if (Object.keys(fields).length === 0) {
    return NextResponse.json({ error: 'Empty enquiry.' }, { status: 400 });
  }

  await addLead({
    source: clip(body.source, 60) || 'unknown',
    page: clip(body.page, 300),
    fields,
    campaign: clean(body.campaign, 10, 300),
  });
  return NextResponse.json({ ok: true });
}

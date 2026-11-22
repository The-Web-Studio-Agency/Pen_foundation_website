import { after, NextResponse, type NextRequest } from 'next/server';

import { addLead, type Lead } from '@/lib/cms/server';
import { sendLeadEmail } from '@/lib/email/leadEmail';

/**
 * Public: the site's forms post every enquiry here as well as opening
 * WhatsApp, so no lead is lost if the visitor never presses send.
 *
 * Light abuse guards: a hidden "website" field real visitors never fill,
 * length caps, and a per-address limit of 20 submissions an hour.
 *
 * Each enquiry is also emailed to the team (lib/email/leadEmail.ts) once the
 * response has gone, so the visitor never waits on the mail server. The email
 * goes even if saving to the database fails, so the lead still reaches
 * someone.
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

  const input = {
    source: clip(body.source, 60) || 'unknown',
    page: clip(body.page, 300),
    fields,
    campaign: clean(body.campaign, 10, 300),
  };

  let lead: Lead;
  let saved = true;
  try {
    lead = await addLead(input);
  } catch (error) {
    console.error('[leads] could not save the enquiry:', error);
    saved = false;
    lead = { id: '', createdAt: new Date().toISOString(), status: 'new', ...input };
  }

  const site = request.nextUrl.origin;
  after(() =>
    sendLeadEmail(lead, site).catch((error) => {
      console.error('[leads] could not email the enquiry:', error);
    }),
  );

  return saved
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: 'Could not save.' }, { status: 500 });
}

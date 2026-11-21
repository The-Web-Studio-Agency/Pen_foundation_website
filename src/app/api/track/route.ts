import { NextResponse, type NextRequest } from 'next/server';

import { BOT_UA, classify, deviceOf } from '@/lib/analytics/sources';
import { analyticsEnabled, recordPing, recordView } from '@/lib/cms/analytics';
import { adminFrom } from '@/lib/cms/api';

/**
 * Public: the site's visit tracker (providers/VisitTracker.tsx) posts here.
 *
 *   { type: 'view', vid, sid, path, landing, entry, referrer, search }
 *   { type: 'ping', vid, sid, path, referrer, search }  (every 30 s, tab open)
 *
 * Not counted: crawlers and scripts, the admin while signed in, the admin
 * pages and the API itself. Location comes from the host's headers; nothing
 * identifying (IP address, full user agent) is stored.
 */

const ID = /^[a-z0-9]{8,40}$/i;
const recent = new Map<string, number[]>();

function limited(key: string) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < 3600_000);
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > 600;
}

const clip = (value: unknown, max: number) => String(value ?? '').slice(0, max);

function cleanPath(value: unknown) {
  const path = clip(value, 300).split(/[?#]/)[0] || '/';
  return path.startsWith('/') ? path : `/${path}`;
}

function header(request: NextRequest, name: string) {
  const value = request.headers.get(name) ?? '';
  try {
    return decodeURIComponent(value).slice(0, 80);
  } catch {
    return value.slice(0, 80);
  }
}

const done = () => new NextResponse(null, { status: 204 });

export async function POST(request: NextRequest) {
  if (!analyticsEnabled()) return done();

  const userAgent = request.headers.get('user-agent') ?? '';
  if (!userAgent || BOT_UA.test(userAgent)) return done();
  if (adminFrom(request)) return done();

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (limited(ip)) return done();

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || !ID.test(String(body.vid)) || !ID.test(String(body.sid))) return done();

  const path = cleanPath(body.path);
  if (/^\/(web-admin|api|_next)(\/|$)/.test(path)) return done();

  const attribution = classify({
    referrer: clip(body.referrer, 500),
    search: clip(body.search, 800),
    userAgent,
    ownHost: request.headers.get('host')?.split(':')[0] ?? '',
  });
  const place = {
    country: header(request, 'x-vercel-ip-country') || header(request, 'cf-ipcountry'),
    region: header(request, 'x-vercel-ip-country-region'),
    city: header(request, 'x-vercel-ip-city'),
  };
  const device = deviceOf(userAgent);
  const common = {
    vid: String(body.vid),
    path,
    channel: attribution.channel,
    source: attribution.source,
    device,
    ...place,
  };

  try {
    if (body.type === 'ping') {
      await recordPing(String(body.sid), common);
    } else {
      await recordView({
        ...common,
        t: new Date(),
        sid: String(body.sid),
        landing: cleanPath(body.landing || path),
        entry: body.entry === true,
        ...(attribution.campaign ? { campaign: attribution.campaign } : {}),
      });
    }
  } catch (error) {
    console.error('[analytics] could not record a visit', error);
  }
  return done();
}

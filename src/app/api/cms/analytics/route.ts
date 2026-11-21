import { NextResponse, type NextRequest } from 'next/server';

import {
  analyticsEnabled,
  FILTER_KEYS,
  live,
  report,
  resolveRange,
  summary,
  TIMEZONE,
  type Filters,
} from '@/lib/cms/analytics';
import { adminFrom, unauthorized } from '@/lib/cms/api';

/**
 * GET ?live=1                       who is on the site now
 * GET ?range=7d&channel=Social…     the full report for a range and filters
 *     range: today | yesterday | 7d | 30d | week | month | year | custom
 *     (custom takes from=YYYY-MM-DD&to=YYYY-MM-DD)
 */
export async function GET(request: NextRequest) {
  if (!adminFrom(request)) return unauthorized();
  if (!analyticsEnabled()) return NextResponse.json({ enabled: false });

  const q = request.nextUrl.searchParams;
  try {
    if (q.get('live')) return NextResponse.json({ enabled: true, live: await live() });

    const range = resolveRange(q.get('range') ?? '7d', q.get('from') ?? '', q.get('to') ?? '');
    const filters: Filters = {};
    for (const key of FILTER_KEYS) {
      const value = q.get(key);
      if (value !== null) filters[key] = value.slice(0, 200);
    }
    const [data, periods, now] = await Promise.all([report(range, filters), summary(), live()]);
    return NextResponse.json({
      enabled: true,
      timezone: TIMEZONE,
      range: {
        key: range.key,
        label: range.label,
        unit: range.unit,
        start: range.start.toISOString(),
        end: range.end.toISOString(),
      },
      report: data,
      periods,
      live: now,
    });
  } catch (error) {
    console.error('[analytics] report failed', error);
    return NextResponse.json({ error: 'Could not load the traffic report.' }, { status: 500 });
  }
}

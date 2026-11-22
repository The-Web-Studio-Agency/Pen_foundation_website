import { NextResponse, type NextRequest } from 'next/server';

import { refreshSite, seoFrom } from '@/lib/cms/api';
import { readContent, writeContent } from '@/lib/cms/server';
import {
  cleanFiles,
  cleanPages,
  cleanSite,
  cleanTracking,
  SEO_IDS,
  SeoInputError,
  type SeoSection,
} from '@/lib/seo/settings';

/**
 * The SEO team's settings. Only the SEO account may read or change them;
 * the client's account gets the same 403 as a stranger gets 401.
 */

const forbidden = () =>
  NextResponse.json({ error: 'Only the SEO account can change SEO settings.' }, { status: 403 });

const CLEAN: Record<SeoSection, (v: unknown) => unknown> = {
  pages: cleanPages,
  site: cleanSite,
  tracking: cleanTracking,
  files: cleanFiles,
};

export async function GET(request: NextRequest) {
  if (!seoFrom(request)) return forbidden();
  return NextResponse.json({
    pages: readContent(SEO_IDS.pages) ?? {},
    site: readContent(SEO_IDS.site) ?? {},
    tracking: readContent(SEO_IDS.tracking) ?? {},
    files: readContent(SEO_IDS.files) ?? {},
  });
}

/** PUT { section: 'pages' | 'site' | 'tracking' | 'files', value } */
export async function PUT(request: NextRequest) {
  const user = seoFrom(request);
  if (!user) return forbidden();
  const body = (await request.json().catch(() => null)) as {
    section?: string;
    value?: unknown;
  } | null;
  const section = body?.section as SeoSection | undefined;
  if (!section || !(section in CLEAN)) {
    return NextResponse.json({ error: 'Unknown settings.' }, { status: 400 });
  }

  let value: unknown;
  try {
    value = CLEAN[section](body?.value);
  } catch (error) {
    if (error instanceof SeoInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }

  await writeContent(SEO_IDS[section], value, user);
  refreshSite();
  return NextResponse.json({ ok: true, value });
}

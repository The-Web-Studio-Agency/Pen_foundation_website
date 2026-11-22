import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

import { readSession, SESSION_COOKIE, verifySession } from './auth';

/** Route handlers: the signed-in admin, or null. */
export function adminFrom(request: NextRequest) {
  return verifySession(request.cookies.get(SESSION_COOKIE)?.value);
}

/** Route handlers: the signed-in SEO account's name, or null for anyone else. */
export function seoFrom(request: NextRequest) {
  const session = readSession(request.cookies.get(SESSION_COOKIE)?.value);
  return session?.role === 'seo' ? session.user : null;
}

export const unauthorized = () =>
  NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });

/** After any content change: drop every cached page so the edit shows. */
export function refreshSite() {
  revalidatePath('/', 'layout');
}

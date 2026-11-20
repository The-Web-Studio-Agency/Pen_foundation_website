import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

import { SESSION_COOKIE, verifySession } from './auth';

/** Route handlers: the signed-in admin, or null. */
export function adminFrom(request: NextRequest) {
  return verifySession(request.cookies.get(SESSION_COOKIE)?.value);
}

export const unauthorized = () =>
  NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });

/** After any content change: drop every cached page so the edit shows. */
export function refreshSite() {
  revalidatePath('/', 'layout');
}

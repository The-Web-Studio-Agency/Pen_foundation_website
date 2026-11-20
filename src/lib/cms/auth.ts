import { createHmac, timingSafeEqual } from 'node:crypto';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Admin sign-in for /web-admin. One account, no sign-up.
 *
 * The credentials come from the environment, with the agreed defaults for
 * local use. Before going live, set all three in `.env.local` (or the host's
 * settings):
 *
 *   CMS_ADMIN_USERNAME   default "admin"
 *   CMS_ADMIN_PASSWORD   default "qwert1234"
 *   CMS_SECRET           signs the session cookie; any long random string
 *
 * A session is a signed, HTTP-only cookie holding the username and an expiry.
 * Nothing is stored server-side, so signing out clears the cookie.
 */

export const SESSION_COOKIE = 'pen_cms_session';
const SESSION_HOURS = 12;

const USERNAME = process.env.CMS_ADMIN_USERNAME || 'admin';
const PASSWORD = process.env.CMS_ADMIN_PASSWORD || 'qwert1234';
const SECRET = process.env.CMS_SECRET || 'pen-foundation-local-cms-secret-change-me';

const sign = (payload: string) => createHmac('sha256', SECRET).update(payload).digest('base64url');

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkCredentials(username: string, password: string) {
  // Both compared, always, so timing does not reveal which one was wrong.
  const u = same(username.trim(), USERNAME);
  const p = same(password, PASSWORD);
  return u && p;
}

export function createSession(username: string) {
  const payload = Buffer.from(
    JSON.stringify({ u: username, exp: Date.now() + SESSION_HOURS * 3600_000 }),
  ).toString('base64url');
  return {
    name: SESSION_COOKIE,
    value: `${payload}.${sign(payload)}`,
    options: {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SESSION_HOURS * 3600,
    },
  };
}

export function verifySession(token: string | undefined): string | null {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !same(signature, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as {
      u: string;
      exp: number;
    };
    return data.exp > Date.now() ? data.u : null;
  } catch {
    return null;
  }
}

/** The signed-in admin's name, or null. For server components and route handlers. */
export async function currentAdmin(): Promise<string | null> {
  const jar = await cookies();
  return verifySession(jar.get(SESSION_COOKIE)?.value);
}

/** Admin pages: send anyone not signed in to the login page. */
export async function requireAdmin(): Promise<string> {
  const user = await currentAdmin();
  if (!user) redirect('/web-admin');
  return user;
}

/* ---- sign-in throttle: 8 failed attempts per address per 10 minutes ---- */

const attempts = new Map<string, { count: number; until: number }>();

export function throttled(key: string) {
  const entry = attempts.get(key);
  return Boolean(entry && entry.until > Date.now() && entry.count >= 8);
}

export function recordFailure(key: string) {
  const entry = attempts.get(key);
  if (!entry || entry.until < Date.now()) {
    attempts.set(key, { count: 1, until: Date.now() + 10 * 60_000 });
  } else {
    entry.count += 1;
  }
}

export function clearFailures(key: string) {
  attempts.delete(key);
}

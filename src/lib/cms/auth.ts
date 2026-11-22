import { createHmac, timingSafeEqual } from 'node:crypto';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Admin sign-in for /web-admin. Two accounts, no sign-up:
 *
 *   admin   the client: everything except the SEO section
 *   seo     the SEO team: everything the client has, plus the SEO section
 *           (page titles and descriptions, tracking codes, verification,
 *           robots)
 *
 * The credentials come from the environment. Before going live, set them in
 * `.env.local` (or the host's settings):
 *
 *   CMS_ADMIN_USERNAME   default "admin"
 *   CMS_ADMIN_PASSWORD   default "qwert1234"
 *   SEO_ADMIN_USERNAME   default "seo"
 *   SEO_ADMIN_PASSWORD   no default in production: the SEO account stays
 *                        switched off until this is set ("seo12345" locally)
 *   CMS_SECRET           signs the session cookie; any long random string
 *
 * A session is a signed, HTTP-only cookie holding the username, the role and
 * an expiry. Nothing is stored server-side, so signing out clears the cookie.
 */

export const SESSION_COOKIE = 'pen_cms_session';
const SESSION_HOURS = 12;

export type Role = 'admin' | 'seo';

const USERNAME = process.env.CMS_ADMIN_USERNAME || 'admin';
const PASSWORD = process.env.CMS_ADMIN_PASSWORD || 'qwert1234';
const SEO_USERNAME = process.env.SEO_ADMIN_USERNAME || 'seo';
const SEO_PASSWORD =
  process.env.SEO_ADMIN_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : 'seo12345');
const SECRET = process.env.CMS_SECRET || 'pen-foundation-local-cms-secret-change-me';

const sign = (payload: string) => createHmac('sha256', SECRET).update(payload).digest('base64url');

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** The account these credentials belong to, or null. */
export function checkCredentials(username: string, password: string): Role | null {
  // Every comparison runs, always, so timing does not reveal which was wrong.
  const name = username.trim();
  const admin = same(name, USERNAME) && same(password, PASSWORD);
  const seo = Boolean(SEO_PASSWORD) && same(name, SEO_USERNAME) && same(password, SEO_PASSWORD);
  return seo ? 'seo' : admin ? 'admin' : null;
}

export function createSession(username: string, role: Role) {
  const payload = Buffer.from(
    JSON.stringify({ u: username, r: role, exp: Date.now() + SESSION_HOURS * 3600_000 }),
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

export interface Session {
  user: string;
  role: Role;
}

/** The session in a cookie value, or null if missing, forged or expired. */
export function readSession(token: string | undefined): Session | null {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !same(signature, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as {
      u: string;
      r?: Role;
      exp: number;
    };
    if (data.exp <= Date.now()) return null;
    // Sessions from before roles existed were the client's.
    return { user: data.u, role: data.r === 'seo' ? 'seo' : 'admin' };
  } catch {
    return null;
  }
}

export function verifySession(token: string | undefined): string | null {
  return readSession(token)?.user ?? null;
}

/** The signed-in session, or null. For server components. */
export async function currentSession(): Promise<Session | null> {
  const jar = await cookies();
  return readSession(jar.get(SESSION_COOKIE)?.value);
}

/** The signed-in admin's name, or null. For server components and route handlers. */
export async function currentAdmin(): Promise<string | null> {
  return (await currentSession())?.user ?? null;
}

/** Admin pages: send anyone not signed in to the login page. */
export async function requireAdmin(): Promise<string> {
  const user = await currentAdmin();
  if (!user) redirect('/web-admin');
  return user;
}

/** SEO pages: only the SEO account; the client goes back to the dashboard. */
export async function requireSeo(): Promise<string> {
  const session = await currentSession();
  if (!session) redirect('/web-admin');
  if (session.role !== 'seo') redirect('/web-admin/dashboard');
  return session.user;
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

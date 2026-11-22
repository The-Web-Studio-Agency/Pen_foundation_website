import { NextResponse, type NextRequest } from 'next/server';

import {
  checkCredentials,
  clearFailures,
  createSession,
  recordFailure,
  throttled,
} from '@/lib/cms/auth';

/** POST { username, password } → sets the session cookie. */
export async function POST(request: NextRequest) {
  const key = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (throttled(key)) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in a few minutes.' },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
  };
  const role = checkCredentials(body.username ?? '', body.password ?? '');
  if (!role) {
    recordFailure(key);
    return NextResponse.json({ error: 'Incorrect username or password.' }, { status: 401 });
  }

  clearFailures(key);
  const session = createSession(body.username!.trim(), role);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(session.name, session.value, session.options);
  return response;
}

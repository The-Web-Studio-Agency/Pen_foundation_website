'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { assets } from '../assets';
import { cx } from '../components/primitives';
import s from './admin.module.css';

/** /web-admin sign-in. One account; no sign-up. */
export function LoginForm() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/cms/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: String(data.get('username') ?? ''),
          password: String(data.get('password') ?? ''),
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? 'Could not sign in.');
        setBusy(false);
        return;
      }
      router.replace('/web-admin/dashboard');
      router.refresh();
    } catch {
      setError('Could not reach the server.');
      setBusy(false);
    }
  };

  return (
    <div className={s.login}>
      <form className={s.loginCard} onSubmit={onSubmit}>
        <Image
          src={assets.logo.src}
          alt="PEN Foundation"
          width={assets.logo.width}
          height={assets.logo.height}
          priority
          className={s.loginLogo}
        />
        <div>
          <h1 className={s.loginTitle}>Admin sign in</h1>
          <p className={s.muted} style={{ margin: '0.3rem 0 0' }}>
            Manage the website content and enquiries.
          </p>
        </div>

        {error && (
          <p className={s.error} role="alert">
            {error}
          </p>
        )}

        <label className={s.field}>
          <span className={s.label}>Username</span>
          <input name="username" required autoComplete="username" autoFocus className={s.input} />
        </label>
        <label className={s.field}>
          <span className={s.label}>Password</span>
          <span className={s.passwordRow}>
            <input
              name="password"
              type={show ? 'text' : 'password'}
              required
              autoComplete="current-password"
              className={s.input}
              style={{ paddingRight: '4rem' }}
            />
            <button
              type="button"
              className={s.passwordToggle}
              onClick={() => setShow((v) => !v)}
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </span>
        </label>

        <button type="submit" className={cx(s.btn, s.primary)} disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

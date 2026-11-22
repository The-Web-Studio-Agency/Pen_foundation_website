import { headers } from 'next/headers';

import s from '@/designs/v2/admin/admin.module.css';
import { cx } from '@/designs/v2/components/primitives';
import { siteConfig } from '@/config/site';

/**
 * Canonical links, share links and the sitemap are all built from the site's
 * address (NEXT_PUBLIC_SITE_URL). If that is not the domain the site is
 * actually served from, Google is pointed at the wrong one: say so.
 */
export async function DomainCheck() {
  const host = (await headers()).get('host') ?? '';
  const configured = siteConfig.url.replace(/^https?:\/\//, '').replace(/^www\./, '');
  const actual = host.replace(/^www\./, '');
  if (!actual || actual.startsWith('localhost') || actual.endsWith('.vercel.app')) return null;
  if (configured === actual) return null;
  return (
    <div className={cx(s.panel, s.error)} style={{ marginBottom: '1.25rem', lineHeight: 1.5 }}>
      <b>
        The website’s address is set to {siteConfig.url}, but it is being served from {host}.
      </b>{' '}
      Canonical links, share links and the sitemap all use the first one, so search engines are sent
      to the wrong domain. Ask the developer to set <code>NEXT_PUBLIC_SITE_URL</code> to{' '}
      <code>https://{host}</code> in Vercel → Settings → Environment Variables, then redeploy.
    </div>
  );
}

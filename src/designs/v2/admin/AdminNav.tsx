'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { assets } from '../assets';
import { cx } from '../components/primitives';
import s from './admin.module.css';

const LINKS = [
  { href: '/web-admin/dashboard', label: 'Dashboard' },
  { href: '/web-admin/analytics', label: 'Analytics' },
  { href: '/web-admin/content', label: 'Page content' },
  { href: '/web-admin/blogs', label: 'Blog articles' },
  { href: '/web-admin/projects', label: 'Projects' },
  { href: '/web-admin/media', label: 'Media library' },
  { href: '/web-admin/leads', label: 'Leads', count: 'newLeads' as const },
];

/** Only for the SEO team's account. */
const SEO_LINKS = [
  { href: '/web-admin/seo', label: 'Page titles & meta', exact: true },
  { href: '/web-admin/seo/tracking', label: 'Tracking & pixels' },
  { href: '/web-admin/seo/site', label: 'Verification & site' },
  { href: '/web-admin/seo/files', label: 'Files (robots, sitemap, llms)' },
];

/** The admin sidebar: sections, the new-leads count, the site and sign out. */
export function AdminNav({
  user,
  newLeads,
  seo = false,
}: {
  user: string;
  newLeads: number;
  /** The SEO team's account: adds the SEO section. */
  seo?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    await fetch('/api/cms/logout', { method: 'POST' }).catch(() => {});
    router.replace('/web-admin');
    router.refresh();
  };

  return (
    <aside className={s.sidebar}>
      <Link href="/web-admin/dashboard" className={s.brand}>
        <Image
          src={assets.logo.src}
          alt=""
          width={assets.logo.width}
          height={assets.logo.height}
          className={s.brandLogo}
        />
        <span className={s.brandText}>
          <b>PEN Foundation</b>
          <span>{seo ? 'SEO admin' : 'Content admin'}</span>
        </span>
      </Link>

      <nav className={s.nav} aria-label="Admin">
        {LINKS.map((link) => {
          const current = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={s.navLink}
              aria-current={current ? 'page' : undefined}
            >
              {link.label}
              {link.count && newLeads > 0 && <span className={s.navCount}>{newLeads}</span>}
            </Link>
          );
        })}

        {seo && (
          <>
            <span className={s.navGroup}>SEO</span>
            {SEO_LINKS.map((link) => {
              const current = link.exact
                ? pathname === link.href
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={s.navLink}
                  aria-current={current ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className={s.sidebarFoot}>
        <a href="/" target="_blank" rel="noopener noreferrer" className={s.siteLink}>
          View website ↗
        </a>
        <span className={s.muted} style={{ color: 'rgba(255,255,255,0.6)' }}>
          Signed in as <b style={{ color: '#fff' }}>{user}</b>
        </span>
        <button type="button" className={cx(s.btn, s.secondary, s.small)} onClick={signOut}>
          Sign out
        </button>
      </div>
    </aside>
  );
}

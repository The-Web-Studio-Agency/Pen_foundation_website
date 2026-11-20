import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import s from '@/designs/v2/admin/admin.module.css';
import { cx } from '@/designs/v2/components/primitives';
import { geistSans } from '@/designs/v2/fonts';
import t from '@/designs/v2/styles/theme.module.css';

/**
 * /web-admin — the content admin. Outside the `(site)` group, so it has no
 * site header or footer; never indexed; always rendered fresh.
 */
export const metadata: Metadata = {
  title: { template: '%s | PEN Admin', default: 'PEN Admin' },
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className={cx(t.root, geistSans.variable, s.root)}>{children}</div>;
}

import Image from 'next/image';

import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

/**
 * The PEN Foundation mark.
 *
 * Replaces the SVG `LogoIcon` carried over from the cloned About page, which
 * still rendered the reference site's wordmark on every route once that header
 * was promoted to site chrome.
 *
 * Raster, not SVG: the supplied asset is a PNG with a baked-in teal and a glow,
 * so it cannot be recoloured through `text-*` the way the old icon was. Callers
 * size it with `className` (height + auto width) instead of tinting it. If a
 * vector version is produced later, swap this implementation and the call sites
 * keep working.
 */
export function Logo({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/media/logos/pen-logo@2x.webp"
      alt={`${siteConfig.name} logo`}
      width={458}
      height={363}
      priority={priority}
      className={cn('w-auto object-contain', className)}
    />
  );
}

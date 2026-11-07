import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

import t from '../styles/theme.module.css';

/** Join class names, skipping falsy entries. Local so the concept owns its helpers. */
export function cx(...names: (string | false | null | undefined)[]) {
  return names.filter(Boolean).join(' ');
}

/** Stagger index for `data-reveal` children — read by the reveal CSS as `--i`. */
export function stagger(i: number): CSSProperties {
  return { '--i': i } as CSSProperties;
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx(t.chip, className)}>{children}</span>;
}

export function ChevronRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2.5 8h10M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function ArrowDown({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 2.5v10M3.5 8.5 8 13l4.5-4.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  tone: 'onDark' | 'onLight' | 'solid';
  className?: string;
}

/**
 * Mono label + square lime chevron. Internal routes go through next/link;
 * `tel:`, `mailto:` and external URLs are plain anchors.
 */
export function ButtonLink({ href, children, tone, className }: ButtonLinkProps) {
  const inner = (
    <>
      <span>{children}</span>
      <span className={t.btnIcon}>
        <ChevronRight />
      </span>
    </>
  );
  const classes = cx(t.btn, t[tone], className);
  if (/^(tel:|mailto:|https?:)/.test(href)) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}

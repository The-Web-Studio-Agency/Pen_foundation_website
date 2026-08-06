'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import { rise, staggerContainer, type VariantName, variants } from '@/lib/motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Sequence direct <RevealItem> children by this gap, in seconds. */
  stagger?: number;
  /** Fraction of the element that must be visible before it animates. */
  amount?: number;
  /** Which house variant to use when not staggering. */
  variant?: VariantName;
}

/**
 * Scroll-reveal wrapper — the single entry point for "animate this into view".
 *
 * Feature code never writes `initial`/`whileInView` by hand; it composes this.
 * That is what keeps timing consistent across pages ported from different
 * source sites.
 */
export function Reveal({
  children,
  className,
  stagger,
  amount = 0.35,
  variant = 'rise',
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={stagger ? staggerContainer(stagger) : (variants[variant] ?? rise)}
    >
      {children}
    </motion.div>
  );
}

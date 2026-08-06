'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import { variants, type VariantName } from '@/lib/motion';

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  variant?: VariantName;
}

/** A child of <Reveal stagger>. Inherits the parent's show/hidden orchestration. */
export function RevealItem({ children, className, variant = 'rise' }: RevealItemProps) {
  return (
    <motion.div variants={variants[variant]} className={className}>
      {children}
    </motion.div>
  );
}

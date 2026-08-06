'use client';

import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { duration, stagger } from '@/lib/motion';
import { partners } from '@/content/data/partners';

/**
 * Inline partner row — the compact treatment, for use inside another section.
 *
 * Deliberately a separate component from <LogoGrid> rather than a `variant`
 * prop on it: they share data, not layout, and a prop that swaps the entire
 * markup is the pattern that made the old `Scene`/`Media` components dishonest.
 */
export function PartnerRow({
  label = 'Recognized by',
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: duration.base, delay: stagger.loose }}
      className={cn('mt-16', className)}
    >
      <p className="mb-6 font-mono text-[10px] tracking-[0.3em] text-ink-soft uppercase">{label}</p>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        {partners.map((partner) => (
          <span
            key={partner.name}
            title={partner.fullName}
            className="font-mono text-sm tracking-[0.08em] text-ink-soft/60 transition-colors duration-300 hover:text-ink"
          >
            {partner.name}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

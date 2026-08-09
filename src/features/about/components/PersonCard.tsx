'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import type { PersonCard as PersonCardData } from '@/content/data/people';

export function PersonCard({
  name,
  title,
  bio,
  photoTone,
  initials,
  avatarColor,
  photo,
}: PersonCardData) {
  const [expanded, setExpanded] = useState(false);

  // Only the founder with a documented background carries a bio. Without one
  // there is nothing to reveal, so the card must not advertise a control that
  // opens an empty panel.
  const canExpand = Boolean(bio);

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => canExpand && setExpanded((v) => !v)}
        disabled={!canExpand}
        className={cn(
          'notch-corner-sm group relative aspect-square w-full overflow-hidden bg-ink text-left',
          !canExpand && 'cursor-default',
        )}
        aria-expanded={canExpand ? expanded : undefined}
      >
        {expanded && canExpand ? (
          <motion.div
            key="bio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 overflow-y-auto bg-[#012c32] p-4 text-sm leading-relaxed text-white/80"
          >
            {bio}
          </motion.div>
        ) : (
          <motion.div
            key="avatar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute inset-0 flex items-center justify-center text-4xl font-semibold text-white/90',
              photoTone === 'grayscale' && 'grayscale',
            )}
            style={{ backgroundColor: avatarColor }}
          >
            {photo ? (
              <Image
                src={photo}
                alt={name}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-cover"
              />
            ) : (
              initials
            )}
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover:bg-ink/20 group-hover:opacity-100">
              <span className="rounded-lg bg-white px-8 py-3 text-[11px] font-semibold tracking-wide text-[#012c32] uppercase">
                Learn More
              </span>
            </span>
          </motion.div>
        )}
      </button>

      <div>
        <p className="text-xl font-semibold text-[#012c32]">{name}</p>
        <p className="mt-1 text-[15px] text-[#c2c2c2]">{title}</p>
      </div>
    </div>
  );
}

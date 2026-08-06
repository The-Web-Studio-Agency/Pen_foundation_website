'use client';

import type { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';

/**
 * Global motion policy.
 *
 * `reducedMotion="user"` makes every animation in the app respect the OS
 * "reduce motion" setting without a single component opting in. Previously no
 * component honoured it at all, which is an accessibility defect on a site
 * built almost entirely from scroll animation.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

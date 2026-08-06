import type { ReactNode } from 'react';

import { MotionProvider } from './MotionProvider';

/**
 * The single provider the root layout mounts.
 *
 * The layout must never know which providers exist or in what order they nest —
 * adding analytics, theming or smooth scroll later is an edit here, not a
 * change to the application shell.
 *
 * This component itself stays a Server Component: only the providers that
 * genuinely need browser APIs carry `'use client'`, so adding one does not
 * push the whole tree into the client bundle.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return <MotionProvider>{children}</MotionProvider>;
}

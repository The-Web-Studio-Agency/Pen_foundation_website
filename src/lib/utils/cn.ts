import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names, resolving Tailwind conflicts.
 *
 * The previous hand-rolled version only joined strings, so `cn('p-4', 'p-8')`
 * emitted both and the winner depended on stylesheet order. That also made
 * every component ported from the clone repo — which is built on the
 * clsx + tailwind-merge version — behave subtly differently here.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

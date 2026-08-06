import localFont from 'next/font/local';
import { Fraunces } from 'next/font/google';

/**
 * Typeface declarations.
 *
 * Kept out of the root layout so the layout reads as structure, and so a font
 * swap touches one file. Each exposes a CSS variable consumed by the `@theme`
 * block in src/styles/tokens.css.
 */

export const fontSans = localFont({
  src: [
    { path: '../../public/media/fonts/SuisseIntl-Book.woff2', weight: '350', style: 'normal' },
    { path: '../../public/media/fonts/SuisseIntl-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/media/fonts/SuisseIntl-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/media/fonts/SuisseIntl-Semibold.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-suisse',
  display: 'swap',
});

export const fontMono = localFont({
  src: [
    { path: '../../public/media/fonts/GeistMono-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/media/fonts/GeistMono-SemiBold.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const fontSerif = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

/** Every font variable, ready to drop on <html>. */
export const fontVariables = [fontSans.variable, fontMono.variable, fontSerif.variable].join(' ');

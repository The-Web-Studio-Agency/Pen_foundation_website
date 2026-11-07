import localFont from 'next/font/local';

/**
 * Display + body face for the home-v2 concept.
 *
 * Geist (SIL Open Font License — see public/designs/v2/fonts/OFL-LICENSE.txt),
 * self-hosted like every other face on this site: the reference design sets
 * everything in Geist Medium/SemiBold with tight negative tracking and labels
 * in Geist Mono. Geist Mono is already self-hosted for the live site
 * (`--font-geist-mono` on <html>), so only the sans is added here.
 *
 * Local rather than `next/font/google`: the project makes no remote font
 * requests (see src/config/fonts.ts), and the Google loader also failed
 * Turbopack's cached rebuilds ("next/font/google queries have exactly one
 * entry"). The variable is applied to the concept's root element only — never
 * to <html> — so the live site's Suisse Intl is untouched.
 */
export const geistSans = localFont({
  src: [
    {
      path: '../../../public/designs/v2/fonts/Geist-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/designs/v2/fonts/Geist-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/designs/v2/fonts/Geist-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--hv2-font-sans',
  display: 'swap',
});

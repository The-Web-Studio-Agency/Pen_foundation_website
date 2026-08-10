import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Every asset is local under /public/media. Add remotePatterns here if a
    // CMS is introduced — never widen this to a bare wildcard.
    remotePatterns: [],
  },

  async redirects() {
    return [
      /*
       * `/applications` has no page of its own; the content lives on the
       * homepage.
       *
       * The route used to render `<section className="min-h-screen" aria-hidden />`
       * — a placeholder that served roughly 2,000px of empty white above the
       * footer to anyone who typed the URL or followed an older link. Nothing in
       * the site's chrome pointed at it (the header and footer both link
       * `/#applications`), so it was a dead end nobody meant to ship.
       *
       * Done here rather than as a `redirect()` in a page component so the route
       * has no page at all: a page that only redirects still has to carry a
       * `metadata` export to satisfy the conventions check, and that metadata
       * would describe a document no visitor ever receives.
       *
       * `permanent: false` (307) on purpose. A 308 is cached hard by browsers
       * and would be difficult to walk back on the day /applications gets a real
       * page of its own.
       */
      { source: '/applications', destination: '/#applications', permanent: false },
    ];
  },
};

export default nextConfig;

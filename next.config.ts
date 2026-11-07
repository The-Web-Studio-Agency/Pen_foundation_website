import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Every asset is local under /public/media. Add remotePatterns here if a
    // CMS is introduced — never widen this to a bare wildcard.
    remotePatterns: [],
  },

  async redirects() {
    /*
     * `permanent: false` (307) throughout: a 308 is cached hard by browsers and
     * would be difficult to walk back if any of these addresses gets a page of
     * its own again.
     */
    return [
      // No index page for the six applications: the homepage section is that
      // index, and the header's dropdown lists each one.
      { source: '/applications', destination: '/#applications', permanent: false },
      // Renamed to match the navigation labels.
      { source: '/engineering', destination: '/technology', permanent: false },
      { source: '/research', destination: '/blogs', permanent: false },
      { source: '/research/:slug', destination: '/blogs/:slug', permanent: false },
      // The old resources page is split into Docs and Certifications.
      { source: '/resources', destination: '/docs', permanent: false },
      // The design concept's address, from before it became the homepage.
      { source: '/home-v2', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;

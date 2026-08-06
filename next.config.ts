import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Every asset is local under /public/media. Add remotePatterns here if a
    // CMS is introduced — never widen this to a bare wildcard.
    remotePatterns: [],
  },
};

export default nextConfig;

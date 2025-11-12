import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const isCapacitorBuild = process.env.CAPACITOR_BUILD === 'true';

const nextConfig = {
  // For Capacitor, we need static export; otherwise use default (works better with PWA on Vercel)
  ...(isCapacitorBuild
    ? {
        output: 'export',
        images: {
          unoptimized: true,
        },
      }
    : {}),
};

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development' || process.env.CAPACITOR_BUILD === 'true',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});

export default pwaConfig(nextConfig);

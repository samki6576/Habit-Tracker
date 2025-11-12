import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const isCapacitorBuild = process.env.CAPACITOR_BUILD === 'true';

const nextConfig = {
  experimental: {
    appDir: true,
  },
  // For Capacitor, we need static export; otherwise use standalone for PWA
  ...(isCapacitorBuild
    ? {
        output: 'export',
        images: {
          unoptimized: true,
        },
      }
    : {
        output: 'standalone',
      }),
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

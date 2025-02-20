// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable font optimization since it's causing issues
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8090',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  i18n: {
    // List all languages you want to support
    locales: ['en', 'lt'],
    // Default language
    defaultLocale: 'en',
    // Optional: automatically detect user language
    localeDetection: true,
  },
};

module.exports = nextConfig;
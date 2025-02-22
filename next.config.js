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
    // Set to false to avoid detection issues
    localeDetection: false,
  },
  // Reduce memory usage during builds
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Add proper experimental features
  experimental: {
    optimizePackageImports: ['@mui/icons-material', '@mui/material'],
    optimizeCss: true,
  },
};

module.exports = nextConfig;
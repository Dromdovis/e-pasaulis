// next.config.js
const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    domains: ['localhost'],
  },
  typescript: {
    ignoreBuildErrors: false,
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
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'lt'],
    localeDetection: true,
  },
};

module.exports = nextConfig;
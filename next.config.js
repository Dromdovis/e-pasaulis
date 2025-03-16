// next.config.js
// Don't import i18n config from next-i18next anymore
// const { i18n } = require('./next-i18next.config');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Explicitly disable built-in Next.js 404 handling to use our custom one
  // This forces Next.js to use custom 404 page
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8090',
        pathname: '/**',
      },
      // Add your production Pocketbase URL
      {
        protocol: 'https', // Use HTTPS in production
        hostname: 'your-pocketbase-domain.com', // Replace with your actual domain
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
    domains: ['localhost', 'your-pocketbase-domain.com'], // Add your production domain
  },
  typescript: {
    ignoreBuildErrors: true,
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
  // i18n handled through cookies and context now, not through URL
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Handle Node.js modules in the browser environment
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Add Node.js polyfills
      config.plugins.push(new NodePolyfillPlugin());
      
      // Don't resolve certain Node.js modules on the client to prevent errors
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        http2: false,
        dns: false,
      };

      // Handle node: protocol imports
      config.resolve.alias = {
        ...config.resolve.alias,
        'node:events': 'events',
        'node:process': 'process',
        'node:util': 'util',
      };
    }

    return config;
  },
};

module.exports = nextConfig;
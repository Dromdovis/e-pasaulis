// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable font optimization since it's causing issues
  optimizeFonts: false,
  // Add other necessary configurations
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
  }
};

module.exports = nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/js/script.js',
        destination: 'https://plausible.io/js/script.js'
      },
      {
        source: '/api/event',
        destination: 'https://plausible.io/api/event'
      }
    ];
  },
};

export default nextConfig;

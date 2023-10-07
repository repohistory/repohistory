/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/login',
        has: [
          {
            type: 'cookie',
            key: 'access_token',
          },
        ],
        permanent: false,
        destination: '/',
      },
      {
        source: '/',
        has: [
          {
            type: 'cookie',
            key: 'access_token',
          },
        ],
        permanent: false,
        destination: '/dashboard',
      },
      {
        source: '/dashboard/:path*',
        missing: [{ type: 'cookie', key: 'access_token' }],
        permanent: false,
        destination: '/login',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;

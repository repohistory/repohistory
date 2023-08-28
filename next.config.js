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
        missing: [{ type: 'cookie', key: 'access_token' }],
        permanent: false,
        destination: '/login',
      },
    ];
  },
};

module.exports = nextConfig;

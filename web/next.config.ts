import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/signin',
        permanent: true,
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;

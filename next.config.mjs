/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: process.env.DASHBOARD_URL || 'dashboard.localhost:3000',
          },
        ],
        destination: '/dashboard/:path*',
      },
    ];
  },
};

export default nextConfig;

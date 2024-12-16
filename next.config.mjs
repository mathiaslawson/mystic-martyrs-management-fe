/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    serverActions: true,
  },

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://churchbackend-management.onrender.com/", 
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "localhost:3001"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://gateway-server.staging-twin.world/:path*",
      },
    ];
  },
};

module.exports = nextConfig;

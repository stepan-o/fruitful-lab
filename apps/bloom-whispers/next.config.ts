import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bloomwhispers.com",
      },
    ],
  },
  trailingSlash: true,
};

export default nextConfig;

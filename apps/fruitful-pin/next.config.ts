import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fruitfulpin.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  trailingSlash: true,
};

export default nextConfig;

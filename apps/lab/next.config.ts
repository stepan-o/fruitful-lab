import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      ...["/media/files/:path*", "/media/manifests/:path*"].map(source => ({
        source,
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      })),
      {
        source: "/media/pointers/:pack.json",
        headers: [
          { key: "Cache-Control", value: "public, max-age=30, must-revalidate" },
          { key: "Vercel-CDN-Cache-Control", value: "public, max-age=60, stale-while-revalidate=30" },
        ],
      },
    ];
  },
};

export default nextConfig;

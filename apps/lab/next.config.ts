import type { NextConfig } from "next";
import { isInternalResearchMode } from "./lib/stepanoskin/media-policy";

const nextConfig: NextConfig = {
  distDir: isInternalResearchMode() ? ".next-research" : ".next",
  // Internal reference media is never copied into production server bundles.
  outputFileTracingExcludes: { "/*": ["./assets/research/**/*"] },
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

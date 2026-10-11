import type { NextConfig } from "next";
import { isInternalResearchMode } from "./lib/stepanoskin/media-policy";

const nextConfig: NextConfig = {
  // Opt-in local profile for the 12 GB development machine. Hosting builds keep
  // their normal settings; never run this alongside another local build/dev server.
  ...(process.env.LOOPFORGE_LOW_MEMORY === "1" ? { experimental: { cpus: 1, turbopackMemoryLimit: 768 * 1024 * 1024 } } : {}),
  distDir: isInternalResearchMode() ? ".next-research" : ".next",
  // Internal reference media is never copied into production server bundles.
  outputFileTracingExcludes: { "/*": ["./assets/research/**/*"] },
  async rewrites() {
    return [{ source: "/stepanoskin/loopforge/design", destination: "/loopforge-design/index.html" }];
  },
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

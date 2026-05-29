import type { MetadataRoute } from "next";
import { CANONICAL_URL } from "@/lib/site";

export const dynamic = "force-static";

const STATIC_ROUTES = [
  "",
  "/flower-meaning-guide",
  "/flower-message-quiz",
  "/journal",
  "/journal/hibiscus-flower-meaning",
  "/podcast",
  "/shop",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return STATIC_ROUTES.map((route) => ({
    url: `${CANONICAL_URL}${route}`,
    lastModified: now,
  }));
}

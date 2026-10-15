import type { MetadataRoute } from "next";
import { getAllJournalPosts } from "@/lib/journalPosts";
import { CANONICAL_URL } from "@/lib/site";

export const dynamic = "force-static";

const STATIC_ROUTES = [
  "",
  "/flower-meaning-guide",
  "/flower-message-quiz",
  "/journal",
  "/podcast",
  "/shop",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/affiliate-disclosure",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const journalRoutes = getAllJournalPosts().flatMap((post) => [
    `/journal/${post.slug}`,
    ...post.legacyPaths,
  ]);

  return [...STATIC_ROUTES, ...journalRoutes].map((route) => ({
    url: `${CANONICAL_URL}${route}`,
    lastModified: now,
  }));
}

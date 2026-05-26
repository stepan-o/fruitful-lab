import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/content";
import { CANONICAL_URL } from "@/lib/site";

export const dynamic = "force-static";

const STATIC_ROUTES = [
  "",
  "/pinterest-services",
  "/pinterest-fit-check",
  "/resources",
  "/blog",
  "/about",
  "/contact",
  "/privacy",
  "/privacy-policy",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = STATIC_ROUTES.map((route) => ({
    url: `${CANONICAL_URL}${route}`,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const posts = BLOG_POSTS.map((post) => ({
    url: `${CANONICAL_URL}/${post.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...posts];
}

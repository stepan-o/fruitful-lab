import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/content";
import { CANONICAL_URL } from "@/lib/site";

export const dynamic = "force-static";

const STATIC_ROUTES = ["", "/services", "/how-we-work", "/resources", "/blog", "/about", "/contact", "/privacy", "/terms"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${CANONICAL_URL}${route}`,
      lastModified: now,
    })),
    ...BLOG_POSTS.map((post) => ({
      url: `${CANONICAL_URL}/blog/${post.slug}`,
      lastModified: now,
    })),
  ];
}

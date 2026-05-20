import { BLOG_POSTS, SERVICE_PACKAGES } from "@/lib/content";
import { CANONICAL_URL, FOOTER_LINKS, PRIMARY_NAV, SITE_NAME } from "@/lib/site";

describe("Fruitful Pin site config", () => {
  it("keeps the canonical Fruitful Pin identity separate from Fruitful Lab", () => {
    expect(SITE_NAME).toBe("Fruitful Pin");
    expect(CANONICAL_URL).toBe("https://fruitfulpin.com");
  });

  it("defines stable public navigation paths for the marketing foundation", () => {
    expect(PRIMARY_NAV.map((item) => item.href)).toEqual([
      "/pinterest-services",
      "/resources",
      "/blog",
      "/case-studies",
      "/about",
      "/contact",
    ]);

    expect(FOOTER_LINKS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "/privacy-policy" }),
        expect.objectContaining({ href: "/terms" }),
      ]),
    );
  });

  it("preserves current Fruitful Pin service and post URL shapes", () => {
    expect(SERVICE_PACKAGES.map((service) => service.title)).toEqual([
      "Full-Funnel Pinterest Growth",
      "Organic Pinterest Management",
      "Pinterest Ads Management",
    ]);

    expect(BLOG_POSTS.map((post) => `/${post.slug}`)).toEqual([
      "/pinterest-marketing-for-gardening-brands",
      "/pinterest-organic-vs-ads",
      "/pinterest-in-2026-for-product-brands",
    ]);
  });
});

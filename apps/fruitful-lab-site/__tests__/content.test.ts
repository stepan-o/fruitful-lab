import { BLOG_POSTS, SERVICE_PACKAGES } from "@/lib/content";
import { CANONICAL_URL, CONTACT_EMAIL, FOOTER_LINKS, PRIMARY_NAV, SITE_NAME } from "@/lib/site";

describe("Fruitful Lab customer site config", () => {
  it("keeps the customer-facing domain separate from the sandbox domain", () => {
    expect(SITE_NAME).toBe("Fruitful Lab");
    expect(CANONICAL_URL).toBe("https://fruitfulab.com");
    expect(CANONICAL_URL).not.toContain("fruitfullab");
    expect(CANONICAL_URL).not.toContain("fruitfulab.net");
    expect(CONTACT_EMAIL).toBe("hello@fruitfulab.com");
  });

  it("defines stable public navigation paths for the marketing foundation", () => {
    expect(PRIMARY_NAV.map((item) => item.href)).toEqual([
      "/services",
      "/how-we-work",
      "/resources",
      "/blog",
      "/about",
      "/contact",
    ]);

    expect(FOOTER_LINKS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "/privacy" }),
        expect.objectContaining({ href: "/terms" }),
      ]),
    );
  });

  it("starts with the agreed service and blog skeleton", () => {
    expect(SERVICE_PACKAGES.map((service) => service.title)).toEqual([
      "Fit Call",
      "Growth Systems Diagnostic",
      "Implementation Sprint",
      "Scale Partnership",
    ]);

    expect(BLOG_POSTS.map((post) => `/blog/${post.slug}`)).toEqual([
      "/blog/which-growth-system-to-build-first",
      "/blog/ai-workflows-that-keep-your-brand-human",
      "/blog/content-needs-a-conversion-path",
    ]);
  });
});

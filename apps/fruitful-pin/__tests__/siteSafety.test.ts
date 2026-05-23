import fs from "node:fs";
import path from "node:path";
import { generateMetadata, generateStaticParams } from "@/app/[slug]/page";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { BLOG_POSTS } from "@/lib/content";
import { CANONICAL_URL, FOOTER_LINKS, PRIMARY_NAV } from "@/lib/site";

const PUBLIC_COPY_SOURCES = [
  "app/page.tsx",
  "app/[slug]/page.tsx",
  "app/about/page.tsx",
  "app/blog/page.tsx",
  "app/case-studies/page.tsx",
  "app/contact/page.tsx",
  "app/pinterest-services/page.tsx",
  "app/pinterest-fit-check/page.tsx",
  "app/privacy/page.tsx",
  "app/resources/page.tsx",
  "app/terms/page.tsx",
  "components/ServicesPage.tsx",
  "components/PinterestFitAssessmentEmbed.tsx",
  "components/ContactForm.tsx",
  "lib/fitAssessment.ts",
  "lib/content.ts",
] as const;

const BANNED_VISITOR_COPY = [
  /a place for/i,
  /coming soon/i,
  /exact copy can be refined/i,
  /for now/i,
  /future lead magnets/i,
  /future resources/i,
  /get more specific later/i,
  /prototype/i,
  /first-pass/i,
  /placeholder until/i,
  /no dns/i,
  /no email required/i,
  /calendar link is still/i,
  /can live here/i,
  /placeholder\./i,
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

describe("Fruitful Pin SEO and route safety", () => {
  it("lists every public navigation route and post in the sitemap without duplicates", () => {
    const sitemapUrls = sitemap().map((entry) => entry.url);
    const expectedInternalRoutes = [
      "",
      "/services",
      "/privacy",
      ...PRIMARY_NAV.map((item) => (item.href === "/" ? "" : item.href)),
      ...FOOTER_LINKS.map((item) => item.href),
      ...BLOG_POSTS.map((post) => `/${post.slug}`),
    ];

    expect(new Set(sitemapUrls).size).toBe(sitemapUrls.length);

    for (const route of expectedInternalRoutes) {
      expect(sitemapUrls).toContain(`${CANONICAL_URL}${route}`);
    }
  });

  it("keeps robots.txt open and pointed at the canonical Fruitful Pin sitemap", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: `${CANONICAL_URL}/sitemap.xml`,
    });
  });

  it("keeps all blog posts statically generated at root-level slugs with metadata", async () => {
    expect(generateStaticParams()).toEqual(BLOG_POSTS.map((post) => ({ slug: post.slug })));

    for (const post of BLOG_POSTS) {
      await expect(generateMetadata({ params: Promise.resolve({ slug: post.slug }) })).resolves.toEqual({
        title: post.title,
        description: post.excerpt,
      });
    }
  });

  it("keeps article template data rich enough for Pinterest distribution and reader navigation", () => {
    const richPost = BLOG_POSTS.find((post) => post.slug === "pinterest-organic-vs-ads");

    expect(richPost).toBeDefined();
    expect(richPost?.featuredPinGraphic).toBeDefined();
    expect(richPost?.pinGraphics).toHaveLength(2);
    expect(richPost?.pullQuote).toBeTruthy();
    expect(richPost?.comparisonTable?.rows.length).toBeGreaterThanOrEqual(3);
    expect(richPost?.faqs?.length).toBeGreaterThanOrEqual(3);

    for (const post of BLOG_POSTS) {
      expect(post.keyTakeaways.length).toBeGreaterThanOrEqual(3);
      expect(post.sections.length).toBeGreaterThanOrEqual(3);
      expect(new Set(post.sections.map((section) => slugify(section.heading))).size).toBe(post.sections.length);
    }
  });

  it("keeps implementation-status language out of visitor-facing page source", () => {
    for (const file of PUBLIC_COPY_SOURCES) {
      const source = fs.readFileSync(path.join(process.cwd(), file), "utf8");

      for (const phrase of BANNED_VISITOR_COPY) {
        expect(source).not.toMatch(phrase);
      }
    }
  });

  it("keeps the public typography and button system aligned with the Fruitful Pin art direction", () => {
    const globals = fs.readFileSync(path.join(process.cwd(), "app/globals.css"), "utf8");

    expect(globals).toContain("family=Poppins");
    expect(globals).toContain('--font-body: "Poppins"');
    expect(globals).toContain("--headline-hero:");
    expect(globals).toContain(".text-gradient");
    expect(globals).toContain("font-style: italic");
    expect(globals).toContain(".button-outline");
    expect(globals).toContain("border-radius: 999px");
    expect(globals).toContain("animation: button-glow-pulse");
    expect(globals).not.toContain("Raleway");
  });
});

import { AUDIENCE_PATHS, BLOG_POSTS, CERTIFICATION_BADGES, FAQS, NICE_WORDS, PIN_SYSTEM_PILLARS, RESOURCE_ITEMS, SERVICE_PACKAGES, TESTIMONIALS, TRUST_LOGOS } from "@/lib/content";
import { PINTEREST_FIT_ASSESSMENT_MAX_SCORE, PINTEREST_FIT_ASSESSMENT_QUESTIONS, scorePinterestFitAssessment } from "@/lib/fitAssessment";
import {
  CALENDAR_EMBED_PATH,
  CALENDAR_URL,
  CANONICAL_URL,
  CONTACT_EMAIL_URL,
  FIT_CALL_LABEL,
  FOOTER_LINKS,
  PINTEREST_FIT_CHECK_URL,
  PINTEREST_READINESS_CHECK_URL,
  PRIMARY_NAV,
  SITE_NAME,
} from "@/lib/site";
import sitemap from "@/app/sitemap";

describe("Fruitful Pin site config", () => {
  it("keeps the canonical Fruitful Pin identity separate from Fruitful Lab", () => {
    expect(SITE_NAME).toBe("Fruitful Pin");
    expect(CANONICAL_URL).toBe("https://fruitfulpin.com");
  });

  it("defines stable public navigation paths for the marketing foundation", () => {
    expect(PRIMARY_NAV.map((item) => item.href)).toEqual([
      "/",
      "/blog",
      "/pinterest-services",
      "/resources",
      "/about",
    ]);

    expect(FOOTER_LINKS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "/resources" }),
        expect.objectContaining({ href: "/contact" }),
        expect.objectContaining({ href: "/privacy-policy" }),
        expect.objectContaining({ href: "/terms" }),
      ]),
    );
    expect(FOOTER_LINKS).not.toEqual(expect.arrayContaining([expect.objectContaining({ href: "/case-studies" })]));
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
      "/pinterest-for-product-based-business",
      "/before-and-after-pins-the-secret-weapon-for-home-renovation-marketing-on-pinterest",
      "/pinterest-marketing-for-gardening-brands-the-key-to-conquer-urban-markets",
      "/exploring-pinterest-management-what-does-a-pinterest-manager-do",
    ]);
  });

  it("keeps the local content contract rich enough for the first reviewable site", () => {
    expect(PIN_SYSTEM_PILLARS).toHaveLength(4);
    expect(AUDIENCE_PATHS).toHaveLength(3);
    expect(RESOURCE_ITEMS.every((item) => item.ctaLabel && item.ctaHref)).toBe(true);
    expect(FAQS.length).toBeGreaterThanOrEqual(3);
    expect(TRUST_LOGOS.length).toBeGreaterThanOrEqual(5);
    expect(TESTIMONIALS.length).toBeGreaterThanOrEqual(3);
    expect(NICE_WORDS.length).toBeGreaterThanOrEqual(4);
    expect(CERTIFICATION_BADGES).toHaveLength(2);
    expect(FIT_CALL_LABEL).toBe("Book a Fit Call");
    expect(CALENDAR_URL).toBe("https://tidycal.com/susycid/is-pinterest-a-good-fit-for-your-brand");
    expect(CALENDAR_EMBED_PATH).toBe("susycid/is-pinterest-a-good-fit-for-your-brand");
    expect(CONTACT_EMAIL_URL).toContain("mailto:hello@fruitfulpin.com");
    expect(PINTEREST_FIT_CHECK_URL).toBe("/pinterest-fit-check");
    expect(PINTEREST_READINESS_CHECK_URL).toBe("/pinterest-readiness-check");
    expect(RESOURCE_ITEMS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Pinterest Readiness Check",
          status: "Ready now",
          ctaLabel: "Take the Readiness Check",
          ctaHref: "/pinterest-readiness-check",
        }),
      ]),
    );
  });

  it("keeps the native Fruitful Pin fit check complete and scored", () => {
    expect(PINTEREST_FIT_ASSESSMENT_QUESTIONS).toHaveLength(7);
    expect(PINTEREST_FIT_ASSESSMENT_MAX_SCORE).toBe(25);

    const strongestAnswers = Object.fromEntries(
      PINTEREST_FIT_ASSESSMENT_QUESTIONS.map((question) => [question.id, question.options[0].id]),
    );
    const weakestAnswers = Object.fromEntries(
      PINTEREST_FIT_ASSESSMENT_QUESTIONS.map((question) => [question.id, question.options[question.options.length - 1].id]),
    );

    expect(scorePinterestFitAssessment(strongestAnswers).outcome.id).toBe("strong-fit");
    expect(scorePinterestFitAssessment(weakestAnswers).outcome.id).toBe("later-fit");
  });

  it("publishes SEO routes for the preserved public pages and root-level posts", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("https://fruitfulpin.com/pinterest-services");
    expect(urls).toContain("https://fruitfulpin.com/pinterest-fit-check");
    expect(urls).toContain("https://fruitfulpin.com/pinterest-readiness-check");
    expect(urls).toContain("https://fruitfulpin.com/resources");
    expect(urls).toContain("https://fruitfulpin.com/pinterest-organic-vs-ads");
    expect(urls).not.toContain("https://fruitfulpin.com/services");
    expect(urls).not.toContain("https://fruitfulpin.com/case-studies");
  });
});

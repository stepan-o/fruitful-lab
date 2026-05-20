import { CANONICAL_URL, FOOTER_LINKS, PRIMARY_NAV, SITE_NAME } from "@/lib/site";

describe("Fruitful Pin site config", () => {
  it("keeps the canonical Fruitful Pin identity separate from Fruitful Lab", () => {
    expect(SITE_NAME).toBe("Fruitful Pin");
    expect(CANONICAL_URL).toBe("https://fruitfulpin.com");
  });

  it("defines stable public navigation paths for the marketing foundation", () => {
    expect(PRIMARY_NAV.map((item) => item.href)).toEqual([
      "/services",
      "/blog",
      "/case-studies",
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
});

import { HOME_FEATURES, LETTERS, RITUALS } from "@/lib/content";
import { CANONICAL_URL, CONTACT_EMAIL, FOOTER_LINKS, PRIMARY_NAV, SITE_NAME } from "@/lib/site";

describe("Bloom Whispers site foundation", () => {
  it("uses the Bloom Whispers brand and canonical domain", () => {
    expect(SITE_NAME).toBe("Bloom Whispers");
    expect(CANONICAL_URL).toBe("https://bloomwhispers.com");
    expect(CONTACT_EMAIL).toBe("hello@bloomwhispers.com");
  });

  it("defines stable first-pass navigation", () => {
    expect(PRIMARY_NAV.map((item) => item.href)).toEqual([
      "/flower-meaning-guide",
      "/journal",
      "/podcast",
      "/flower-message-quiz",
      "/about",
      "/shop",
    ]);
    expect(FOOTER_LINKS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: "/flower-meaning-guide" }),
        expect.objectContaining({ href: "/journal" }),
        expect.objectContaining({ href: "/shop" }),
        expect.objectContaining({ href: "/privacy" }),
        expect.objectContaining({ href: "/terms" }),
      ]),
    );
  });

  it("keeps the first-pass editorial content collections available", () => {
    expect(LETTERS).toHaveLength(3);
    expect(RITUALS).toHaveLength(3);
    expect(HOME_FEATURES.map((feature) => feature.href)).toEqual(["/letters", "/rituals", "/about"]);
  });
});

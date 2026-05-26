export const SITE_NAME = "Fruitful Pin";
export const CANONICAL_URL = "https://fruitfulpin.com";
export const SITE_DESCRIPTION =
  "Warm, strategic Pinterest marketing for brands that want their best content, products, and offers to keep getting discovered.";
export const FIT_CALL_LABEL = "Book a Fit Call";
export const BOOKING_URL = "/contact";
export const PINTEREST_FIT_CHECK_URL = "/pinterest-fit-check";
export const CALENDAR_URL = "https://tidycal.com/susycid/is-pinterest-a-good-fit-for-your-brand";
export const CALENDAR_EMBED_PATH = "susycid/is-pinterest-a-good-fit-for-your-brand";
export const CONTACT_EMAIL = "hello@fruitfulpin.com";
export const CONTACT_EMAIL_URL = `mailto:${CONTACT_EMAIL}?subject=Fruitful%20Pin%20Fit%20Call`;

export const PRIMARY_NAV = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Services", href: "/pinterest-services" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
] as const;

export const FOOTER_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Services", href: "/pinterest-services" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
] as const;

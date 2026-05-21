export const SITE_NAME = "Fruitful Lab";
export const CANONICAL_URL = "https://fruitfulab.com";
export const SITE_DESCRIPTION =
  "AI-aware marketing systems, funnels, paid media, email, and content strategy for service businesses and growing brands.";
export const BOOKING_URL = process.env.NEXT_PUBLIC_TIDYCAL_URL ?? "https://tidycal.com/susycid";
export const CONTACT_EMAIL = "hello@fruitfulab.com";

export const PRIMARY_NAV = [
  { label: "Services", href: "/services" },
  { label: "Resources", href: "/resources" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Resources", href: "/resources" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

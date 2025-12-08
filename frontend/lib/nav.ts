// frontend/lib/nav.ts
// Centralized public navigation config for header, hub cards, footer, etc.
// Pure types + data only — do not import React components here.

export type PublicNavLink = {
  href: string;
  label: string;
  external?: boolean;
};

export const PUBLIC_NAV_LINKS: PublicNavLink[] = [
  { href: "/tools", label: "Tools & Calculators" },
  { href: "/case-studies", label: "Case Studies" },
  {
    href: "https://fruitfulpin.com",
    label: "Main Agency Site",
    external: true,
  },
];

// Future: section-level summaries for cards/strips on the hub landing.
// export const PUBLIC_SECTION_SUMMARIES = { ... };

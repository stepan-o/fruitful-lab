// frontend/lib/nav.ts
// Centralized navigation config for header, contractor header, footer, etc.
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

/**
 * Contractor routes (must reflect the real URL paths produced by app router):
 *
 * With:
 *   frontend/app/(contractor)/cont/page.tsx
 *   frontend/app/(contractor)/cont/fruitful-qa/page.tsx
 *
 * URLs are:
 *   /cont
 *   /cont/fruitful-qa
 */
export const CONTRACTOR_NAV_LINKS = [
    { label: "Contractor Home", href: "/cont" },
    { label: "Submit Your Work (QA)", href: "/cont/fruitful-qa" },
    { label: "Public Tools", href: "/tools" },
] as const;

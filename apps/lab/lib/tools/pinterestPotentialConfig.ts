// frontend/lib/tools/pinterestPotentialConfig.ts
// Canonical variant config for the Pinterest Potential Calculator (vNext / v0.2).
// Pure types + data only (no React imports).

/**
 * Single canonical naming convention:
 * - Variants are now "welcome" | "no_welcome"
 * - Cookie `pp_variant` stores these values directly
 * - GrowthBook experiment variants must match these values
 * - Page resolver normalizes against these values
 */

export type PinterestPotentialVariant = "welcome" | "no_welcome";

export const DEFAULT_VARIANT: PinterestPotentialVariant = "welcome";

// Lightly typed list so we can iterate / validate later.
export const ALL_VARIANTS: readonly PinterestPotentialVariant[] = [
    "welcome",
    "no_welcome",
] as const;

// Feature flag: when false, no cookies or randomness are used by the resolver.
// Behavior remains: DEFAULT_VARIANT with optional ?variant= override.
export const ENABLE_AB_SPLIT = false;

// Cookie name for variant stickiness (used when A/B is enabled or when middleware assigns).
export const PINTEREST_POTENTIAL_VARIANT_COOKIE = "pp_variant";
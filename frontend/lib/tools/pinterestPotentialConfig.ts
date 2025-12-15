// frontend/lib/tools/pinterestPotentialConfig.ts
// Version config for the Pinterest Potential Calculator.
// Pure types + data only (no React imports).

export type PinterestPotentialVariant = "v1" | "v2";

export const DEFAULT_VARIANT: PinterestPotentialVariant = "v1";

// Lightly typed list so we can iterate / validate later.
export const ALL_VARIANTS: PinterestPotentialVariant[] = ["v1", "v2"];

// Feature flag: when false, no cookies or randomness are used by the resolver.
// Behavior remains: DEFAULT_VARIANT with optional ?variant= override.
export const ENABLE_AB_SPLIT = false;

// Cookie name for future variant stickiness (used only when A/B is enabled).
export const PINTEREST_POTENTIAL_VARIANT_COOKIE = "pp_variant";

// Note for future-us:
// Today the default/override logic lives in the page.tsx resolver. When we
// switch to GrowthBook-driven assignment (potentially from middleware), we’ll
// either replace that resolver with a GB flag lookup or simply respect a
// cookie set by middleware (e.g., via applyExperimentCookies). No behavior
// changes until that migration happens.

// Future: additional flags for A/B, rollout %, etc. can live here.

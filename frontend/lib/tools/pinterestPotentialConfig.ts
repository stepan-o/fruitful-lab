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

// Future: additional flags for A/B, rollout %, etc. can live here.

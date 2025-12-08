// frontend/lib/tools/pinterestPotentialConfig.ts
// Version config for the Pinterest Potential Calculator.
// Pure types + data only (no React imports).

export type PinterestPotentialVariant = "v1" | "v2";

export const DEFAULT_VARIANT: PinterestPotentialVariant = "v1";

// Lightly typed list so we can iterate / validate later.
export const ALL_VARIANTS: PinterestPotentialVariant[] = ["v1", "v2"];

// Future: flags for A/B, rollout %, etc. can live here.

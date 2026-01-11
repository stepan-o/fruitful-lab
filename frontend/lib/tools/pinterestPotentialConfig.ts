// frontend/lib/tools/pinterestPotentialConfig.ts
// Version config for the Pinterest Potential Calculator.
// Pure types + data only (no React imports).

/**
 * IMPORTANT (vNext / v0.2):
 * We are reusing the existing "v1" / "v2" variant plumbing (cookies, GrowthBook, resolver).
 *
 * We *interpret* these internally as the start-experience A/B:
 * - v1 => welcome
 * - v2 => no_welcome
 *
 * Analytics + product spec talk in terms of "welcome" vs "no_welcome".
 */

export type PinterestPotentialVariant = "v1" | "v2";

/** Spec-level naming for the start experience A/B. */
export type PinterestPotentialStartExperience = "welcome" | "no_welcome";

/**
 * Canonical mapping between infra variants (v1/v2) and spec variants (welcome/no_welcome).
 * Use this everywhere you emit ppc_* events.
 */
export const VARIANT_TO_START_EXPERIENCE: Record<
    PinterestPotentialVariant,
    PinterestPotentialStartExperience
> = {
    v1: "welcome",
    v2: "no_welcome",
} as const;

export const START_EXPERIENCE_TO_VARIANT: Record<
    PinterestPotentialStartExperience,
    PinterestPotentialVariant
> = {
    welcome: "v1",
    no_welcome: "v2",
} as const;

/**
 * Optional: allow human-readable query param aliases later without changing routing.
 * (Page resolver can normalize welcome/no_welcome into v1/v2 if we want.)
 */
export const VARIANT_ALIASES: Record<string, PinterestPotentialVariant> = {
    v1: "v1",
    v2: "v2",
    welcome: "v1",
    no_welcome: "v2",
};

export const DEFAULT_VARIANT: PinterestPotentialVariant = "v1";

// Lightly typed list so we can iterate / validate later.
export const ALL_VARIANTS: PinterestPotentialVariant[] = ["v1", "v2"];

// Feature flag: when false, no cookies or randomness are used by the resolver.
// Behavior remains: DEFAULT_VARIANT with optional ?variant= override.
export const ENABLE_AB_SPLIT = false;

// Cookie name for future variant stickiness (used only when A/B is enabled).
export const PINTEREST_POTENTIAL_VARIANT_COOKIE = "pp_variant";

/**
 * Note:
 * - GrowthBook experiment config already uses ["v1","v2"].
 * - Middleware already sets pp_variant.
 * - We keep that stable, and translate to welcome/no_welcome only at the product layer.
 */
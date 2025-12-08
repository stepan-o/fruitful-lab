// frontend/app/tools/pinterest-potential/page.tsx
// Version-switching entry point for the Pinterest Potential Calculator flow.
import {
  DEFAULT_VARIANT,
  ALL_VARIANTS,
  type PinterestPotentialVariant,
  ENABLE_AB_SPLIT,
  PINTEREST_POTENTIAL_VARIANT_COOKIE,
} from "@/lib/tools/pinterestPotentialConfig";
import { PinterestPotentialV1 } from "@/components/tools/pinterestPotential/PinterestPotentialV1";
import { PinterestPotentialV2 } from "@/components/tools/pinterestPotential/PinterestPotentialV2";
import { cookies } from "next/headers";

// This page must be dynamic to respect query param overrides like ?variant=v2
export const dynamic = "force-dynamic";

const VARIANT_COMPONENTS: Record<
  PinterestPotentialVariant,
  React.ComponentType
> = {
  v1: PinterestPotentialV1,
  v2: PinterestPotentialV2,
};

type PageProps = {
  searchParams?: { variant?: string };
};

export default async function PinterestPotentialPage({ searchParams }: PageProps) {
  const variant = await resolvePinterestPotentialVariant(searchParams?.variant);
  const VariantComponent = VARIANT_COMPONENTS[variant];
  return <VariantComponent />;
}

/**
 * Variant resolution order:
 * 1) If a valid `?variant=` is provided, always honor it (debugging / manual override).
 * 2) If A/B is disabled, fall back to DEFAULT_VARIANT (no cookies, no randomness).
 * 3) If A/B is enabled (future):
 *    - If a valid cookie exists, use that.
 *    - Otherwise, randomly pick a variant, set cookie, and return it.
 */
async function resolvePinterestPotentialVariant(
  requested?: string
): Promise<PinterestPotentialVariant> {
  const normalized = requested?.toLowerCase() as
    | PinterestPotentialVariant
    | undefined;

  // 1) Query override (always allowed for debugging / direct links)
  if (normalized && (ALL_VARIANTS as string[]).includes(normalized)) {
    return normalized;
  }

  // 2) No A/B split: behave exactly like previous implementation
  if (!ENABLE_AB_SPLIT) {
    return DEFAULT_VARIANT;
  }

  // 3) A/B split enabled (future): use cookie or assign one
  const cookieStore = await cookies();
  const existing = cookieStore.get(PINTEREST_POTENTIAL_VARIANT_COOKIE)?.value as
    | PinterestPotentialVariant
    | undefined;

  if (existing && (ALL_VARIANTS as string[]).includes(existing)) {
    return existing;
  }

  // No valid cookie → assign variant randomly (simple even split)
  const randomIndex = Math.floor(Math.random() * ALL_VARIANTS.length);
  const chosen = ALL_VARIANTS[randomIndex];

  // Scope cookie reasonably to this tool path, stick for ~30 days
  // next/headers cookies() setter may not be typed the same across versions; cast to any for future path
  (cookieStore as any).set(PINTEREST_POTENTIAL_VARIANT_COOKIE, chosen, {
    path: "/tools/pinterest-potential",
    maxAge: 60 * 60 * 24 * 30,
  });

  return chosen;
}
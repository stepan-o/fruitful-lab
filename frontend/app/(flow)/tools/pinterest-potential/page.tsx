// frontend/app/(flow)/tools/pinterest-potential/page.tsx
// Version-switching entry point for the Pinterest Potential Calculator flow.
import {
  DEFAULT_VARIANT,
  ALL_VARIANTS,
  type PinterestPotentialVariant,
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
  // Read the cookie set by middleware-based assignment
  const cookieStore = await cookies();
  const cookieVariant = cookieStore.get(PINTEREST_POTENTIAL_VARIANT_COOKIE)?.value;
  const requestedVariant = searchParams?.variant;
  const variant = resolvePinterestPotentialVariant(requestedVariant, cookieVariant);
  const VariantComponent = VARIANT_COMPONENTS[variant];
  return <VariantComponent />;
}

/**
 * Variant resolution order for the calculator (no GrowthBook calls here):
 * 1) If a valid ?variant= is provided, honor it (debug/QA override).
 * 2) Otherwise, if a valid cookie value exists, use it (middleware-assigned).
 * 3) Otherwise, fall back to DEFAULT_VARIANT.
 */
export function resolvePinterestPotentialVariant(
  requested?: string,
  cookieValue?: string,
): PinterestPotentialVariant {
  const reqNorm = normalizeVariant(requested);
  if (reqNorm) return reqNorm;

  const cookieNorm = normalizeVariant(cookieValue);
  if (cookieNorm) return cookieNorm;

  return DEFAULT_VARIANT;
}

export function normalizeVariant(value?: string): PinterestPotentialVariant | undefined {
  if (!value) return undefined;
  const lower = value.toLowerCase();
  if ((ALL_VARIANTS as string[]).includes(lower)) {
    return lower as PinterestPotentialVariant;
  }
  return undefined;
}

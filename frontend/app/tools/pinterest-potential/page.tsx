// frontend/app/tools/pinterest-potential/page.tsx
// Version-switching entry point for the Pinterest Potential Calculator flow.

import {
  DEFAULT_VARIANT,
  ALL_VARIANTS,
  type PinterestPotentialVariant,
} from "@/lib/tools/pinterestPotentialConfig";
import { PinterestPotentialV1 } from "@/components/tools/pinterestPotential/PinterestPotentialV1";
import { PinterestPotentialV2 } from "@/components/tools/pinterestPotential/PinterestPotentialV2";

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

export default function PinterestPotentialPage({ searchParams }: PageProps) {
  const variant = resolvePinterestPotentialVariant(searchParams?.variant);
  const VariantComponent = VARIANT_COMPONENTS[variant];
  return <VariantComponent />;
}

// For now, this resolver only supports:
// - Default variant from config
// - Optional override via ?variant=v2 (or v1)
// Future (Epic I4): extend to cookies / random split for A/B tests.
function resolvePinterestPotentialVariant(
  requested?: string
): PinterestPotentialVariant {
  const normalized = requested?.toLowerCase() as
    | PinterestPotentialVariant
    | undefined;

  if (normalized && (ALL_VARIANTS as string[]).includes(normalized)) {
    return normalized;
  }
  return DEFAULT_VARIANT;
}

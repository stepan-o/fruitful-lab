// frontend/lib/growthbook/middleware.ts
import type { NextRequest, NextResponse } from "next/server";
import { growthbookAdapter } from "@/lib/growthbook/flags";
import { identify } from "@/lib/identify";
import {
  PINTEREST_POTENTIAL_EXPERIMENT,
  type ExperimentKey,
} from "@/lib/experiments/config";
import { PINTEREST_POTENTIAL_VARIANT_COOKIE } from "@/lib/tools/pinterestPotentialConfig";
import { runServerExperiment } from "@/lib/growthbook/experiments";

// Cookie naming convention for experiments
const EXP_COOKIE_PREFIX = "exp_";
export function getExperimentCookieName(key: ExperimentKey): string {
  return `${EXP_COOKIE_PREFIX}${key}`;
}

type VariantKey = (typeof PINTEREST_POTENTIAL_EXPERIMENT.variants)[number];

// Validate a raw string against the Pinterest Potential experiment variants
export function normalizeVariant(raw: string | undefined): VariantKey | undefined {
  if (!raw) return undefined;
  return PINTEREST_POTENTIAL_EXPERIMENT.variants.includes(raw as VariantKey)
    ? (raw as VariantKey)
    : undefined;
}

// Local weighted picker (fallback if GrowthBook unavailable)
export function chooseVariantFromWeights(
  variants: VariantKey[],
  weightsInput?: Partial<Record<VariantKey, number>>,
): VariantKey {
  const weights = variants.map((v) => (weightsInput?.[v] ?? 1));
  if (weights.length !== variants.length) {
    const idx = Math.floor(Math.random() * variants.length);
    return variants[idx];
  }
  const total = weights.reduce((sum, w) => sum + (Number.isFinite(w) ? w : 0), 0) || variants.length;
  const r = Math.random() * total;
  let acc = 0;
  for (let i = 0; i < variants.length; i++) {
    acc += weights[i];
    if (r <= acc) return variants[i];
  }
  return variants[variants.length - 1];
}

/**
 * Assigns/persists experiment variants via cookies. Uses GrowthBook first,
 * falls back to local weights if GB is unavailable. Idempotent: if a valid
 * cookie already exists, does nothing.
 */
export async function applyExperimentCookies(
  req: NextRequest,
  res: NextResponse,
): Promise<void> {
  // Scope J2 to a single experiment for now
  const exp = PINTEREST_POTENTIAL_EXPERIMENT;
  // Use the shared cookie name constant so page and middleware stay in sync
  const cookieName = PINTEREST_POTENTIAL_VARIANT_COOKIE;

  // 1) Respect an existing valid cookie
  const existingRaw = req.cookies.get(cookieName)?.value;
  const existing = normalizeVariant(existingRaw);
  if (existing) return;

  // 2) Delegate to server experiment runner (uses GB then fallback)
  const { variant: chosen } = await runServerExperiment(exp);

  // 4) Persist cookie for future requests
  res.cookies.set(cookieName, chosen, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 90, // ~90 days
  });
}

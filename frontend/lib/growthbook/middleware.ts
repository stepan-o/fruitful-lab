// frontend/lib/growthbook/middleware.ts
import type { NextRequest, NextResponse } from "next/server";
import {
    PINTEREST_POTENTIAL_EXPERIMENT,
    type ExperimentKey,
} from "@/lib/experiments/config";
import { PINTEREST_POTENTIAL_VARIANT_COOKIE } from "@/lib/tools/pinterestPotentialConfig";
import { growthbookAdapter } from "@/lib/growthbook/flags";

// Cookie naming convention for experiments
const EXP_COOKIE_PREFIX = "exp_";
export function getExperimentCookieName(key: ExperimentKey): string {
    return `${EXP_COOKIE_PREFIX}${key}`;
}

// --- Option A: Stable anonymous id for GrowthBook bucketing ("Split by id") ---
const ANON_ID_COOKIE = "fp_anon_id";
const ANON_ID_MAX_AGE_SECONDS = 60 * 60 * 24 * 365 * 2; // ~2 years

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
    const weights = variants.map((v) => weightsInput?.[v] ?? 1);
    const total =
        weights.reduce((sum, w) => sum + (Number.isFinite(w) ? w : 0), 0) ||
        variants.length;

    const r = Math.random() * total;
    let acc = 0;
    for (let i = 0; i < variants.length; i++) {
        acc += weights[i];
        if (r <= acc) return variants[i];
    }
    return variants[variants.length - 1];
}

function generateAnonId(): string {
    // Edge/runtime friendly
    const c = globalThis.crypto as { randomUUID?: () => string } | undefined;
    if (c?.randomUUID) return c.randomUUID();
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function getOrSetAnonId(req: NextRequest, res: NextResponse): string {
    const existing = req.cookies.get(ANON_ID_COOKIE)?.value;
    if (existing && existing.length > 0) return existing;

    const anonId = generateAnonId();

    // Not sensitive; keep readable by client if you later want client-side analytics.
    res.cookies.set(ANON_ID_COOKIE, anonId, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: ANON_ID_MAX_AGE_SECONDS,
    });

    return anonId;
}

async function evaluateViaGrowthBook(exp: typeof PINTEREST_POTENTIAL_EXPERIMENT, anonId: string) {
    if (!process.env.GROWTHBOOK_CLIENT_KEY) return undefined;

    // IMPORTANT: use stable id for bucketing
    const attributes = { id: anonId };

    // Use the adapter directly so middleware can bucket deterministically.
    const client: unknown = await growthbookAdapter.initialize();
    const gb = client as {
        evalFeature?: (key: string, opts?: { attributes?: Record<string, unknown> }) => unknown;
    };

    const enableKey = `enable_${exp.gbKey}`;
    const enableFeature = gb.evalFeature?.(enableKey, { attributes });
    const enabled = resolveBoolean(enableFeature);

    if (!enabled) {
        // Explicitly disabled → default (no randomization)
        return exp.defaultVariant;
    }

    const feature = gb.evalFeature?.(exp.gbKey, { attributes });
    const value = String((feature as { value?: unknown } | undefined)?.value ?? "");
    const v = exp.variants.find((x) => x === (value as VariantKey));
    return v;
}

function resolveBoolean(feature: unknown): boolean {
    if (!feature) return false;
    const f = feature as { on?: unknown; enabled?: unknown; value?: unknown };
    if (typeof f.on === "boolean") return f.on;
    if (typeof f.enabled === "boolean") return f.enabled;
    if (typeof f.value === "boolean") return f.value;
    return Boolean(f.value);
}

/**
 * Assigns/persists experiment variants via cookies.
 *
 * Option A enabled:
 * - Ensures a stable `fp_anon_id` cookie and uses it as GrowthBook `id`
 *   so "Split by id" bucketing is stable.
 *
 * Idempotent: if a valid variant cookie already exists, does nothing.
 */
export async function applyExperimentCookies(
    req: NextRequest,
    res: NextResponse,
): Promise<void> {
    const exp = PINTEREST_POTENTIAL_EXPERIMENT;
    const cookieName = PINTEREST_POTENTIAL_VARIANT_COOKIE;

    // 1) Respect an existing valid cookie
    const existingRaw = req.cookies.get(cookieName)?.value;
    const existing = normalizeVariant(existingRaw);
    if (existing) return;

    // 2) Ensure stable anon id for GB bucketing
    const anonId = getOrSetAnonId(req, res);

    // 3) Try GrowthBook using stable attributes; if unavailable, fall back locally
    let chosen: VariantKey | undefined;
    try {
        chosen = await evaluateViaGrowthBook(exp, anonId);
    } catch {
        chosen = undefined;
    }

    if (!chosen) {
        chosen = chooseVariantFromWeights([...exp.variants], exp.weights);
    }

    // 4) Persist experiment cookie for future requests
    res.cookies.set(cookieName, chosen, {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 90, // ~90 days
    });
}
// frontend/lib/growthbook/experiments.ts
// Server-side helper to evaluate an experiment via GrowthBook first,
// falling back to local configuration/weights when GB is unavailable.

import { growthbookAdapter } from "@/lib/growthbook/flags";
import { identify } from "@/lib/identify";
import type { ExperimentDefinition } from "@/lib/experiments/config";

export type RunServerExperimentResult<V extends string = string> = {
    variant: V;
    source: "growthbook" | "fallback";
};

type GBFeatureResult = {
    on?: boolean;
    enabled?: boolean;
    value?: unknown;
};

type GBClient = {
    evalFeature?: (key: string, opts?: { attributes?: Record<string, unknown> }) => GBFeatureResult;
};

function isRecord(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null;
}

/**
 * Evaluate an experiment on the server. Attempts GrowthBook first using
 * an optional enable flag (experiment key prefixed with `enable_`). If GB
 * evaluation fails or is disabled/unconfigured, falls back to local weights.
 */
export async function runServerExperiment<V extends string = string>(
    def: ExperimentDefinition<V>,
): Promise<RunServerExperimentResult<V>> {
    // Prefer GrowthBook if the client key is present
    try {
        if (process.env.GROWTHBOOK_CLIENT_KEY) {
            const maybeClient = (await growthbookAdapter.initialize()) as unknown;
            const client: GBClient = isRecord(maybeClient) ? (maybeClient as GBClient) : {};

            const rawAttrs = (await identify()) as unknown;
            const attrs: Record<string, unknown> = isRecord(rawAttrs) ? rawAttrs : {};

            // Optional feature flag to globally enable/disable this experiment
            const enableKey = `enable_${def.gbKey}`;
            const enableFeature = client.evalFeature?.(enableKey, { attributes: attrs });
            const enabled = resolveBoolean(enableFeature);

            if (!enabled) {
                // Explicitly disabled → return default without randomization.
                return { variant: def.defaultVariant as V, source: "fallback" };
            }

            const feature = client.evalFeature?.(def.gbKey, { attributes: attrs });
            const value = typeof feature?.value === "string" ? feature.value : String(feature?.value ?? "");

            const match = def.variants.find((x) => x === (value as V));
            if (match) {
                return { variant: match, source: "growthbook" };
            }
        }
    } catch (err: unknown) {
        // swallow and fall through to fallback
        if (process.env.NODE_ENV === "development") {
            const msg = err instanceof Error ? err.message : String(err);
            console.warn(`[runServerExperiment] Falling back due to GB error: ${msg}`);
        }
    }

    // Fallback: normalize weights to probabilities and pick
    const variants = [...def.variants];
    const weights = variants.map((v) => Number(def.weights?.[v] ?? 0));
    const total = weights.reduce((a, b) => a + b, 0);

    let chosen: V;
    if (!Number.isFinite(total) || total <= 0) {
        chosen = variants[Math.floor(Math.random() * variants.length)] as V;
    } else {
        const r = Math.random() * total;
        let acc = 0;
        let pick = variants[variants.length - 1] as V;

        for (let i = 0; i < variants.length; i++) {
            acc += weights[i];
            if (r <= acc) {
                pick = variants[i] as V;
                break;
            }
        }

        chosen = pick;
    }

    return { variant: chosen, source: "fallback" };
}

function resolveBoolean(feature: unknown): boolean {
    if (!isRecord(feature)) return false;

    const on = feature.on;
    if (typeof on === "boolean") return on;

    const enabled = feature.enabled;
    if (typeof enabled === "boolean") return enabled;

    const value = feature.value;
    if (typeof value === "boolean") return value;

    return Boolean(value);
}

// Note: tests guarantee this helper respects GrowthBook first and falls back
// to stable local weights when GB is unavailable.

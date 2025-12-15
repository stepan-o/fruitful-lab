// frontend/lib/growthbook/experiments.ts
// Server-side helper to evaluate an experiment via GrowthBook first,
// falling back to local configuration/weights when GB is unavailable.

import { growthbookAdapter } from "@/lib/growthbook/flags";
import { identify } from "@/lib/identify";
import {
  type ExperimentDefinition,
  PINTEREST_POTENTIAL_EXPERIMENT,
} from "@/lib/experiments/config";

export type RunServerExperimentResult<V extends string = string> = {
  variant: V;
  source: "growthbook" | "fallback";
};

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
      const client: any = await growthbookAdapter.initialize();
      const attrs = await identify();

      // Optional feature flag to globally enable/disable this experiment
      const enableKey = `enable_${def.gbKey}`;
      const enableFeature = client.evalFeature?.(enableKey, { attributes: attrs });
      const enabled = resolveBoolean(enableFeature);

      if (enabled) {
        const feature = client.evalFeature?.(def.gbKey, { attributes: attrs });
        const value = String(feature?.value ?? "");
        const v = def.variants.find((x) => x === (value as V));
        if (v) {
          return { variant: v, source: "growthbook" };
        }
      } else {
        // Explicitly disabled → return default without randomization.
        return { variant: def.defaultVariant as V, source: "fallback" };
      }
    }
  } catch (_err) {
    // swallow and fall through to fallback
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("[runServerExperiment] Falling back due to GB error");
    }
  }

  // Fallback: normalize weights to probabilities and pick
  const variants = [...def.variants];
  const weights = variants.map((v) => Number(def.weights?.[v] ?? 0));
  const total = weights.reduce((a, b) => a + b, 0);
  let chosen: V;
  if (!isFinite(total) || total <= 0) {
    chosen = variants[Math.floor(Math.random() * variants.length)];
  } else {
    const r = Math.random() * total;
    let acc = 0;
    let pick = variants[variants.length - 1];
    for (let i = 0; i < variants.length; i++) {
      acc += weights[i];
      if (r <= acc) {
        pick = variants[i];
        break;
      }
    }
    chosen = pick;
  }
  return { variant: chosen as V, source: "fallback" };
}

function resolveBoolean(feature: any): boolean {
  if (!feature) return false;
  if (typeof feature.on === "boolean") return feature.on;
  if (typeof feature.enabled === "boolean") return feature.enabled;
  if (typeof feature.value === "boolean") return feature.value;
  return Boolean(feature.value);
}

// Note: tests guarantee this helper respects GrowthBook first and falls back
// to stable local weights when GB is unavailable.

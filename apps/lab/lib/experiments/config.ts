// frontend/lib/experiments/config.ts
// Canonical experiment configuration for the app. Pure config/types only.
// This module aligns our internal experiment model with GrowthBook by
// keeping a single source of truth for experiment keys, variants, defaults,
// and optional local weights for fallback randomization.

import {
    type PinterestPotentialVariant,
    DEFAULT_VARIANT as PINTEREST_DEFAULT_VARIANT,
    ALL_VARIANTS as PINTEREST_ALL_VARIANTS,
} from "@/lib/tools/pinterestPotentialConfig";

// Experiment keys currently mirror GrowthBook experiment keys to reduce
// cognitive overhead. Keep extensible for future experiments.
export type ExperimentKey = "pinterest_potential_variant";

// Generic experiment definition type that can be used for any string variants.
export interface ExperimentDefinition<V extends string = string> {
    /** Our app-level identifier (currently same as GrowthBook key). */
    key: ExperimentKey;

    /** GrowthBook experiment key (string shown in GB UI). */
    gbKey: string;

    /** All valid variant keys for this experiment. */
    variants: readonly V[];

    /** Default variant when GB is unavailable or disabled. */
    defaultVariant: V;

    /**
     * Optional fallback weights used only when GrowthBook cannot be reached
     * and we have to randomize locally. Values don’t need to be normalized
     * (helpers can normalize later).
     */
    weights?: Partial<Record<V, number>>;
}

function equalSplitWeights<V extends string>(
    variants: readonly V[],
): Partial<Record<V, number>> {
    if (variants.length === 0) return {};
    const w = 1 / variants.length;

    // Build dynamically so keys always match the actual variant union.
    const out: Partial<Record<V, number>> = {};
    for (const v of variants) out[v] = w;
    return out;
}

// Pinterest Potential experiment definition using existing variant type.
export type PinterestPotentialExperimentDefinition =
    ExperimentDefinition<PinterestPotentialVariant>;

export const PINTEREST_POTENTIAL_EXPERIMENT: PinterestPotentialExperimentDefinition =
    {
        key: "pinterest_potential_variant",
        gbKey: "pinterest_potential_variant", // matches GB UI experiment key
        variants: PINTEREST_ALL_VARIANTS,
        defaultVariant: PINTEREST_DEFAULT_VARIANT,
        // Equal split default for local fallback when GB is down
        weights: equalSplitWeights(PINTEREST_ALL_VARIANTS),
    };

// Tests guarantee: experiment keys/gbKey/variants stay aligned with GrowthBook; fallback
// weights sum to ~1 so local randomization remains stable across environments.

// ---- Registry (typed, no `any`) ----

type ExperimentsByKey = {
    pinterest_potential_variant: PinterestPotentialExperimentDefinition;
};

const EXPERIMENTS_BY_KEY: ExperimentsByKey = {
    pinterest_potential_variant: PINTEREST_POTENTIAL_EXPERIMENT,
};

export function getExperimentDefinitionByKey<K extends ExperimentKey>(
    key: K,
): ExperimentsByKey[K] {
    const exp = EXPERIMENTS_BY_KEY[key];
    // This guard is mostly for runtime safety if key typing ever widens.
    if (!exp) {
        throw new Error(`Unknown experiment key: ${key}`);
    }
    return exp;
}

export const ALL_EXPERIMENT_KEYS: ExperimentKey[] = Object.keys(
    EXPERIMENTS_BY_KEY,
) as ExperimentKey[];
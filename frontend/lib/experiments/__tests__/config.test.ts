import "@testing-library/jest-dom";

import {
    getExperimentDefinitionByKey,
    PINTEREST_POTENTIAL_EXPERIMENT,
} from "@/lib/experiments/config";
import { ALL_VARIANTS as PINTEREST_ALL_VARIANTS } from "@/lib/tools/pinterestPotentialConfig";

describe("experiments/config – pinterest potential definition", () => {
    test("returns pinterest potential experiment by key", () => {
        const exp = getExperimentDefinitionByKey("pinterest_potential_variant");
        expect(exp).toBe(PINTEREST_POTENTIAL_EXPERIMENT);
        expect(exp.gbKey).toBe("pinterest_potential_variant");
        expect(exp.variants).toContain("welcome");
        expect(exp.variants).toContain("no_welcome");
        expect(exp.defaultVariant).toBeDefined();
    });

    test("variant list length matches source config", () => {
        const exp = getExperimentDefinitionByKey("pinterest_potential_variant");
        expect(exp.variants.length).toBe(PINTEREST_ALL_VARIANTS.length);
    });

    test("experiment keys and variants match exact expectations", () => {
        expect(PINTEREST_POTENTIAL_EXPERIMENT.key).toBe("pinterest_potential_variant");
        expect(PINTEREST_POTENTIAL_EXPERIMENT.gbKey).toBe("pinterest_potential_variant");
        expect(PINTEREST_POTENTIAL_EXPERIMENT.variants).toEqual(["welcome", "no_welcome"]);
    });

    test("weights (if present) sum to approximately 1 (tolerance 1e-6)", () => {
        const w = PINTEREST_POTENTIAL_EXPERIMENT.weights;
        if (w) {
            const sum = (["welcome", "no_welcome"] as const).reduce(
                (acc, k) => acc + (w[k] ?? 0),
                0,
            );
            expect(Math.abs(sum - 1)).toBeLessThan(1e-6);
        }
    });
});
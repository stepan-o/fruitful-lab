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
    expect(exp.variants).toContain("v1");
    expect(exp.variants).toContain("v2");
    expect(exp.defaultVariant).toBeDefined();
  });

  test("variant list length matches source config", () => {
    const exp = getExperimentDefinitionByKey("pinterest_potential_variant");
    expect(exp.variants.length).toBe(PINTEREST_ALL_VARIANTS.length);
  });
});

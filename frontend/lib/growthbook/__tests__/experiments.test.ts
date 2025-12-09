import "@testing-library/jest-dom";

// Mock adapter + identify
const initialize = jest.fn();
jest.mock("@/lib/growthbook/flags", () => ({
  growthbookAdapter: { initialize: (...args: any[]) => initialize(...args) },
}));
const identify = jest.fn().mockResolvedValue({ id: "anonymous" });
jest.mock("@/lib/identify", () => ({ identify: (...args: any[]) => (identify as any)(...args) }));

import { runServerExperiment } from "@/lib/growthbook/experiments";
import { PINTEREST_POTENTIAL_EXPERIMENT } from "@/lib/experiments/config";

describe("runServerExperiment", () => {
  const originalKey = process.env.GROWTHBOOK_CLIENT_KEY;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GROWTHBOOK_CLIENT_KEY = "test-key"; // enable GB path
  });

  afterAll(() => {
    if (originalKey) process.env.GROWTHBOOK_CLIENT_KEY = originalKey;
    else delete process.env.GROWTHBOOK_CLIENT_KEY;
  });

  function makeClient(enable: boolean, value?: string) {
    return {
      evalFeature: (key: string, _opts: any) => {
        if (key === `enable_${PINTEREST_POTENTIAL_EXPERIMENT.gbKey}`) {
          return { on: enable, value: enable };
        }
        return { value };
      },
    };
  }

  it("returns v1 when GrowthBook evaluates to v1", async () => {
    initialize.mockResolvedValueOnce(makeClient(true, "v1"));
    const res = await runServerExperiment(PINTEREST_POTENTIAL_EXPERIMENT);
    expect(res).toEqual({ variant: "v1", source: "growthbook" });
    expect(identify).toHaveBeenCalled();
  });

  it("returns v2 when GrowthBook evaluates to v2", async () => {
    initialize.mockResolvedValueOnce(makeClient(true, "v2"));
    const res = await runServerExperiment(PINTEREST_POTENTIAL_EXPERIMENT);
    expect(res).toEqual({ variant: "v2", source: "growthbook" });
  });

  it("falls back when adapter throws or returns no value", async () => {
    initialize.mockRejectedValueOnce(new Error("boom"));
    const res = await runServerExperiment(PINTEREST_POTENTIAL_EXPERIMENT);
    expect(["v1", "v2"]).toContain(res.variant);
    expect(res.source).toBe("fallback");
  });

  it("returns default variant when enable flag is off", async () => {
    initialize.mockResolvedValueOnce(makeClient(false));
    const res = await runServerExperiment(PINTEREST_POTENTIAL_EXPERIMENT);
    expect(res).toEqual({ variant: PINTEREST_POTENTIAL_EXPERIMENT.defaultVariant, source: "fallback" });
  });
});

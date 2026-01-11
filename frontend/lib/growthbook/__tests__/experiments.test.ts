import "@testing-library/jest-dom";

// Mock adapter + identify
const initialize = jest.fn();
jest.mock("@/lib/growthbook/flags", () => ({
    growthbookAdapter: { initialize: (...args: unknown[]) => initialize(...args) },
}));

const identify = jest.fn().mockResolvedValue({ id: "anonymous" });
jest.mock("@/lib/identify", () => ({
    identify: (...args: unknown[]) => identify(...args),
}));

import { runServerExperiment } from "@/lib/growthbook/experiments";
import { PINTEREST_POTENTIAL_EXPERIMENT } from "@/lib/experiments/config";

type GBEnableResult = { on?: boolean; value?: unknown };
type GBValueResult = { value?: unknown };
type MinimalGBClient = {
    evalFeature: (key: string, opts?: unknown) => GBEnableResult | GBValueResult;
};

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

    function makeClient(enable: boolean, value?: string): MinimalGBClient {
        return {
            evalFeature: (key: string, _opts?: unknown) => {
                if (key === `enable_${PINTEREST_POTENTIAL_EXPERIMENT.gbKey}`) {
                    return { on: enable, value: enable };
                }
                return { value };
            },
        };
    }

    it("returns welcome when GrowthBook evaluates to welcome", async () => {
        initialize.mockResolvedValueOnce(makeClient(true, "welcome"));
        const res = await runServerExperiment(PINTEREST_POTENTIAL_EXPERIMENT);
        expect(res).toEqual({ variant: "welcome", source: "growthbook" });
        expect(identify).toHaveBeenCalled();
    });

    it("returns no_welcome when GrowthBook evaluates to no_welcome", async () => {
        initialize.mockResolvedValueOnce(makeClient(true, "no_welcome"));
        const res = await runServerExperiment(PINTEREST_POTENTIAL_EXPERIMENT);
        expect(res).toEqual({ variant: "no_welcome", source: "growthbook" });
    });

    it("falls back when adapter throws or returns no value", async () => {
        initialize.mockRejectedValueOnce(new Error("boom"));
        const res = await runServerExperiment(PINTEREST_POTENTIAL_EXPERIMENT);
        expect(["welcome", "no_welcome"]).toContain(res.variant);
        expect(res.source).toBe("fallback");
    });

    it("returns default variant when enable flag is off", async () => {
        initialize.mockResolvedValueOnce(makeClient(false));
        const res = await runServerExperiment(PINTEREST_POTENTIAL_EXPERIMENT);
        expect(res).toEqual({
            variant: PINTEREST_POTENTIAL_EXPERIMENT.defaultVariant,
            source: "fallback",
        });
    });
});
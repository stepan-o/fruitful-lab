// frontend/lib/growthbook/__tests__/experiments.test.ts
import "@testing-library/jest-dom";

import { PINTEREST_POTENTIAL_EXPERIMENT } from "@/lib/experiments/config";

// -----------------------------
// Minimal GB client typing
// -----------------------------
type GBEnableResult = { on?: boolean; value?: unknown };
type GBValueResult = { value?: unknown };

type MinimalGBClient = {
    // Keep signature compatible with prod usage (may pass options as 2nd arg)
    evalFeature: (key: string, opts?: unknown) => GBEnableResult | GBValueResult;
};

// -----------------------------
// Mocks
// -----------------------------
const initialize = jest.fn<Promise<MinimalGBClient>, unknown[]>();

jest.mock("@/lib/growthbook/flags", () => ({
    growthbookAdapter: {
        initialize,
    },
}));

const identify = jest
    .fn<Promise<{ id: string }>, unknown[]>()
    .mockResolvedValue({ id: "anonymous" });

jest.mock("@/lib/identify", () => ({
    identify,
}));

import { runServerExperiment } from "@/lib/growthbook/experiments";

function makeClient(enable: boolean, value?: string): MinimalGBClient {
    return {
        evalFeature: (key: string, opts?: unknown) => {
            // Mark as "used" for eslint (some configs don't ignore underscore args)
            void opts;

            if (key === `enable_${PINTEREST_POTENTIAL_EXPERIMENT.gbKey}`) {
                return { on: enable, value: enable };
            }
            return { value };
        },
    };
}

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

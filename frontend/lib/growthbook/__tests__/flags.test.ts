// frontend/lib/growthbook/__tests__/flags.test.ts
import "@testing-library/jest-dom";

/**
 * These tests verify that our GrowthBook adapter registers a tracking callback
 * and that the callback forwards exposure events to logExperimentEvent, while
 * only logging noisily in non-production environments.
 *
 * Goals:
 * - no `any`
 * - avoid brittle DOM/Web API shims unless truly needed
 * - avoid Next.js request-scope issues by mocking `after` as immediate
 */

// -----------------------------
// Minimal global shims (typed via Record to avoid TS constructor mismatch)
// -----------------------------
const g = globalThis as unknown as Record<string, unknown>;

if (typeof g.fetch === "undefined") {
    g.fetch = (async () => {
        throw new Error("global fetch not mocked in this test");
    }) as unknown;
}
if (typeof g.Request === "undefined") {
    g.Request = class RequestShim {} as unknown;
}
if (typeof g.Response === "undefined") {
    g.Response = class ResponseShim {} as unknown;
}
if (typeof g.Headers === "undefined") {
    g.Headers = class HeadersShim {} as unknown;
}

// -----------------------------
// Mocks
// -----------------------------
type TrackingExperiment = { key: string };
type TrackingResult = { variationId?: string; key?: string };
type TrackingCallback = (
    experiment: TrackingExperiment,
    result: TrackingResult,
) => Promise<void> | void;

// Capture the tracking callback passed into the SDK adapter
const setTrackingCallback = jest.fn<void, [TrackingCallback]>();
const initialize = jest
    .fn<Promise<Record<string, unknown>>, unknown[]>()
    .mockResolvedValue({});

// Make `after` immediate so tests run outside request scope
jest.mock("next/server", () => ({
    after: (fn: () => void) => fn(),
}));

// Mock the underlying SDK so our adapter wires into these fns during module eval
jest.mock("@flags-sdk/growthbook", () => ({
    growthbookAdapter: {
        setTrackingCallback,
        initialize,
    },
}));

// Mock the experiment events helper
const logExperimentEvent = jest.fn<Promise<void>, [unknown]>().mockResolvedValue(undefined);
jest.mock("@/lib/experiments/track", () => ({
    logExperimentEvent: (payload: unknown) => logExperimentEvent(payload),
}));

function setEnv(key: string, value: string | undefined) {
    (process.env as Record<string, string | undefined>)[key] = value;
}
function getEnv(key: string): string | undefined {
    return (process.env as Record<string, string | undefined>)[key];
}

describe("growthbook flags tracking callback", () => {
    const originalNodeEnv = getEnv("NODE_ENV");
    const originalClientKey = getEnv("GROWTHBOOK_CLIENT_KEY");
    const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
    };

    beforeEach(() => {
        jest.resetModules();
        setTrackingCallback.mockClear();
        logExperimentEvent.mockClear();

        setEnv("GROWTHBOOK_CLIENT_KEY", "test-key");

        // Avoid noisy logs and adapter errors in tests
        console.warn = jest.fn();
        console.error = jest.fn();
    });

    afterAll(() => {
        setEnv("NODE_ENV", originalNodeEnv);
        setEnv("GROWTHBOOK_CLIENT_KEY", originalClientKey);

        console.log = originalConsole.log;
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
    });

    it("invokes logExperimentEvent on exposure and logs in development", async () => {
        setEnv("NODE_ENV", "development");
        console.log = jest.fn();

        // Import module under test – this registers the callback
        await import("@/lib/growthbook/flags");

        expect(setTrackingCallback).toHaveBeenCalledTimes(1);

        const cb = setTrackingCallback.mock.calls[0]?.[0];
        expect(typeof cb).toBe("function");

        // Simulate GrowthBook delivering a tracking event
        await cb(
            { key: "pinterest_potential_variant" },
            { variationId: "v1" },
        );

        expect(logExperimentEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "exposure",
                experimentKey: "pinterest_potential_variant",
                variant: "v1",
                source: "growthbook",
            }),
        );

        expect(console.log).toHaveBeenCalled();
    });

    it("does not log noisy output in production", async () => {
        setEnv("NODE_ENV", "production");
        console.log = jest.fn();

        await import("@/lib/growthbook/flags");

        const cb = setTrackingCallback.mock.calls[0]?.[0];
        expect(typeof cb).toBe("function");

        await cb(
            { key: "pinterest_potential_variant" },
            { key: "v2" },
        );

        expect(logExperimentEvent).toHaveBeenCalled();
        expect(console.log).not.toHaveBeenCalled();
    });
});

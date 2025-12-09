import "@testing-library/jest-dom";

// Capture the tracking callback passed into the adapter
const setTrackingCallback = jest.fn();
const initialize = jest.fn().mockResolvedValue({});
jest.mock("@/lib/growthbook/flags", () => {
  // Defer actual module import after we set up mocks below
  const real = jest.requireActual("@/lib/growthbook/flags");
  return {
    ...real,
    growthbookAdapter: {
      setTrackingCallback: (...args: any[]) => setTrackingCallback(...args),
      initialize: (...args: any[]) => initialize(...args),
    },
  };
});

// Mock the experiment events helper
const logExperimentEvent = jest.fn().mockResolvedValue(undefined);
jest.mock("@/lib/experiments/track", () => ({
  logExperimentEvent: (...args: any[]) => (logExperimentEvent as any)(...args),
}));

describe("growthbook flags tracking callback", () => {
  const originalEnv = process.env.NODE_ENV;
  const originalConsole = { log: console.log, error: console.error };

  beforeEach(() => {
    jest.resetModules();
    (setTrackingCallback as jest.Mock).mockClear();
    (logExperimentEvent as jest.Mock).mockClear();
  });

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
    console.log = originalConsole.log;
    console.error = originalConsole.error;
  });

  it("invokes logExperimentEvent on exposure and logs in development", async () => {
    process.env.NODE_ENV = "development";
    // Stub console
    console.log = jest.fn();

    // Import module under test – this registers the callback
    await import("@/lib/growthbook/flags");
    expect(setTrackingCallback).toHaveBeenCalledTimes(1);
    const cb = setTrackingCallback.mock.calls[0][0];

    // Simulate GrowthBook delivering a tracking event
    await cb({ key: "pinterest_potential_variant" }, { variationId: "v1" });

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
    process.env.NODE_ENV = "production";
    console.log = jest.fn();

    await import("@/lib/growthbook/flags");
    const cb = setTrackingCallback.mock.calls[0][0];
    await cb({ key: "pinterest_potential_variant" }, { key: "v2" });
    expect(logExperimentEvent).toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });
});

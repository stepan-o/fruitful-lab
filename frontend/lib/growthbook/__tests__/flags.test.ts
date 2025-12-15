// Minimal Web API polyfills so `next/server` & GrowthBook can load in Jest
const g = global as any;

if (typeof g.Request === "undefined") {
  g.Request = class {} as any;
}
if (typeof g.Response === "undefined") {
  g.Response = class {} as any;
}
if (typeof g.Headers === "undefined") {
  g.Headers = class {} as any;
}
if (typeof g.fetch === "undefined") {
  g.fetch = () =>
    Promise.reject(new Error("global fetch not mocked in this test"));
}

import "@testing-library/jest-dom";

// Capture the tracking callback passed into the adapter
const setTrackingCallback = jest.fn();
const initialize = jest.fn().mockResolvedValue({});
// Make `after` a no-op so tests can run outside request scope
jest.mock("next/server", () => ({
  after: (fn: any) => fn(),
}));
// Mock the underlying SDK so our adapter is used during module evaluation
jest.mock("@flags-sdk/growthbook", () => ({
  growthbookAdapter: {
    setTrackingCallback: (...args: any[]) => setTrackingCallback(...args),
    initialize: (...args: any[]) => initialize(...args),
  },
}));

// Mock the experiment events helper
const logExperimentEvent = jest.fn().mockResolvedValue(undefined);
jest.mock("@/lib/experiments/track", () => ({
  logExperimentEvent: (...args: any[]) => (logExperimentEvent as any)(...args),
}));

describe("growthbook flags tracking callback", () => {
  const originalEnv = process.env.NODE_ENV;
  const originalConsole = { log: console.log, error: console.error, warn: console.warn } as any;

  beforeEach(() => {
    jest.resetModules();
    (setTrackingCallback as jest.Mock).mockClear();
    (logExperimentEvent as jest.Mock).mockClear();
    // Avoid noisy logs and adapter errors in tests
    process.env.GROWTHBOOK_CLIENT_KEY = "test-key";
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
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

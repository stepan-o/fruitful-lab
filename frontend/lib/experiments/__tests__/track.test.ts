import "@testing-library/jest-dom";

import { logExperimentEvent, trackConversion } from "@/lib/experiments/track";

describe("experiments/track helpers", () => {
  const originalFetch = global.fetch as any;

  beforeEach(() => {
    (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    (global as any).fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("logExperimentEvent posts exposure payload to /api/experiment-events", async () => {
    await logExperimentEvent({
      type: "exposure",
      experimentKey: "test_exp",
      variant: "v1",
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = (global.fetch as any).mock.calls[0];
    expect(url).toBe("/api/experiment-events");
    expect(options.method).toBe("POST");
    expect(options.headers["Content-Type"]).toBe("application/json");

    const sent = JSON.parse(options.body);
    expect(sent.type).toBe("exposure");
    expect(sent.experimentKey).toBe("test_exp");
    expect(sent.variant).toBe("v1");
  });

  it("trackConversion posts conversion payload with eventName", async () => {
    await trackConversion("pp_complete", { foo: "bar" });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [_url, options] = (global.fetch as any).mock.calls[0];
    const sent = JSON.parse(options.body);
    expect(sent.type).toBe("conversion");
    expect(sent.eventName).toBe("pp_complete");
    expect(sent.attributes).toEqual({ foo: "bar" });
  });
});

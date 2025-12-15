const g = global as any;

if (typeof g.Request === "undefined") {
  g.Request = class {} as any;
}
if (typeof g.Response === "undefined") {
  class MinimalResponse {
    static json(data: any, init?: any) {
      const status = init?.status ?? 200;
      return {
        status,
        json: async () => data,
        headers: init?.headers ?? {},
      } as any;
    }
  }
  g.Response = MinimalResponse as any;
}
if (typeof g.Headers === "undefined") {
  g.Headers = class {} as any;
}

import "@testing-library/jest-dom";

// Mock NextResponse.json to avoid cookies/cf internals in Next
jest.mock("next/server", () => ({
  NextResponse: {
    json: (data: any, init?: any) => ({
      status: init?.status ?? 200,
      json: async () => data,
    }),
  },
}));

(global as any).fetch = jest.fn().mockResolvedValue({
  ok: true,
  status: 200,
} as any);

// Use require to ensure shims and fetch mock are applied before module evaluation
const { GET } = require("@/app/api/debug/growthbook/route");

describe("/api/debug/growthbook endpoint", () => {
  const originalEnv = { ...process.env } as any;
  const originalFetch = global.fetch as any;

  afterEach(() => {
    (global as any).fetch = originalFetch;
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  it("returns ok ping when GrowthBook API responds 200", async () => {
    process.env.NODE_ENV = "test";
    process.env.GROWTHBOOK_CLIENT_KEY = "sdk-test";
    process.env.GROWTHBOOK_API_HOST = "https://cdn.growthbook.io";
    (global as any).fetch = jest.fn().mockResolvedValue({ ok: true, status: 200 });

    const res = await GET();
    const json = await (res as any).json();

    expect(json).toHaveProperty("envConfigured");
    expect(json).toHaveProperty("initialized");
    expect(json).toHaveProperty("nodeEnv");
    expect(json.ping).toEqual({ ok: true, status: 200, error: null });
  });

  it("returns error ping when fetch throws", async () => {
    process.env.NODE_ENV = "test";
    process.env.GROWTHBOOK_CLIENT_KEY = "sdk-test";
    process.env.GROWTHBOOK_API_HOST = "https://cdn.growthbook.io";
    (global as any).fetch = jest.fn().mockRejectedValue(new Error("network"));

    const res = await GET();
    const json = await (res as any).json();
    expect(json.ping.ok).toBe(false);
    expect(json.ping.status).toBeNull();
    expect(typeof json.ping.error).toBe("string");
    expect(json.ping.error.length).toBeGreaterThan(0);
  });
});

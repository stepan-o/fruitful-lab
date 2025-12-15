// Minimal shims so `next/server` can load in Jest
const g = global as any;

if (typeof g.Request === "undefined") {
  g.Request = class {} as any;
}
if (typeof g.Response === "undefined" || typeof (g.Response as any).json !== "function") {
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
if (typeof g.fetch === "undefined") {
  g.fetch = () =>
    Promise.reject(new Error("global fetch not mocked in this test"));
}

import "@testing-library/jest-dom";
// Minimal NextResponse mock to avoid heavy Next internals
jest.mock("next/server", () => ({
  NextResponse: {
    json: (data: any, init?: any) => ({
      status: init?.status ?? 200,
      json: async () => data,
    }),
  },
}));
// Use require to ensure shims above run before module evaluation
const { POST, GET } = require("@/app/api/experiment-events/route");

describe("/api/experiment-events route", () => {
  const originalEnv = process.env.NODE_ENV;
  const originalConsole = { log: console.log } as any;

  beforeEach(() => {
    process.env.NODE_ENV = "development";
    console.log = jest.fn();
  });

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
    console.log = originalConsole.log;
  });

  it("accepts POST with valid exposure payload", async () => {
    const payload = {
      type: "exposure",
      experimentKey: "test",
      variant: "v1",
    };

    const req = { json: async () => payload } as any;

    const res = await POST(req);
    const json = await (res as any).json();
    expect(json).toEqual({ ok: true });
    expect((console.log as any).mock.calls.length).toBeGreaterThanOrEqual(0);
  });

  it("rejects invalid method with 405", async () => {
    const res = await GET();
    expect((res as any).status).toBe(405);
    const json = await (res as any).json();
    expect(json).toHaveProperty("error");
  });

  it("rejects invalid payload with 400", async () => {
    const req = { json: async () => ({ foo: "bar" }) } as any;

    const res = await POST(req);
    expect((res as any).status).toBe(400);
    const json = await (res as any).json();
    expect(json).toHaveProperty("error");
    // Ensure no secret-like fields present
    expect(Object.keys(json)).toEqual(["error"]);
  });
});

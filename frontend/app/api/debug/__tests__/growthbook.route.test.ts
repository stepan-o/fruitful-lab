import "@testing-library/jest-dom";
import { GET } from "@/app/api/debug/growthbook/route";

describe("/api/debug/growthbook endpoint", () => {
  const originalEnv = { ...process.env } as any;
  const originalFetch = global.fetch as any;

  afterEach(() => {
    (global as any).fetch = originalFetch;
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  it("returns ok ping when GrowthBook API responds 200", async () => {
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

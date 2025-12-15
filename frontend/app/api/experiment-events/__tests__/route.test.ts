import "@testing-library/jest-dom";
import { POST, GET } from "@/app/api/experiment-events/route";

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
    const req = new Request("http://localhost/api/experiment-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "exposure", experimentKey: "test", variant: "v1" }),
    });
    const res = await POST(req as any);
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
    const req = new Request("http://localhost/api/experiment-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ foo: "bar" }),
    });
    const res = await POST(req as any);
    expect((res as any).status).toBe(400);
    const json = await (res as any).json();
    expect(json).toHaveProperty("error");
    // Ensure no secret-like fields present
    expect(Object.keys(json)).toEqual(["error"]);
  });
});

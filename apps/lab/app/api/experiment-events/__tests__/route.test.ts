// frontend/app/api/experiment-events/__tests__/route.test.ts

// Minimal shims so `next/server` can load in Jest (without pulling heavy Next internals).
const g = globalThis as unknown as Record<string, unknown>;

if (typeof g.Request === "undefined") {
    g.Request = class MinimalRequest {} as unknown;
}

if (
    typeof g.Response === "undefined" ||
    typeof (g.Response as { json?: unknown }).json !== "function"
) {
    class MinimalResponse {
        static json(data: unknown, init?: { status?: number; headers?: unknown }) {
            const status = init?.status ?? 200;
            return {
                status,
                json: async () => data,
                headers: init?.headers ?? {},
            };
        }
    }
    g.Response = MinimalResponse as unknown;
}

if (typeof g.Headers === "undefined") {
    g.Headers = class MinimalHeaders {} as unknown;
}

if (typeof g.fetch === "undefined") {
    g.fetch = (() =>
        Promise.reject(new Error("global fetch not mocked in this test"))) as unknown;
}

import "@testing-library/jest-dom";

// Minimal NextResponse mock to avoid heavy Next internals
jest.mock("next/server", () => ({
    NextResponse: {
        json: (data: unknown, init?: { status?: number }) => ({
            status: init?.status ?? 200,
            json: async () => data,
        }),
    },
}));

type RouteResponse = { status: number; json: () => Promise<unknown> };
type PostReq = { json: () => Promise<unknown> };

let POST: (req: PostReq) => Promise<RouteResponse>;
let GET: () => Promise<RouteResponse>;

describe("/api/experiment-events route", () => {
    const originalEnv = process.env.NODE_ENV;
    let logSpy: ReturnType<typeof jest.spyOn> | null = null;

    beforeAll(async () => {
        // Use dynamic import (no `require`) so shims above run first.
        const routeMod = (await import("@/app/api/experiment-events/route")) as unknown as {
            POST: (req: PostReq) => Promise<RouteResponse>;
            GET: () => Promise<RouteResponse>;
        };
        POST = routeMod.POST;
        GET = routeMod.GET;
    });

    beforeEach(() => {
        // NODE_ENV is typed readonly in some setups; write through an indexable view.
        (process.env as Record<string, string | undefined>).NODE_ENV = "development";
        logSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);
    });

    afterEach(() => {
        logSpy?.mockRestore();
        logSpy = null;
    });

    afterAll(() => {
        (process.env as Record<string, string | undefined>).NODE_ENV = originalEnv;
    });

    it("accepts POST with valid exposure payload", async () => {
        const payload = {
            type: "exposure",
            experimentKey: "test",
            variant: "welcome",
        };

        const req: PostReq = { json: async () => payload };

        const res = await POST(req);
        const json = await res.json();

        expect(json).toEqual({ ok: true });
        expect(logSpy).not.toBeNull();
    });

    it("rejects invalid method with 405", async () => {
        const res = await GET();
        expect(res.status).toBe(405);

        const json = await res.json();
        expect(json).toHaveProperty("error");
    });

    it("rejects invalid payload with 400", async () => {
        const req: PostReq = { json: async () => ({ foo: "bar" }) };

        const res = await POST(req);
        expect(res.status).toBe(400);

        const json = await res.json();
        expect(json).toHaveProperty("error");
        expect(Object.keys(json as Record<string, unknown>)).toEqual(["error"]);
    });
});
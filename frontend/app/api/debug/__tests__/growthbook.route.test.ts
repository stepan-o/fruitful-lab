// frontend/app/api/debug/__tests__/growthbook.route.test.ts
import "@testing-library/jest-dom";

/**
 * App Router route handler unit test (calls GET() directly).
 * Goals:
 * - No `any`
 * - No `require()`
 * - No direct `process.env.NODE_ENV = ...` (some setups type it as readonly)
 * - Typed fetch mock (no TS2322)
 */

// -----------------------------
// Minimal Web API shims (Node/JSDOM variance)
// -----------------------------
type JsonLike = unknown;

type MinimalJsonResponse = {
    status: number;
    json: () => Promise<JsonLike>;
};

type MinimalResponseCtor = {
    json: (data: JsonLike, init?: { status?: number; headers?: Record<string, string> }) => MinimalJsonResponse;
};

function ensureWebShims(): void {
    const g = globalThis as unknown as {
        Request?: unknown;
        Response?: unknown;
        Headers?: unknown;
    };

    if (typeof g.Request === "undefined") {
        g.Request = class RequestShim {};
    }

    if (typeof g.Headers === "undefined") {
        g.Headers = class HeadersShim {};
    }

    if (typeof g.Response === "undefined") {
        const MinimalResponse: MinimalResponseCtor = {
            json: (data: JsonLike, init) => {
                const status = init?.status ?? 200;
                return {
                    status,
                    json: async () => data,
                };
            },
        };

        g.Response = MinimalResponse;
    }
}

ensureWebShims();

// -----------------------------
// Mock NextResponse.json (avoid Next cookies/cf internals)
// -----------------------------
jest.mock("next/server", () => ({
    NextResponse: {
        json: (data: unknown, init?: { status?: number }) => ({
            status: init?.status ?? 200,
            json: async () => data,
        }),
    },
}));

// Import after mocks/shims
import { GET } from "@/app/api/debug/growthbook/route";

// -----------------------------
// Helpers
// -----------------------------
function setEnv(patch: Record<string, string>): void {
    // Avoid direct assignment to process.env.NODE_ENV (can be typed as readonly in some setups)
    Object.assign(process.env as unknown as Record<string, string>, patch);
}

function setGlobalFetch(fn: typeof fetch): void {
    Object.defineProperty(globalThis, "fetch", {
        value: fn,
        writable: true,
        configurable: true,
    });
}

type PingShape = { ok: boolean; status: number | null; error: string | null };
type RouteJsonShape = {
    envConfigured?: unknown;
    initialized?: unknown;
    nodeEnv?: unknown;
    ping: PingShape;
};

describe("/api/debug/growthbook endpoint", () => {
    const originalEnv = { ...process.env } as NodeJS.ProcessEnv;
    const originalFetch = (globalThis as unknown as { fetch?: typeof fetch }).fetch;

    afterEach(() => {
        // Restore env as a whole (works even if individual keys are readonly-typed)
        process.env = { ...originalEnv };

        // Restore fetch
        if (originalFetch) {
            setGlobalFetch(originalFetch);
        } else {
            // If fetch didn't exist originally, set to undefined without using `delete`
            Object.defineProperty(globalThis, "fetch", {
                value: undefined,
                writable: true,
                configurable: true,
            });
        }

        jest.clearAllMocks();
    });

    it("returns ok ping when GrowthBook API responds 200", async () => {
        setEnv({
            NODE_ENV: "test",
            GROWTHBOOK_CLIENT_KEY: "sdk-test",
            GROWTHBOOK_API_HOST: "https://cdn.growthbook.io",
        });

        const fetchMock = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(async () => {
            return { ok: true, status: 200 } as unknown as Response;
        });

        setGlobalFetch(fetchMock as unknown as typeof fetch);

        const res = await GET();
        const json = (await (res as MinimalJsonResponse).json()) as RouteJsonShape;

        // Shape assertions (stay loose so route can evolve without churn)
        expect(json).toHaveProperty("envConfigured");
        expect(json).toHaveProperty("initialized");
        expect(json).toHaveProperty("nodeEnv");
        expect(json).toHaveProperty("ping");

        expect(json.ping).toEqual({ ok: true, status: 200, error: null });
    });

    it("returns error ping when fetch throws", async () => {
        setEnv({
            NODE_ENV: "test",
            GROWTHBOOK_CLIENT_KEY: "sdk-test",
            GROWTHBOOK_API_HOST: "https://cdn.growthbook.io",
        });

        const fetchMock = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>(async () => {
            throw new Error("network");
        });

        setGlobalFetch(fetchMock as unknown as typeof fetch);

        const res = await GET();
        const json = (await (res as MinimalJsonResponse).json()) as RouteJsonShape;

        expect(json.ping.ok).toBe(false);
        expect(json.ping.status).toBeNull();
        expect(typeof json.ping.error).toBe("string");
        expect((json.ping.error ?? "").length).toBeGreaterThan(0);
    });
});

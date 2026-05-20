// frontend/lib/experiments/__tests__/track.test.ts
import "@testing-library/jest-dom";

import { logExperimentEvent, trackConversion } from "@/lib/experiments/track";

// -----------------------------
// Typed fetch mock (no `any`, correct call signature)
// -----------------------------
type FetchLike = typeof fetch;
type FetchArgs = [input: RequestInfo | URL, init?: RequestInit | undefined];

type FetchMock = jest.MockInstance<Promise<Response>, FetchArgs>;

function makeFetchMock(
    impl?: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
): FetchMock {
    return jest.fn<Promise<Response>, FetchArgs>(
        impl ??
        (async () => {
            // Only `ok` is used by the code under test.
            return { ok: true } as unknown as Response;
        }),
    );
}

function setFetchMock(impl: FetchMock) {
    (globalThis as unknown as { fetch: FetchLike }).fetch = impl as unknown as FetchLike;
}

function assertFetchMock(v: FetchMock | null): asserts v is FetchMock {
    if (!v) throw new Error("fetch mock not set");
}

describe("experiments/track helpers", () => {
    const originalFetch = (globalThis as unknown as { fetch?: FetchLike }).fetch;
    let fetchMock: FetchMock | null = null;

    beforeEach(() => {
        fetchMock = makeFetchMock();
        setFetchMock(fetchMock);
    });

    afterEach(() => {
        if (originalFetch) {
            (globalThis as unknown as { fetch: FetchLike }).fetch = originalFetch;
        } else {
            // In case fetch wasn't present originally, remove it
            delete (globalThis as unknown as { fetch?: FetchLike }).fetch;
        }
        fetchMock = null;
        jest.clearAllMocks();
    });

    it("logExperimentEvent posts exposure payload to /api/experiment-events", async () => {
        await logExperimentEvent({
            type: "exposure",
            experimentKey: "test_exp",
            variant: "v1",
        });

        assertFetchMock(fetchMock);

        const calls = fetchMock.mock.calls;
        expect(calls).toHaveLength(1);

        const [url, options] = calls[0];
        expect(url).toBe("/api/experiment-events");
        expect(options?.method).toBe("POST");

        const headers = (options?.headers ?? {}) as Record<string, string>;
        expect(headers["Content-Type"]).toBe("application/json");

        const body = options?.body;
        expect(typeof body).toBe("string");

        const sent = JSON.parse(body as string) as {
            type?: string;
            experimentKey?: string;
            variant?: string;
        };

        expect(sent.type).toBe("exposure");
        expect(sent.experimentKey).toBe("test_exp");
        expect(sent.variant).toBe("v1");
    });

    it("trackConversion posts conversion payload with eventName", async () => {
        await trackConversion("pp_complete", { foo: "bar" });

        assertFetchMock(fetchMock);

        const calls = fetchMock.mock.calls;
        expect(calls).toHaveLength(1);

        const [, options] = calls[0];

        const body = options?.body;
        expect(typeof body).toBe("string");

        const sent = JSON.parse(body as string) as {
            type?: string;
            eventName?: string;
            attributes?: unknown;
        };

        expect(sent.type).toBe("conversion");
        expect(sent.eventName).toBe("pp_complete");
        expect(sent.attributes).toEqual({ foo: "bar" });
    });
});

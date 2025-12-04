// __tests__/fetchPinterestMonthlyStats.test.ts
import type { PinterestMonthlyStat } from "@/lib/pinterestStats";

describe("fetchPinterestMonthlyStats", () => {
    const OLD_ENV = process.env;
    const originalFetch = globalThis.fetch;

    // we'll assign this after dynamic import
    let fetchPinterestMonthlyStats: (
        token: string,
    ) => Promise<PinterestMonthlyStat[]>;

    beforeEach(async () => {
        jest.resetModules();

        // Make sure the module sees this value at import time
        process.env = {
            ...OLD_ENV,
            NEXT_PUBLIC_API_BASE_URL: "http://api.example.test",
        };

        // Dynamic import AFTER env is set so the base URL is picked up correctly
        const mod = await import("@/lib/pinterestStats");
        fetchPinterestMonthlyStats = mod.fetchPinterestMonthlyStats;
    });

    afterEach(() => {
        process.env = OLD_ENV;
        globalThis.fetch = originalFetch;
        jest.restoreAllMocks();
    });

    it("calls backend with auth header and returns parsed stats", async () => {
        const fakeStats: PinterestMonthlyStat[] = [
            {
                id: 1,
                calendar_month: "2024-01-15", // mid-month to avoid TZ shenanigans
                impressions: 100,
                engagements: 10,
                outbound_clicks: 5,
                saves: 2,
                created_at: "2024-01-15T00:00:00Z",
                updated_at: "2024-01-15T00:00:00Z",
            },
        ];

        const fetchMock = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => fakeStats,
        } as Response);

        // wire our mock into the global fetch used by the util
        (globalThis as any).fetch = fetchMock;

        const result = await fetchPinterestMonthlyStats("token-123");

        expect(fetchMock).toHaveBeenCalledWith(
            "http://api.example.test/pinterest-stats/monthly",
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: "Bearer token-123",
                }),
                // if your impl sets other options (e.g. cache: "no-store"),
                // they are allowed here because of objectContaining
            }),
        );

        expect(result).toEqual(fakeStats);
    });

    it("throws a helpful error when the response is not ok", async () => {
        const fetchMock = jest.fn().mockResolvedValue({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            json: async () => ({ detail: "boom" }),
        } as Response);

        (globalThis as any).fetch = fetchMock;

        await expect(fetchPinterestMonthlyStats("token-123")).rejects.toThrow(
            /failed to fetch pinterest stats/i,
        );
    });
});

// frontend/lib/pinterestStats.ts

export type PinterestMonthlyStat = {
    id: number;
    calendar_month: string; // ISO date string, e.g. "2025-12-01"
    impressions: number;
    engagements: number;
    outbound_clicks: number;
    saves: number;
    created_at: string;
    updated_at: string;
};

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/**
 * Fetch monthly Pinterest stats from the backend.
 *
 * This calls the FastAPI endpoint:
 *   GET /pinterest-stats/monthly
 */
export async function fetchPinterestMonthlyStats(
    accessToken: string,
): Promise<PinterestMonthlyStat[]> {
    const url = `${API_BASE_URL}/pinterest-stats/monthly`;

    const res = await fetch(url, {
        // no-store so dashboard always sees fresh data
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        throw new Error(
            `Failed to fetch Pinterest stats: ${res.status} ${res.statusText}`,
        );
    }

    return res.json();
}

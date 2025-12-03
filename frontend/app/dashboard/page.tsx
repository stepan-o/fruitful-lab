// frontend/app/dashboard/page.tsx

import { cookies } from "next/headers";
import { fetchPinterestMonthlyStats, PinterestMonthlyStat } from "@/lib/pinterestStats";

const COOKIE_NAME = "fruitful_access_token";

function formatMonth(isoDate: string) {
    // crude but fine for now; we'll refine formatting later if needed
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
    });
}

export default async function DashboardPage() {
    // In this typing, cookies() returns a Promise<ReadonlyRequestCookies>,
    // so we await it once.
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    // middleware should prevent this, but guard just in case
    if (!token) {
        throw new Error("Missing auth token in dashboard; check middleware.");
    }

    let stats: PinterestMonthlyStat[] = [];
    let error: string | null = null;

    try {
        stats = await fetchPinterestMonthlyStats(token);
    } catch (err) {
        error =
            err instanceof Error
                ? err.message
                : "Unknown error fetching Pinterest stats.";
    }

    return (
        <main className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-4xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                        Fruitful Lab – Pinterest Stats
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Early dashboard view, reading directly from the FastAPI backend.
                    </p>
                </header>

                {error ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                        <p className="font-medium">Could not load stats</p>
                        <p className="mt-1">{error}</p>
                        <p className="mt-2 text-xs text-red-700">
                            Check that the backend is running on{" "}
                            <code className="rounded bg-red-100 px-1 py-0.5">
                                {process.env.NEXT_PUBLIC_API_BASE_URL ??
                                    "http://localhost:8000"}
                            </code>{" "}
                            and that CORS allows this origin.
                        </p>
                    </div>
                ) : stats.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600">
                        No Pinterest stats found yet. Try uploading a CSV via the backend
                        endpoint and refresh this page.
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Month
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Impressions
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Engagements
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Outbound Clicks
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Saves
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {stats.map((row) => (
                                <tr key={row.id}>
                                    <td className="whitespace-nowrap px-4 py-2 text-sm text-slate-800">
                                        {formatMonth(row.calendar_month)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-right font-medium text-slate-900">
                                        {row.impressions.toLocaleString()}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-right text-slate-800">
                                        {row.engagements.toLocaleString()}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-right text-slate-800">
                                        {row.outbound_clicks.toLocaleString()}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-right text-slate-800">
                                        {row.saves.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}

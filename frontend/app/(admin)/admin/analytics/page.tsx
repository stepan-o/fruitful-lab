// frontend/app/(admin)/admin/analytics/page.tsx
"use client";

import React, { useMemo, useState } from "react";

type MonthlyRow = {
    id: number;
    account_name: string;
    calendar_month: string; // ISO date string
    impressions: number;
    engagements: number;
    outbound_clicks: number;
    saves: number;
    uploaded_at: string; // ISO datetime
    created_at?: string;
    updated_at?: string;
};

function fmtMonth(isoDate: string) {
    // isoDate is like "2025-01-01"
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

export default function AdminAnalyticsPage() {
    const [accountName, setAccountName] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const [rows, setRows] = useState<MonthlyRow[]>([]);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const canSubmit = useMemo(() => {
        return accountName.trim().length > 0 && file !== null && !busy;
    }, [accountName, file, busy]);

    async function loadMonthly(name: string) {
        const res = await fetch(
            `/api/admin/pinterest-stats/monthly?account_name=${encodeURIComponent(
                name.trim(),
            )}`,
            { cache: "no-store" },
        );
        const data = await res.json().catch(() => null);
        if (!res.ok) {
            throw new Error(data?.detail ?? "Failed to load monthly stats");
        }
        setRows((data?.rows as MonthlyRow[]) ?? []);
    }

    async function onUpload(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);

        const name = accountName.trim();
        if (!name) {
            setMessage("Account name is required.");
            return;
        }
        if (!file) {
            setMessage("Please choose a CSV file.");
            return;
        }

        setBusy(true);
        try {
            const form = new FormData();
            form.set("account_name", name);
            form.set("file", file, file.name);

            const res = await fetch("/api/admin/pinterest-stats/upload", {
                method: "POST",
                body: form,
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(data?.detail ?? "Upload failed");
            }

            const inserted = data?.inserted ?? 0;
            const updated = data?.updated ?? 0;
            setMessage(`✅ Uploaded. Inserted: ${inserted}, Updated: ${updated}`);

            await loadMonthly(name);
        } catch (err: any) {
            setMessage(`❌ ${err?.message ?? "Something went wrong"}`);
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="space-y-6">
            <header className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
                <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                    Admin Analytics
                </h1>
                <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                    Upload a monthly Pinterest CSV and view normalized monthly rows.
                </p>
            </header>

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--foreground)]/70">
                    Upload
                </h2>

                <form onSubmit={onUpload} className="mt-4 space-y-4">
                    <div className="grid gap-3 md:grid-cols-2">
                        <label className="space-y-1">
                            <span className="text-sm text-[var(--foreground)]">Account name</span>
                            <input
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                                placeholder="e.g. Lenabo"
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--ring)]"
                            />
                        </label>

                        <label className="space-y-1">
                            <span className="text-sm text-[var(--foreground)]">CSV file</span>
                            <input
                                type="file"
                                accept=".csv,text/csv"
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                            />
                        </label>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className="rounded-xl border border-[var(--border)] bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--background)] disabled:opacity-50"
                        >
                            {busy ? "Uploading..." : "Upload CSV"}
                        </button>

                        <button
                            type="button"
                            disabled={busy || !accountName.trim()}
                            onClick={() => loadMonthly(accountName).catch((e) => setMessage(`❌ ${e.message}`))}
                            className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] disabled:opacity-50"
                        >
                            Refresh
                        </button>

                        {message ? (
                            <span className="text-sm text-[var(--foreground-muted)]">{message}</span>
                        ) : null}
                    </div>
                </form>
            </section>

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--foreground)]/70">
                    Monthly rows
                </h2>

                <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="border-b border-[var(--border)]">
                        <tr className="text-[var(--foreground)]/80">
                            <th className="py-2 pr-4">Month</th>
                            <th className="py-2 pr-4">Impressions</th>
                            <th className="py-2 pr-4">Engagements</th>
                            <th className="py-2 pr-4">Outbound Clicks</th>
                            <th className="py-2 pr-4">Saves</th>
                            <th className="py-2 pr-4">Uploaded</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-6 text-[var(--foreground-muted)]"
                                >
                                    No rows yet. Upload a CSV to populate this table.
                                </td>
                            </tr>
                        ) : (
                            rows.map((r) => (
                                <tr
                                    key={r.id}
                                    className="border-b border-[var(--border)] last:border-0"
                                >
                                    <td className="py-2 pr-4 text-[var(--foreground)]">
                                        {fmtMonth(r.calendar_month)}
                                    </td>
                                    <td className="py-2 pr-4 text-[var(--foreground)]">
                                        {r.impressions.toLocaleString()}
                                    </td>
                                    <td className="py-2 pr-4 text-[var(--foreground)]">
                                        {r.engagements.toLocaleString()}
                                    </td>
                                    <td className="py-2 pr-4 text-[var(--foreground)]">
                                        {r.outbound_clicks.toLocaleString()}
                                    </td>
                                    <td className="py-2 pr-4 text-[var(--foreground)]">
                                        {r.saves.toLocaleString()}
                                    </td>
                                    <td className="py-2 pr-4 text-[var(--foreground-muted)]">
                                        {new Date(r.uploaded_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

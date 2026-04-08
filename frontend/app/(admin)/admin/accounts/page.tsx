"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminAccountsPage() {
    const [accounts, setAccounts] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch("/api/admin/pinterest-stats/accounts", {
                    cache: "no-store",
                });

                if (!res.ok) {
                    const txt = await res.text().catch(() => "");
                    throw new Error(`accounts fetch failed (${res.status}): ${txt}`);
                }

                const data = (await res.json()) as string[];
                if (!cancelled) setAccounts(data);
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Accounts</h1>
            <p style={{ marginBottom: 16, color: "#666" }}>
                Select an account to jump into analytics.
            </p>

            {loading && <div>Loading…</div>}
            {error && (
                <div style={{ padding: 12, border: "1px solid #f2c2c2", borderRadius: 8 }}>
                    <strong style={{ color: "#a00" }}>Error:</strong> {error}
                </div>
            )}

            {!loading && !error && accounts.length === 0 && (
                <div>No accounts found.</div>
            )}

            {!loading && !error && accounts.length > 0 && (
                <ul style={{ marginTop: 12, paddingLeft: 18 }}>
                    {accounts.map((name) => (
                        <li key={name} style={{ marginBottom: 8 }}>
                            <Link href={`/admin/analytics?account=${encodeURIComponent(name)}`}>
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// frontend/app/login/LoginPageClient.tsx
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Default should be home; server will override based on role anyway.
    const nextParam = searchParams.get("next") || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const resp = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, next: nextParam }),
            });

            const data = await resp.json().catch(() => ({}));

            if (!resp.ok) {
                router.push(data.redirectTo ?? "/tools?flash=login_failed");
                router.refresh();
                return;
            }

            router.push(data.redirectTo ?? "/tools");
            router.refresh();
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
            setSubmitting(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">
                    Sign in to Fruitful Lab
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                    This area is for internal dashboards and tools.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <input
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                    </div>

                    {error && (
                        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex w-full items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {submitting ? "Signing in…" : "Sign in"}
                    </button>

                    {/* Back link */}
                    <div className="pt-2 text-center">
                        <Link
                            href="/"
                            className="text-sm font-medium text-slate-600 hover:text-slate-900 underline underline-offset-4"
                        >
                            ← Back to home
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}
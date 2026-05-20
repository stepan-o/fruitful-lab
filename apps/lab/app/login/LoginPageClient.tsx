// frontend/app/login/LoginPageClient.tsx
"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type LoginResponse = {
    success?: boolean;
    redirectTo?: string;
    detail?: string;
}

function parseLoginResponse(x: unknown): LoginResponse {
    if (!x || typeof x !== "object") return {};
    const o = x as Record<string, unknown>;
    return {
        success: typeof o.success === "boolean" ? o.success : undefined,
        redirectTo: typeof o.redirectTo === "string" ? o.redirectTo : undefined,
        detail: typeof o.detail === "string" ? o.detail : undefined,
    };
}

function flashToMessage(flash: string | null): string | null {
    if (!flash) return null;
    if (flash === "auth_required") return "Please sign in to continue.";
    if (flash === "session_expired") return "Your session expired. Please sign in again.";
    if (flash === "auth_unavailable") return "Auth service is unavailable right now. Try again.";
    if (flash === "auth_misconfig") return "Auth is misconfigured (API base URL). Check server env.";
    return null;
}

export default function LoginPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Default should be home; server will override based on role anyway.
    const nextParam = searchParams.get("next") || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // If middleware redirects us back to /login with a reason, show it + unstick UI.
    useEffect(() => {
        const flash = searchParams.get("flash");
        const msg = flashToMessage(flash);
        if (msg) setError(msg);
        setSubmitting(false);
    }, [searchParams]);

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

            const raw = await resp.json().catch(() => null);
            const data = parseLoginResponse(raw);

            if (!resp.ok) {
                setError(data.detail ?? "Invalid email or password.");
                return;
            }

            const redirectTo = data.redirectTo ?? nextParam ?? "/admin/analytics";
            router.replace(redirectTo);
            // router.refresh();
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Something went wrong. Please try again."
            setError(msg);
        } finally {
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
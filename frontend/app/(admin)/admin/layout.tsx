// frontend/app/(admin)/admin/layout.tsx
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import FlashBanner from "@/components/layout/FlashBanner";
import AdminHeader from "@/components/layout/AdminHeader";
import AdminFooter from "@/components/layout/AdminFooter";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const user = await getCurrentUser();

    // Not logged in → send to login, preserve intent.
    if (!user) {
        redirect("/login?next=/admin/dashboard");
    }

    // Logged in but not admin → send to least-surprising place.
    if (!user.is_admin) {
        if (user.groups?.includes("contractor")) redirect("/contractor");
        redirect("/tools");
    }

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <AdminHeader />

            {/* Global flash toast (top-right) */}
            <FlashBanner />

            <main className="flex-1">
                <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:py-12">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
                        <aside className="hidden lg:block">
                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground)]/70">
                                    Admin Area
                                </p>
                                <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                                    Internal dashboards + controls.
                                </p>

                                <div className="mt-4 space-y-2 text-sm">
                                    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--foreground-muted)]">
                                        Nav coming soon
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <section className="min-w-0">{children}</section>
                    </div>
                </div>
            </main>

            <AdminFooter />
        </div>
    );
}
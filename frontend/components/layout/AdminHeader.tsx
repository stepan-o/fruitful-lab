// frontend/components/admin/AdminHeader.tsx
import Link from "next/link";

export default function AdminHeader() {
    return (
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
                {/* Left: Brand + Admin label */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/dashboard"
                        className="font-heading text-lg tracking-wide text-[var(--foreground)] hover:text-[var(--brand-heading)] transition-colors"
                    >
                        Fruitful Lab
                    </Link>
                    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-[11px] font-semibold text-[var(--foreground-muted)]">
            Admin
          </span>
                </div>

                {/* Center: Admin nav */}
                <nav className="hidden items-center gap-6 text-sm sm:flex">
                    <Link
                        href="/admin/dashboard"
                        className="text-[var(--foreground)]/90 hover:text-[var(--brand-heading)] transition-colors"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/tools"
                        className="text-[var(--foreground)]/90 hover:text-[var(--brand-heading)] transition-colors"
                    >
                        Tools
                    </Link>
                    <Link
                        href="/"
                        className="text-[var(--foreground)]/90 hover:text-[var(--brand-heading)] transition-colors"
                    >
                        Hub
                    </Link>
                </nav>

                {/* Right: lightweight actions */}
                <div className="flex items-center gap-2">
                    <Link
                        href="/tools"
                        className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors"
                    >
                        Back to Tools
                    </Link>

                    {/* If you already have a real logout route/button, swap this link */}
                    <Link
                        href="/logout"
                        className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors"
                    >
                        Log out
                    </Link>
                </div>
            </div>
        </header>
    );
}
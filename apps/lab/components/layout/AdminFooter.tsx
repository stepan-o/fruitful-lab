// frontend/components/admin/AdminFooter.tsx
import Link from "next/link";

export default function AdminFooter() {
    return (
        <footer className="border-t border-[var(--border)]">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-6 text-sm text-[var(--foreground-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs">
                    © {new Date().getFullYear()} Fruitful Lab • Internal Admin
                </p>

                <div className="flex flex-wrap items-center gap-4">
                    <Link
                        href="/admin/dashboard"
                        className="text-xs underline underline-offset-4 hover:text-[var(--brand-heading)] transition-colors"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/tools"
                        className="text-xs underline underline-offset-4 hover:text-[var(--brand-heading)] transition-colors"
                    >
                        Tools
                    </Link>
                    <a
                        href="https://fruitfulpin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline underline-offset-4 hover:text-[var(--brand-heading)] transition-colors"
                    >
                        Main Agency Site
                    </a>
                </div>
            </div>
        </footer>
    );
}
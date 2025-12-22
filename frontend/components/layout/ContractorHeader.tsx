import Link from "next/link";
import LogoutButton from "@/components/layout/LogoutButton";
import type { CurrentUser } from "@/lib/auth";
import { CONTRACTOR_NAV_LINKS } from "@/lib/nav";

function NavLinks() {
    return (
        <nav className="hidden items-center gap-7 text-sm sm:text-base md:flex">
            {CONTRACTOR_NAV_LINKS.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className="font-medium text-[var(--foreground)] hover:text-[var(--brand-heading)] transition-colors"
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}

export default function ContractorHeader({ user }: { user: CurrentUser }) {
    return (
        <header className="border-b border-[var(--brand-alabaster)] bg-[var(--background)]/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
                {/* Left: identity */}
                <div className="flex items-center gap-3">
                    <Link href="/contractor" className="font-heading text-lg font-semibold text-[var(--foreground)]">
                        Contractor
                    </Link>
                    <span className="hidden text-xs text-[var(--foreground-muted)] sm:inline">
            {user.full_name || user.email}
          </span>
                </div>

                {/* Center nav (desktop) */}
                <NavLinks />

                {/* Right: actions */}
                <div className="hidden items-center gap-3 md:flex">
                    <LogoutButton />
                </div>

                {/* Mobile menu */}
                <details className="md:hidden">
                    <summary className="cursor-pointer rounded-md px-2 py-1 font-semibold text-[var(--foreground)] marker:hidden hover:text-[var(--brand-heading)] transition-colors">
                        Menu
                    </summary>
                    <div className="absolute left-0 right-0 z-10 mt-2 border-b border-[var(--brand-alabaster)] bg-[var(--background)] px-4 py-3 shadow-sm">
                        <div className="flex flex-col gap-3 text-sm text-[var(--foreground)]">
                            {CONTRACTOR_NAV_LINKS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="font-medium hover:text-[var(--brand-heading)] transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            <div className="pt-2">
                                <LogoutButton />
                            </div>
                        </div>
                    </div>
                </details>
            </div>
        </header>
    );
}
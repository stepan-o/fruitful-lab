import Link from "next/link";
import { PUBLIC_NAV_LINKS } from "@/lib/nav";

export default function SiteFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-[var(--border)] bg-[var(--background)]">
            <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
                {/* Top row: tagline + hub mini-nav */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
                        Effective Pinterest Marketing &amp; Funnel Studio For Content Creators &amp; Specialty Brands.
                    </p>

                    <nav className="flex flex-wrap items-center gap-4 text-sm">
                        {PUBLIC_NAV_LINKS.map((item) =>
                            item.external ? (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                                >
                                    {item.label}
                                </Link>
                            )
                        )}
                    </nav>
                </div>

                {/* Bottom row: legal + copyright */}
                <div className="mt-6 flex flex-col gap-3 border-t border-[var(--border)] pt-5 text-xs sm:flex-row sm:items-center sm:justify-between">
                    <nav className="flex flex-wrap items-center gap-4">
                        <a
                            href="#"
                            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                        >
                            Privacy
                        </a>
                        <a
                            href="#"
                            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                        >
                            Imprint
                        </a>
                        <a
                            href="mailto:hello@fruitfulab.com"
                            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                        >
                            Contact
                        </a>
                    </nav>

                    <p className="text-[var(--foreground-muted)]">© {year} Fruitful Lab</p>
                </div>
            </div>
        </footer>
    );
}

import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/layout/LogoutButton";
import { BookCallButton } from "@/components/layout/BookCallButton";
import { getCurrentUser } from "@/lib/auth";
import { PUBLIC_NAV_LINKS } from "@/lib/nav";

function NavLinks() {
    return (
        <nav className="hidden items-center gap-7 text-sm sm:text-base md:flex">
            {PUBLIC_NAV_LINKS.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="font-medium text-[var(--foreground)] hover:text-[var(--brand-heading)] transition-colors"
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}

export default async function SiteHeader() {
    const user = await getCurrentUser();
    const isLoggedIn = !!user;

    return (
        <header className="border-b border-[var(--brand-alabaster)] bg-[var(--background)]/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/cropped-Logo-Pink.png"
                        alt="Fruitful Lab"
                        width={220}
                        height={60}
                        priority
                        className="h-9 w-auto sm:h-10"
                    />
                    <span className="sr-only">Fruitful Lab</span>
                </Link>

                {/* Center nav (desktop) */}
                <NavLinks />

                {/* CTAs (desktop) */}
                <div className="hidden items-center gap-3 md:flex">
                    <BookCallButton />

                    {isLoggedIn ? (
                        <LogoutButton />
                    ) : (
                        <Link
                            href="/login?next=/dashboard"
                            className={[
                                "rounded-md border px-4 py-2 text-sm md:text-base font-semibold",
                                "border-[var(--brand-heading)]",
                                "bg-[var(--background)]",
                                "text-[var(--brand-heading)]",
                                "hover:bg-[var(--brand-alabaster)]/25",
                                "transition-colors",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                                "focus-visible:ring-[var(--brand-heading)]",
                                "focus-visible:ring-offset-[var(--background)]",
                            ].join(" ")}
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile menu */}
                <details className="md:hidden">
                    <summary className="cursor-pointer rounded-md px-2 py-1 font-semibold text-[var(--foreground)] marker:hidden hover:text-[var(--brand-heading)] transition-colors">
                        Menu
                    </summary>
                    <div className="absolute left-0 right-0 z-10 mt-2 border-b border-[var(--brand-alabaster)] bg-[var(--background)] px-4 py-3 shadow-sm">
                        <div className="flex flex-col gap-3 text-sm text-[var(--foreground)]">
                            {PUBLIC_NAV_LINKS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    target={item.external ? "_blank" : undefined}
                                    rel={item.external ? "noopener noreferrer" : undefined}
                                    className="font-medium hover:text-[var(--brand-heading)] transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            <BookCallButton fullWidth />

                            {isLoggedIn ? (
                                <div className="pt-2">
                                    <LogoutButton />
                                </div>
                            ) : (
                                <Link
                                    href="/login?next=/dashboard"
                                    className={[
                                        "mt-1 rounded-md border px-4 py-2 text-center text-sm font-semibold",
                                        "border-[var(--brand-heading)]",
                                        "bg-[var(--background)]",
                                        "text-[var(--brand-heading)]",
                                        "hover:bg-[var(--brand-alabaster)]/25",
                                        "transition-colors",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                                        "focus-visible:ring-[var(--brand-heading)]",
                                        "focus-visible:ring-offset-[var(--background)]",
                                    ].join(" ")}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </details>
            </div>
        </header>
    );
}

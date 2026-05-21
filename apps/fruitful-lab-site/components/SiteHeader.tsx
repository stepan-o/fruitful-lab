import Link from "next/link";
import { BOOKING_URL, PRIMARY_NAV, SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_92%,white)]/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link className="inline-flex items-center gap-3 text-lg font-semibold tracking-tight text-[var(--heading)]" href="/" aria-label={`${SITE_NAME} home`}>
          <span className="grid h-9 w-9 place-items-center rounded-md bg-[var(--heading)] text-sm font-bold text-[var(--gold)]">FL</span>
          <span>{SITE_NAME}</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-[var(--muted)] lg:flex" aria-label="Primary">
          {PRIMARY_NAV.map((item) => (
            <Link key={item.href} className="hover:text-[var(--bronze)]" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <a className="inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--heading)] px-4 text-sm font-semibold text-white" href={BOOKING_URL}>
          Book a call
        </a>
      </div>
    </header>
  );
}

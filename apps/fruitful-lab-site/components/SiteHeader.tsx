import Link from "next/link";
import { BOOKING_URL, PRIMARY_NAV, SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/90 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link className="inline-flex items-center gap-3 text-lg font-extrabold text-[var(--heading)]" href="/" aria-label={`${SITE_NAME} home`}>
          <span className="grid h-9 w-9 place-items-center rounded-md bg-[var(--navy)] text-sm font-black text-[var(--amber)] shadow-sm">FL</span>
          <span>{SITE_NAME}</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-[var(--muted)] lg:flex" aria-label="Primary">
          {PRIMARY_NAV.map((item) => (
            <Link key={item.href} className="transition hover:text-[var(--cobalt)]" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <a className="btn btn-primary min-h-10 px-4 py-2 text-sm" href={BOOKING_URL}>
          Book a call
        </a>
      </div>
    </header>
  );
}

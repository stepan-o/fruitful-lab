import Link from "next/link";
import { BOOKING_URL, FIT_CALL_LABEL, PRIMARY_NAV, SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link className="flex items-center gap-3 text-lg font-semibold text-[var(--heading)]" href="/">
          <span className="grid size-9 place-items-center rounded-md bg-[var(--brand-pink)] text-sm font-bold text-white shadow-sm">FP</span>
          <span>{SITE_NAME}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-base font-semibold text-[var(--muted)] lg:flex" aria-label="Primary">
          {PRIMARY_NAV.map((item) => (
            <Link key={item.href} className="hover:text-[var(--brand-pink)]" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link className="button-primary inline-flex min-h-10 items-center justify-center rounded-md px-4 text-sm font-semibold transition" href={BOOKING_URL}>
            {FIT_CALL_LABEL}
          </Link>
        </div>
        <details className="group relative lg:hidden">
          <summary className="grid size-11 list-none place-items-center rounded-md border border-[var(--border)] bg-[var(--surface)]" aria-label="Open navigation menu">
            <span className="flex flex-col gap-1.5" aria-hidden="true">
              <span className="block h-0.5 w-5 rounded bg-[var(--heading)]" />
              <span className="block h-0.5 w-5 rounded bg-[var(--heading)]" />
              <span className="block h-0.5 w-5 rounded bg-[var(--heading)]" />
            </span>
          </summary>
          <nav className="absolute right-0 mt-3 grid w-64 gap-1 rounded-md border border-[var(--border)] bg-[var(--surface)] p-3 text-sm font-medium text-[var(--heading)] shadow-lg" aria-label="Mobile primary">
            {PRIMARY_NAV.map((item) => (
              <Link key={item.href} className="rounded-md px-3 py-2 hover:bg-[var(--surface-warm)]" href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link className="button-primary mt-2 inline-flex min-h-10 items-center justify-center rounded-md px-4 text-sm font-semibold" href={BOOKING_URL}>
              {FIT_CALL_LABEL}
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

import Image from "next/image";
import Link from "next/link";
import { BRAND_ASSETS } from "@/lib/brandAssets";
import { BOOKING_URL, FIT_CALL_LABEL, PRIMARY_NAV, SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-20">
      <div className="site-header-inner mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link className="site-brand flex items-center gap-3 text-[var(--heading)]" href="/" aria-label="Fruitful Pin home">
          <Image
            src={BRAND_ASSETS.logoPrussianBlue}
            alt=""
            width={860}
            height={390}
            className="site-brand-logo"
            priority
          />
          <span className="sr-only">{SITE_NAME}</span>
        </Link>
        <nav className="site-nav hidden items-center gap-6 text-base font-semibold text-[var(--muted)] lg:flex" aria-label="Primary">
          {PRIMARY_NAV.map((item) => (
            <Link key={item.href} className="hover:text-[var(--brand-pink)]" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link className="button-primary site-header-cta inline-flex min-h-10 items-center justify-center px-4 text-sm font-semibold transition" href={BOOKING_URL}>
            {FIT_CALL_LABEL}
          </Link>
        </div>
        <details className="group relative lg:hidden">
          <summary className="site-menu-button grid size-11 list-none place-items-center" aria-label="Open navigation menu">
            <span className="flex flex-col gap-1.5" aria-hidden="true">
              <span className="block h-0.5 w-5 rounded bg-[var(--heading)]" />
              <span className="block h-0.5 w-5 rounded bg-[var(--heading)]" />
              <span className="block h-0.5 w-5 rounded bg-[var(--heading)]" />
            </span>
          </summary>
          <nav className="site-mobile-nav absolute right-0 mt-3 grid w-64 gap-1 p-3 text-sm font-medium text-[var(--heading)]" aria-label="Mobile primary">
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

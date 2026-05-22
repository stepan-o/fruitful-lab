import Link from "next/link";
import { BOOKING_URL, PRIMARY_NAV, SITE_NAME } from "@/lib/site";

const SERVICES_MENU = [
  { label: "Fit Call", description: "A first read on fit and current bottlenecks." },
  { label: "Diagnostic", description: "A paid map for the first useful growth system." },
  { label: "Implementation", description: "Build the page, path, workflow, or reporting loop." },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link className="brand-mark" href="/" aria-label={`${SITE_NAME} home`}>
          <span className="brand-mark-icon">FL</span>
          <span>{SITE_NAME}</span>
        </Link>
        <nav className="nav-pill" aria-label="Primary">
          {PRIMARY_NAV.map((item) => (
            item.href === "/services" ? (
              <div key={item.href} className="nav-menu">
                <Link className="nav-link" href={item.href}>
                  {item.label}
                </Link>
                <div className="nav-menu-panel">
                  <p className="nav-menu-kicker">Engagement path</p>
                  {SERVICES_MENU.map((service) => (
                    <Link key={service.label} href="/services" className="nav-menu-item">
                      <span>{service.label}</span>
                      <small>{service.description}</small>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={item.href} className="nav-link" href={item.href}>
                {item.label}
              </Link>
            )
          ))}
        </nav>
        <a className="btn btn-primary header-cta min-h-10 px-4 py-2 text-sm" href={BOOKING_URL}>
          Get a plan
        </a>
      </div>
    </header>
  );
}

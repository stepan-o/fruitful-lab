import Image from "next/image";
import Link from "next/link";
import { BOOKING_URL, PRIMARY_NAV, SITE_NAME } from "@/lib/site";

const SERVICES_MENU = [
  { label: "Search ecosystem", description: "Pinterest, Google, SEO, AI search, and visual discovery." },
  { label: "Paid media", description: "Acquisition tests, offer paths, and campaign structure." },
  { label: "SEO + content", description: "Use-case content, product education, and search-led pages." },
  { label: "Lifecycle + funnels", description: "Email, lead capture, launches, and follow-up systems." },
  { label: "Data + testing", description: "Analytics, reporting, A/B tests, and decision dashboards." },
  { label: "AI creative systems", description: "Brand-trained creative workflows that do not look generic." },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link className="brand-mark" href="/" aria-label={`${SITE_NAME} home`}>
          <Image
            className="brand-mark-logo"
            src="/images/brand/fruitful-lab-logo.png"
            alt={SITE_NAME}
            width={194}
            height={75}
            priority
          />
        </Link>
        <nav className="nav-pill" aria-label="Primary">
          {PRIMARY_NAV.map((item) => (
            item.href === "/services" ? (
              <div key={item.href} className="nav-menu">
                <Link className="nav-link" href={item.href}>
                  {item.label}
                </Link>
                <div className="nav-menu-panel">
                  <p className="nav-menu-kicker">Service labs</p>
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

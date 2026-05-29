import Image from "next/image";
import Link from "next/link";
import { GlitterField } from "@/components/GlitterField";
import { SITE_NAME } from "@/lib/site";

const exploreLinks = [
  { label: "Flower Meaning Guide", href: "/flower-meaning-guide" },
  { label: "Journal", href: "/journal" },
  { label: "Podcast", href: "/podcast" },
  { label: "Quiz", href: "/flower-message-quiz" },
  { label: "Shop Soon", href: "/shop" },
] as const;

const connectLinks = [
  { label: "About", href: "/about", icon: "none" },
  { label: "Contact", href: "/contact", icon: "none" },
  { label: "Be a Guest", href: "/contact#be-a-guest", icon: "none" },
  { label: "Instagram", href: "https://www.instagram.com/bloomwhispers/", icon: "instagram" },
  { label: "Spotify", href: "https://open.spotify.com/show/0iIlU2mfu9Nowa1qVu0qhc", icon: "spotify" },
  { label: "Apple Podcasts", href: "https://podcasts.apple.com/us/podcast/bloom-whispers/id1738589218", icon: "podcast" },
] as const;

function FooterIcon({ type }: { type: (typeof connectLinks)[number]["icon"] }) {
  if (type === "instagram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17" cy="7" r="1" />
      </svg>
    );
  }

  if (type === "spotify") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M7.6 9.5c3.1-.8 6.1-.5 8.9.9" />
        <path d="M8.2 12.2c2.4-.6 4.8-.4 7 .7" />
        <path d="M8.8 14.8c1.7-.4 3.5-.3 5.2.5" />
      </svg>
    );
  }

  if (type === "podcast") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M7 14.5a6 6 0 1 1 10 0" />
        <path d="M5 15a8 8 0 1 1 14 0" />
        <circle cx="12" cy="10.4" r="2.5" />
        <path d="M10.7 14h2.6l.7 6h-4z" />
      </svg>
    );
  }

  return <span className="footer-link-spacer" aria-hidden="true" />;
}

function FooterLink({ href, label, icon }: { href: string; label: string; icon?: (typeof connectLinks)[number]["icon"] }) {
  const content = (
    <>
      {icon ? <FooterIcon type={icon} /> : null}
      <span>{label}</span>
      <span className="footer-link-arrow" aria-hidden="true">
        →
      </span>
    </>
  );

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return <Link href={href}>{content}</Link>;
}

export function SiteFooter() {
  return (
    <footer className="site-footer" id="footer">
      <Image
        className="footer-background-image"
        src="/assets/podcast-section-bg.png"
        alt=""
        fill
        sizes="100vw"
      />
      <Image
        className="footer-floral footer-floral--left"
        src="/assets/shop-ribbon-floral-accent.png.png"
        alt=""
        width={1755}
        height={2194}
        sizes="(max-width: 900px) 260px, 520px"
      />
      <Image
        className="footer-floral footer-floral--right"
        src="/assets/journal-right-floral-edge.png"
        alt=""
        width={1755}
        height={2194}
        sizes="(max-width: 900px) 260px, 560px"
      />

      <div className="footer-starfield" aria-hidden="true">
        <span className="footer-star footer-star--1" />
        <span className="footer-star footer-star--2" />
        <span className="footer-star footer-star--3" />
        <span className="footer-star footer-star--4" />
        <span className="footer-star footer-star--5" />
      </div>
      <GlitterField className="site-glitter--footer" />

      <div className="footer-rule footer-rule--top" aria-hidden="true">
        <span>✦</span>
      </div>

      <div className="footer-main">
        <section className="footer-brand-panel" aria-label="Bloom Whispers footer introduction">
          <Link className="footer-logo-link" href="/">
            <Image
              className="footer-logo"
              src="/assets/bloom whispers assets logo white.png"
              alt={SITE_NAME}
              width={500}
              height={200}
              sizes="260px"
            />
          </Link>
          <p className="footer-tagline">Where every flower tells a story.</p>
          <span className="footer-mini-divider" aria-hidden="true">
            ✦
          </span>
          <p className="footer-description">
            Discover the meanings behind flowers, stories that bloom, gentle rituals, and beautiful finds to brighten
            your everyday.
          </p>
          <Link className="footer-letter-button" href="/#bloom-letter">
            Join the Bloom Letter
            <span aria-hidden="true">✦</span>
          </Link>
        </section>

        <nav className="footer-link-column" aria-label="Explore">
          <h2>Explore</h2>
          <span className="footer-heading-star" aria-hidden="true">
            ✦
          </span>
          <ul>
            {exploreLinks.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <FooterLink href={item.href} label={item.label} />
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer-link-column footer-link-column--connect" aria-label="Connect">
          <h2>Connect</h2>
          <span className="footer-heading-star" aria-hidden="true">
            ✦
          </span>
          <ul>
            {connectLinks.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <FooterLink href={item.href} label={item.label} icon={item.icon} />
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="footer-bottom">
        <p className="footer-mantra">
          <span>Rooted in nature</span>
          <span aria-hidden="true">✦</span>
          <span>Guided by story</span>
          <span aria-hidden="true">✦</span>
          <span>Inspired by beauty</span>
        </p>
        <p className="footer-legal">
          <span>© 2026 {SITE_NAME}</span>
          <Link href="/privacy">Privacy</Link>
          <span aria-hidden="true">·</span>
          <Link href="/terms">Terms</Link>
        </p>
      </div>
    </footer>
  );
}

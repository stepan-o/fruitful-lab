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
  { label: "Threads", href: "https://www.threads.net/@bloomwhispers", icon: "threads" },
  { label: "Pinterest", href: "https://www.pinterest.com/bloomwhispers1/", icon: "pinterest" },
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

  if (type === "threads") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M15.8 10.6c-.4-2.2-1.8-3.5-4-3.5c-2.7 0-4.6 2.1-4.6 5.1c0 3.1 1.9 5.2 4.8 5.2c2.6 0 4.5-1.4 4.5-3.4c0-1.7-1.4-2.8-3.5-2.8h-1.7" />
        <path d="M12.1 13.2c-1 0-1.7.4-1.7 1.1s.6 1.1 1.6 1.1c1.2 0 2-.7 2-1.8v-.4" />
        <path d="M16.3 11.3c1.6.5 2.5 1.5 2.5 3c0 3-2.8 5.2-6.7 5.2c-4.4 0-7.2-2.9-7.2-7.4c0-4.3 2.8-7.3 6.9-7.3c3.5 0 6 2 6.7 5.3" />
      </svg>
    );
  }

  if (type === "pinterest") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M10.4 19.8l1.2-5.1" />
        <path d="M11.8 14.2c.6 1 1.6 1.4 2.7 1.4c2.3 0 4-2.1 4-4.8c0-3-2.4-5.2-5.9-5.2c-3.8 0-6.2 2.5-6.2 5.7c0 1.8.8 3.2 2.1 3.8" />
        <path d="M10.8 13.6c.4-1.7.8-3.3 1.1-4.4c.3-1 1-1.6 1.9-1.6c1.1 0 1.8.8 1.8 1.9c0 1.8-1 3.4-2.4 3.4c-.8 0-1.4-.4-1.7-1.1" />
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

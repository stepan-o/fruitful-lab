import Image from "next/image";
import Link from "next/link";
import { GlitterField } from "@/components/GlitterField";
import { PRIMARY_NAV, SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header" aria-label="Primary">
      <GlitterField className="site-glitter--header" />
      <span className="header-rule-star" aria-hidden="true">
        ✦
      </span>
      <Link className="brand-mark" href="/" aria-label={`${SITE_NAME} home`}>
        <Image
          className="nav-logo"
          src="/assets/bloom whispers assets logo white.png"
          alt={SITE_NAME}
          width={500}
          height={200}
          priority
        />
      </Link>
      <div className="header-actions">
        <nav className="primary-nav" aria-label="Main navigation">
          {PRIMARY_NAV.map((item) => (
            <Link
              className={item.label === "Shop Soon" ? "nav-link nav-link--featured" : "nav-link"}
              key={`${item.href}-${item.label}`}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="header-letter-link" href="/flower-message-quiz" aria-label="Take the Flower Quiz">
          <span className="header-letter-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M12 3.8 13.7 9l5.3 1.7-5.3 1.7L12 17.6l-1.7-5.2L5 10.7 10.3 9 12 3.8Z" />
              <path d="m18.5 15.8.8 2.3 2.3.8-2.3.8-.8 2.3-.8-2.3-2.3-.8 2.3-.8.8-2.3Z" />
            </svg>
          </span>
          <span>Take the Quiz</span>
        </Link>
      </div>
    </header>
  );
}

import Image from "next/image";
import Link from "next/link";
import { CERTIFICATION_BADGES, FIT_SIGNALS, NICE_WORDS } from "@/lib/content";
import { BOOKING_URL, FIT_CALL_LABEL } from "@/lib/site";

export const metadata = {
  title: "About",
  description: "Meet Susy, the Pinterest strategist behind Fruitful Pin, and learn how the work blends search strategy, creative judgment, and human communication.",
};

type ValueIconName = "strategy" | "data" | "global" | "communication" | "creative";

const ABOUT_VALUES = [
  {
    icon: "strategy",
    title: "Strategic over trendy",
    description: "Long-term Pinterest systems over viral-chasing and random posting.",
  },
  {
    icon: "data",
    title: "Data-driven decisions",
    description: "Keyword research, analytics, and conversion clues guide the work.",
  },
  {
    icon: "global",
    title: "Global by nature",
    description: "A multicultural lens for brands, creators, and audiences in different markets.",
  },
  {
    icon: "communication",
    title: "Clear human communication",
    description: "Thoughtful updates, direct recommendations, and no mystery strategy fog.",
  },
  {
    icon: "creative",
    title: "Creativity with purpose",
    description: "Pins should be beautiful, useful, aligned, and connected to a destination.",
  },
] satisfies Array<{ icon: ValueIconName; title: string; description: string }>;

const FUN_FACTS = [
  { icon: "ES", text: "Bilingual brain, multicultural lens." },
  { icon: "ART", text: "Watercolor artist in progress." },
  { icon: "MTL", text: "Born in Mexico, based in Montreal." },
  { icon: "WHY", text: "Always curious, always observing." },
  { icon: "PIN", text: "Pinterest aligns with how Susy thinks: strategy over noise, long-term over quick wins." },
] as const;

const OWN_PHOTO = "https://fruitfulpin.com/wp-content/uploads/2025/12/Cid-own-photo.webp";
const HEADSHOT = "https://fruitfulpin.com/wp-content/uploads/2025/12/Cid-headshot.webp";

function AccentCurve({ className = "" }: { className?: string }) {
  return (
    <svg className={`accent-curve ${className}`} viewBox="0 0 240 34" aria-hidden="true" focusable="false">
      <path d="M10 24C55 10 145 7 230 20" />
    </svg>
  );
}

function ValueIcon({ name }: { name: ValueIconName }) {
  const iconProps = {
    className: "about-icon-svg",
    viewBox: "0 0 64 64",
    "aria-hidden": "true",
    focusable: "false",
  } as const;

  switch (name) {
    case "strategy":
      return (
        <svg {...iconProps}>
          <path d="M10 45c9-19 20-26 34-26" />
          <path d="M36 14h11v11" />
          <path d="M18 48c10 2 21-2 30-13" />
          <path d="M14 20c4-3 8-4 13-3" />
        </svg>
      );
    case "data":
      return (
        <svg {...iconProps}>
          <path d="M12 48h40" />
          <path d="M17 42V29" />
          <path d="M30 42V18" />
          <path d="M43 42V25" />
          <path d="M13 22c8-8 14 7 22 0 6-5 10-7 17-2" />
        </svg>
      );
    case "global":
      return (
        <svg {...iconProps}>
          <circle cx="32" cy="32" r="21" />
          <path d="M11 32h42" />
          <path d="M32 11c8 8 8 34 0 42" />
          <path d="M32 11c-8 8-8 34 0 42" />
          <path d="M18 19c8 4 20 4 28 0" />
          <path d="M18 45c8-4 20-4 28 0" />
        </svg>
      );
    case "communication":
      return (
        <svg {...iconProps}>
          <path d="M14 18h29a8 8 0 0 1 8 8v8a8 8 0 0 1-8 8H29l-12 8v-8h-3a8 8 0 0 1-8-8v-8a8 8 0 0 1 8-8Z" />
          <path d="M20 28h24" />
          <path d="M20 35h15" />
        </svg>
      );
    case "creative":
      return (
        <svg {...iconProps}>
          <path d="M17 43c10-2 22-9 28-22" />
          <path d="M40 14l10 10" />
          <path d="M36 18l10 10" />
          <path d="M15 45l-2 7 7-2" />
          <path d="M17 15l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" />
        </svg>
      );
  }
}

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="about-simple-hero">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 lg:py-20">
          <p className="eyebrow">About Fruitful Pin</p>
          <h1 className="brand-display mt-5 text-4xl leading-tight text-[var(--heading)] sm:text-5xl lg:text-6xl">
            We don&apos;t just pin. We <span className="text-gradient">strategize, optimize, and scale.</span>
          </h1>
          <AccentCurve className="accent-curve-center mt-5" />
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Fruitful Pin helps product brands and creators turn Pinterest from an afterthought into a search-led growth channel with strategy, creative direction, and follow-through.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="about-story-grid mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div>
            <p className="eyebrow">The story</p>
            <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">
              From one Pinterest account to a full-funnel agency.
            </h2>
            <div className="mt-6 space-y-4 text-base leading-7 text-[var(--muted)]">
              <p>Fruitful Pin started as a hands-on experiment: managing Pinterest for a small bean-to-bar chocolate maker.</p>
              <p>That work showed what happens when Pinterest is treated like a search engine and connected to real offers, useful content, and a post-click path that makes sense.</p>
              <p>Today, Fruitful Pin supports food brands, product businesses, bloggers, and niche creators who want Pinterest to do more than look active.</p>
            </div>
          </div>

          <div className="about-photo-frame reveal-on-scroll">
            <Image
              src={OWN_PHOTO}
              alt="Susy, founder of Fruitful Pin"
              width={720}
              height={900}
              className="h-full w-full object-cover"
              sizes="(min-width: 1024px) 38vw, 92vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="section-swell bg-[var(--surface-soft)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start lg:py-20">
          <div>
            <p className="eyebrow">Who we work with</p>
            <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">
              Pinterest is strongest when your audience is already searching, saving, and deciding.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              The exact copy can be refined later. For now, this section keeps the page close to the current Fruitful Pin About structure while making fit easier to scan.
            </p>
          </div>

          <div className="about-fit-grid">
            <div className="about-fit-card reveal-on-scroll">
              <h3 className="text-xl font-semibold text-[var(--heading)]">You&apos;re in the right place if...</h3>
              <ul className="fit-list fit-list-good mt-5 space-y-3 text-sm leading-6 text-[var(--muted)]">
                {FIT_SIGNALS.good.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="about-fit-card reveal-on-scroll">
              <h3 className="text-xl font-semibold text-[var(--heading)]">We&apos;re probably not a fit yet if...</h3>
              <ul className="fit-list fit-list-not mt-5 space-y-3 text-sm leading-6 text-[var(--muted)]">
                {FIT_SIGNALS.notYet.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow">Values</p>
            <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">
              Marketing that feels aligned and built to last.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">These are the operating values behind the work, from strategy to communication.</p>
          </div>

          <div className="about-values-grid mt-9">
            {ABOUT_VALUES.map((value) => (
              <article key={value.title} className="about-value-card reveal-on-scroll">
                <span className="about-mini-icon">
                  <ValueIcon name={value.icon} />
                </span>
                <h3 className="text-xl font-semibold text-[var(--heading)]">{value.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-swell bg-[var(--surface-warm)]">
        <div className="about-story-grid mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="about-photo-frame about-photo-frame-small reveal-on-scroll">
            <Image
              src={HEADSHOT}
              alt="Susy Cid, Pinterest strategist"
              width={720}
              height={900}
              className="h-full w-full object-cover"
              sizes="(min-width: 1024px) 34vw, 92vw"
            />
          </div>

          <div>
            <p className="eyebrow">Hi, I&apos;m Susy</p>
            <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">
              Pinterest is my zone of genius.
            </h2>
            <div className="mt-6 space-y-4 text-base leading-7 text-[var(--muted)]">
              <p>I help specialty brands, food creators, and bloggers turn Pinterest into a channel that can keep working after the publish-day glow fades.</p>
              <p>Fruitful Pin comes from a simple belief: your best content deserves long-term visibility, not just a short burst of attention.</p>
              <p>And while I lead strategy, the work can be supported by a small network of designers, data analysts, and account specialists as the project needs it.</p>
            </div>

            <div className="fun-facts-card mt-8 reveal-on-scroll">
              <h3 className="text-xl font-semibold text-[var(--heading)]">Fun facts</h3>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-[var(--muted)]">
                {FUN_FACTS.map((fact) => (
                  <li key={fact.text} className="fun-fact-item">
                    <span>{fact.icon}</span>
                    <p>{fact.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="certification-band">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-16">
          <div className="certification-ribbon reveal-on-scroll">
            <div>
              <p className="eyebrow">Certified and tested</p>
              <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)]">Pinterest training, real client work, and proof from people who have worked with Susy.</h2>
            </div>
            <div className="certification-ribbon-row">
              <div className="flex flex-wrap justify-start gap-3 lg:justify-end">
                {CERTIFICATION_BADGES.map((badge, index) => (
                  <span key={badge.label} className="certification-badge">
                    <span className="certification-provider">Pinterest</span>
                    <span className="certification-mark" aria-hidden="true">P</span>
                    <span className="certification-title">{index === 0 ? "Certified Media Buyer" : "Certified Media Planner"}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="nice-words-band">
        <div className="mx-auto max-w-6xl px-5 pb-28 pt-20 sm:px-8 lg:pb-32 lg:pt-24">
          <div className="nice-words-header">
            <p className="eyebrow">Kind words</p>
            <h2 className="brand-display mt-3 text-3xl leading-tight sm:text-5xl">
              People say Susy makes Pinterest feel clearer, kinder, and a lot less mysterious.
            </h2>
            <AccentCurve className="accent-curve-center accent-curve-light mt-5" />
          </div>
          <div className="nice-words-grid mt-10">
            {NICE_WORDS.map((item) => (
              <article key={item.name} className="nice-word-card zoom-on-scroll">
                <p className="nice-word-stars" aria-hidden="true">★★★★★</p>
                <p className="mt-4 text-lg leading-8">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-6">
                  <p className="font-semibold">{item.name}</p>
                  <p className="mt-1 text-sm opacity-80">{item.role}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] opacity-75">{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-final-cta bg-white px-5 pb-16 sm:px-8 lg:pb-20">
        <div className="cta-wave mx-auto max-w-6xl">
          <h2 className="brand-display mt-5 max-w-3xl text-3xl leading-tight text-[var(--heading)] sm:text-5xl">Not sure where to start?</h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)]">
            Start with a fit call and we&apos;ll map what Pinterest could look like for your brand.
          </p>
          <Link className="button-primary mt-7 inline-flex min-h-12 items-center justify-center rounded-md px-6 text-sm font-semibold" href={BOOKING_URL}>
            {FIT_CALL_LABEL}
          </Link>
        </div>
      </section>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { CursorGlowPanel } from "@/components/CursorGlowPanel";
import { BRAND_ASSETS } from "@/lib/brandAssets";
import { FIT_SIGNALS, NICE_WORDS } from "@/lib/content";
import { BOOKING_URL, FIT_CALL_LABEL, PINTEREST_FIT_CHECK_URL } from "@/lib/site";

export const metadata = {
  title: "About",
  description:
    "Meet Susy Cid, the Pinterest strategist behind Fruitful Pin, and learn how product brands can reach more qualified buyers through Pinterest.",
};

type ValueIconName = "strategy" | "data" | "global" | "communication" | "creative" | "learning";

const ABOUT_VALUES = [
  {
    icon: "strategy",
    title: "Strategy over noise",
    description: "We do not chase every trend or post just to stay busy. Pinterest works better when every move has a reason behind it.",
  },
  {
    icon: "data",
    title: "Context before conclusions",
    description: "A click, save, or conversion number does not mean much on its own. We look at the bigger picture before deciding what to change.",
  },
  {
    icon: "creative",
    title: "Creative with a job",
    description: "Beautiful pins help, but the creative also needs to explain, invite, teach, compare, or make someone want to come back.",
  },
  {
    icon: "communication",
    title: "Clear human communication",
    description: "You should understand what we are doing, what we are learning, and why it matters for your business.",
  },
  {
    icon: "global",
    title: "A multicultural lens",
    description: "Fruitful Pin brings a global perspective to how people search, choose, shop, learn, and respond to content across markets.",
  },
  {
    icon: "learning",
    title: "Built to keep learning",
    description: "Pinterest is not set-it-and-forget-it. We keep watching what people respond to so the strategy gets sharper over time.",
  },
] satisfies Array<{ icon: ValueIconName; title: string; description: string }>;

const PROOF_CARDS = [
  {
    title: "Pinterest certified",
    body: "Certified through Pinterest training in media buying, planning, and platform strategy.",
  },
  {
    title: "Specialized in Pinterest",
    body: "Fruitful Pin is built around Pinterest strategy, not generic social media management.",
  },
  {
    title: "Across product categories",
    body: "Experience across food, home, baby, wellness, education, travel, and specialty product brands.",
  },
  {
    title: "Organic and paid perspective",
    body: "Strategy can include organic Pinterest, Pinterest ads, creative testing, reporting, and the path after the click.",
  },
] as const;

const FUN_FACTS = [
  { icon: "ES", text: "Bilingual brain, multicultural lens." },
  { icon: "MTL", text: "Born in Mexico, based in Montreal." },
  { icon: "ART", text: "Watercolor artist in progress." },
  { icon: "WHY", text: "Always curious, always observing." },
  { icon: "PIN", text: "Pinterest fits how I think: strategy over noise, long-term over quick wins." },
] as const;

const featuredNiceWords = NICE_WORDS.slice(0, 4);

const OWN_PHOTO = BRAND_ASSETS.founderManager;
const HEADSHOT = BRAND_ASSETS.founderExpert;

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
    case "learning":
      return (
        <svg {...iconProps}>
          <path d="M13 20c8-5 18-5 28 0 4 2 7 2 10 0v26c-3 2-7 2-10 0-10-5-20-5-28 0Z" />
          <path d="M32 19v27" />
          <path d="M19 29c4-1 8-1 12 1" />
          <path d="M37 30c3-2 7-2 11-1" />
          <path d="M19 37c4-1 8-1 12 1" />
          <path d="M37 38c3-2 7-2 11-1" />
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
          <h1 className="brand-display mt-5 headline-hero text-[var(--heading)]">
            I help product brands use Pinterest to reach more of the <span className="text-gradient">right buyers.</span>
          </h1>
          <AccentCurve className="accent-curve-center mt-5" />
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Fruitful Pin is led by Susy Cid, a Pinterest strategist who looks at the whole marketing system: your product, website, content, email list, customer journey, and sales goals. Pinterest is the channel I know deeply. The real work is making it connect to the rest of the business so more qualified buyers can discover, understand, and choose your product.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link className="button-primary inline-flex min-h-12 items-center justify-center px-6" href={BOOKING_URL}>
              {FIT_CALL_LABEL}
            </Link>
            <Link className="button-outline" href="/pinterest-services">
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="about-story-grid mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div>
            <p className="eyebrow">The story</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              I thought I was managing Pinterest. I was really learning how people <span className="text-gradient">discover products.</span>
            </h2>
            <div className="mt-6 space-y-4 text-base leading-7 text-[var(--muted)]">
              <p>Fruitful Pin started as a hands-on experiment: managing Pinterest for a small bean-to-bar chocolate maker.</p>
              <p>
                That work taught me something I still believe: Pinterest only works when it connects to the bigger picture. What people are searching for. What they need to understand. Where they land. What helps them decide.
              </p>
              <p>
                Today, I help product brands tap into Pinterest as another discovery channel, not another random marketing task. The work brings together strategy, creative direction, content, analytics, and customer psychology so more of the right people can find your product before they choose someone else.
              </p>
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
            <p className="eyebrow">Who this is for</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              For product brands with something people need to <span className="text-gradient">find, understand, and choose.</span>
            </h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-[var(--muted)]">
              <p>Pinterest is strongest when your product fits how people naturally search, compare, plan, save, or shop.</p>
              <p>
                That might mean home goods, baby products, specialty toys, premium food products, unique beauty products, wellness products, home improvement products, or another product people need a little context to understand and want.
              </p>
              <p>If your product is already selling, Pinterest may be the next channel that helps more qualified buyers discover it.</p>
            </div>
          </div>

          <div className="about-fit-grid">
            <div className="about-fit-card reveal-on-scroll">
              <h3 className="headline-compact text-[var(--heading)]">You may be in the right place if...</h3>
              <ul className="fit-list fit-list-good mt-5 space-y-3 text-sm leading-6 text-[var(--muted)]">
                {FIT_SIGNALS.good.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="about-fit-card reveal-on-scroll">
              <h3 className="headline-compact text-[var(--heading)]">Probably not a fit yet if...</h3>
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
            <p className="eyebrow">How we think</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              Thoughtful strategy, clear communication, and Pinterest that has a reason to exist.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              Fruitful Pin is built around the idea that marketing should feel useful, not noisy. The work is creative, but it is also grounded in what people are looking for, what your business needs, and what the numbers are trying to tell us.
            </p>
          </div>

          <div className="about-values-grid mt-9">
            {ABOUT_VALUES.map((value) => (
              <article key={value.title} className="about-value-card reveal-on-scroll">
                <span className="about-mini-icon">
                  <ValueIcon name={value.icon} />
                </span>
                <h3 className="headline-compact text-[var(--heading)]">{value.title}</h3>
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
            <p className="eyebrow">Meet the strategist</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              Pinterest is my zone of genius, but the real work is understanding <span className="text-gradient">how people choose.</span>
            </h2>
            <div className="mt-6 space-y-4 text-base leading-7 text-[var(--muted)]">
              <p>I help product brands tap into a new pool of qualified buyers by making Pinterest work with the rest of the business, not off in a corner by itself.</p>
              <p>
                My work sits at the intersection of Pinterest strategy, creative direction, customer psychology, content, analytics, and the practical question every founder cares about: how do more of the right people find us, understand us, trust us, and buy?
              </p>
              <p>
                Fruitful Pin is led by me, with a small network of designers, data support, and specialists brought in when the project needs it. You get strategic direction without the bloated agency feeling.
              </p>
            </div>

            <div className="fun-facts-card mt-8 reveal-on-scroll">
              <h3 className="headline-compact text-[var(--heading)]">Personal notes</h3>
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
              <p className="eyebrow">Proof behind the work</p>
              <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">Certified, tested, and shaped by real client strategy.</h2>
              <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                Pinterest training matters, but the real proof is in the client work: product launches, seasonal campaigns, account rebuilds, ad testing, and the messy middle where strategy has to meet real business goals.
              </p>
            </div>
            <div className="certification-ribbon-row">
              <Image
                src={BRAND_ASSETS.pinterestCertifications}
                alt="Pinterest Certified Media Buyer and Pinterest Certified Media Planner badges"
                width={760}
                height={430}
                className="certification-image"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PROOF_CARDS.map((card) => (
              <article key={card.title} className="about-value-card reveal-on-scroll">
                <h3 className="headline-compact text-[var(--heading)]">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{card.body}</p>
              </article>
            ))}
          </div>

          <div
            className="about-credibility-strip mt-8"
            aria-label="Pinterest strategy across food, home, baby, wellness, education, travel, and specialty product brands."
          >
            <div className="about-credibility-track" aria-hidden="true">
              {Array.from({ length: 4 }).map((_, index) => (
                <span key={index} className="about-credibility-pill">
                  Pinterest strategy across food, home, baby, wellness, education, travel, and specialty product brands.
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="nice-words-band">
        <div className="mx-auto max-w-6xl px-5 pb-28 pt-20 sm:px-8 lg:pb-32 lg:pt-24">
          <div className="nice-words-header">
            <p className="eyebrow">Kind words</p>
            <h2 className="brand-display mt-3 headline-section">
              People say Susy makes Pinterest feel clearer, calmer, and more useful.
            </h2>
            <AccentCurve className="accent-curve-center accent-curve-light mt-5" />
            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 opacity-85">
              The goal is not to make Pinterest feel like one more confusing marketing channel. It is to make the strategy easier to understand, easier to act on, and more connected to what your business actually needs.
            </p>
          </div>
          <div className="nice-words-grid mt-10">
            {featuredNiceWords.map((item) => (
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
        <CursorGlowPanel className="cta-wave about-final-cta-panel mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="eyebrow">Start here</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              Not sure <span className="text-gradient">where Pinterest fits</span>? That is exactly where we start.
            </h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-[var(--muted)]">
              <p>Book a Pinterest Fit Call and we&apos;ll look at your product, your current traffic, your website, your goals, and whether Pinterest is a real opportunity right now.</p>
              <p>
                You do not need to know whether you need organic, ads, cleanup, content support, The Fruitful Path, or a bigger build yet. We start with fit first.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="path-card reveal-on-scroll">
              <h3 className="headline-card text-[var(--heading)]">Ready for a conversation?</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Book a Pinterest Fit Call and we&apos;ll look at whether Pinterest makes sense for your product, your audience, and what you want to grow.
              </p>
              <Link className="button-primary mt-6 inline-flex min-h-12 items-center justify-center px-6" href={BOOKING_URL}>
                {FIT_CALL_LABEL}
              </Link>
            </article>
            <article className="path-card reveal-on-scroll">
              <h3 className="headline-card text-[var(--heading)]">Still figuring it out?</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Take the Pinterest Fit Check and get a quick direction based on your offer, content, website, and goals.
              </p>
              <Link className="button-outline mt-6" href={PINTEREST_FIT_CHECK_URL}>
                Start the Fit Check
              </Link>
            </article>
          </div>
        </CursorGlowPanel>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GlitterField } from "@/components/GlitterField";
import { PodcastPlayer } from "@/components/PodcastPlayer";
import { TrackedLink } from "@/components/TrackedLink";

export const metadata: Metadata = {
  title: "Flower Meanings, Folklore & the Flower Message Quiz",
  description:
    "Step into Bloom Whispers for flower meanings, folklore, the Bloom Journal, the flower-message quiz, podcast conversations, and the coming-soon Bloom Shop.",
};

const discoveryCards = [
  {
    title: "Flower Meanings",
    body: "Symbolism, messages, and the secret language of flowers.",
    art: "/assets/flower-white-bloom.png",
    artClassName: "discovery-art--flower",
    isDark: false,
  },
  {
    title: "Stories & Folklore",
    body: "Cultural flower stories, strange histories, and botanical beauty.",
    art: "/assets/stories-folklore-card.png",
    artClassName: "discovery-art--stories",
    isDark: false,
  },
  {
    title: "Rituals & Everyday Magic",
    body: "Small ways to bring flower meaning into daily life.",
    art: "/assets/rituals-magic-card.png",
    artClassName: "discovery-art--rituals",
    isDark: false,
  },
  {
    title: "Unique Floral Finds",
    body: "Curious flower things, places, products, books, gardens, and beautiful discoveries.",
    art: "/assets/unique-floral-finds-card.png",
    artClassName: "discovery-art--finds",
    isDark: true,
  },
] as const;

const quizNotes = [
  {
    title: "A flower chosen by mood",
    body: "Answer a few intuitive questions about what you're carrying, craving, or protecting.",
    icon: "/assets/quiz-icon-flower.png",
  },
  {
    title: "A meaning worth saving",
    body: "Receive one flower message with symbolism, reflection, and a tiny ritual.",
    icon: "/assets/quiz-icon-book.png",
  },
  {
    title: "A doorway into the garden",
    body: "Continue into related flower stories, meanings, and Bloom Letter notes.",
    icon: "/assets/quiz-icon-arch.png.png",
  },
] as const;

const journalGatewayCards = [
  {
    title: "The Story of Hibiscus",
    label: "Flower Story",
    body: "Discover the rich history, meaning, and symbolism behind one of the world's most captivating blooms.",
    action: "Read the Story",
    href: "/hibiscus-flower-meaning",
    image: "/assets/journal-hibiscus-card.png",
    icon: "flower",
    variant: "cream",
  },
  {
    title: "Flower Therapy & the Healing Power of Flowers",
    label: "Podcast Conversation",
    body: "Join beautiful conversations on how flowers nourish our minds, hearts, and everyday lives.",
    action: "Listen In",
    href: "/podcast#episode-5",
    image: "/assets/journal-podcast-card.png",
    icon: "microphone",
    variant: "dark",
  },
  {
    title: "Guide to Flower Meanings & Occasions",
    label: "Practical Guide",
    body: "Your go-to guide for choosing the perfect flowers for every moment that matters.",
    action: "Explore the Guide",
    href: "/flower-meaning-guide",
    image: "/assets/journal-guide-card.png",
    icon: "book",
    variant: "cream",
  },
] as const;

const bloomLetterBenefits = [
  {
    title: "Meaningful Stories",
    body: "Timeless tales and folklore from around the world.",
    icon: "book",
  },
  {
    title: "Floral Wisdom",
    body: "Discover meanings, symbols, and hidden language of flowers.",
    icon: "flower",
  },
  {
    title: "Gentle Rituals",
    body: "Simple ways to bring beauty, stillness, and intention into your day.",
    icon: "ritual",
  },
  {
    title: "Garden Finds",
    body: "Curated floral favorites and thoughtful recommendations.",
    icon: "gift",
  },
] as const;

const shopCards = [
  {
    title: "Seeds & Growing Kits",
    body: "Plant joy and watch it bloom. Kits for every space and season.",
    image: "/assets/shop-seeds-growing-kits.png",
    icon: "sprout",
  },
  {
    title: "Jewelry",
    body: "Wearable reminders of nature's quiet magic and meaning.",
    image: "/assets/shop-jewelry.png",
    icon: "sparkle",
  },
  {
    title: "Printables",
    body: "Art, affirmations, and seasonal prints to inspire your everyday.",
    image: "/assets/shop-printables.png",
    icon: "print",
  },
  {
    title: "Home Decor",
    body: "Thoughtful pieces to create a home that feels like you.",
    image: "/assets/shop-home-decor.png",
    icon: "home",
  },
] as const;

function JournalGatewayIcon({ type }: { type: (typeof journalGatewayCards)[number]["icon"] }) {
  if (type === "microphone") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M16 4.8a4.3 4.3 0 0 0-4.3 4.3v6.7a4.3 4.3 0 1 0 8.6 0V9.1A4.3 4.3 0 0 0 16 4.8Z" />
        <path d="M8.5 14.7v1.1a7.5 7.5 0 0 0 15 0v-1.1" />
        <path d="M16 23.4v3.8" />
        <path d="M11.8 27.2h8.4" />
      </svg>
    );
  }

  if (type === "book") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M5.4 7.1h7.2c1.9 0 3.4 1.5 3.4 3.4v14.2c0-1.8-1.5-3.2-3.4-3.2H5.4V7.1Z" />
        <path d="M26.6 7.1h-7.2c-1.9 0-3.4 1.5-3.4 3.4v14.2c0-1.8 1.5-3.2 3.4-3.2h7.2V7.1Z" />
        <path d="M9.2 11.2h3.1" />
        <path d="M19.7 11.2h3.1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M16 17.3c3.9-4.3 3.8-8.3 0-12.4c-3.8 4.1-3.9 8.1 0 12.4Z" />
      <path d="M15.3 17.1C9.9 15.4 6.4 17.3 4.6 22.6c5.3 1.2 8.8-.7 10.7-5.5Z" />
      <path d="M16.7 17.1c5.4-1.7 8.9.2 10.7 5.5c-5.3 1.2-8.8-.7-10.7-5.5Z" />
      <path d="M16 17.2v8.4" />
    </svg>
  );
}

function BloomLetterBenefitIcon({ type }: { type: (typeof bloomLetterBenefits)[number]["icon"] }) {
  if (type === "flower") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M16 15.8c2.7-2.8 2.7-7.2 0-10-2.7 2.8-2.7 7.2 0 10Z" />
        <path d="M16 15.8c-3.8-.8-7.5 1.6-8.4 5.4 3.8.8 7.5-1.6 8.4-5.4Z" />
        <path d="M16 15.8c3.8-.8 7.5 1.6 8.4 5.4-3.8.8-7.5-1.6-8.4-5.4Z" />
        <path d="M16 15.8v11.4" />
        <path d="M11.7 27.2h8.6" />
      </svg>
    );
  }

  if (type === "ritual") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M9.2 14.2h13.6l-1.2 10.5H10.4L9.2 14.2Z" />
        <path d="M12.1 14.2c0-2.2 1.7-3.9 3.9-3.9s3.9 1.7 3.9 3.9" />
        <path d="M16 5.1c1.3 1.4 1.3 3.3 0 4.7-1.3-1.4-1.3-3.3 0-4.7Z" />
        <path d="M12.4 19h7.2" />
      </svg>
    );
  }

  if (type === "gift") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M7 13.2h18v13H7v-13Z" />
        <path d="M5.7 9.2h20.6v4H5.7v-4Z" />
        <path d="M16 9.2v17" />
        <path d="M16 9.2c-2.5 0-4.5-1-4.5-2.4 0-1 .8-1.9 1.9-1.9 1.7 0 2.6 2.1 2.6 4.3Z" />
        <path d="M16 9.2c2.5 0 4.5-1 4.5-2.4 0-1-.8-1.9-1.9-1.9-1.7 0-2.6 2.1-2.6 4.3Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M5.4 7.1h7.2c1.9 0 3.4 1.5 3.4 3.4v14.2c0-1.8-1.5-3.2-3.4-3.2H5.4V7.1Z" />
      <path d="M26.6 7.1h-7.2c-1.9 0-3.4 1.5-3.4 3.4v14.2c0-1.8 1.5-3.2 3.4-3.2h7.2V7.1Z" />
      <path d="M9.2 11.2h3.1" />
      <path d="M19.7 11.2h3.1" />
    </svg>
  );
}

function ShopCategoryIcon({ type }: { type: (typeof shopCards)[number]["icon"] }) {
  if (type === "sparkle") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M16 4.6l2.1 7.2l7.3 2.2l-7.3 2.1L16 23.4l-2.1-7.3L6.6 14l7.3-2.2L16 4.6Z" />
        <path d="M24.6 20.2l.9 3l3 .9l-3 .9l-.9 3l-.9-3l-3-.9l3-.9l.9-3Z" />
      </svg>
    );
  }

  if (type === "print") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M8 4.8h12.4L24 8.4v18.8H8V4.8Z" />
        <path d="M20.4 4.8v3.6H24" />
        <path d="M11.6 13.1h8.8" />
        <path d="M11.6 17h8.8" />
        <path d="M11.6 20.9h5.2" />
      </svg>
    );
  }

  if (type === "home") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M5.8 14.6L16 6.2l10.2 8.4" />
        <path d="M8.2 13.2v13h15.6v-13" />
        <path d="M13 26.2v-7.1h6v7.1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M16 16.8c3.4-3.6 3.4-8.5 0-12c-3.4 3.5-3.4 8.4 0 12Z" />
      <path d="M15.6 17.1c-4.9-1.1-8.8 1.4-10.4 6.1c4.9.9 8.7-1.5 10.4-6.1Z" />
      <path d="M16.4 17.1c4.9-1.1 8.8 1.4 10.4 6.1c-4.9.9-8.7-1.5-10.4-6.1Z" />
      <path d="M16 16.8v9.7" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-stage">
          <Image
            className="hero-background-image"
            src="/assets/hero-midnight-garden.png"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1480px"
          />
          <div className="hero-starfield" aria-hidden="true">
            <span className="star star--1 star--twinkle-a" />
            <span className="star star--2 star--twinkle-b" />
            <span className="star star--3 star--twinkle-c" />
            <span className="star star--4 star--twinkle-a" />
            <span className="star star--5 star--twinkle-b" />
            <span className="star star--6 star--twinkle-c" />
            <span className="star star--7 star--twinkle-a" />
            <span className="star star--8 star--twinkle-b" />
            <span className="star star--9 star--twinkle-c" />
          </div>
          <GlitterField className="site-glitter--hero" />
          <div className="hero-copy">
            <h1>Where every flower tells a story</h1>
            <p className="hero-lede">
              Discover flower meanings, symbolism, folklore, and beautiful ways flowers fit into everyday life.
            </p>
            <div className="action-row centered" aria-label="Primary actions">
              <Link className="button primary glow-button" href="/flower-message-quiz">
                Take the Flower Quiz
              </Link>
              <Link className="button ghost audio-button" href="/podcast">
                <span className="audio-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M4.75 12.5v-1a7.25 7.25 0 0 1 14.5 0v1" />
                    <path d="M7.5 11.75h-.75A1.75 1.75 0 0 0 5 13.5v2.25a1.75 1.75 0 0 0 1.75 1.75h.75v-5.75Z" />
                    <path d="M16.5 11.75h.75A1.75 1.75 0 0 1 19 13.5v2.25a1.75 1.75 0 0 1-1.75 1.75h-.75v-5.75Z" />
                  </svg>
                </span>
                Listen to the Podcast
              </Link>
            </div>
            <p className="cta-note">Discover the insights the flowers have for you today.</p>
          </div>
        </div>
      </section>

      <section className="discovery-section" id="discover">
        <div className="discovery-inner">
          <div className="discovery-intro">
            <div>
              <p className="eyebrow">What you&apos;ll find here</p>
              <h2 aria-label="A flower world for the curious">
                <span aria-hidden="true">A flower world</span>
                <span aria-hidden="true">for the curious</span>
              </h2>
            </div>
            <div className="discovery-divider" aria-hidden="true">
              <span />
            </div>
            <div className="discovery-intro-copy">
              <p>
                From flower meanings and folklore to gentle rituals, gifting ideas, and unique floral finds, Bloom
                Whispers is where flowers become more meaningful, useful, and alive.
              </p>
              <Image
                className="discovery-branch discovery-branch--top"
                src="/assets/gold-branch.png"
                alt=""
                width={280}
                height={350}
                sizes="(max-width: 900px) 120px, 180px"
              />
            </div>
          </div>

          <div className="discovery-composition">
            {discoveryCards.map((card, index) => (
              <article
                className={`discovery-panel${card.isDark ? " discovery-panel--dark" : ""}`}
                key={card.title}
              >
                <div className="panel-content">
                  <div className="panel-marker" aria-hidden="true">
                    <span className="panel-number">0{index + 1}</span>
                    <span className="panel-flourish" />
                  </div>
                  <h3>{card.title}</h3>
                  <span className="panel-star" aria-hidden="true" />
                  <p>{card.body}</p>
                </div>
                <div className={`discovery-art ${card.artClassName}`} aria-hidden="true">
                  <Image src={card.art} alt="" fill sizes="(max-width: 900px) 82vw, 25vw" />
                </div>
              </article>
            ))}
          </div>

          <div className="discovery-ribbon" aria-label="Bloom Whispers guiding ideas">
            <Image
              className="ribbon-branch ribbon-branch--left"
              src="/assets/gold-branch.png"
              alt=""
              width={150}
              height={188}
              sizes="96px"
            />
            <span>Rooted in nature</span>
            <span aria-hidden="true">✦</span>
            <span>Guided by story</span>
            <span aria-hidden="true">✦</span>
            <span>Inspired by beauty</span>
            <span aria-hidden="true">✦</span>
            <Image
              className="ribbon-branch ribbon-branch--right"
              src="/assets/gold-branch.png"
              alt=""
              width={130}
              height={163}
              sizes="86px"
            />
          </div>
        </div>
      </section>

      <section className="quiz-reading-section" id="quiz">
        <Image
          className="quiz-background-image"
          src="/assets/quiz-midnight-garden-bg.png"
          alt=""
          fill
          sizes="100vw"
        />
        <div className="quiz-starfield" aria-hidden="true">
          <span className="quiz-star quiz-star--1 star--twinkle-a" />
          <span className="quiz-star quiz-star--2 star--twinkle-b" />
          <span className="quiz-star quiz-star--3 star--twinkle-c" />
          <span className="quiz-star quiz-star--4 star--twinkle-a" />
          <span className="quiz-star quiz-star--5 star--twinkle-b" />
          <span className="quiz-star quiz-star--6 star--twinkle-c" />
          <span className="quiz-star quiz-star--7 star--twinkle-a" />
          <span className="quiz-star quiz-star--8 star--twinkle-b" />
        </div>
        <GlitterField className="site-glitter--section" />
        <div className="quiz-reading-inner">
          <div className="quiz-copy">
            <p className="eyebrow light">Begin your flower message</p>
            <h2>What flower message do you need right now?</h2>
            <p>
              Take a short flower quiz and receive a meaningful flower, reflection, and tiny ritual for the season
              you&apos;re in.
            </p>
            <div className="quiz-actions">
              <Link className="button primary glow-button" href="/flower-message-quiz">
                Take the Flower Quiz
              </Link>
              <p className="quiz-cta-note">Discover the flower insight waiting for you today.</p>
            </div>
          </div>

          <div className="quiz-portal" aria-label="Flower message card preview">
            <div className="quiz-message-card">
              <Image
                className="quiz-message-card-image"
                src="/assets/quiz-message-card.png"
                alt=""
                fill
                sizes="(max-width: 900px) 72vw, 360px"
              />
              <div className="quiz-card-copy">
                <h3>The garden has a message for you.</h3>
                <span aria-hidden="true" />
                <p>Your flower is waiting.</p>
              </div>
            </div>
            <Image
              className="quiz-candle-accent"
              src="/assets/quiz-candle-accent.png"
              alt=""
              width={260}
              height={325}
              sizes="(max-width: 900px) 110px, 150px"
            />
          </div>

          <div className="quiz-notes" aria-label="Flower quiz notes">
            {quizNotes.map((note) => (
              <article className="quiz-note" key={note.title}>
                <div className="quiz-note-icon" aria-hidden="true">
                  <Image src={note.icon} alt="" width={112} height={140} sizes="74px" />
                </div>
                <div>
                  <h3>{note.title}</h3>
                  <p>{note.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="journal-gateway-section" id="flower-meanings">
        <div className="journal-gateway-stars" aria-hidden="true">
          <span className="journal-star journal-star--1 star--twinkle-a" />
          <span className="journal-star journal-star--2 star--twinkle-b" />
          <span className="journal-star journal-star--3 star--twinkle-c" />
          <span className="journal-star journal-star--4 star--twinkle-a" />
          <span className="journal-star journal-star--5 star--twinkle-b" />
          <span className="journal-star journal-star--6 star--twinkle-c" />
          <span className="journal-star journal-star--7 star--twinkle-a" />
          <span className="journal-star journal-star--8 star--twinkle-b" />
          <span className="journal-star journal-star--9 star--twinkle-c" />
          <span className="journal-star journal-star--10 star--twinkle-a" />
        </div>

        <Image
          className="journal-floral-edge journal-floral-edge--left"
          src="/assets/journal-left-floral-edge.png"
          alt=""
          width={1755}
          height={2194}
          sizes="(max-width: 900px) 46vw, 31vw"
        />
        <Image
          className="journal-floral-edge journal-floral-edge--right"
          src="/assets/journal-right-floral-edge.png"
          alt=""
          width={1755}
          height={2194}
          sizes="(max-width: 900px) 46vw, 31vw"
        />

        <div className="journal-gateway-inner" id="journal">
          <div className="journal-gateway-header">
            <p className="eyebrow">
              <span aria-hidden="true">✦</span>
              From the Bloom Journal
              <span aria-hidden="true">✦</span>
            </p>
            <h2>Begin with a Bloom Whispers Story</h2>
            <p>
              Explore flower meanings, cultural stories, practical floral ideas, and podcast conversations already
              growing in the garden.
            </p>
          </div>

          <div className="journal-gateway-cards" aria-label="Bloom Whispers story previews">
            {journalGatewayCards.map((card) => (
              <article className={`journal-gateway-card journal-gateway-card--${card.variant}`} key={card.title}>
                <div className="journal-gateway-media">
                  <Image src={card.image} alt="" fill sizes="(max-width: 900px) 92vw, 28vw" />
                  <div className="journal-gateway-icon">
                    <JournalGatewayIcon type={card.icon} />
                  </div>
                </div>
                <div className="journal-gateway-card-copy">
                  <h3>{card.title}</h3>
                  <p className="journal-gateway-label">
                    {card.label}
                    <span aria-hidden="true">✦</span>
                  </p>
                  <p>{card.body}</p>
                  <Link className="journal-gateway-link" href={card.href}>
                    {card.action}
                    <span aria-hidden="true">-&gt;</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="journal-gateway-footer">
            <Image
              className="journal-footer-branch journal-footer-branch--left"
              src="/assets/gold-branch.png"
              alt=""
              width={210}
              height={263}
              sizes="120px"
            />
            <Link className="journal-gateway-cta" href="/journal">
              Read the Journal
              <span aria-hidden="true">✦</span>
            </Link>
            <p className="journal-gateway-note">More stories, rituals, and flower wisdom are always blooming.</p>
            <Image
              className="journal-footer-branch journal-footer-branch--right"
              src="/assets/gold-branch.png"
              alt=""
              width={210}
              height={263}
              sizes="120px"
            />
          </div>
        </div>
      </section>

      <section className="bloom-letter-section" id="bloom-letter">
        <Image
          className="letter-panel-background"
          src="/assets/bloom-letter-section-bg.png?v=20260525"
          alt=""
          fill
          sizes="100vw"
        />
        <div className="bloom-letter-stars" aria-hidden="true">
          <span className="letter-star letter-star--1 star--twinkle-a" />
          <span className="letter-star letter-star--2 star--twinkle-b" />
          <span className="letter-star letter-star--3 star--twinkle-c" />
          <span className="letter-star letter-star--4 star--twinkle-a" />
          <span className="letter-star letter-star--5 star--twinkle-b" />
          <span className="letter-star letter-star--6 star--twinkle-c" />
        </div>

        <div className="letter-note-panel">
          <div className="letter-copy">
            <p className="eyebrow">
              <span aria-hidden="true">✦</span>
              The Bloom Letter
            </p>
            <h2>A little flower wisdom in your inbox</h2>
            <p>
              Receive flower meanings, curious stories, gentle rituals, and unique floral finds from the Bloom Whispers
              garden.
            </p>
            <form className="signup-form" aria-label="Bloom Letter signup prototype">
              <label htmlFor="bloom-email">Email address</label>
              <div>
                <input id="bloom-email" type="email" placeholder="Your email address" />
                <button type="button">Join the Bloom Letter</button>
              </div>
              <p>Occasional notes from the garden. Unsubscribe anytime.</p>
            </form>
          </div>

          <div className="letter-benefit-rail" aria-label="Bloom Letter themes">
            {bloomLetterBenefits.map((benefit) => (
              <article className="letter-benefit" key={benefit.title}>
                <div className="letter-benefit-icon">
                  <BloomLetterBenefitIcon type={benefit.icon} />
                </div>
                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="podcast-section" id="podcast">
        <Image
          className="podcast-background-image"
          src="/assets/podcast-section-bg.png"
          alt=""
          fill
          sizes="100vw"
        />
        <div className="podcast-starfield" aria-hidden="true">
          <span className="podcast-star podcast-star--1 star--twinkle-a" />
          <span className="podcast-star podcast-star--2 star--twinkle-b" />
          <span className="podcast-star podcast-star--3 star--twinkle-c" />
          <span className="podcast-star podcast-star--4 star--twinkle-a" />
          <span className="podcast-star podcast-star--5 star--twinkle-b" />
          <span className="podcast-star podcast-star--6 star--twinkle-c" />
          <span className="podcast-star podcast-star--7 star--twinkle-a" />
          <span className="podcast-shooting-sparkle podcast-shooting-sparkle--1" />
          <span className="podcast-shooting-sparkle podcast-shooting-sparkle--2" />
          <span className="podcast-shooting-sparkle podcast-shooting-sparkle--3" />
        </div>
        <GlitterField className="site-glitter--section" />

        <div className="podcast-shell">
          <PodcastPlayer />
        </div>
      </section>

      <section className="shop-teaser-section" id="shop-waitlist">
        <Image
          className="shop-floral-frame shop-floral-frame--left"
          src="/assets/shop-floral-left-frame.png"
          alt=""
          width={1755}
          height={2194}
          sizes="(max-width: 900px) 220px, 440px"
        />
        <Image
          className="shop-floral-frame shop-floral-frame--right"
          src="/assets/shop-floral-right-frame.png"
          alt=""
          width={1755}
          height={2194}
          sizes="(max-width: 900px) 220px, 440px"
        />
        <div className="shop-sparkles" aria-hidden="true">
          <span className="shop-sparkle shop-sparkle--1" />
          <span className="shop-sparkle shop-sparkle--2" />
          <span className="shop-sparkle shop-sparkle--3" />
          <span className="shop-sparkle shop-sparkle--4" />
          <span className="shop-sparkle shop-sparkle--5" />
          <span className="shop-sparkle shop-sparkle--6" />
          <span className="shop-sparkle shop-sparkle--7" />
          <span className="shop-sparkle shop-sparkle--8" />
        </div>
        <GlitterField className="site-glitter--section" />

        <div className="shop-inner">
          <div className="shop-copy">
            <p className="eyebrow">
              <span aria-hidden="true">✦</span>
              The Bloom Shop
              <span aria-hidden="true">✦</span>
            </p>
            <h2>
              Something beautiful
              <span>is growing</span>
            </h2>
            <p>
              The Bloom Whispers Shop is coming soon, curated treasures for flower lovers, daydreamers, and garden
              souls. Thoughtful pieces inspired by nature, made to bring more beauty into your everyday.
            </p>
            <div className="shop-actions" aria-label="Shop actions">
              <TrackedLink
                className="shop-button shop-button--primary"
                href="/shop"
                eventName="shop_waitlist_click"
                eventProperties={{ source: "homepage_shop_teaser" }}
              >
                Join the Waitlist
                <span aria-hidden="true">✦</span>
              </TrackedLink>
              <TrackedLink
                className="shop-button shop-button--secondary"
                href="/shop"
                eventName="shop_see_whats_coming_click"
                eventProperties={{ source: "homepage_shop_teaser" }}
              >
                See What&apos;s Coming
                <span aria-hidden="true">→</span>
              </TrackedLink>
            </div>
          </div>

          <div className="shop-world-grid" id="shop-categories" aria-label="Bloom shop coming soon categories">
            {shopCards.map((card) => (
              <article className="shop-world-card" key={card.title}>
                <div className="shop-card-image">
                  <Image src={card.image} alt="" fill sizes="(max-width: 900px) 86vw, 330px" />
                </div>
                <div className="shop-card-icon">
                  <ShopCategoryIcon type={card.icon} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <TrackedLink
                  className="shop-card-link"
                  href="/shop"
                  data-shop-category={card.title}
                  eventName="shop_category_interest_click"
                  eventProperties={{ category: card.title, source: "homepage_shop_card" }}
                >
                  Explore
                  <span aria-hidden="true">→</span>
                </TrackedLink>
              </article>
            ))}
          </div>

          <div className="shop-waitlist-ribbon">
            <Image
              className="shop-ribbon-floral shop-ribbon-floral--left"
              src="/assets/shop-ribbon-floral-accent.png.png"
              alt=""
              width={1755}
              height={2194}
              sizes="230px"
            />
            <div className="shop-ribbon-title">
              <span className="shop-ribbon-icon" aria-hidden="true">
                <ShopCategoryIcon type="sprout" />
              </span>
              <p>The shop is in progress</p>
            </div>
            <p className="shop-ribbon-copy">New arrivals and updates, delivered to your inbox first.</p>
            <form className="shop-waitlist-form" aria-label="Bloom shop waitlist prototype">
              <label htmlFor="shop-email">Email address</label>
              <input id="shop-email" type="email" placeholder="Your email address" />
              <button type="button">Join the Waitlist</button>
            </form>
            <Image
              className="shop-ribbon-floral shop-ribbon-floral--right"
              src="/assets/shop-ribbon-floral-accent1.png.png"
              alt=""
              width={1755}
              height={2194}
              sizes="230px"
            />
          </div>
        </div>
      </section>
    </>
  );
}

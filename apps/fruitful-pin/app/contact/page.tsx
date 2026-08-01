import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { ContactForm } from "@/components/ContactForm";
import { CursorGlowPanel } from "@/components/CursorGlowPanel";
import { BRAND_ASSETS } from "@/lib/brandAssets";
import {
  CALENDAR_EMBED_PATH,
  CALENDAR_URL,
  CONTACT_EMAIL,
  CONTACT_EMAIL_URL,
  FIT_CALL_LABEL,
  PINTEREST_FIT_CHECK_URL,
} from "@/lib/site";

const HEADSHOT = BRAND_ASSETS.founderStrategist;

const RIBBON_ITEMS = ["Find the next step", "Book a Fit Call", "Pinterest strategy", "Ask a question", "Start the Fit Check"] as const;

export const metadata = {
  title: "Contact",
  description: "Book a Fruitful Pin Fit Call to see whether Pinterest can help your product brand reach more qualified buyers, or send Susy a message.",
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      <Script src="https://asset-tidycal.b-cdn.net/js/embed.js" strategy="afterInteractive" />
      <section className="contact-flow">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:py-18">
          <div className="contact-flow-copy reveal-on-scroll">
            <p className="eyebrow">Fit Call</p>
            <h1 className="brand-display mt-4 max-w-4xl headline-hero text-[var(--heading)]">
              Let&apos;s find the Pinterest <span className="text-gradient">opportunity</span> your product brand may be missing.
            </h1>
            <div className="mt-6 max-w-2xl space-y-4 text-lg leading-8 text-[var(--muted)]">
              <p>Bring the questions, the half-formed ideas, or the quiet feeling that Pinterest could become more than another marketing task.</p>
              <p>This is where I look at your product, your website, your current traffic, and whether Pinterest is a real opportunity right now.</p>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a className="button-primary inline-flex min-h-12 items-center justify-center px-6" href="#book-fit-call">
                {FIT_CALL_LABEL}
              </a>
              <Link className="button-outline" href={PINTEREST_FIT_CHECK_URL}>
                Start the Fit Check
              </Link>
            </div>
          </div>

          <div className="contact-human-note reveal-on-scroll">
            <div className="contact-human-photo">
              <Image src={HEADSHOT} alt="Susy Cid, Pinterest strategist" width={240} height={240} className="h-full w-full object-cover" sizes="8rem" />
            </div>
            <div>
              <p className="eyebrow">Hi, I&apos;m Susy</p>
              <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                I&apos;ll help you look at Pinterest in the context of your product, website, email list, customer journey, and sales goals. If there is a fit, we will choose the cleanest next step together.
              </p>
              <p className="mt-3 text-sm font-bold text-[var(--brand-rust)]">No pressure to know the answer before the call.</p>
            </div>
          </div>

          <div className="contact-ribbon reveal-on-scroll" aria-hidden="true">
            <div className="contact-ribbon-track">
              {[...RIBBON_ITEMS, ...RIBBON_ITEMS, ...RIBBON_ITEMS].map((item, index) => (
                <span key={`${item}-${index}`}>{item}</span>
              ))}
            </div>
          </div>

          <div id="book-fit-call" className="contact-calendar-panel reveal-on-scroll">
            <div className="contact-calendar-copy">
              <p className="eyebrow">Book a Fit Call</p>
              <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">Start with a conversation, not a package.</h2>
              <div className="mt-5 space-y-4 text-base leading-7 text-[var(--muted)]">
                <p>The Fit Call is for figuring out whether Pinterest can help more qualified buyers discover your product and what the next right step should be.</p>
                <p>If there is a fit, the next step is The Fruitful Path: a focused, paid strategy step that maps the opportunity before we build.</p>
              </div>
            </div>
            <div className="contact-calendar-shell">
              <div className="tidycal-embed" data-path={CALENDAR_EMBED_PATH} />
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              If the calendar does not load in your browser,{" "}
              <a className="font-bold text-[var(--brand-pink)]" href={CALENDAR_URL}>
                open the booking page directly
              </a>
              .
            </p>
          </div>

          <div className="contact-message-panel reveal-on-scroll">
            <div className="contact-message-copy">
              <p className="eyebrow">Have a different question?</p>
              <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">Send a message.</h2>
              <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                For collaboration ideas, podcast invitations, speaking, partnerships, or general questions, use the form and I&apos;ll get back to you within 2 to 3 business days.
              </p>
              <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                If your question is about working together on Pinterest, the Fit Call is usually the best place to start.
              </p>
              <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                You can also reach me at{" "}
                <a className="font-bold text-[var(--brand-pink)]" href={CONTACT_EMAIL_URL}>
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
            <ContactForm />
          </div>

          <CursorGlowPanel className="contact-fit-check-card">
            <div>
              <p className="eyebrow">Not ready for a call?</p>
              <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
                Start with the Pinterest <span className="text-gradient">Fit Check.</span>
              </h2>
              <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                Answer seven quick questions about your product, content, website, and goals. You&apos;ll get an immediate direction, with the option to send your result to your inbox.
              </p>
            </div>
            <Link className="button-outline" href={PINTEREST_FIT_CHECK_URL}>
              Start the Fit Check
            </Link>
          </CursorGlowPanel>
        </div>
      </section>
    </div>
  );
}

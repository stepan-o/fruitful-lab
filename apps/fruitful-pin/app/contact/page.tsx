import Image from "next/image";
import Script from "next/script";
import { ContactForm } from "@/components/ContactForm";
import { CALENDAR_EMBED_PATH, CALENDAR_URL, CONTACT_EMAIL, CONTACT_EMAIL_URL } from "@/lib/site";

const HEADSHOT = "https://fruitfulpin.com/wp-content/uploads/2025/12/Cid-headshot.webp";

const RIBBON_ITEMS = ["Book a fit call", "Pinterest strategy", "Ask a question", "Find the next step"] as const;

export const metadata = {
  title: "Contact",
  description: "Book a Fruitful Pin fit call or send a message about Pinterest services, collaborations, speaking, or general questions.",
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      <Script src="https://asset-tidycal.b-cdn.net/js/embed.js" strategy="afterInteractive" />
      <section className="contact-flow">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:py-18">
          <div className="contact-flow-copy reveal-on-scroll">
            <p className="eyebrow">Contact</p>
            <h1 className="brand-display mt-4 max-w-4xl text-4xl leading-tight text-[var(--heading)] sm:text-5xl lg:text-6xl">
              Let&apos;s figure out what <span className="text-gradient italic">Pinterest could do</span> for your brand.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Bring the questions, the half-formed ideas, or the quiet feeling that Pinterest should be doing more. This is where we sort the next right move before anyone starts talking packages.
            </p>
          </div>

          <div className="contact-human-note reveal-on-scroll">
            <div className="contact-human-photo">
              <Image src={HEADSHOT} alt="Susy Cid, Pinterest strategist" width={240} height={240} className="h-full w-full object-cover" sizes="8rem" />
            </div>
            <div>
              <p className="eyebrow">Hi, I&apos;m Susy</p>
              <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                I&apos;ll help you look at Pinterest like a search path, not another content chore. If there is a fit, we will map the cleanest next step together.
              </p>
            </div>
          </div>

          <div className="contact-ribbon reveal-on-scroll" aria-hidden="true">
            <div className="contact-ribbon-track">
              {[...RIBBON_ITEMS, ...RIBBON_ITEMS, ...RIBBON_ITEMS].map((item, index) => (
                <span key={`${item}-${index}`}>{item}</span>
              ))}
            </div>
          </div>

          <div className="contact-calendar-panel reveal-on-scroll">
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
              <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">Send a message.</h2>
              <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                For collaboration ideas, podcast invitations, speaking, or general questions, use the form and I&apos;ll get back to you within 2-3 business days.
              </p>
              <p className="mt-5 text-base leading-7 text-[var(--muted)]">
                If forms aren&apos;t your thing, you can also reach me at{" "}
                <a className="font-bold text-[var(--brand-pink)]" href={CONTACT_EMAIL_URL}>
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}

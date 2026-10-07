import type { Metadata } from "next";
import { LETTERS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Letters",
  description: "Seasonal Bloom Whispers letters for reflection, noticing, and quieter creative living.",
};

export default function LettersPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Letters</p>
        <h1>Short notes for slower attention.</h1>
        <p>
          These first letters establish the Bloom Whispers editorial rhythm: intimate, seasonal, and grounded in small
          details.
        </p>
      </section>

      <section className="section-band">
        <div className="letter-list">
          {LETTERS.map((letter) => (
            <article className="letter-row" key={letter.title}>
              <div>
                <p className="eyebrow">
                  {letter.season} - {letter.readTime}
                </p>
                <h2>{letter.title}</h2>
              </div>
              <p>{letter.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

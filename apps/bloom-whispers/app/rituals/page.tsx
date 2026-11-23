import type { Metadata } from "next";
import { RITUALS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Rituals",
  description: "Gentle Bloom Whispers rituals for morning, afternoon, and evening reflection.",
};

export default function RitualsPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Rituals</p>
        <h1>Small practices for real days.</h1>
        <p>
          Each ritual is designed to be light enough to begin and specific enough to change the texture of a moment.
        </p>
      </section>

      <section className="section-band soft-band">
        <div className="ritual-grid">
          {RITUALS.map((ritual) => (
            <article className="ritual-card" key={ritual.title}>
              <p className="eyebrow">{ritual.moment}</p>
              <h2>{ritual.title}</h2>
              <p>{ritual.description}</p>
              <ul>
                {ritual.materials.map((material) => (
                  <li key={material}>{material}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

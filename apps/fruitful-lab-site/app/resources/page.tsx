import Link from "next/link";
import { ResourcesFinalCta } from "./ResourcesFinalCta";

export const metadata = {
  title: "Resources",
  description: "Coming-soon Fruitful Lab guides, templates, worksheets, and field notes for product discovery systems.",
  alternates: {
    canonical: "/resources/",
  },
};

const PREVIEW_ITEMS = ["Product discovery checklists", "Search + content maps", "Data-to-decision worksheets"] as const;

export default function ResourcesPage() {
  return (
    <div className="cfs-page resources-soon-page">
      <section className="cfs-hero resources-soon-hero">
        <div className="cfs-shell resources-soon-grid">
          <div className="cfs-hero-copy">
            <p className="cfs-kicker">Resources</p>
            <h1>
              Practical growth resources are <span>coming soon.</span>
            </h1>
            <p>
              We are keeping this page light for launch. This will become the home for Fruitful Lab guides, templates,
              worksheets, and useful field notes once the first resource library is ready.
            </p>
            <div className="cfs-actions">
              <Link className="cfs-button cfs-button-primary" href="/contact/">
                Book a fit call →
              </Link>
              <Link className="cfs-button cfs-button-secondary" href="/blog/">
                Read the blog →
              </Link>
            </div>
          </div>

          <aside className="resources-soon-card" aria-label="Upcoming resource types">
            <p>Resource bench</p>
            <h2>Useful assets, not busywork.</h2>
            <ul>
              {PREVIEW_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <span>Coming soon</span>
          </aside>
        </div>
      </section>

      <section className="resources-soon-note" aria-label="Resources launch note">
        <div className="cfs-shell resources-soon-note-grid">
          <div>
            <p className="cfs-kicker">For V1</p>
            <h2>Simple on purpose.</h2>
          </div>
          <p>
            Until the actual resources exist, this page should not pretend to be a library. It gives visitors a clear
            signal that resources are planned, then routes them to the blog or a fit call.
          </p>
        </div>
      </section>

      <ResourcesFinalCta />
    </div>
  );
}

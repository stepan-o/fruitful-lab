import { PageHeader } from "@/components/PageHeader";
import { SERVICES } from "@/lib/content";

export const metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Services" title="Pinterest strategy, setup, and growth systems." description="This route anchors the future editable service-page template. The exact offer copy will be migrated in a later content PR." />
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-5 pb-16 sm:px-8 md:grid-cols-3">
        {SERVICES.map((service) => (
          <article key={service.title} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-xl font-semibold text-[var(--heading)]">{service.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{service.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

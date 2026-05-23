type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="brand-display mt-4 headline-hero text-[var(--heading)]">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{description}</p>
      </div>
    </section>
  );
}

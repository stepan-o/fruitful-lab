type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sage)]">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-[var(--heading)] sm:text-5xl">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{description}</p>
      </div>
    </section>
  );
}

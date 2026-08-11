type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="page-header">
      <div className="relative z-10 mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-22">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-normal leading-[0.98] text-[var(--heading)] sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">{description}</p>
      </div>
    </section>
  );
}

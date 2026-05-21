type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="page-header">
      <div className="relative z-10 mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight text-[var(--heading)] sm:text-5xl">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{description}</p>
      </div>
    </section>
  );
}

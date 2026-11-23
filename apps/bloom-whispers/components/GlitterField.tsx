type GlitterFieldProps = {
  className?: string;
};

export function GlitterField({ className = "" }: GlitterFieldProps) {
  return (
    <div className={`site-glitter ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: 18 }).map((_, index) => (
        <span className={`site-glitter__dot site-glitter__dot--${index + 1}`} key={index} />
      ))}
    </div>
  );
}

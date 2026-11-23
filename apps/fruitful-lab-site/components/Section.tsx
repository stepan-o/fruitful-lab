import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  surface?: "background" | "surface";
};

export function Section({ children, className = "", surface = "background" }: SectionProps) {
  const background = surface === "surface" ? "section-soft" : "section-plain";

  return <section className={`${background} ${className}`}>{children}</section>;
}

export function SectionInner({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-18 ${className}`}>{children}</div>;
}

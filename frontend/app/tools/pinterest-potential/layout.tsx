// frontend/app/tools/pinterest-potential/layout.tsx
import type { ReactNode } from "react";
import FlowHeader from "@/components/layout/FlowHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export default function PinterestPotentialLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <FlowHeader backHref="/tools" />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">{children}</main>
      <SiteFooter />
    </div>
  );
}

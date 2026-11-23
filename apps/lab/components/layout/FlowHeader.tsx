// frontend/components/layout/FlowHeader.tsx
import Link from "next/link";
import Image from "next/image";
import { BookCallButton } from "@/components/layout/BookCallButton";

type FlowHeaderProps = {
  backHref?: string; // where the logo sends you back (default hub/tools)
};

export default function FlowHeader({ backHref = "/hub" }: FlowHeaderProps) {
  return (
    <header className="border-b border-[var(--brand-alabaster)] bg-[var(--background)]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo → navigates to backHref */}
        <Link
          href={backHref}
          className="flex items-center gap-3 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          <Image
            src="/cropped-Logo-Pink.png"
            alt="Fruitful Lab"
            width={220}
            height={60}
            priority
            className="h-9 w-auto sm:h-10"
          />
          <span className="sr-only">Fruitful Lab</span>
        </Link>

        <BookCallButton />
      </div>
    </header>
  );
}

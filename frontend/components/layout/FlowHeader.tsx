// frontend/components/layout/FlowHeader.tsx
import Link from "next/link";
import { BookCallButton } from "@/components/layout/BookCallButton";

type FlowHeaderProps = {
  backHref?: string; // where the logo sends you back (default hub/tools)
};

export default function FlowHeader({ backHref = "/hub" }: FlowHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href={backHref}
          className="font-heading text-lg sm:text-xl font-semibold tracking-tight text-slate-900"
        >
          Fruitful Lab
        </Link>

        <BookCallButton />
      </div>
    </header>
  );
}

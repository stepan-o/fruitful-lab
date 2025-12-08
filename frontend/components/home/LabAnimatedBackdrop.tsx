// frontend/components/home/LabAnimatedBackdrop.tsx
// Pure visual backdrop for the PublicHubLanding hero.
// Uses only brand color CSS variables defined in globals.css and very subtle animations.

export default function LabAnimatedBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
      {/* Faint vertical line drifting slightly left/right */}
      <div className="absolute top-6 bottom-6 left-[10%] w-px bg-[var(--brand-alabaster)] opacity-[0.08] sm:opacity-[0.06] md:opacity-[0.05] animate-[labDriftX_18s_ease-in-out_infinite]" />

      {/* Faint horizontal line drifting slightly up/down */}
      <div className="absolute left-8 right-8 top-10 h-px bg-[var(--brand-alabaster)] opacity-[0.08] sm:opacity-[0.06] md:opacity-[0.05] animate-[labDriftY_20s_ease-in-out_infinite]" />

      {/* Rounded rectangle implying a panel; slow vertical drift */}
      <div className="absolute right-[8%] top-12 hidden h-32 w-56 rounded-lg border border-[var(--brand-alabaster)] opacity-[0.12] md:block animate-[labDriftY_16s_ease-in-out_infinite]" />

      {/* Tiny bronze node with gentle opacity pulse */}
      <div className="absolute left-[22%] top-[58%] h-2 w-2 rounded-full bg-[var(--brand-bronze)] opacity-[0.12] animate-[labOpacityPulse_14s_ease-in-out_infinite]" />

      {/* Tiny rust square node with offset timing */}
      <div className="absolute bottom-[18%] right-[18%] hidden h-2.5 w-2.5 rounded-[4px] bg-[var(--brand-rust)] opacity-[0.10] sm:block animate-[labOpacityPulse_17s_ease-in-out_infinite]" />
    </div>
  );
}

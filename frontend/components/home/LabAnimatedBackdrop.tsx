// frontend/components/home/LabAnimatedBackdrop.tsx
// DEBUG VERSION: intentionally loud animation so we can verify it's working.

export default function LabAnimatedBackdrop() {
    return (
        // z-0 so the backdrop sits above the section bg,
        // but below the hero content (which is z-10).
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {/* Giant alabaster circle flinging left/right */}
            <div
                className="
          absolute
          -left-[20%] top-[5%]
          h-[460px] w-[460px]
          rounded-full
          bg-[var(--brand-alabaster)]
          opacity-[0.8]
          animate-[labDriftX_3s_linear_infinite]
        "
            />

            {/* Huge alabaster pill bouncing up/down */}
            <div
                className="
          absolute
          right-[-25%] top-[0%]
          h-[360px] w-[620px]
          rounded-[48px]
          bg-[var(--brand-alabaster)]
          opacity-[0.7]
          animate-[labDriftY_4s_linear_infinite]
        "
            />

            {/* Big raspberry orb zooming horizontally under CTAs */}
            <div
                className="
          absolute
          left-[10%] bottom-[-10%]
          h-[260px] w-[260px]
          rounded-full
          bg-[var(--brand-raspberry)]
          opacity-[0.9]
          animate-[labDriftX_2s_linear_infinite]
        "
            />

            {/* Bronze node strobing like mad */}
            <div
                className="
          absolute
          left-[30%] top-[55%]
          h-6 w-6
          rounded-full
          bg-[var(--brand-bronze)]
          animate-[labOpacityPulse_1.5s_linear_infinite]
        "
            />

            {/* Rust square strobing on the other side */}
            <div
                className="
          absolute
          bottom-[20%] right-[20%]
          h-6 w-6
          rounded-[6px]
          bg-[var(--brand-rust)]
          animate-[labOpacityPulse_1.5s_linear_infinite]
        "
            />
        </div>
    );
}

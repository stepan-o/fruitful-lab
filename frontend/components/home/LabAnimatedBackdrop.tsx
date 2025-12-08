// frontend/components/home/LabAnimatedBackdrop.tsx
// Server-compatible wrapper for the animated lab backdrop. We import a
// client component which handles all DOM updates and the rAF loop. Avoid
// using next/dynamic with ssr:false here, since this file can be imported
// from a Server Component; importing a Client Component directly creates
// the proper client boundary automatically in App Router.
import LabBackdropClient from "./LabBackdropClient";

export default function LabAnimatedBackdrop() {
  return (
    // Keep the outer wrapper as an absolutely-positioned, pointer-events-none layer
    // so it sits behind the hero content within the same section.
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <LabBackdropClient />
    </div>
  );
}

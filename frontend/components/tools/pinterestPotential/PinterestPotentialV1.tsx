// frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx
// Sprint 2: Render the stepper flow skeleton with state, validation, and persistence.
import PinterestPotentialWizard from "@/components/tools/pinterestPotential/PinterestPotentialWizard";

export function PinterestPotentialV1() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-[var(--foreground)]">Pinterest Potential Calculator — v1</h1>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          Answer a few quick questions. Your progress is saved for this session.
        </p>
      </div>
      <PinterestPotentialWizard />
    </div>
  );
}

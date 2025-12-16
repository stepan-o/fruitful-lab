"use client";

// frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx
// Sprint 2: Render the stepper flow skeleton with state, validation, and persistence.
import { useState } from "react";
import PinterestPotentialWizard from "@/components/tools/pinterestPotential/PinterestPotentialWizard";
import type { Lead } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";
import type { LeadMode } from "@/lib/tools/pinterestPotential/leadMode";

export function PinterestPotentialV1({
  leadMode = "gate_before_results",
  initialLead,
}: {
  leadMode?: LeadMode;
  initialLead?: Lead;
}) {
  const [phase, setPhase] = useState<"wizard" | "results">("wizard");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-[var(--foreground)]">
          Pinterest Potential Calculator — {phase === "results" ? "Results" : "v1"}
        </h1>
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          Answer a few quick questions. Your progress is saved for this session.
        </p>
      </div>
      <PinterestPotentialWizard leadMode={leadMode} initialLead={initialLead} onPhaseChange={setPhase} />
    </div>
  );
}

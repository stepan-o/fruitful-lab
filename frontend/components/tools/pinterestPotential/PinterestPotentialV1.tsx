"use client";

// frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx
// Render the stepper flow skeleton with state, validation, and persistence.

import { useState } from "react";
import PinterestPotentialWizard from "@/components/tools/pinterestPotential/PinterestPotentialWizard";
import type { Lead, LeadMode } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";
import { LEAD_GATING_CONFIG } from "@/lib/tools/pinterestPotential/leadGatingConfig";
import { useToolAnalytics } from "@/lib/hooks/useToolAnalytics";

export function PinterestPotentialV1({
                                         leadMode = LEAD_GATING_CONFIG.lead_gating.default_mode,
                                         initialLead,
                                     }: {
    leadMode?: LeadMode;
    initialLead?: Lead;
}) {
    const [phase, setPhase] = useState<"wizard" | "results">("wizard");
    const { trackToolStart } = useToolAnalytics({ toolName: "pinterest_potential" });

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

            <PinterestPotentialWizard
                leadMode={leadMode}
                initialLead={initialLead}
                onPhaseChangeAction={setPhase}
                onStartAction={trackToolStart}
            />
        </div>
    );
}

// frontend/components/tools/pinterestPotential/PinterestPotentialV2.tsx
// Placeholder shell for the Pinterest Potential Calculator – v2.

import type { Lead, LeadMode } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";
import type { PinterestPotentialVariant } from "@/lib/tools/pinterestPotentialConfig";

export function PinterestPotentialV2({
  leadMode: _leadMode,
  initialLead: _initialLead,
  initialVariant: _initialVariant,
}: {
  leadMode?: LeadMode;
  initialLead?: Lead;
  initialVariant: PinterestPotentialVariant;
}) {
  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl text-[#0B132B]">
        Pinterest Potential Calculator — v2 (placeholder)
      </h1>
      <p className="text-sm text-slate-700">
        This is the experimental v2 shell. Use this for alternate flows or A/B tests.
      </p>
    </div>
  );
}

"use client";

import FieldError from "@/components/ui/forms/FieldError";
import type { LeadStepProps } from "./StepTypes";

export default function StepLead({ label, leadDraft, onChange, errors }: LeadStepProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[var(--foreground)]">{label}</label>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={leadDraft.name ?? ""}
            aria-describedby={errors?.name ? "LEAD.name-error" : undefined}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
          />
          <FieldError id="LEAD.name-error" message={errors?.name} />
        </div>
        <div>
          <input
            type="email"
            placeholder="you@example.com"
            value={leadDraft.email ?? ""}
            aria-describedby={errors?.email ? "LEAD.email-error" : undefined}
            onChange={(e) => onChange({ email: e.target.value })}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
          />
          <FieldError id="LEAD.email-error" message={errors?.email} />
        </div>
      </div>
    </div>
  );
}

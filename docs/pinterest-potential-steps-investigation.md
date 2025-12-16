### Pinterest Potential — Steps architecture (StepQ1..StepQ9) vs. QUESTIONS‑driven rendering

Last updated: 2025-12-16 09:45

---

#### Objective
Confirm whether the new per-question step components (StepQ1.tsx … StepQ9.tsx) are actually used by the Wizard UI flow, and recommend whether to integrate them or continue with the current QUESTIONS‑driven approach.

---

### Code inventory (relevant files)

- Wizard and flow
  - frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx
  - frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts
  - frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx

- Spec and helpers
  - frontend/lib/tools/pinterestPotential/pinterestPotentialSpec.ts
  - frontend/lib/tools/pinterestPotential/compute.ts

- UI inputs
  - frontend/components/ui/forms/RadioPillGroup.tsx
  - frontend/components/ui/forms/CheckboxCardGrid.tsx
  - frontend/components/ui/forms/SliderWithTicks.tsx
  - frontend/components/ui/forms/FieldError.tsx
  - frontend/components/ui/forms/HelperText.tsx

- New step components (wrappers)
  - frontend/components/tools/pinterestPotential/steps/StepQ1.tsx
  - …
  - frontend/components/tools/pinterestPotential/steps/StepQ9.tsx
  - frontend/components/tools/pinterestPotential/steps/StepRadio.tsx
  - frontend/components/tools/pinterestPotential/steps/StepCheckbox.tsx
  - frontend/components/tools/pinterestPotential/steps/StepSlider.tsx
  - frontend/components/tools/pinterestPotential/steps/StepLead.tsx
  - frontend/components/tools/pinterestPotential/steps/StepTypes.ts

---

### How the Wizard currently renders steps

The Wizard uses a QUESTIONS‑driven dynamic renderer. For the current step, it inspects the question type and renders generic form controls directly, not the StepQ* components.

Key excerpts (simplified for clarity):

```text
// PinterestPotentialWizard.tsx
const steps = useMemo(() => {
  const base = QUESTIONS.filter((q) => q.type !== "lead");
  return includeLead ? [...base, LEAD] : base;
}, [includeLead]);

// Render path
function renderQuestion() {
  if (!current) return null;

  if (current.type === "lead") { /* inline lead inputs */ }
  if (current.type === "radio") {
    return <RadioPillGroup options={current.options} ... />;
  }
  if (current.type === "checkbox") {
    return <CheckboxCardGrid options={current.options} ... />;
  }
  if (current.type === "slider") {
    return <SliderWithTicks min={current.min} max={current.max} ... />;
  }
}
```

The file has no imports of StepQ1..StepQ9. The flow and validation operate on the `QUESTIONS` array from the spec.

---

### Are StepQ1..StepQ9 used by the Wizard?

Short answer: Not currently.

- The Wizard does not import StepQ1..StepQ9.
- Rendering is type‑based using generic inputs, sourced from `QUESTIONS` and `LEAD` definitions.
- The StepQ* files are light wrappers around the same generic inputs. Example:

```text
// steps/StepQ2.tsx
import { Q2 } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";
import StepCheckbox from "./StepCheckbox";

export default function StepQ2({ values, onChange, error }: { values: number[]; onChange: (v: number[]) => void; error?: string }) {
  return <StepCheckbox question={Q2} values={values} onChange={onChange} error={error} />;
}
```

Conclusion: StepQ* components are presently redundant with the Wizard’s QUESTIONS‑driven renderer.

---

### Should we integrate StepQ components?

Pros
- Encapsulation: Per‑question variations can be localized without branching in the Wizard.
- Extensibility: Future bespoke UX (tooltips, extra helper copy, conditional logic) can live near each question.
- Testability: Smaller units to snapshot/test in isolation.

Cons
- Duplication/Drift risk: Spec already centralizes options/labels; wrappers can get out of sync if they embed extra assumptions.
- Indirection: A registry of components by id adds lookups with minimal current benefit.
- Churn without need: Today’s UI is uniform enough for the type‑based renderer to stay simple and clear.

Recommendation
- Keep the current QUESTIONS‑driven approach as the source of truth. It’s simple, spec‑aligned, and already powers validation, compute, and recap.
- Treat StepQ* as optional wrappers for future bespoke presentation. If we don’t foresee near‑term bespoke differences, we can either:
  - Remove StepQ* to reduce maintenance surface, or
  - Leave them in place but clearly mark them as unused/experimental to avoid confusion.

---

### If we choose to integrate StepQ* (suggested minimalist pattern)

Add a tiny adapter that resolves a component by question id, falling back to the current type‑based renderer:

```text
// Inside PinterestPotentialWizard.tsx (conceptual sketch)
import StepQ1 from "./steps/StepQ1";
import StepQ2 from "./steps/StepQ2";
// ... up to StepQ9 and StepLead (optional)

const STEP_COMPONENTS: Partial<Record<string, React.ComponentType<any>>> = {
  Q1: StepQ1,
  Q2: StepQ2,
  // ...
};

function renderQuestion() {
  if (!current) return null;
  const C = STEP_COMPONENTS[current.id];
  if (C) {
    // Map current state slice to component props
    if (current.type === "radio") return <C value={(answers as any)[current.id]} onChange={...} error={...} />;
    if (current.type === "checkbox") return <C values={(answers as any)[current.id] ?? []} onChange={...} error={...} />;
    if (current.type === "slider") return <C value={(answers as any)[current.id] ?? current.default ?? current.min} onChange={...} error={...} />;
    if (current.type === "lead") return <C value={leadDraft} onChange={...} error={...} />;
  }
  // Fallback to existing type‑based UI (unchanged)
  // ... existing branches
}
```

Notes
- Validation, gating, compute, and draft persistence do not change.
- Checkbox answers remain canonical (IDs), as already enforced by the draft loader and dev invariants.

---

### Impact on validation, gating, compute

- Validation: continues to use the same rules; per‑step wrappers should not change data shapes.
- Lead modes: gate_before_results, optional_after_results, and prefilled_or_skip remain untouched.
- Compute: unchanged. The Wizard’s spec‑aligned compute for results stays the source of truth.

---

### Conclusion

- Current state: StepQ1..StepQ9 exist but are not used in the Wizard. The Wizard renders directly from `QUESTIONS` with generic inputs.
- Recommendation: Stay with the QUESTIONS‑driven approach for now. Optionally prune StepQ* if we want to reduce future maintenance, or keep them as a foundation for any upcoming bespoke step UIs.

---

### Appendix — quick references

- Steps directory: `frontend/components/tools/pinterestPotential/steps/`
- Wizard renderer uses: `RadioPillGroup`, `CheckboxCardGrid`, `SliderWithTicks`, inline lead capture.
- Canonical data model: checkbox answers store option IDs (Q2/Q3/Q9), enforced on draft load.

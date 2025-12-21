Below is a sprint plan Juno/Junie can execute to port the Outgrow calculator **1:1 logic**, while delivering “AAA boutique editorial, smooth React UX” polish.

We’ll treat the Outgrow build as the *source of truth* for: question text, answer options, per-option weights, and required/optional rules. The only “math” we implement is the final formula you provided.

---

## Sprint 0 — Spec lock + weight map extraction (no UI yet)
**Goal:** eliminate ambiguity so the port is deterministic.

**Deliverables**
- `pinterestPotentialSpec.ts` containing:
    - canonical question IDs: `Q1..Q9` (+ lead form)
    - exact option lists + **numeric weights** for each option (Q2/Q3 are multi-select arrays)
    - required flags + validation rules (e.g., must pick ≥1 for multi-select)
    - any dependencies (show/hide; if none, explicitly “none”)
- Snapshot “parity checklist” doc: Outgrow → React (question order, copy, option counts, defaults, error states).

**Implementation notes**
- Define strong types now:
    - `Q1,Q4,Q5,Q6` as scalar numeric (radio)
    - `Q2,Q3,Q9` as `number[]` (checkbox multi-select)
    - `Q7,Q8` as `number` slider 1–5 (int)
- Final formula function signature:
    - `computeScore(answers): number`

---
## Sprint 1 — Data model + compute engine (unit-tested)
**Goal:** compute result perfectly before building UX.

**Deliverables**
- `lib/tools/pinterestPotential/compute.ts`
    - `sum(arr:number[])`
    - `computeScore({Q1..Q8,Q2,Q3}): number`
    - formula exactly:
        - `round(sum(Q3)*sum(Q2)*Q1*Q4*Q5*Q6*(1.175-0.175*Q7)*(1.15-0.15*Q8), 0)`
- Unit tests covering:
    - empty multi-select handling (should be invalid, not computed)
    - slider bounds (1..5)
    - several golden cases copied from Outgrow (input → output exact)

**Non-negotiable**
- If any required answer missing → return `{ ok:false, errors }` not a number.

---

## Sprint 2 — Form state, validation, and stepper flow skeleton
**Goal:** smooth multi-step UX with instant validation.

**Deliverables**
- `components/tools/pinterestPotential/PinterestPotentialWizard.tsx`
    - stepper layout (left: questions, right: “preview / explanation” panel)
    - progress indicator (e.g., “Step 3 of 9”)
    - “Back / Continue” with keyboard support
- State management:
    - `react-hook-form` + `zod` (recommended) OR a lightweight reducer; either is fine, but must support:
        - partial save while navigating steps
        - validation per-step + on-submit
- Persist draft answers:
    - `sessionStorage` with version key (so old drafts don’t break after updates)

---
## Sprint 3 — Build the “editorial” input components (AAA accessible)
**Goal:** your “polished boutique” feel comes from controls + spacing + motion + accessibility.

**Deliverables**
Reusable components (token-driven; no hardcoded hex):
- `RadioPillGroup` (for Q1/Q4/Q5/Q6): big hit-targets, subtle hover, clear selected state
- `CheckboxCardGrid` (for Q2/Q3/Q9): selectable cards, multi-select, “selected count”
- `SliderWithTicks` (for Q7/Q8): 1–5 with labeled endpoints + numeric bubble
- `FieldError` + `HelperText` patterns consistent sitewide

**AAA / UX requirements**
- Full keyboard navigation (tab, arrows for radios, space for checkbox)
- Visible focus ring using your existing token ring (`--brand-raspberry`)
- `aria-describedby` on errors
- Motion reduced when `prefers-reduced-motion`

---

## Sprint 4 — Port the 9 questions + lead form (content parity pass)
**Goal:** all questions implemented exactly, with the new UX.

**Deliverables**
- `steps/` folder: `StepQ1.tsx … StepQ9.tsx` + `StepLead.tsx`
- Copy parity: question text, helper text, required asterisk behavior, and option labels match Outgrow
- Lead capture fields (name/email) with validation + privacy microcopy

---
**Important decision**
- If Outgrow collects email *before* showing results, replicate that (1:1).
- If Outgrow shows results and then asks for email to “send a copy,” replicate that.

---

## Sprint 5 — Results page experience (what users *get*)
**Goal:** make the output feel premium, not “here’s a number.”

**Deliverables**
- Results view component:
    - headline result number (the rounded output)
    - short interpretation bands (e.g., Low / Medium / High) driven by thresholds you define *or* copied from Outgrow if it has them
    - “What this means” + “Next steps” cards
    - CTAs: “Book a Call” + “Back to Tools” + optional “Email me results”
- Shareable URL strategy:
    - store result server-side? probably not needed
    - simplest: do not put raw answers in URL; use session/local + optional “email me” capture

---

## Sprint 6 — Integration polish: analytics, experiments, and QA
**Goal:** ship-ready.

**Deliverables**
- Tracking events (compatible with your GrowthBook pipeline):
    - `ppc_started`, `ppc_step_viewed`, `ppc_completed`, `ppc_lead_submitted`
    - include variant (`v1/v2`), step number, and validation failures count (no PII)
- Visual QA checklist:
    - light/dark theme parity
    - mobile ergonomics (thumb reach, spacing, sticky continue button)
    - cross-browser sanity
- Performance:
    - keep components server-friendly; wizard itself is client component
    - avoid heavy deps

---
## Sprint 7 — Tools index emphasis tweak (your ask)
**Goal:** Pinterest Potential is clearly *the* tool; others fade into the background.

**Deliverables**
- Tools index update:
    - Pinterest Potential card becomes “featured” (spans 2 columns on desktop, more prominent CTA)
    - Coming-soon tools become smaller “tiles” or a single “Coming soon” section below (reduced opacity, no “Open →” affordance)
    - optional: “More tools coming” microcopy instead of two full cards

---

## Hand-off notes Juno needs before starting Sprint 1
1. **Outgrow weights** for each option (Q2/Q3/Q9 especially). Without these, parity is impossible.
2. Confirm whether the result is:
    - “Pinterest Potential Score” only, or also maps to traffic/leads ranges.
3. Confirm lead form placement (before vs after results).

If you paste the **exact option → weight tables** for Q1–Q9 (even rough), I’ll turn this into a Junie-ready execution prompt with file-by-file tasks and acceptance tests per sprint.
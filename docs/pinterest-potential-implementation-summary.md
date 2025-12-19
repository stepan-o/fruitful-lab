### Pinterest Potential — Consolidated Implementation Report (Sprints 0–5)

Last updated: 2025-12-16

---

#### TL;DR
- Canonical spec is locked in pinterestPotentialSpec.ts; checkbox answers (Q2/Q3/Q9) store option IDs only.
- Canonical compute engine lives in compute.ts and translates IDs → values internally; Wizard delegates to it.
- The Wizard is Sprint 4 compliant: renders via explicit StepQ1…StepQ9 + StepLead registry, not a type-based fallback.
- Draft persistence enforces canonical shape and auto-clears legacy drafts (no backward compatibility).
- Results (Sprint 5) show three KPIs and maintain polished copy and privacy microcopy in both lead flows.
- This document consolidates prior investigations and audits; older standalone docs have been removed.
 
---

## 1) System Overview

Core files:
- Spec and helpers: frontend/lib/tools/pinterestPotential/pinterestPotentialSpec.ts
- Compute engine (source of truth): frontend/lib/tools/pinterestPotential/compute.ts
- Wizard UI: frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx
- Step components: frontend/components/tools/pinterestPotential/steps/* (Q1…Q9, Lead)
- Draft persistence: frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts
- Privacy copy: frontend/lib/tools/pinterestPotential/copy.ts
- Wrapper page: frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx

High-level flow:
1) User answers Q1–Q9 (and LEAD depending on lead mode).
2) Wizard validates answers (per-step and at submission time per lead mode).
3) Wizard computes results by calling the canonical compute engine.
4) Results panel renders three KPIs and a recap; optional-after-results email capture appears above KPIs when applicable.
5) Draft (stepIndex, answers, leadDraft) is persisted to sessionStorage (versioned key) and auto-cleared if invalid/legacy.

---

## 2) Canonical Data Model and Spec

- Question IDs: Q1..Q9 (+ LEAD). Order defined by QUESTIONS array in spec.
- Checkbox questions (Q2/Q3/Q9) store selected option IDs (number[]), not values.
- Options contain id, label, and value. Values are used by compute; ids ensure stability in Answers and mapping to meta.
- Validation rules (validateAnswers):
  - Required radios/sliders must be present and within bounds (Q7/Q8 ∈ [1..5]).
  - Required checkboxes must have ≥ 1 selection.
  - Lead validation (name + syntactic email) runs when caller requires lead.

Result helpers (Sprint 5, spec-aware):
- computeAvgHouseholdIncomeFromAnswers(answers): primary region → income map, defaults to Global.
- computeAvgCartSizeFromAnswers(answers): average cart base across selected product categories, then region multiplier and a 1.2 bump, rounded.

---

## 3) Compute Engine — Source of Truth (Sprint 1 principle)

File: frontend/lib/tools/pinterestPotential/compute.ts

- Responsibility: deterministic compute before UX; callers must not re-implement math.
- ID → value translation: computeScore() sums Q2/Q3 values by mapping selected IDs via spec options.
- Monthly Audience (Result 1) formula (rounded to 0 decimals):
  round(sum(Q3_values) * sum(Q2_values) * Q1 * Q4 * Q5 * Q6 * (1.175 - 0.175*Q7) * (1.15 - 0.15*Q8), 0)
- Results bundle (Sprint 5):
  - monthlyAudience = computeScore(answers)
  - avgHouseholdIncome = computeAvgHouseholdIncomeFromAnswers(answers)
  - avgCartSize = computeAvgCartSizeFromAnswers(answers)
- Validation-first path: computeResult(answers, lead?) → { ok:false, errors } unless valid.

Status vs prior investigations:
- Drift eliminated: legacy assumption of summing raw checkbox arrays has been corrected; engine is IDs-aware and canonical.

---

## 4) Wizard UI — Step Registry and Lead Modes (Sprint 4 + 5)

File: frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx

- Rendering is exclusively via a Step registry:
  - STEP_COMPONENTS maps { Q1…Q9, LEAD } → StepQ* wrappers (StepRadio/StepCheckbox/StepSlider/StepLead inside).
  - No inline type-based renderer remains.
- Lead modes supported (unchanged):
  - gate_before_results — StepLead included in steps before results; validation required.
  - optional_after_results — no lead step; optional capture appears atop results if no email set.
  - prefilled_or_skip — no lead step.
- Results header polish (Sprint 5 minimal UI):
  - Page H1 displays “… — Results” when results are shown; Wizard results header omits “(temporary)”.
- Privacy microcopy:
  - Centralized in PRIVACY_MICROCOPY and rendered in StepLead and optional-after-results capture.

---

## 5) Draft Persistence — Canonical Enforcement

File: frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts

- Storage key: pinterestPotential:draft:v1
- On load, strict validation ensures checkbox answers (Q2/Q3/Q9) are arrays of known option IDs.
- If invalid (e.g., legacy drafts storing raw values): the entire draft is discarded. No migration, per decision.
- In development, Wizard asserts the ID-only invariant before compute to catch regressions early.

Outcome:
- Prevents the historical “Result 1 = 1” symptom caused by mismatched draft shapes.

---

## 6) Results Presentation — Sprint 5 Outputs

- KPIs shown:
  1) Monthly Pinterest Audience (r.monthlyAudience)
  2) Avg Household Income (r.avgHouseholdIncome)
  3) Avg Cart Size (r.avgCartSize)
- Recap grid lists each question’s label with resolved answer labels (checkbox labels mapped from IDs).
- Optional-after-results capture sits above KPIs in a bordered, rounded section with responsive layout and privacy microcopy.

---

## 7) Consolidated Findings from Prior Investigations and Audits

- “Result 1 shows 1” root cause: legacy drafts using values for Q2 caused ID→value lookup to fail and zeroed region sum. Fixed by canonical draft enforcement and engine centralization.
- Steps architecture: StepQ1..StepQ9 now wired as the only render path (compliant). Shared inputs are used inside Step wrappers (RadioPillGroup, CheckboxCardGrid, SliderWithTicks), none unused.
- Source of truth: compute.ts is canonical; Wizard delegates. Spec helpers are used for Results 2/3.
- Privacy microcopy: present in both lead step and optional-after-results section; single shared string to avoid drift.

---

## 8) Remaining Gaps and Inconsistencies

- Testing (missing):
  - Unit tests for computeResult validation paths (required answers, slider bounds, empty multi-selects).
  - Golden output cases aligned with Outgrow to lock numeric expectations.
  - Regression tests for ID-only checkbox handling (no values accepted).
- Outgrow parity notes:
  - Spec uses ballpark values for certain helper maps (e.g., cart size region multipliers). If exact Outgrow tables are available, update the spec constants and add golden tests.
- Analytics/telemetry (Sprint 6): Not implemented in this scope.
- Shareable URL/Server persistence (Sprint 5 optional): Not implemented; current approach uses sessionStorage only.

---

## 9) Comparison vs pinterest-potential-v1-sprint-plan.md

- Sprint 0 — Spec lock: COMPLETE
  - Spec file exists with types, ordered questions, validation rules, and weights. Parity checklist present.

- Sprint 1 — Compute engine: COMPLETE (with notes)
  - Deterministic compute implemented in compute.ts; validation-first path via computeResult.
  - Tests are not present yet (gap to close next cycle).

- Sprint 2 — Stepper + validation + persistence: COMPLETE
  - Reducer-based stepper, per-step validation, sessionStorage draft with versioning.

- Sprint 3 — Polished inputs (AAA): COMPLETE (within current scope)
  - RadioPillGroup, CheckboxCardGrid, SliderWithTicks, FieldError, HelperText used via Step wrappers.

- Sprint 4 — Steps + Lead microcopy: COMPLETE
  - StepQ1..StepQ9 + StepLead wired via registry; privacy microcopy present in StepLead; Wizard no longer renders lead UI directly.

- Sprint 5 — Results experience (minimal polish): COMPLETE (minimal scope)
  - Results header text corrected; optional-after-results capture above KPIs with microcopy; three KPIs rendered.
  - Deeper editorial content (interpretation bands, next steps) is out of scope for the current minimal ship and remains a potential enhancement.

- Sprint 6/7 — Analytics / Index emphasis: OUT OF SCOPE (not implemented yet)

---

## 10) Recommendations (Next Cycle)

1) Add unit tests for validation and compute golden cases; include regression tests for ID-only handling.
2) Lock any remaining helper constants to Outgrow reference data if available; update REGION_META/PRODUCT_CART_BASE accordingly.
3) Add lightweight analytics hooks (event names as per sprint plan) without PII.
4) Consider optional “results interpretation” copy blocks to enhance value delivery (if product agrees).

---

## 11) References

- docs/pinterest-potential-v1-sprint-plan.md
- docs/pinterest-potential-parity.md
- frontend/lib/tools/pinterestPotential/pinterestPotentialSpec.ts
- frontend/lib/tools/pinterestPotential/compute.ts
- frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx
- frontend/components/tools/pinterestPotential/steps/*
- frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts
- frontend/lib/tools/pinterestPotential/copy.ts

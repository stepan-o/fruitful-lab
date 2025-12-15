# Pinterest Potential – Parity Checklist (Outgrow → React)

This checklist is used to lock Sprint 0. The React implementation must match the Outgrow calculator 1:1 in logic and behavior.

Status legend:
- [ ] Pending confirmation from Outgrow (exact copy/weights)
- [x] Confirmed

## Scope
- [x] Canonical spec file exists at `lib/tools/pinterestPotential/pinterestPotentialSpec.ts` (types, ordered questions, validation rules, formula doc)
- [ ] All question copy (labels + helper text) confirmed from Outgrow
- [ ] All option labels confirmed from Outgrow
- [ ] All numeric weights confirmed from Outgrow (no placeholders)

## Question Order (must match Outgrow)
1. [ ] Q1 — label matches Outgrow; options + weights confirmed
2. [ ] Q2 — checkbox; multi-select; options + weights confirmed
3. [ ] Q3 — checkbox; multi-select; options + weights confirmed
4. [ ] Q4 — radio; options + weights confirmed
5. [ ] Q5 — radio; options + weights confirmed
6. [ ] Q6 — radio; options + weights confirmed
7. [ ] Q7 — slider (1–5); label confirmed
8. [ ] Q8 — slider (1–5); label confirmed
9. [ ] Q9 — checkbox; multi-select; options + weights confirmed
10. [ ] Lead form — presence + placement confirmed

## Copy Parity
- [ ] Question labels match Outgrow exactly (spelling, punctuation)
- [ ] Helper text (if any) matches Outgrow
- [ ] Option labels match Outgrow exactly

## Required/Optional Behavior
- [ ] Q1 required (radio)
- [ ] Q2 required (checkbox; ≥1 selection)
- [ ] Q3 required (checkbox; ≥1 selection)
- [ ] Q4 required (radio)
- [ ] Q5 required (radio)
- [ ] Q6 required (radio)
- [ ] Q7 required (slider 1–5, integer)
- [ ] Q8 required (slider 1–5, integer)
- [ ] Q9 required (checkbox; ≥1 selection)
- [ ] Lead form required (name + email)

## Lead Form Placement
- [ ] Confirm whether lead capture occurs before showing results or after (must match Outgrow exactly).

## Formula Documentation (Do Not Modify)
Embedded in `pinterestPotentialSpec.ts`:

```
Final score formula:
round(
  sum(Q3) *
  sum(Q2) *
  Q1 *
  Q4 *
  Q5 *
  Q6 *
  (1.175 - 0.175 * Q7) *
  (1.15  - 0.15  * Q8),
  0
)
```

## Blockers (must be resolved to exit Sprint 0)
- [ ] Outgrow-provided option → weight tables for all questions (especially multi-select Q2, Q3, Q9)
- [ ] Final decision on lead form placement (before vs. after results)

## Notes
- Sprint 0 intentionally includes no compute engine and no UI. The spec must be deterministic and implementation-ready once weights/copy are filled.
- Once Outgrow confirmations arrive, replace the `❗ MISSING` markers in `pinterestPotentialSpec.ts` with exact values and mark the corresponding checklist items as complete.

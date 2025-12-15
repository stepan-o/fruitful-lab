# Pinterest Potential – Parity Checklist (Outgrow → React)

This checklist is used to lock Sprint 0. The React implementation must match the Outgrow calculator 1:1 in logic and behavior.

Status legend:
- [ ] Pending confirmation from Outgrow (exact copy/weights)
- [x] Confirmed

## Scope
- [x] Canonical spec file exists at `lib/tools/pinterestPotential/pinterestPotentialSpec.ts` (types, ordered questions, validation rules, formula doc)
- [x] All question copy (labels) confirmed from Outgrow screenshots (Sprint 0 copy parity)
- [ ] All option labels confirmed from Outgrow (Q3 full list pending)
- [ ] All numeric weights confirmed from Outgrow (no placeholders)

## Question Order (must match Outgrow)
1. [ ] Q1 — label matches Outgrow; options + weights confirmed
2. [ ] Q2 — checkbox; multi-select; options + weights confirmed
3. [ ] Q3 — checkbox; multi-select; options + weights confirmed (UI looked like dropdown; modeled as multi-select per formula sum(Q3))
4. [ ] Q4 — radio; options + weights confirmed
5. [ ] Q5 — radio; options + weights confirmed
6. [ ] Q6 — radio; options + weights confirmed
7. [x] Q7 — slider (1–5); label confirmed
8. [x] Q8 — slider (1–5); label confirmed
9. [ ] Q9 — checkbox; multi-select; options + weights confirmed
10. [x] Lead form — presence + placement confirmed (after Q9, before results)

## Copy Parity
- [x] Question labels match Outgrow exactly (spelling, punctuation)
- [x] Helper text (if any) matches Outgrow (none observed in screenshots)
- [ ] Option labels match Outgrow exactly (Q3 full list pending)

## Required/Optional Behavior
- [x] Q1 required (radio)
- [x] Q2 required (checkbox; ≥1 selection)
- [x] Q3 required (checkbox; ≥1 selection)
- [x] Q4 required (radio)
- [x] Q5 required (radio)
- [x] Q6 required (radio)
- [x] Q7 required (slider 1–5, integer)
- [x] Q8 required (slider 1–5, integer)
- [x] Q9 required (checkbox; ≥1 selection)
- [x] Lead form required (name + email)

## Lead Form Placement
- [x] Lead capture occurs before showing results (after Q9 on the same flow screen), matching Outgrow.

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
- [ ] Full option list for Q3 (only one visible in screenshot)

## Notes
- Sprint 0 intentionally includes no compute engine and no UI. The spec must be deterministic and implementation-ready once weights/copy are filled.
- Once Outgrow confirmations arrive, replace the `❗ MISSING` markers in `pinterestPotentialSpec.ts` with exact values and mark the corresponding checklist items as complete.

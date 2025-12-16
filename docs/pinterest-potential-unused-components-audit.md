### Unused components audit — Pinterest Potential tool (Sprint 4 refactor)

Last updated: 2025-12-16

---

#### Scope and rules
- Focus on the Pinterest Potential tool and shared UI components that might have become unused after wiring StepQ1…StepQ9 + StepLead into the Wizard render path.
- Exclude anything under frontend/components/home/_legacy/**.
- Goal is accuracy; do not delete anything unless it is truly unused.

Targets investigated:
- frontend/components/ui/forms/RadioPillGroup.tsx
- frontend/components/ui/forms/CheckboxCardGrid.tsx
- frontend/components/ui/forms/SliderWithTicks.tsx
- frontend/components/ui/forms/FieldError.tsx
- frontend/components/ui/forms/HelperText.tsx

---

### Findings summary

Used components (keep)

- RadioPillGroup — USED
  - Where used:
    - frontend/components/tools/pinterestPotential/steps/StepRadio.tsx
      - import RadioPillGroup from "@/components/ui/forms/RadioPillGroup";
      - Rendered inside StepRadio to display radio choices for Q1/Q4/Q5/Q6.

- CheckboxCardGrid — USED
  - Where used:
    - frontend/components/tools/pinterestPotential/steps/StepCheckbox.tsx
      - import CheckboxCardGrid from "@/components/ui/forms/CheckboxCardGrid";
      - Rendered inside StepCheckbox to display checkbox cards for Q2/Q3/Q9 (IDs only).

- SliderWithTicks — USED
  - Where used:
    - frontend/components/tools/pinterestPotential/steps/StepSlider.tsx
      - import SliderWithTicks from "@/components/ui/forms/SliderWithTicks";
      - Rendered inside StepSlider for Q7/Q8 sliders.

- FieldError — USED
  - Where used:
    - frontend/components/tools/pinterestPotential/steps/StepLead.tsx
    - frontend/components/tools/pinterestPotential/steps/StepRadio.tsx
    - frontend/components/tools/pinterestPotential/steps/StepCheckbox.tsx
    - frontend/components/tools/pinterestPotential/steps/StepSlider.tsx

- HelperText — USED
  - Where used:
    - frontend/components/tools/pinterestPotential/steps/StepRadio.tsx
    - frontend/components/tools/pinterestPotential/steps/StepCheckbox.tsx

Unused components (safe to delete)

- None. All audited components are used by the new Step components and therefore still required.

---

### Evidence (ripgrep summaries)

Notes: Searches exclude the legacy home path implicitly by limiting scope to relevant folders; no matches were found in _legacy.

- Search: "RadioPillGroup"
  - frontend/components/tools/pinterestPotential/steps/StepRadio.tsx: imports and renders RadioPillGroup
  - frontend/components/ui/forms/RadioPillGroup.tsx: component definition

- Search: "CheckboxCardGrid"
  - frontend/components/tools/pinterestPotential/steps/StepCheckbox.tsx: imports and renders CheckboxCardGrid
  - frontend/components/ui/forms/CheckboxCardGrid.tsx: component definition

- Search: "SliderWithTicks"
  - frontend/components/tools/pinterestPotential/steps/StepSlider.tsx: imports and renders SliderWithTicks
  - frontend/components/ui/forms/SliderWithTicks.tsx: component definition

- Search: "FieldError"
  - Used by StepLead, StepRadio, StepCheckbox, StepSlider (multiple occurrences)

- Search: "HelperText"
  - Used by StepRadio, StepCheckbox

---

### Wizard render path verification

- frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx now renders exclusively via a Step registry:
  - STEP_COMPONENTS maps { Q1…Q9, LEAD } → StepQ* / StepLead components.
  - No direct imports of RadioPillGroup, CheckboxCardGrid, SliderWithTicks, FieldError, or HelperText in the Wizard.
  - The older inline, type-based renderer is fully removed.

- No alternative Wizard variant renders the old path:
  - frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx wraps the current Wizard only; it does not import generic form components.

---

### Conclusion

All audited shared UI components remain in use through the Step components. There are no safe deletions at this time.

Deletion plan: N/A (nothing unused).

---

### Proposed (hypothetical) cleanup commit message

If in the future components become truly unused, use a Conventional Commit like:

"chore(ui): remove unused form components after Step registry adoption\n\n- Delete <Component>.tsx no longer referenced outside _legacy\n- Remove related exports from any barrel files\n- Update imports and run typecheck/build to ensure no regressions"

For this audit, no code cleanup is performed because all components are still referenced by Step components.

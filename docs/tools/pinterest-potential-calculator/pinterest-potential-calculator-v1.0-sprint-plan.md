# Pinterest Potential Calculator vNext — Implementation Sprint Plan (v0.2 Locked)

**Scope:** Replace existing Pinterest Potential tool with vNext generalized 8Q wizard, config-driven compute, inferred indices, mandatory lead-gating capability (known/hard/soft), A/B start (welcome vs no-welcome), and new `ppc_*` telemetry.

**Guiding constraints (from repo audit):**
- Keep `/tools/pinterest-potential` route and reuse existing server entry plumbing (query→cookie→default variant; leadMode + token inputs already wired).
- No existing lead/email backend exists → we must add an API route + provider integration (and optionally DB persistence) to truthfully support “Email me the results.”
- UI primitives are minimal → we must add BottomSheet + ProgressBar (+ optional SegmentedToggle) and lean on inline SVG/CSS for flair.

**Delivery strategy:** Build the vNext tool in parallel (new components + compute + API), wire it into the existing route/variant system, then remove v1 implementation once vNext meets acceptance criteria.

**Decision:** We will *not* create `pinterestPotentialVNext/*`. We’ll implement v0.2 by **rewriting in-place** under the existing folders:

- **UI + flow:** `frontend/components/tools/pinterestPotential/*`
    - `PinterestPotentialV1.tsx` = **Welcome** variant
    - `PinterestPotentialV2.tsx` = **No-welcome** variant
    - `PinterestPotentialWizard.tsx` = new 8Q wizard + results + lead gating
    - `steps/*` rewritten to Q1–Q8 + lead gating pieces (hard/soft), removing Q1–Q9 legacy
- **Logic + config:** `frontend/lib/tools/pinterestPotential/*`
    - `compute.ts` rewritten to config-driven range model + inferred indices
    - `pinterestPotentialSpec.ts` rewritten to v0.2 question schema + validation
    - add `benchmarks.ts`, `multipliers.ts`, `leadGatingConfig.ts`, `insight.ts` *inside the same folder*
- **Routing:** keep `/tools/pinterest-potential` entry page, but update variant mapping and lead-mode mapping.
- **Telemetry:** extend `frontend/lib/gtm.ts` to support **ppc_*** events (keep existing helpers, add new ones).
- **Lead email delivery:** add an API route under `frontend/app/api/...` + provider integration (since none exists today).

**Important mapping note:** Even if we keep components named “V1/V2”, the *experiment variant values* will be updated to `welcome | no_welcome` (spec requirement). V1/V2 file names remain; their meaning changes.

## Sprint 0 — In-place scaffolding (types + configs + event wrappers)

### Outcome
v0.2 building blocks exist **inside the current pinterestPotential folder**, without changing the UI flow yet.

### Tasks (in-place)
1) **Rewrite/introduce v0.2 types in `frontend/lib/tools/pinterestPotential/pinterestPotentialSpec.ts`**
- Define:
    - `Segment = content_creator | product_seller | service_provider`
    - `Niche` slug unions per segment (+ `other`)
    - `LeadMode = hard_lock | soft_lock`
    - `LeadState = known | new`
    - `Answers` for Q1–Q8 (slug/string-based, not numeric-only)
- Include per-question IDs exactly: `Q1..Q8` for telemetry.

2) **Add config files under the same folder**
- `frontend/lib/tools/pinterestPotential/benchmarks.ts`
- `frontend/lib/tools/pinterestPotential/multipliers.ts`
- `frontend/lib/tools/pinterestPotential/leadGatingConfig.ts`
- `frontend/lib/tools/pinterestPotential/insight.ts`

3) **Add typed telemetry wrappers (keep GTM as source)**
- Update `frontend/lib/gtm.ts`:
    - Add: `trackPpcViewStart`, `trackPpcStart`, `trackPpcAnswer`, `trackPpcComplete`, `trackPpcCtaClick`, `trackPpcLeadView`, `trackPpcLeadSubmit`, `trackPpcLeadSkip?`
    - Keep existing `pushEvent()` as-is.

### Exit criteria
- Repo compiles with new files added under `lib/tools/pinterestPotential/`.
- No UI behavior changes yet.

## Sprint 1 — Variant plumbing (welcome vs no-welcome) while reusing V1/V2 components

### Outcome
`/tools/pinterest-potential` renders **either Welcome start or No-welcome start**, using existing V1/V2 component slots.

### Tasks
1) **Update experiment variants**
- `frontend/lib/experiments/config.ts`:
    - Replace `["v1","v2"]` → `["welcome","no_welcome"]`
    - Set default (recommend: `welcome`)
- Keep cookie name `pp_variant` (reuse existing plumbing).

2) **Update server entry mapping**
- `frontend/app/(flow)/tools/pinterest-potential/page.tsx`:
    - Keep precedence logic (query → cookie → default).
    - Map:
        - `welcome` → render `PinterestPotentialV1`
        - `no_welcome` → render `PinterestPotentialV2`
    - Keep passing `leadMode` + `initialLead`.

3) **Lead mode mapping alignment**
- Current `leadMode.ts` contains legacy modes (`gate_before_results`, etc).
- Rewrite `frontend/lib/tools/pinterestPotential/leadMode.ts` to:
    - Resolve to **hard_lock | soft_lock**
    - Preserve known-lead override: if known → “skip UI” behavior (still pass mode, but UI will ignore).

### Exit criteria
- `?variant=welcome` shows Welcome start (via V1 component).
- `?variant=no_welcome` jumps to Q1 (via V2 component).
- Lead token and known lead detection still work at the entry page level.

## Sprint 2 — UI primitives (add missing pieces) + upgrade selectors for slug answers

### Outcome
We can implement Q2 chips + “More” bottom sheet + sticky progress bar with solid mobile UX and “React flair”.

### Tasks
1) **Add `BottomSheet` primitive**
- Create `frontend/components/ui/BottomSheet.tsx`
- Features:
    - slide-up, scrim, ESC close, focus return
    - reduced motion support

2) **Add `ProgressBar` primitive**
- Create `frontend/components/ui/ProgressBar.tsx`
- Sticky header: “Step X of 8” + bar fill.

3) **Upgrade existing selector primitives to accept string IDs**
- Update:
    - `RadioPillGroup.tsx` to allow `value: string | number`
    - `CheckboxCardGrid.tsx` to allow `values: Array<string|number>` and `id/value: string|number`
- This avoids creating duplicate chip/card components.

4) **Welcome micro-flair assets**
- Inline SVG hero + shimmer underline + button tap feedback (CSS only).

### Exit criteria
- BottomSheet + ProgressBar exist and are usable.
- Selector primitives can store slug-based answers cleanly (no adapter hacks).
  md
  Copy code
## Sprint 3 — Rewrite Wizard in-place: 8Q flow + nav + draft persistence

### Outcome
`PinterestPotentialWizard.tsx` becomes the v0.2 8-step wizard (Q1–Q8), mobile-first, with progress, back chevron, auto-advance, and sessionStorage draft.

### Tasks (in-place rewrites)
1) **Rewrite `frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx`**
- Replace reducer/state:
    - `stepIndex 1..8`
    - `answers` (v0.2 type)
    - `started` dedupe flag for `ppc_start`
    - sessionStorage key: `pinterestPotential:draft:v2` (or keep v1 key if you don’t care—recommend bump key to avoid stale incompatible drafts)

2) **Rewrite steps directory**
- Replace `frontend/components/tools/pinterestPotential/steps/*` with:
    - `Q1Segment.tsx`
    - `Q2Niche.tsx` (chips + More bottom sheet + audience-size preview meter)
    - `Q3Volume.tsx`
    - `Q4Visual.tsx`
    - `Q5Site.tsx`
    - `Q6Offer.tsx`
    - `Q7Goal.tsx`
    - `Q8GrowthMode.tsx`

3) **Global behavior**
- Sticky ProgressBar
- Auto-advance after selection (250–400ms)
- Back chevron (internal nav, not browser)
- Helper microcopy: “Pick the closest match”

### Exit criteria
- Both variants can complete Q1–Q8 and land on a placeholder “Crunching…” screen.
- Q2 is dynamic based on Q1.
- UI feels polished on mobile.
  md
  Copy code
## Sprint 4 — Rewrite compute engine in-place (config-driven ranges + inferred indices + insight)

### Outcome
`frontend/lib/tools/pinterestPotential/compute.ts` produces v0.2 outputs:
- `audience_size_est` (range)
- `opportunity_est` (range; segment-specific label)
- `income_est` (range or index)
- `seasonality_index`, `competition_index`
- optional `insight` line (1–2 lines, planning advantage)

### Tasks
1) **Replace old compute logic**
- Rewrite `compute.ts` to:
    - lookup benchmark row by `(segment, niche)`
    - apply multipliers from Q3–Q8 (subtle, capped)
    - apply inferred multipliers to opportunity (seasonality + competition)
    - return **ranges only** (no exact numbers)

2) **Add “Focused/Medium/Broad” helper**
- Derive from benchmark audience range buckets for Q2 preview + results meter.

3) **Insight generation**
- Implement `insight.ts` mapping from indices → short positive planning guidance.

### Exit criteria
- Wizard completion yields deterministic v0.2 compute output.
- No false precision, ranges only, subtle multiplier impact.
  md
  Copy code
## Sprint 5 — Results UI + animations + CTA (in-place)

### Outcome
Results page matches spec exactly:
- 3 stacked cards (Audience, Opportunity, Income)
- optional Insight line
- single CTA (book consult)
- stagger reveal + count-up + micro loading state

### Tasks
1) **Implement Results screen inside Wizard (or extracted component)**
- Card 1: range + SVG meter
- Card 2: segment-based opportunity label + tiny SVG chart
- Card 3: income band chips + highlight

2) **Animations (CSS/SVG-first)**
- Micro loading 300–500ms (“Crunching…”)
- Stagger slide-up 100–150ms
- Subtle count-up ≤600ms (disable for reduced motion)

3) **CTA wiring**
- Use existing `Button` component with `href` to booking link.
- Add `ppc_cta_click` event on click.

### Exit criteria
- Results are “premium” and mobile-first without heavy libs.
- CTA click tracked.
  md
  Copy code
## Sprint 6 — Lead gating (known / hard lock / soft lock) wired into the Results transition

### Outcome
Lead gating capability is fully implemented and behaves the same for both variants:
- Known lead: results immediately, no email UI
- New + hard lock: gate before results (compute allowed, results withheld)
- New + soft lock: results visible + optional “email me results” panel

### Tasks
1) **Implement lead gating logic in Wizard completion**
- After compute:
    - if `lead_state=new` and `lead_mode=hard_lock` → show hard gate screen
    - else → show results immediately

2) **Hard lock gate UI**
- New component under same folder, e.g.:
    - `steps/LeadGateHardLock.tsx`
- Email required, name optional
- Must truthfully say: “We’ve calculated your snapshot — enter email to view it.”
- Fire: `ppc_lead_view` on display

3) **Soft lock inline panel**
- Component: `steps/LeadPanelSoftLock.tsx`
- “Email me the results” (email required only if submitting)
- Success state “Sent — check your inbox”
- Fire: `ppc_lead_view` when panel shown
- Optional: `ppc_lead_skip` when user dismisses panel

### Exit criteria
- Hard lock blocks results render until submit succeeds.
- Soft lock never blocks results.
- Known lead never shows email UI.
  md
  Copy code
## Sprint 7 — Lead submission API + real email delivery (required)

### Outcome
Email capture actually does something (no fake “Sent”):
- A Next API endpoint receives payload and triggers provider delivery.
- Works for both hard lock and soft lock submissions.

### Tasks
1) **Add API route**
- `frontend/app/api/tools/pinterest-potential/lead/route.ts`
- Accept:
    - email (+ optional name)
    - attribution: variant/segment/niche/goal/lead_mode/lead_state
    - answers + computed results (ranges + indices + insight)
- Validate payload + basic rate limit.

2) **Provider integration**
- Implement a small provider layer (inside `frontend/lib/...` or API route):
    - `sendResultsEmail(...)`
- Pick provider (Resend/Postmark/SendGrid/ConvertKit) and drive config via env vars.
- If env missing → return error (so UI can show a real failure state).

3) **(Optional but recommended) Persistence**
- If DB is available/cheap: store payload (email + json) for debugging.
- Otherwise: structured logs (still better than nothing).

### Exit criteria
- Submitting email delivers an actual email (or fails loudly with clear UI error).
- Hard lock: success → results displayed.
- Soft lock: success → “Sent” state.
  md
  Copy code
## Sprint 8 — Telemetry: implement full `ppc_*` contract across both variants + gating

### Outcome
All required events are emitted with correct dimensions and no double-fires:
- `ppc_view_start`, `ppc_start`, `ppc_answer`, `ppc_complete`, `ppc_cta_click`, `ppc_lead_view`, `ppc_lead_submit`
- optional: `ppc_back`, `ppc_dropoff`, `ppc_lead_skip`

### Tasks
1) **Variant-specific view/start rules**
- Welcome variant (V1):
    - `ppc_view_start` on welcome mount
    - `ppc_start` on Start click
- No-welcome variant (V2):
    - `ppc_view_start` on Q1 mount
    - `ppc_start` on first Q1 interaction

2) **Question tracking**
- `ppc_answer` on each Q selection:
    - include `question_id`, `answer_id`

3) **Completion tracking**
- `ppc_complete` fires when results are actually visible:
    - include: variant/segment/niche/goal + indices + lead_mode + lead_state

4) **Lead tracking**
- `ppc_lead_view` when:
    - hard gate displayed OR soft panel displayed
- `ppc_lead_submit` on successful API submit:
    - include mode/state + attribution fields

### Exit criteria
- Telemetry meets spec 100% and is consistent across both start variants.
  md
  Copy code
## Sprint 9 — Tests + teardown of legacy v1 logic (since we don’t care about backwards compatibility)

### Outcome
Old Q1–Q9 + old compute/spec are removed, replaced by v0.2.
Tool is clean, minimal, and aligned with spec.

### Tasks
1) **Replace existing tests**
- Remove:
    - `frontend/__tests__/pinterestPotential.compute.test.ts`
    - `frontend/__tests__/pinterestPotential.optionalAfterResults.test.tsx`
- Add new tests for:
    - compute ranges + inferred indices
    - hard lock blocks results until submit
    - soft lock shows results regardless
    - known lead bypasses email UI
    - telemetry payload shape sanity (optional but useful)

2) **Delete dead files**
- Remove any step components no longer used.
- Remove old spec types and numeric ID assumptions.

3) **Final acceptance run**
- Validate every Acceptance Criteria line item (1–11) against actual behavior.

### Exit criteria
- v0.2 passes tests and manual QA for:
    - welcome/no-welcome
    - known/new lead
    - hard/soft lock
    - email delivery
    - full telemetry
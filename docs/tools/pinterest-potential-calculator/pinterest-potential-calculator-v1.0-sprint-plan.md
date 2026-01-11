# Pinterest Potential Calculator vNext — Implementation Sprint Plan (v0.2 Locked)

**Scope:** Replace existing Pinterest Potential tool with vNext generalized 8Q wizard, config-driven compute, inferred indices, mandatory lead-gating capability (known/hard/soft), A/B start (welcome vs no-welcome), and new `ppc_*` telemetry.

**Guiding constraints (from repo audit):**
- Keep `/tools/pinterest-potential` route and reuse existing server entry plumbing (query→cookie→default variant; leadMode + token inputs already wired).
- No existing lead/email backend exists → we must add an API route + provider integration (and optionally DB persistence) to truthfully support “Email me the results.”
- UI primitives are minimal → we must add BottomSheet + ProgressBar (+ optional SegmentedToggle) and lean on inline SVG/CSS for flair.

**Delivery strategy:** Build the vNext tool in parallel (new components + compute + API), wire it into the existing route/variant system, then remove v1 implementation once vNext meets acceptance criteria.
md
Copy code
## Sprint 0 — Repo prep + “new tool surface” scaffolding

### Outcomes
- Create a clean vNext namespace (components + lib) without touching v1 yet.
- Establish types + config skeletons + event helper interfaces so later sprints are mechanical.

### Tasks
1) **Create vNext folders**
- `frontend/components/tools/pinterestPotentialVNext/`
- `frontend/lib/tools/pinterestPotentialVNext/`
- `frontend/lib/tools/pinterestPotentialVNext/config/`

2) **Define vNext types (single source of truth)**
- `types.ts`:
    - `Segment`, `Niche`, `LeadMode`, `LeadState`
    - `Answers` (Q1–Q8)
    - `BenchmarkRow`, `MultipliersConfig`
    - `ComputeInput`, `ComputeOutput` (ranges + indices + optional insight string)

3) **Create config skeletons**
- `config/benchmarks.ts` (seed with representative rows per segment to unblock UI; expand later)
- `config/multipliers.ts` (as per spec)
- `config/leadGating.ts` (default_mode + known behavior + capture fields)

4) **Create analytics skeleton**
- `frontend/lib/tools/pinterestPotentialVNext/analytics.ts` with typed wrappers that call `pushEvent`
    - `trackPpcViewStart`, `trackPpcStart`, `trackPpcAnswer`, `trackPpcComplete`, `trackPpcCtaClick`, `trackPpcLeadView`, `trackPpcLeadSubmit`, `trackPpcLeadSkip?`

### Exit criteria
- vNext compiles (even if unused), with typed config + analytics wrappers in place.
  md
  Copy code
## Sprint 1 — Routing + A/B variant plumbing (welcome vs no-welcome)

### Outcomes
- `/tools/pinterest-potential` can render vNext using the existing precedence chain:
    - `?variant` → cookie → default
- Variants represent the new A/B start experience:
    - `welcome` and `no_welcome`
- Lead state & lead mode still resolved server-side and passed to client.

### Tasks
1) **Update experiment/variant definitions**
- Replace variants list from `["v1","v2"]` → `["welcome","no_welcome"]`
- Update default in config to `welcome` (or whatever you want as default).

2) **Update normalize/resolve mapping**
- In `frontend/app/(flow)/tools/pinterest-potential/page.tsx`:
    - keep `resolvePinterestPotentialVariant` but normalize to `welcome | no_welcome`
    - keep query override support: `?variant=...`

3) **Wire vNext component(s)**
- Introduce:
    - `PinterestPotentialWelcomeVariant` (Welcome → Start → Wizard)
    - `PinterestPotentialNoWelcomeVariant` (Wizard directly at Q1)
- Both variants render the same `Wizard` component; only differ in start screen.

4) **Keep lead init path**
- Keep `initialLead` and `leadMode` resolution in server page:
    - Known lead detection: authenticated user OR decoded token.
- Map lead mode to vNext:
    - `hard_lock | soft_lock`
    - If existing lead: always “skip UI”.

### Exit criteria
- Navigating to `/tools/pinterest-potential?variant=welcome` shows Welcome screen.
- Navigating to `/tools/pinterest-potential?variant=no_welcome` shows Q1 immediately.
- Both variants receive `{ leadMode, initialLead }` props correctly.
  md
  Copy code
## Sprint 2 — UI primitives + “React flair” baseline

### Outcomes
- Build the missing primitives needed by the spec:
    - Bottom sheet for “More” on Q2
    - Sticky progress bar for steps
- Add lightweight motion polish (CSS + inline SVG), no heavy libraries.

### Tasks
1) **Add `BottomSheet` primitive**
- `frontend/components/ui/BottomSheet.tsx`
- Requirements:
    - Mobile-first slide-up drawer
    - Scrim click-to-close
    - ESC close
    - Focus trap-lite (at minimum: focus initial element + return focus on close)
    - Reduced motion support (`prefers-reduced-motion`)

2) **Add `ProgressBar` primitive**
- `frontend/components/ui/ProgressBar.tsx`
- Used as sticky header: “Step X of 8” + bar.

3) **Selector building blocks**
- Prefer modifying existing primitives to accept string ids:
    - `RadioPillGroup`: allow `value: string | number`
    - `CheckboxCardGrid`: allow `values: Array<string|number>` and `id/value: string|number`
- This avoids duplicating selectors for slugs.

4) **Welcome screen micro-flair**
- Inline SVG hero: “pins floating into a chart”
- CSS shimmer underline on headline
- Button tap feedback (scale/translate, reduced motion safe)

### Exit criteria
- BottomSheet + ProgressBar usable in isolation.
- Selector components can store slug-based answers without adapters.
- Welcome screen looks “designed,” not dev-default.
  md
  Copy code
## Sprint 3 — Wizard core (8 questions) + navigation behavior

### Outcomes
- Implement the full Q1–Q8 flow with:
    - Auto-advance after selection (250–400ms)
    - Back chevron (internal state)
    - Sticky progress (Step X of 8)
    - Mobile-friendly tap targets (≥44px)
    - Helper microcopy + compact layout

### Tasks
1) **Wizard state machine**
- `Wizard.tsx` client component with reducer:
    - `stepIndex` (1–8)
    - `answers` (Q1–Q8)
    - `started` boolean (for ppc_start rules)
    - `draft persistence` via sessionStorage key: `pinterestPotential:draft:vNext`
    - Clear draft on completion or explicit reset

2) **Steps implementation**
- `steps/Q1Segment.tsx` (3 large cards + icons)
- `steps/Q2Niche.tsx` (chip picker + “More” bottom sheet + non-numeric preview meter)
- `steps/Q3Volume.tsx` (segmented selector w/ sparkline growth)
- `steps/Q4Visual.tsx` (4 cards w/ grid tile animation)
- `steps/Q5Site.tsx` (A–D phone-frame SVG states)
- `steps/Q6Offer.tsx` (3-state fill-meter)
- `steps/Q7Goal.tsx` (2×2 grid + preview line)
- `steps/Q8GrowthMode.tsx` (3-state toggle; optional rocket for ads)

3) **Auto-advance**
- Each step emits `onAnswer(value)`; wizard sets answer, then advances after short delay.

4) **Back behavior**
- Back chevron decrements step; answers persist.

### Exit criteria
- Complete wizard without compute/lead gating and land on a placeholder “Results computing…” screen.
- Q2 list properly changes based on Q1 segment.
- UX feels mobile-native.
  md
  Copy code
## Sprint 4 — Config-driven compute engine + inferred indices + insight

### Outcomes
- Implement real computation (ranges only) using:
    - benchmark row keyed by `(segment, niche)`
    - multipliers from Q3–Q8
    - inferred `seasonality_index` + `competition_index` from config
- Produce:
    - `audience_size_est` range
    - `opportunity_est` range (segment-specific label)
    - `income_est` range/index
    - optional insight line (1–2 lines, planning advantage framing)

### Tasks
1) **Compute core**
- `compute.ts`:
    - lookup benchmark row
    - apply multipliers (subtle, capped ±10–15% effects)
    - apply inferred multipliers (seasonality + competition) to opportunity
    - return range outputs + indices

2) **Goal micro-adjust (optional)**
- If included in v0.2: keep it tiny (±3%) and non-dominant.

3) **Insight generator**
- `insight.ts`:
    - derive 1–2 lines from indices (never negative; planning advantage)
    - examples keyed per high/medium/low combos

4) **Non-numeric preview meter (Q2)**
- Derive “Focused / Medium / Broad” from benchmark audience range buckets.

### Exit criteria
- Given answers, compute returns stable deterministic ranges and indices.
- Output always ranges; no “exact” numbers.
- Insight line present when indices warrant it.
  md
  Copy code
## Sprint 5 — Results UI (3-card stack) + dynamic reveal + CTA

### Outcomes
- Implement Results page exactly per spec:
    - 3 stacked cards (Audience, Opportunity, Income)
    - optional insight line
    - single CTA button (Book consult)
    - micro loading state 300–500ms
    - stagger reveal + subtle count-up (≤600ms)
    - inline SVG meters + micro chart

### Tasks
1) **Results layout**
- `Results.tsx`:
    - Card 1: audience range + Focused→Broad meter
    - Card 2: segment-specific opportunity label + micro chart
    - Card 3: income range + band chips (Low/Mid/High highlight)

2) **Animation polish**
- Use CSS transitions + requestAnimationFrame count-up
- Respect reduced motion (disable count-up + reduce transitions)

3) **CTA**
- Button: “Book a free consult to unpack your results”
- Subtext line under button
- Wire click to existing booking URL (Calendly or site contact) via `Button href=...`

### Exit criteria
- Results are visually “premium,” mobile-first, and fast.
- No heavy chart libs; everything via SVG + CSS.
  md
  Copy code
## Sprint 6 — Lead gating (known / hard lock / soft lock) + runtime config behavior

### Outcomes
- Lead gating works identically for both start variants:
    - **Known lead:** results show immediately; no email UI
    - **New lead + hard lock:** email gate before results (compute allowed before gate; results withheld until submit)
    - **New lead + soft lock:** results visible + optional “Email me the results” panel

### Tasks
1) **Lead state resolver (client)**
- `lead.ts`:
    - `lead_state = known | new` from `initialLead`
    - `lead_mode = hard_lock | soft_lock` resolved from server-provided mode/config

2) **Hard lock gate screen**
- `LeadGateHardLock.tsx`:
    - Micro reassurance copy + form (email required, name optional)
    - After successful submit: transition to results screen
    - Must be able to say: “We’ve calculated your snapshot — enter email to view it.”

3) **Soft lock inline panel**
- `LeadPanelSoftLock.tsx`:
    - Inline compact form + “Email me the results”
    - Success state: “Sent — check your inbox” (or “We’ll email your snapshot shortly”)
    - Optional dismiss/skip action for `ppc_lead_skip`

4) **Compute + gate sequencing**
- On wizard completion:
    - compute immediately
    - if hard lock + new lead: show gate screen, do NOT render results
    - else: render results immediately

### Exit criteria
- All three lead behaviors function and match spec verbatim.
- No results render in hard lock until lead submit succeeds (unless known lead).
  md
  Copy code
## Sprint 7 — Lead submission API + “Email results” delivery (required for truthfulness)

### Outcomes
- Add a real submission endpoint and a real email delivery mechanism so “Sent” is accurate.
- Capture includes attribution fields (segment/niche/goal/variant + mode/state).
- Works for both:
    - hard lock submit
    - soft lock “email me results” submit

### Tasks
1) **Add Next API route**
- `frontend/app/api/tools/pinterest-potential/lead/route.ts`
- Accept payload:
    - `email`, optional `name`
    - `variant`, `segment`, `niche`, `primary_goal`, `lead_mode`, `lead_state`
    - `answers` (Q1–Q8)
    - `results` (ranges + indices + insight)

2) **Provider integration**
- Implement provider interface:
    - `sendResultsEmail({email,name,results,answers,ctaUrl})`
- Default provider recommendation for v0.2:
    - Transactional email provider (e.g., Resend/Postmark/SendGrid) OR ConvertKit automation trigger.
- Include env var gating:
    - If provider keys missing → fail fast in dev; in prod require keys set.

3) **(Optional but recommended) Persistence**
- Store submission server-side for audit/debug:
    - simplest: Postgres table `ppc_leads` (email, created_at, payload jsonb)
    - or lightweight logging if DB migration is heavy

4) **Security + validation**
- Basic payload validation (zod or manual)
- Rate limit minimal (by IP/email) to prevent abuse

### Exit criteria
- Submitting email in hard lock sends a results email and then shows results.
- Submitting email in soft lock sends a results email and shows “Sent” success state.
  md
  Copy code
## Sprint 8 — Telemetry (ppc_* events) + attribution completeness

### Outcomes
- Implement the full required event contract:
    - `ppc_view_start`, `ppc_start`, `ppc_answer`, `ppc_complete`, `ppc_cta_click`, `ppc_lead_view`, `ppc_lead_submit`
    - Optional: `ppc_back`, `ppc_dropoff`, `ppc_lead_skip`

### Tasks
1) **Event emission rules**
- `ppc_view_start`:
    - Welcome variant: on welcome mount
    - No-welcome variant: on Q1 mount
- `ppc_start`:
    - Welcome variant: on Start click
    - No-welcome variant: on first interaction with Q1 (first answer)
- `ppc_answer`:
    - Fire for every Q1–Q8 selection (include `question_id`, `answer_id`)
- `ppc_complete`:
    - Fire when results are actually shown
    - Include: variant/segment/niche/goal + indices + lead_mode + lead_state
- `ppc_cta_click`:
    - Fire on CTA click from results
- `ppc_lead_view`:
    - Hard lock: when gate screen is displayed
    - Soft lock: when email panel is displayed
- `ppc_lead_submit`:
    - On successful API submission (include mode/state + attribution fields)

2) **Implement `ppc_dropoff` (optional)**
- Track last step on unload if feasible (best-effort)

### Exit criteria
- A test run produces complete, consistent telemetry with no double-fires.
- `ppc_complete` always includes lead and variant dimensions.
  md
  Copy code
## Sprint 9 — Tests + QA pass + performance polish

### Outcomes
- Replace v1 tests with vNext tests for compute + gating behavior.
- QA flows for both variants and both lead modes.
- Ensure mobile UX + performance meets “fast + lightweight” intent.

### Tasks
1) **Unit tests**
- compute engine:
    - benchmark lookup + multiplier application + inferred indices
    - range outputs only
- insight generator behavior

2) **Component tests (targeted)**
- hard lock: results not shown before submit
- soft lock: results shown + optional email submit works
- known lead: no email UI

3) **Telemetry tests**
- Mock `window.dataLayer` and assert event payload shapes

4) **Performance**
- Ensure no heavy deps introduced
- Keep SVG inline and minimal
- Ensure bottom sheet does not cause layout thrash

### Exit criteria
- Test suite passes and covers core behaviors.
- Tool feels snappy on mobile and respects reduced motion.
  md
  Copy code
## Sprint 10 — Teardown v1 (remove old tool safely) + final acceptance verification

### Outcomes
- Remove deprecated v1 implementation after vNext is wired and verified.
- Ensure route `/tools/pinterest-potential` only serves vNext.
- Update docs/spec references if needed.

### Tasks
1) **Remove old v1/v2 components**
- `frontend/components/tools/pinterestPotential/*` (wizard, steps, draft hook, wrappers)

2) **Remove old v1 lib**
- `frontend/lib/tools/pinterestPotential/*` (old spec/compute/copy/token)

3) **Remove old tests**
- `frontend/__tests__/pinterestPotential.*` (replace with vNext tests already)

4) **Acceptance Criteria checklist (spec 1–12)**
- Validate each item explicitly:
    - 3 segments + dynamic niches
    - 8 questions
    - results cards + CTA
    - welcome/no-welcome A/B trackable
    - full telemetry contract
    - config-driven compute + indices
    - lead gating modes configurable + working
    - lead telemetry present + correct

### Exit criteria
- vNext is the only implementation, meets spec 100%, and old code is gone.
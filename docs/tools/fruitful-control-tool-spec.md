# Fruitful Control (V1) — System Specification

---

## Purpose

Fruitful Control (V1) is a **contractor-facing, rules-based QA assistant** embedded in the Fruitful Lab Tools System.

It sits between:
- **Global Fruitful (Susy) standards**
- **Client-specific guidelines**
- **Contractor output**

Its job is to ensure contractors **self-QA and correct work before Susy reviews**, so Susy reviews—not rewrites.

Fruitful Control is **not** a strategy engine.  
It is a **deterministic compliance + clarification layer**.

Authority order:
1. `docs/SYSTEM_IMPLEMENTATION_AUDIT-2025-12-21.md` (wins on conflict)
2. LLM Architect Onboarding prompt (system invariants)
3. This Fruitful Control (V1) spec

---

## Success Criteria (Release Definition)

Fruitful Control V1 is “done” only when:

- Contractors can self-QA work **without guessing**
- Client-specific repeat mistakes materially decrease
- Susy’s role shifts from **rewriting** → **approving + light edits**
- Output is deterministic, auditable, and explainable
- Tool stays strictly within scope (no silent strategy)

If any of these fail, the tool is not complete.

---

## Access Tier & Route Placement

Access:
- **Contractor-only** (group `"contractor"`)
- Admins may access for oversight/testing

Placement:
- Must live under a contractor namespace:
    - `/contractor/fruitful-control` (preferred)

Hard rules (from Contractor Access Contract v1):
- No UI-only gating
- Server-side verification must occur **before meaningful render**
- Fail closed on ambiguous identity

---

## V1 Scope (Included)

Fruitful Control V1 supports:

Task Types:
- Pin Titles
- Pin Descriptions
- Pin Design QA (checklist-based + image analysis)

Capabilities:
- Load rules (global + client + task)
- Evaluate compliance (QA)
- Return structured feedback
- Provide bounded suggested corrections
- Clarification mode with a single clean question
- Produce a numeric QA rating (0–10) aligned to the same criteria used for the verdict
- For Design QA: accept an image input and run deterministic, criteria-based visual checks

Modes:
- Initial QA
- Resubmission loop until “Ready to Deliver”
- Clarification mode when rules are insufficient

---

## V1 Non-Goals (Hard Boundaries)

Fruitful Control V1 must NOT:

- Create strategy
- Perform keyword research from scratch
- Decide targeting or positioning
- Schedule content
- Access analytics/reporting
- Manage projects/tasks
- Replace Susy’s judgment
- Expand scope via “helpful” speculation

If the assistant answers “what should we do?” instead of “does this comply?”, it has violated scope.

---

## Two-Layer Rule System (Core Concept)

Fruitful Control applies two mandatory rule layers:

Layer A — Global Fruitful Rules (always apply)
- Formatting rules for titles/descriptions
- SEO structure requirements
- CTA constraints
- Banned phrases
- Workflow rules (submission conventions, what counts as done)

Layer B — Client-Specific Rules (selected client only)
- Brand voice requirements
- Language constraints (e.g., DE tone, no slang)
- Design do/don’t rules from past feedback
- Compliance constraints and sensitive-topic rules
- Known “pet peeves”

Invariant:
- Client rules may **tighten** constraints, but must not **override** global rules.
- If a client rule conflicts with a global rule, the stricter interpretation wins.
  - If ambiguity remains, clarification mode must trigger.

---

## Rule Selection Matrix (Deterministic)

Rules must be loaded based on exactly:

- Client (required)
- Task Type (required)
- Global Rules (always)

The tool must explicitly confirm:
- Selected client
- Selected task type
- Rule sources applied (global + client + task)

No hidden context. No implicit defaults that change silently.

---

## Contractor Workflow (User Journey)

1. Contractor opens Fruitful Control
2. Selects **Client**
3. Selects **Task Type** (Title / Description / Design QA)
4. Inputs work:
    - Paste titles/descriptions, OR
    - Provide design reference/input per V1 design QA flow
5. Submit for QA

Tool returns:
- Verdict (ready / needs revision)
- Hard issues (must fix)
- Soft improvements (optional)
- Suggested changes (bounded)
- Optional clarification prompt (single question)

Contractor revises and resubmits until “Ready to Deliver.”

---

## Output Contract (Structured Response) — Updated

Fruitful Control must return:

```ts
{
    verdict: "ready" | "needs_revision",
        qa_score: number, // integer 0..10
        score_breakdown: Array<{
        rule_id: string,
        severity: "S1" | "S2" | "S3" | "soft",
        deduction: number,
        note: string
    }>,
        hard_issues: string[],
        soft_improvements: string[],
        suggested_changes?: string[],
        clarification_needed?: {
            reason: string,
            proposed_question: string
        }
}
```

Rules:
- `hard_issues` block delivery
- `soft_improvements` do not block delivery
- `suggested_changes` must remain within the loaded rules
- `clarification_needed` must include only one question
- `qa_score` must be an integer 0–10
- `score_breakdown` must sum to (10 - raw_score) before rounding
- `rule_id` must point to a stable identifier in the rules store (global/client/task)
- `hard_issues` and `soft_improvements` must align with the breakdown items

No essays. No unstructured output.

---

## Clarification Mode (Single-Question Rule)

Clarification mode triggers only when:
- Rules are missing, conflicting, or insufficient to judge compliance

Allowed behavior:
- Ask **one** clean, decision-blocking question
- Phrase it as a Susy-ready question (not a brainstorming prompt)

Forbidden behavior:
- Asking multiple questions
- Asking preference/subjective questions
- Guessing and proceeding anyway

Invariant:
- Ambiguity pauses delivery; it does not license invention.

---

## Design QA (V1) — With Image Analysis

Design QA in V1 includes **image analysis support** to validate contractor designs against deterministic rules.

Inputs (V1):
- A design image (PNG/JPG/WebP) for the pin creative
- Associated metadata (required):
    - Client
    - Target URL (optional, if relevant to checks)
    - Language (optional, if relevant to text checks)
    - Declared template name/id (if templates exist)

Allowed image-based checks (must be rules-backed):
- Brand compliance:
    - Allowed/disallowed colors (palette constraints when specified)
    - Font constraints (only if the client rule set defines acceptable fonts)
    - Logo presence/placement rules (if specified)
- Layout compliance:
    - Margin/padding safe zones (if global standards define them)
    - Text area constraints (avoid edge bleed; minimum padding)
    - Alignment rules (if specified as hard rules)
- Content constraints (when detectable and specified):
    - Presence of required elements (e.g., CTA block, title block)
    - Absence of banned elements/phrases (if specified)
- Legibility heuristics (only if specified):
    - Minimum font size rules cannot be inferred; must be implemented as a proxy rule (e.g., text occupies X% of height), explicitly documented

Hard constraints:
- No subjective art direction
- No trend or aesthetic opinions
- No “make it prettier” feedback
- All checks must map to explicit rule statements (global or client)

Deferred unless explicitly added later:
- Automated OCR-based keyword extraction unless required for enforcing banned words/phrases
- “Template matching” beyond declared template id, unless templates include machine-checkable constraints

---

## Rating System (0–10) — Deterministic QA Score

Fruitful Control must output a numeric **qa_score** from 0 to 10 based on the same criteria used for QA.

Principles:
- Deterministic: same input + same rules → same score
- Explainable: score must be decomposable into component deductions
- Coupled to verdict:
    - `verdict: "ready"` requires `qa_score >= READY_THRESHOLD`
    - `verdict: "needs_revision"` otherwise

Recommended defaults (can be adjusted per tool config, but must be explicit):
- READY_THRESHOLD = 8

Scoring model (V1):
- Start from 10.0
- Apply deductions for rule violations
    - Hard issue: -1.0 to -3.0 depending on severity class
    - Soft improvement: -0.2 to -0.5
- Floor at 0.0, then round to nearest integer for reporting (0–10)

Severity classes (must be rule-backed and stable):
- S1 Critical (blocks delivery): -3.0
    - Examples: wrong client brand kit, banned claim/compliance violation, missing required element, unreadable text (if specified)
- S2 Major (blocks delivery): -2.0
    - Examples: margin/safe-zone violation, incorrect language/tone constraint violation, wrong template requirement
- S3 Minor (blocks delivery if repeated or combined): -1.0
    - Examples: formatting rule miss, CTA mismatch, minor layout misalignment defined as hard rule
- Soft: -0.2 to -0.5
    - Examples: optional improvements allowed by spec

Invariant:
- Hard issues must always drive `needs_revision` even if the score happens to remain high.
- Score is informative; verdict is authoritative.

## Rules Storage Requirements (Editable Without Code)

Rules must be stored in a format that is:
- Editable without engineering
- Versionable
- Auditable
- Deterministic to load

Acceptable storage forms (pick one for V1):
- Structured Markdown
- JSON documents
- Database records (with an admin-facing editor later)
- Notion/CMS only if mirrored deterministically into a controlled store

Rules must be separated into distinct artifacts:
- Global rules
- Client profiles
- Task rules (titles vs descriptions vs design QA)

---

## Determinism & Auditability Requirements

Fruitful Control must be deterministic in evaluation:
- Same inputs + same rules → same verdict and issue list

Evaluation must be explainable:
- Issues must map to specific rule constraints
- No “mysterious” failures

The system must never:
- Invent missing rules
- Smooth over ambiguity
- Backfill intent

---

## Analytics & Observability (System-Level Contract)

Fruitful Control must emit canonical events only:

- `tool_view`
- `tool_start`
- `cta_click`

Fruitful Control V1 does not include a lead capture gate by default.  
Therefore `lead_submit` MUST NOT fire unless a future spec explicitly adds lead capture to this tool.

Rules:
- Must use the existing GTM/dataLayer pipeline
- Must not introduce new event names without updating Appendix B
- Payload shape must remain flat and stable (Appendix B)

QA verdict observability:
- Verdicts should be captured via **optional state snapshots** (Appendix E) OR
- via an Appendix B update *only if explicitly adopted*

Canonical event payload shape must not be modified.

---

## System Integration Points (What Must Connect)

Fruitful Control V1 must integrate with:

- Contractor access enforcement (middleware/server-side)
- Auth identity reads (trusted server helper, not client inference)
- Rules storage + loader (global/client/task)
- LLM execution pathway (rule evaluation + structured output)
- Existing analytics emission helper (`window.dataLayer` via the repo’s GTM utility)
- Audit documentation (`docs/SYSTEM_IMPLEMENTATION_AUDIT.md` updated for reality)

No contractor account creation flow is required (handled by existing backend script).

---

## Acceptance Criteria (Release Gate Checklist)

Release is blocked unless all are true:

- [ ] Route is contractor-namespaced and protected server-side
- [ ] Client selection is required and explicit
- [ ] Task selection is required and explicit
- [ ] Global + client + task rules are loaded deterministically
- [ ] Output conforms to the structured response contract every time
- [ ] Hard vs soft issues are enforced correctly
- [ ] Clarification mode asks only one Susy-ready question
- [ ] Tool does not generate strategy or expand scope
- [ ] Canonical analytics events are observable via `window.dataLayer`
- [ ] Design QA accepts an image input and runs rules-backed checks
- [ ] Image-based findings map to explicit rule ids (no vibes)
- [ ] Tool returns `qa_score` 0–10 on every run
- [ ] Tool returns `score_breakdown` with rule ids + deductions
- [ ] Verdict is consistent with score thresholds AND hard-issue blocking
- [ ] All prior V1 acceptance criteria remain satisfied
- [ ] `docs/SYSTEM_IMPLEMENTATION_AUDIT.md` reflects the true implementation

If any item fails, V1 is not shippable.

---

## Future Extensions (Explicitly Out of Scope)

These require a new spec lock:

- Expanded image analysis beyond rules-backed checks
- Subjective design critique or aesthetic scoring
- Template auto-detection without declared template metadata
- Keyword research assistance
- Strategy suggestions or targeting recommendations
- Multi-question clarification conversations
- Automated approval routing or escalation
- Internal analytics visibility for contractors

---

## Invariant Summary (Non-Negotiable)

Fruitful Control V1 must always be:

- Deterministic
- Auditable
- Rules-bound (global + client + task)
- Scope-contained (QA + bounded suggestions only)
- Fail-closed on ambiguity
- Observable via existing analytics primitives

If it becomes “too helpful,” it has failed V1.
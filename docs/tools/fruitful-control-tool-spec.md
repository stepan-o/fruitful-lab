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

Fruitful Control V1 supports only:

Task Types:
- Pin Titles
- Pin Descriptions
- Pin Design QA (checklist-based)

Capabilities:
- Load rules (global + client + task)
- Evaluate compliance (QA)
- Return structured feedback
- Provide bounded suggested corrections
- Clarification mode with a single clean question

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

## Output Contract (Structured Response)

Fruitful Control must always return a structured object with these sections:

```ts
{
  verdict: "ready" | "needs_revision",
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

## Design QA (V1 Constraints)

Design QA in V1 is checklist-based and deterministic.

Allowed checks:
- Template compliance (if templates are defined in client rules)
- Brand kit adherence (fonts/colors/layout rules where specified)
- Margin/padding/composition rules (if defined in standards)
- Banned elements/phrases (if specified)

Not allowed:
- Subjective art direction
- Trend commentary
- Aesthetic opinions (“make it prettier”)

Image analysis support is explicitly deferred unless added via a future spec.

---

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
- `lead_submit` only if explicitly included in V1 UX (otherwise omit)

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
- [ ] `docs/SYSTEM_IMPLEMENTATION_AUDIT.md` reflects the true implementation

If any item fails, V1 is not shippable.

---

## Future Extensions (Explicitly Out of Scope)

These require a new spec lock:

- Image analysis for design QA
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
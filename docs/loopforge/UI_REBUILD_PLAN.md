# Director console rebuild

8 October 2026 · scope: Loopforge first shift in `apps/lab`.

**Superseded composition:** the owner rejected this revision as a styled webpage
rather than a coherent game interface. The technical evidence below remains a
baseline; the visual gate is not cleared. The next pass starts with
[interface responsibilities and reference study](INTERFACE_JOB_STUDY.md), then
full-floor screen design, a separate asset pass and implementation. All six rooms
must be visible in the factory overview from turn one, with four initially sealed.

**Current material release:** all six generated directions are implemented as runtime monitor/control kits, with a menu, in-run selector and author mixer. See `UI_THEME_ASSET_SYSTEM.md` and `CONSOLE_LIGHT_FEEDBACK.md`. This comparison layer does not accept or replace the rejected overall composition. The complete six-camera wall, pen-written tapes, speaking tokens and focused interfaces remain the broader composition gate described below.

## Brief and delivery boundary

Deliver the complete first-day game interface: entry, adviser selection, briefing,
assignment approval/override, running shift, delegated actions, intervention,
permanent output allocation, debrief, records, development context and settings.
The existing deterministic engine and knowledge-filtered HTTP contract remain
the authority. A live 3D factory, later days, new currencies, repairs, LLM calls
and new progression mechanics are outside this rebuild.

The opening is the paused director's console. Its illustrated factory, instruments
and two available advisers establish the situation together. There is no welcome
page or handover gate. The first meaningful action is choosing today's adviser.

## Composition and material direction

- Persistent physical console: compact status instruments and weekly delivery at
  the top; illustrated factory context; a phase-specific command surface.
- On desktop, the main decision and its consequences fit the viewport at ordinary
  laptop sizes. The six-room camera selector remains identifiable, with Conveyor
  and Security available and four bays sealed. No tall editorial hero or wall of
  explanatory cards precedes the action.
- Adviser choice uses expressive, identity-preserving character portraits, short
  contrasting pitches and explicit output/wear tradeoffs. A chosen adviser comes
  forward into a focused intercom/comic briefing over the same factory context.
- Briefing is short labelled beats: assessment, additional context, priority,
  proposed assignments. Players can inspect the two assignments and swap them,
  with the change in delegated authority and likely objection visible.
- Operation gives the camera more space. A mechanical command deck shows the
  chosen adviser, authority and latest meaningful event. A decision takes over
  that surface without making the factory disappear. Automatic resolutions are
  visibly completed actions, never disguised as pending choices.
- Allocation is a dispatch instrument: two linked totals, tactile adjustment,
  preview, then a clearly irreversible seal. Debrief connects output and damage
  to named actions and supervisor reactions; records preserve the explanation.
- Original sim-sim metal, glass and status-plate assets establish the material
  system. Use authored portrait/control/frame art, native readable text and
  semantic controls. No generic line-icon dashboard or gradient-card substitute.
- Loopforge's soot, worn brass, green-black, cyan cognition and Stiletto crimson
  govern the image/light/sound palette. Local movement, mechanical engagement,
  restrained signal disturbance and committed-state feedback carry the juice.
- Phone composition uses the same loop with readable focused context and controls;
  allow deliberate vertical reflow rather than squeezing a desktop wall. Preserve
  quota, phase, speaker, current decision and at least 44px touch targets.

## Acceptance gates

| Gate | Required evidence before PR |
| --- | --- |
| First impression | Screenshot at 1440×900 and 390×844 reads as an authored factory console. Adviser choice, weekly quota and no assignments are immediately understandable. No entry gates. |
| Material coherence | Actual art is inspected in context. Portraits preserve LIMEN/STILETTO identity; frames, instruments, controls, normal/hover/focus/pressed/disabled states and room art belong to one scene. No contact sheets or baked labels masquerade as playable UI. |
| Choice clarity | The player can explain the two advisers' priorities, what selecting one commits, what can be overridden and where that adviser acts automatically. Information arrives when needed, not as an opening manual. |
| Complete loop | Play both advisers, a swapped assignment, own-room automatic response, another-room override, mixed output allocation and debrief. Inspect the resulting record. No fake Next day or development purchase. |
| Tangible feedback | Input responds immediately; confirmed assignments, production, strain, decisions and allocation receive coordinated visible feedback and optional sound. Effects never fabricate events, mask text or imply that an unconfirmed command succeeded. |
| Knowledge and authority | UI imports no kernel or private state. Art selection follows known room/operator/outcome. Hidden conditioning and supervisor statistics remain hidden. Counts and outcomes remain server-authoritative. |
| Responsive access | Review 320, 390, 768, 1440 and 2560 widths. No overflow or clipped primary actions. Keyboard, focus restoration, dialog dismissal, sound-off and reduced-motion operation work. |
| Performance | No per-frame React world updates or unbounded animation. Hidden/paused states stop relevant effects and audio. Measure selected image bytes, loading and production delivery; record justified media-budget exceptions and distinguish lab checks from field metrics. |
| Reliability | Required asset checks, tests and production build pass. Connection failure preserves confirmed state and exposes recovery. No unrelated app changes. |
| Review honesty | Record screenshots, exercised branches, remaining limitations and a gate assessment. Agent assessment does not substitute for the owner's eventual enjoyment judgment. |

## Plan assessment before execution

This plan addresses the previous failure by changing the composition, material
system and all daily decision surfaces together. Reusing only room pictures while
retaining the web-card layout would fail the material and first-impression gates.
Adding a 3D renderer now would not resolve those gates. The existing first-day
engine already supports the required choices, so the rebuild can be judged as a
complete playable interface without expanding mechanics to hide presentation
problems. Missing portraits/materials are explicit asset work, not deferred
placeholders in the submitted build.

## Execution checklist

- [x] Confirm isolated worktree, merged baseline and Loopforge scope.
- [x] Read current direction, engine contract and original sim-sim UI sources.
- [x] Establish the delivery plan and acceptance gates above.
- [x] Inspect current production experience and selected source artwork.
- [x] Import suitable materials; create missing character/interface art and record provenance/prompts.
- [x] Build the persistent console, instruments, cameras and immediate adviser choice.
- [x] Rebuild briefing, assignments and physical shift controls.
- [x] Rebuild running feedback, automatic-action presentation and incident decisions.
- [x] Rebuild allocation, debrief, records, development context and settings.
- [x] Complete keyboard, mobile, reduced-motion, sound and recovery behavior.
- [x] Validate both adviser trajectories and meaningful overrides against authoritative results.
- [x] Run production checks, measure delivery and capture visual evidence.
- [x] Iterate failures; write the final gate assessment and update implementation docs.
- [x] Publish a scoped PR only after the agent-controlled gates pass; verify its preview.

## Evidence and final assessment

The previous agent assessment passed its implementation checks, but the owner
subsequently rejected the interface composition and visual coherence. See
[the validation record](UI_REBUILD_VALIDATION.md) for the technical baseline and
[the new study](INTERFACE_JOB_STUDY.md) for the corrective design work.
[PR #99](https://github.com/stepan-o/fruitful-lab/pull/99) is open; the hosted
preview was exercised through a full first shift and permanent dispatch.

## Equipment and feedback update — 8 October

The owner requested all six generated themes be implemented and kept in the selector. A game start menu and in-run Settings now provide those material sets; the first gameplay action remains adviser choice. An author workbench combines implemented monitor and control families without resetting the run. These changes do not accept the prior composition or complete the broader focused-interface redesign. See `UI_THEME_ASSET_SYSTEM.md`.

The overhead console beacon is dark by default. A confirmed production batch fires green; an actual accident fires red; an attention request fires ember/amber. Sparse cyan impulses occur only after inactivity. Each performs one rotation, then extinguishes; no constant sweep or continuous alarm wash. Shared effects respect reduced motion and atmosphere settings. See `CONSOLE_LIGHT_FEEDBACK.md`.

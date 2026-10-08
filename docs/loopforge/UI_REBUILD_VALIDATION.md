# Director console — implementation and gate record

8 October 2026. Branch `codex/loopforge-director-console`, based on merged PR #96.
This record distinguishes the agent’s implementation/quality assessment from
owner enjoyment approval. The latter remains a playtest decision.

## What changed

`/stepanoskin/loopforge/play` opens in the paused console, with opening facts,
weekly delivery and unassigned advisers. There is no arrival or handover gate.
The same factory scene supports adviser choice, labelled portrait dialogue,
assignment approval/override, operation, delegated actions, director decisions,
permanent dispatch and debrief. The record foregrounds decisions and offers
routine batch receipts separately. Development is visible but sealed.

The `loopforge-console` pack contains original sim-sim metal/glass/instrument
materials and icons, new identity-preserving LIMEN/STILETTO portraits, a sliced
monitor frame and authored resting/hover/pressed controls. Text and interactions
remain native. Source inputs, hashes, exact prompts and preparation are retained
under `apps/lab/assets/sources/loopforge-console/`.

The implementation is split into `FirstShift` (run/presentation lifecycle),
`ConsoleParts` (materials, instruments, cameras) and `CommandDeck` (phase UI).
The API, deterministic kernel, worker components, public schema and game balance
are unchanged. No graphics framework, model call or new resource mechanic was
added. The author-facing engine notes now have their own stylesheet.

## Flow evidence

The browser sends explicit commands through `useRun` to
`POST /api/loopforge/first-shift`; the server replays the bounded transcript,
projects permitted facts, and returns a hash-checked snapshot/diff. The console
only presents a commitment after that response. Local development requests
returned HTTP 200; the existing authority/replay suite exercises malformed
inputs, state transitions, worker entities and reconstruction.

| Browser path | Observed result |
| --- | --- |
| LIMEN, accept placements, override Security to wave crew through | LIMEN automatically eased the conveyor at beat 12. Security paused at beat 30. 11 produced, 0 lost, condition 82 → 76. Split 5 retained / 6 delivered; final workforce 29 and quota 6/60. LIMEN explicitly objected to the clearance exception. |
| STILETTO, swap placements, accept pressure recommendation | STILETTO moved to Security and objected to the opening override. Conveyor required a director response at beat 12. Security was resolved automatically by STILETTO at beat 30. 12 produced, 0 lost, condition 82 → 73. All 12 delivered; workforce 24, quota 12/60. |
| Settings during the revised STILETTO shift | Shift remained at beat 25 while the dialog was open. Atmosphere could be disabled, sound enabled and muted; Escape closed the dialog and returned focus to Settings. |
| Dispatch | Slider/presets only changed the preview. Review showed both destinations and irreversibility; only Seal dispatch order sent the commitment. Controls were unavailable afterward. |
| Record | Named automatic actors and director overrides remained readable with causal disclosures. No hidden supervisor trait values or conditioning records were exposed. |

Final production-build browser evidence and validation totals are recorded below
before publication.

## Accessibility and rendering controls

Native buttons, inputs, disclosure summaries and a modal dialog retain keyboard
semantics. Phase headings receive focus; mobile reading position follows the
current decision rather than jumping above the camera. At phone widths, the
compact camera precedes the command deck; secondary room controls follow it.
Running playback controls move beside the camera and remain reachable.

Both effects-off and `prefers-reduced-motion` remove animations/transitions.
Hidden tabs, settings, other console screens, manual pause and connection errors
stop advancement. Hidden tabs suspend audio. Offscreen cameras pause their
scan/record animation through IntersectionObserver. Scene changes retain the
last image behind a connecting state until the replacement loads; failures offer
an image retry. No animation loop updates React every frame.

The existing sound pack is reused; no new soundtrack or recorded cue was added.
Activation, mute and lifecycle are tested here. No new listening-based timbre or
final-mix approval is claimed.

## Checks and limits

- Targeted UI tests cover immediate entry, changed assignments, event override,
  two-step dispatch and preserving confirmed facts through connection failure.
- The first full parallel suite run passed 314 tests and failed one unrelated
  timing assertion in `PinterestFitAssessment.test.tsx` (scrollIntoView had not
  been observed). No Pinterest code was changed. Serial rerun: pending result.
- Required immutable-asset tests passed. Production build: pending result.
- A standalone whole-repository `tsc --noEmit` encountered existing test-file
  typing errors in Pinterest, Sanctuary and GrowthBook. No console source error
  remained in that output. The production build is the required app type check.
- This remains one day, two supervisors and two event fixtures. Reload starts a
  new run. The broader Act 1 arcs, later rooms, live 3D and LLM admission are
  design work beyond this UI pass.

## Visual and performance evidence

Pending final production review. Do not treat this draft record as a passed gate.

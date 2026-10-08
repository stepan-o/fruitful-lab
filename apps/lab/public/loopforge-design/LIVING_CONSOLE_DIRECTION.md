# Living console: hierarchy, attention and motion

8 October 2026. Follow-up to the focused-interface rebuild. The owner accepts the improved direction, but the opening still fails to direct attention and the console feels inert. This record supersedes the earlier motion cadence; screen responsibilities and engine authority remain intact.

## Main screen owns the factory

The wall is the largest uninterrupted surface. Six physical monitors keep stable positions. Live screens carry light, texture and readable local status; unpowered screens recede, with only their tape names remaining. No persistent right-hand prose column. The camera wall, not a stack of text panels, is the visual identity.

The opening weekly leadership call occupies a cinematic full-screen surface. It announces the mandate, then returns to the factory. There is no previous-week performance report on first entry. The main wall retains only the compact quota instrument and **Choose adviser** action; tapping quota reopens the call.

**Choose adviser → inspect the roster → explicitly appoint → structured morning brief → placements.** Choice context lives on the dedicated selection screen, before commitment. Build for at least five available supervisors: stable readable roster tokens with short current pitches, plus one focused detail area. Day one has two active candidates and three unavailable channels. An author-only five-person study exercises density without inventing later simulation. Phone uses a scrollable roster strip and a focused detail region, rather than shrinking five full briefings.

After appointment, the current order takes priority: review placements, start the line, respond, dispatch. A compact adviser channel reopens their briefing. No duplicate pitches or full quota explanation on the wall. The clock states why the line is waiting. There is no repair instruction before engineering exists.

## Space and interruption contract

| Layer | Belongs here | Does not belong here |
| --- | --- | --- |
| Persistent perimeter | Day, funds, workers, condition, weekly quota; compact navigation and transport | Biographies, tutorial paragraphs, event histories |
| Largest surface | Six-camera overview; selected room can occupy a focused workspace | Four visible locked-room interiors; simultaneous full-screen art for unrelated decisions |
| Anchored overlay | Camera telemetry, one latest room receipt, incoming-channel indicator, hover/focus inspect cue | Unrelated alerts floating far from their source; text that obscures the entire scene |
| Non-blocking notice | Completed delegated action, production confirmation; persistent record link | Asking permission for an action already taken |
| Focused workspace | Adviser roster/selection, intercom, plan comparison, development, dispatch, debrief, records | A narrow universal sidebar forced to handle every job |
| Cinematic takeover | Weekly leadership call: full artwork, uneven soot framing, lower captions and facts; no console chrome | Routine monitoring; invented prior-week results |
| Modal | Consequential incident, settings, instrument context, optional guidance | Ordinary output; mandatory first-entry tutorial; stacked dialogs |

Only one consequential decision can own the foreground. Closing it preserves the pending request and paused world. Source camera remains marked. A transient effect ends; the outcome stays in counters and records. Details are available by click/touch/keyboard, never exclusively on hover.

## Motion is a vocabulary

- **Optical life:** restrained phosphor travel, small grain drift, occasional short horizontal tracking tear, CRT edge falloff and REC lamp. Stagger the two powered feeds. No full-screen shake or white flash. Off screens have reflected glass only. Cosmetic camera interference never claims an accident or fault.
- **Factory feedback:** a confirmed production receipt lights its source camera green; an attributed order receives a short receipt overlay. Known low condition increases localized conveyor interference. Never fabricate sensor values or production to animate the screen. Labels and decision text stay still.
- **Calls:** the factory’s Choose adviser command has a local attention lamp. Roster selection and detail transitions occur on their dedicated surface. The weekly call uses the separate cinematic choreography in `CINEMATIC_INTERFACE_DIRECTION.md`.
- **Beacon:** cyan idle sweep after 12 seconds without input, recurring at most every 18 seconds, with at least 6 seconds since another signal. A 2.8-second revolution leaves most time dark. Ignore pointer movement as input; clicks/keys reset quiet time. Confirmed amber/green/red impulses retain priority and never stack. Ready-to-start is also an amber attention transition. No catch-up sweep after returning from a hidden tab.
- **Interruption:** incident arrival pauses production; effects behind foreground reading surfaces pause. Camera atmosphere continues during ordinary planning wait without advancing simulation time. Hidden tabs and manual effects-off stop decorative animation.

## Reference findings and applications

These are source-informed design decisions, not a claim to have playtested these titles this turn. Reference art is not shipped.

- [Frostpunk lead designer, PlayStation Blog](https://blog.playstation.com/2019/10/10/adapting-frostpunks-complex-city-building-for-ps4-out-tomorrow/): organize complex actions around player jobs and input devices; preserve game depth. Apply by keeping distinct focused workspaces, with a strong current task on the wall.
- [Factorio developer study, Friday Facts 363](https://www.factorio.com/blog/post/fff-363): visible machine status, removal of duplicated UI, and alerts that point to their affected entities. Apply by putting receipts and state on the source camera, with Records for history.
- [Factorio display panel design, Friday Facts 419](https://www.factorio.com/blog/post/fff-419): short visible messages, expanded detail on inspection, and physical display geometry designed for legibility. Apply to compact camera readouts and whole, proportion-preserving housings.
- [Alien: Isolation creative lead interview](https://blog.playstation.com/archive/2014/03/26/behind-terror-alien-isolation-exclusive-interview): tactile imperfect technology, CRT/VHS treatment and synchronized device feedback establish a believable world. Apply optical imperfection to Loopforge's own brass/soot/cyan materials, not copied graphics or unreadable text.
- [Xbox UI context guideline 114](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/114): make location, action and expected result understandable. Apply explicit Listen versus Appoint, pause reasons and scoped next actions.
- [Xbox motion guideline 117](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/117): provide control over incidental motion. Apply existing atmosphere toggle and reduced-motion handling to all new layers.

## Implementation and performance boundary

No engine, command, hidden-state or protocol change. Receipts and publicly projected condition drive meaningful cues. Presentation timing uses CSS and a bounded beacon; no per-frame React state. Reuse current asset packs and add two original leadership/cinematic assets; no new runtime framework or model calls. Clip motion to powered glass; never animate expensive blur across the whole stage. Six-theme switching must preserve run and drafts. The future live 3D factory can replace feed content without replacing these priorities or interactions.

## Checklist and acceptance

- [x] Diagnose opening hierarchy and compare primary-source design accounts.
- [x] Record surface ownership, signal meanings and first-action hierarchy.
- [x] Implement clear adviser entry, next-order guidance and quieter sealed equipment.
- [x] Add bounded optical motion and receipt-driven room feedback.
- [x] Increase beacon cadence without continuous light or spurious alarms.
- [x] Update game-design tab, engine/UI records and current repo memory.
- [x] Verify first choice and whole shift, reduced motion/effects-off, keyboard, 320/390/768/desktop and all themes.
- [x] Run asset validation and the complete test suite; verify the production build.

Delivery gate: publish to PR #99 and verify its exact-SHA hosted preview. The PR records that result after deployment. [Local visual evidence and limits](review/living-console/README.md).

Opening review questions: can the player find Choose adviser on the wall, then understand a candidate’s tradeoff before appointing them? During a shift, can they locate the source of an outcome? Can they distinguish signal life from factory progress? Is the decision still understandable with motion and sound off? Owner comprehension/enjoyment remains the final test; no automated test can establish it.

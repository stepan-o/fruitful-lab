# UI DESIGNER · source reader

21 November 2026 · Preliminary source study, not a completed interface audit

Use this with the [role brief](/stepanoskin/loopforge/design/studio/ui-designer) and [first assignment](/stepanoskin/loopforge/design/studio/ui-first-assignment). Study current behavior first, then compare prior design intent and outside references. A source description, screenshot or passing check is evidence for a specific claim, not a substitute for playing the relevant interaction.

## Start with the current player

[Loopforge entrance](/stepanoskin/loopforge) → [current Days 1–2 player](/stepanoskin/loopforge/play). Inspect the ordinary entry and the separate Day 2 entry, settings, room inspection, crew/control selection, feedback and return paths. Record the actual build and what was reachable. Keep the standalone [Days 2–4 player](/loopforge-shifts/index.html) as a related implementation reference, not an interchangeable claim about the integrated route.

At source baseline `d883422e`, GameClient connects the menu to IntroPlayer, ProducerConsole, LeadershipCall and ShiftFloor. The source retains an older first-turn review path. A short live inspection on 21 November reached the current menu and Day 2 leadership-waiting console, which still uses six camera frames, factory counters and physical receiver/selector/lever imagery. Full runtime, mobile and accessibility review remain the first designer's work. Do not classify every older console element as obsolete merely because its design document is dated October.

- [Current interface components](https://github.com/stepan-o/fruitful-lab/tree/master/apps/lab/components/loopforge/first-shift): GameClient, ProducerConsole, LeadershipCall, ThemeSettings and the surrounding styles. Read the relevant files in bounded sections.
- [Current shift viewer and contracts](https://github.com/stepan-o/fruitful-lab/tree/master/apps/lab/lib/loopforge/shifts): inspect commands, confirmed state, selection, speech and lifecycle before proposing their UI.
- [ENGINE brief](/stepanoskin/loopforge/design/studio/engine-master) and [runtime handoff](/loopforge-shifts/ENGINE-HANDOFF.md): implementation evidence and remaining findings, with their dates preserved.
- [KVP-0001](https://github.com/stepan-o/loopforge/blob/master/docs/sim5/SOPs/KVP-0001.md) and [engine boundary](/stepanoskin/loopforge/design#engine-boundary): presentation interprets permitted state and submits intentions; it does not own world truth.

The new UI should make the causal relationship between player action and confirmed result clearer. It must not make a rejected command appear successful, expose a hidden belief as fact or conceal the reason a currently supported command is unavailable. Exact contract changes are proposals for ENGINE and SYSTEMS, not existing capabilities.

## Project vision and approved material

Read [player desires](/stepanoskin/loopforge/design#player-desires), [the intro](/stepanoskin/loopforge/design#day-one-intro), [approved floor and rehearsal](/stepanoskin/loopforge/design#floor-layout), [pixel-art plan and calibration](/stepanoskin/loopforge/design#pixel-art-plan), [supervisor × room](/stepanoskin/loopforge/design#supervisor-rooms), and the [SYSTEMS brief](/stepanoskin/loopforge/design/studio/game-systems-designer). Use current approved artwork in context; distinguish it from material still awaiting owner review.

The approved factory is a shared spatial source. Close framing can improve recognition without changing geometry. A readable speech bubble can improve presentation without rewriting dialogue or stretching the edit. Where those goals conflict, show the conflict to the owner instead of quietly changing the approved sequence.

## Useful earlier UI work

The design board already includes [Producer console](/stepanoskin/loopforge/design#producer-console), [focused console](/stepanoskin/loopforge/design#focused-console), [interface hierarchy](/stepanoskin/loopforge/design#interface-hierarchy), [UI styles](/stepanoskin/loopforge/design#ui-styles), [themes and assets](/stepanoskin/loopforge/design#themes-assets), [UI structure](/stepanoskin/loopforge/design#ui-structure) and [UI mechanics](/stepanoskin/loopforge/design#ui-mechanics). These are starting evidence, not a new mandate to reproduce every earlier proposal.

| Earlier source | Useful capacity to carry forward | What must be reconciled |
| --- | --- | --- |
| [Producer console direction](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/PRODUCER_CONSOLE_DIRECTION.md) | A credible physical instrument; dominant observation area; receiver, selector and production control have different jobs. | October console profiles, unlocks and room arrangements versus what is actually running now and what the owner has approved. |
| [Interface job study](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/INTERFACE_JOB_STUDY.md) | Choose a surface by the player's task; distinguish observation, communication and intervention. | Source study versus played evidence; speculative progression and future rooms. |
| [Focused console rebuild](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/FOCUSED_CONSOLE_REBUILD.md) and [cinematic direction](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/CINEMATIC_INTERFACE_DIRECTION.md) | Give a dedicated task its own composition and a coherent return to the console. | Earlier call/roster sequence and gates versus current Days 1–2 flow. |
| [UI theme asset system](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/UI_THEME_ASSET_SYSTEM.md) | Keep clean plates, text, counters, portraits and semantic control states separable. | Which themes, assets and settings remain useful in the pixel-art direction; do not expand the number of skins by default. |

The former Munder studio is closed. Its art, modules and [published retrospectives](/loopforge-dev-blog/retrospectives/2026-10-25-second-retrospective/index.html) may explain existing choices and production failures. Use their durable outputs without reviving their scheduling or reconstructing their chats.

## Marvel Rivals: study the design decisions

This is the owner's central external UI reference. Start with the [existing Sanctuary Economics comparison](/stepanoskin/game-monetization?chapter=marvel-rivals), especially its distinction between a gallery, a searchable roster and a time-sensitive selection screen. It contains credited visual sources and an official Art Vision player. Treat that chapter's interpretations as arguments to evaluate, not proof of designer intent or measured usability.

Use the developers' [Art Vision Vol. 01](https://www.marvelrivals.com/devdiaries/20250421/40954_1228989.html) and [official video](https://www.youtube.com/watch?v=JaNAqe180Hc) as primary material. The official page introduces the visual team's design process. This onboarding study verified that source and inspected the existing chapter's analysis; it does not claim a fresh frame-by-frame viewing of the video. The designer should inspect the relevant sequences and cite timestamps for motion claims.

| Study question | Loopforge translation to explore | Countercheck |
| --- | --- | --- |
| How does the subject remain prominent while controls remain findable? | Let the active room, selected worker or supervisor dominate the task's composition. | Does visual spectacle push the next useful control out of view on a phone? |
| Why do different selection contexts use different arrangements? | A camera overview, worker assignment and supervisor inspection need not share one panel template. | Does changing composition preserve selection, return context and learned controls? |
| How do type, silhouettes, color and spacing establish hierarchy? | Develop a recognisable Loopforge interface vocabulary around the console and room layers. | Can the player still distinguish urgency, selection and availability without relying on color alone? |
| What do transitions explain about entering and leaving a task? | Propose purposeful focus and return motion, with complete static/reduced-motion states. | Does the transition delay a decision, obscure dialogue or change simulation timing? |

A screenshot cannot demonstrate task speed or touch usability. Do not infer that a design is better merely because it resembles the reference. Preserve credited study images as references; use original or cleared assets for Loopforge's product.

## Designing Games: verified applications

Tynan Sylvester, Designing Games (2013), **chapter 9, Interface**. Printed page numbers below refer to the owner's copy; PDF numbers are one-based viewer pages. The cited passages were read during onboarding preparation. The PDF remains local under the shared instructions.

| Passage | Application to this commission | How to judge it |
| --- | --- | --- |
| Metaphor, printed pp. 220–221 / PDF pp. 228–229 | The console's physical forms can teach interaction, but their purpose must remain discoverable. Give the receiver, camera and room pin distinct jobs and readable affordances. | In annotated studies, explain what tells a new player where to act; later verify click/touch and keyboard behavior in the live build. |
| Signal and Noise, printed pp. 225–226 / PDF pp. 233–234 | Industrial texture and CCTV effects should enrich the room without competing with a face, credential, speech or actionable object. | Compare the same crowded room/state at actual desktop and phone sizes. Mark what becomes hard to read. |
| Visual Hierarchy, printed pp. 227–229 / PDF pp. 235–237 | Rank competing information by the current player job; making every control brighter destroys that ordering. | Number the intended attention order and explain it for both device compositions, including an urgent-event state. |
| Redundancy, opening on printed p. 230 / PDF p. 238 | Avoid forcing every event into an interruption. Explore recoverable console records and restrained local signals where the rules permit them. | Show the alert, the dismissed/missed state and the recovery path without changing the approved pacing or granting extra knowledge. |

These are proposed applications, not measured improvements. Read chapter 9 in full and any other relevant passages before the interview. Whenever a book concept changes a decision, cite its verified location, the concrete application, its limits and the expected evidence. Do not attach the book to the public package.

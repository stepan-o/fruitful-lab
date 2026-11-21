# UI DESIGNER

## Current Day 2 design handoff

UI DESIGNER owns the complete Day 2 interface design. The Operator starts at a physical desk with a ringing receiver and two powered room monitors. On entering either room, the factory floor extends to every edge of the screen. Camera identity, dialogue, event markers, station actions and the shift clock appear over the floor. The missing-ID event opens the approved full-screen E1 painting. This direction supersedes framed full-screen camera studies. Runtime implementation ownership remains open.

[Start at the Operator’s console](/loopforge-design/day-two-ui/index.html) · [Compare all 59 desktop and phone pairs](/loopforge-design/day-two-ui/board.html) · [Two loaded Conveyor stations](/loopforge-design/day-two-ui/index.html#ready)

Review both supervisor bids, the pass and custody outcomes, staffing and clearance orders, and the final shift register. The drawings use the guided gameplay replay. The artwork, overlay composition and navigation are submitted for owner review.

Commissioned 21 November 2026 · Owner-directed Codex studio

Read the [shared studio instructions](/stepanoskin/loopforge/design/studio), [UI source reader](/stepanoskin/loopforge/design/studio/ui-reading) and [first assignment](/stepanoskin/loopforge/design/studio/ui-first-assignment). The owner opens the chat and reviews its delivery. Follow Onboard → Interview → approved Plan → Build → owner Review. This role begins with an audit and visual proposals; runtime implementation ownership will be decided later.

## Mandate

Make the player interface feel native to Loopforge's world. Lead with visual identity and immersion, supported by clear information, readable action and responsive controls. Own the interface's proposed composition, navigation, hierarchy, interaction language and device adaptations. Treat each screen as a place where the player does a particular job, rather than a reusable dashboard decorated with factory textures.

Maintain the UI design account and this brief so later chats can build on accepted decisions. An approved static study is a design decision, not proof that the integrated game works. Final playable and visual acceptance belongs to the owner.

## Direction already settled by the owner

- The HUD is the **Producer console**, looking into the factory through **CCTV-style room views**. Most game events happen in the animated rooms.
- Pins and popups belong either to **the console** or to **the observed room**. Either can open a dedicated interface. These are two information and interaction layers; they are not the interchangeable 2D and 3D skins.
- **Marvel Rivals is a primary UI reference.** Study its strong composition, character emphasis, visual hierarchy and transitions between different player jobs. Translate the principles into Loopforge's industrial fiction; do not copy its branded assets or impose its shooter-specific controls.
- You may rethink navigation, screen composition and interactions substantially. Preserve approved factory geometry, scene timing and game mechanics. Surface any proposal that would require changing them as a separate owner decision.
- First delivery: **annotated audit and static visual studies of key screens and states**. A clickable prototype or production UI implementation is not part of this commission.
- **Desktop and phone receive equal design attention from the start.** Phone compositions must perform the same meaningful jobs, not simply shrink the desktop console.

Do not interview the owner again on these settled points. After studying, ask only questions that materially change the design, one at a time with suggested answers.

## Two places for information

| Layer | What belongs here | How it opens up |
| --- | --- | --- |
| Producer console | Factory-wide facts, camera selection, communications, navigation and controls the Producer can legitimately use. | Open the appropriate workspace with a clear return to the previous camera and selection. Distinguish actionable controls from instruments. |
| Observed factory room | Visible actors, equipment, local speech, selection markers and context attached to a physical event or object. | An anchored pin can open inspection or a focused task. Preserve its subject, location and relationship to the live room. |

For every proposed pin or popup, identify its layer, subject, trigger, priority, lifetime and dismissal; whether it follows a moving actor; what camera changes do to it; and whether opening it affects time. Retain current time behavior unless the owner accepts a change. Resolve overlaps and touch targets without covering the action the player needs to see. A console notification must not imply that every worker heard the event.

Dedicated interfaces need a clear job, entry and return. Avoid both extremes: placing all controls over the room and requiring a modal interruption for every event. Keep urgent information distinguishable from routine chatter and keep missed information recoverable where the game permits it.

## Boundaries and collaborators

| Partner | Working agreement |
| --- | --- |
| OWNER / PRODUCER | Owner chooses creative direction, scope, iteration and ship decisions. PRODUCER coordinates dependencies and prepares prompts; the owner starts chats. |
| ENGINE MASTER | Owns simulation, mechanics, legal commands, integration and performance. UI consumes permitted observations and proposes commands; a tap or animation cannot invent a confirmed outcome. Implementation responsibility remains open. |
| GAME SYSTEMS DESIGNER | Defines what choices and information mean, including costs, availability and uncertainty. UI makes those meanings legible without inventing new knowledge or controls. |
| ART DIRECTOR / 2D ARTIST | Own world-art coherence and commissioned assets. Coordinate framing, icons, plates, portraits and sprite readability; reuse approved work before requesting new generation. |
| LEVEL / WRITER | Preserve the approved map, trajectories, spoken beats and reading time. Camera framing and text treatment serve that performance. |
| MUSIC DIRECTOR | Coordinate attention, menu identity, cues and audio settings. Do not duplicate audio state, trigger competing playback or expose hidden events through interface sound. |

Preserve KVP-0001 and the frontend-agnostic simulation boundary: TypeScript now, explicit Rust migration later. The same game can support a pixel-art or 3D presentation. Keep the semantic interaction contract separate from either renderer. BDI beliefs and hidden intentions are not automatically player-visible facts. Proposals must distinguish selected, requested, pending, confirmed, unavailable and rejected actions.

## Quality and commercial use

Design paired desktop/phone compositions with readable text, visible focus, touch-friendly targets, clear status and no hover-only information. The repository standard asks for checks at 320, 390 and 768 CSS pixels, at least 44 × 44 CSS-pixel activation areas, keyboard operation and usable reduced-motion/sound-off states. An illustrated static study can specify these states; it cannot claim their runtime behavior has passed.

Treat texture, scanlines, glow, motion and sound as an attention budget. They must preserve room visibility and the meaning of feedback. Propose motion and loading budgets with ENGINE before implementation; do not add a new UI framework just to make mock-ups. Follow the [visual and performance standards](https://github.com/stepan-o/fruitful-lab/blob/master/docs/DESIGN_AND_PERFORMANCE_STANDARDS.md).

Loopforge is intended to be a sellable product. Record sources, licenses, attribution and permitted embedding/redistribution for proposed fonts, icons, artwork and dependencies. Reference screenshots are study material, not runtime assets. Coordinate asset clearance with ART and the whole-product register with PRODUCER. Do not spend on tools or generation without an authorized budget.

## Current handoff

**21 November 2026 · onboarding package, before the designer's audit.** This brief, source reader and first assignment record the owner's interview decisions. They do not establish a new accepted UI design, an implemented interface or a usability/performance pass.

Source baseline: Fruitful Lab master `d883422e` after Music Director PR #181. A brief live inspection confirmed the public landing, First shift menu and the alternate Day 2 entry into the six-camera Producer console awaiting leadership. This was not a complete playthrough or phone audit. The current game reuses older console artwork and controls; their historical origin does not make them absent from the live build. The publication was reconciled with master `0b50b2a8`, preserving the newly merged Music engine proposal from PR #183. Recheck the current deployment and recent work before auditing.

**Owner interview, 21 November 2026.** Start with the Day 2 Conveyor under LIMEN. At Forge, max waiting beside the press should draw the eye first. The player presses Clear at Forge, follows LIMEN’s call and sees max work the treadle once the call reaches him. Use this sequence on desktop and phone. The owner chose a wide CCTV shot with a player-controlled close-up. In the Forge close-up a small overview keeps Intake’s position and readiness visible. The player chooses when to pull back. See the [first-assignment interview](/stepanoskin/loopforge/design/studio/ui-first-assignment).

The owner chose a worn, bolted console with bold graphics on the glass. Keep the Forge label and selection outline at the edges so max’s face, foot and treadle stay visible on desktop and phone.

**Deciding review test.** With study annotations hidden, the owner should be able to read the exchange in three stills on either device. Max waits for clearance, LIMEN calls while the press stays raised, then max works the treadle after receiving the call. The owner approved the execution plan. The [Forge study](/loopforge-design/forge-study/index.html) opens on clean desktop and phone plates. Compare the three close-ups, then reveal the annotations and the [source-matched audit](/loopforge-design/forge-study/index.html#audit). Owner review of the exchange remains open.

**Wide-view review, 21 November 2026.** The owner reported that the desktop camera feels like the game screen surrounded by placeholder bars. In the first wide still it is difficult to associate the station strip with the machines or distinguish who is waiting from which stations hold ready loads. The [Forge wide-shot references](/stepanoskin/loopforge/design/studio/ui-reading#reading-the-forge-wide-shot) connect the review to game developer accounts, industrial desks and human-factors research. Directly aligned station keys and an engraved Conveyor diagram are candidate compositions for owner review. The visual choice remains open.

**Owner direction for the core loop, 21 November 2026.** UI DESIGNER may replace earlier interface proposals, including the station strip and the proposed engraved desk. Begin the composition inside each room. Security stages a supervised checkpoint with a specific Day 2 pass decision. Conveyor is the supervisor’s minigame, played on the factory floor while dialogue appears at its speakers. Camera navigation, including the chosen wide view and optional close-up, serves those jobs. Preserve the approved rules, room geometry, dialogue and timing. The next proposed study is the LIMEN wide shot with two simultaneously ready stations and floor speech. The [room reading and review criteria](/stepanoskin/loopforge/design/studio/ui-reading#security-and-conveyor-as-player-views) also cover STILETTO and Security. New compositions remain open for owner review.

**Security event direction, 21 November 2026.** The owner defined Security as a room for watching dialogue with occasional Producer interventions. Highlight significant events at the person, desk or gate where they happen. The player can expand a highlight into a dedicated event view or a compact modal. Reading an event and spending an intervention are separate actions. The first case is bob at LIMEN’s desk: watch the missing-ID exchange, inspect the case if desired, and issue the day pass when available. Return to the same camera and show the actual outcome on the floor. The choice of presentation for each event remains a design decision. See the [room reading](/stepanoskin/loopforge/design/studio/ui-reading#security-and-conveyor-as-player-views).

The owner named the original *Frostpunk* as an event reference. The [missing-ID event study](/stepanoskin/loopforge/design/studio/ui-reading#frostpunk-and-the-missing-id-event) traces everyday remarks, city event markers, petitions and consequences. A dedicated composition featuring bob, LIMEN and the held queue is the designer’s recommendation for testing that sequence on desktop and phone.

**Illustrated event screens, owner direction · 21 November 2026.** An event opened from the floor may use a dedicated screen with commissioned concept art, following the weekly quota call. ART DIRECTOR owns the illustration. UI DESIGNER owns the screen composition and commissions needed artwork. The game supplies the incident, action availability and outcome. The first [art commission for bob at Security](/stepanoskin/loopforge/design/studio/ui-first-assignment#art-commission-for-bob-at-security) covers the missing-ID decision before a pass exists. The owner approved **E1 · The held line** on 21 November 2026. [ART’s return handoff](https://github.com/stepan-o/fruitful-lab/blob/codex/art-missing-id-bob/docs/loopforge/production/missing-id-bob/held-line-r1/UI-DESIGNER.md) supplies the clean desktop and phone paintings, measured guides and case sequence. The [assembled event study](/loopforge-design/security-event/index.html) opens on the held desk. Inspect bob’s case, return without issuing, or issue the day pass and watch jo advance. “Study views” also includes the expired case. The native E1 portrait is used on phones. Owner acceptance of the interface and ENGINE integration are pending.

**Owner correction to the assembled Security study, 21 November 2026.** The opened painting fills the viewport. The watch view looks through the Producer’s CCTV hardware. The earlier inset painting, text column and floating alert are superseded. The revised [Security study](/loopforge-design/security-event/index.html) uses the existing Foundry monitor housing, the Producer’s Security channel (CAM 02), and a bracket positioned from bob’s observed coordinates. Inspection keeps the channel identifier while the hardware gives way to the landscape or portrait painting. The pass decision occupies the lower edge and the desk transcript opens on demand. Review the marker, the hand and the gate at both [phone sizes](/loopforge-design/security-event/phones.html). The new composition awaits owner review.

## Delivery and continuity

Publish the agreed audit and studies through the game-design page in a scoped PR and verified preview. Update this handoff with source/build, approved decisions, observed versus proposed changes, phone and desktop evidence, remaining questions and the next implementable task. Preserve historical studies and frozen retrospectives as dated references. Keep authored source and generated pages synchronized; save compact checkpoints so a replacement chat can resume without reading prior chats.

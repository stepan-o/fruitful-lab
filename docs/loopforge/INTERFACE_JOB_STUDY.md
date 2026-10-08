# How Loopforge should divide interface responsibilities

8 October 2026. Reference study and design implications for the next first-turn rebuild.

The owner rejected PR #99's composition and visual coherence. Its technical checks remain useful, but its visual gate is not cleared. The next design must accommodate the complete first factory floor, then present its first-turn state. Six rooms remain visible in the overview from entry; four begin sealed. The owner's current pacing target is to unlock all six within roughly 10–20 minutes of play, through mastery rather than elapsed-time gates.

The central finding is that **the player needs one recognizable factory, with several interfaces organized around different jobs**. A persistent frame does not require a persistent two-column layout. A conversation, a placement comparison and an accident decision need different compositions.

Owner clarification, 8 October: the six positions are camera monitors. A locked room has a powered-off, empty glass screen with restrained reflected glare; its interior is not visible, even dimmed. Only its name remains visible on a worn, pen-written adhesive tape label. Do not add padlocks, explanatory badges or a preview of the room. The console must feel like detailed physical equipment from Loopforge. See `CAMERA_CONSOLE_ART_DIRECTION.md` for the source study, palette, asset sequence and acceptance gates.

## Reference study

These observations come from the linked screenshots and developer accounts. They establish screen composition and stated design intent; they do not constitute a playthrough or measured interaction timings. Reference artwork is studied, not imported into Loopforge.

### Frostpunk separates the city, a workplace and a policy decision

The [coal-mine screen](https://interfaceingame.com/screenshots/frostpunk-coal-mine/) leaves the city and global instruments visible. Selecting one workplace exposes its operating information and staffing controls in a contextual panel. The [Book of Laws](https://interfaceingame.com/screenshots/frostpunk-book-of-laws/) replaces that local operational composition with a relationship map. The [convoy decision](https://images.gamewatcher.com/image/file/3/9e/92323/20180429020331_1.jpg) gives an illustrated situation and its choices the foreground while the world recedes. [Ambient dialogue](https://interfaceingame.com/screenshots/frostpunk-dialogue/) is smaller and leaves city activity readable.

The [lead designer's console account](https://blog.playstation.com/2019/10/10/adapting-frostpunks-complex-city-building-for-ps4-out-tomorrow/) describes reorganizing actions and navigation for the input device, including functional building groups and contextual shortcuts, while retaining game complexity.

**Loopforge implication:** distinguish a room's routine inspection, a long-term commitment and an urgent decision. Each deserves a different amount of attention and space. Phone design should preserve these jobs through recomposition, not shrink the desktop layout. Do not copy Frostpunk's circular geometry: its generator supports that geometry; Loopforge's production chain suggests another arrangement.

### XCOM 2 separates orientation, a facility's work and its human aftermath

[Hannah Montgomery's design account](https://jamuidesign.com/xcom-2/) connects the Avenger overview to room-specific views with a consistent control layout. A shortcut menu also provides direct room access. The [overview image](https://jamuidesign.com/xcom-2/avengersideview/) retains the base's spatial arrangement and unfinished spaces. The [staffing image](https://jamuidesign.com/xcom-2/avengerstaffing/) shows one facility, its people and its local controls.

The [after-action screen](https://jamuidesign.com/xcom-2/avengerpostmission/) presents the returning characters with individual result labels. Montgomery explains that this replaced a more spreadsheet-like result presentation to strengthen attachment to the people and their condition.

**Loopforge implication:** the six-camera wall can establish a durable spatial memory without also containing the full briefing or every repair/project control. A room can fill the viewport when it becomes the subject. The day's ending should connect totals to the supervisors and workers affected, using only known outcomes. The same character identity should survive selection, assignment, intervention and recap.

### IXION separates immediate operations, capability planning and remote decisions

The [published technology screenshot](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1113120/ss_ac7de417babf56f6d68a85a380c5ba714c70cd78.1920x1080.jpg?t=1733140180) dedicates the center to a capability map. A selected technology owns the detail panel, while current research, resources and time occupy compact peripheral positions. The [expedition screenshot](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1113120/ss_5d9f0e595f6874d6237fcd28fa69b2c5549ed8f0.1920x1080.jpg?t=1733140180) instead foregrounds a scene, an attributed transmission, a ship and alternatives with durations. Both are in the [publisher's Steam gallery](https://store.steampowered.com/app/1113120/IXION/).

**Loopforge implication:** Development should explain dependencies and competing commitments; it should not compete with the operating wall for permanent space. An incident should identify who reported it, the affected room and the proposed response. A reported interpretation must remain visibly different from a confirmed production total. Borrow the attribution and separation, not the length of IXION's report prose or its research currency.

### Lobotomy Corporation separates preparation, surveillance and conversation

Its published [preparation screen](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/568220/ss_7f8118a7b224505b397f481e8187fb647a3a42c6.1920x1080.jpg?t=1636694188) groups people with departments and gives the selected employee a separate detail area. The [operating screen](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/568220/ss_71db0d954dcec5585f201a781db6dac2df041b85.1920x1080.jpg?t=1636694188) emphasizes the facility, local activity and compact global controls. The [conversation screen](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/568220/ss_54183ee9d7dc3d125df090c2fb69bc32c8bc50bc.1920x1080.jpg?t=1636694188) gives the speaker, speech and responses their own composition. The [developer description](https://store.steampowered.com/app/568220/Lobotomy_Corporation__Monster_Management_Simulation/) explicitly distinguishes management and story portions.

**Loopforge implication:** preparation and observation can concern the same rooms while using different information density. A supervisor conversation can become a proper dramatic scene. However, Loopforge's conversation must produce an actionable operating plan; it cannot become a detached story interlude. Its hidden psychological state should not inherit this reference's visible character statistics.

## What the earlier Loopforge already understood

Original sources in the Loopforge repository:

- `docs/sim_sim/sim_sim_ui_spec_v1.md`: six CCTV feeds, supervisor tokens, one primary phase action, incident spotlight, allocation bay and comic recap.
- `docs/sim_sim/sim_sim_ux_spec_v1.md`: compact operational signals, selected detail, meaningful commitment and a distinction between major interruptions and routine reports.

Keep those responsibilities and their physical interaction language. Do not restore obsolete mechanics: visible confidence/loyalty gauges, player-selected doctrine, station staffing, sell/convert/upgrade settlement, arbitrary swap budgets, day-based unlocks or permanently sealed Cortex. The current adviser, knowledge and quota rules take precedence.

## Choose a surface by the player's job

| Player's question | Information needed together | Appropriate surface | What stays outside it |
| --- | --- | --- | --- |
| Where does my attention belong? | All rooms, current activity, operator, actionable exceptions | Factory overview | Detailed biographies, full event prose, project catalog |
| What is happening here? | One room's scene, known condition, operator, relevant report and available action | Room focus / inspector | Unrelated room controls |
| Whose judgment should I trust today? | Available supervisors, brief pitches, known recent behaviour and distinct priorities | Adviser selection | Placement editing before the adviser proposes it |
| What is this adviser asking me to authorize? | Their assessment, attributed claims, priority and proposed assignments | Briefing, then plan comparison | Hidden true motives; a player priority picker |
| How should I change that plan? | All affected rooms and people, recommendation versus proposed override, authority changes | Planning mode | Continuous event prose and a second mandatory round of advice |
| What must I decide now? | Situation, source, adviser recommendation, alternatives and known stakes | Incident foreground | Routine notifications and unrelated navigation tasks |
| What can this factory become? | Capability dependencies, readiness, costs, specialist time and committed projects | Development workspace | Per-second production monitoring |
| Where does today's output go? | Available completed units, retention, weekly delivery and resulting totals | Dispatch workspace | Unrelated development shopping |
| What did my decisions do? | Material results, named actions, known reactions and unresolved matters | Debrief; optional record inspection | An omniscient explanation of concealed state |

These are responsibilities, not nine permanent navigation tabs. Factory, Development and Records are durable destinations. Room focus, adviser conversation, planning and settlement are focused interfaces reached through the relevant object or phase. An incident is an interruption that returns to the previous context.

## Systems and feedback the complete first floor needs

| System | Glance-level signal | Focused explanation or action | Lasting feedback |
| --- | --- | --- | --- |
| Weekly obligation | Delivered / required, deadline, today's unallocated output | Quota instrument opens obligation detail; dispatch commits the split | Delivered robots cannot be reclaimed; remaining requirement stays visible |
| Money and workforce | Funds; basic workers, later smart workers | Known availability, allocation and relevant investment | Confirmed cost/capacity changes; no invented daily repair charge |
| Production chain | Six room locations, operating/blocked/sealed state and current operator | Room focus explains the known bottleneck; planning compares placements | Output and condition changes identify the responsible work |
| Adviser authority | Chosen portrait and an authority mark on their assigned room | Briefing, recommendation and plan override | Automatic actions are attributed; challenges receive character feedback |
| Wear and accidents | Local warning, visible condition and durable incident marker | Relevant operational response; engineering appears with Witch | Damage, losses, downtime and remembered treatment persist |
| Worker and supervisor stress | Only permitted behaviour, barks, reports and operational symptoms in Act 1 | Attributed account and available intervention; Thrum's relief has a production cost | Later behaviour and records, without secretly exposing hidden numeric state |
| Rumours and disclosure | A sourced report/claim token attached to a person or incident | Known account, audience and available disclosure response | Who heard what, known disagreements and consequences; no truth meter |
| Relationships and initiative | Observed objection, support, refusal or changed pitch | Person/incident context and the director's permitted response | Reactions connected to decisions; full BDI remains a development trace |
| Progressive capability | Sealed rooms remain on the wall; current project status | Development explains discoverable requirements and commissioning | A confirmed unlock activates the same room location and new local controls |
| Brain projects and succession | Known project progress or attributed allegation when discovered | Project or incident interface, depending on the decision | Commitments carry forward; replacement purposes do not leak at entry |

Revealed complexity and simulation complexity are separate. Keeping a hidden system off the HUD does not remove its state, history or deterministic consequences. Conversely, building a decorative meter does not justify inventing a new mechanic.

## Proposed structure to test before asset production

**Stable frame:** compact day/clock, weekly quota, funds/workforce, adviser identity, current pause reason and restrained navigation. Global instruments are available from every workspace; not every value needs to be expanded during a foreground decision. No editorial header or footer consumes the playfield.

**Factory overview:** a stable six-camera composition. Each feed owns its room identity, an empty or occupied supervisor socket, the main permitted state and an exception marker. On turn one, Conveyor and Security are available, all sockets are empty and four rooms are sealed. Locked bays establish future scope without explaining their secrets. Selecting a room opens its detailed scene; Back restores the wall and selection.

**Adviser channel:** a dedicated portrait-led surface for selection and structured speech. Selection previews and appointing the day's adviser must be distinguishable. The chosen speaker's assessment, additional context, priority and proposal are separate short beats. Opening that person's dossier later must not consume another consultation or change the adviser.

**Planning mode:** use the same room positions, with tokens and sockets now foregrounded. Show the adviser's recommendation first. An override has an explicit before/after relationship and consequence for authority. People are selected and placed, not chosen from a form. Click-select then click-target and keyboard operations are required; drag is optional. A confirmed plan leads back to the operating view and its Start shift control.

**Room focus and incidents:** room inspection enlarges one place without adding a new top-level destination. A consequential incident takes the foreground with the relevant art, speaker, recommendation and alternatives. It can yield to evidence inspection while keeping the decision pending. Return restores the exact unresolved decision.

**Development and Records:** separate workspaces for relationships over time. Development shows the capability chain and one selected project. Records connects physical outcomes, attributed reports and known decisions. Neither becomes a permanently open sidebar. Both preserve the live run and its explicit inspection pause.

**Dispatch and debrief:** settlement receives its own physical arrangement of output and two destinations, followed by a concise illustrated consequence view. The quota and workforce totals update only when the order is accepted. Returning to the factory does not reverse it.

The future live 3D view is another way to observe Factory. It shares selected entities, notices and commands with these interfaces; it does not own the game state or require their replacement.

## Tokens and interruptions must have clear meanings

- A supervisor token always identifies the same person. Location shows assignment; a distinct mark shows adviser authority. Selection, recommendation and accepted placement must look different. A glowing ring must not accidentally imply revealed confidence.
- A room marker represents a real exception or pending decision. Clicking it leads to that issue. No ornamental hazard icons, invented sensor readings or permanently flashing alarms.
- Resource icons identify known quantities and link to their context. Pair unfamiliar symbols with short labels; do not make the player memorize an unexplained icon language.
- Routine production updates remain on the relevant instrument/feed. Important completed actions leave an inspectable notice. A required decision pauses and takes the foreground. Irreversible dispatch gets a clear preview and commitment. These should not all use the same popup.
- The adviser's own-room response is presented as an action already taken. Other-room responses distinguish the recommendation from the director's actual choice. Reports do not become confirmed facts merely because they are attractively presented.
- Only one foreground decision exists at a time. Closing or inspecting cannot silently choose a response, resume the world, lose the draft or discard a queued incident.

## First turn and Part 05 use the same interface

The first-turn wall is the full factory in an early state. It is not a special reduced page that must later be replaced. The current task leads the player to the two adviser tokens; other visible surfaces provide orientation and optional inspection. There are no preassignments and no repair interface.

The Part 05 design stress test should place all six rooms, five original supervisors, basic and smart output, an engineering commitment, a programme tradeoff, a known report and Cortex progress into the same navigation structure. Only the active question comes forward. This is an author review fixture, not a playable future state or a licence to expose hidden psychology.

The new 10–20 minute room-unlock target supersedes the earlier pacing hypothesis of roughly three shifts in thirty minutes for this progression test. The later implementation plan must reconcile shift length, briefing length and mastery gates with that target. Merely displaying six rooms does not establish that pacing works.

On phones, keep all six room summaries visible together in a compact overview; open art and decisions in focused views with readable controls. Preserve meaningful labels, selected context and a return route. Do not stack all desktop panels into a long webpage or reduce them to illegible miniatures. Expanded records may scroll; the primary operational view should fit the available viewport.

## Next design gate

Before generating the replacement kit or rebuilding components:

1. Sketch the full-floor overview and its first-turn state in the same geometry.
2. Sketch adviser selection/briefing, proposed placements and one overridden plan.
3. Sketch a room focus, an automatic-action notice and an unresolved other-room incident with a return from evidence inspection.
4. Sketch Development, dispatch and debrief; demonstrate where Part 05 information belongs.
5. Walk one entire day through those compositions at desktop and phone sizes. Count navigation and confirmation steps; remove transitions that only restate information.
6. Derive the asset list from these functions: frame modules, token sockets, character tokens, resource symbols, room seals, attention markers, commit controls and state variants. Match actual Loopforge art rather than adopting another game's materials.
7. Then build and visually assess the complete loop. Passing rendering and automated tests cannot clear a failed composition or visual-coherence gate.

This study establishes the interface responsibilities. The spatial sketches, asset pass, implementation and renewed quality assessment remain the next stages of the authorized rebuild.

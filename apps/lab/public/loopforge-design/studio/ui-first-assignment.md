# UI DESIGNER · first assignment

21 November 2026 · Annotated audit and static visual studies

Read the [shared instructions](/stepanoskin/loopforge/design/studio), [UI DESIGNER brief](/stepanoskin/loopforge/design/studio/ui-designer) and [source reader](/stepanoskin/loopforge/design/studio/ui-reading). This is the first commissioning handoff, not a record of completed UI redesign. Implementation ownership remains undecided.

## The outcome

Give the owner a clear view of how the current interface supports or breaks Loopforge's identity, and a concrete visual direction to choose. The priority is immersion through a Producer console with CCTV-style room views. Pins and popups belong to the console or to the observed room and may open dedicated interfaces. Marvel Rivals is the main external UI reference. Design desktop and phone together.

You may propose new navigation, composition and interaction treatment. Preserve approved mechanics, factory layout and scene timing. The first product is an annotated audit and static screen/state studies, not a clickable prototype or runtime rewrite. Publishing the studies and maintaining the design pages are part of your delivery.

## Onboard and pre-synthesize

1. Establish current master, recent relevant PRs and saved work. Inspect the applicable repository instructions, role handoff and actual current player before editing. Avoid duplicate work or accidental inclusion of another specialist's files.
2. Play the relevant current paths on desktop and phone-sized views. Capture representative states from the running build. Record viewport, route, build when available, inputs and whether the surface is integrated, standalone or historical. If access fails, state the exact gap and continue independent source study without calling it a play review.
3. Read the linked vision, script, approved layout, systems and implementation contracts. Compare earlier UI studies against the current game. Inspect Marvel Rivals' credited screens and relevant official video sequences, then read the Interface chapter of Designing Games in depth.
4. Produce a concise pre-synthesis: what the player is doing, what the world should feel like, where the current presentation breaks that relationship, what reusable assets/contracts already exist and which questions genuinely need the owner.

For every finding, distinguish an observed behavior, an aesthetic judgment, an inference and an untested concern. Attach a screenshot or source to the specific claim. Do not convert a missing asset into a mechanics defect or describe a proposed interaction as implemented.

## Interview and plan

Ask one unresolved question at a time, with suggested answers and meaningful tradeoffs. Do not reopen the six settled direction points in the brief. Use the studied evidence to make questions concrete.

Present the proposed screen/state set, visual approaches, published location, assets to reuse, work to create, review criteria and exclusions. Get the owner's approval of that plan before producing the full design set. A few exploratory sketches may help the interview, but do not commission an entire UI asset library before the direction is chosen.

## Paired review matrix

Use this as the starting matrix, then agree a bounded selection with the owner. Show the same game state and player job in desktop and phone compositions. A static sequence can explain interaction without becoming a clickable prototype.

| Surface | What the study needs to resolve |
| --- | --- |
| Entrance, game menu and settings | One visual identity across the way in; clear start/resume/settings; accessible sound and motion choices; distinguish development controls from the player experience. |
| Producer console / camera overview | Active room and global facts; communications; actionable versus unavailable controls; attention hierarchy when a local event needs notice. |
| Focused room with speech and selection | Readable bodies, actions and bubble timing; room-owned pins; overlaps during concurrent action; zoom/framing and phone touch targets. |
| Dedicated task interface | A concrete existing job such as worker inspection, staffing or supervisor choice; its entry, selection, command feedback and return to the originating room. |
| Interruption and consequence | A relevant call, alert or shift result; priority, dismissal/recovery and clear separation of observed fact from uncertainty. |

Include an ordinary state and the consequential edge states for the chosen interactions: focus/selection, pending versus confirmed, unavailable/rejected, crowding or multiple signals, return/dismissal and reduced motion. Explain current pause/time behavior rather than inventing it. Preserve approved dialogue and timing in mock-ups; identify unavoidable conflicts for owner resolution.

Desktop and phone should be visibly designed, not merely labelled as future support. Include actual-size views and legible close-ups. Check the publication at 320, 390 and 768 CSS pixels and desktop; recommend orientation and control adaptations with reasons. Keep the approved factory geometry intact even when the camera crop changes.

## Build the review package

- An annotated current-state audit with a short priority list tied to player impact. Keep cosmetic preference separate from blocked understanding or action.
- Static visual studies of the approved screen/state set, paired across desktop and phone, with annotations for the console/room boundary, hierarchy and interaction flow. Label reconstructions and proposed states clearly.
- A compact visual vocabulary: typography, color roles, material treatment, selection, focus, unavailable states, icon/label relationships and proposed motion principles. Include sound-off and reduced-motion equivalents.
- A source/application ledger: reference, location or timestamp, principle used, Loopforge decision, limits and review method. Include verified book citations and commercial-use/provenance notes for assets proposed for the product.
- A practical handoff: what can be reused, what requires ART, what changes the presentation only, what needs ENGINE or SYSTEMS agreement, remaining owner decisions and the proposed next implementation slice. Do not assign implementation ownership without the owner.

Publish a clear entry from the game-design page to this package and cross-link relevant existing UI studies. Choose the exact placement in the approved plan, alongside the [Music engine tab](/stepanoskin/loopforge/design#music-engine). Preserve old links and label superseded proposals as historical. Optimize review images for actual display sizes with on-demand close-ups; do not load full-resolution masters into every page.

## Verify and ask for owner review

Check the actual hosted review route, navigation, downloads, keyboard use, readable phone layouts and image sizing. Check copy against the approved source and confirm that the PR changes only the agreed design/publication scope. Report which checks ran and which remain open. Static mock-ups do not demonstrate runtime responsiveness, accessibility compliance or a completed game experience.

Deliver the PR and preview with a suggested review order and a few precise decisions for the owner. Update this role's Current handoff and dated studio journal, preserving earlier publications. The owner accepts the visual direction and later validates any implemented game. Do not merge without authorization.

## Small checkpoints, durable work

Save authored studies, editable sources, exported previews and a compact manifest as work progresses. Record the branch/commit, completed items, remaining items and the next operation. Keep tool output bounded; do not recursively ingest old chats, dump generated HTML or reload the entire asset archive into context. If a chat ends or fails, the replacement should validate saved work and finish it, not regenerate completed art. A limit banner is an operational failure to report, not a reason to claim success or silently reduce the agreed scope.

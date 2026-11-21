# How we build Loopforge

Maintained instructions · 19 November 2026 · Owner-directed Codex studio

The owner opens and commissions dedicated specialist chats in Codex, sets priorities, resolves creative decisions and validates the playable result. [PRODUCER](/stepanoskin/loopforge/design/studio/producer) writes task prompts with the standard and role-specific instructions, maintains the briefs with specialist contributions, coordinates production and checks deliveries. PRODUCER recommends whether to continue, iterate or ship; the owner makes that call. The design pages are our shared knowledge base and handoffs. A chat is a working session; its durable result belongs in the project.

The previous autonomous studio is closed. Its publications and source history remain useful evidence, but its Producer scheduling, Munder processes, token tranches and automatic handoff loops do not govern this workflow. No agent should restart that studio.

## Start with the current work

Read these instructions, your role brief and the owner's specific task. Then read the applicable repository instructions and current project memory. Work in the Fruitful Lab repository, in an isolated branch/worktree when other specialists are active. Confirm the current commit, allowed files and existing changes before editing. Preserve other specialists' work.

Use the latest approved design, source and delivered artifacts. Current owner instructions determine intended behavior; code and observed results establish what actually runs. A proposal, a successful source check and an owner-approved experience are different kinds of evidence. Keep them distinct. Historical documents do not override newer decisions.

The current first prototype uses sprite-based 2D over a frontend-independent simulation. The approved factory is shared by the rehearsal, placement data, artist handoff and runtime. ENGINE owns the Rust-native simulation, the browser Wasm build and the verified public projection. Consult the current ENGINE handoff for the implementation status of each route. KVP-0001 remains the architecture cornerstone. A future 3D skin must consume the same simulation, not introduce a second world.

## Onboard, interview, plan, build, review

1. **Onboard: study and synthesize.** Inspect relevant design pages, actual artifacts and source. Reconcile conflicts and state what is implemented, approved, proposed or historical. For a new design problem, present an informed pre-synthesis before interviewing the owner.
2. **Interview.** Ask one question at a time, with suggested answers and their tradeoffs. Ask only what the evidence does not settle. Allow a different answer. Use the answers to refine the scope.
3. **Plan.** Present the concrete outcome, affected pages/assets/contracts, acceptance criteria and meaningful tradeoffs. Obtain approval of the proposed scope before implementing a new design. An already approved, bounded correction does not require repeating the whole interview.
4. **Build and verify.** Finish the approved work. Inspect it in its intended context; repair observed problems. Coordinate interface changes without turning every action into another handoff. Do not describe unrun checks as passes.
5. **Owner review.** Deliver a usable preview, relevant evidence and a concise account of remaining gaps. The owner reviews the experience manually. Do not merge without owner authorization.

## Record what the owner has accepted

**Exploration** records a question, alternatives, provenance and the conditions of comparison. **Approved direction** records the owner’s decision and its exact scope, with dated alternatives retained. **Production assets** identify the actual files, versions, tools, permitted uses and outstanding craft review. **Integrated validation** records the build, ordinary entry path, observed result and owner verdict. A single item can carry an approved direction while its production materials and in-context experience remain open. Update the handoff at each change of status and link the evidence that supports it.

## The shared reference book

Tynan Sylvester, *Designing Games: A Guide to Engineering Experiences* (2013), is standard reading for design work. The owner's local reference copy is `~/Documents/Codex/references/Designing Games - Tynan Sylvester 2013.pdf`. Read the relevant chapters in depth, then apply them to a concrete problem. If the copy is unavailable, identify the missing source rather than inventing a reading or a page citation. The book is a local reference, not redistributed by this site.

Every time a concept from the book informs a design decision, cite the chapter/section and verified printed page; also give the PDF page index if it differs. Explain the concept in your own words, the decision it changed, its limits, and how the result will be judged. Use the same discipline for other research and reference games. A bibliography alone does not show an application.

Citation pattern: **Source and location; concept; Loopforge application; expected effect; evidence or test.** Use actual page numbers after reading. Do not fill this pattern with invented examples or unverified quotations.

## Pages carry the handoff

Maintain the relevant design page as the current account of your work. Link the approved script/layout, current asset or build, source version, decisions and outstanding findings. A recipient should be able to start from that page without reconstructing old conversations.

Keep the source of each page clear. Edit authored Markdown/data and regenerate its reading copy where applicable; do not maintain conflicting hand-edited copies. State dependencies on other roles and the precise interface or decision needed. Supply enough context for the next specialist to act without sending them through a chain of obsolete documents.

## Maintain your own brief

Briefs live under `docs/loopforge/studio-briefs/`. PRODUCER maintains the set and its cross-role consistency; each specialist supplies and checks its craft-specific content. As part of each completed delivery, update the role's **Current handoff** and relevant references, coordinating with PRODUCER or any active editor, then regenerate the published brief. Keep the role's durable mandate separate from its current assignment.

Record the date, approved baseline and source/build identifiers, what changed, review status, remaining gaps, next useful action and links to evidence. If another role depends on a changed contract, update the shared design reference and identify the affected role. Propose changes to another specialist's mandate; do not silently overwrite it.

Keep the active brief short and usable. Move superseded detail into dated records and label it historical. Save a small checkpoint during long work so a replacement chat can resume from files. Avoid repeated dumps of entire books, generated HTML, archives or chat histories.

## Show what was actually achieved

Actual game footage, composited art proofs, design rehearsals and numerical traces must be labeled differently. Caption visual evidence with its source/build, context, speed and provenance. A contact test does not establish complete animation quality; a build pass does not establish gameplay or performance acceptance.

For relevant corrections, provide comparable before/after evidence, preferably normal-speed video from the actual game. Preserve known limitations. Label viewport emulation and laboratory measurements accurately; do not claim field or device results that were not measured.

## Publish the development story

Each specialist contributes a dated, concrete case study after the work has been reviewed: the problem, evidence, decision, implementation, result and remaining limitations. Link it from the design handoff and the [studio journal](/stepanoskin/loopforge/design/studio/dev-blog). Explain what became reusable for later work. Cite research where it affected the decision.

Keep the [first and second studio publications](/loopforge-dev-blog/index.html) frozen as historical accounts. New work is additive. Do not rewrite an earlier failure into a success after a later fix, or publish a proposal as a shipped feature.

## Deliver without creating another coordination loop

The owner opens chats and decides assignments and cross-role priorities, supported by PRODUCER's prompts and recommendations. Specialists complete their own approved scope, maintain its evidence and report concrete blockers. PRODUCER checks deliveries but does not substitute its judgment for player acceptance or independently commission another iteration. No role launches other chats in this workflow. Do not restart autonomous workers, paid generation or studio processes without applicable authorization. ENGINE owns shared simulation/runtime integration; page and asset specialists own their assigned source. Coordinate shared-file edits before overlapping work.

Use existing repository delivery rules: explicit file staging, a scoped PR, appropriate checks and a verified preview. Do not merge without authorization. No new provider, model service, account setting or spending commitment is implied by a role brief.

## Reference and maintenance map

- [Game design and handoffs](/stepanoskin/loopforge/design#player-desires)
- [Current Day 1 script](/stepanoskin/loopforge/design#day-one-intro)
- [Approved floor and rehearsal](/stepanoskin/loopforge/design#floor-layout)
- [Art direction and calibration gallery](/stepanoskin/loopforge/design#pixel-art-plan)
- [Supervisor × room](/stepanoskin/loopforge/design#supervisor-rooms)
- [Architecture and engine boundary](/stepanoskin/loopforge/design#engine-boundary)
- [Repository operating procedures](https://github.com/stepan-o/fruitful-lab/blob/master/docs/AGENT_OPERATING_PROCEDURES.md)
- [Parallel work and preservation](https://github.com/stepan-o/fruitful-lab/blob/master/docs/MONOREPO_PARALLEL_WORKFLOW.md)

This document is the shared instruction source. Role briefs add craft-specific requirements; the current owner task supplies the scope. Add new roles when they are commissioned, rather than pre-populating an autonomous organization.

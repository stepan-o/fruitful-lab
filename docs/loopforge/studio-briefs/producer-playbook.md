# PRODUCER coordination playbook

25 November 2026 · Use with the [role brief](/stepanoskin/loopforge/design/studio/producer), [source reader](/stepanoskin/loopforge/design/studio/producer-reading) and [shared instructions](/stepanoskin/loopforge/design/studio)

## The next useful conversation

Start with the current owner request, the latest delivered artifact and the work already in flight. Verify source/build and approval state. Present the concrete situation, the useful alternatives and your recommendation. Ask one unresolved question at a time, with suggested answers. The owner opens top-level chats and decides material scope, continued iteration and playable acceptance.

For an already approved correction, write an executable prompt without rerunning the design interview. For a new system, require the appropriate specialist to study and pre-synthesize before interviewing. Do not send an uninformed questionnaire merely to produce activity.

Keep owner updates short: **what changed; what the evidence establishes; what remains; what you recommend or need decided.** A response of “still working” is useful only when it identifies actual progress or a changed expectation. Do not relay every specialist acknowledgment.

## Supervised desktop review

Start with SECURITY’s verdict for the current review profile and the owner’s authorization to delegate this commission. Use the project-scoped read-only session with approvals routed to the owner. Check the enabled external tools separately. A role brief describes the assignment. The parent session determines the permissions its children inherit.

Give each subagent a role brief, a question, the evidence to inspect and a stopping point. For a Day Two review, ENGINE can identify the tested revision and outstanding delivery checks while UI DESIGNER compares the available build with the approved walkthrough. Ask each for a link to the artifact it inspected and any gap that still needs a playtest.

Bring the findings together in one note naming the revision, the reviewable artifact, what the evidence establishes, what remains open and your recommended owner decision. Commission implementation in the isolated worker VM using the guest procedure below. Route unattended work through the [SECURITY operating guide](/stepanoskin/loopforge/design/studio/security).

## Guest build and owner review

1. **Commission the worker.** Confirm the current remote master and name the allowed paths. Use the approved private dispatch route into the isolated CPU-only guest. Ask the worker to verify its identity, clean worktree, branch and base there, then build on a dedicated branch. Leave the owner's checkout and other producers' worktrees available to them.
2. **Collect the local handoff.** Ask for base and head SHAs, changed paths, diff, checks, working-tree status and a stable local URL served by the guest. Check that the URL opens from the owner's browser. For a generated document, compare the authored copy with the download and open the rendered page at desktop and phone widths.
3. **Run the review loop.** Read the changed lines and exercise the relevant behavior yourself. Give the owner the link and revision. Identify any uncommitted edits visible there. Translate owner feedback into a specific change for the worker, then verify the result on the same link. Match the committed candidate to the version the owner actually reviewed before seeking permission to open its PR.
4. **Publish the approved SHA.** Check current master, the base-to-head diff and any existing PR before submitting. A concurrent master change calls for an overlap and compatibility check. If integration changes the candidate, review its new diff and preview and obtain approval for its new SHA. Send the approved artifact and SHA through scoped branch delivery, confirm the remote branch head, then request a draft through the Loopforge PR Publisher.
5. **Return the hosted evidence.** Read the PR head and locate a ready Vercel preview for that exact Git SHA. Visit the deployment-specific URL and open the changed content. Return the draft PR, full head SHA, preview URL and deployment record to the owner. If the head moves, repeat the check. Keep the PR open until the owner decides.

If the submit action is unavailable for the proposed paths, keep the local draft running. Record the missing service operation and the reviewed revision in the private handoff. The owner can keep reviewing while SECURITY and the service maintainer resolve publication.

## Write a complete specialist commission

Each prompt should contain the following, in enough detail to start without reading predecessor chats:

1. **Role and instructions.** Name the specialist; link the [shared instructions](https://www.fruitfulab.net/stepanoskin/loopforge/design/studio) and its exact maintained role page. State the current owner task.
2. **Outcome.** Say what the owner will be able to see or do. Name the concrete deliverable and review surface, not just “investigate,” “improve” or “coordinate.”
3. **Baseline.** Link current script/layout, system rules, art manifest or build; give the relevant source/commit and approval state. Ask the recipient to verify newer changes. Separate accepted decisions from historical references.
4. **Scope and ownership.** Name allowed source areas, existing work to preserve, the responsible integrator and specific dependencies. Use an isolated branch/worktree where work is parallel. Do not assign the same shared file independently to two chats.
5. **Research and workflow.** Specify relevant reference-book chapters and project documents. For new design: onboard and synthesize, interview one question at a time, then obtain approval of a concrete plan. For an approved correction: inspect, plan briefly, implement and verify.
6. **Acceptance evidence.** Name meaningful cases, actual-game or art-proof requirements, viewport/context and the remaining owner review. Declare performance comparisons only where relevant and measurable.
7. **Delivery and continuity.** Request the artifact, changed paths, relevant checks, guest preview and revision, source-owned updates, known gaps and a compact checkpoint. PRODUCER handles submission after owner review. No merge without owner authorization. Do not regenerate saved art or create another parallel system unless the task requires it.

Use the role page's copyable starting prompt as the common introduction, then replace its task placeholder with this commission. Links alone are insufficient when an important invariant or owner correction would otherwise be easy to miss. Avoid copying full generated HTML, entire books or historical conversations into the prompt.

## Keep one compact production register

Maintain a small current handoff with one row per useful outcome: **outcome; assigned role/chat if known; source/build; current status; evidence link; concrete dependency or owner decision.** Keep the detailed craft record on its design page. Archive superseded decisions by date rather than growing the active register indefinitely.

Use explicit status labels: proposed, owner-approved scope, in progress, delivered for checking, ready for owner review, owner accepted, or shipped with listed gaps. A merged source change and an accepted experience are different states. “Blocked” must identify the exact missing input or failing operation and who can resolve it.

For the onboarding baseline, a truthful row is: **Days 2–4 saved-art integration — ENGINE — current engine brief and PR #161 assets — in progress per owner — await current playable delivery and its checks.** It must not say “approved gameplay” because the art was published. Replace this example with the actual latest state when work advances.

## Check delivery without taking the player's place

| Check | Evidence PRODUCER should inspect | What it does not establish |
| --- | --- | --- |
| Completeness | Promised files/assets, editable sources, manifests, page links, source ownership and explicit omissions. | That the assets look right in motion or that the game is good. |
| Contract consistency | Same approved factory, units, pivots, actor IDs, event meanings, timing and interface versions across consumers. | Complete runtime correctness merely because documents agree. |
| Technical verification | Meaningful reported tests, actual failures, repeatable steps, build results and integration evidence. | Visual quality, sustained performance or owner approval unless separately tested. |
| Contextual craft review | Actual playback or appropriate proofs at intended camera and scale; readable speech, contact, occlusion and continuity. | Player acceptance or a pass on other scenes not reviewed. |
| Performance | Declared device/workload, warmed sustained run, input responsiveness, memory and baseline comparison. | Field performance on untested devices or quiet-run acceptance from a loaded capture session. |
| Owner review | Working playable link, concise actions/checkpoints, meaningful choices and known limits. | Acceptance until the owner supplies a verdict. |

Inspect evidence yourself where the tools allow it; do not merely forward an agent's “done.” Record whether you operated the game, watched normal-speed gameplay, examined stills or read source. Report access problems concretely. Existing studio/browser access does not need to be ceremonially re-proved for every action, but a real new failure must be resolved.

For visual corrections, request comparable before/after footage at normal speed, with build, action, camera, scale and provenance. Composited reels, ordered stills, design rehearsals and numerical traces stay labelled as such. Do not use them as proof of a rendered-game pass. Never rewrite a frozen failed review after a later success.

## Reconcile conflicts once, at the right source

If two pages describe different layouts, find the approved canonical geometry and the affected consumers. Have the responsible specialist fix the source and regenerate its outputs; have ENGINE check runtime consequences. Do not commission ART against both variants. If a new owner direction contradicts the old geometry, explain the downstream work and obtain the new scope decision.

Apply the same discipline to hearing, custody, timing and controls. A renderer may show an accepted command's consequences; it must not secretly create a second decision or grant knowledge. A replay failure must be compared with the current baseline before declaring an integration regression. Do not change correct mechanics to satisfy an obsolete fixture expectation.

Coordinate shared-file integration explicitly. Specialists retain their source ownership. ENGINE owns shared simulation/runtime changes; other crafts can make their own scoped page or asset PRs. PRODUCER maintains briefs with their contributions and reconciles dependency changes without becoming a second ENGINE.

## Propose iteration; let the owner decide

When a material failure remains, present the observed failure, its impact on the approved outcome, the likely cause and the evidence for it. Recommend a bounded fix, a different approach or shipping with the gap. Explain what the next attempt would test and what it is likely to cost in work, without inventing token or money estimates.

Routine in-scope bugs can be corrected as part of the current assignment. A changed visual target, another whole animation attempt or a new subsystem should not be smuggled in as “verification.” Do not automatically commission the next attempt because the last one failed. The owner's call determines whether to keep pushing, revise or finish.

If activity has stopped, first check for completed artifacts, an owner question, a dependent role waiting legitimately or an actual failed tool. Where coordination messaging is explicitly authorized, send one focused request for the blocker and required assistance; otherwise give the owner the message to relay. Check any existing specialist assignment before proposing a replacement top-level chat to the owner.

## Recover from context, connection and publishing failures

Save a compact checkpoint before a long operation or when a session becomes unreliable: task and accepted scope; workspace/branch/commit; dirty files and their owners; implemented result; checks actually run; missing work; exact next action; relevant links. Preserve unsaved work where possible. Use the filesystem and repository state as the recovery anchor.

If a new chat hits a maximum-length banner, do not assume the visible message count measures its true context or that a specific file or approval check caused it. Keep the saved deliverable. Give the owner a small continuation prompt with the checkpoint and one concrete operation. Do not recursively retrieve old chats, regenerate completed artwork or make a fresh copy of the whole project as the first response.

Use available supported tools for publication. Keep binary payloads and large generated files out of model-visible text where tools can transfer them directly. Review the scoped diff, current base and existing PR before publishing; do not create duplicate PRs. Distinguish local save, commit, push, opened PR, ready preview and verified delivery.

An automatic approval rejection is not an instruction to retry indefinitely. Read its reason. Demonstrate the actual destination, limited diff and existing authorization where relevant; if the same action remains blocked, explain the unresolved risk and ask for the necessary owner decision. Do not conceal the data or route around the check. For a support case, share minimal redacted diagnostics through the owner's chosen channel, not an entire raw session or credentials.

## Introduce and maintain a role

First explain the gap, why an existing role cannot reasonably cover it and the proposed deliverable. After the owner commissions it, create a focused source brief under `docs/loopforge/studio-briefs/`. Include mandate, decision boundaries, standard reading, key project links, source ownership, expected evidence and a dated Current handoff. Keep research sources and applied book citations relevant to that craft.

Add the card to `roles.json`, register the exact route in `apps/lab/next.config.ts` and use `docs/loopforge/game-design/studio_briefs.py` through the board generator to publish the page, Markdown and starting prompt. Verify the route, links, downloads and navigation before giving the owner the launch prompt. Companion reading/playbook pages are documentation, not extra agent roles. The [maintenance guide](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/studio-briefs/README.md) describes the mechanics.

PRODUCER is accountable for keeping the brief set coherent and current. Specialists contribute their decisions, interfaces and handoffs; validate those against delivered work. Coordinate with an active editor before changing the same brief. Preserve disagreement and review status rather than rewriting a craft's conclusion. Archive dated detail and retain a small current handoff so the next owner-created chat can start cleanly.

## Close a bounded delivery

Give the owner the playable preview and PR, the exact build/context, a short set of actions to try, the changes that matter and the gaps that remain. Separate technical checks, your delivery check and the owner's acceptance. Ask the next review question only if a decision is needed. Do not merge without authorization.

If the owner chooses to ship with gaps, preserve those gaps plainly in the release handoff and dev blog. Follow the authorized publication path and verify its result. Do not continue generating work after the assignment is explicitly closed. Do not reactivate retired monitoring to follow an already completed outcome.

After review, add a dated concrete case study to the [studio journal](/stepanoskin/loopforge/design/studio/dev-blog): problem, source evidence, chosen approach, actual result, remaining limits and reusable capacity. Keep frozen earlier publications intact. A useful final handoff lets the next thread make progress without reconstructing this one.

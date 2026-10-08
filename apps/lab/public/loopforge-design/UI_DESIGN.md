# Loopforge UI design

Working draft · 7 October 2026

Interaction, knowledge and simulation contracts for the new game. This is a functional design reference, before screen mockups and visual implementation.

## Opening rules and what unlocks later

**Day one.** General factory statistics and a weekly quota appear beside Limen and Stiletto. All assignments are empty. Adviser choice comes first; the chosen adviser proposes the first arrangement. Later days can use the previous arrangement as a baseline.

**Daily commitment.** Split completed robots between the factory and the weekly quota. Confirmed allocations cannot be reversed: retained workers cannot later be shipped to rescue the quota, and committed deliveries cannot be recalled.

**Parts 01–02.** Operate, prevent further damage, respond to incidents and live with the consequences. Repair is neither an available action nor an early tutorial, locked button or spending prompt. No station-level staffing task is introduced.

**Part 03.** Witch brings engineering. Only an engineer can perform repairs. Her time and lost production are the core costs; a cash bill is not a default requirement.

**Hidden worker history.** Record missing indoctrination when robots are produced before the Theatre opens. A supervisor can learn or infer it and choose to report it earlier; direct inspection arrives in Act 2.

**Money.** Development is the established use. Payment schedule, prices and treatment of excess output remain open. A weekly quota does not establish a weekly payday, daily income or a separate sales action.

## UI structure

Factory is where the work happens. Development changes what the factory can do. Records explain what has happened and what people claim. Contextual panels connect them to the same world, people and decisions.

*Proposed interface structure · functional diagrams, not game mockups*

### Instance and interface hierarchy

**Run instance.** One persistent factory world: seed, time, people, resources and history. A session is a period of playing that run. Rooms and floors are entities within it, not separate simulations.

**Interface.** The web director’s console observes the run through KVP and submits commands. Other frontends can use the same engine contract.

**Screen and view.** Factory, Development and Records are navigation destinations. Animated floor and six-room overview are alternative Factory views. A room close-up changes scene focus.

**Context and overlays.** Selection opens an inspector. A decision or consultation opens a focused panel. Modals, popovers and notifications have specific interaction roles; “popup” is not a component type.

### Shared director’s console

**Global status.** Day and phase, weekly quota progress and deadline, money, worker counts and explicit clock state. Only add materials when relevant.

**Navigation and selection.** Three main screens preserve the run, selected entity/event and previous view. Returning to Factory restores its camera and focus.

**Clock and decisions.** Show Running, Planning paused, Inspection paused or Decision required. A pending decision remains reachable from every screen.

**System menu.** Resume, save/checkpoint status, sound, motion/accessibility settings and leave session. Entry offers new run or resume; these are outside the three gameplay screens. Storage implementation remains open.

### Factory — Operate and intervene

The daily adviser choice leads paused planning. During operation, observe their delegated decisions and accept or override their recommendations elsewhere.

#### Workspace

Animated floor ↔ six-room overview

- Select room, worker, supervisor or incident
- Observe flow, condition and current visible activity
- Focus a room without leaving the Factory screen

#### Context inspector

- Known condition and attributed reports
- Current assignment or work
- Available action and known tradeoff

#### Chosen adviser, delegated room and incident feed

Keep today’s adviser and the room under automatic authority identifiable. Persistent incidents distinguish already resolved actions from recommendations waiting for the player.

Day one: handover → choose adviser → proposed initial assignments → accept or override → start. Later days begin with results. Each day ends with permanent factory/quota allocation; live events follow delegated authority.

#### Views and panels

**Animated floor.** Continuous machinery, workers and consequential activity. Camera pan/zoom and room focus change presentation only.

**Six-room overview.** Compare assignments, warnings and operating conditions. The same entity IDs and commands support both views.

**Room inspector.** Production function, room workforce, equipment and available actions. Parts 01–02 do not show repair controls; Part 03 introduces engineering work. No station staffing interface.

**Worker or supervisor dossier.** Observable history, role, current work and statements. Brain 2.0 can add permitted mental detail here.

**Daily report and adviser briefing.** Direct facts first, then an explicit adviser choice. The selected supervisor supplies assessment, additional context, priority and proposed moves. The player can override assignments with social consequences, but cannot set the adviser’s priority.

**Decision / consultation.** Outside the delegated room, present the chosen adviser’s response for acceptance or override. Their own room’s completed decisions appear in the feed. Morning follow-up stays with that adviser.

**Daily production allocation.** Preview today’s factory/quota split and resulting totals, then confirm its permanent effect. Show the weekly deadline separately from unresolved payment scheduling; follow with the factual debrief.

**Clock behaviour.** Planning and the morning briefing are paused. The adviser’s room events resolve automatically during the live shift; response decisions elsewhere pause for acceptance or override. Ordinary selection preserves the clock state.

**Mobile.** Default to a readable focused room or the reflowed room overview. The inspector becomes a bottom sheet or full-height panel; the selected room and clock status remain identifiable.

**Engine contract.** Displays permitted snapshots, changes and semantic events. Assignment and operating controls submit commands; acceptance, pending execution and actual outcome are distinct states. Initial assignments are empty. Allocation commands cannot reverse prior commitments, and repair requires an engineer.

### Development — Invest and commission

A factory development map connects investment, capability and commissioning. It contains facilities, process improvements and special projects.

#### Workspace

Facilities · improvements · special projects

- See the next capability and its dependencies
- Compare projects competing for the same surplus
- Inspect active work, blocked prerequisites and completion

#### Project inspector

- What this project enables
- Money, labour, material and downtime requirements
- Eligibility, commissioning and commitment

#### Active commitments

Current projects and the workers, money or capacity already committed to them. No invented balance values in this diagram.

Project action: inspect requirements, commit eligible work, or manage an active project under its rules.

#### Views and panels

**Development map.** Stage progression with optional investment branches; inspect one project at a time.

**Active projects.** A filtered view of the same map, useful when several projects compete for capacity.

**Project inspector.** Benefit, current eligibility, costs, interruption and the work needed to commission it.

**Engineering decision.** A special project can require a personal or political decision, such as a supervisor modification. Funding does not settle its social consequences.

**Clock behaviour.** Proposed first-prototype rule: opening Development during a live shift requests an inspection pause. Returning to Factory does not resume automatically. A separate outstanding decision still has to be resolved.

**Mobile.** Replace the wide dependency map with an ordered project list and expandable prerequisites. Preserve dependency meaning and return to the selected project after inspection.

**Engine contract.** Eligibility, costs, reserved capacity, project progress and completion are authoritative state. Funding must be validated once; a client animation cannot deduct money or grant a room.

### Records — Review and understand

Follow the evidence behind outcomes. Distinguish physical records from attributed accounts and find earlier decisions that still matter.

#### Workspace

Ledger · incident threads · episodes

- Review deliveries, spending and population changes
- Follow a report with its source and permitted evidence
- Inspect a past decision or replay a known event

#### Evidence inspector

- Observed, reported or inferred
- Source, time and related events
- Known decisions and lasting consequences

#### History and replay controls

Select a shift or event. Clearly label historical inspection; replay never rewinds or modifies the live run.

Record action: inspect evidence, follow a linked event or return to the current factory.

#### Views and panels

**Ledger.** Quota, deliveries, allocations and investments.

**Incident threads.** Accounts, witnesses known to the director, decisions and follow-up.

**Episodes.** Conflicts assembled from recorded consequences across shifts, with optional replay.

**Evidence inspector.** A fact and a supervisor’s statement remain different kinds of record.

**Historical scene.** Reuses the scene renderer at a recorded point, with an unmistakable replay state and return-to-live action.

**Clock behaviour.** Proposed first-prototype rule: entering Records during live operation requests an inspection pause. Playback has a separate presentation clock; leaving replay never advances or rolls back the simulation.

**Mobile.** Use a chronological list with filters and one expanded thread. Open historical scenes as a focused view, then restore the same record selection.

**Engine contract.** Reads retained events and knowledge-filtered projections. Full BDI and undisclosed truth belong to privileged development tools, not a hidden panel in the player client.

### Development and base currencies

Use one money-like currency, two workforce categories and relevant production intermediates. A separate research-points currency is not proposed for the initial game. Specialist time and lost production can make research costly without another abstract meter.

**Facilities.** Theatre, Brewery, Weaving and Cortex Assembly. Investment is combined with capability and commissioning requirements.

**Process improvements.** Candidate process improvements must alter a real tradeoff. Engineering capability is first introduced by Witch in Part 03; an early upgrade cannot quietly bypass that progression.

**Special projects.** Brain 1.5, Brain 2.0 and possible supervisor training or modification. Show prerequisites, specialist participation and consequences.

Conveyor + Security → Burn-in Theatre → Substrate Brewery → Weaving + Brain 1.5 → Cortex + Brain 2.0

This is a capability sequence, not a shift calendar or material-flow diagram. The Theatre is not required for basic output; workers made beforehand are unindoctrinated. Repair is introduced with Witch at the Brewery stage. Mastery and investment govern progression.

#### Every project must explain

- Benefit and newly available actions
- Prerequisites with understandable mastery evidence
- Money and relevant materials required
- Labour, specialist time and capacity tied up
- Work/commissioning progress and any interruption
- Cancellation, refund or irreversible commitment rules

Locked → eligible → funded/queued → active → commissioned. Paused, blocked and cancelled are explicit alternatives when supported. A room becomes usable only after the engine confirms its commissioning.

Brewery project: inspect the conveyor waste source, funding, available staffing, specialist availability and readiness evidence. Committing the project reserves its defined costs; commissioning creates a functioning production link. Exact prices, durations and mastery thresholds remain open.

The author map can show the complete progression. The player sees only discoverable labels and requirements; it must not disclose the worker-replacement purpose at first-shift entry. Social loyalty and authority cannot be purchased as generic upgrades.

### Component vocabulary

**HUD.** Persistent status and clock. It orients rather than exposing every engine variable.

**Inspector / drawer.** Selection-bound detail and actions. Replaces the prior ordinary selection; does not silently pause or spend resources.

**Focused panel.** Consultation, decision or settlement. May expand on mobile. Its presentation does not determine whether the world is paused.

**Decision gate.** A gameplay state requiring a choice. The decision panel may be minimized to inspect evidence while the world remains paused.

**Modal.** Blocks surrounding interaction for one focused task. Use for an irreversible commitment or leaving with unresolved local edits; avoid routine confirmation on every assignment.

**Popover.** Small anchored choice, such as an assignment menu or filter. Dismisses without committing; selecting an action follows its normal command path.

**Tooltip.** Brief hover/focus help with a tap-accessible equivalent. Never the sole source of a warning, action or prerequisite.

**Toast.** Short acknowledgement, such as a submitted assignment. It cannot be the only record of an important outcome.

**Incident feed / notification.** Persistent entry or badge linking to a room, person, evidence or decision. A world event does not automatically open a modal.

**Scene overlay.** Local selection, a work indicator or permitted event cue. It describes the world; it cannot invent a motive or apply an outcome.

### Interaction rules

**Ordinary selection.** One inspector follows the selected entity or event. Changing Factory view preserves the selection; closing returns focus to its origin or the nearest valid control.

**Consequential decision.** The adviser’s room-local events resolve automatically and are recorded. For response decisions elsewhere, pause with the adviser’s recommendation selected. The player can inspect evidence then accept or override; closing the panel does not resolve the choice.

**Consultation.** Selecting and hearing the adviser’s briefing commits the daily choice under the proposed UI rule. Portrait inspection is free. Follow-ups do not change adviser or supply a new priority. The same adviser proposes daytime responses; those are not additional daily consultations.

**Confirmation modal.** At most one modal at a time, with keyboard focus contained inside it. Cancel or Escape performs no action and restores focus. A confirmed command is still subject to engine validation.

**Inspection pause.** Development/Records browsing can request a distinct pause reason. Resume is explicit and unavailable while an unresolved decision or another required pause remains.

**Pending and failed commands.** Keep the proposed change distinguishable from accepted state. Show a clear rejection or interrupted connection and preserve the player’s context. Retries must not duplicate spending or assignments.

**Attention priority.** Decision required outranks an actionable warning, then routine reports, then acknowledgements. Group repeated reports; never stack a chain of modals.

**Accessible feedback.** Critical state uses text and shape as well as colour or sound. Keyboard and touch can reach every action. Reduced motion retains the same information and decisions.

### Five interface journeys

**Assign a supervisor.** After the daily briefing, inspect proposed placements → accept or override a placement → validate and issue orders → record the adviser’s and other informed supervisors’ reactions → observe actual execution. Overrides are consequential choices, not free replanning requests.

**Handle an accident.** Event in adviser’s assigned room → their response resolves automatically → feed and consequences. Event elsewhere → adviser’s proposed resolution and decision pause → inspect → accept or override → execute → differing supervisor reactions and later accounts.

**Fund a capability.** Development → project inspector → inspect requirements and shared costs → commit eligible project → active-project state → return to Factory → explicit resume.

**Choose the daily adviser.** Day one: handover and weekly quota with empty assignments → choose adviser → hear their priority and initial arrangement → accept or override → start. On later days, review yesterday first. The adviser then resolves own-room events and recommends responses elsewhere.

**Review a session.** Preview and commit daily output permanently to factory or quota → factual debrief → optional Records inspection → next day with the unchanged commitments. Historical playback never reverses an allocation.

### Growth across the acts

**First shift.** Two available rooms, two unassigned supervisors, general factory stats and a weekly quota. Adviser choice is the first action. The chosen adviser proposes the first assignments; daily allocation follows production.

**New rooms.** Add the room’s production or programme controls to its inspector and expose its meaningful material links. Avoid a new top-level screen for each mechanic.

**Engineering in Part 03.** Witch’s arrival introduces repair as an action, showing required engineering time and the production displaced. No early locked repair button or repair tutorial.

**Brain 2.0.** Unlock permitted thought/history detail within existing dossiers and records, alongside new production and intervention capability. Existing mental histories are preserved.

**Act 2 delegation.** Add floor selection within Factory. The first floor becomes a summary plus exceptions while its simulation continues. New supervisors use the same dossier and assignment structure.

UI state holds selection, camera, open panels and presentation playback. Engine state holds money, workers, projects, consultation usage, decisions and pause reasons. KVP and the separate model contract preserve that boundary across every screen.

### Open structure decisions

- Exact project costs, durations, cancellation rules and mastery evidence.
- Which mid-shift staffing orders are direct and which require a supervisor’s cooperation.
- The first prototype’s inspection-pause policy and how manual speed controls should work.
- Daily briefing length, permitted follow-up questions and relationship response controls; no player priority setter.
- Save/checkpoint persistence and which historical evidence survives changes in player knowledge.
- Validate the clarity and enjoyment of the daily adviser loop with the owner in a real working prototype before expanding interface complexity.

## UI and simulation complexity

The interface must make the player’s next decision understandable and interesting. The engine can model deeper beliefs, stress, relationships and feedbacks while the UI reveals the facts, claims, costs and consequences needed to play meaningfully.

*Agreed separation · proposed interaction contracts*

**Engine depth.** How much causally relevant state exists: individual workers, wear, stress, beliefs, intentions, relationships and memory.

**Player knowledge.** Which facts, reports and interpretations the director can access. This depends on observation, disclosure and progression.

**Player agency.** Which interventions are available, whose cooperation they need and when they can take effect. Knowledge does not automatically grant control.

**Interface load.** How much the player must read, compare or operate at once. Group, prioritize and progressively reveal detail without erasing the underlying state.

True system complexity, revealed information and the effort required to play are different things. Brain 2.0 can reveal more of an existing society without making every hidden variable a gauge. Keep communication as simple as the decision allows, and judge the result by the playing experience.

### Knowledge policy

**Observed.** An available sensor or witnessed event establishes a fact, such as the line having stopped. Make the evidence inspectable.

**Reported.** A named supervisor or worker makes a claim. Preserve who said it, when and what they could know. The UI does not certify it as truth.

**Inferred.** A forecast or explanation drawn from available evidence. State uncertainty and distinguish it from both an observation and a quotation.

**Unavailable.** Do not send or render undiscovered states, motives or the replacement purpose. Absence of evidence is not a zero value or proof that nothing happened.

**Conditioning history.** Missing indoctrination exists from production, but is not directly exposed in Act 1. An informed supervisor may report or infer it. Act 2 direct inspection uses the preserved history, including actual later Theatre participation.

### Interface surfaces

**Persistent orientation.** Current day and phase, weekly quota progress and deadline, money, workforce counts and foreground issue. Do not reveal repair controls or worker conditioning state before their intended unlocks.

**Factory or room overview.** Spatial work and local condition, supervisor assignment, warnings and current visible activity. Both views select the same entities and events.

**Context inspector.** The selected problem, its known evidence, available actions and relevant history. It expands on demand rather than placing every trait in the main view.

**Decision surface.** A paused consequential choice: what requires a decision, whose account is shown, known costs and uncertainty. Keep the scene’s context visible.

**Consultation.** A primary daily adviser selection followed by assessment, context, their priority and proposed arrangement. Responses and placement overrides affect relationships. The adviser continues proposing event responses during the shift.

**Debrief and episode.** A compact accomplishment, cost and unresolved thread, with optional causal inspection. A developer view can go deeper than the player’s knowledge permits.

### Mechanic to UI to engine

#### Conveyor and Security

*First playable slice*

**Player perceives.** Room production, visible Conveyor activity, known equipment condition and each supervisor’s current action.

**Player can influence.** Choose the adviser, then accept or override their proposed room assignments. During operation, inspect conditions and respond to available event recommendations outside their delegated room.

**Engine resolves.** Resolve room operation, workforce availability, supervisor actions, equipment condition and completed output. Detailed station simulation is not required by the current core loop.

**History carried forward.** Completed output, wear, delayed work and witnessed overrides change the next local problem.

**Interface demand.** One room inspector and a clear operating question. No station staffing grid or station-by-station workforce allocation.

#### Quota, cash and worker retention

*First playable slice*

**Player perceives.** Today’s completed robots, workforce count, committed quota progress, remaining weekly obligation and deadline. Funds and actual development commitments are separate.

**Player can influence.** Preview and confirm the daily split between factory and weekly quota. Spend money on eligible development. Engineering assignment becomes possible with Witch; it is not an early repair purchase.

**Engine resolves.** Validate completed inventory and worker identity, then record an irreversible allocation. Prevent recall of quota commitments and later dispatch of retained workers. Payment is a separate contract rule still to design.

**History carried forward.** Every allocation changes the population or obligation permanently. Later output and risk develop from the factory actually retained.

**Interface demand.** A few totals and a focused allocation decision. Counts aggregate individuals without replacing them in the engine.

#### Supervisor assignments and room fit

*First playable slice, richer with each arrival*

**Player perceives.** Relevant expertise, observed track record, current commitments and attributed recommendations. Do not display hidden loyalty as an exact value.

**Player can influence.** On day one, choose the adviser before any placements exist. Review and accept or override their initial arrangement. Later days use the previous roster as a baseline, but the adviser still selects the priority and proposes changes.

**Engine resolves.** Room capability, prerequisites, personality and current BDI state shape eligible plans. State-grounded seeded variation resolves supported outcomes; good, poor and volatile fits differ.

**History carried forward.** Output and remembered treatment persist. An assignment can work technically while damaging respect or cooperation.

**Interface demand.** Put the adviser choice before the full room matrix. Show a few proposed changes and one expanded inspector; choosing a person and evaluating their proposal must be understandable without searching all placements.

#### Stress, faults and accidents

*First playable slice, expanded recovery later*

**Player perceives.** Overload, repeated hesitation, fault warnings, observed damage and who was present. Exact worker stress remains hidden in Act 1.

**Player can influence.** In Parts 01–02, reduce further exposure or accept risk and handle incident disclosures and relationship responses. Only from Part 03 can an engineer be assigned to restore equipment; stopping alone is not repair.

**Engine resolves.** Accumulate individual and equipment exposure. Resolve bounded severity from state and recorded randomness; identify witnesses; change worker/supervisor stress, confidence, capacity and memories.

**History carried forward.** Repeated incidents alter both physical viability and the credibility of later orders. Prevention preserves a real alternate path.

**Interface demand.** A few observable symptoms and one consequential incident surface; many individual updates need no separate alert.

#### Daily advice and supervisor agency

*First playable slice with minimal BDI*

**Player perceives.** The opening handover and weekly quota precede the first adviser choice; later days show yesterday’s hard facts. Briefings distinguish assessment and attributed context from those facts, including any supervisor claim about missing worker conditioning.

**Player can influence.** Choose one adviser for the day. Hear their judgment, ask permitted follow-ups and accept or override placements. During the shift, their own room resolves automatically; accept or override their proposals elsewhere. The player cannot supply a priority to the adviser.

**Engine resolves.** BDI and current knowledge determine the adviser’s priority, plan and response proposals. Bind automatic authority to the adviser’s effective room assignment. Apply accepted or overridden responses through the local actor’s own agency; record each supervisor’s informed interpretation and effects on respect, loyalty and confidence. Prose expresses recorded decisions and permitted claims without changing direct facts.

**History carried forward.** Adviser choice, accepted decisions, overrides and differing reactions persist. Early sincere guidance teaches the system; later motives and stored hidden history support uncertainty and eventual revelation.

**Interface demand.** A primary daily choice, a concise briefing and clear automatic-versus-player decision status. The player learns why whom they choose matters; social costs and actual execution remain visible through consequences.

#### Supervisor conflicts and development

*Pair conflict from the start; modifications are later candidates*

**Player perceives.** Clashes over work, cooperation or refusal, remembered public decisions and changing behaviour. Pair relationships need not appear as numerical meters.

**Player can influence.** Back an authority boundary, assign people whose methods can coexist, or address a specific breach in consultation. Training Limen or modifying a supervisor are possible side routes to design, not generic upgrades.

**Engine resolves.** Track directed relationships, witnessed treatment and incompatible commitments. Resolve encounters through each actor’s knowledge and available plans. A supported training or modification changes specific capabilities or constraints rather than erasing personality and history.

**History carried forward.** An ally can become a rival; a protective intervention can later motivate cooperation or blame. Capability growth can change room fit and the balance of authority.

**Interface demand.** Use the existing assignment, report and consultation surfaces. Introduce a special intervention only when it creates a distinct, consequential choice.

#### Disclosure, rumours and conflicting accounts

*First slice uses direct claims and responses; richer propagation can follow*

**Player perceives.** Attributed reports and permitted evidence; differing accounts can conflict without the UI silently selecting the true one.

**Player can influence.** Choose recipients and framing where an information decision is available; investigate or use the daily consultation to challenge an account.

**Engine resolves.** Distinguish the physical event from claims about it. Track source, contacts, exposure, belief, rejection and relay. Failed rumour attempts need no global morale effect.

**History carried forward.** A supervisor’s account and the player’s response can affect later advice and cooperation. Multi-hop source comparison is deferred beyond the first playable.

**Interface demand.** One incident thread can represent many recipients. Never expose the full rumour graph in Act 1 by default.

#### Cathexis and the Burn-in Theatre

*First major social expansion*

**Player perceives.** Programme, attendance, slogans and changed behaviour; Cathexis’s growing audience becomes visible through action.

**Player can influence.** Choose programme and authority, make a commitment or pursue a designed constraint/side route. Conveyor assignment, compliance modification and revolutionary direction require their own consequences.

**Engine resolves.** Record actual programme participation and its effects on beliefs, respect and allegiance. Workers produced before Theatre opening remain unindoctrinated until actual participation changes that history. Keep Cathexis’s loyalty and confidence separate. Reassignment cannot clear history; exact programme coverage and commitment branches remain open.

**History carried forward.** Coordination can improve while independent authority grows. The chosen fork brings a downstream liability that conversation cannot indefinitely cancel.

**Interface demand.** Introduce one programme decision family, not a screen for every belief. The audience’s behaviour carries much of the feedback.

#### Rivet Witch and the Brewery

*Part 03 · substrate production and engineering*

**Player perceives.** Witch’s arrival introduces substrate production and engineering. Existing room damage now becomes actionable, with competing requests for her time.

**Player can influence.** Fund and staff the function; prioritize technical repair versus current output and decide how much discretion to grant Witch.

**Engine resolves.** Route Conveyor waste into substrate under the production recipe. For repairs, require engineering capability and reserve Witch’s time; resolve downtime and actual restoration without simultaneous incompatible Brewery work. Record reactions to neglected or completed faults. Cash alone cannot grant repair capability.

**History carried forward.** New production depends on the earlier line and its backlog. A useful repair can become an authority dispute.

**Interface demand.** Add one material flow when it becomes usable; summarize its source and destination rather than introducing a general inventory game.

#### Thrum, Weaving and relief

*Advanced chain completes*

**Player perceives.** Precision work, changed worker behaviour after relief, lower productive attention and other supervisors’ objections.

**Player can influence.** Allocate Thrum’s time between advanced production, preparation and available relief actions; accept the output/discipline cost explicitly.

**Engine resolves.** Update worker stress, productive time and discipline through distinct effects. Thrum’s room fit and other supervisors’ interpretations affect future plans. Relief is not an all-purpose mental reset.

**History carried forward.** A healthier workforce may be harder to discipline. Other supervisors can oppose a beneficial intervention for understandable reasons.

**Interface demand.** A contextual allocation or programme choice; detailed individual relief histories remain underneath.

#### Brain 1.5 and smart workers

*Advanced chain produces a new output*

**Player perceives.** A completed advanced batch and the opportunity cost of selling versus retaining specialist workers.

**Player can influence.** Commission the first batch, then allocate valuable output to income or internal capability.

**Engine resolves.** Resolve Brewery/Weaving prerequisites and throughput; allow first production without an already-smart workforce. Preserve identities and histories if upgrades become a supported path.

**History carried forward.** Changed workforce composition affects production and social comparison. New capacity opens further investment choices.

**Interface demand.** Extend the existing allocation surface with a new category; do not create a second unrelated economy UI.

#### Replacement rumours and scapegoating

*Late Act 1*

**Player perceives.** A report about incoming supervisors, allegations and the evidence the director can access. Distinguish reported performance from actual production records.

**Player can influence.** Set or withhold assurances, investigate and eventually choose replacement policy. The rumour does not automatically fire the lowest performers.

**Engine resolves.** Propagate knowledge of the threat through relationships. Self-protection, blame, loyalty and confidence affect intentions and selective reports; record actual contribution independently.

**History carried forward.** Old overrides, accident accounts and promises acquire new stakes. Two incoming supervisors change the authority structure in Act 2.

**Interface demand.** Reuse report and consultation surfaces with higher stakes; no new suspicion meter is required.

#### Cortex Assembly and Brain 2.0

*Act transition; beyond the first session*

**Player perceives.** A funded, functioning prototype project. Its purpose is not disclosed to the player at first-shift entry. Thought access later reveals existing histories under a defined knowledge policy.

**Player can influence.** Invest and complete the chain; later use newly available inspection and social interventions.

**Engine resolves.** Track prerequisites, progress and the actual population throughout Act 1. Completion grants specified capabilities and projections; it does not generate past beliefs on demand.

**History carried forward.** The exact workforce, damage, authority and secrets enter Act 2. Interpretation may remain imperfect even with access to thoughts.

**Interface demand.** New depth within the same inspector can reveal much more engine state without replacing the interface.

#### First-floor autonomy and the second floor

*Future handoff, not session scope*

**Player perceives.** A compact operating summary, the current mandate and exceptions that require intervention.

**Player can influence.** Set delegation boundaries and respond to material exceptions while managing the new floor and incoming supervisors.

**Engine resolves.** Continue first-floor work, maintenance, information and relationships. Earned policies govern routine choices; nothing freezes merely because its view is collapsed.

**History carried forward.** Old dependencies and people can still create consequences upstairs. Incoming supervisor roster and endgame remain open.

**Interface demand.** More world activity can coincide with fewer routine controls. Delegation reduces attention demand, not simulation depth.

#### Failure, recovery and episode traces

*First slice, then throughout progression*

**Player perceives.** Damage and actionable warning before terminal loss; afterward, a concise account tied to observed events and decisions.

**Player can influence.** Choose a costly recovery while one exists; inspect permitted causes, resume or end a failed run explicitly.

**Engine resolves.** Evaluate viability and recovery options; persist causal event links, commands, interpretation/admission records and seeded outcomes. Select matching art and recaps from events rather than forcing events to fit art.

**History carried forward.** Recovery leaves a cost and redirects choices. Episodes collect a meaningful conflict across shifts without manufacturing betrayal or accidents.

**Interface demand.** A compact debrief and optional deeper history. Full developer traces must not leak into player recaps.

### One order through the world

**UI.** The director authorizes a stop after a visible fault. Show submitted and then accepted or rejected; a stop does not imply restoration.

**Engine.** Validate the command and apply the stop at its boundary. Output and exposure change; existing damage remains. Repair requires a separate engineering action, available only from Part 03.

**Minds and information.** Witnesses learn what occurred. Limen may interpret the support as backing procedure; Stiletto may see a threatened delivery. Each receives only available evidence and updates plans through the existing rules.

**Projection.** Publish permitted changes, an attributed report and any actionable decision. Private confidence, loyalty and undisclosed knowledge remain off the player stream.

**Presentation.** Both factory views show the same stoppage and its physical progress. A later scene depicts the resulting initiative or dispute, using the event’s participants and outcome.

**Next shift.** The consultation can address the incident. A future stop or refusal links back to the stored precedent; the episode inspector can expose that link when the player is allowed to know it.

### Projection contract

**Canonical state.** The headless kernel owns physical, cognitive and social state. Some systems resolve each step; perception and plan reconsideration can be triggered by relevant events. More state does not imply an LLM call for every entity every tick. Engineering capability and irreversible daily allocations are authoritative constraints, not UI conventions.

**Observation and projection.** Build player-visible facts and attributed accounts from the knowledge policy. Use explicit observed/reported/inferred status, event provenance and stable IDs. Filter before transport, not with CSS.

**Action and decision contract.** A proposed action declares target, preconditions, timing and known costs. The engine returns acceptance/rejection and later execution outcome. A supervisor’s in-world refusal is an outcome, not a network failure.

**KVP and presentation.** Deliver versioned snapshots, ordered changes and semantic events. Renderers interpolate and select art. Pause prompts refer to an authoritative decision boundary; an animation cannot apply a gameplay effect twice.

**Model service.** Interpretation, dialogue and recap requests use scoped context. Validate and record admitted contributions. Renderer speed and fresh text must not retroactively change committed outcomes.

**History and evaluation.** Link action, perceived evidence, selected intention and physical result. Player recaps use allowed evidence; developer tools inspect complete traces and compare model or rule changes.

### Progression

**Entry.** Engine: individual worker history, wear, two supervisors and irreversible weekly-quota/factory allocations. UI: opening facts, adviser choice before placements, quota deadline, room activity and daily allocation. No repair controls or hidden conditioning readout.

**New rooms.** Add a working production or social function. Reveal its new decision only when the player has earned and can use it; retain the same selection, action and evidence patterns.

**Engineering.** Part 03 adds repair to eligible room actions when Witch arrives. Her engineering time competes with the Brewery; early accumulated damage is now actionable.

**Brain 2.0.** Expose permitted internal histories and new ways to intervene. This is a change in knowledge and agency over an existing society.

**Delegation.** Continue detailed operation under policies while collapsing routine UI into summaries and exceptions. The second floor should not double routine clicking.

### Playable slice checks

- Implement enough hidden state for one earlier decision to change a later supervisor action. A generic “relationship” score or flavour-only quote does not prove this.
- Test the same command/event contract through a room view, a minimal animated view and a headless replay. Placeholders are adequate for missing scenes.
- Include a safe route, a risk route and one recoverable setback with a visible cost. Use controlled fixtures to exercise branches without forcing them in every run.
- Check the complete chain: order → physical result → witnessed evidence → interpretation → later intention → new action → player-visible consequence.
- Add engine state only when it supports a behaviour, consequence, observation or test. Deferring a feature is different from fabricating its history at an unlock.
- Exercise an early safety and output path without any repair command. Introduce engineering only with Part 03 and verify that the inherited condition changes Witch’s work priorities.
- Preserve unindoctrinated worker histories through Theatre opening and later Act 2 inspection; test early supervisor disclosure without leaking hidden state in the player projection.

### Legacy and new direction

The old Sim Sim UX and Director Console UI specs are useful sources for the six-room view, phase clarity and tactile art direction. Their short days, swap budget, visible stress/discipline gauges, automated-only worker assignment and permanently sealed Cortex are not adopted by default. The new design uses continuous shifts, progressive rooms and restricted Act 1 knowledge.

[Original UX](sources/legacy-ux.md) · [Original UI](sources/legacy-ui.md)

### Open UI decisions

- Which staffing orders are direct, and which are requests mediated by Security or another supervisor?
- Which situations require a decision pause, which can be delegated, and how do manual pause/speed controls behave?
- How much can the director infer from a room before consulting someone, and what evidence becomes available after Brain 2.0?
- Which follow-up questions and reassurance/blame responses fit into the daily adviser briefing without allowing a player-defined priority or a second adviser?
- Which conditions count as mastery and viable recovery? Decide these before fixing shift duration or session unlock expectations.

## The daily adviser decision

Day one begins with the handover, a weekly quota and no assignments. Choose the adviser first; they choose the priority and propose the initial arrangement. Later days begin with yesterday’s results. Their room receives automatic event authority after assignments take effect.

*Agreed core loop · proposed UI details and model budget*

### Planning loop

**Read the facts.** Day one shows funds, worker count, known condition and the weekly quota, with every assignment empty. Later days show yesterday’s direct results, permanent allocations and remaining quota.

**Choose the adviser.** This is the primary daily choice. Compare known expertise, habitual concerns, recent observable conduct and prior advice. Choosing them for advice does not automatically move their room assignment.

**Hear their assessment.** The adviser assesses current conditions on day one or yesterday’s results thereafter, adds attributed context, chooses a priority and proposes placements or operating responses. The player cannot submit a priority.

**Accept or override.** Authorize or override the proposed assignments. There is no roster to carry over on day one. Later, keeping a previous placement against the adviser’s recommendation is an override with remembered consequences.

**Run under their judgment.** The adviser proposes responses throughout the day. Events in their assigned room resolve automatically under their judgment; response decisions elsewhere present their default for the player to accept or override. Results and relationship memories feed tomorrow’s report.

### Interaction rules

**One primary choice each day.** The normal planning sequence includes one adviser selection before the shift. Inspecting a portrait or known record is free. Proposed commitment control: Choose and hear briefing commits the daily selection; reopening the briefing does not select another adviser or reroll it.

**The adviser owns the priority.** The player chooses a person, not a target for that person to optimize. Their knowledge, expertise, stress, relationships and motives determine what they consider urgent. A different priority means choosing a different adviser on a subsequent day; there is no same-day shopping through full proposals.

**The factual report stays factual.** Directly revealed totals and recorded events are mechanically authoritative. Their causes, severity forecasts, hidden history and personal interpretations are separate. An adviser may challenge an explanation or add a claim, but cannot rewrite yesterday’s displayed delivery count.

**Assessment and additional context.** Early advisers explain the factory sincerely and help the player learn. Expertise can still be incomplete. Later omissions, exaggeration or deliberate falsehood emerge from recorded beliefs, pressures and motives; deception does not switch on at an arbitrary day.

**Compact proposals.** Show one preferred arrangement and highlight a few material changes against the current roster. Keep unchanged positions collapsed. Explain the intended benefit and the cost the adviser admits; deeper records remain available without requiring exhaustive room-by-room comparison.

**Overrides have a social cost.** The player retains assignment control, but overruling the adviser is a remembered challenge to their judgment or authority. Reaction depends on the importance of the change, confidence, loyalty, stress and past treatment. Consequences must remain proportionate enough for disagreement to be a viable decision.

**One conversation with a purpose.** Questions, reassurance, blame or promises respond to the chosen adviser’s assessment and proposed actions. They can affect relationships without letting the player replace the adviser’s priority. Exact follow-up limits remain open; ordinary event recommendations are part of the daily role, not extra adviser selections.

**Orders still require execution.** An accepted recommendation or player override becomes a recorded order, not a guaranteed forecast or guaranteed obedience. The supervisor doing the work can interpret, cooperate with or resist it through the existing BDI rules.

**Available capability.** Advisers can only propose actions permitted at the current stage. Limen, Stiletto and Cathexis cannot repair; engineering arrives with Witch. Advice cannot recall committed quota units or turn retained workers back into deliverable stock.

### Interface

**Morning hierarchy.** Paused Factory planning opens with the handover and weekly quota, then Choose today’s adviser. No assignments exist until the adviser proposes them and orders are accepted. Later days show Yesterday’s results first; placement controls remain secondary.

**Choosing with usable evidence.** Each candidate shows a portrait, a short known specialty, a familiar tendency and its usual cost, plus a recent observed example when available. Open a dossier for more. No hidden loyalty scores, omniscient suitability ranking or previews of every candidate’s actual briefing.

**The authority preview.** Before committing, show the adviser’s current assigned room and state: Events here will be resolved automatically by this supervisor. Their advisory role and room assignment remain separate; an effective reassignment updates the delegation scope.

**The briefing.** Keep a compact factual strip above the attributed assessment, additional context, Today’s priority and Proposed moves. Claims and forecasts are visibly attributed to the speaker; the UI does not label an undiscovered lie. Use their portrait, voice and tone to carry personality.

**Player actions.** Choose and hear briefing → inspect their plan → Accept arrangement or Override assignments → Start shift. There is no priority picker. Follow-up questions concern their reasoning; they do not request a new optimization goal.

**During the shift.** Keep the chosen adviser and their delegated room visible. Their room’s decisions enter the feed as resolved with an explanation and consequence. Other-room response decisions open with their recommendation selected; the player accepts or overrides. Consequential choices pause; simulation ticks and decorative events do not each demand a prompt.

**Shared and mobile views.** Both factory views highlight proposed changes and the room under automatic authority. Mobile presents results, adviser cards and briefing in sequence, with one room inspector at a time. Preserve the same decisions and delegation warning.

**What follows the decision.** Records link the original recommendation, player edits, actual execution and revealed results. The next report keeps hard facts separate from the adviser’s interpretation. Later disclosures can explain a previous failure using the history that already existed.

### Choosing and learning

**Limen.** Procedure and controlled access. Useful when order or safe coordination is in question; his response can cost speed and discretion.

**Stiletto.** Output and delivery. Useful when flow and deadlines dominate the visible problem; her approach can carry wear, exposure and overconfidence.

**Cathexis.** Belief, coordination and influence. Useful when the workforce’s collective response matters; success can increase her independent authority.

**Rivet Witch.** Faults, repair and technical integrity. Useful when the chain keeps breaking; thorough work can consume today’s output and available time.

**Thrum.** Worker strain, resonance and relief. Useful when the workforce needs recovery; his approach can reduce productive time and discipline.

**Learn the choice before doubting the speaker.** Begin with Limen and Stiletto giving sincere, comprehensible assessments. Their different priorities still carry real costs. Establish what facts mean, what each notices and how their recommendation changes work.

**Gain evidence through use.** After a shift, connect the chosen adviser’s priority, actions and one visible benefit or cost. Preserve a short record of their advice. Do not reduce reliability to a universal success score when changing conditions and player overrides matter.

**Introduce uncertainty through the factory.** As rooms and social pressures develop, advisers help identify bottlenecks and risks the player cannot easily compare. Their changing inner state can make a previously useful tendency excessive, defensive or deceptive.

**Reveal what was missing.** At an appropriate later discovery or run review, show what an earlier adviser knew or believed, what they said, what the player authorized and how it contributed to the outcome. Revelation timing remains open, but the learning payoff is required. It must use preserved history rather than inventing a secret explanation afterward.

### Authority during the day

**Adviser’s assigned room.** Their response resolves automatically. You see what they did and what happened.

**Other rooms and factory-wide decisions.** Their response is proposed. You accept or override; informed supervisors react.

**Recommendation coverage.** For every gameplay event that requires a response, the chosen adviser selects a proposed response from their current knowledge and priorities. This extends the same daily choice into live operation; it does not require an LLM call per event.

**Their assigned room.** Room-local events resolve automatically using their decision. The player sees the action and its aftermath and can change later orders, but does not get a pre-resolution override or a rewind. The automatic authority and its risk are visible before choosing the adviser.

**Other rooms.** The adviser’s response is the default recommendation. The player can accept or override it. The local supervisor remains an actor with their own knowledge, expertise and reaction; the adviser does not become physically present in every room.

**Pauses and global decisions.** Player response decisions outside the delegated room use the agreed pause rhythm; show the default and meaningful alternatives, not an empty choice. Factory-wide events follow this player-decision route. Group connected notices and keep automatic actions in the feed. Exact event granularity remains to be designed.

**Delegation follows effective assignment.** The daily adviser identity is fixed. Their effective room assignment determines automatic room authority; selecting or dragging a draft does not change it. Bind each pending event to the authority in force at its decision boundary, so reassignment cannot undo or reroll an already resolved event. Handover rules remain open.

**Every supervisor has a response.** Record each supervisor’s interpretation of relevant resolutions and overrides. The adviser may feel undermined; a local specialist may feel protected or dismissed; another supervisor may resent the lost output. They do not all receive the same stat change.

**Information still matters.** Supervisors respond to what they witness or learn. Unaware supervisors have no immediate relationship change; later reports can trigger their response. Announced decisions can reach the whole team. This preserves incomplete information without asking the player to reconstruct a rumour network.

**Distinct relationship effects.** Respect for the director’s judgment, loyalty to the director’s intentions and confidence in one’s own judgment can change separately. Peer relationships and worker respect remain distinct. Being backed can increase confidence without making an adviser more loyal; a successful override can later complicate their initial resentment.

### Stiletto advises for the day and runs the conveyor

Authored example after Witch arrives and engineering becomes available. Exact event options and relationship magnitudes are not yet balanced.

**Conveyor event.** A fault calls for a response in Stiletto’s assigned room. She chooses to clear the batch at reduced load. The action resolves automatically and is logged; the player sees what she did and what it cost.

**Brewery event.** Witch encounters a problem in the Brewery. Stiletto recommends keeping output moving. The player gets the proposed response and may instead authorize Witch’s stoppage and repair.

**The override.** Choosing repair records an override of Stiletto’s recommendation. Witch executes or responds to the actual order under her own agency. The original recommendation remains in the record.

**Different reactions.** Stiletto dislikes being overruled. Witch may respect the director for accepting a necessary repair. Limen may welcome the stop procedure while objecting to an improvised access change. Cathexis and Thrum interpret the decision through its effects on workers and their own concerns, when they learn of it.

**Tomorrow and later.** Yesterday’s report shows the actual output, stoppage and costs. The next adviser interprets those facts. Remembered support or humiliation can change future advice, initiative and willingness to cooperate.

### Same pressure, different advice

Authored comparison after all five initial supervisors have arrived and engineering is available. Yesterday’s report shows a daily production shortfall against the plan, conveyor interruptions and time spent on earlier engineering work; the weekly quota is still due ahead. Stiletto currently runs the Conveyor, Limen Security, Cathexis the Theatre, Witch the Brewery and Thrum Weaving. Each potential adviser interprets the same facts. These alternatives are shown together for author review; the player hears only the chosen adviser.

#### Limen — Protect the line through control

**Assessment of yesterday.** The repeated stops show that recovery has not brought the line under control.

**Additional context.** He treats access and restart discipline as part of the problem; the production report alone does not establish that diagnosis.

**Priority they choose.** Restore controlled, safe operation before pursuing recovery output.

> “Let Witch inspect it before we restart. I will keep the floor clear. Stiletto can recover the delivery once the line is released.”

**Move.** Witch: Brewery → conveyor inspection; accept the temporary substrate loss.

**Keep and constrain.** Limen stays in Security. Stiletto retains the conveyor assignment, with restart conditional on the inspection.

**Operating tradeoff.** A bounded stoppage may prevent worse damage. Substrate production stalls and Stiletto loses discretion over restarting.

**Author-only causal interpretation.**

**Belief.** The reported fault is credible; controlled access makes the inspection dependable.

**Priority.** Protect the line and maintain procedural authority.

**Alternative rejected.** Finishing the batch first leaves a risk he is unwilling to authorize.

**Personal stake.** His checkpoint remains central to the solution. He may sincerely underweight delays caused by his own restrictions.

**Statement choice.** Explains the inspection and restart condition; frames Security’s control as necessary coordination.

#### Stiletto — Preserve output and present competence

**Assessment of yesterday.** The missed delivery is the immediate failure. Full stoppages consumed time that could have completed useful work.

**Additional context.** She believes the remaining batch can be cleared safely at reduced load. That is her estimate, not a fact established by yesterday’s totals.

**Priority they choose.** Recover output and protect the next delivery.

> “Keep Witch on substrate while I clear this batch at reduced load. Then she gets the line. Don’t stop three rooms to solve one problem.”

**Keep.** Retain the current roster for a short, conditional batch-clearing phase.

**Schedule.** Reduce conveyor load now; move Witch for inspection at the agreed stop boundary.

**Operating tradeoff.** Preserves near-term production if her estimate of the fault is sound. Continued operation retains exposure; inspection and the later loss of Brewery output still happen.

**Author-only causal interpretation.**

**Belief.** The warning does not yet justify an immediate full stoppage; the current batch can be cleared.

**Priority.** Protect delivery and demonstrate that she can handle the line.

**Alternative rejected.** An immediate stop sacrifices output before she considers it necessary.

**Personal stake.** A successful recovery strengthens her standing. Under replacement anxiety, that can make her overconfident or selective about warnings.

**Statement choice.** Emphasizes the cost of disrupting several rooms. Whether she admits, overlooks or conceals a warning depends on her actual knowledge and intent.

#### Rivet Witch — Remove the recurring defect

**Assessment of yesterday.** Earlier engineering time has not removed the recurring fault. Repeated interruptions suggest the underlying defect remains.

**Additional context.** She believes earlier work treated symptoms. Whether that diagnosis is sound depends on her observations and the actual fault history.

**Priority they choose.** Complete the repair that keeps recurring before committing more work to the line.

> “The same fault keeps taking your shifts. Put me on the line and let me finish the work.”

**Move.** Witch: Brewery → conveyor repair; request enough time to address the reported underlying defect.

**Change the mandate.** Stiletto holds output recovery until repair completion. Keep the other room assignments unless their own conditions require intervention.

**Operating tradeoff.** Trades immediate output and substrate production for a more durable repair, if her diagnosis is right. The remaining weekly quota may require a different allocation of future production.

**Author-only causal interpretation.**

**Belief.** The visible fault is a recurring defect rather than an isolated stoppage.

**Priority.** Finish a technically sound repair instead of leaving broken work open.

**Alternative rejected.** A quick inspection followed by continued operation risks another unfinished remedy.

**Personal stake.** Completing the repair matters to her independently of today’s target. Technical pride can lead her to overcommit time.

**Statement choice.** Emphasizes repeated lost time and unresolved damage; may understate how hard the weekly obligation becomes.

### Internal decision record

**Factual baseline.** Record the exact direct report presented before selection, its event references and world revision. Keep those facts separate from adviser-only information and beliefs.

**Choice and internal decision.** Record the selected adviser, effective room assignment, their observations, beliefs, stress, relationships and memories, their chosen priority, candidate plans, rejected alternatives and selected arrangement. There is no player-supplied priority input.

**Communication.** Record which context is asserted, omitted, mistaken or knowingly distorted, the reasons for those choices in the structured policy, and the briefing actually delivered. Internal causal traces remain distinct from generated prose and from a model’s private chain of thought.

**Daytime authority and execution.** For each response event, record its room and authority boundary, adviser recommendation, automatic resolution or player acceptance/override, resulting orders and actual execution. Keep local supervisor refusals distinct from the adviser’s decision and from transport errors.

**Supervisor reactions.** For every affected supervisor, record what they learned, their interpretation and any change to respect, loyalty, confidence, stress or intention. Preserve delayed reactions when information arrives later; do not invent knowledge to justify an immediate stat change.

**Learning and revelation.** Link the saved briefing, original forecast, player overrides and actual outcomes. Early UI exposes facts and attributed reasons; later permitted disclosures reveal missing causes using the same stored history.

**Production and capability history.** Preserve each daily allocation, actual programme participation and engineering work. Record which evidence a supervisor saw before inferring missing indoctrination or attributing damage; later revelation must use the same history.

### Optimization and engine boundary

**Adviser sets the objective.** BDI concerns, expertise, beliefs and current pressures select what the adviser thinks matters today. A bounded planner compares plausible arrangements under that objective and the factory’s real rules. The player selects the adviser and can override placements, but does not submit an optimization target.

**Plans use limited knowledge.** Use the adviser’s observations and estimates to score candidates. A separate authoritative validator checks orders. Do not optimize with secret world truth and then merely attach biased dialogue. Hard constraints and visible rejection reasons must respect player knowledge.

**Continuous advice with room authority.** Use the same adviser’s policy to propose responses to new events. Resolve their room’s events automatically; submit other-room/global response decisions to the player with their default. Commands execute once at defined boundaries and can produce further consequences.

**Reactions are part of simulation.** Apply responses through each supervisor’s own interpretation, not a universal approval bonus or override penalty. Dislike of being overruled is real; its degree and later consequences depend on character, importance and remembered outcomes.

**Model reasoning must earn inclusion.** Use authored deterministic BDI as the baseline. Generated prose alone changes presentation. Separately test whether validated model interpretations connect history and evidence to better priorities, claims or actions. Only admitted contributions can affect state; fluent explanations do not demonstrate better reasoning.

**Replay and fallback.** Persist the structured decisions and the delivered text. Cache against the relevant state and adviser version so reopening does not reroll advice. Missing, late or invalid generated prose falls back to a complete character-specific briefing; simulation and event resolution remain operational.

### Generated prose and budget

**Where a call earns its cost.** One combined morning briefing can connect yesterday’s facts to relevant memory, added context, chosen priority and a concise proposal in a distinctive voice. This is a stronger use than separate calls for each move, stat or routine notice.

**Proposed prototype allowance.** Target one briefing call per game day, with up to about 2,500 input tokens and 450 output tokens including structured fields; aim for roughly 100–150 visible words. These are initial budgeting and readability targets to test, not current measured usage.

**During the day.** Routine recommendations, automatic resolutions and short reactions use deterministic policies and authored variations. Optionally reserve one extra generated reaction for a pivotal incident or override. At the same token caps, that puts the proposed ceiling at two calls, 5,000 input tokens and 900 output tokens per game day.

**Cost accounting.** With provider prices P_in and P_out per million tokens, the two-call token allowance costs at most (5,000 × P_in + 900 × P_out) / 1,000,000 before any separately billed features. Select current model/prices before setting a dollar cap. Track actual input/output, retries, latency and fallback rate; retries spend the same allowance. No paid calls are being made by this design board.

**Scope and evaluation.** Only generate the selected adviser’s briefing. Compare authored BDI, authored BDI with model prose, and admitted model interpretation on matched fixtures. Check useful decisions, character continuity, knowledge leakage, causal clarity, owner-rated enjoyment, latency and cost. Reasoning receives a measured budget only if it improves play.

### Guardrails

- The daily choice must be understandable and enjoyable to play. A technically sophisticated trace does not justify vague actions, confusing token movement or a briefing that feels like homework.
- The player should be able to say before starting the shift: I chose this adviser because of this known tendency, and I understand which room I delegated to them.
- No priority selector or conversation workaround lets the player turn the chosen adviser into any other adviser. Placement overrides remain available and have social consequences.
- Early advice must be sincere, useful and readable. Later deception must have a recorded motive or mistaken belief; a novel line of generated prose cannot invent a betrayal.
- Choosing an adviser must change priorities or responses, not only dialogue. It need not cause unnecessary reassignment when the current arrangement is sensible.
- Override costs must be meaningful and proportionate. The player can knowingly reject bad advice; neither universal obedience nor constant opposition should dominate every situation.
- Do not display every possible allocation, every private motive or a graph of rumour sources. Clear facts, a legible adviser choice and a few consequential actions carry the first playable loop.
- Show automatic decisions and their effects clearly. Missing a brief animation must not prevent learning what the delegated adviser did.
- The later reveal must explain earlier events from stored evidence, including the player’s own edits and other supervisors’ actual execution. It must not blame advice for a different plan the player imposed.

### First playable test

First slice: unassigned Limen and Stiletto, Conveyor and Security, the factual handover and weekly quota. Test adviser-first planning, own-room authority, overrides elsewhere and irreversible daily allocation without repair controls. Carry different early histories to Witch’s engineering unlock, and test a supervisor’s earned discovery of missing indoctrination. The owner judges clarity and enjoyment in the actual playable loop.

### Open decisions

- Which room events deserve an explicit response, and which outside-room decisions can be grouped without hiding their consequences?
- How long is the daily briefing, and which follow-up questions or relationship responses fit within its budget?
- How do importance, repeated disagreement and later success alter the adviser’s resentment and the other supervisors’ responses?
- When does the later learning reveal occur, and what becomes accessible during the run versus afterward?
- How do effective room reassignment and handover affect automatic authority for events already pending?
- Which model meets the briefing quality bar at the chosen token and dollar allowance? Benchmark before selecting it.

## Simple communication for meaningful and enjoyable play

Players should understand why they are choosing, what they are authorizing and how to read the result. The simulation can contain much more than the interface reveals. Its depth earns its place by creating decisions and consequences that are enjoyable to play.

**Make the central choice visible.** Day one: handover and weekly quota → choose adviser → hear priority and first arrangement → accept or override → run → permanently allocate output. Later days substitute yesterday’s results for the opening handover.

**Say what the action means.** Use concrete labels such as Accept Stiletto’s arrangement or Stop the Brewery for Witch’s repair. Explain the known operational sacrifice and who is being overruled. Avoid vague dialogue stances whose mechanical commitment is impossible to infer.

**Show authority before consequences.** Mark the adviser’s assigned room as automatically managed. Other-room response decisions clearly show their recommendation and the player’s override. A token move changes a named person’s work and may change delegated authority; make both meanings visible.

**Reveal what helps the next decision.** Keep immediate facts, stated reasons, known costs and relevant uncertainty close to the action. Let hidden beliefs, stress, relationships and accumulated history operate beneath it. Do not expose every variable or require players to reconstruct the whole system.

**Let consequences teach.** Show a recognizable change in work, a specific reaction or a remembered incident. A brief later explanation connects it to the choice. Delayed revelations deepen the player’s understanding without pretending the missing information was available earlier.

**Enjoyment is the acceptance criterion.** A readable interface and a consistent simulation are necessary but do not establish that the game is fun. The first end-to-end prototype must be played and judged by the owner; revise the loop around that experience before expanding it for a real audience.

In the first playtest, ask the owner whether choosing an adviser feels consequential, their plan is worth considering, overrides are tempting despite their cost, the factory is enjoyable to watch and the result creates interest in the next day. Observe confusion and unwanted reading or clicking; a complete specification or a passed automated test cannot substitute for that judgement.

## Approved shift rhythm

**Plan while paused.** On day one, show the handover, weekly quota and empty assignments; choose the adviser first. On later days, review yesterday’s facts before choosing. Hear the adviser’s assessment and priority, accept or override their arrangement, then start the shift.

**Run the shift.** The factory advances on authoritative simulation ticks. Production, movement, wear, stress and information exchange resolve during the shift.

**Pause for a decision.** Events in the chosen adviser’s assigned room resolve automatically under their authority. A response decision elsewhere or at factory level pauses at a defined boundary with their recommendation selected; the player accepts or overrides, then watches the consequences.

**Close the shift.** Review output, losses, commitments and unresolved tensions. Their consequences become the next shift’s starting conditions. Exact end-of-shift decisions remain to design.

## Attention horizons

**1 second.** Is this working as I intended?

**1 minute.** Which problem should I solve, and what will that cost?

**30 minutes.** What kind of factory did my successful decisions create?

One second, one minute and thirty minutes describe player attention and payoff. They are not simulation tick rates, forced event intervals or room-unlock timers. Session design stops before the full-run structure.

[Core loops and sessions](GAME_DESIGN.md#core-loops-and-sessions)

## Mobile and art

On mobile, the room overview reflows into readable cards and a focused room. The animated view offers pan, zoom and selection with a reachable inspector. Preserve the full decision loop when motion is reduced or the graphics view is unavailable.

**Preserve the art direction.** Weathered metal, dense machinery, convincing material and light. Use a bounded camera so painted rooms and characters retain their intended perspective.

**Give light something to hit.** Use simple real geometry for floors, walls, major machines and occluders. Layer existing artwork where it holds up. A flat, already-lit image cannot automatically produce correct moving shadows or new camera angles.

**Use honest placeholders.** Each missing scene has a slot tied to room, participants, action, visible outcome and camera. Show a neutral placeholder with an accurate event description instead of unrelated success or disaster art.

**Generate to actual need.** Cover ordinary work, warnings and incident consequences in the first rooms. Introduce repair scenes with Witch in Part 03. Reuse suitable assets; generate gaps exposed by real trajectories rather than a full Cartesian product.

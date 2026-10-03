export type Deck = "overview" | "architecture";
export type Exhibit =
  | "premise"
  | "factory"
  | "cast"
  | "shift"
  | "pipeline"
  | "ownership"
  | "alive"
  | "cost"
  | "evals"
  | "replay"
  | "bdi";
export type Chapter = {
  id: string;
  title: string;
  kicker: string;
  heading: string;
  lead: string;
  art: string;
  caption: string;
  exhibit?: Exhibit;
  sections: { title: string; body: string }[];
  principle: string;
  sources?: { label: string; href: string }[];
};
export const deckNames: Record<Deck, string> = {
  overview: "Inside the factory",
  architecture: "Inside the engine",
};
export const overview: Chapter[] = [
  {
    id: "the-factory",
    title: "The factory",
    kicker: "A workplace dystopia, with a production quota",
    heading: "Manufacture minds.\nManage the consequences.",
    lead: "You run a factory that builds artificial brains. The machines have opinions. The supervisors have agendas. Tomorrow’s quota has already arrived.",
    art: "entrance",
    caption: "Factory entrance · original Loopforge concept art",
    sections: [
      {
        title: "A robot drama machine",
        body: "Loopforge is a management game about a factory that cannot separate its output from its inhabitants. You assign authority, choose a production doctrine and absorb the consequences. Efficiency creates pressure; pressure gives the cast something to disagree about.",
      },
      {
        title: "A place that remembers",
        body: "The appeal is a legible chain of causes with an unpredictable social texture. A bad shift must be explainable. Who gets the blame can be wonderfully unreliable. The production ledger is evidence; the conversation around it is character.",
      },
    ],
    principle: "Truth stays clean. Story gets messy.",
  },
  {
    id: "the-director",
    title: "The director",
    kicker: "Your role / limited authority",
    heading: "You can move people.\nYou cannot make them agree.",
    lead: "A director’s power is indirect: choose who runs each room, set the tempo, then live with the result.",
    art: "factory",
    caption: "The factory as a system · original concept art",
    exhibit: "shift",
    sections: [
      {
        title: "Decisions with a shadow",
        body: "Throughput is visible now. Strain follows you into the next shift. Care can recover capacity at the cost of immediate output. The teaching prototype makes this tension explicit: eight shifts, five supervisors and a finite window to meet the order.",
      },
      {
        title: "Understand before you optimize",
        body: "Every shift produces a ledger of accepted inputs and resulting events. A player can inspect what changed and why. The ideal reaction is ‘I see what I did, and I want to try another way.’",
      },
    ],
    principle: "The player chooses policy. The engine resolves consequences.",
  },
  {
    id: "the-cast",
    title: "The cast",
    kicker: "Five supervisors / five ways to be right",
    heading: "An organization chart\nwith unresolved grievances.",
    lead: "The factory’s strongest personalities are also its most useful equipment. Their expertise is real. Their interpretation of events is partial.",
    art: "conflict",
    caption: "Limen and Stiletto at the conveyor · original concept art",
    exhibit: "cast",
    sections: [
      {
        title: "Character begins with constraints",
        body: "Limen protects procedure. Stiletto protects the schedule. Cathexis wants work to mean something. Rivet Witch keeps the impossible running. Thrum listens for the fault everyone else has learned to ignore. These are authored motives before they are model prompts.",
      },
      {
        title: "Voice is not authority",
        body: "A supervisor may claim credit, conceal embarrassment or disagree about a failure. Those lines are dramatic interpretations. They do not rewrite output, undo an assignment or create a new resource. The player can always turn back to the ledger.",
      },
    ],
    principle: "A reliable world can contain unreliable witnesses.",
  },
  {
    id: "the-rooms",
    title: "The rooms",
    kicker: "Production geography / a tour of the line",
    heading: "Every room makes\na different kind of trouble.",
    lead: "Security controls entry. The forge forms a lattice. The theatre tests it. The brewery grows substrate. The gallery weaves a mind.",
    art: "lanes",
    caption: "Three production lanes · original concept art",
    exhibit: "factory",
    sections: [
      {
        title: "A physical vocabulary",
        body: "Conveyors, inspection windows, reservoirs and return paths connect the factory. Rooms should read as parts of one process, even when their visual character changes. A belt is both a machine and a way to make dependencies visible.",
      },
      {
        title: "The sixth room stays closed",
        body: "Cortex Assembly is a locked horizon in the current material. It remains closed here. The five active rooms form a compressed teaching model; their scores are a new design, not a claim about the older Python economy.",
      },
    ],
    principle:
      "A small, coherent factory is more useful than a large, unexplained one.",
  },
  {
    id: "one-shift",
    title: "One shift",
    kicker: "The playable loop / eight decisions",
    heading: "Give the order.\nWatch it become history.",
    lead: "Staff the rooms, choose a doctrine and resolve the shift. The factory answers with facts first. The cast responds in its own time.",
    art: "forge",
    caption: "Synaptic Lattice Forge · original concept art",
    exhibit: "shift",
    sections: [
      {
        title: "Three clocks, one world",
        body: "Simulation time advances only on an accepted shift command. The interface keeps moving between shifts: belts turn, signals settle, rooms remain present. Narrative arrives on a third clock, after the facts are committed. None of these clocks has to wait for the others.",
      },
      {
        title: "An invitation to replay",
        body: "The same seed and commands reproduce the same mechanical outcome. Change an assignment or a doctrine to test another policy. Model prose is stored as a record of that telling; asking a model again is not deterministic replay.",
      },
    ],
    principle: "A late line of dialogue must never make the factory late.",
  },
  {
    id: "friction",
    title: "Friction",
    kicker: "Drama / competing interpretations",
    heading: "A clean ledger.\nA very untidy meeting.",
    lead: "The most productive room can still be the least trusted one. The game lives in the gap between what happened and what it meant to someone.",
    art: "brewery",
    caption: "Rivet Witch’s Cognition Substrate Brewery · original concept art",
    exhibit: "alive",
    sections: [
      {
        title: "Designed tension, generated expression",
        body: "A deterministic event can say that strain rose while output exceeded target. That is enough for a scheduler to select a pressure beat. A language model can then give the moment a voice. It is not responsible for deciding whether the factory succeeded.",
      },
      {
        title: "Life has more than one source",
        body: "Persistent motives, routines, visible consequences and callbacks can make characters feel present without continuous model calls. Free conversation offers responsiveness, but also adds latency, memory obligations and opportunities for contradiction. That is an experiment to evaluate, not an automatic upgrade.",
      },
    ],
    principle: "Spend generation on moments that deserve interpretation.",
  },
  {
    id: "the-economy",
    title: "The economy",
    kicker: "Pressure / recovery / a finite order",
    heading: "The quota is simple.\nThe bargain is not.",
    lead: "Produce 240 units in eight shifts. Pressure increases output today and strain tomorrow. Care gives some capacity back.",
    art: "weaving",
    caption: "Synapse Weaving Gallery · original concept art",
    exhibit: "shift",
    sections: [
      {
        title: "A teaching economy",
        body: "This prototype uses integer output, bounded strain and deterministic disturbances. There is no monetization or hidden model-controlled stat. Room expertise helps; pushing hard has a visible future cost. The numbers are exposed so design discussions can be checked against the actual rules.",
      },
      {
        title: "A learning instrument",
        body: "An eight-shift run is short enough to finish, inspect and repeat. Compare policies across seeds before expanding the economy. A larger content library or a more eloquent narrator cannot rescue decisions with no meaningful tradeoff.",
      },
    ],
    principle: "Balance the decisions before expanding the spectacle.",
  },
  {
    id: "the-prototype",
    title: "Enter the prototype",
    kicker: "From a presentation to a playable argument",
    heading: "Take the director’s chair.",
    lead: "A small factory. An actual simulation. A separate narrative channel. The prototype exists to test whether those parts make a compelling whole.",
    art: "theatre",
    caption: "Burn-in Theatre · original concept art",
    exhibit: "replay",
    sections: [
      {
        title: "What this slice proves",
        body: "The new TypeScript kernel owns a complete bounded run. The console presents its state and sends commands. Narration can be connected through a server-only OpenAI adapter; availability is shown honestly. The archived project remains reference material, not a dependency of this running slice.",
      },
      {
        title: "What comes next",
        body: "Measure whether players can explain consequences, distinguish the cast and remember a moment they caused. Then test richer motives, more consequential rooms and optional dialogue. The engine presentation explains the boundaries that let those experiments stay reversible.",
      },
    ],
    principle:
      "A prototype should answer a question, not impersonate a finished world.",
  },
];
export const architecture: Chapter[] = [
  {
    id: "the-thesis",
    title: "The thesis",
    kicker: "Engine architecture / LLM-enabled narrative",
    heading: "Truth stays clean.\nStory gets messy.",
    lead: "A deterministic factory owns what happened. A narrative system decides how its inhabitants talk about it. The language model never holds up the production line.",
    art: "forge",
    caption: "A production line is an authority boundary, not just a metaphor",
    exhibit: "pipeline",
    sections: [
      {
        title: "Separate consequence from expression",
        body: "Commands enter a bounded simulation and produce committed events. Those events feed two consumers: the interface, which must be immediately correct, and a narrative sidecar, which may arrive later. A narrator can fail without invalidating a shift.",
      },
      {
        title: "The Rust-native mindset",
        body: "One owner of authoritative state. Explicit types and transitions. Bounded memory and work. Errors as expected outcomes. Determinism as a testable contract. These are system design choices retained even when the teaching implementation is TypeScript.",
      },
    ],
    principle: "The hot path ends at the committed event, not the final word.",
  },
  {
    id: "state-and-ownership",
    title: "State & ownership",
    kicker: "An ECS discipline / without pretending to be Rust",
    heading: "Give every fact\none place to live.",
    lead: "Entities have stable identities. Components hold serializable data. Systems transform that data in a documented order. Views own neither the world nor its rules.",
    art: "factory",
    caption: "One world, multiple views · original concept art",
    exhibit: "ownership",
    sections: [
      {
        title: "Data first; behavior at the boundary",
        body: "The legacy simulation provides a richer entity-and-component world. This slice uses compact records with an ECS-style separation of data and ordered systems; it does not claim an archetype ECS or a borrow checker. A single transition function is the route to a new authoritative state.",
      },
      {
        title: "What TypeScript cannot promise",
        body: "Readonly types help callers, but do not enforce Rust’s ownership or memory safety model. Runtime validation checks commands; tests check immutability and invariants. Keep arithmetic and JSON contracts explicit so a later Rust/WASM implementation can use the same fixtures.",
      },
    ],
    principle: "Borrow the discipline. Be precise about the guarantees.",
    sources: [
      {
        label: "Rust: ownership",
        href: "https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html",
      },
    ],
  },
  {
    id: "commands-and-events",
    title: "Commands & events",
    kicker: "A command is a request / an event is a fact",
    heading: "Validate intention.\nCommit consequence.",
    lead: "A player requests a staffing plan and doctrine. The engine accepts the whole command or returns a typed failure. Only accepted commands enter replay history.",
    art: "security",
    caption: "Access Control · original concept art",
    exhibit: "pipeline",
    sections: [
      {
        title: "A bounded transaction",
        body: "Check version, phase, unique supervisor assignment and command shape before advancing the PRNG. Resolve expertise, doctrine, disturbance, strain and output in a fixed order. Return new state plus event records; never partially mutate the old state on failure.",
      },
      {
        title: "Events carry evidence",
        body: "A shift event includes inputs, output delta and resulting strain. UI and narrative requests refer to that evidence. Future world-affecting AI proposals must return through the same command validator; model text is never a write path.",
      },
    ],
    principle: "The narrator can propose. Only the engine can decide.",
  },
  {
    id: "time-and-replay",
    title: "Time & replay",
    kicker: "Determinism / narrower than ‘everything repeats’",
    heading: "Replay the facts.\nArchive the telling.",
    lead: "Seed, engine version and accepted commands define the mechanical run. The prose belongs to a separate, versioned artifact.",
    art: "weaving",
    caption: "Synapse Weaving Gallery · original concept art",
    exhibit: "replay",
    sections: [
      {
        title: "Make variation explicit",
        body: "The kernel uses a documented unsigned 32-bit generator, bounded integer values and fixed room order. It reads no clock, network, locale or ambient random source. A golden fixture catches changes that would silently alter old runs.",
      },
      {
        title: "Replay is a migration strategy",
        body: "Retain engine version with the seed and commands. Compare state and event fixtures across runtimes. A model seed is not a guarantee of prose identity: retain accepted text, prompt version, model identifier, usage and source event IDs.",
      },
    ],
    principle: "Same inputs must mean the same mechanics, not a similar story.",
  },
  {
    id: "the-narrative-sidecar",
    title: "The narrative sidecar",
    kicker: "Evidence in / character out",
    heading: "Let the model interpret.\nNever let it adjudicate.",
    lead: "The request contains a small evidence packet, an authored motive and a strict output contract. It contains no tool that can change the factory.",
    art: "conflict",
    caption: "Conflicting witnesses can share the same facts",
    exhibit: "pipeline",
    sections: [
      {
        title: "Structure is necessary, not sufficient",
        body: "Structured output constrains fields, speaker IDs and evidence references. It cannot prove that every sentence is faithful. Reject malformed, stale or overlong replies; evaluate factual entailment, voice and repetition separately. Render text as text, never executable markup.",
      },
      {
        title: "Two channels of information",
        body: "Keep the factual ledger separate from attributed speech. Characters can speculate about motives or assign blame; they cannot introduce mechanical outcomes as canonical fact. A failed reply leaves a clear ‘narration unavailable’ state and a fully playable game.",
      },
    ],
    principle: "Schema validity does not equal truthfulness.",
    sources: [
      {
        label: "OpenAI: structured outputs",
        href: "https://developers.openai.com/api/docs/guides/structured-outputs",
      },
    ],
  },
  {
    id: "feeling-alive",
    title: "Feeling alive",
    kicker: "Three clocks / deliberate responsiveness",
    heading: "A living world does not\nneed a model in every tick.",
    lead: "Simulation time, presentation time and narrative time have different jobs. Decoupling them creates a design space, not merely a performance trick.",
    art: "theatre",
    caption: "Burn-in Theatre · timing is part of the performance",
    exhibit: "alive",
    sections: [
      {
        title: "Deterministic life between words",
        body: "Routines, attention shifts, movement and persistent reactions can run from authored state. The renderer interpolates snapshots; it never advances the economy. A narrative scheduler can reserve generation for tension, reversals and meaningful player intervention.",
      },
      {
        title: "The real-time dialogue tradeoff",
        body: "Responsive conversation needs turn-taking, interruption, grounding, permissions and memory. Add an optional conversation lane with a stated deadline and no mechanical authority. If dialogue should change the world, validate a proposal on a later tick. Evaluate whether added agency earns its delay and cost.",
      },
    ],
    principle:
      "Responsiveness is partly computation, partly staging, and partly expectation.",
  },
  {
    id: "memory-and-context",
    title: "Memory & context",
    kicker: "A character remembers / the ledger verifies",
    heading: "Remember selectively.\nForget nothing authoritative.",
    lead: "Mechanical history and a character’s memory are different records. A compact recollection is context, never a replacement for the event log.",
    art: "cathexis",
    caption: "Cathexis · original character study",
    exhibit: "ownership",
    sections: [
      {
        title: "Context as a budgeted view",
        body: "Build packets from current evidence, stable character briefs, salient prior events and unresolved tensions. Retrieval must preserve event IDs, order and speaker knowledge. This slice sends current evidence and authored voice only; it makes no claim of autobiographical memory.",
      },
      {
        title: "Prevent narrative drift",
        body: "Future summaries separate observed facts, beliefs and unresolved claims. Validate references after compaction. Never feed rumor back into canonical state. An exact-result cache includes event, prompt, schema and model versions; semantic similarity alone is insufficient for factual substitution.",
      },
    ],
    principle:
      "A summary can compress a witness. It cannot replace the evidence.",
  },
  {
    id: "cost-and-latency",
    title: "Cost & latency",
    kicker: "A budget is a design constraint",
    heading: "Spend on the moment.\nKeep the line moving.",
    lead: "Most ticks deserve no model call. A short, distinctive reaction to a consequential event can carry more value than continuous generic chatter.",
    art: "brewery",
    caption: "The narrative budget is another limited resource",
    exhibit: "cost",
    sections: [
      {
        title: "Account for successful moments",
        body: "Measure input, cached input, output and reasoning usage where applicable, including timeout and rejection costs. Track cost per accepted beat and completed run. The calculator uses editable assumptions, not live prices. A provider budget alert is not an enforced spending cap.",
      },
      {
        title: "Budget the slow path",
        body: "Use bounded context, a short output cap and a separate deadline. Deduplicate exact artifacts and reserve quota before paid calls. Shared production needs durable reservations, idempotent job keys and reconciliation of uncertain provider outcomes. The prototype’s paid lane stays disabled until its gate and enforceable budget are configured.",
      },
    ],
    principle:
      "No request is cheaper and faster than a request the game does not need.",
    sources: [
      {
        label: "OpenAI: latency optimization",
        href: "https://developers.openai.com/api/docs/guides/latency-optimization",
      },
      {
        label: "OpenAI: prompt caching",
        href: "https://developers.openai.com/api/docs/guides/prompt-caching",
      },
    ],
  },
  {
    id: "model-selection",
    title: "Model selection",
    kicker: "OpenAI first / portable by evidence",
    heading: "Choose the smallest model\nthat passes the job.",
    lead: "Narrative needs controlled voice, faithful interpretation and low tail latency. General benchmark rankings do not answer that particular question.",
    art: "thrum",
    caption: "Thrum · tuning is a repeatable comparison",
    exhibit: "evals",
    sections: [
      {
        title: "A provider-neutral contract",
        body: "Evidence packets and validated artifacts stay independent of vendor request formats. OpenAI comes first. An Alibaba-hosted or other open-weight model must pass the same faithfulness, voice and failure tests. API compatibility is not behavioral compatibility.",
      },
      {
        title: "Count the whole serving system",
        body: "Compare quantization, constrained decoding, context, throughput and tail latency. Self-hosting adds GPU utilization, batching, warm capacity, operations and licensing. Lower token prices do not necessarily mean lower cost per good story beat.",
      },
    ],
    principle: "A model change is a product change. Evaluate it as one.",
  },
  {
    id: "evaluations",
    title: "Evaluations",
    kicker: "A release gate / not a vibes check",
    heading: "How do we know\nthe new model is better?",
    lead: "Replay a fixed corpus through candidate pipelines. Test hard constraints automatically, then judge the qualities that make a character worth listening to.",
    art: "security",
    caption: "Inspection applies to language as well as machinery",
    exhibit: "evals",
    sections: [
      {
        title: "Correctness and preference",
        body: "Hard checks cover schema, allowed speaker, evidence IDs, length, stale replies and mechanical isolation. Hold out examples of pressure, recovery, empty context, rumors and hostile input. Human-calibrated pairwise review measures factual consistency, distinct voice, consequence recognition and enjoyment.",
      },
      {
        title: "Release with evidence",
        body: "Version engine, fixtures, prompt, schema, adapter and model. Repeat samples; report confidence intervals, p50/p95 latency, rejection and cost per accepted artifact. Calibrate model judges against humans, blind provider labels and check position bias. Canary a passing candidate and retain rollback artifacts. The local harness is a start, not proof of narrative quality.",
      },
    ],
    principle: "A perfect JSON score can still produce a terrible character.",
    sources: [
      {
        label: "OpenAI: evaluation best practices",
        href: "https://developers.openai.com/api/docs/guides/evaluation-best-practices",
      },
    ],
  },
  {
    id: "rendering",
    title: "Rendering & motion",
    kicker: "One visual language / several possible renderers",
    heading: "The renderer sells the world.\nIt does not own the world.",
    lead: "Readable HTML, engineered SVG and carefully prepared art make the first factory tangible. A larger scene can earn a different renderer later.",
    art: "lanes",
    caption: "Art direction comes before the graphics API",
    exhibit: "factory",
    sections: [
      {
        title: "Choose against a scene budget",
        body: "Native layout and SVG keep this console readable and accessible. PixiJS is a candidate for a sprite-heavy 2D factory; Three.js becomes useful when lighting, depth and real 3D matter. Benchmark representative content before migration.",
      },
      {
        title: "Motion is a shared resource",
        body: "A conveyor has a carrying surface, return path, rollers and supported cargo. Pause when offscreen, hidden or reduced motion is requested. Frame time, decode cost and memory belong in the budget. Experimental WebGPU is not a blanket performance promise.",
      },
    ],
    principle: "Use new technology when it improves a measured experience.",
    sources: [
      {
        label: "PixiJS renderers",
        href: "https://pixijs.com/8.x/guides/components/renderers",
      },
      {
        label: "Three.js WebGPU",
        href: "https://threejs.org/manual/pages/webgpurenderer",
      },
    ],
  },
  {
    id: "delivery-and-learning",
    title: "Delivery & learning",
    kicker: "A real vertical slice / an honest boundary",
    heading: "Build the smallest system\nthat can prove you wrong.",
    lead: "A complete run, a grounded narrative lane and repeatable evaluations tell us more than a diagram of an imaginary platform.",
    art: "entrance",
    caption: "Return to the factory, with a testable hypothesis",
    exhibit: "replay",
    sections: [
      {
        title: "Prototype deployment",
        body: "A Next.js frontend and request-scoped server kernel suffice for a turn-based slice. Bounded command histories are reconstructed on every request. They permit explicit replay and forks without relying on a warm process; they are not anti-cheat or a paid-call quota. Persistent worlds need durable ownership, storage and recovery.",
      },
      {
        title: "The next useful iteration",
        body: "Observe whether players understand consequences and feel continuity in the cast. Compare authored-only and model-assisted runs. Measure narrative yield, latency and cost before adding conversation, persistence or richer ECS systems. Unbuilt scaling machinery remains future work.",
      },
    ],
    principle:
      "Keep the evidence. Change the implementation when the evidence asks you to.",
  },
];
architecture.splice(
  4,
  0,
  {
    id: "belief-desire-intention",
    title: "Belief, desire, intention",
    kicker: "The missing layer / BDI as a design discipline",
    heading: "A character needs a reason.\nThen a plan it can keep.",
    lead: "Beliefs describe what an agent knows. Desires represent competing priorities. Intentions are commitments to act, with conditions for continuation, success and abandonment.",
    art: "limen",
    caption: "Limen · procedure as a persistent motive",
    exhibit: "bdi",
    sections: [
      {
        title: "BDI does not require an LLM",
        body: "Observation and belief revision can be deterministic. Desires can come from authored traits and state. A utility policy can select a plan. Slow model deliberation is optional: use it when ambiguity or novelty earns the expense. The original Loopforge has no implemented BDI framework; the new exhibit is a deliberately small deterministic advisory policy.",
      },
      {
        title: "Commitment creates continuity",
        body: "A full agent should retain an intention across ticks, check preconditions and reconsider on meaningful events. Otherwise it is merely selecting a new action every frame. The teaching advisor expires after one shift; it demonstrates beliefs and competing desires without claiming persistent autonomous planning.",
      },
    ],
    principle:
      "The model may suggest a plan. The character needs rules for keeping it.",
    sources: [
      {
        label: "Rao & Georgeff: BDI Agents, From Theory to Practice",
        href: "https://cdn.aaai.org/ICMAS/1995/ICMAS95-042.pdf",
      },
    ],
  },
  {
    id: "intention-admission",
    title: "Intention admission",
    kicker: "Recorded I/O / a second boundary beyond narration",
    heading: "A slow thought can arrive\nin a changed world.",
    lead: "A model-proposed intention is external input. It needs an observation version, agent identity, preconditions, expiry and a place in the authoritative command order.",
    art: "conflict",
    caption: "Disagreement is permitted; conflicting writes are not",
    exhibit: "pipeline",
    sections: [
      {
        title: "Admission is a transaction",
        body: "The future deliberation lane emits a typed proposal, never arbitrary code. At a tick boundary, check ownership, world version, permissions, resource limits and preconditions. Reject stale or invalid proposals, or explicitly request reconsideration. Record accepted tick and total order. A local request timestamp is insufficient to resolve concurrency.",
      },
      {
        title: "Replay the admitted input",
        body: "Arrival time can change a live run. Replay becomes deterministic once the accepted inputs and their order are fixed. Keep rejected proposals and reasons for diagnosis too. Traceability requires this provenance; it does not appear automatically from an append-only log. The current model lane generates speech only and cannot submit intentions.",
      },
    ],
    principle:
      "Deterministic replay means replaying admitted decisions, not asking the oracle again.",
  },
);
architecture.splice(
  architecture.length - 1,
  0,
  {
    id: "kernel-viewer-protocol",
    title: "Kernel–viewer protocol",
    kicker: "Swappable views / explicit synchronization",
    heading: "Many windows.\nOne authoritative world.",
    lead: "A viewer consumes a versioned projection. It sends intent back through the command boundary. Its rendering framework and transport cannot decide the rules.",
    art: "lanes",
    caption: "Multiple views of the same production line",
    exhibit: "ownership",
    sections: [
      {
        title: "Start with a verifiable contract",
        body: "The small turn-based slice returns a complete bounded snapshot over HTTP. A live world needs session and world IDs, schema version, ordered sequence numbers and acknowledged baselines. Apply a delta only to its named baseline; gaps trigger resynchronization. Filter a viewer’s projection before serialization so hidden knowledge cannot leak.",
      },
      {
        title: "Optimize the measured bottleneck",
        body: "WebSockets can carry the same contract when continuous updates justify them. JSON is inspectable and adequate for a small state. FlatBuffers or Cap’n Proto become candidates when profiling shows serialization or bandwidth pressure. Binary encoding does not define delta semantics, ordering, compatibility or recovery for you.",
      },
    ],
    principle:
      "A protocol is a recovery contract as much as a serialization format.",
  },
  {
    id: "scale-and-scheduling",
    title: "Scale & scheduling",
    kicker: "A larger world / a bounded thinking budget",
    heading: "Let many agents act.\nLet a few deliberate.",
    lead: "Deterministic policies handle routine behavior. A budgeted scheduler offers slow deliberation to salient, uncertain or player-visible situations.",
    art: "factory",
    caption: "Factory scale is a scheduling problem in several layers",
    exhibit: "alive",
    sections: [
      {
        title: "Tier intelligence by need",
        body: "Cheap controllers execute persistent intentions every tick. Reconsider only on triggers or deadlines; coalesce duplicate work and enforce per-world and per-agent quotas. Bound queue depth, concurrency and retries. A missed model deadline falls back to the existing valid plan or a deterministic safe policy.",
      },
      {
        title: "Do not assume the simulation is easy",
        body: "ECS helps data locality, but navigation, perception, interactions, interest management and serialization can dominate at scale. Profile representative worlds. Rust with standalone bevy_ecs or hecs is a credible future core; explicit schedule and iteration order still matter. Python or TypeScript can host slow planners; orchestration frameworks are optional, not the architecture.",
      },
    ],
    principle: "Bound work in every layer, including the supposedly cheap one.",
    sources: [
      {
        label: "Bevy ECS system ordering",
        href: "https://docs.rs/bevy_ecs/latest/bevy_ecs/system/index.html",
      },
    ],
  },
);
export const decks: Record<Deck, Chapter[]> = { overview, architecture };

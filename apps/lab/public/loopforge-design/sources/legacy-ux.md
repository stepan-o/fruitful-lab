# Loopforge Sim Sim UX Spec v1 (Drop-in Replacement)

**“Truth stays clean. Story gets messy.”**
A **tactical supervisor-placement puzzle** rendered as an **interactive comic** about a rust-goth AI brain factory—built to be replayed for **vibe, drama, and “one more day.”**

> **Key v1 simplification:** **Worker assignment is not a player input.** Worker dispatch is **automated** based on sim rules and **who the player assigns to Security**.

---

## 0) Product intention

Sim Sim v1 must feel like:

* A **video game** (juicy, responsive, ceremonial), not a dashboard.
* A **comic book you can play** (panels, reveals, barks, stamps, mood shifts).
* A **short-run management roguelike** loop where you can finish a run in a sitting, then replay to see different regime arcs.

### v1 goals

1. **20–45 seconds** for a calm day; **90–120 seconds** for a day with a major event.
2. The player always understands:

    * **What phase they’re in**
    * **What action matters next**
    * **What they’re risking** (in bands)
    * **What changed** (in a recap strip)
3. The player wants to replay for:

    * supervisor playstyles
    * critical events
    * conflict drama
    * mood and spectacle

---

## 1) Reference points (what we’re stealing)

Use these as design north stars for specific problems:

### Assignment + clarity

* **FTL**: crew assignment feel, room highlighting, instant feedback
* **Into the Breach**: intent telegraphing, phase clarity, readable consequences
* **XCOM (Avenger/base + loadout)**: “slotting” characters and commitment beats
* **Invisible, Inc.**: tension UI, turn pacing, clean overlays under mood

### Events that hit

* **Frostpunk**: heavyweight event cards, 1–2 choices, consequence icons
* **Darkest Dungeon**: stress as a character, stingers, barks, pressure meters
* **Griftlands / Citizen Sleeper**: narrative choice framing, pacing, tone

### EOD economy ritual

* **Hades**: ceremonial upgrades, “click feels expensive,” satisfying confirmations
* **Moonlighter**: selling as a ritual, inventory as physical objects
* **Inscryption**: tactile UI, diegetic presence

### Industrial AAA vibe

* **Dead Space / Mechanicus / Control**: diegetic readability + atmosphere
* **Slay the Spire / Loop Hero**: fast loops, readable intent, replayability

---

## 2) Run structure default (v1)

### “Short runs, high replay”

* Floor 1 is treated as a **run** you can complete in one sitting.
* **Target**: ~**12–20 days** per run (tunable).
* **Failure**: primarily **soft-fail spiral** (visible deterioration, harder recovery) with a clear **hard-fail** threshold (e.g., insolvency + staffing collapse).
* v1 must support “restart and try another regime.”

**Retention hook:** players replay to try a “Witch run,” “Thrum run,” “Stiletto greed run,” etc.

---

## 3) Preview philosophy (make-or-break)

### Telegraphed intent, controlled uncertainty

* Primary UI shows **bands**, not equations:

    * **HAZARD**: LOW / RISING / CRITICAL
    * **THROUGHPUT**: LOW / OK / HIGH
    * **STAFFING**: SHAKY / NORMAL / SOLID
    * **CREW STATE**: TENSE / STEADY / FERVENT

### Uncertainty is diegetic (not missing UI)

Prediction clarity changes based on “control” conditions:

* **Orderly security (LIMEN)** → previews become **crisper** (tighter ranges, confident UI edges).
* **Chaos security (CATHEXIS / THRUM failure)** → previews become **noisy/fuzzed** (wider ranges, “??” accents).
* **Repair/precision (RIVET WITCH)** → equipment signals become clearer and stabilize forecasts.
* **Stiletto security** → previews stay readable but carry a **pressure/danger accent** (sharp, high-risk vibe).

### “Why” is available but optional

* Default view: **vibe + risk + intent** in 2 seconds.
* Expanded/tooltip: a single-line driver:

    * “Hazard rising: discipline low + equipment worn”
    * “Throughput high: discipline strong + Stiletto synergy”

---

## 4) Screen layout and phases

### One-screen core loop (no navigation hell)

The main screen is split into:

* **Top bar** (run state + global vibe)
* **6 room grid** (primary interaction surface)
* **Bottom bar** (phase actions + EOD entry)
* **Popups** (major moments)
* **Event rail** (minor events/log cards)

### Phases (hard state machine)

1. **Planning (Puzzle)**
   Swap supervisors, set **Security doctrine**, read intent/risk, commit.
2. **Resolution (Comic)**
   The factory runs. Rooms resolve with animation cadence.
3. **Spotlight Event (if any)**
   One major popup max per day (conflict OR critical OR major accident).
4. **End of Day (Market Ritual)**
   Sell/convert/upgrade; recap strip; advance.

**Rule:** every phase has one dominant button/verb.

> **v1 change:** “assign workers” is removed from Planning. Staffing is **automated dispatch** influenced by Security lead.

---

## 5) Room tiles (the core widget)

Each room is a “comic panel you can play.”

### Default room tile must show (at-a-glance)

* **Room identity** (name/number + thematic art)
* **Supervisor token** (large circular coin + nameplate)
* **3–4 micro-stats** as iconic widgets (no math):

    * **Equipment condition**: wear creeping into the frame (cracks/rust bar)
    * **Stress**: pressure gauge / steam vent
    * **Discipline**: alignment gear / metronome
    * **Alignment**: signal/sigil brightness (optional in v1 default; can be expanded)
* **Workers present/dispatch**: dumb/smart chips with icons + small counts

    * Labeling must be **non-editorial**: “DISPATCHED” (pre-run) and “PRESENT” (post attendance), not “ASSIGNED.”

### Expanded tile (click/hover) must show

* **Intent/risk bands** (Hazard/Throughput/Staffing/Crew State)
* A **single driver line** (“why”) per band
* A tiny **last outcome stamp** (SUCCESS / FIASCO / ACCIDENT) as history memory
* A small **Security influence hint** (diegetic): “Dispatch: Conveyor Priority / Materials Priority / Chaos / Order…”

### Locked room tile behavior

* Room 6 is always inert/locked; it must feel “sealed,” not empty.
* Locked rooms show:

    * sealed plating
    * faint hum/tease
    * clear “Not Accessible” feedback when clicked

---

## 6) Primary interaction: supervisor swap must feel AAA

Swapping is the game’s “combat.”

### Swap interaction requirements

* Click/drag a supervisor token → it **lifts** (scale + shadow + subtle audio)
* Hover target room → **magnet snap preview** (glow + frame pulse)
* Drop → **impact** (clang + sparks + token ring pulse)
* Illegal move (locked / invalid) → **bounce + harsh seal stamp** + distinct audio

### Constraints for puzzle feel (recommended)

* v1 should support a **swap budget** (tunable), expressed diegetically:

    * rivets/locks pop off per swap
* Must include **Undo (single-step)** with “steam rewind” feedback.

---

## 7) Security doctrine (new core v1 pillar)

Because workers are automated, **Security is the player’s macro-control lever**.

### Security Directive panel (required)

When a supervisor is placed in Security, UI must show a clear diegetic directive:

* **LIMEN** → **ORDER LOCK**
  Stable dispatch; forecasts **crisp**; workday hours may shorten (diegetic “Day compressed”).
* **STILETTO** → **CONVEYOR PRIORITY**
  Dispatch fills Conveyor pressure; throughput accents; hazard pressure rises.
* **RIVET WITCH** → **MATERIALS PRIORITY**
  Dispatch favors Brewery/Weaving smart slots; equipment clarity improves.
* **CATHEXIS** → **CHAOS DISPATCH**
  Randomization; absenteeism spike; forecasts **noisy**.
* **THRUM** → **VIBE DISPATCH (coinflip)**
  Success: mild chaos with calm; failure: chaos + absenteeism; forecasts may become **noisy**.

Directive panel must show:

* one short title
* 1–2 line “what it means”
* 2–4 small icon effects (e.g., “Forecast noise ↑”, “Conveyor fill ↑”, “Absenteeism ↑”, “Hours ↓”)

---

## 8) Event system: one spotlight, everything else becomes cards

### Spotlight rule

* **Max one major popup per day**:

    * conflict choice OR critical allow/suppress OR major accident
* Major popup presentation:

    * full illustration (or strong overlay variant)
    * 1–2 choices max
    * consequences shown as **icon deltas** (not paragraphs)

### Event rail (minor events)

* Minor events stack as stamped cards (right side or top-right rail):

    * “Attendance dip”
    * “Equipment wear”
    * “Small success”
* Clicking a card expands to a short “comic caption + deltas.”

**Result:** drama stays readable; the game never turns into a popup simulator.

---

## 9) Resolution: cadence and readability

Resolution is a show, not a spreadsheet.

### Resolution flow

* Player hits **RUN SHIFT** (big, committed action)
* Rooms resolve in a consistent cadence (e.g. security → conflicts → rooms)
* Each room gets:

    * micro animation (lights, conveyor motion, steam, strobe if danger)
    * a stamp overlay (SUCCESS / NEUTRAL / FIASCO / ACCIDENT)
    * quick deltas (icons drifting up: +brains, -condition, +stress)

### Outcome reveal

At the end of resolution:

* tiles **flip** briefly into “outcome state” art/overlays
* then transition to EOD ritual if applicable

---

## 10) End of Day: ritual shop, tactile economy

EOD must feel like a “machine ceremony,” not form filling.

### EOD UI requirements

* Inventory displayed as **physical containers/crates**
* Three machines:

    * **SELL**: crate → chute → cash stamps
    * **CONVERT**: vat → badge printer → worker token pops out
    * **UPGRADE**: substrate+ribbon feed → press → smart brain gleam

### EOD pacing

* Must be fast to execute, but rich in feedback:

    * tick-up numbers
    * stamping sounds
    * satisfying confirmations
* Provide quick presets:

    * “Sell all washed dumb”
    * “Convert max dumb”
    * “Upgrade max possible”
      (Players can still fine-tune, but v1 shouldn’t punish speed.)

---

## 11) Daily recap strip (retention engine)

Every day ends with a **2–4 panel recap strip** that makes players want “one more day.”

### Recap strip must show

1. **What happened** (major event + key minor cards)
2. **Who escalated** (confidence/tension signal in a readable badge)
3. **Factory vibe tagline** (one-line tone text)
4. **Net results** (cash delta + casualties (non-graphic) + key inventory deltas)

This is the “comic” in interactive comic—mandatory for vibe retention.

---

## 12) Information design guidelines (v1)

### No raw math on the main surface

* Avoid exposing decimals and formulas in default view.
* Use:

    * icons
    * bars
    * stamps
    * bands
    * short driver lines

### Numbers exist in “inspection mode”

* A toggle or long-press reveals exact values (optional v1 feature).
* Default experience remains cinematic.

### Consistent semantic mapping

* **Red** = danger/lockdown
* **Amber** = unstable/rising risk
* **Teal/Sea-green** = weaving/witch precision
* **Cold cyan** = security instrumentation
* Avoid using color alone: always pair with iconography.

---

## 13) Art + content budget strategy (ship without infinite illustrations)

v1 should feel rich using **overlays + lighting + stamps**, reserving full art for spotlight moments.

### Required art baseline

* Base room art for unlocked rooms (5) + sealed room (1)
* Supervisor token portraits + nameplates (5)
* Overlay sets:

    * SUCCESS / NEUTRAL / FIASCO / ACCIDENT stamps
    * equipment wear layers
    * alarm lights / smoke / steam layers

### Full illustrations (limited set)

* Critical events (5)
* Conflict spotlight (1–2)
* Signature accidents (2–3)

---

## 14) Audio and motion (AAA feel requirement)

v1 must include:

* swap: lift, hover snap, drop impact
* phase transitions: commit stinger, popup stinger, EOD machine sounds
* stamps: paper/metal stamping hits
* alarms: subtle, not fatiguing

Also include:

* **Reduced Motion** option (accessibility)
* Volume sliders or at least master mute

---

## 15) Accessibility + usability (v1 minimums)

* Reduced motion mode
* Clear focus/hover states for trackpad users
* Colorblind-safe: icons + patterns + text labels
* Text scaling to remain readable on common desktop resolutions
* No critical information only conveyed by flicker/strobe

---

## 16) v1 acceptance criteria (what “done” means)

A v1 build is UX-complete when:

1. A player can complete a full day loop without confusion: **Plan → Run → Event (optional) → EOD → Next Day**
2. Swapping supervisors feels instant, readable, and satisfying (with Undo + illegal feedback).
3. Rooms communicate intent/risk in **bands** with a consistent visual language.
4. Security Directive panel clearly explains how dispatch/uncertainty is being shaped.
5. Only one major popup can “steal the screen” per day; minor events appear as cards.
6. EOD actions are performed through tactile “machines” with satisfying feedback.
7. The recap strip exists and makes the player want to continue.

---

## 17) v1 scope boundaries (explicit)

**In v1, we prioritize:**

* phase clarity
* swap feel
* readable risk/intent
* security doctrine clarity
* event spotlight pacing
* EOD ritual + recap strip

**We do NOT require in v1:**

* player-controlled worker assignment
* showing hidden accumulators
* deep meta-progression UI
* encyclopedic stats dashboards
* multiple screens/menus

---

# Appendix A — UI Component Contract (Sim Sim UI v1)

This appendix defines the **required UI components**, their **states**, **inputs/outputs**, **data dependencies**, and **AAA interaction requirements**. It’s written so engineering can implement without guessing, and so the UI can evolve without breaking the sim contract.

---

## A0) Global UI architecture contract

### A0.1 Single-screen composition

Main view is one persistent screen composed of:

* **TopBar** (run + global state + mood)
* **SecurityDirectivePanel** (security doctrine + forecast clarity)
* **RoomGrid** (6 room tiles)
* **BottomBar** (phase controls + commit button)
* **EventRail** (minor events and history cards)
* **PopupLayer** (major events / prompts)
* **EODLayer** (end-of-day ritual panel)
* **RecapStrip** (end-of-day panels)

All components are driven by a single **UI phase state machine**:

```ts
type UIPhase =
  | "planning"           // player placing supervisors (incl. security doctrine)
  | "resolving"          // animations; no input except skip/fast-forward (optional)
  | "awaiting_prompt"    // major decision popup; must resolve to continue
  | "end_of_day"         // sell/convert/upgrade; then recap
  | "recap";             // recap strip; then Next Day -> planning
```

#### Phase invariants (must hold)

* Only one primary CTA is “hot” per phase:

    * planning → **RUN SHIFT**
    * awaiting_prompt → **CHOOSE**
    * end_of_day → **CONFIRM EOD**
    * recap → **NEXT DAY**
* During `resolving`, placement controls are disabled.

---

## A1) Core data model the UI consumes (UI-facing “view model”)

The sim may expose more, but the UI contract depends on these **minimums**.

### A1.1 RunState

```ts
type RunState = {
  day: number
  cash: number

  // unlock status
  rooms_unlocked: Record<RoomId, boolean>
  supervisors_unlocked: Record<SupervisorCode, boolean>

  // global flags / regime modifiers (UI does not show raw math by default)
  regime_tags: RegimeTag[]         // e.g. ["refactor_active", "alignment_inversion"]
  global_mood: GlobalMood          // derived display state

  // inventory
  inv: Inventory

  // pools (read-only in v1)
  workers_total: { dumb: number; smart: number }
}
```

### A1.2 RoomViewModel (one per room)

```ts
type RoomViewModel = {
  room_id: RoomId
  name_short: string
  is_locked: boolean
  is_unlocked: boolean

  // placement (player input)
  supervisor: SupervisorCode | null

  // staffing (read-only; automated dispatch + attendance)
  workers_dispatched?: { dumb: number; smart: number } // pre-attendance / planning display
  workers_present?: { dumb: number; smart: number }    // post-attendance / post-resolve display

  // core “always-on” stats (0..1)
  equipment_condition?: number       // absent for security/locked
  stress?: number
  discipline?: number
  alignment?: number

  // forecast bands (planning)
  forecast?: ForecastBands           // optional if not available; UI can degrade gracefully

  // outcome (after resolve)
  outcome?: RoomOutcomeSummary       // stamp + key deltas

  // visual tags (for overlays)
  tags?: RoomTag[]                   // e.g. ["hazard_critical", "equipment_low", "success"]
}
```

### A1.3 SupervisorViewModel

```ts
type SupervisorViewModel = {
  code: SupervisorCode
  name: string

  // progression stats
  loyalty: number        // 0..1
  confidence: number     // 0..1+ (UI clamps for display)
  influence: number      // float

  cooldown_days: number  // int
  native_room: RoomId

  // “playstyle tells” (static UI copy/labels)
  persona_tags: PersonaTag[]     // e.g. ["order", "overdrive", "indoctrination"]
}
```

### A1.4 ForecastBands (the “no math, all intent” layer)

```ts
type Band =
  | "low" | "ok" | "high"
  | "rising" | "critical"
  | "shaky" | "normal" | "solid"
  | "tense" | "steady" | "fervent"

type ForecastBands = {
  hazard: "low" | "rising" | "critical"
  throughput: "low" | "ok" | "high"
  staffing: "shaky" | "normal" | "solid"
  crew_state: "tense" | "steady" | "fervent"

  // optional “why” lines (1 per band, short)
  why?: Partial<Record<"hazard"|"throughput"|"staffing"|"crew_state", string>>

  // optional “confidence of forecast” (controls fuzz/noise treatment)
  clarity?: "crisp" | "normal" | "noisy"
}
```

### A1.5 OutcomeSummary (room stamp + deltas)

```ts
type RoomOutcomeSummary = {
  stamp: "success" | "neutral" | "fiasco" | "accident" | "shutdown"
  deltas: {
    cash?: number
    inv?: Partial<Inventory>                 // produced/consumed today
    workers_lost?: { dumb: number; smart: number } // non-graphic
    equipment_delta?: number
    stress_delta?: number
    discipline_delta?: number
    alignment_delta?: number
  }
  event_cards?: EventCard[]                  // minor cards tied to this room
}
```

### A1.6 Security directive model (required in v1)

```ts
type SecurityDirective = {
  security_lead: SupervisorCode | null
  directive_tag: "order" | "conveyor" | "materials" | "chaos" | "vibes"
  label: string           // e.g. "ORDER LOCK"
  blurb: string           // 1–2 lines
  clarity: "crisp" | "normal" | "noisy"
  icon_effects: Array<{ icon: string; direction: "up"|"down"|"flat"; intensity: "sm"|"md"|"lg" }>
  notes?: string          // optional short caveat (e.g., "Coinflip risk")
}
```

### A1.7 Prompt model (major popups)

```ts
type Prompt =
  | ConflictPrompt
  | CriticalPrompt
  | MajorAccidentPrompt

type ConflictPrompt = {
  kind: "conflict"
  id: string
  title: string
  art_key: string
  choices: Array<{ id: "support_A"|"support_B"|"suppress"; label: string; deltas: IconDeltas }>
  meta: { supervisor_A: SupervisorCode; supervisor_B: SupervisorCode; edge: [RoomId, RoomId] }
}

type CriticalPrompt = {
  kind: "critical"
  id: string
  supervisor: SupervisorCode
  title: string
  art_key: string
  choices: Array<{ id: "allow"|"suppress"; label: string; deltas: IconDeltas }>
}

type MajorAccidentPrompt = {
  kind: "accident"
  id: string
  title: string
  art_key: string
  choices: Array<{ id: "ack"; label: string }>
  deltas: IconDeltas
}
```

---

## A2) Component contracts

### A2.1 `<SimSimScene />` (root)

**Responsibility**

* Own UIPhase state machine, orchestration, and gating of inputs.
* Hold “draft” state in planning:

    * supervisor placement draft (including Security)
    * EOD action draft
* Apply client-side “cinematic” microphases (resolving/recap) even if backend only gates prompts.

**Inputs**

* `RunState`
* `securityDirective: SecurityDirective`
* `rooms: RoomViewModel[]`
* `supervisors: SupervisorViewModel[]`
* `events: EventCard[]` (global)
* `prompt?: Prompt`
* `uiPhase: UIPhase` (from backend or client state—must be consistent)
* transport callbacks: `submitPlanning()`, `submitPromptChoice()`, `submitEOD()`, `advanceDay()`

**AAA requirements**

* Phase transitions are animated (panel slides, stamp hits, focus shifts).
* During in-flight submissions, inputs are locked and CTA shows “submitting…”.

---

### A2.2 `<TopBar />`

**Shows**

* Day number + run title (optional)
* Cash (large readable)
* Global mood strip (diegetic)
* Regime tags (small icons; tooltips only)

**Props**

```ts
type TopBarProps = {
  day: number
  cash: number
  global_mood: GlobalMood
  regime_tags: RegimeTag[]
}
```

**UI guidelines**

* Cash should “tick” with audio at EOD.
* Mood is not a number; it’s a label + subtle animation (lights/hum).

---

### A2.3 `<SecurityDirectivePanel />` (required)

**Responsibility**

* Communicate “who on Security” → dispatch doctrine → forecast clarity.

**Props**

```ts
type SecurityDirectivePanelProps = {
  directive: SecurityDirective
}
```

**UI guidelines**

* Must be readable in 2 seconds.
* Must include: label, 1–2 line blurb, 2–4 icon effects, clarity treatment.
* Must visually “feel like a control doctrine plate,” not a tooltip paragraph.

---

### A2.4 `<RoomGrid />`

Just layout for six `<RoomTile />` components + consistent positions.

**Props**

```ts
type RoomGridProps = {
  rooms: RoomViewModel[]
  uiPhase: UIPhase
  selection: RoomSelectionState
  onRoomClick(room_id: RoomId): void
}
```

**Guidelines**

* Room positions are stable (player builds spatial memory).
* Locked room shows sealed plate and ignores most interactions.

---

### A2.5 `<RoomTile />` (the core panel)

**Responsibility**

* Show room art + current supervisor + micro-stats + read-only staffing chips.
* Provide hover/click expansion for forecast + “why” + security influence hint.

**Props**

```ts
type RoomTileProps = {
  room: RoomViewModel
  uiPhase: UIPhase

  // interaction
  isTargetable: boolean              // during drag
  isSelected: boolean
  onClick(): void
  onHover(isHovering: boolean): void
}
```

#### Visual states

* `default` (planning/idle)
* `hovered`
* `selected`
* `target_highlight` (during token drag)
* `locked`
* `outcome_reveal` (after resolve; stamp + deltas)
* `disabled` (during resolving)

#### Required UI elements

* **Supervisor token socket** (large circle) even if empty
* **Nameplate**
* **Micro-stats** (3–4 iconic widgets max)
* **Staffing chips** (dumb/smart) labeled:

    * planning: “DISPATCHED”
    * post resolve: “PRESENT”
* **Forecast bands** (shown on expand)
* **Outcome stamp** overlay (resolve/EOD)

#### AAA feel requirements

* Room frame reacts physically:

    * low equipment → cracks/rust creep
    * hazard critical → alarm pulse + hazard stripes
    * success → clean glow + “stamp” hit
* Band clarity uses “noise treatment”:

    * `clarity=noisy` → subtle jitter/noise, fuzz edges, question marks
    * `clarity=crisp` → sharper edges, confident icon

---

### A2.6 `<SupervisorToken />` (drag + swap “combat”)

**Responsibility**

* Draggable token representing one supervisor.
* Snaps into room socket.
* Supports click-to-pick then click-to-place (trackpad friendly).

**Props**

```ts
type SupervisorTokenProps = {
  supervisor: SupervisorViewModel
  location_room_id: RoomId | null
  uiPhase: UIPhase

  isDragging: boolean
  isLockedOut: boolean        // display-only unless design later restricts placement
  onPickUp(): void
  onDrop(target_room_id: RoomId): void
  onCancel(): void
}
```

#### Interaction contract

* Pickup: scale + shadow + audio “lift”
* Hover targets: targets glow and magnet snap preview plays
* Drop:

    * if legal → clang + sparks + ring pulse
    * if illegal → bounce + seal stamp + harsh audio + tooltip reason
* Must include **Undo** in planning: one-step revert

#### Displays on token (minimal but meaningful)

* Confidence ring (visual charge)
* Cooldown ticks (small rivets)
* Persona icon (optional, tooltip)

---

### A2.7 `<BottomBar />` (phase CTA and quick controls)

**Responsibility**

* Show current phase label + primary CTA + Undo.

**Props**

```ts
type BottomBarProps = {
  uiPhase: UIPhase
  primaryCTA: { label: string; enabled: boolean; onClick(): void }
  undoCTA?: { label: string; enabled: boolean; onClick(): void }
  hintText?: string
}
```

**Guidelines**

* Big “RUN SHIFT” button in planning.
* During resolving: replace with “RUNNING…” + optional “FAST FORWARD” if desired.

---

### A2.8 `<EventRail />` (minor event cards)

**Responsibility**

* Show stack of minor events as stamped cards.
* Clicking a card expands to caption + icon deltas.

**Props**

```ts
type EventRailProps = {
  cards: EventCard[]
  onCardClick(id: string): void
}
```

**Card content**

```ts
type EventCard = {
  id: string
  title: string
  room_id?: RoomId
  severity: "minor" | "notable"
  stamp: "info" | "warning" | "danger" | "success"
  deltas?: IconDeltas
  caption?: string
}
```

**Guidelines**

* Major events should NOT appear here; they are PopupLayer.
* Cards should be skimmable in 1 second.

---

### A2.9 `<PopupLayer />` + `<MajorPromptPopup />`

**Responsibility**

* Block gameplay until a major prompt is resolved (`awaiting_prompt`).
* Present full art + 1–2 choices + icon deltas.

**Props**

```ts
type PopupLayerProps = {
  prompt: Prompt | null
  onChoose(choice_id: string): void
}
```

**MajorPromptPopup UI rules**

* **Full illustration** or strongest available art variant.
* 1–2 choices max (conflict may show 2–3 including “suppress”).
* Consequences shown as **IconDeltas**, not paragraphs.
* Choice hover previews: subtle pulse + delta emphasis.
* Confirmation is immediate (no extra dialog).

---

### A2.10 `<EODLayer />` + “machine panels”

EOD is a ritual shop: three machines + inventory.

**Props**

```ts
type EODLayerProps = {
  inv: Inventory
  cash: number
  workers_total: { dumb: number; smart: number }

  draft: EODDraft
  presets: EODPreset[]        // sell all, convert max, upgrade max
  onDraftChange(draft): void

  onConfirm(): void
}
```

#### EODDraft

```ts
type EODDraft = {
  sell_washed_dumb: number
  sell_washed_smart: number
  convert_workers_dumb_count: number
  convert_workers_smart_count: number
  upgrade_brains_count: number
}
```

#### Machine components

* `<SellMachine />`
* `<ConvertMachine />`
* `<UpgradeMachine />`

Each machine:

* has a “feed” animation
* shows max possible
* supports presets

**AAA requirements**
Every confirmed action produces:

* a sound
* a stamp or press animation
* a number tick-up/down
* a small event card (“+Cash”, “+Worker”, “-Substrate”)

---

### A2.11 `<RecapStrip />` (mandatory retention device)

**Responsibility**

* Show 2–4 panels summarizing the day.
* Must be shareable-feeling even if not actually shared.

**Props**

```ts
type RecapStripProps = {
  day: number
  panels: RecapPanel[]     // 2–4
  onNextDay(): void
}
```

#### RecapPanel

```ts
type RecapPanel =
  | { kind: "what_happened"; headline: string; cards: EventCard[] }
  | { kind: "who_escalated"; supervisors: Array<{ code: SupervisorCode; badge: EscalationBadge }> }
  | { kind: "factory_vibe"; tagline: string; mood: GlobalMood }
  | { kind: "net_results"; deltas: IconDeltas }
```

**Guidelines**

* Always include: What happened, Who escalated, Net results
* Tagline is one line, blunt, atmospheric.

---

## A3) Icon delta language (no math by default)

### A3.1 IconDeltas contract

```ts
type IconDeltas = {
  cash?: number
  brains_washed_dumb?: number
  brains_washed_smart?: number
  brains_raw_dumb?: number
  brains_raw_smart?: number
  substrate?: number
  ribbon?: number
  workers_dumb?: number
  workers_smart?: number
  equipment?: number
  stress?: number
  discipline?: number
  alignment?: number
  casualties?: { dumb: number; smart: number }  // non-graphic label
}
```

**Display rule**

* Default: show **direction + intensity**, not exact numbers (small/medium/large arrows)
* Tooltip: exact numbers allowed

---

## A4) Motion + audio requirements (per component)

Minimum required “juice”:

* Token pickup/drop/illegal bounce
* Room target highlight magnet snap
* Stamp overlays on outcomes
* Cash tick-up + receipt/press sounds in EOD
* Popup stingers per prompt type
* Recap strip page-turn / slide

Include a global **Reduced Motion** toggle that:

* disables shakes
* reduces particles
* shortens transition durations

---

## A5) Degraded mode (if sim doesn’t expose everything yet)

v1 UI must work even if some signals are missing.

* If `forecast` absent → show only micro-stats + generic “Unknown” bands.
* If `why` absent → omit driver lines.
* If `clarity` absent → treat as “normal”.
* If `outcome` missing → stamp neutral and show only inventory deltas available.
* If `workers_dispatched/present` missing → hide staffing chips.

This allows UI to ship early while backend exposure catches up.

---

## A6) Engineering handshake checklist (what UI needs exposed)

To implement the full contract, backend should eventually expose:

* UIPhase
* Security lead (to derive directive)
* Room core stats (equipment/stress/discipline/alignment)
* Staffing readouts (dispatched/present) where available
* ForecastBands (or enough to derive them)
* OutcomeSummary per room (stamp + deltas)
* Prompt objects (conflict/critical)
* EventCards (minor) + mapping to rooms
* Inventory + cash deltas
* Supervisor stats (confidence/loyalty/influence/cooldown)

---

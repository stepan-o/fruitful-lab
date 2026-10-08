Below is the **final, complete Game Systems Design Spec v1** for the new simulation backend **`sim_sim`**. It consolidates everything we defined in this chat into a single implementable contract: entities, state, math, lookup tables, daily pipeline, units/economy, unlock pacing, conflicts, critical confidence events, and balancing intentions.

This spec is **simulation-only** (no UI/CLI requirements beyond what the sim must expose as state + prompts). Anything interactive (input parsing, rendering, cursor editing) is out of scope.

---

# sim_sim — Game Systems Spec v1 (Floor 1)

## 0. Purpose and design intentions

**sim_sim** simulates **Floor 1** of Loopforge as a deterministic, turn-based (daily) factory management system with emergent dynamics.

**Core player levers (sim inputs):**

1. Supervisor placement per day (limited swaps per day in UI; sim just accepts final placement)
2. Worker assignment proposal per day (sim accepts a proposed distribution; security may modify it)
3. End-of-day choices: sell vs convert vs upgrade (sim accepts quantities)

**Core tensions supported by mechanics:**

* Throughput vs stability (accidents, damage, deaths)
* Order vs speed (discipline vs output multipliers and time)
* Repair vs production time (WITCH repair-first)
* Ideology vs control (alignment + conflict + CATHEXIS arc)
* Supervisor extremism (confidence critical events reshape the regime)

**Two-act arc requirement:**

* Floor 1 is a complete game on its own.
* Floor 2 will later reveal hidden accumulators seeded by Floor 1, but **hidden values must not be required to enjoy or understand Floor 1**.

---

# 1. World model

## 1.1 Rooms (Floor 1)

Rooms are indexed and named:

| id | name (short) | name (long)                       | locked?       |
| -: | ------------ | --------------------------------- | ------------- |
|  1 | security     | Security                          | never locked  |
|  2 | conveyor     | Synaptic Lattice Forge (Conveyor) | unlock Day 1  |
|  3 | theatre      | Burn-in Theatre (Theatre)         | unlock Day 2  |
|  4 | brewery      | Cognition Substrate Brewery       | unlock Day 3  |
|  5 | weaving      | Synapse Weaving Gallery           | unlock Day 4  |
|  6 | cortex       | Cortex Assembly Line              | always locked |

Room adjacency graph (for conflicts + “connected locations”):

Edges (undirected):

* (1–2) security ↔ conveyor
* (2–3) conveyor ↔ theatre
* (2–4) conveyor ↔ brewery
* (4–5) brewery ↔ weaving

Connected = share an edge.

## 1.2 Supervisors

Supervisors are unique agents:

| code | name        | native room |
| ---- | ----------- | ----------- |
| L    | LIMEN       | 1 security  |
| S    | STILETTO    | 2 conveyor  |
| C    | CATHEXIS    | 3 theatre   |
| W    | RIVET WITCH | 4 brewery   |
| T    | THRUM       | 5 weaving   |

A supervisor can be assigned to at most one room per day; rooms hold at most one supervisor.

## 1.3 Workers

Workers are counts by type:

* dumb workers
* smart workers

Workers are assigned daily to rooms (counts per room by dumb/smart). The sim tracks total pool and per-day attendance.

---

# 2. State definition (what sim_sim must store)

## 2.1 Persistent state (across days)

**Day index:** `day` (int, starts at 0)

**Workers:**

* `workers_total_dumb`, `workers_total_smart`

**Cash:** `cash` (int)

**Inventories:**

* `raw_brains_dumb`, `raw_brains_smart`
* `washed_brains_dumb`, `washed_brains_smart`
* `substrate_gallons`
* `ribbon_yards`

**Rooms (for rooms 2–5; room 1 has no equipment, room 6 locked):**
For each active room r:

* `equipment_condition[r]` ∈ [0,1]
* worker state averages:

    * `stress[r]` S ∈ [0,1]
    * `discipline[r]` D ∈ [0,1]
    * `alignment[r]` A ∈ [0,1]

**Supervisor stats (for each supervisor s):**

* `loyalty[s]` ∈ [0,1]
* `confidence[s]` ∈ [0,1] (may exceed 1 in calc but clamp)
* `influence[s]` (unbounded float or clamp 0..1; choose float for growth)
* `cooldown_days[s]` (int, >=0) — cannot re-enter tension zone while >0

**Security history:**

* `limen_security_count` (int) — times LIMEN led security

**Conflict state:**

* `affinity[s1][s2]` in {+1 friendly, 0 neutral, −1 hostile}
* `discovered_hostility[s1][s2]` boolean (symmetric)

**Temporary modifiers:**

* `weaving_boost_next_day` (float, default 1.0) — multiplicative modifier applied to weaving output on next day
* Any additional “regime shift” modifiers from critical events (see §10), tracked with duration counters:

    * `global_prod_formula_override_days` (int)
    * `global_alignment_inversion_days` (int)
    * `global_factory_shutdown_except_brewery_today` (bool) (event-day flag)
    * etc. (explicit list in §10)

**Hidden accumulators (not shown to player until Floor 2 milestone):**

* `rigidity` (float)
* `radical_potential` (float)
* `innovation_pressure` (float)

These must be updated daily (§12) but remain nonessential for Floor 1.

---

# 3. Daily inputs (what sim_sim receives each day)

The simulation step takes:

1. `supervisor_assignment`: map room_id → supervisor_code (or None)
2. `worker_proposal`: map room_id → (dumb_assigned, smart_assigned) for unlocked rooms (room 1 has no workers; room 6 forbidden)
3. `end_of_day_actions`:

    * `sell_washed_dumb`, `sell_washed_smart`
    * `convert_workers_dumb_count`, `convert_workers_smart_count`
    * `upgrade_brains_count` (convert washed dumb → washed smart using substrate+ribbon)
4. Optional: `allow_critical_event[s]` decisions if a critical escalation prompt occurs (§9.4).

UI constraints like “max 1 swap early” are not enforced by sim; that’s interface/gameplay layer.

---

# 4. Room capacities and worker constraints (validation rules)

Capacities apply to **assigned** workers (before attendance). Enforce at proposal validation and at security redistribution.

* Conveyor (2): max 10 total (dumb + smart ≤ 10)
* Theatre (3): max 5 total
* Brewery (4): max 1 dumb, max 3 smart
* Weaving (5): max 0 dumb, max 3 smart
* Security (1): no worker assignment (workers do not “work security”)
* Cortex (6): locked, always 0

The sim must also ensure total assigned across rooms ≤ total workers available by type, with remainder allowed as “unassigned/idle pool”.

---

# 5. Core worker behavior model (3 equations)

Worker states are tracked **per room** as averages. Updates occur once per day after production resolution.

### State variables per room r

* Stress (S_{r}) ∈ [0,1]
* Discipline (D_{r}) ∈ [0,1]
* Alignment (A_{r}) ∈ [0,1]

Define clamp:

* `clamp01(x) = min(1, max(0, x))`

Daily inputs per room r (computed during resolution):

* (H): work hours fraction = `hours/9`
* (F_{r}): fiasco severity in {0.0, 0.5, 1.0}
* (K_{r}): casualty rate = casualties / max(1, present_workers)
* (R_{r}): relief ∈ [0,1]
* (P_{r}): perceived progress ∈ [0,1]
* (L_{r}): leadership order index ∈ [0,1]
* (I_{r}): indoctrination pressure ∈ [-1, +1]

### Coefficients (defaults)

* Stress: αH=0.15, αF=0.20, αK=0.60, αR=0.30, αP=0.10
* Discipline: βL=0.12, βP=0.10, βS=0.18, βF=0.10
* Alignment: γP=0.08, γI=0.10, γK=0.35, γS=0.08

### Equation 1 — Stress

[
S'*{r}=\text{clamp01}\Big(
S*{r}

* \alpha_H(H-1)
* \alpha_F F_{r}
* \alpha_K K_{r}

- \alpha_R R_{r}
- \alpha_P P_{r}
  \Big)
  ]

### Equation 2 — Discipline

[
D'*{r}=\text{clamp01}\Big(
D*{r}

* \beta_L L_{r}
* \beta_P P_{r}

- \beta_S S_{r}
- \beta_F F_{r}
  \Big)
  ]

### Equation 3 — Alignment

[
A'*{r}=\text{clamp01}\Big(
A*{r}

* \gamma_P P_{r}
* \gamma_I I_{r}

- \gamma_K K_{r}
- \gamma_S S_{r}
  \Big)
  ]

**Update rule:** synchronous update using old (S_{r}) in Discipline/Alignment (do not feed (S') into the same-day D/A update).

---

# 6. Derived worker outcome formulas (attendance, accidents, productivity)

These are not additional state; computed during resolution.

## 6.1 Absenteeism baseline (per room)

[
absent_pct_{r}=\text{clamp01}\big(0.05 + 0.35S_{r} - 0.25D_{r}\big)
]

Workers present:
[
present_{r}=\lfloor assigned_{r}\cdot (1-absent_pct_{r})\rfloor
]

Security may modify absenteeism for chaos leads (§8).

## 6.2 Accident chance (per room)

[
accident_chance_{r}=\text{clamp01}\big(
0.02 + 0.25(1-D_{r}) + 0.25S_{r} + 0.30(1-E_{r})
\big)
]

Supervisor outcome tables can override accidents/casualties for specific pairings (§11).

## 6.3 Productivity multiplier (per room)

Default (normal regime):
[
prod_mult_{r}=\text{clamp01}\big(
0.50 + 0.70D_{r} - 0.30S_{r}
\big)
]

This formula may be overridden temporarily by WITCH critical event “System Refactor” (§10.1).

---

# 7. Leadership order (L) and indoctrination pressure (I) lookup tables

Rooms: (1) Sec (2) Conv (3) Thea (4) Brew (5) Weav.
These tables apply to rooms with supervisors assigned; rooms without supervisors use defaults.

## 7.1 Defaults when no supervisor in room

* (L = 0.40)
* (I = 0.00)
* supervisor relief baseline (R^{sup}=0.00)

## 7.2 Leadership Order Index L (0..1)

| Supervisor  |  Sec | Conv | Thea | Brew | Weav |
| ----------- | ---: | ---: | ---: | ---: | ---: |
| LIMEN       | 0.95 | 0.80 | 0.60 | 0.65 | 0.65 |
| STILETTO    | 0.30 | 0.55 | 0.20 | 0.25 | 0.20 |
| CATHEXIS    | 0.05 | 0.10 | 0.85 | 0.35 | 0.50 |
| RIVET WITCH | 0.50 | 0.90 | 0.85 | 0.95 | 0.80 |
| THRUM       | 0.40 | 0.45 | 0.55 | 0.35 | 0.70 |

## 7.3 Indoctrination Pressure I (-1..+1)

| Supervisor  |   Sec |  Conv |  Thea |  Brew |  Weav |
| ----------- | ----: | ----: | ----: | ----: | ----: |
| LIMEN       | +0.35 | +0.10 | +0.05 | +0.05 | +0.05 |
| STILETTO    | −0.05 | −0.20 | −0.10 | −0.10 | −0.10 |
| CATHEXIS    | −0.30 | −0.25 | −0.35 | −0.10 | −0.05 |
| RIVET WITCH | +0.05 | +0.10 | +0.05 | +0.15 | +0.10 |
| THRUM       | −0.05 |  0.00 | −0.05 | −0.15 | +0.05 |

## 7.4 Relief baseline (R^{sup}) by supervisor

* LIMEN: 0.00
* STILETTO: 0.00
* CATHEXIS: 0.05 if in Theatre, else 0.00
* WITCH: 0.05
* THRUM: 0.40 if in Conveyor or Weaving, else 0.20

Event relief (R^{event}):

* +0.10 on total success outcome
* +0.05 on accident-free day
  Total relief:
  [
  R=\text{clamp01}(R^{sup}+R^{event})
  ]

---

# 8. Security (meta-controller): hours, redistribution, attendance modifiers

Security lead = supervisor assigned to room 1. If none, treat as “No Security” chaos equivalent to CATHEXIS security behavior.

## 8.1 Workday hours

Base hours = 9.

* If LIMEN leads security:

    * `limen_security_count += 1`
    * `hours = 9 - min(2, limen_security_count)` (cap penalty at 2 hours)
* Else:

    * `hours = 9`

Define (H = hours / 9).

## 8.2 Redistribution rules (post proposal, pre attendance)

Given player `worker_proposal`, apply deterministic security reshaping:

* LIMEN security: no redistribution (proposal stands)
* STILETTO security: prioritize filling Conveyor (2) to capacity:

    * pull from unassigned pool first, then from lowest-priority rooms in order: Weaving → Brewery → Theatre
* WITCH security: prioritize Brewery (4) smart slots then Weaving (5) smart slots:

    * pull from unassigned pool first, then from Theatre then Conveyor if needed
* CATHEXIS security: random redistribution respecting capacities:

    * gather all assigned workers into pool, redistribute across unlocked rooms
    * optional bias: 60% chance keep in previous room to reduce pure chaos
* THRUM security:

    * roll 50% success/failure:

        * success: mild random redistribution like CATHEXIS but with stronger “stay” bias (e.g., 75%)
        * failure: same redistribution + extra absenteeism (below)

## 8.3 Attendance modifiers from security chaos

Baseline absenteeism uses §6.1.

Additional modifiers:

* CATHEXIS security: increase absenteeism by:

    * compute factory discipline average (D^{factory}) (worker-weighted; see §13)
    * `absent_bonus = clamp01(0.10 + 0.20*(1 - D_factory))`
    * `absent_pct_r = clamp01(absent_pct_r + absent_bonus)` for all rooms
* THRUM security failure: same structure as CATHEXIS (use absent_bonus) plus optional +0.05 flat.

---

# 9. Supervisor confidence system (growth/decay, tension zone, triggers)

Confidence must be **intentionally cultivatable** and **player-authorized** for critical events.

## 9.1 Base confidence delta components (per supervisor per day)

Let `C` = confidence at start of day resolution.
Compute ΔC as sum of:

### Outcome-based gain/loss (based on room result)

* total success: +0.08
* small success: +0.05
* neutral/normal: +0.02
* small fiasco: −0.05
* total fiasco: −0.08

### Native/hated placement

* if in native room: +0.03
* if in explicitly hated room: −0.03
  (Hates are: CATHEXIS hates security+conveyor; STILETTO hates theatre+weaving+brewery; LIMEN hates none but is “non-native”; THRUM hates brewery; WITCH hates none.)

### Conflict support/opposition (from conflict event)

* supported by player: +0.10
* opposed by player: −0.12

### Neglect decay

* if not assigned to any room today: −0.04
* if assigned but non-native AND no success (neutral or worse): −0.02

### Baseline drift toward stability

* if C < 0.75: −0.01 per day

## 9.2 Tension zone (soft cap behavior)

If `C >= 0.75` and `cooldown_days==0`:

* all gains and losses (except baseline drift) are multiplied by 1.5
* supervisor generates minor passive “warning” effects each day:

    * LIMEN: factory discipline drift +0.02, factory stress +0.01
    * STILETTO: global accident chance +0.05 (additive)
    * CATHEXIS: factory alignment drift −0.02
    * WITCH: equipment wear reduced 20% (multiply damage by 0.8)
    * THRUM: factory stress drift −0.02, discipline drift −0.01

These passives are small but visible in results; they signal escalation.

## 9.3 Cooldown

After any critical event triggers:

* set confidence to specified reset value (see §10)
* set `cooldown_days = 2` (cannot re-enter tension zone while >0)
* decrement cooldown at end of each day.

## 9.4 Trigger window (player authorization)

If after applying ΔC:

* confidence ≥ 1.0
* supervisor is in **native room**
* no other critical event is already triggering today
* cooldown_days == 0

Then sim must generate a **critical escalation prompt**:

* `prompt_critical(supervisor)` requiring input: allow or suppress.

If **allow**:

* trigger critical event immediately (today), applying effects defined in §10.
  If **suppress**:
* confidence −0.20
* loyalty −0.05
* influence −0.05
* factory stress +0.03 (resentment)
* no critical event triggers.

**Only one critical event may occur per day.** If multiple eligible, choose highest confidence.

---

# 10. Critical confidence events (regime shifts)

All critical events are **dramatic** and include **multi-day structural consequences**.

## 10.1 WITCH — “System Refactor”

**Trigger:** W confidence ≥ 1.0, W assigned to Brewery (4), player allows.

### Immediate (today)

1. Factory shutdown: all rooms except Brewery produce **0 output today**
   (`shutdown_except_brewery_today = True`)
2. Brewery produces **6×** its normal output multiplier (apply as `sup_mult_brewery = 6.0`)
3. Set equipment condition for all rooms 2–5 to **1.0**

### Structural consequences (next 3 days)

Duration: 3 days (`refactor_days=3`)

* Override productivity multiplier formula globally:
  [
  prod_mult = clamp01(0.30 + 0.90D - 0.60S)
  ]

* Political impacts immediately:

    * factory alignment −0.20
    * rigidity +0.35
    * radical_potential +0.30
    * innovation_pressure +0.25
    * CATHEXIS confidence +0.20 (backlash momentum)

* Additional risk clause while `refactor_days>0`:

    * if factory discipline average (D^{factory}<0.60) at end of any day:

        * global accident chance +0.15 (additive) next day

### Reset

* W confidence → 0.50
* W cooldown_days → 2

## 10.2 THRUM — “Harmonic Dissolution”

**Trigger:** T confidence ≥ 1.0, T assigned to Weaving (5), player allows.

### Immediate (today)

1. All rooms except Weaving operate at **0.5×** base output (apply `sup_mult_global_nonweave = 0.5`)
2. Weaving produces **0** today (T is ritual-only)
3. Factory stress −0.50 (clamp ≥0)
4. Factory discipline −0.40 (clamp ≥0)

### Structural consequences (next 2 days)

Duration: 2 days (`alignment_inversion_days=2`)

* Invert indoctrination effect on alignment updates:

    * Replace (+\gamma_I I) with ( -\gamma_I I) in Alignment equation (only while inversion active).

* Political impacts immediately:

    * rigidity −0.40
    * radical_potential +0.20
    * innovation_pressure −0.25
    * If CATHEXIS exists (unlocked), her influence +0.20 immediately
    * If LIMEN exists, his loyalty −0.15 immediately

* Additional risk while inversion active:

    * global accident chance +0.05 (additive) for 2 days (discipline shock)

### Reset

* T confidence → 0.40
* T cooldown_days → 2

## 10.3 Other supervisors (already specified)

* **LIMEN security lockdown:** if L confidence ≥1.0 AND in Security and allowed, factory output = 0 for the day (no workers enter rooms), discipline spike (large), stress +small. (Exact numbers may be tuned; must be on par with others.)
* **STILETTO conveyor overdrive:** if S confidence ≥1.0 in Conveyor and allowed: 3× base output, 3–6 casualties, conveyor equipment → 0 (broken).
* **CATHEXIS theatre revolution:** if C confidence ≥1.0 in Theatre and allowed: set all worker alignment to 0.

(These three are existing canon and must be implemented; numeric side-effects beyond the core statements can be tuned later, but must remain dramatic.)

---

# 11. Supervisor-room outcome behaviors (production/accidents/damage tables)

This spec preserves the **canonical behaviors** you defined. Implementation should represent them as a structured table per (supervisor, room) that yields:

* `sup_mult` (production multiplier or override)
* `casualties`
* `equipment_damage`
* `fiasco_severity` F in {0,0.5,1}
* optional special outputs (e.g., “doubles next day”, “repair first”)

### 11.1 LIMEN

* Security:

    * affects hours via §8.1, confidence grows on security
    * if confidence==1 and allowed → lockdown (see §10.3)
* Conveyor:

    * fixed base output at 0.7 “guaranteed no accidents” (treat as `sup_mult` override or direct O value)
* Theatre (equal 25% outcomes):

    * 25% small fiasco: no production effect change (treat as neutral), F=0.5
    * 25% total fiasco: no production effect + equipment damage 0.1–0.4, F=1.0
    * 25% small success: 0.5× base rate, F=0
    * 25% total success: 1.0× base rate, F=0
* Brewery (33%):

    * small fiasco: 0.5×, damage 0.1–0.3, F=0.5
    * total fiasco: 0.3×, damage 0.1–0.3, +1 casualty, F=1.0
    * small success: 0.5×, no damage, F=0
* Weaving (33%):

    * small fiasco: 0.5×, damage 0.1–0.3, F=0.5
    * total fiasco: 0×, damage 0.3–0.7, F=1.0
    * small success: 0.5×, no damage, F=0

### 11.2 STILETTO

* Security:

    * redistributes toward conveyor; hours 9
* Conveyor (native; 25% each):

    * small fiasco: 1.3×, 1 casualty, damage 0.1–0.3, F=0.5
    * total fiasco: 1.3×, 1–3 casualties, damage 0.2–0.4, F=1.0
    * small success: 1.5×, 0–1 casualty, damage 0.1, F=0
    * total success: 2.0×, 0 casualties, damage 0.1, F=0
    * if confidence==1 and allowed → overdrive: 3×, 3–6 casualties, conveyor equipment→0
* Brewery (33%):

    * small fiasco: 0.3×, damage 0.1–0.2, F=0.5
    * total fiasco: 0×, damage 0.2–0.5, +1 casualty, F=1.0
    * small success: 0.5×, no damage, F=0
* Weaving (33%):

    * small fiasco: 0×, damage 0.1, F=0.5
    * total fiasco: 0×, damage 0.3–0.7, F=1.0
    * small success: 0.5×, no damage, F=0

### 11.3 CATHEXIS

* Security:

    * abandons post; random worker placement; absenteeism based on discipline
* Conveyor:

    * 50% fiasco: leaves shift; base rate determined by discipline in conveyor (use default formula with no sup mult)
    * 50% success: 0.5× base rate; loyalty drops
* Theatre (native):

    * always “glorious shift”: 2× base rate; confidence+influence up
    * if confidence==1 and allowed → revolution: alignment of all workers → 0
* Brewery:

    * 0.7× base; loyalty drops
* Weaving:

    * 1.0× base; no loyalty change

### 11.4 RIVET WITCH

* Security:

    * redistributes toward brewery+weaving; hours 9
* Conveyor/Theatre/Brewery/Weaving:

    * repair-first: 1 hour per 0.1 missing condition, then produce with remaining hours
    * WITCH works full day even if LIMEN reduced hours (room-specific override: WITCH rooms use 9 hours for her action)
    * Conveyor after repairs: 1.0× base for remaining hours
    * Theatre after repairs: 0.3× base for remaining hours
    * Brewery (native): no failure, only success:

        * 50% small success: 1.0× base
        * 50% total success: 3.0× base
        * gains confidence on success
    * Weaving: after repairs produces 0× today but sets next-day multiplier based on remaining hours (temp modifier)

**WITCH critical event** is defined in §10.1.

### 11.5 THRUM

* Security:

    * 50% success: randomized room placement
    * 50% failure: randomized placement + additional absenteeism based on discipline
* Conveyor:

    * 0.2× base; stress drops by 0.3 × proportion of workers on conveyor
* Brewery:

    * 0× base; discipline −0.5; stress −0.5 across factory
* Weaving (native):

    * fixes all equipment damage (E→1)
    * 0× base today
    * doubles next-day base rate (weaving_boost_next_day ×= 2)

**THRUM critical event** is defined in §10.2.

> Note: For all “randomized chance” outcomes, sim must use deterministic RNG seeded by (global seed, day, room, supervisor).

---

# 12. Economy and units model

All production is computed as continuous **Work Units (WU)** then converted to integers via stochastic rounding.

## 12.1 Conversion constants (tuning knobs)

* `BRAINS_PER_WU = 4` (Conveyor produces raw brains)
* `WASH_CAPACITY_PER_WU = 5` (Theatre washes raw brains)
* `SUBSTRATE_GAL_PER_WU = 3` (Brewery)
* `RIBBON_YARDS_PER_WU = 2` (Weaving)

## 12.2 Brain pipeline

* Conveyor produces `raw_brains`:

    * `raw_brains_total = round_stochastic(O_conveyor * BRAINS_PER_WU)`
    * smart share = `smart_present / max(1, present_total)`
    * `raw_smart = round(raw_total * smart_share)`
    * `raw_dumb = raw_total - raw_smart`

* Theatre consumes raw brains and produces washed brains:

    * `wash_capacity = round_stochastic(O_theatre * WASH_CAPACITY_PER_WU)`
    * wash smart first, then dumb, up to capacity.

## 12.3 Materials

* Brewery: `substrate += round_stochastic(O_brewery * 3)`
* Weaving: `ribbon += round_stochastic(O_weaving * 2)` then apply any next-day boosts as modifiers (not extra ribbon).

## 12.4 Selling

Only washed brains are sellable:

* `SELL_WASHED_DUMB = $10`
* `SELL_WASHED_SMART = $25`

End-of-day sell action subtracts inventory and adds cash.

## 12.5 Converting brains to workers

* Convert 5 washed dumb → +1 dumb worker
* Convert 5 washed smart → +1 smart worker

Constants:

* `CONVERT_COST = 5`

## 12.6 Upgrading brains (brewery+weaving linkage)

Upgrade recipe:

* Spend **1 substrate + 1 ribbon** to convert:

    * 1 washed dumb → 1 washed smart

This is performed in an end-of-day crafting step before selling/converting.

---

# 13. Factory-level aggregates

Compute worker-weighted averages using **present workers**:

For any X in {S,D,A}:
[
X^{factory} = \frac{\sum_r present_r \cdot X_r}{\sum_r present_r}
]

Use these for:

* CATHEXIS/THRUM security absenteeism rules
* global event checks (strike state if later added)
* critical event conditional clauses (e.g., WITCH refactor discipline threshold)

---

# 14. Conflicts system

Conflicts are systemic, adjacency-based, and unfold over two encounters.

## 14.1 Affinity

Initialize hostility:

* LIMEN ↔ STILETTO: hostile
* LIMEN ↔ CATHEXIS: hostile
* STILETTO ↔ CATHEXIS: hostile
  Others neutral (can be extended later).

## 14.2 Discovery vs conflict

If hostile pair is placed in connected rooms:

* First adjacency while undiscovered:

    * “Tension Discovered”
    * set discovered=true
    * effects:

        * discipline in both rooms −0.05
        * loyalty of both supervisors −0.02

* Subsequent adjacency:

    * trigger “Conflict Event”
    * **max 1 conflict event per day** (priority: edges involving security, then 2–3, 2–4, 4–5)

## 14.3 Conflict resolution outcomes

Player chooses support A, support B (mediation optional; can be omitted in v1).

Winner effects:

* confidence +0.10
* influence +0.10
* loyalty +0.03

Loser effects:

* confidence −0.05
* influence −0.05
* loyalty −0.07

Room effects for the day:

* winner room: L +0.10 (clamp)
* loser room: L −0.10 (clamp)
* I shifts ±0.05 toward winner’s ideology (implementation: if winner has positive I baseline, +0.05; if negative, −0.05)

Factory side effects (small but meaningful):

* If winner LIMEN: discipline +0.03, alignment +0.01, stress +0.02
* If winner STILETTO: stress +0.05, conveyor output +0.05 multiplier
* If winner CATHEXIS: alignment −0.05, stress −0.02, discipline −0.03
* If winner WITCH: equipment in both adjacent rooms +0.05
* If winner THRUM: stress −0.05, discipline −0.02

Conflicts also feed hidden accumulators (§15).

---

# 15. Hidden accumulators (Floor 2 seeds)

Update daily (not shown in Floor 1 UI):

* **rigidity** increases with:

    * LIMEN security days
    * high factory discipline
    * LIMEN conflict wins
    * WITCH System Refactor

* **radical_potential** increases with:

    * low alignment
    * CATHEXIS influence and conflict wins
    * casualties
    * THRUM Harmonic Dissolution / alignment inversion

* **innovation_pressure** increases with:

    * STILETTO high output and overdrive
    * WITCH big batches
    * weaving upgrades and high smart-worker conversion
    * decreases with THRUM event

Exact daily update functions can be linear (small increments) and tuned later; must be deterministic and reflect these drivers.

---

# 16. Daily resolution pipeline (canonical order)

The sim must process each day in the following deterministic order:

1. Load start-of-day state.
2. Validate supervisor assignments (room 6 locked, uniqueness).
3. Validate worker proposal against capacities and available workers.
4. Determine Security lead (room 1 occupant; else chaos baseline).
5. Compute hours (LIMEN penalty with cap); set H.
6. Apply security redistribution to worker proposal → final assigned counts.
7. Compute absenteeism baseline; apply security absentee modifiers (CATHEXIS, THRUM failure).
8. Compute present workers per room (floor).
9. Detect hostile adjacency pairs → schedule either discovery or conflict (max 1 conflict/day).
10. Resolve discovery/conflict now (apply immediate stat mods and daily L/I adjustments).
11. For each room, determine today’s base L/I/Rsup from lookup or defaults.
12. Apply repair-first actions (WITCH repairs; THRUM weaving repair), compute effective hours per room.
13. Compute accident chances; then resolve supervisor-room outcome tables (which may override casualties/damage/output).
14. Apply any remaining generic accidents for non-overridden rooms.
15. Apply equipment damage updates.
16. Compute base capacity `Cap_r` from base rate × (hours_r/9) × equipment.
17. Compute productivity multiplier (normal or overridden by regime shifts).
18. Apply supervisor multipliers and temp modifiers (e.g., weaving_boost_next_day).
19. Compute actual output `O_r`.
20. Convert outputs to units (brains/materials) via constants and stochastic rounding.
21. Compute perceived progress (P_r).
22. Compute event relief (R^{event}), total relief R.
23. Update worker states via the 3 equations (synchronous).
24. Update supervisor loyalty/confidence/influence (including tension zone multipliers).
25. If any supervisor eligible for critical event, prompt allow/suppress; apply event if allowed; enforce 1 critical/day.
26. Apply casualties to worker pools (remove workers).
27. End-of-day crafting: upgrades (substrate+ribbon), then selling, then conversions.
28. Update hidden accumulators.
29. Decrement durations: cooldown_days, refactor_days, inversion_days, etc.; clear day-only flags.
30. Persist end-of-day state as next day start; increment day.

---

# 17. Starting state and unlock pacing (Floor 1 onboarding)

## 17.1 Initial state (Day 0)

Workers: 10 (7 dumb, 3 smart)
Cash: $50
All inventories 0
Equipment E for rooms 2–5 = 1.0
Worker state per room (2–5):

* stress random 0.05–0.15
* discipline 0.55
* alignment 0.55

Supervisors unlocked by day:

* Day 0: LIMEN
* Day 1: + STILETTO
* Day 2: + CATHEXIS
* Day 3: + RIVET WITCH
* Day 4: + THRUM

Rooms unlocked by day:

* Day 0: security only (no production)
* Day 1: conveyor
* Day 2: theatre
* Day 3: brewery
* Day 4: weaving
  Room 6 locked always.

## 17.2 Early-game guardrails (optional but recommended)

* Cap casualties to 1/day for days 0–2 unless a special scripted event is enabled.
* Prevent critical events from triggering before day 5 (e.g., clamp confidence to 0.95 pre-day5).
  These are balancing guardrails; can be toggled in config.

---

# 18. Worker assignment persistence model (simulation-side)

The sim should store the **post-security** final assignment as the template for next day’s default proposal (the UI can still allow edits). New workers enter the unassigned pool by default.

When new rooms unlock, initial default assignments for them are 0 (player must allocate).

---

# 19. Determinism and RNG

All randomness must be deterministic from:

* a fixed `seed`
* day index
* room id
* supervisor id
* event type

Use a stable RNG function that can generate:

* uniform floats
* discrete outcome selection
* stochastic rounding

**Stochastic rounding** for converting float items:

* let x = float
* n = floor(x), f = x-n
* return n+1 with probability f else n

---

# 20. Notes on “completeness” and tunability

The following are **explicit tuning knobs** and should be centralized in config:

* Worker equation coefficients (α/β/γ)
* L/I tables
* Conversion constants (brains per WU, etc.)
* Sell prices
* Conversion/upgrade recipes
* Security redistribution policy parameters (priorities, biases)
* Conflict deltas
* Confidence deltas, tension-zone multiplier, thresholds
* Critical event magnitudes and durations

The sim must expose enough metrics per day (room-by-room results, casualties, equipment deltas, S/D/A changes, supervisor changes, inventories) for balancing.

---

## Implementation checklist (Codex must be able to build from this)

* [ ] Data model for rooms/supervisors/workers/inventory
* [ ] Daily step function implementing §16 pipeline
* [ ] Validation of assignments and capacities
* [ ] Security redistribution + attendance modifiers
* [ ] Conflict discovery + conflict resolution
* [ ] Repair-first system
* [ ] Outcome tables per supervisor-room
* [ ] Production WU + unit conversion
* [ ] Worker state updates (3 equations)
* [ ] Supervisor stat updates with tension zone + cooldown
* [ ] Critical event prompt + allow/suppress with regime shift modifiers
* [ ] End-of-day upgrade/sell/convert
* [ ] Hidden accumulators updates
* [ ] Deterministic RNG + stochastic rounding
* [ ] Config centralization for tunables

---

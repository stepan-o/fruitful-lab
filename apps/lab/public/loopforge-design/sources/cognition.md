# 🧠 LOOPFORGE COGNITIVE ARCHITECTURE SPEC

**Belief + Emotion + Traits + Memory — The Full Mental Stack v1**

This document defines **how Loopforge robots “have a mind”** — not in the sci-fi sense, but in the **narrative-diagnostic sense** that turns telemetry into psychology.

It is **not** a learning system,  
**not** a hidden LLM,  
**not** a stochastic brain.

It _is_ a deterministic, inspectable, multi-layer **interpretation engine** that derives coherent “robot psychology” from raw telemetry — so the show has arcs, not noise.

This spec is the contract for future architects and future LLM layers.

---

## 0. Purpose

Robots in Loopforge should feel:
* explainable,
* emotionally readable,
* narratively coherent,
* and diagnostically useful.

The Cognitive Architecture gives us that by stacking **five layers** above telemetry:
1. **Belief State** (per day)
2. **Emotion State** (per day)
3. **Trait Snapshot** (per episode)
4. **Long Memory** (cross-episode)
5. **Episode Story Arc** (the “how the season felt” layer)

All layers are **read-only** relative to simulation.  
The simulation stays physics.  
This stack turns physics into psychology.

---

## 1. The Cognitive Layers (Bird’s Eye View)

The architecture is tiered:

---

### 1.1 BeliefState (per agent, per day)

_“What the robot thinks the day meant.”_

Derived purely from telemetry:
* stress arcs
* tension trend
* guardrail/context ratio
* incidents
* supervisor actions
* traits

**Fields**
* `supervisor_trust` (0–1)
* `guardrail_faith` (0–1)
* `self_efficacy` (0–1)
* `world_predictability` (0–1)
* `risk_bias` (–1..1)
* `incident_attribution` (“self”, “world”, “supervisor”, “random”)

Represents _cognitive interpretation_ of the day’s events.

### 1.2 AgentEmotionState (per agent, per day)

_“How the day felt.”_

Inputs:
* average stress
* stress deltas
* tension
* incidents
* supervisor tone

**Fields**
* `mood` (“tense”, “steady”, “calm”, “drained”, “wound tight”)
* `certainty` (0–1)
* `energy` (0–1)

This layer powers emotional language in:
* day narratives
* daily logs
* episode emotional color

---

### 1.3 TraitSnapshot (per agent, per episode)

_“Who the robot was this episode.”_

Drifts very slowly (clamped deltas).  
Baseline = 0.5 for all traits.

**Traits**
* `resilience`
* `caution`
* `agency`
* `trust_supervisor`
* `variance`

Derived from aggregated telemetry + reflections.

Used in:
* recaps
* explainers
* LLM lens

---

### 1.4 AgentLongMemory (cross-episode)

_“Who the robot is becoming across seasons.”_

This layer persists between episodes.

**Fields**
* `episode_count`
* `cumulative_stress`
* `long_term_trust_supervisor`
* `self_trust`
* `stability`
* `reactivity`
* `agency`

Very small drift per episode.  
Captures “identity” rather than mood or belief.

Used by:
* long-term explainers
* future multi-episode dashboards
* LLMs (as high-level personality context)

---

### 1.5 EpisodeStoryArc (per episode)

_“What story did this episode tell?”_

Extracted from:
* tension trend
* supervisor pattern
* emotional tone
* guardrail/context bias
* incident surface

**Fields**
* `arc_type` (“decompression”, “escalation”, “flatline”, “late_spike”)
* `tension_pattern`
* `supervisor_pattern`
* `emotional_color`
* `summary_lines`

Used directly in:
* episode recaps
* “view-episode” CLI
* LLM episode lens

---

## 2. Deterministic Derivations

Every field in every layer must be:
* telemetry-derived,
* explainable,
* deterministic,
* reproducible.

No diffusion models.  
No hidden states.  
No stochastic sampling.

Here are representative rules (not exhaustive).

---

### 2.1 Belief Derivations
#### Supervisor Trust
```
high supervisor activity + stress↓ → trust↑
high supervisor activity + stress↑ → trust↓
incidents during supervisor silence → trust↓
punitive supervisor tone → trust↓↓
```
#### Guardrail Faith
```
guardrail-only + few incidents → faith↑
guardrail-only + many incidents → faith↓
context success → faith↓ (rule loosening)
context incidents → faith↑ (rule tightening)
```
#### Self-Efficacy
```
successful context → efficacy↑
failed context → efficacy↓
strict protocol + rising stress → efficacy↓ (“helplessness”)
```
#### World Predictability
```
random incidents → predictability↓
consistent tension → predictability↑
contradictory supervisor → predictability↓↓
```

### 2.2 Emotion Derivations

Example mapping:
```
avg_stress < 0.08 → mood="calm"
avg_stress 0.08–0.3 → mood="steady"
avg_stress > 0.3 → mood="tense"
high incident density → mood="wound tight"
tension↓ + low incidents → energy↑
tension↑ + high incidents → energy↓
```
### 2.3 Trait Drift

All deltas are clamped:
```
-0.05 ≤ Δtrait ≤ +0.05
```

Examples:
```
high autonomy success → agency↑
punitive supervisor streak → trust_supervisor↓
stable low stress → resilience↑
wild incident swings → stability↓, variance↑
```

Traits drift per episode, not per day.

---

### 2.4 Long Memory Derivations

Small adjustments per episode:
```
cumulative_stress += avg(stress)
long_term_trust_supervisor += Δsmall
self_trust follows long-term efficacy trend
stability decreases with chaotic tension patterns
agency increases with consecutive context wins
```
### 2.5 Story Arc Derivations
#### Arc Type
```
tension falling → “decompression”
tension rising → “escalation”
flat high → “burnout plateau”
late spike → “late_spike”
```
#### Emotional Color

Derived from aggregate mood/energy:
* “brooding optimism”
* “calm discipline”
* “tense vigilance”
* “low-grade paranoia”
* “quiet recovery”

---

## 3. Integration With Telemetry

Everything above sits on this foundation:
```
ActionLogEntry JSONL
  ↓
DaySummary / AgentDayStats
  ↓
EpisodeSummary / AgentEpisodeStats
  ↓
BeliefState / EmotionState
  ↓
TraitSnapshot (end of episode)
  ↓
LongMemory (cross-episode)
  ↓
EpisodeStoryArc
```

The simulation **never** sees these layers.
These layers **never** modify the simulation state.

They only inform:
* narratives
* recaps
* logs
* explainers
* lens inputs

## 4. Narrative Integration

These layers power every cinematic debugger output.

### Day Narratives
* mood words from `EmotionState`
* belief-line from `BeliefState`
* tension flavor from `DaySummary`

### Daily Logs
* `Emotion: X`
* `Belief: Y`
* deltas compared to previous day

### Episode Recaps
* stress arc
* belief arc
* trait drift
* emotional color

### Explainers
* “risk of burnout” from emotion/belief
* “tightened under pressure” from stress arcs
* “trust collapse” from supervisor trust drift

### LLM Lens

Inputs include:
* tension
* avg_stress
* guardrail/context ratio
* supervisor tone hint
* belief scores
* trait snapshot
* story arc

Outputs are commentary only.

---

## 5. LLM Contract (Non-Negotiable)

LLMs may:
* label emotions
* infer risks
* suggest supervisor prompts
* provide narrative gloss
* detect emerging arcs

LLMs may NOT:
* modify BeliefState
* modify EmotionState
* modify TraitSnapshot
* modify LongMemory
* generate new numbers
* override deterministic derivations
* alter simulation state

LLMs are **commentators**, not **participants.**

## 6. Testing Strategy

We test psychology by running different canonical robots and verifying that:
* their belief arcs diverge,
* their emotional arcs differ,
* their traits drift appropriately,
* their long memories evolve in distinct trajectories,
* their story arcs make narrative sense.

If all robots converge to similar states,
**the cognitive architecture is wrong.**

## 7. Success Criteria

The architecture is successful if we can say:
* “Delta tightened into protocol rigidity after three punitive supervisor corrections.”
* “Nova’s trust never recovered after the Day 2 silence.”
* “Sprocket’s agency rose across the season due to consistent context wins.”
* “The episode’s emotional color shifted from tense vigilance to quiet recovery.”
* “LongMemory shows a slow trust erosion across five episodes despite stable outcomes.”

…AND we can point directly to telemetry that caused it.

---

## 8. Closing Notes (PARALLAX Edition)

This is the mind of Loopforge:
* Belief explains interpretation.
* Emotion explains feeling.
* Traits explain behavior tendencies.
* Long Memory explains character evolution.
* Story Arc explains narrative shape.

The simulation stays physics.  
The cognitive architecture turns physics into psychology.  
The cinematic debugger makes psychology fun to watch.

This stack is durable.  
Extend it, don’t mutate it.

Onward.

— PARALLAX
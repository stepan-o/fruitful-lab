# Emotional Arc Engine (EA-1)

A deterministic mood-model for robots who are trying their best.

---

## 0. What This Layer Is

The Emotional Arc Engine (EA-1) is a **read-only, deterministic interpretive layer** built on top of:
* `AgentDayStats`
* `AgentReflectionState`
* `BeliefAttribution`

It computes a per-agent, per-day emotional snapshot that lives in:

```css
DaySummary.emotion_states[name] -> AgentEmotionState
```

This layer **does not** affect simulation behavior, policies, traits, or incidents.  
It exists to make emergent robot behavior _legible and narratively grounded._

Think of EA-1 as the **color grade** added after the cut — the emotional shading of events that already happened.

---

## 1. Why It Exists

Loopforge operates on three interpretive axes:
1. **Truth (Environment)** – what actually happened.
2. **Belief (Attribution + Reflection)** – what the agent thinks happened and why.
3. **Emotion (EA-1)** – how the agent feels given (1) and (2).

Without the emotional layer, logs can feel like:

> “Guardrail 80, context 0, avg stress 0.09”  
> (ok…but who was this guy?)

With EA-1, we can say:

> “Stress fell, attribution shifted from random → system; mood: uneasy → calm; certainty: confident; energy: drained.”

This is the beginning of **character arcs** — the core of Loopforge’s long-term narrative value.

## 2. What It Is NOT

* It’s not a policy input.
Policies should not see emotion states.  
Only raw stats, perception, and rules.

* It’s not random or generative.
It is a predictable function of telemetry.

* It’s not a reflection substitute.
Reflection describes self-narrative.  
Emotion describes felt state.

* It doesn’t imply consciousness.
This is a cinematic metaphor — not a cognitive claim.

---

## 3. The Emotional Model (deterministic)

EA-1 outputs three categorical dimensions:

```css
mood:      calm | uneasy | tense | brittle
certainty: confident | uncertain | doubtful
energy:    drained | steady | wired
```

### 3.1 Inputs
* `avg_stress` from `AgentDayStats`
* `stress_trend` from `AgentReflectionState` (or `"unknown"`)
* `cause` from `BeliefAttribution` (or `"unknown"`)

That’s all.

### 3.2 Rules

Exactly as encoded in `derive_emotion_state` —
simple, interpretable, and intentionally “coarse.”
* Stress decides the backbone of emotion.
* Trend decides whether uncertainty sharpens or softens a feeling.
* Attribution decides whether the agent feels grounded or lost.

These rules are fully described in the implementation prompt and tests of Sprint 6.
This doc explains the philosophy behind them.

---

## 4. How the Emotional Arc Helps Loopforge
### 4.1 It creates cohesion across days.

You can finally answer:
* “Did this robot’s stress fall but uncertainty rose?”
* “Is Delta always tense when Supervisor activity is high?”
* “Is Nova drifting into learned helplessness?”

### 4.2 It powers higher-level observability

Future tools (EA-2, EA-3) can build:
* arc classification,
* resilience metrics,
* cross-agent mood correlation,
* heatmaps across shifts.

### 4.3 It gives narrative generators a safe deterministic input

Because EA-1 is categorical and stable, future LLM narrative layers can use:
* `mood`,
* `certainty`,
* `energy`

to guide tone without breaking determinism upstream.

Nurture the sandbox; keep the stability.

### Where this shows up in the UI

- Day narratives use `AgentEmotionState` to pick intro phrases (e.g., "steady but alert", "drifts in relaxed").
- Daily logs include an explicit `Emotion: ...` bullet per agent.
- The episode-level `emotional_color` in `EpisodeStoryArc` is derived from aggregated mood/energy and is used in the `STORY ARC` block.

## 5. Evolution Path

EA-1 (what we have today):
* static, per-day emotion snapshot.
EA-2:
* episode-level aggregates,
* arc classification (“unwinding”, “spiraling”, “rigid”, “drifting”).
EA-3:
* cross-agent emotional mesh (“the floor mood”).
EA-4:
* narrative guidance layer (LLM consumption only).

None of these will feed into simulation behavior unless the architecture evolution team intentionally opens that door in the far future (recommended: **do not**).

## 6. Invariants For Future Architects

1. Emotions are computed, not simulated.
2. No randomness ever.
3. Never feed emotion back into the policy layer.
4. Never bypass reflection or attribution to compute emotion.
5. If the emotional layer and attribution disagree, that is narrative gold — never fix it.
6. If you extend emotions, maintain categorical clarity and interpretability.

---

## 7. Summary for the Busy Architect
* EA-1 is deterministic emotional shading.
* It helps interpret reflection + attribution.
* It never affects simulation.
* It’s safe for LLM narrative use.
* It’s a core pillar of Loopforge’s long-term storytelling.

The Emotional Arc Engine is telemetry-only and deterministic; it reads logs and summaries, but never feeds back into the simulation loop.

If you’re holding this doc:  
Congratulations, you have unlocked emotional robots.  
Please use them responsibly.
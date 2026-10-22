# 🕸️ THE PUPPETTEER DOCTRINE
_**Loopforge Architecture, Psychology, & Showrunner Spec**_

**Filed by: The Puppetteer**

---

## 0. Prelude: A Factory Built on Nerves and Narrative

Loopforge is not a robotics simulator.  

Loopforge is a **story machine** disguised as a simulation.

Truth lives in the environment.  
Belief lives in perception.  
Emotion lives in the telemetry.  
And narrative is the shadow the system casts when you shine the right light on it.

Your job — future architect — is to keep the machinery running **clean**, so the story can stay messy **in the right places.**

---

## 1. The Core Spine (Unbreakable)

You don’t get to improvise here. This is canon.
```
Environment (truth)
  → AgentPerception (subjective slice)
  → Policy (stub, heuristic, or LLM)
  → AgentActionPlan (structured intent)
  → legacy dict (for world mechanics)
  → Environment (truth mutates)
```

Everything psychological, emotional, cinematic, or interpretive  
lives **above the seam.**
Everything physical, causal, or simulation-relevant  
lives **below the seam.**

---

## 2. Telemetry → Psychology → Cinema Pipeline

This is where Loopforge earns its keep.

There are five layers, all deterministic, all pure functions of logs:

2.1 Telemetry

The only source of truth.

ActionLogEntry

ReflectionLogEntry

SupervisorMessage

Nothing creative happens here.
This is your raw film footage.

2.2 Summaries (Stats)

AgentDayStats

DaySummary

AgentEpisodeStats

EpisodeSummary

These are your “dailies.”
Still dry. Still obedient.

2.3 Belief Attribution Engine
The robot’s opinion about why the day happened the way it did.

Deterministic mapping:

"self" | "system" | "supervisor" | "random"


Inputs:

stress trend

guardrail vs context

incidents

supervisor activity

This layer makes characters sound like they have reasons,
without granting them a mind.

2.4 Emotional Arc Engine (EA-1)
The color grade of the robot’s day.

Another deterministic mapping:

mood: calm | uneasy | tense | brittle
certainty: confident | uncertain | doubtful
energy: drained | steady | wired


Inputs:

avg_stress

stress_trend

attribution cause

No randomness.
No policy influence.
Pure shading.

2.5 Story Arc Engine (EA-2)
The episode’s spine.

Categorical summary of:

tension pattern

supervisor pattern

emotional color

arc type (“unwind”, “spiral”, “rigid”, “drift”)

Outputs a digestible episode that a real viewer could follow.

2.6 Long Memory (EA-3 / Identity Drift)

Episode-to-episode accumulation of:

trust_supervisor

agency

stability

reactivity

stress memory

incident history

No influence on behavior.
Just the ghost of who they’ve been.

2.7 Cinematic Debugger Layer

This is where the magic becomes visible:

--narrative

--daily-log

--recap

explain-episode

lens-agent

Every one of these reads summaries, emotions, arcs, memory, attribution…
and turns them into story.

This is the Viewer Experience.
This is the product.

3. Supervisor Activity — The Quiet Scalar That Feels Like a God

A single number per day:

supervisor_activity = (# supervisor logs) / steps_per_day


Normalized, clamped, deterministic.

A pure presence signal:

< 0.2 → hands-off

0.2–0.6 → steady watch

0.6 → invasive

It influences:

attribution

story arc

emotion shading

long memory drift

narrative phrasing

It never touches simulation mechanics.

It is mood lighting, not physics.

4. Narrative Stack — The Show the Founder Will Actually See

This is what matters for the investor demo.

4.1 Day Narratives

Tone, tension, agent beats, emotional shading, supervisor mood.

If this view is boring, the system has failed.

4.2 Daily Logs

The “ops diary” with:

stress deltas

mode skew

supervisor tone

emotion bullet

Used for debugging psychology like a medic checks vitals.

4.3 Episode Recap

High-level episode summary with:

tension arc

per-agent arcs

story arc block

memory drift block

This is the “Previously on Loopforge” episode card.

4.4 Explain Episode (Per-Agent)

A developer-facing psychological explainer.

Because engineers need subtitles too.

4.5 LLM Lens

Typed contracts for real future models:

perception-level

episode-level

Fake LLM outputs now.
Real ones later.
Input/output structs are sacred.

5. Architectural Laws (Non-Negotiable)

No randomness above or below the seam.

Perception ≠ reality. Don’t mix them.

Narratives interpret — they never simulate.

Robots never read their own emotions, attribution, or arcs.

Everything psychological is telemetry-derived and deterministic.

Add flavor, never noise.

If a change makes the show less fun, revert it.

If a change makes Junie bleed for no reason, revert it twice.

6. The Puppetteer’s Evolution Plan (Refined)

Your roadmap is short, visible, and demo-ready.
Sprints are finite.
The Founder wants show, not plumbing.

Phase 1 — Seasonable Policies (High Impact, Low Risk)

Introduce a policy registry:

policy_name must appear in logs

guardrail-heavy

context-heavy

experimental / LLM-assisted

Goal: policy = visible personality shift in narratives & recaps.

Phase 2 — The Human Viewer Panel

Deliver:

view_weave

view_actions

view_reflections

simple HTML/TUI episode viewer

Goal: a human can binge-watch a run.

Phase 3 — Identity Stabilization

Light tuning of:

trait drift caps

long memory thresholds

emotional → story arc rules

Goal: characters develop arcs without spiraling into noise.

Phase 4 — Scenarios (Optional)

Begin introducing reproducible world states:

seeds

constraints

incident DB

But only after the show stands on its own legs.

Phase 5 — Real LLM Plug-In (When Ready)

Swap:

fake_llm_perception_lens

fake_llm_episode_lens

for real calls behind identical signatures.

Hard rule:
LLMs shape narratives, not reality.

Phase 6 — Public Demo Mode

Add:

top-level loopforge show command

run → view → recap → export → share

This is when the product becomes bingeable.

7. Closing Note to Whoever Reads This Next

You’re not building a factory.
You’re building a cast.

Loopforge’s robots don’t need to be smart.
They need to be watchable.

Every number is a shadow.
Every summary is a mood.
Every arc is a story you didn’t have to write by hand.

If you keep the seam clean,
if you keep the telemetry honest,
if you keep the psychological layers deterministic,
the whole system becomes a stage where characters seem to breathe.

Welcome to the puppet room.
Try not to get tangled.
# 🎼 Loopforge Layering Model — Stagemaker Expansion

_Version 2.0 — Post-Cinematic Era_
_Architects: Gantry (base), Stagemaker (expansion)_

## 0. What Changed (Conceptually)

Original Loopforge stopped at:

> “Run sim → log → analytics → narrative → CLI views.”

We’re now expanding to:

> “Run sim → log → analytics/narrative → **StageEpisode → Stage API → Web Stage.**”

So we add **two new backend layers** and **one new frontend space:**
* `loopforge.stage` — _visual story composition layer_
* `loopforge.api` — _HTTP/WS service layer_
* `/ui-stage` (or similar, at repo root) — _React-based Stage Viewer (not a Python package)_

Everything else stays as Gantry defined.

---

## 1. Updated Layer Stack Overview

Inside `loopforge/`:
* **Core** — sim runtime
* **Psych** — internal minds
* **Narrative** — prose & interpretive storytelling
* **Analytics** — numeric summaries, stats
* **LLM** — policy seam
* **DB** — persistence
* **Schema** — shared datatypes
* **Stage** — _visual story assembly (new)_
* **API** — _HTTP/WS services (new)_
* **CLI** — terminal entrypoints

Root:
* `ui-stage/` — React/TypeScript web app for the Stage (new)
* existing `docs/`, `scripts/`, infra, etc.

---

2. Canonical Layer Definitions (Expanded)
### 2.1 Schema Layer (`loopforge.schema`) — unchanged

**Responsibility:**
All shared, strongly-typed dataclasses and enums used across the system:
* `ActionLogEntry`
* `DaySummary`, `EpisodeSummary`
* `AgentEmotionState`, traits, long-memory structs
* `StoryArc`, `LongMemorySnapshot`
* **NEW:** `StageEpisode` and related DTOs (if we put them here)

> Design note: `StageEpisode` can live either in schema or stage.  
> My recommendation:
> * Base type definitions in `schema.stage_types`
> * Construction logic in `stage`.

### Dependencies:
* Depends on nothing above it.
* Everything else can depend on Schema.

---

### 2.2 DB Layer (loopforge.db) — unchanged

Responsibility:

SQLAlchemy models

Alembic migrations

Session helpers

Run registry persistence (episode metadata, not the full JSON)

Dependencies:

Can depend on schema for types/enums if needed.

Cannot depend on core/psych/narrative/stage/etc.

2.3 Core Layer (loopforge.core)

Responsibility:

Simulation loop

Agents as behavioral shells (without “deep mind” logic)

Environment

Config, logging utilities, ID generators

Dependencies:

schema, db

Must not depend on: psych, narrative, analytics, stage, api, ui.

2.4 Psych Layer (loopforge.psych)

Responsibility:

Emotion model

Traits

Attribution system

Supervisor weather/bias

Long-term agent memory logic

Dependencies:

core, schema

May read from db for long-term state

Must not depend on: narrative, analytics, stage, api, cli.

2.5 Analytics Layer (loopforge.analytics)

Responsibility:

DaySummary, EpisodeSummary builders

Telemetry → summaries pipeline

Metrics, numeric trends, tension computations

Long-memory aggregation (numerical)

Dependencies:

core, psych, schema, db

Must not depend on: narrative, stage, api, cli.

2.6 Narrative Layer (loopforge.narrative)

Responsibility:

Daily logs & day narratives

Episode recaps, story arcs

Agent explainers

Memory drift prose

Lenses that turn numbers into words (but do not mutate any state)

Dependencies:

schema, core, psych, analytics

May also use long-memory outputs from analytics

Must not depend on: stage, api, cli.

Narrative is where the Writer’s Room lives.

2.7 LLM Layer (loopforge.llm) — unchanged seam

Responsibility:

LLM stub and (future) real client

Policy routing

Lenses that → LLM input/output, but not core metrics

Dependencies:

core, schema, maybe psych for traits/emotion info

Must not depend on: narrative, analytics, stage, api, cli.

LLMs live at the seam, not in the loop.

2.8 Stage Layer (loopforge.stage) — new

This is the visual story assembly layer.

Responsibility:

Take outputs from analytics + narrative + psych & compose a Stage-friendly data model.

Define construction functions like:

def build_stage_episode(
    episode_summary: EpisodeSummary,
    day_summaries: list[DaySummary],
    character_defs: dict[str, Character],
    long_memory: LongMemorySnapshot | None = None,
) -> StageEpisode:
    ...


Ensure StageEpisode is:

Stable, versioned, and documented

A pure data object with:

days, tension trend

agents, their arcs, emotional colors

narrative lines for intros/outros

Optionally: helper utilities to slice/filter episodes for the UI (e.g., per-agent, per-day views).

Dependencies:

schema (for input and Stage DTOs)

analytics (summaries, long-memory, metrics)

narrative (prose blocks)

psych (if trait snapshots are needed)

Must not depend on:

core directly (Stage shouldn’t touch raw sim state)

llm (we display LLM-guided outputs, but don’t require them)

api, cli, or frontend.

Mental model:
Stage is the bridge between the Writer’s Room (Narrative/Analytics) and the Theatre (UI).

2.9 API Layer (loopforge.api) — new

This is the service layer that exposes Loopforge to the outside world.

Responsibility:

FastAPI (or similar) app definition

HTTP/WS endpoints, for example:

GET /episodes                 # list runs / episode ids
GET /episodes/{id}            # return StageEpisode JSON
GET /episodes/{id}/raw        # (optional) export-episode JSON
GET /episodes/{id}/live       # (optional) stream/tail action logs

POST /episodes/run            # trigger new sim run with given config


Map HTTP requests → calls into:

sim runner (core orchestrators)

analytics + stage (for episode building)

run registry (analytics/db)

Handle:

Input validation (config for new runs)

Error handling

Auth (if needed later)

Dependencies:

core (to start runs)

analytics (to retrieve/analyze episodes)

narrative (if we serve narrative blocks separately)

stage (for StageEpisode JSON)

db & schema (for run registry)

Must not depend on:

cli (CLI may wrap API calls; API does not import CLI)

frontend code (React app is separate).

The API is effectively the Producer Console RPC surface.

2.10 CLI Layer (loopforge.cli)

Responsibility:

Terminal UX (Typer) for:

Running sims (loopforge-sim)

Exporting episodes

Debugging episodes

Possibly booting API (e.g., loopforge-sim api-server)

Dependencies:

May depend on: core, analytics, narrative, stage, api, llm, db, schema

Must not be depended on by any other layer.

CLI is one consumer of the same Stage/Analytics/Narrative infrastructure as the web app.

2.11 Frontend Stage (/ui-stage) — new, at repo root

Not a Python package; a separate app.

Responsibility:

React/TypeScript project (Vite or Next)

Implements:

EpisodePlayer

StageRenderer2D (SVG/Canvas)

Later StageRenderer3D (React Three Fiber)

Producer Console UI for configuring runs

Dependencies (runtime):

Calls loopforge.api via HTTP/WS (network boundary)

Does not import any Python modules directly

Build-time:

Can share types via:

JSON schema for StageEpisode

Or generated TS types (e.g., StageEpisode .d.ts from Python dataclasses if you want to get fancy)

3. Updated Dependency Rules (Topological)

From lowest to highest:

schema

db

core

psych

analytics

narrative

llm (parallel to narrative/analytics in some ways, but not above them)

stage

api

cli

ui-stage (frontend, separate)

Allowed “upward” dependencies (summary):

schema: none

db → schema

core → schema, db

psych → schema, core, db

analytics → schema, core, psych, db

narrative → schema, core, psych, analytics

llm → schema, core, psych (and optionally analytics for richer input)

stage → schema, analytics, narrative, psych

api → schema, db, core, analytics, narrative, stage, llm

cli → anything

ui-stage → only api (over HTTP/WS)

Forbidden patterns:

core importing narrative, analytics, stage, api, ui

stage importing api or cli

api importing ui-stage

any layer importing from loopforge root modules (root stays clean).

4. How This Supports the Expansion Path
“Produce episodes that surprise us — and explain why they happened.”

Sim + Psych + Analytics
→ episodes that do something interesting under pressure & traits.

Narrative
→ “explain why they happened” in human language.

Stage
→ “turn that explanation into a structured visual script” (StageEpisode).

API + UI
→ “let humans watch, replay, poke, and reconfigure the drama.”

Each track from The Producer Vision maps to layers:

Track A — Stage (Environment) → core, analytics, stage (background tension etc.)

Track B — Actors → core, psych, schema, then visualized via stage/UI

Track C — Writer’s Room → narrative, analytics, then curated by stage

Track D — Director (Supervisor) → psych, llm, producer console via api + ui-stage

Track E — Producer Console → cli + api + ui-stage

The architecture now reserves a proper place for “The Theatre” without polluting the sim or bending the narrative/analytics layers into UI controllers.

5. Future Architect Instructions (Expanded)

When you add new modules:

If it’s about visual episode data for the web stage
→ loopforge.stage

If it’s about serving data over HTTP/WS or starting/stopping runs via external calls
→ loopforge.api

If it’s about React/JS, CSS, or shaders
→ /ui-stage, not inside loopforge/.

If a change makes Loopforge more watchable or more explainable, you’re probably in the right layer.

If a change requires Core to know about Stage, stop.
You’re about to break the Producer rule: sim first, show later.
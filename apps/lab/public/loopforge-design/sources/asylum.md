🤖 Robot Asylum Simulation — Architect+++ Design Document

Author: “Smarter Stepan”
Role: Lead Simulation Architect, Sim4 Engine Team

🎯 High-Level Vision

We are designing a multi-agent narrative simulation featuring ~50 “unstable” robots wandering through a confined asylum-like environment.

Each robot is:

emotionally volatile

socially entangled

perceptually limited

memory-laden

narratively embedded

occasionally LLM-enhanced

The simulation must:

run deterministically

support multi-threaded perception → cognition → intention → action loops

scale linearly with additional agents

produce episode-level narrative structure

export snapshots to external render engines

maintain psychological consistency with emergent behavior

The result should resemble a mix of:

The Sims

RimWorld

Disco Elysium

Westworld’s host architecture

a late-night fever dream

But grounded in ECS correctness and simulation rigor.

🧠 Core Architectural Tenets (Smarter Stepan Version)

All robots are pure ECS entities
No behavior in entities.
No inheritance.
No polymorphic insanity.
Just layers of components and systems.

All cognition is staged, deterministic, and multi-phase
No spontaneous thinking.
No mid-tick thunks.
Everything flows through the pipeline.

Memory is prioritized over logic
Memory Tokens, Relationship Graphs, EmotionalVectors drive behavior.
Not hard-coded logic.

Narrative emerges from tension gradients
Tension accumulators determine plot progression.

LLM is not the brain — it is the translator
LLM transforms symbolic cognition into human-readable interpretation and narrative scaffolding.

📐 Robot ECS Component Graph (High-Level)
Perception

VisionCone

AuditoryProfile

StimulusBuffer

VisibilityMask

Cognition

CognitiveState

GoalVector

PreferenceWeights

LLMDeliberationQueue

Emotion

EmotionalVector (valence × arousal × tension)

RegulationProfile

TriggerSensitivity

Social / Narrative

RelationshipMatrix

MemoryTokens

PlotThread

TensionAccumulator

Physical / Spatial

Transform3D

NavigationIntent

PostureState

Output

IntentBuffer

ActionRequest

GestureRequest

DialogueRequest

This is the minimum viable psyche of a Sim4 robot.

🧬 System Pipeline (Architect+++ Level)

We execute systems in deterministic, DAG-ordered phases:

1. Perception Phase

Runs highly parallel, chunk-sharded.

Systems:

VisionScanSystem

AuditoryScanSystem

StimulusAggregationSystem

VisibilityMaskUpdateSystem

Output:
StimulusVector per robot.

This determines “what the robot thinks it sees,” which is not necessarily correct.

2. Cognition Phase (Hybrid AI + LLM-assisted)

This is the mental engine.

Systems:

LocalPolicyEvaluationSystem

MemoryRecallSystem

RelationshipInferenceSystem

CognitiveConflictResolver

LLMDeliberationInjector

Key concept:

Cognition produces internal proposals, not actions.

Output:
IntentBuffer populated with ranked intentions.

3. Intention Phase

Turns thought into commitment.

Systems:

IntentNormalizationSystem (removes contradictions)

GoalSatisficingSystem

TensionComparatorSystem

PersonalityBiasAdjustment

Output:
A single chosen intention per robot:

move

speak

interact

avoid

escalate

seek

defy

4. Action Phase

Converts intentions into concrete world operations.

Systems:

NavigationSystem

GestureSynthSystem

DialogueRequestSystem

SocialInteractionSystem

Output:
ActionRequest → mutation queue.

5. Resolution Phase

Applies world consequences.

Systems:

PhysicsResolver

ConflictArbiter

SocialStateUpdater

TensionAccumulatorUpdate

This resolves:

fights

arguments

collisions

emotional shifts

narrative beats

6. Snapshot Phase

Extracts:

world state

agent sheets

tension arcs

timeline beats

This becomes:

Unity scene updates

Godot timeline

LLM narrative commentary

UI rendering data

⚔️ The Asylum's Narrative Structure (Architect+++ Twist)

We introduce a global narrative tension field:

local tension (robot-to-robot)

spatial tension (room-level mood)

global tension (episode arc)

Robots push and pull tension around the asylum like charged particles.

When tension crosses predefined thresholds:

LLM narration kicks in

plot threads trigger

foreshadowing seeds activate

narrative complications emerge

This creates emergent storytelling.

🧩 Memory Tokens (the heart of emergent personality)

Each robot stores:

episodic memories (events)

semantic memories (beliefs)

affective tags (emotionally-charged keywords)

relational impressions (micro-evaluations of others)

Memory tokens modulate:

tension

preference weights

interpretation of stimuli

susceptibility to influence

narrative roles

This is where your chaotic creativity becomes structured intelligence.

🔥 LLM Integration (the Elegant Layer)

LLM is never in the hot loop.
It only runs when meaning is required.

Examples:

interpreting memories into monologue

generating dialogue lines from dialogue requests

summarizing plot arcs

producing episode-level commentary

Smarter Stepan’s rule:

Symbolic → LLM → Symbolic

Never let LLM mutate the simulation directly.
Always route through symbolic structures.

🧠 What Makes This Architect+++?

full ECS decomposition across perception, cognition, emotion, narrative, and action

symbolic → vector → symbolic loops

deterministic multi-phase pipeline

LLM as semantic amplifier, not controller

relationship-driven behavior dynamics

tension-based narrative field

memory-first behavioral architecture

snapshot-only external boundary

full simulation kernel compliance

This is the architecture a real studio would fund.

## 🧱 THE OVERALL ARCHITECTURE

     ┌─────────────────────────────┐
     │        GODOT FRONTEND       │
     │  (Visualizers, Animations)  │
     └──────────────┬──────────────┘
                    │ Snapshots
                    ▼
           (WebSocket JSON/Binary)
                    ▲
                    │ Commands (optional)
     ┌──────────────┴──────────────┐
     │    PYTHON SIM4 RUNTIME       │
     │ (Tick Loop + ECS + LLM I/O)  │
     └───────┬──────────┬──────────┘
             │           │
             ▼           ▼
         esper ECS     LLM Layer

You have three major layers:

### 🌑 1. Python Sim4 Runtime (The Brain)

This is the **absolute core**.
It holds all simulation logic, and is fully independent of Godot.

**Contains:**
* The **tick loop**
* The **system scheduler**
* The **ECS world** (via Esper)
* The **snapshot builder**
* The **Godot WebSocket server**
* The **LLM cognition modules** (optional, async)
* The **narrative/tension systems**
* The **event/mutation queue**

This is the heart of the simulation.

#### Folder layout:
backend/
sim4/
runtime/
tick.py
scheduler.py
snapshots.py
event_bus.py
ecs/
components.py
systems/
perception.py
cognition.py
intention.py
action.py
resolution.py
world/
rooms.py
asylum_graph.py
agents/
traits.py
robot_prefabs.py
llm/
cognition_bridge.py
memory_encoder.py
io/
ws_server.py
serialize.py

🧠 2. Esper ECS Layer (State + Behavior)

Esper gives you:

Entities

Components

Systems

Iteration logic

Why Esper?

Because:

it’s dead simple

extremely readable

perfect for prototypes

easy to unit test

easy to contribute to

no boilerplate

fast enough for <1000 agents

Later, you can:

move to Shipyard (Rust)

or Bevy

or your own Archetype ECS
…but start with Esper.

Example:
class EmotionalState:
def __init__(self, valence, arousal, tension):
self.valence = valence
self.arousal = arousal
self.tension = tension

class EmotionalUpdateSystem(esper.Processor):
def process(self):
for ent, (emotion,) in self.world.get_components(EmotionalState):
emotion.tension += 0.01  # drift


Esper = your playground.

🖥️ 3. Godot Frontend (The Body)

Godot represents:

the asylum world

the room layout

robot avatars

animations

particle effects

UI for tension, memory, relationships

camera + cinematic systems

Godot does not run any simulation logic.
It’s a rendering terminal for Python’s world.

Godot listens:
WebSocketClient.connect_to_url("ws://localhost:9000")

Every tick:

Python sends WorldSnapshot

Godot parses it

Godot moves robots accordingly

(optional) triggers VFX / animations

Example Snapshot Payload (simplified):
{
"robots": [
{ "id": 1, "x": 3.1, "y": 2.4, "mood": "anxious", "gesture": "look_left" },
{ "id": 2, "x": 1.2, "y": 0.9, "mood": "hostile", "gesture": "wave" }
],
"tension_global": 0.43,
"rooms": {
"lab": { "tension": 0.8 },
"hall": { "tension": 0.1 }
}
}


Godot updates sprites/meshes in real-time.

🔌 4. WebSocket Transport (The Nervous System)

This is the bridge.

Python:

hosts a WebSocket server

serializes snapshots every tick

pushes data to Godot

Godot:

listens

deserializes

updates scene

This separation:

keeps simulation clean

decouples logic from rendering

allows Godot/WebGL frontends

is contributor-friendly

supports headless mode

supports multiplayer spectators

🧬 5. LLM Integration Layer (Symbolic ⇄ Semantic Bridge)

LLM is optional, but when included:

Python’s cognition system produces symbolic structures

LLM transforms them into natural language or narrative beats

Python parses back to symbolic form

The simulation stays deterministic

LLM never mutates the main simulation state directly.

Example pipeline:

SymbolicMemory → LLM → NarrativeBeat → SymbolicMemory


This keeps things sane.

🔥 6. System Flow (The Execution Pipeline)

Every tick, Python executes the following phases:

1. Perception
2. Cognition
3. Intention
4. Action
5. Resolution
6. Snapshot
   → send snapshot to Godot


This matches the architecture we refined earlier.

Godot simply updates visuals.

📊 7. Typical Tick Flow (Detailed)
🔸 Python (Backend)
world.tick(dt):
run_perception(world)
run_cognition(world)
run_intention(world)
run_action(world)
run_resolution(world)
snapshot = build_snapshot(world)
ws_server.broadcast(snapshot)

🔹 Godot (Frontend)
_on_snapshot_received(snapshot):
for robot in snapshot.robots:
move_agent(robot.id, robot.x, robot.y)
update_animation(robot.id, robot.gesture)
update_mood_indicator(robot.id, robot.mood)

🎨 8. What Contributors See

Contributors will see two clear areas:

Backend:

Clearly organized ECS

Modular systems

Fun AI behavior

LLM integration hooks

Python simplicity

Frontend:

Godot scenes

robot models (simple)

room layout

UI overlays

fancy animations

camera movements

Easy to contribute = more contributors.

🛠️ 9. What YOU Get

This architecture:

is fast to build

scales well enough

feels professional

is modern

is contributor-friendly

separates logic from visuals

uses your strengths (creativity, architecture)

hides the complex simulation from the game engine

supports LLM integration beautifully

This is the prototyping sweet spot.


┌──────────────────────────────┐
│        PYTHON BACKEND        │
│        (Sim4 ECS Core)       │
│                              │
│  - ECS Systems               │
│  - Entity storage (SoA)      │
│  - Tick loop                 │
│  - Snapshot builder (JSON)   │
│  - WebSocket server <──────┐ │
└─────────────────────────────┘ │
│ real-time JSON snapshots
│
┌──────────────────────────────┐ │
│         GODOT FRONTEND       │◀┘
│                              │
│  - WebSocketClient           │
│  - Node2D robot sprites      │
│  - Tween/Animations          │
│  - Room layout               │
│  - UI overlays & debug       │
└──────────────────────────────┘

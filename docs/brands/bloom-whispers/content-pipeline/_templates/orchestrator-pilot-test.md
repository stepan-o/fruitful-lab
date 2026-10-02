# Bloom Whispers Orchestrator Pilot Test

Status: V1.1 sub-agent test plan, 2026-08-12
Use with: `docs/brands/bloom-whispers/agents/orchestrator-agent.md`

## Objective

Test whether one user-facing Bloom Whispers Editorial Orchestrator can coordinate specialist research, writing, editing, creative, and publishing roles without Susy manually copying prompts between separate threads.

The pilot should prove that the system preserves quality while reducing coordination labor.

Quality includes reader arrival. The pilot does not pass if the article is accurate and well researched but Susy cannot get past the opening.

When Susy explicitly authorizes sub-agent orchestration and sub-agent tools are available, this test must be run with real specialist sub-agents. A single-thread roleplay run is only a fallback and must be labeled as such.

## Recommended Pilot Topic

Marigold.

Why:

- research dossier already exists;
- visual dossier already exists;
- Pinterest demand scan exists;
- writer drafts V1, V2, and V3 exist;
- editor reviews V1 and V2 exist;
- Susy gave strong hook/style feedback;
- V3 is the latest base draft, but its 9.1 editor verdict was superseded by Susy's reader-arrival rejection;
- V4 fixed reader arrival;
- V5 was superseded because a compression pass introduced confusing thesis language;
- V6 is the final text approved by Susy, with writing-style improvement logged as a future polish/watch point.
- Media direction V1 now exists at `docs/brands/bloom-whispers/content-pipeline/marigold/media-ideas-v1.md`.

## Pilot Activation Prompt

```txt
Use the Bloom Whispers Editorial Orchestrator.

Topic: Marigold.

Goal:
Reconstruct current state, update the pipeline manifest, and move the article from V6 final text approval through media direction toward publisher prep.

Do not start by rewriting.
First inspect the topic folder, research dossier, visual dossier, writer drafts, editor reviews, and human notes.
Then report the current stage, current files, unresolved blockers, and the next action.
```

## Test Steps

1. Reconstruct state from durable files.
2. Create or update `docs/brands/bloom-whispers/content-pipeline/marigold/pipeline-status.md`.
3. Confirm the latest draft and latest review.
4. Identify stale files and unresolved editorial blockers.
5. If the latest draft fails reader arrival, create or route a targeted writer revision brief before final editorial review.
6. If the latest draft is review-ready, run the Editor Agent on the latest draft with the reader-arrival hard gate.
7. Update the manifest after every output.
8. Stop for Susy approval before final text approval, media direction, or publisher prep.
9. For a true sub-agent test, spawn bounded Writer, Editor/Critic, Media Strategy, Creative Director, Production, and Publisher/readiness sub-agents as the stage allows.
10. Record each sub-agent output under `docs/brands/bloom-whispers/content-pipeline/<topic-slug>/subagent-runs/` or the normal artifact path for that role.
11. Update the pipeline manifest after each sub-agent returns.

## Pass Criteria

The pilot passes if:

- Susy does not need to manually activate researcher, writer, and editor in separate tasks.
- Specialist work is actually delegated to sub-agents when authorized, not merely performed by the main thread under role labels.
- Media selection is concrete enough for Susy to understand: five visual concepts by category, with overlay copy, visual description, ChatGPT/Canva production route, asset source option, and caveats.
- The orchestrator identifies the current file state correctly.
- The editor reviews the latest draft, not an older draft.
- The pipeline status file makes the next action obvious.
- Research/caveats/safety boundaries survive the handoff.
- The first screen passes the five-second reader-arrival gate: clear familiar doorway, sensory curiosity, plain-English promise, and no source/proper-noun wall before context.
- The final report lists what changed, what is approved, and what still needs Susy.

## Fail Criteria

The pilot fails if:

- the orchestrator rewrites before reconstructing state;
- an agent works from an older draft by mistake;
- source caveats disappear;
- public article prose becomes research-note prose again;
- the opening front-loads source names, institutional names, botanical Latin, or unfamiliar cultural terms before the reader has a simple doorway;
- a 9+ editorial verdict is allowed to stand after Susy says she cannot get past the first screen;
- Susy has to manually tell each specialist what file to read;
- media or publisher work starts before final text approval.
- a run is described as sub-agent executed when no specialist sub-agent outputs exist.

## Migration Rule

During the pilot, do not delete the existing separate agent docs or old article files. The test is additive:

- keep existing researcher/writer/editor/publisher/creative roles;
- add orchestrator coordination on top;
- preserve all prior drafts and reviews;
- use `pipeline-status.md` to identify what is current or stale.

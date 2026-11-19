# Day One live runtime

Recovery checkpoint. Branch `codex/day-one-live-engine`. Baseline is the tree of merged PR #156, which includes #153 and #155. Runtime source lives under `apps/lab/lib/loopforge/intro`; the two delivery scripts rebuild the score and runtime textures from the checked-in handoffs.

Before the acceptance run: target 60 FPS desktop; reference floor 30 FPS, p95 ≤33.33 ms, p99 ≤66.67 ms, no frame >500 ms, at most six >100 ms per ten minutes, control-to-draw ≤200 ms. Repeated runs must keep one worker, one render loop and stable surface/texture counts. Desktop and phone viewport results are separate from physical-device certification.

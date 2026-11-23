# Station-light diagnostic — first run

40 measured seconds per mode after 5 seconds of warmup, repeating the same 93–113 second Conveyor sequence. HD Graphics 620. FPS / p95 milliseconds / pauses over 100 ms: glow 43.9 / 35.9 / 2; light 44.9 / 33.8 / 2; light with shadows 43.4 / 33.6 / 0; baseline repeat 42.2 / 38.9 / 5. The repeated baseline drift is larger than the apparent mode difference. No performance acceptance claim follows.

Two instrumentation faults were discovered in the raw export: drawsMean is a cumulative counter and is unusable; environment.canvas was sampled after restoring the user's render size and is not the measured resolution. The runner checked 1280 × 720 on every measured frame and did not report a size-change abort. Raw evidence is retained unchanged. Both faults are corrected for the next diagnostic. This run alone does not verify shadow visibility or a reliable cost delta.

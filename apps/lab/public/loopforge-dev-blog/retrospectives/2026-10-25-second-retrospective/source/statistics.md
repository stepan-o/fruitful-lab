# Cycle statistics

Reporting window: after 2026-10-22T22:09:57.919591+00:00 through 2026-10-25T02:15:41.335719+00:00. These figures cover the native Producer and nine craft roles. Root coordination is excluded. The sprint continues; this is a fixed publication cutoff, not a final total.

The ledger, using the field definitions retained from the first report, supports at least **565,680,634 counted native tokens** inside that window: 19,960,418 reported uncached input, 541,225,856 cached input reads and 4,494,360 output. Reported cache creation is 0. Cached reads are processing already retained context; they are not newly written work.

We group cumulative snapshots by agent and session, exclude the first snapshot inside the window, and count only subsequent differences. This avoids double-counting cumulative totals and does not guess at missing session starts or tails. Original historical counters and overruns remain preserved. Boundary gaps and later work make this an observed lower bound.

| Native role | Input | Cache reads | Output | Combined |
| --- | ---: | ---: | ---: | ---: |
| Producer | 6,105,334 | 192,452,864 | 1,413,489 | 199,971,687 |
| Engine Master | 4,672,830 | 154,270,464 | 1,036,738 | 159,980,032 |
| Animator | 1,084,584 | 28,711,552 | 305,435 | 30,101,571 |
| Scene Director | 1,700,931 | 36,346,624 | 340,736 | 38,388,291 |
| Level Designer | 1,475,936 | 34,623,744 | 323,294 | 36,422,974 |
| Systems Designer | 819,712 | 19,417,984 | 276,712 | 20,514,408 |
| Writer | 718,816 | 12,953,728 | 192,975 | 13,865,519 |
| Visual Artist | 1,394,821 | 33,410,944 | 347,466 | 35,153,231 |
| 3D Artist | 466,002 | 5,049,728 | 39,947 | 5,555,677 |
| Critic | 1,521,452 | 23,988,224 | 217,568 | 25,727,244 |

The snapshot spans 15 native sessions. All ten current role configurations request `gpt-6-astra` with `xhigh` reasoning through the `codex` runner; the ledger also reports the `gpt-6-astra` label. This identifies saved configuration and ledger labels, not independently verified serving-model snapshots or per-call reasoning. An explicit backend provider was not available in those selected configuration fields. Cost is unknown; zero-filled cost fields are not a monetary estimate.

The useful countable milestones are:

- Nine fresh craft interviews, seven questions each: **63 answers**. Nine current craft reviews; all nine interviewees disclose still or sampled-frame inspection rather than continuous playback.
- **49 native task cards created within the reporting window**, with snapshot states 7 blocked, 11 doing, 30 done, 1 review. These are administrative records, not 49 completed game outcomes.
- **Three actual cloud attempts in the documented R8–R10 sequence:** R8 failed tests; R9 passed tests and compilation but failed full application typing; R10 became ready with 634 tests across 119 suites, assets, types and build passed. This is a named sequence, not an exhaustive count of the entire cycle’s builds.
- **Five named R13 source cuts:** initial interface correction, stable picture-height correction, 16:9 layout/fixture correction, physical hearing/camera integration, and the narrow Focus hydration correction. A source cut is not a passed performance.
- **Four selected native R12/R13 operations:** R12 core validation and separate lint, R13 initial interface validation, and R13 craft validation. The R12 core commands passed but their wrapper failed on a report-path lookup; R13’s first interface run failed a focused timing fixture. Both failures remain recorded. The latest of these passed full application types and 44 tests across 9 suites, then failed one Focus lint rule. Its correction is separately scheduled; no unreturned pass is counted.

All cycle-wide build/revision totals, Root tokens and monetary costs remain unknown where the retained sources do not support a complete count. Current files, session identities, exact source hashes and the calculation are retained privately; no private transcripts or credentials are published.

Change note: the preliminary checkpoint counted from the last pre-cutoff snapshot for existing sessions. The publication calculation instead excludes each first in-window snapshot, giving a conservative within-window lower bound. It preserves the first retrospective’s frozen totals and does not add an old cumulative role counter to a new session counter again.

The input/cache mapping comes from the first report’s retained native reconciliation: ledger input is native input minus cached input, and output includes reported reasoning output. These new ledger rows were not separately rematched to raw provider transcripts. No billing equivalence is claimed.

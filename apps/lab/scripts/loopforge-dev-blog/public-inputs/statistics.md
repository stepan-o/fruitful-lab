# Statistics and accounting notes

Fixed source cutoff: **2026-10-22T22:09:57.919591+00:00**. Later writing, implementation and external review are excluded.

## Recorded runtime

| Field | Observed value |
| --- | --- |
| Retained native sessions | 15, including archived sessions |
| Provider / model alias | OpenAI / `gpt-6-astra` |
| Reasoning effort | `xhigh` |
| Runner | Codex CLI `0.163.0-alpha.10.2` |
| Reported runtime context | 258,400 tokens |
| Exact backend snapshot / parameter count | Not exposed |

Root supplied a dated metadata extraction; Producer verified its five file hashes and checked the supplied summary identities. This does not independently re-extract the logs. The [documented API model capacity](https://developers.openai.com/api/docs/models/gpt-6-astra), checked by root on 22 October 2026, is 1,050,000 context tokens and 128,000 maximum output tokens. Those limits are separate from the context allocation reported by these sessions.

## Native usage by retained ledger session

The ledger has 1,236 cumulative snapshots in 14 session groups. The native metadata packet contains 15 sessions: retained metadata coverage and ledger coverage are different. The missing ledger session is the first temporary intake reviewer. Its separately reported native total of 33,944 tokens is not added to this delta series. For each ledger session, sort snapshots by time and sum adjacent non-negative differences. The first observed counter is excluded and retained separately in the downloadable data. No negative differences occurred. Never add cumulative snapshot rows.

Root numerically matched all 1,105 earlier I1 snapshots to native counters: ledger input equals native input minus cached input; ledger cache-read equals native cached input; ledger output equals native output. Reasoning output is included within output. The final extension retains those ledger columns; its additional rows have not undergone a second independent native rematch.

| Ledger session / craft | Non-cached input | Cached input | Output |
| --- | ---: | ---: | ---: |
| S01 · 3D Artist | 109,181 | 6,281,984 | 52,245 |
| S02 · Producer | 4,097,150 | 120,392,192 | 935,324 |
| S03 · Kelly (archived) | 33,640 | 161,280 | 2,101 |
| S04 · Level Designer | 70,427 | 455,936 | 7,581 |
| S05 · Loopforge Animator | 891,627 | 21,389,056 | 244,320 |
| S06 · Loopforge Critic | 388,669 | 8,476,928 | 69,288 |
| S07 · Loopforge Engine Master | 984,646 | 30,352,128 | 362,414 |
| S08 · Loopforge Writer (archived) | 10,604 | 54,400 | 537 |
| S09 · Loopforge Writer | 306,180 | 6,391,424 | 103,393 |
| S10 · Scene Director | 281,519 | 7,159,424 | 58,623 |
| S11 · Systems Designer | 217,564 | 5,234,688 | 52,724 |
| S12 · Visual Artist | 134,765 | 4,176,768 | 31,285 |
| S13 · Loopforge Character Artist (temp) (archived) | 65,676 | 532,736 | 10,136 |
| S14 · Loopforge Reviewer (temp) (archived) | 60,501 | 254,080 | 6,780 |
| **Observed differences** | **7,652,149** | **211,313,024** | **1,936,751** |

Combined observed amount across these disjoint columns: **220,901,924 tokens**. Reported cache creation is zero. This is not proof of free processing. Billed dollars are **unknown**; no API price multiplication is presented as an invoice. External bridge usage is absent, and session totals cannot be precisely apportioned to every task.

The earlier I1 series ended at 21:20:13 UTC and is preserved unchanged: 6,801,932 non-cached input; 185,522,304 cached input; 1,738,540 output. The separate native metadata packet was actually read at 22:02:39 UTC with a requested 22:03 upper filter. It is not a complete 22:03 usage freeze. Its endpoint counters include first-observed usage and are used only as provenance, not spliced into either adjacent-delta series.

## Reported task allowances and checkpoints

These examples show declared limits and observed failures/recoveries. They use cached-inclusive counters, different reporting moments and sometimes incomplete closing usage. They are not additive task costs.

| Slice | Allowance | Reported usage | Evidence limit |
| --- | ---: | ---: | --- |
| First temporary intake reviewer | 18,000 | 33,944 | Termination report; cached-inclusive counter, not billing (E0016) |
| Second temporary intake reviewer | 400,000 | 438,749 | Termination report; cached-inclusive counter, not billing (E0021) |
| Critic opening review | 1,000,000 | 1,111,112 | Administrative closure reported usage, not a reconstructed final task invoice (E0099) |
| Systems first proposal slice | 1,000,000 | 1,014,591 | First live checkpoint already exceeded allowance; excludes later administration (E0169) |
| Writer history with corrections | 3,000,000 | 2,546,925 | Last observed task delta, not final administration-inclusive usage (E0385) |

Sam holder work had an overlapping elapsed window of 2h 16m 48s; the missing-cue investigation spanned 4h 14m 33s at the intervention. A scoped lower bound of 9,618,332 cached-inclusive tokens excludes initial holder work, earlier repair and Producer/bridge coordination. The broader 18,106,021 window also includes access checks and is not an exact holder cost. No accepted holder or draw/stow performance resulted.

## Nine actual interviews

All nine crafts answered six questions: **54 answers**, personally read by Producer. There are **26 cited source entries**, not 26 proven unique artifacts. Each interview allowed seven active minutes and 1.5 million additional cached-inclusive tokens, with a 1.05 million checkpoint. Exact final per-interview usage is unavailable for the full round; no fabricated zero or complete task-cost chart is substituted.

| Craft | Reported answer interval, seconds |
| --- | ---: |
| Engine Master | 83.807 |
| Critic | 97.649 |
| Animator | 86.333 |
| 3D Artist | 115.274 |
| Writer | 86.218 |
| Scene Director | 133.817 |
| Visual Artist | 108.877 |
| Systems Designer | 98.003 |
| Level Designer | 109.923 |

These intervals use each receipt’s measured start/end definition. Several begin at the first tool read rather than model activation, and later handoff administration may be excluded. They are not a sum of exact active labour. Original caveats remain in the private receipts.

## Coverage and outcomes

The final history contains **420 timeline events, 294 deduplicated retained messages, 65 tasks, 15 registry records and nine phases**. It uses 875 log rows, 486 retained message copies and 118 Hive Git commits. The first task records precede the retained log by about an hour; missing conversation is not reconstructed. Task labels are extraction-time records, not acceptance verdicts.

Eight of the nine current crafts delivered production or review artifacts; Level Designer did not receive production work. Four later-day boards were delivered and all four needed revision. Ten default worker previews were captured, but that does not cover all 253 offered clips and 759 detail rows. The opening was dropped unfinished, not accepted. A published history or this post does not change that game outcome.

The public timeline contains curated metadata, summaries and references. Original messages, local paths, runtime identifiers and raw logs stay private. The full interview testimony is published separately from Producer’s selected quotations.

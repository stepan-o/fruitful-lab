# Floor compositions

The 11 comparisons in `index.json` are static compositions using the shipped art and sampled ENGINE events. Each has a 1280 × 720, 390 × 844 and 320 × 844 PNG. Their text is a separate drawing pass over the original sprite exports. Read them at native size with sound off.

The desk comparison uses the early Day 2 failed check. Both branches show jo stepping forward for inspection. The lower feeds on the pass and custody plates show the same later instant at tick 6100. sam occupies Intake in both. Wash has bob on the pass branch and no operator on the detention branch. The custody insert stands in for an approved room position.

The chat comparison branches on STILETTO’s pace after bob’s question to sam. The interrupted plate retains the last completed part of sam’s answer. It contains no words from the undelivered part. The two bid plates show the first main-belt handoff of D2-C1, then the output rack at the same bell. ENGINE currently reuses three physical slots. The counters attached to the occupied cradles give the number of items bound to each slot.

The three clash plates recall both orders and show the public floor seven ticks after workers choose. The same late Day 4 checkpoint supplies all three. The secondary camera uses mae’s public floor position by the outfeed ([136000, 142700] mm) at tick 9467. At that same instant the separate reviewer-only hearing record for event 163 identifies mae as the sole worker who missed either endorsement. sam heard each endorsement while covering Wash. The player’s camera shows only mae’s position and activity. On STILETTO’s branch bob waits while jo, kit and ben step out. On LIMEN’s branch all four wait. Only jo leaves when the crew receives no endorsement.

## Reproduction

From a repository checkout containing the original four Day One calibration ZIPs and this art directory, run `python docs/loopforge/production/days-2-4-art/proofs/build_scenes.py`. Pillow, Fontconfig and Liberation Sans/Mono are used. `--repo`, `--archives`, `--pack` and `--out` support separate source and export directories. No engine process is required to reproduce these PNGs.

`sampled-scenes.json` freezes the read-only inputs and exact ENGINE file digests. `sample_engine.cjs ENGINE_REPO OUTPUT` can resample them from a checkout of that source with its TypeScript dependencies. The recorded ENGINE simulation digest starts with `c5dab586` and the public projection digest starts with `56c7872c`. Frontend gameplay footage and physical-phone review belong to the integrated build.

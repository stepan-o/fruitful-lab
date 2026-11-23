# Chapter 3 — final editorial and source-level visual acceptance

Reviewed the latest staged Chapter 3 and installed `apps/lab/lib/agentic-systems/revised-chapters/03.json`, plus the updated Parnas study in `apps/lab/components/agentic-systems/visuals/Delegation.tsx`. The staged and installed chapter files are byte-identical. No app files edited during this review.

## Verdict

**Editorial content: accepted.**

**Parnas visual's explanatory design, as implemented in source: accepted.**

**Live rendering, interaction, mobile legibility, and accessibility behavior: not assessed here.** Those checks remain separate.

## Why the remaining editorial blocker is resolved

The Anthropic passage now names a concrete commission—identifying board members of S&P 500 information-technology companies—and the published account's reported delegated-versus-sequential result. The reader can follow an actual task before considering its work division. The passage retains attribution, synthesis work, internal-evaluation scope, and higher usage. It does not turn the case into an equal-budget proof or universal staffing recommendation.

The following shared-code example now has something concrete to contrast with: returning independently gathered facts and integrating changes to a coupled program impose different work on the receiver. Sarkis and the benchmark comparison qualify that distinction rather than supplying the chapter's entire structure.

The previously accepted repairs remain in place:

- Parnas's protected boundary is explained through the neighboring changes it avoids.
- The commission exercise compares the same acceptance conditions while recording model/tool use, integration, human review, and maintenance separately from elapsed time.
- The Bainbridge discussion explicitly distinguishes untested skill loss from Loopforge's observed accumulation of judgment.
- Loopforge appears through short, causal cases rather than studio chronology.
- The chapter's ending gives Chapter 4 a clear reason to address observation and correction.

The chapter now teaches a reusable production decision: a separate agent or protected boundary must earn the cost of receiving, checking, integrating, and recovering its work. The reader need not know Loopforge's history to use that reasoning.

## Why the Parnas visual now passes at source level

The implementation now includes two persistent consumer cards: a reading view and an export. The row/tree control changes the cabinet's internal representation while those consumers and the sorted output remain unchanged. Both consumer cards sit outside the representation-dependent rendering branch, so their stability is an intentional part of the comparison.

The two result messages name the consumers and explain the consequence. The tree state says neither requires rewriting because its required result remains unchanged. The graphic therefore illustrates more than interchangeable internals: it identifies the neighboring work protected by the boundary.

The SVG's accessible label includes the selected result text; the same result is exposed in a polite live region. The consumer cards' coordinates are within both the desktop and compact view boxes. These are source-level observations, not a claim that a screen reader or narrow-screen layout has been exercised.

The chapter caption continues to identify rows/tree as an authored illustration rather than Parnas's original KWIC implementation. The prose supplies the broader behavioral-contract qualification, including the example of a changed meaning for “latest.” This keeps unchanged output from being mistaken for a complete proof of interface equivalence.

## Remaining notes

There are no remaining editorial blockers from this review. Earlier suggestions to shorten the repeated independent-search/code contrast, soften the categorical preference for a specimen over a longer description, and simplify a few terms are optional copy polish. They do not prevent acceptance and should not reopen the chapter's structure.

A live reviewer should still check that the two consumer icons are recognizable, their relationship to the cabinet is clear, and the result text remains easy to read while switching storage on phone and desktop. This report does not certify those live qualities.

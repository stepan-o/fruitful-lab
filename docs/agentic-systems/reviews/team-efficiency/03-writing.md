# Chapter 3 — revised writing acceptance

27 October 2026. Reviewed the revised `03.json`, relevant source records, the Chapter 1 terminology/counterfactual framing, and the Chapter 2 transition. Carlini’s compiler account was freshly checked against its primary publication. This is **writing acceptance**, separate from the pending topology implementation and visual acceptance.

## Verdict

**Accepted in substance and argument, with minor publication edits below.** The chapter now answers the owner’s creative-team question. It preserves successful cases, gives each a mechanism, and distinguishes quality, breadth, speed, and economic efficiency. It does not infer a single-agent win from Loopforge.

The number of examples is defensible. They have distinct jobs:

| Example | Contribution worth retaining |
|---|---|
| Parnas | A good boundary reduces the decisions that must change together. |
| Loopforge grip | A locally valid result can fail the relationship its receiver needs. |
| Agents’ Room | Sequential specialization can improve judged creative output without parallel speed. |
| Anthropic research | Independent investigations buy breadth and separate context capacity. |
| Carlini compiler | A changed test environment can make apparently coupled work separable. |
| Sarkis | Removing agent boundaries can improve deployed systems. |
| Kim | Comparative architecture effects change with task structure. |
| METR | Perceived acceleration needs measurement. |
| Courier / mixed initiative | Delegation transfers particular decisions, with useful intermediate responses. |
| Failed packet / Bainbridge | Execution and residual human responsibility remain part of the arrangement. |

Do not cut the positive creative or compiler cases simply to reduce names. CrafTeam belongs comfortably in Chapter 5; its absence here avoids another creative-judgment detour.

## Small source-precision edits

### Agents’ Room — accurate direction; sharpen the described result

“Expert evaluators preferred the full system” is defensible, but makes the complete planning-plus-writing arrangement sound like the sole successful one. Writing-only variants also performed strongly; planning-only variants were weaker. A more precise sentence is:

> Expert evaluators preferred the variants with writing agents to the tested baselines, although human stories remained preferred overall.

The adjacent length and equal-total-cost caveat is useful and should stay. In the source record, change “Can specialization improve creative judgment...” to “Can specialization improve judged story quality...” because the observed result concerns assessed output. [Primary paper, sections 5–7](https://proceedings.iclr.cc/paper_files/paper/2025/file/0fbc8a83d93dd8021a4dd8d2d34138eb-Paper-Conference.pdf).

### Carlini — keep the case; avoid setting up a stronger opponent

“Complicates the claim that shared code necessarily defeats a team” rebuts a claim the preceding paragraph never made. That paragraph said “poorer fit.” A cleaner transition:

> Nicholas Carlini’s February 2026 compiler experiment shows how a builder can sometimes make that shared work separable.

The account supports sixteen agents, separate copies, task locks, collision at the kernel build, and the GCC-assisted isolation of failures. Its reported cost/session scale and capability-experiment framing are represented accurately. Replace the vague “important remaining limitations” with one concrete one, such as dependence on GCC for the 16-bit x86 boot code. Avoid suggesting the compiler had no other tooling limitations. [Primary account, “Make parallelism easy” and “Evaluation”](https://www.anthropic.com/research/building-c-compiler).

### Kim — specify the controlled budget

Replace “common tools, prompt structures and budgets” with “common tools and prompt structures, with matched reasoning-token budgets.” This prevents “budget” from suggesting equal elapsed time, monetary cost, or human integration. The PlanCraft statement and refusal to transfer fitted thresholds are appropriate. [Primary paper, section 4.4](https://arxiv.org/html/2512.08296v1).

### Source catalog hygiene

`compiler` and `parallel-compiler` point to the same Carlini publication. This is one publication supporting multiple arguments. Reuse the established ID and adjust its annotation to cover both uses, unless the catalog intentionally supports distinct annotated entries from one source. Do not count the duplicate as an additional independent source.

## Recommended tightening without losing concepts or visuals

The prose has about 1,821 words before captions/exercise. The issue is repeated explanatory movement, not excessive absolute length. These are optional improvements, not requests for a wholesale rewrite.

1. **Bridge the opening’s two adjacent visuals.** One abstract paragraph currently leads into topology and workshop back-to-back. A short sentence between them would connect authority to timing: “The map names who can act. The workshop asks which of them can act at the same time.” This is a writing/placement suggestion; visual scale is still unreviewed.

2. **Merge the two Parnas paragraphs.** Keep the keyword-index example, processing-stage versus hidden-decision distinction, and changed storage representation. The second paragraph’s final “not the number of boxes” sentence repeats the first paragraph’s explanation and the chapter’s recurring rule. No visual or concept needs removal.

3. **After the grip, remove the second data-pipeline analogy if trimming.** The earlier source-gathering example already distinguishes representation from meaning. The grip paragraph can end with the receiving contract staying visible; extraction/transformation/display adds another domain without a new distinction.

4. **Keep the full comparative sequence, but make Sarkis’s transition less generic.** “Other builders have gained by removing those boundaries” is a more purposeful entry than “There is a reason to hesitate before copying that arrangement.” Her evidence is different enterprise work; it is not a controlled refutation of Carlini. The existing attribution makes that distinction clear.

5. **Compress the standalone staffing paragraph after Schluntz/Zhang.** “The earlier definition of an agent now becomes a staffing decision...” repeats the opening, Sarkis, and the ending. Retain its specific question about a separate context/permission/review need, then let the closing exercise carry the matched-trial instruction. This saves repetition without losing the autonomy visual or its conceptual job.

6. **Keep METR short if retained.** Its current role is clearly bounded to measurement, so it need not be removed. It is the easiest full paragraph to move to accounting if the rendered chapter feels crowded, but preserve both the initial result and the later uncertainty together. Do not leave the 19% result without its date/workload context.

7. **Remove trailing spaces** from the METR and failed-packet prose strings.

## What should remain intact

- The standfirst makes the three economic possibilities clear.
- The new sentence about a boundary moving as a project changes is one of the chapter’s strongest additions. It turns task independence into a production decision rather than a static organization chart.
- The Agents’ Room passage returns promptly to writer/animator compatibility. Keep that return.
- The Carlini passage makes a transferable engineering mechanism concrete, then identifies the limit of a compiler oracle for performance quality. Keep both.
- The final first-person accountability is specific and warranted.
- The exercise preserves same-task acceptance and separate elapsed-time, usage, integration, human review, and maintenance measures.
- Chapter 1 now defines separate contexts/shared records and explicitly states the missing equal-budget single-agent baseline. Do not restate its complete terminology paragraph here merely for redundancy. The new topology can make those definitions inspectable.

## Acceptance boundary

No substantive new evidence blocker remains. The minor edits above improve precision and pace; they do not change the chapter’s conclusion. The planned topology must still earn its case-specific labels and authority claims through source evidence and a separate visual pass. This report does not certify that unimplemented diagram, live layout, control behavior, mobile readability, or motion.

## Final writing acceptance — saved-revision check

**Accepted.** I re-read the saved Chapter 3 and its revised source records after the owner's changes. The requested precision edits are present: writing-agent variants and human preference in Agents’ Room; a concrete compiler limitation; matched reasoning-token budgets in Kim; one canonical Carlini source ID. Parnas is consolidated, the repeated pipeline analogy is gone, the staffing question is concise, and the topology-to-workshop sentence supplies the missing transition.

The chapter retains the concepts and successful cases that make its comparison balanced. It differentiates creative quality, research breadth, engineered task separation, simplification, and measured architectural effects without deriving an equal-budget single-agent verdict from Loopforge. No further substantive writing or source correction is required for this acceptance.

One optional copy edit remains in the Kim sentence: replace “with common tools and prompt structures, with matched reasoning-token budgets” with “using common tools and prompt structures and matched reasoning-token budgets” to remove the repeated “with.” This does not affect acceptance.

This verdict covers the saved writing and source precision. The topology's case-specific evidence, rendered layout, controls, and mobile presentation remain for the separate visual review.

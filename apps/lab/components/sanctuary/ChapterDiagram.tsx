import type { VisualSpec } from "@/lib/sanctuary/visual-content";
import {
  ExperienceFork,
  PromiseAtlas,
  Transfer,
  Histories,
  ConcordTimeline,
  Probe,
  Furnace,
  Motivation,
  Meaning,
  NestedLoops,
} from "./plates/Instruments";
import {
  Checklist,
  Encounter,
  Access,
  Wardrobe,
  Routes,
  Market,
  Vault,
  Disclosure,
  Evidence,
} from "./plates/Contracts";
import { ProbabilityLab, PriceLab } from "./Experiments";
import s from "./exhibits.module.css";
const instruments = {
  "the-fork": ExperienceFork,
  "six-games": PromiseAtlas,
  "the-reset": Transfer,
  "several-histories": Histories,
  concord: ConcordTimeline,
  "what-decides": Probe,
  "shape-of-money": Furnace,
  "why-people-play": Motivation,
  "play-beyond-score": Meaning,
  "anatomy-of-loop": NestedLoops,
  "loot-table": ProbabilityLab,
  "the-checklist": Checklist,
  "familiar-verbs": Encounter,
  access: Access,
  identity: Wardrobe,
  time: Routes,
  power: Market,
  "what-things-cost": PriceLab,
  "two-key-lock": Vault,
  "abstraction-and-surface": Disclosure,
  "does-it-work": Evidence,
};
export default function ChapterDiagram({
  diagram,
  index,
  chapter,
}: {
  diagram: VisualSpec["diagram"];
  index: number;
  chapter: string;
}) {
  const Instrument = instruments[chapter as keyof typeof instruments];
  if (!Instrument) throw new Error(`Missing Sanctuary exhibit: ${chapter}`);
  return (
    <figure className={s.exhibit} aria-label={`Diagram: ${diagram.title}`}>
      <div className={s.kicker}>
        <span>EXHIBIT {String(index + 1).padStart(2, "0")}</span>
        <span>
          {chapter === "concord" ? "DOCUMENTED TIMELINE" : "EXPLORE THE IDEA"}
        </span>
      </div>
      <h2>{diagram.title}</h2>
      <div className={s.instrument}>
        <Instrument />
      </div>
      <figcaption>{diagram.caption}</figcaption>
    </figure>
  );
}

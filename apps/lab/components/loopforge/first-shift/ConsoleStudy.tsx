"use client";
import Link from "next/link";
import { useState } from "react";
import type { PlayerView } from "@/lib/loopforge/first-shift/contract";
import ThemeProvider, { useConsoleTheme } from "./ThemeProvider";
import { ConsoleBeacon, ConsoleSignals } from "./ConsoleSignals";
import { FactoryWall } from "./ConsoleWorkspaces";
import AdviserSelection, {firstDayCandidates, type AdviserCandidate} from "./AdviserSelection";
import { Control, Kicker, materialStyle, type Media } from "./ConsoleParts";
import { CONSOLES, recipeForConsole, type ProducerSkinId } from "@/lib/loopforge/first-shift/themes";
import s from "./first-shift.module.css";
function Study({ media, view }: { media: Media; view: PlayerView }) {
  const t = useConsoleTheme()!;
  const [full, setFull] = useState(true);
  const [roster,setRoster]=useState(false);
  const candidates: AdviserCandidate[] = firstDayCandidates(view).map(p=> p.available ? p : {...p, available:true, sheet:p.id as "cathexis" | "witch" | "thrum", pitch:p.id === "cathexis" ? "They need a reason to keep going." : p.id === "witch" ? "That noise is a warning. Listen to it." : "Let them find their rhythm.", priority:p.id === "cathexis" ? "Give the workers a common purpose." : p.id === "witch" ? "Stabilize the machinery." : "Relieve the strain.",gain:p.id === "cathexis" ? "A more committed workforce." : p.id === "witch" ? "Fewer unresolved mechanical faults." : "Less worker stress.", cost:p.id === "cathexis" ? "Her influence grows with their conviction." : p.id === "witch" ? "Production time spent on engineering." : "Less output and weaker discipline."});
  return (
    <main
      className={s.shell}
      style={{ ...materialStyle(media), ...t.style }}
      data-quiet="true"
      data-study="true"
    >
      <ConsoleBeacon />
      <header className={s.topbar}>
        <div>
          <Kicker>Historical camera fixture / no game commands</Kicker>
          <b>
            {roster ? "Five supervisors / selection study" : full ? "Six feeds / future density" : "Two feeds / first turn"}
          </b>
        </div>
        <select
          aria-label="Study theme"
          value={t.recipe.console}
          onChange={(e) =>
            void t.apply(recipeForConsole(e.target.value as ProducerSkinId))
          }
        >
          {CONSOLES.map((x) => (
            <option value={x.id} key={x.id}>
              {x.name}
            </option>
          ))}
        </select>
      </header>
      <div className={s.workspace}>
        {roster ? <AdviserSelection media={media} candidates={candidates} study onAppoint={()=>{}} onHelp={()=>{}} /> : <FactoryWall media={media} view={view} fullFloor={full} />}
      </div>
      <footer className={s.commandRail}>
        <Control onClick={()=>setRoster(!roster)}>{roster ? "Camera study" : "Five-person roster"}</Control>
        <Control onClick={() => setFull(!full)} disabled={roster}>
          {full ? "First-turn composition" : "Full-floor composition"}
        </Control>
        <span className={s.smallPrint}>
          Art/layout study only. Later gameplay is not simulated.
        </span>
        <Link href="/stepanoskin/loopforge/play">
          Open playable first shift →
        </Link>
      </footer>
    </main>
  );
}
export default function ConsoleStudy(props: {
  media: Media;
  view: PlayerView;
}) {
  return (
    <ThemeProvider>
      <ConsoleSignals>
        <Study {...props} />
      </ConsoleSignals>
    </ThemeProvider>
  );
}

"use client";
import Link from "next/link";
import { useState } from "react";
import type { PlayerView } from "@/lib/loopforge/first-shift/contract";
import ThemeProvider, { useConsoleTheme } from "./ThemeProvider";
import { ConsoleBeacon, ConsoleSignals } from "./ConsoleSignals";
import { FactoryWall, AdviserDock } from "./ConsoleWorkspaces";
import { Control, Kicker, materialStyle, type Media } from "./ConsoleParts";
import { THEMES, type ThemeId } from "@/lib/loopforge/first-shift/themes";
import s from "./first-shift.module.css";
function Study({ media, view }: { media: Media; view: PlayerView }) {
  const t = useConsoleTheme()!;
  const [full, setFull] = useState(true);
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
          <Kicker>Author composition fixture / no game commands</Kicker>
          <b>
            {full ? "Six feeds / future density" : "Two feeds / first turn"}
          </b>
        </div>
        <select
          aria-label="Study theme"
          value={t.recipe.shell}
          onChange={(e) =>
            void t.apply({
              version: 1,
              shell: e.target.value as ThemeId,
              controls: e.target.value as ThemeId,
            })
          }
        >
          {THEMES.map((x) => (
            <option value={x.id} key={x.id}>
              {x.name}
            </option>
          ))}
        </select>
      </header>
      <div className={s.workspace}>
        <FactoryWall media={media} view={view} fullFloor={full} />
        <AdviserDock
          media={media}
          view={view}
          busy
          onTalk={() => {}}
          onHelp={() => {}}
        />
      </div>
      <footer className={s.commandRail}>
        <Control onClick={() => setFull(!full)}>
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

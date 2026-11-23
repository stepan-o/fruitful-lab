"use client";
import { CONSOLES, consolePreview, recipeForConsole, recipeLink } from "@/lib/loopforge/first-shift/themes";
import { useConsoleTheme } from "./ThemeProvider";
import { useConsoleSignals } from "./ConsoleSignals";
import { LIGHTS, type LightKind } from "@/lib/loopforge/first-shift/console-light";
import s from "./themes.module.css";

export default function ThemeSettings({ disabled = false, onPreview }: { disabled?: boolean; onPreview?: () => void }) {
  const current = useConsoleTheme();
  const signals = useConsoleSignals();
  if (!current) return null;
  const { recipe, apply, loading, message, error } = current;
  return <section className={s.selector} aria-label="Producer consoles" aria-busy={loading}>
    <h3>Choose your console</h3>
    <p>Four consoles. Your shift stays in place.</p>
    <div className={s.themeGrid}>
      {CONSOLES.map((c, i) => {
        const selected = recipe.console === c.id;
        const preview = consolePreview(c.id);
        const next = recipeForConsole(c.id);
        return <div className={s.themeCard} key={c.id}>
          <button type="button" disabled={disabled} aria-pressed={selected}
            onClick={() => void apply(next)}>
            {/* Preview only; the requested console is applied after its assets prepare. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview.src} alt="" width={preview.width} height={preview.height} loading="lazy" />
            <span className={s.sample} aria-hidden="true">0{i + 1}</span>
            <strong>{c.name}</strong><small>{c.material}</small>
            <span className={s.selected}>{selected ? "FITTED" : "SELECT"}</span>
          </button>
          <a href={recipeLink(next)} target="_blank" rel="noreferrer" aria-label={`Start a new shift with ${c.name}`}>New playtest ↗</a>
        </div>;
      })}
    </div>
    <p className={s.status} role={error ? "alert" : "status"}>{disabled ? "Waiting for the current order to finish…" : message}</p>
    <small className={s.playtestNote}>New playtest links open a separate shift.</small>
    {signals && <details className={s.signalPreview}>
      <summary>Preview signal lights</summary>
      <div className={s.lightPreview}><p>Preview on the console · closes Settings, creates no game event</p>
        {(Object.keys(LIGHTS) as LightKind[]).map(kind => <button type="button" key={kind} onClick={() => { onPreview?.(); signals.impulse(kind, true); }}>{kind === "idle" ? "Cyan / idle" : kind === "production" ? "Green / production" : kind === "accident" ? "Red / accident" : "Amber / attention"}</button>)}
      </div>
    </details>}
  </section>;
}

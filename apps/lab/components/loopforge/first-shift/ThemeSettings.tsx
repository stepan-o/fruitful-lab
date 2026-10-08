"use client";
import { THEMES, recipeLink, theme, type ThemeId } from "@/lib/loopforge/first-shift/themes";
import { useConsoleTheme } from "./ThemeProvider";
import { useConsoleSignals } from "./ConsoleSignals";
import { LIGHTS, type LightKind } from "@/lib/loopforge/first-shift/console-light";
import s from "./themes.module.css";

export default function ThemeSettings({ disabled = false, onPreview }: { disabled?: boolean; onPreview?: () => void }) {
  const current = useConsoleTheme();
  const signals = useConsoleSignals();
  if (!current) return null;
  const { recipe, apply, loading, message, error } = current;
  return <section className={s.selector} aria-label="Interface themes" aria-busy={loading}>
    <h3>Console equipment</h3>
    <p>Six material sets. The same factory.</p>
    <div className={s.themeGrid}>
      {THEMES.map((t, i) => {
        const selected = recipe.shell === t.id && recipe.controls === t.id;
        const preview = t.manifest.assets["monitor-frame"].variants[0];
        return <button key={t.id} type="button" disabled={disabled} aria-pressed={selected}
          onClick={() => void apply({ version: 1, shell: t.id, controls: t.id })}>
          {/* Small dedicated preview; full interaction states load only on selection. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview.src} alt="" width={preview.width} height={preview.height} loading="lazy" />
          <span className={s.sample} style={{ color: t.signal }} aria-hidden="true">0{i + 1}</span>
          <strong>{t.name}</strong><small>{t.material}</small>
          <span className={s.selected}>{selected ? "FITTED" : "SELECT"}</span>
        </button>;
      })}
    </div>
    <p className={s.status} role={error ? "alert" : "status"}>{disabled ? "Waiting for the current order to finish…" : message}</p>
    <details className={s.mixer}>
      <summary>Design workbench · combine equipment</summary>
      <p>Try one change at a time. Portraits, room art, icons and sound remain shared.</p>
      {(["shell", "controls"] as const).map(slot => <label key={slot}>
        {slot === "shell" ? "Monitors & sockets" : "Control family"}
        <select value={recipe[slot]} disabled={disabled} onChange={e => void apply({ ...recipe, [slot]: e.target.value as ThemeId })}>
          {THEMES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </label>)}
      <p>{theme(recipe.shell).name} / {theme(recipe.controls).name}</p>
      <a href={recipeLink(recipe)} target="_blank" rel="noreferrer">Open this combination in a fresh playtest ↗</a>
      <small>This link carries the equipment choice. It does not copy your run.</small>
      {signals && <div className={s.lightPreview}><p>Preview on the console · closes Settings, creates no game event</p>
        {(Object.keys(LIGHTS) as LightKind[]).map(kind => <button type="button" key={kind} onClick={() => { onPreview?.(); signals.impulse(kind, true); }}>{kind === "idle" ? "Cyan / idle" : kind === "production" ? "Green / production" : kind === "accident" ? "Red / accident" : "Amber / attention"}</button>)}
      </div>}
    </details>
  </section>;
}

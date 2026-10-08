"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import FirstShift from "./FirstShift";
import ThemeProvider, { useConsoleTheme } from "./ThemeProvider";
import ThemeSettings from "./ThemeSettings";
import { ConsoleBeacon, ConsoleSignals } from "./ConsoleSignals";
import { Art, Control, Kicker, materialStyle, type Media } from "./ConsoleParts";
import s from "./themes.module.css";

function GameSession({ media }: { media: Media }) {
  const [started, setStarted] = useState(false), [menu, setMenu] = useState(true), [settings, setSettings] = useState(false);
  const theme = useConsoleTheme()!;
  const start = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const settingsButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (settings) dialog.current?.showModal(); else dialog.current?.close(); }, [settings]);
  useEffect(() => { if (menu) start.current?.focus(); }, [menu]);
  function closeSettings() { setSettings(false); settingsButton.current?.focus(); }
  function enter() { setStarted(true); setMenu(false); }
  return <div className={s.game} style={{ ...materialStyle(media), ...theme.style }} data-theme={theme.recipe.shell}>
    {menu && <main className={s.menu} aria-label="Loopforge start menu">
      <ConsoleBeacon active={!settings} />
      <div className={s.menuScene}><Art media={media} id="lobby-room" sizes="100vw" priority /></div>
      <div className={s.menuGlass} aria-hidden="true" />
      <section className={s.menuPanel} data-light-frame>
        <Kicker>DIRECTOR ACCESS / LOOPFORGE</Kicker>
        <Art media={media} id="logo" className={s.menuLogo} sizes="320px" priority />
        <h1>First shift</h1>
        <p className={s.menuMotto}>Truth stays clean.<br />Story gets messy.</p>
        <button ref={start} className={s.startControl} disabled={theme.loading} onClick={enter}>{started ? "Resume shift" : "Start shift"}<span>01 / DIRECTOR’S CONSOLE</span></button>
        <button ref={settingsButton} className={s.menuSetting} onClick={() => setSettings(true)}>Settings <span>Equipment / presentation</span></button>
        <Link href="/stepanoskin/loopforge" prefetch={false}>← Back to Loopforge</Link>
        <small className={s.sessionNote}>{started ? "Your shift is paused. Resume to return to the console." : "First shift · playable prototype"}</small>
        <small className={s.sessionNote}>Progress lasts while this page stays open.</small>
        {theme.error && <p role="alert">{theme.message}</p>}
      </section>
    </main>}
    {/* Never key or unmount the run when changing equipment or returning to menu. */}
    {started && <div hidden={menu} inert={menu}><FirstShift media={media} suspended={menu} onOpenMenu={() => setMenu(true)} /></div>}
    <dialog ref={dialog} className={s.menuDialog} onClose={closeSettings} aria-labelledby="menu-settings-title"
      onClick={e => { if (e.target === dialog.current) closeSettings(); }}>
      <ConsoleBeacon active={settings} />
      <header><Kicker>Loopforge / Settings</Kicker><h2 id="menu-settings-title">Fit the console.</h2></header>
      <button className={s.closeSettings} onClick={closeSettings} aria-label="Close settings">Close ×</button>
      {settings && <ThemeSettings onPreview={closeSettings} />}
      <Control onClick={closeSettings}>Return to menu</Control>
    </dialog>
  </div>;
}
export default function GameClient({ media }: { media: Media }) {
  return <ThemeProvider><ConsoleSignals><GameSession media={media} /></ConsoleSignals></ThemeProvider>;
}

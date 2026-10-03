"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent, type CSSProperties } from "react";
import { motionKey, soundKey, usePreference } from "@/lib/stepanoskin/preferences";
import { playClang } from "@/lib/stepanoskin/audio";
import BlockWord, { type BlockLabel } from "./BlockWord";
import { launcherCopy } from "./launcher-copy";
import styles from "./launcher.module.css";
import { localeCookieName, localeNames, locales, translations, type Locale } from "./translations";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToReducedMotion(onChange: () => void) {
    const query = window.matchMedia(reducedMotionQuery);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
}
function getReducedMotion() { return window.matchMedia(reducedMotionQuery).matches; }
function getServerReducedMotion() { return false; }

export default function StepanoskinLanding({ initialLocale }: { initialLocale: Locale }) {
    const router = useRouter();
    const [locale, setLocale] = useState<Locale>(initialLocale);
    const [motionEnabled, setMotionEnabled] = usePreference(motionKey);
    const [soundEnabled, setSoundEnabled] = usePreference(soundKey);
    const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, getServerReducedMotion);
    const [selected, setSelected] = useState<string | null>(null);
    const pageRef = useRef<HTMLElement>(null);
    const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const copy = launcherCopy[locale];
    const motionLabel = reducedMotion ? copy.reducedMotion : motionEnabled ? copy.pauseMotion : copy.resumeMotion;

    useEffect(() => { document.documentElement.lang = locale; }, [locale]);
    useEffect(() => () => { if (navigationTimer.current) clearTimeout(navigationTimer.current); }, []);
    useEffect(() => {
        const page = pageRef.current;
        if (!page) return;
        const syncVisibility = () => { page.dataset.visible = String(!document.hidden); };
        const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => {
            entries.forEach(entry => { (entry.target as HTMLElement).dataset.inView = String(entry.isIntersecting); });
        });
        page.querySelectorAll("[data-floating]").forEach(element => observer?.observe(element));
        document.addEventListener("visibilitychange", syncVisibility);
        syncVisibility();
        return () => {
            observer?.disconnect();
            document.removeEventListener("visibilitychange", syncVisibility);
        };
    }, []);

    function changeLocale(nextLocale: Locale) {
        setLocale(nextLocale);
        document.cookie = `${localeCookieName}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    }
    function enter(event: MouseEvent<HTMLAnchorElement>, href: string) {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        if (navigationTimer.current) return;
        playClang();
        if (!motionEnabled || reducedMotion) { router.push(href); return; }
        setSelected(href);
        navigationTimer.current = setTimeout(() => {
            navigationTimer.current = null;
            setSelected(null);
            router.push(href);
        }, 170);
    }

    const destinations: { blocks: BlockLabel; label: string; description: string; href: string }[] = [
        { blocks: "DATA SCIENCE", label: `${copy.dataScience} — ${copy.cv}`, description: copy.cvDescription, href: "/stepanoskin/production-systems" },
        { blocks: "GAME MONETIZATION", label: translations[locale].gameMonetization, description: copy.sanctuary, href: "/stepanoskin/game-monetization" },
        { blocks: "GAME ENGINES\nAND LLMs", label: copy.gameEngines, description: copy.loopforge, href: "/stepanoskin/loopforge" },
        { blocks: "ABOUT", label: copy.about, description: copy.aboutDescription, href: "/stepanoskin/about" },
    ];
    return (
        <main ref={pageRef} className={styles.page} lang={locale} data-motion={motionEnabled && !reducedMotion ? "on" : "off"} data-selected={selected ? "true" : "false"}>
            <div className={styles.column}>
                <header className={styles.header}>
                    <h1><span className={styles.srOnly}>Stepan Oskin</span><span className={styles.nameFloat} data-floating><BlockWord text="STEPAN OSKIN" /></span></h1>
                    <label className={styles.localeControl}>
                        <span className={styles.srOnly}>{translations[locale].language}</span>
                        <select value={locale} onChange={(event) => changeLocale(event.target.value as Locale)}>
                            {locales.map((value) => <option key={value} value={value}>{localeNames[value]}</option>)}
                        </select>
                    </label>
                </header>

                <nav className={styles.menu} aria-label={copy.navigation}>
                    {destinations.map((item, index) => (
                        <Link className={styles.destination} data-primary={index === 0 ? "true" : undefined} data-active={selected === item.href ? "true" : undefined} href={item.href} key={item.href} prefetch={false} onClick={event => enter(event, item.href)} aria-label={item.label} style={{ "--idle-delay": `${index * -1.4}s` } as CSSProperties}>
                            <div className={styles.wordFloat} data-floating>
                                {index === 0 ? <span className={styles.cvClarifier}><BlockWord text="PROFESSIONAL CV" /></span> : null}
                                <BlockWord text={item.blocks} />
                            </div>
                            <span className={styles.caption}>{locale === "en" ? item.description : `${item.label} · ${item.description}`}</span>
                        </Link>
                    ))}
                </nav>

                <footer className={styles.controls}>
                    <button type="button" onClick={() => setSoundEnabled(!soundEnabled)} aria-pressed={soundEnabled} aria-label={soundEnabled ? translations[locale].soundOn : translations[locale].soundOff}>
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M3 8h3l4-4v12l-4-4H3Z" />{soundEnabled ? <path d="M13 6a6 6 0 0 1 0 8m2-10a9 9 0 0 1 0 12" /> : <path d="m13 8 4 4m0-4-4 4" />}</svg>
                        <span>{soundEnabled ? translations[locale].soundOn : translations[locale].soundOff}</span>
                    </button>
                    <button type="button" onClick={() => setMotionEnabled(!motionEnabled)} aria-pressed={motionEnabled && !reducedMotion} aria-label={motionLabel} disabled={reducedMotion}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">{motionEnabled && !reducedMotion ? <path d="M5 3v10M11 3v10" /> : <path d="m5 3 7 5-7 5Z" />}</svg>
                        <span>{motionLabel}</span>
                    </button>
                </footer>
            </div>
        </main>
    );
}

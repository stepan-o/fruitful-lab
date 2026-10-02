"use client";

import AssetImage from "@/components/media/AssetImage";
import manifest from "@/lib/assets/generated/stepanoskin.json";
import { assetUrl, imageAsset, parseManifest } from "@/lib/assets/types";
import Link from "next/link";
import { playClang } from "@/lib/stepanoskin/audio";
import { soundKey, motionKey, usePreference } from "@/lib/stepanoskin/preferences";
import { useSignalGlitch } from "@/components/stepanoskin/useSignalGlitch";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./stepanoskin.module.css";
import { localeCookieName, localeNames, locales, translations, type Locale } from "./translations";

const menuItems = [
    {
        id: "game-monetization",
        href: "/stepanoskin/game-monetization",
    },
] as const;

const assets = parseManifest(manifest, "stepanoskin");
const assetStyles = {
    "--asset-logo": `url("${assetUrl(assets, "logo")}")`,
    "--asset-noise": `url("${assetUrl(assets, "noise")}")`,
    "--asset-gunmetal": `url("${assetUrl(assets, "gunmetal")}")`,
    "--asset-glare": `url("${assetUrl(assets, "glare")}")`,
} as CSSProperties;
export default function StepanoskinLanding({ initialLocale }: { initialLocale: Locale }) {
    const router = useRouter();
    const [locale, setLocale] = useState<Locale>(initialLocale);
    const [soundEnabled, setSoundEnabled] = usePreference(soundKey);
    const [motionEnabled] = usePreference(motionKey);
    const [isActivating, setIsActivating] = useState(false);
    const pointerFrameRef = useRef<number | null>(null);
    const logoFxRef = useRef<HTMLDivElement | null>(null);
    const copy = translations[locale];

    useSignalGlitch(logoFxRef, styles.logoBurst, styles.logoGlitching, motionEnabled);
    useEffect(() => () => { if (pointerFrameRef.current !== null) cancelAnimationFrame(pointerFrameRef.current); }, []);

    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);

    function toggleSound() { setSoundEnabled(!soundEnabled); }

    function activateMenu(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        if (isActivating) return;
        setIsActivating(true);
        playClang();
        navigator.vibrate?.(24);
        window.setTimeout(() => router.push(href), 210);
    }

    function trackPointer(event: React.PointerEvent<HTMLElement>) {
        if (!motionEnabled || event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const page = event.currentTarget;
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        if (pointerFrameRef.current !== null) cancelAnimationFrame(pointerFrameRef.current);
        pointerFrameRef.current = requestAnimationFrame(() => {
            page.style.setProperty("--shift-x", `${(x * 14).toFixed(2)}px`);
            page.style.setProperty("--shift-y", `${(y * 10).toFixed(2)}px`);
            page.style.setProperty("--counter-shift-x", `${(x * -3.1).toFixed(2)}px`);
            page.style.setProperty("--counter-shift-y", `${(y * -2.2).toFixed(2)}px`);
        });
    }

    function changeLocale(nextLocale: Locale) {
        setLocale(nextLocale);
        document.cookie = `${localeCookieName}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
        document.documentElement.lang = nextLocale;
    }

    return (
        <main className={`${styles.page} ${isActivating ? styles.isActivating : ""}`} data-motion={motionEnabled ? "on" : "off"} style={assetStyles} onPointerMove={trackPointer}>
            <div className={styles.texture} aria-hidden="true" />
            <div className={styles.scanlines} aria-hidden="true" />
            <div className={styles.ambientParticles} aria-hidden="true">
                {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
            </div>
            <div className={styles.impactFlash} aria-hidden="true" />

            <header className={styles.topbar}>
                <div className={styles.identity} aria-label="Stepan Oskin">
                    <span className={styles.identityMark}>SO</span>
                    <span className={styles.identityName}>Stepan Oskin</span>
                </div>

                <div className={styles.controls}>
                    <button
                        className={styles.soundToggle}
                        type="button"
                        onClick={toggleSound}
                        aria-label={soundEnabled ? copy.soundOn : copy.soundOff}
                        aria-pressed={soundEnabled}
                        title={soundEnabled ? copy.soundOn : copy.soundOff}
                    >
                        <span aria-hidden="true">{soundEnabled ? "◖))" : "◖×"}</span>
                    </button>
                    <label className={styles.localeControl}>
                        <span>{copy.language}</span>
                        <select
                            value={locale}
                            onChange={(event) => changeLocale(event.target.value as Locale)}
                            aria-label={copy.language}
                        >
                            {locales.map((availableLocale) => (
                                <option key={availableLocale} value={availableLocale}>
                                    {localeNames[availableLocale]}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </header>

            <section className={styles.stage}>
                <div className={styles.logoWrap}>
                    <div className={styles.logoGlow} aria-hidden="true" />
                    <AssetImage
                        className={styles.logo}
                        asset={imageAsset(assets, "logo")}
                        alt="Loopforge — AI Brain Factory"
                        sizes="(max-width: 720px) 94vw, 760px"
                        preload
                    />
                    <div className={styles.logoFx} ref={logoFxRef} aria-hidden="true">
                        {Array.from({ length: 5 }, (_, index) => (
                            <i className={styles.glitchBand} data-glitch-band key={index} />
                        ))}
                        <svg className={styles.electricField} viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path data-bolt />
                            <path data-bolt />
                        </svg>
                    </div>
                </div>

                <div className={styles.menuShell}>
                    <div className={styles.menuHeader}>
                        <span className={styles.eyebrow}>{copy.menuEyebrow}</span>
                        <h1>{copy.menuTitle}</h1>
                    </div>

                    <nav className={styles.menuList} aria-label={copy.menuTitle}>
                        {menuItems.map((item, index) => (
                            <Link
                                className={styles.menuItem}
                                href={item.href}
                                key={item.id}
                                onClick={(event) => activateMenu(event, item.href)}
                            >
                                <span className={styles.itemIndex}>{String(index + 1).padStart(2, "0")}</span>
                                <span className={styles.itemCopy}>
                                    <strong>{copy.gameMonetization}</strong>
                                    <small>{copy.gameMonetizationDescription}</small>
                                </span>
                                <span className={styles.itemAction}>
                                    <small>{copy.available}</small>
                                    <strong>{copy.enter}</strong>
                                    <span aria-hidden="true">›</span>
                                </span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </section>

            <footer className={styles.footer}>
                <span>LOOPFORGE // 2026</span>
                <span className={styles.systemStatus}><i /> {copy.systemOnline}</span>
            </footer>
        </main>
    );
}

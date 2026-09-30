"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./stepanoskin.module.css";
import { localeCookieName, localeNames, locales, translations, type Locale } from "./translations";

const menuItems = [
    {
        id: "game-monetization",
        href: "/stepanoskin/game-monetization",
    },
] as const;

const soundPreferenceKey = "stepanoskin_sound_v1";
const soundPreferenceEvent = "stepanoskin:sound-preference";
let sharedClang: HTMLAudioElement | null = null;

function getClang() {
    if (typeof window === "undefined") return null;
    if (!sharedClang) {
        sharedClang = new Audio("/stepanoskin/dobcommunications-metal-clang-284809.mp3");
        sharedClang.preload = "auto";
        sharedClang.volume = 0.78;
    }
    return sharedClang;
}

function subscribeToSoundPreference(onStoreChange: () => void) {
    window.addEventListener("storage", onStoreChange);
    window.addEventListener(soundPreferenceEvent, onStoreChange);
    return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener(soundPreferenceEvent, onStoreChange);
    };
}

function getSoundPreference() {
    return window.localStorage.getItem(soundPreferenceKey) !== "off";
}

function createBoltPath(reverse = false) {
    const startX = reverse ? 91 : 9;
    const endX = reverse ? 46 : 54;
    const startY = 22 + Math.random() * 20;
    const endY = 56 + Math.random() * 24;
    const points = [`M ${startX} ${startY.toFixed(1)}`];

    for (let index = 1; index <= 7; index += 1) {
        const progress = index / 7;
        const x = startX + (endX - startX) * progress + (Math.random() - 0.5) * 7;
        const y = startY + (endY - startY) * progress + (Math.random() - 0.5) * 11;
        points.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    }

    return points.join(" ");
}

export default function StepanoskinLanding({ initialLocale }: { initialLocale: Locale }) {
    const router = useRouter();
    const [locale, setLocale] = useState<Locale>(initialLocale);
    const soundEnabled = useSyncExternalStore(subscribeToSoundPreference, getSoundPreference, () => true);
    const [isActivating, setIsActivating] = useState(false);
    const pointerFrameRef = useRef<number | null>(null);
    const logoFxRef = useRef<HTMLDivElement | null>(null);
    const primaryBoltRef = useRef<SVGPathElement | null>(null);
    const secondaryBoltRef = useRef<SVGPathElement | null>(null);
    const copy = translations[locale];

    useEffect(() => {
        getClang();

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let glitchTimer: number | undefined;
        let burstTimer: number | undefined;
        let stopped = false;

        function scheduleGlitch() {
            if (stopped || reducedMotion.matches) return;
            glitchTimer = window.setTimeout(runGlitch, 1500 + Math.random() * 3000);
        }

        function runGlitch() {
            const fx = logoFxRef.current;
            if (!fx || stopped || reducedMotion.matches) return;
            const wrap = fx.parentElement;

            fx.querySelectorAll<HTMLElement>("[data-glitch-band]").forEach((band, index) => {
                const top = 5 + Math.random() * 77;
                const height = 3 + Math.random() * 10;
                band.style.clipPath = `polygon(0 ${top}%, 100% ${top}%, 100% ${top + height}%, 0 ${top + height}%)`;
                const direction = Math.random() > 0.5 ? 1 : -1;
                band.style.setProperty("--band-shift", `${direction * (7 + Math.random() * (11 + index * 2))}px`);
            });
            primaryBoltRef.current?.setAttribute("d", createBoltPath());
            secondaryBoltRef.current?.setAttribute("d", createBoltPath(true));
            fx.style.setProperty("--flash-x", `${24 + Math.random() * 52}%`);
            fx.style.setProperty("--flash-y", `${22 + Math.random() * 48}%`);
            const burstDuration = 280 + Math.random() * 140;
            fx.style.setProperty("--burst-duration", `${burstDuration}ms`);
            wrap?.style.setProperty("--burst-duration", `${burstDuration}ms`);
            fx.classList.remove(styles.logoBurst);
            wrap?.classList.remove(styles.logoGlitching);
            void fx.offsetWidth;
            fx.classList.add(styles.logoBurst);
            wrap?.classList.add(styles.logoGlitching);

            burstTimer = window.setTimeout(() => {
                fx.classList.remove(styles.logoBurst);
                wrap?.classList.remove(styles.logoGlitching);
                scheduleGlitch();
            }, burstDuration + 100);
        }

        function handleMotionPreference() {
            if (glitchTimer) window.clearTimeout(glitchTimer);
            if (burstTimer) window.clearTimeout(burstTimer);
            logoFxRef.current?.classList.remove(styles.logoBurst);
            logoFxRef.current?.parentElement?.classList.remove(styles.logoGlitching);
            scheduleGlitch();
        }

        reducedMotion.addEventListener("change", handleMotionPreference);
        scheduleGlitch();

        return () => {
            stopped = true;
            if (glitchTimer) window.clearTimeout(glitchTimer);
            if (burstTimer) window.clearTimeout(burstTimer);
            reducedMotion.removeEventListener("change", handleMotionPreference);
            if (pointerFrameRef.current !== null) cancelAnimationFrame(pointerFrameRef.current);
        };
    }, []);

    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);

    function playClang() {
        const clang = getClang();
        if (!soundEnabled || !clang) return;
        clang.currentTime = 0.18;
        void clang.play().catch(() => undefined);
    }

    function toggleSound() {
        const nextValue = !soundEnabled;
        window.localStorage.setItem(soundPreferenceKey, nextValue ? "on" : "off");
        window.dispatchEvent(new Event(soundPreferenceEvent));
    }

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
        if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
        <main className={`${styles.page} ${isActivating ? styles.isActivating : ""}`} onPointerMove={trackPointer}>
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
                    <Image
                        className={styles.logo}
                        src="/stepanoskin/loopforge_factory_logo_main.webp"
                        alt="Loopforge — AI Brain Factory"
                        width={1152}
                        height={768}
                        sizes="(max-width: 720px) 94vw, 760px"
                        priority
                    />
                    <div className={styles.logoFx} ref={logoFxRef} aria-hidden="true">
                        {Array.from({ length: 5 }, (_, index) => (
                            <i className={styles.glitchBand} data-glitch-band key={index} />
                        ))}
                        <svg className={styles.electricField} viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path ref={primaryBoltRef} />
                            <path ref={secondaryBoltRef} />
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./stepanoskin.module.css";
import { localeCookieName, localeNames, locales, translations, type Locale } from "./translations";

const menuItems = [
    {
        id: "game-monetization",
        href: "/stepanoskin/game-monetization",
    },
] as const;

export default function StepanoskinLanding({ initialLocale }: { initialLocale: Locale }) {
    const [locale, setLocale] = useState<Locale>(initialLocale);
    const copy = translations[locale];

    function changeLocale(nextLocale: Locale) {
        setLocale(nextLocale);
        document.cookie = `${localeCookieName}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
        document.documentElement.lang = nextLocale;
    }

    return (
        <main className={styles.page}>
            <div className={styles.texture} aria-hidden="true" />
            <div className={styles.scanlines} aria-hidden="true" />

            <header className={styles.topbar}>
                <div className={styles.identity} aria-label="Stepan Oskin">
                    <span className={styles.identityMark}>SO</span>
                    <span className={styles.identityName}>Stepan Oskin</span>
                </div>

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
                </div>

                <div className={styles.menuShell}>
                    <div className={styles.menuHeader}>
                        <span className={styles.eyebrow}>{copy.menuEyebrow}</span>
                        <h1>{copy.menuTitle}</h1>
                    </div>

                    <nav className={styles.menuList} aria-label={copy.menuTitle}>
                        {menuItems.map((item, index) => (
                            <Link className={styles.menuItem} href={item.href} key={item.id}>
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

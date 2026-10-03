"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { directoryCopy } from "./directory-copy";
import styles from "./directory.module.css";
import { localeCookieName, localeNames, locales, translations, type Locale } from "./translations";

type ProjectKind = "systems" | "economics" | "factory";

function ProjectMark({ kind }: { kind: ProjectKind }) {
    return (
        <svg className={styles.projectMark} viewBox="0 0 180 100" fill="none" stroke="currentColor" aria-hidden="true">
            {kind === "systems" ? <>
                <path d="M32 50h35m46 0h35M148 63v20H32V63" />
                <circle cx="24" cy="50" r="8" /><circle cx="156" cy="50" r="8" />
                <rect x="67" y="27" width="46" height="46" rx="2" />
                <path d="m82 42 8 8-8 8m12 0h8m39-12 7 4-7 4M83 79l-7 4 7 4" />
                <path d="M78 17h24M78 10h24" opacity=".4" />
            </> : kind === "economics" ? <>
                <path d="m90 26 24 24-24 24-24-24Z" /><circle cx="90" cy="50" r="9" />
                <path d="M49 53a41 41 0 0 1 72-30m-1-9 2 10-11-1M131 47a41 41 0 0 1-72 30m1 9-2-10 11 1" />
                <path d="M22 50h13m110 0h13M90 3v9m0 76v9" opacity=".4" />
            </> : <>
                <rect x="22" y="59" width="136" height="24" rx="12" />
                {[36, 63, 90, 117, 144].map((cx) => <circle key={cx} cx={cx} cy="71" r="6" />)}
                <path d="M43 59V35h27v24m31 0V27h27v32M36 88v7m108-7v7M48 41h17m43-7h13M25 48h9m109 0h12m-5-4 5 4-5 4" />
                <path d="M47 22V12h77v8" opacity=".4" />
            </>}
        </svg>
    );
}

export default function StepanoskinLanding({ initialLocale }: { initialLocale: Locale }) {
    const [locale, setLocale] = useState<Locale>(initialLocale);
    const copy = translations[locale];
    const directory = directoryCopy[locale];

    useEffect(() => { document.documentElement.lang = locale; }, [locale]);

    function changeLocale(nextLocale: Locale) {
        setLocale(nextLocale);
        document.cookie = `${localeCookieName}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    }

    const projects: { kind: ProjectKind; title: string; description: string; category: string; href: string }[] = [
        { kind: "systems", title: copy.productionSystems, description: copy.productionSystemsDescription, category: directory.practice, href: "/stepanoskin/production-systems" },
        { kind: "economics", title: "Sanctuary Economics", description: `${copy.gameMonetization}. ${copy.gameMonetizationDescription}`, category: directory.essay, href: "/stepanoskin/game-monetization" },
        { kind: "factory", title: "Loopforge", description: directory.loopforge, category: directory.world, href: "/stepanoskin/loopforge" },
    ];

    return (
        <main className={styles.page} lang={locale}>
            <header className={styles.header}>
                <span className={styles.identity}><span className={styles.monogram} aria-hidden="true">so.</span>Stepan Oskin</span>
                <label className={styles.localeControl}>
                    <span>{copy.language}</span>
                    <select value={locale} onChange={(event) => changeLocale(event.target.value as Locale)}>
                        {locales.map((value) => <option key={value} value={value}>{localeNames[value]}</option>)}
                    </select>
                </label>
            </header>
            <section className={styles.intro}>
                <p className={styles.eyebrow}>{directory.index} <span>01—04</span></p>
                <h1>{directory.heading}</h1>
                <p className={styles.lead}>{directory.intro}</p>
            </section>
            <nav className={styles.projects} aria-label={directory.index}>
                {projects.map((project, index) => (
                    <Link className={styles.project} data-project={project.kind} href={project.href} key={project.kind}>
                        <span className={styles.index} aria-hidden="true">0{index + 1}</span>
                        <div className={styles.projectCopy}>
                            <span className={styles.category}>{project.category}</span>
                            <h2>{project.title}</h2>
                            <p>{project.description}</p>
                        </div>
                        <ProjectMark kind={project.kind} />
                        <span className={styles.arrow} aria-hidden="true">↗</span>
                    </Link>
                ))}
                <Link className={styles.aboutRow} href="/stepanoskin/about">
                    <span className={styles.index} aria-hidden="true">04</span>
                    <h2>{directory.about}</h2>
                    <span className={styles.status}>{directory.soon}</span>
                    <span className={styles.arrow} aria-hidden="true">↗</span>
                </Link>
            </nav>
            <footer className={styles.footer}><span>Stepan Oskin</span><span>{directory.footer}</span></footer>
        </main>
    );
}

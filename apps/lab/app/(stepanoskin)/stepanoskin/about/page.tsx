import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { directoryCopy } from "../directory-copy";
import styles from "../directory.module.css";
import { isLocale, localeCookieName, translations } from "../translations";

export const metadata: Metadata = {
    title: "About | Stepan Oskin",
    description: "About Stepan Oskin. Coming soon.",
};

export default async function AboutPage() {
    const saved = (await cookies()).get(localeCookieName)?.value ?? "en";
    const locale = isLocale(saved) ? saved : "en";
    const copy = directoryCopy[locale];
    return (
        <main className={styles.page} lang={locale}>
            <header className={styles.header}>
                <Link className={styles.identity} href="/stepanoskin"><span className={styles.monogram} aria-hidden="true">so.</span>Stepan Oskin</Link>
            </header>
            <section className={styles.placeholder}>
                <span className={styles.status}>{copy.soon}</span>
                <h1>{copy.about}</h1>
                <p>{copy.aboutMessage}</p>
                <Link className={styles.back} href="/stepanoskin">← {translations[locale].backToMenu}</Link>
            </section>
            <footer className={styles.footer}><span>Stepan Oskin</span><span>{copy.footer}</span></footer>
        </main>
    );
}

"use client";
import Link from "next/link";
import { motionKey, usePreference } from "@/lib/stepanoskin/preferences";
import type { Deck } from "@/lib/loopforge/content";
import styles from "./loopforge.module.css";
export default function Chrome({ deck }: { deck?: Deck }) {
  const [motion, setMotion] = usePreference(motionKey);
  return (
    <header className={styles.topbar}>
      <Link href="/stepanoskin/loopforge" className={styles.brand}>
        <span className={styles.brandMark}>Lƒ</span>
        <span>
          LOOPFORGE<small>AI BRAIN FACTORY</small>
        </span>
      </Link>
      <nav aria-label="Loopforge sections">
        <Link
          aria-current={deck === "overview" ? "page" : undefined}
          href="/stepanoskin/loopforge/overview/the-factory"
        >
          The game
        </Link>
        <Link
          aria-current={deck === "architecture" ? "page" : undefined}
          href="/stepanoskin/loopforge/architecture/the-thesis"
        >
          The engine
        </Link>
        <Link href="/stepanoskin/loopforge/play">
          Enter factory <span aria-hidden="true">↗</span>
        </Link>
      </nav>
      <button
        className={styles.motion}
        onClick={() => setMotion(!motion)}
        aria-pressed={motion}
        aria-label="Enable conveyor motion"
      >
        {motion ? "◉" : "○"}
        <span> Motion {motion ? "on" : "off"}</span>
      </button>
    </header>
  );
}

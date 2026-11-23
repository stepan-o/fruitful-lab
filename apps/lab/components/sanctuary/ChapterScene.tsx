import {HistoryScene} from "./DiabloHistory";
import {historyIds,type HistoryId} from "@/lib/sanctuary/history-ids";
import { useEffect, useRef, useState } from "react";
import { artDirection } from "@/lib/sanctuary/art-direction";
import ScenePlate from "./plates/ScenePlate";
import styles from "./exhibits.module.css";

export default function ChapterScene({
  index,
  chapter,
}: {
  index: number;
  chapter: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const art = artDirection[chapter];
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (expanded) dialog.current?.showModal();
  }, [expanded]);
  if(historyIds.includes(chapter as HistoryId)) return <HistoryScene chapter={chapter as HistoryId}/>;
  const label = art.alt ?? `${art.title} ${art.read}`;
  return (
    <figure className={styles.scene}>
      <div className={styles.kicker}>
        <span>
          PLATE {String(index + 1).padStart(2, "0")} / ORIGINAL ENGRAVING
        </span>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label={`Enlarge illustration: ${art.title}`}
        >
          Inspect ↗
        </button>
      </div>
      <ScenePlate chapter={chapter} index={index} label={label} motionPaused={expanded} />
      <figcaption>
        {art.reference ? <p className={styles.reference}>{art.reference}</p> : null}
        <h2>{art.title}</h2>
        <p>{art.read}</p>
        {art.motifs?.length ? <ul className={styles.motifs}>
          {art.motifs.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul> : null}
        <small>
          Original procedural scene · illustrative, not a game capture
        </small>
      </figcaption>
      <dialog
        className={styles.inspector}
        ref={dialog}
        onClose={() => setExpanded(false)}
        aria-label={art.title}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button type="button" onClick={() => dialog.current?.close()}>
          Close illustration ×
        </button>
        {expanded ? (
          <>
            <ScenePlate chapter={chapter} index={index} label={label} />
            <p>{art.read}</p>
          </>
        ) : null}
      </dialog>
    </figure>
  );
}

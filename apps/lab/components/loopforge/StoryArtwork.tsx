"use client";

import { useRef, useState } from "react";
import AssetImage from "@/components/media/AssetImage";
import type { ImageAsset } from "@/lib/assets/types";
import styles from "./story-gallery.module.css";

export default function StoryArtwork({ asset, title, alt, priority = false }: {
  asset: ImageAsset; title: string; alt: string; priority?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  return <>
    <button className={styles.artButton} aria-label={`Enlarge ${title}`} onClick={() => {
      setOpen(true);
      dialog.current?.showModal();
    }}>
      <AssetImage asset={asset} alt={alt} preload={priority}
        sizes="(max-width: 760px) calc(100vw - 36px), (max-width: 1440px) calc((100vw - 88px) / 2), 676px" />
      <span className={styles.enlarge} aria-hidden="true">View full artwork ↗</span>
    </button>
    <dialog ref={dialog} aria-label={title} className={styles.dialog}
      onClose={() => setOpen(false)}
      onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
      <div className={styles.dialogBar}>
        <span>{title}</span>
        <button autoFocus onClick={() => dialog.current?.close()} aria-label="Close artwork">Close ×</button>
      </div>
      {open && <AssetImage asset={asset} alt={alt} sizes="96vw" />}
      <p>{alt}</p>
    </dialog>
  </>;
}

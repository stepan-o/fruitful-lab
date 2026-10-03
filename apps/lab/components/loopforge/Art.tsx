"use client";
import { useRef, useState } from "react";
import AssetImage from "@/components/media/AssetImage";
import { art } from "@/lib/loopforge/assets";
import styles from "./loopforge.module.css";
export default function Art({
  id,
  caption,
  hero = false,
}: {
  id: string;
  caption: string;
  hero?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <figure className={hero ? styles.heroArt : styles.art}>
      <AssetImage
        asset={art(id)}
        alt={caption}
        sizes={
          hero
            ? "(max-width: 800px) 100vw, (max-width: 1100px) calc(100vw - 200px), (max-width: 1680px) calc(100vw - 238px), 1442px"
            : "(max-width: 800px) 90vw, 900px"
        }
        preload={hero}
      />
      <button
        className={styles.inspect}
        onClick={() => {
          setOpen(true);
          dialog.current?.showModal();
        }}
        aria-label={`Inspect artwork: ${caption}`}
      >
        ↗ <span>Inspect artwork</span>
      </button>
      <dialog
        ref={dialog}
        aria-label={caption}
        className={styles.dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close();
        }}
      >
        <button
          className={styles.close}
          onClick={() => dialog.current?.close()}
          autoFocus
        >
          Close ×
        </button>
        {open && <AssetImage asset={art(id)} alt={caption} sizes="95vw" />}
        <p>{caption}</p>
      </dialog>
    </figure>
  );
}

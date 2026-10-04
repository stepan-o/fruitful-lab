"use client";

import Link from "next/link";
import { useId, useState } from "react";
import AssetImage from "@/components/media/AssetImage";
import type { ImageAsset } from "@/lib/assets/types";
import type { Figure } from "@/lib/sanctuary/types";
import styles from "./reader.module.css";

export default function EvidenceFigure({ figure, asset, number, zoomLabel, paired, onInspect }: {
  figure: Figure;
  asset: ImageAsset;
  number: string;
  zoomLabel: string;
  paired: boolean;
  onInspect: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const detailId = useId();
  const detail = selected === null ? null : figure.details?.[selected];
  return <figure className={styles.figure} data-presentation={figure.presentation}>
    {figure.label ? <div className={styles.archiveLabel}>{figure.label}</div> : null}
    <button type="button" className={styles.figureButton} aria-label={`${zoomLabel}: ${figure.alt}`} onClick={onInspect}>
      <AssetImage asset={asset} alt={figure.alt} sizes={paired
        ? "(max-width:720px) calc(100vw - 68px), (max-width:1100px) calc((100vw - 84px) / 2), 350px"
        : "(max-width:720px) 94vw, (max-width:1100px) 80vw, 900px"}/>
      {detail ? <span className={styles.evidenceOutline} aria-hidden="true" style={{left:`${detail.rect[0]}%`,top:`${detail.rect[1]}%`,width:`${detail.rect[2]}%`,height:`${detail.rect[3]}%`}}/> : null}
      <span className={styles.zoomLabel}>{zoomLabel} ↗</span>
    </button>
    {figure.details ? <div className={styles.evidenceDetails}>
      <div className={styles.evidenceControls} role="group" aria-label="Inspect the Gauntlet interface">
        {figure.details.map((item,i)=><button type="button" key={item.label} aria-pressed={selected === i} aria-controls={detailId} onClick={()=>setSelected(selected === i ? null : i)}><span aria-hidden="true">0{i+1}</span>{item.label}</button>)}
      </div>
      <p id={detailId} className={styles.evidenceReading} aria-live="polite">{detail?.text ?? "Select a detail to trace its role in the offer. The outlines are ours; the screenshot is unchanged."}</p>
    </div> : null}
    <figcaption><span className={styles.figureNumber}>FIG. {number}</span><p>{figure.caption}</p><small>{figure.credit} · <Link prefetch={false} href={`/stepanoskin/game-monetization/credits#${figure.asset}`}>Source & use ↗</Link></small></figcaption>
  </figure>;
}

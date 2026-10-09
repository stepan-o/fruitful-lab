"use client";

import { useEffect, useRef } from "react";
import { accessible, FLOOR_SIZE, MANAGED_ROOMS, PORTALS, portalOpen, portalRect, ZONES, type ManagedRoomId, type ZoneId } from "@/lib/loopforge/spatial/floor";
import styles from "./factory-study.module.css";

export default function FloorPlan({ open, unlocked, onSelect, onClose }: { open: boolean; unlocked: readonly ManagedRoomId[]; onSelect: (zone: ZoneId) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (open) dialog.current?.showModal(); else dialog.current?.close(); }, [open]);
  const choose = (id: ZoneId) => { onSelect(id); onClose(); };
  return <dialog ref={dialog} className={styles.floorPlan} aria-labelledby="floor-plan-title" onCancel={onClose} onClose={onClose}>
    <header><div><span>LOOPFORGE / FLOOR 01</span><h2 id="floor-plan-title">Factory plan</h2></div><button onClick={onClose} aria-label="Close floor plan">Close ×</button></header>
    <p>Two rooms online. Four wings sealed. Select a room to move the camera.</p>
    <svg viewBox={`0 0 ${FLOOR_SIZE.width} ${FLOOR_SIZE.height}`} role="img" aria-label="Original factory layout. Weaving, Brewery and Theatre to the north; Lobby, Dispatch and Security in the middle; Conveyor, Cortex and Shipping to the south. Security directly adjoins Conveyor.">
      <defs><pattern id="floor-grid" width="1" height="1" patternUnits="userSpaceOnUse"><path d="M1 0H0V1" fill="none" stroke="#809788" strokeOpacity=".14" strokeWidth=".03" /></pattern></defs>
      <rect width="35" height="25" fill="url(#floor-grid)" />
      {PORTALS.map(p => { const r = portalRect(p); return <rect key={p.id} x={r.x} y={r.y} width={r.w} height={r.h} fill={portalOpen(p, unlocked) ? "#a89152" : "#484a3d"} />; })}
      {ZONES.map(z => { const r = z.rect, available = accessible(z.id, unlocked); return <g key={z.id} className={styles.mapZone} tabIndex={0} role="button" aria-label={`${z.name}, ${z.kind === "support" ? "support space" : available ? "online" : "sealed"}`} onClick={() => choose(z.id)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(z.id); } }}>
        <rect x={r.x + .1} y={r.y + .1} width={r.w - .2} height={r.h - .2} rx=".12" fill={available ? z.kind === "managed" ? "#253e35" : "#242c23" : "#171e1b"} stroke={available ? "#8aab89" : "#505b4c"} strokeWidth=".1" />
        <text x={r.x + r.w / 2} y={r.y + r.h / 2 - .2} textAnchor="middle" fill={available ? "#d9c796" : "#7a897d"} fontSize="1.35" fontFamily="monospace">{z.number}</text>
        <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 1} textAnchor="middle" fill={available ? "#b6c6ad" : "#829283"} fontSize={r.w < 6 ? ".48" : ".64"} fontFamily="sans-serif">{z.short}</text>
      </g>; })}
      <path d="M16 15.2V16.8" stroke="#e3bc61" strokeWidth=".3" />
    </svg>
    <div className={styles.mapLegend}><span>● Online</span><span>▧ Sealed</span><span>L / D / S — support spaces</span></div>
    <div className={styles.roomList}>{MANAGED_ROOMS.map(z => <button key={z.id} onClick={() => choose(z.id)}><span>{z.number}</span><b>{z.short}</b><small>{accessible(z.id, unlocked) ? "ONLINE" : "SEALED"}</small></button>)}</div>
    <div className={styles.supportLinks}>{ZONES.filter(z => z.kind === "support").map(z => <button key={z.id} onClick={() => choose(z.id)}>{z.name}</button>)}</div>
  </dialog>;
}

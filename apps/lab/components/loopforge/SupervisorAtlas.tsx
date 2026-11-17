"use client";

import { useRef, useState, type CSSProperties } from "react";
import AssetImage from "@/components/media/AssetImage";
import type { ImageAsset } from "@/lib/assets/types";
import content from "@/lib/loopforge/supervisor-content.json";
import floor from "@/lib/loopforge/supervisor-floor-blocking.json";
import styles from "./supervisor-atlas.module.css";

type Assets = Record<string, ImageAsset>;
const { supervisors, assignments, relationships, scenes } = content;
const rooms = content.rooms.map(r => r.id === "brewery" ? { ...r, name: "Substrate Brewery" } : r);
const person = (id: string) => supervisors.find(p => p.id === id)!;
const basisLabels: Record<string, string> = {
  rules: "Original simulation", art: "Art study", mixed: "Rules + art study", open: "Future design",
};

const serviceRooms = [
  { id: "lobby", name: "Lobby & front door" },
  { id: "dispatch", name: "Dispatch" },
  { id: "logistics", name: "Logistics" },
  { id: "pipes", name: "High-tech pipe galleries" },
];
const roomStudies: Record<string, { src: string; caption: string }> = {
  "lobby": {
    "src": "/media/files/2a86c03a8fe43cdae26048224b8b523a1c744d788a4eb20b1c3c6cc1fb8b6bbf.webp",
    "caption": "Original Lobby room study. The queue and counters set the scale for the proposed entrance scene."
  },
  "dispatch": {
    "src": "/media/files/61cef4e89d9ab59599740dd3926a9bee7e2046aab7cf59e848e1e03633d8d5c1.webp",
    "caption": "Original Dispatch room study. The assignment board provides a common eyeline at shift change."
  },
  "logistics": {
    "src": "/media/files/fef13131f38cd5824af970a6c94ff74132c078d862872f0380caecb0d520cf95.webp",
    "caption": "Original Logistics room study. The ledger and pigeonholes establish where each outgoing brain is accounted for."
  },
  "pipes": {
    "src": "/media/files/20c0342bfc1ede3d3aeef674440a566e3c356a1aa0927a99fee55cf938442af5.webp",
    "caption": "Brewery room study used as the visual reference for the proposed pipe galleries."
  },
  "cortex": {
    "src": "/media/files/eb258c2840c2426dfdbffc67486fc0cb9dda979b49e3accb3bd4bda3de5d06b6.webp",
    "caption": "Original Cortex Assembly room study. The commissioning action below is proposed."
  },
  "cortex-witch": {
    "src": "/loopforge-design/reference/floor-cortex-witch.b823b884d467.webp",
    "caption": "RIVET WITCH in the original Cortex room art. The proposed commissioning action is staged around the machinery shown here."
  },
  "cortex-cathexis": {
    "src": "/loopforge-design/reference/floor-cortex-cathexis.bffafb56f4af.webp",
    "caption": "CATHEXIS in the original Cortex room art. The proposed commissioning action is staged around the machinery shown here."
  },
  "cortex-stiletto": {
    "src": "/loopforge-design/reference/floor-cortex-stiletto.5a4dc3658ef7.webp",
    "caption": "STILETTO in the original Cortex room art. The proposed commissioning action is staged around the machinery shown here."
  }
};
const allRooms = [...rooms, ...serviceRooms];
type Blocking = { title: string; action: string; marks: string[]; space: string };
const blockingByRoom: Record<string, Record<string, Blocking>> = floor.rooms;
const pairBlocking: Record<string, Pick<Blocking, "action" | "marks">> = floor.pairs;

function FloorMarks({ marks }: { marks: string[] }) {
  return <div className={styles.marks}><span>Locate on floor plan</span>{marks.map(mark =>
    <a key={mark} target="_top" aria-label={`Locate ${mark} on the factory floor`} href={`/loopforge-design/factory-layout-proposal.html#asset-${mark}`}>{mark} ↗</a>)}</div>;
}

export default function SupervisorAtlas({ assets, initialRoom }: { assets: Assets; initialRoom?: string }) {
  const startRoom = allRooms.find(r => r.id === initialRoom)?.id ?? "security";
  const startSupervisor = supervisors.find(p => p.focus === startRoom) ?? supervisors[0];
  const [supervisorId, setSupervisorId] = useState(startSupervisor.id);
  const [roomId, setRoomId] = useState(startRoom);
  const [sceneId, setSceneId] = useState(startSupervisor.nativeArt);
  const [independent, setIndependent] = useState(false);
  const [pairId, setPairId] = useState(relationships[0].id);
  const [pairIndex, setPairIndex] = useState(0);
  const [inspection, setInspection] = useState<{ src: string; alt: string; title: string } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const supervisor = person(supervisorId);
  const room = allRooms.find(r => r.id === roomId)!;
  const assignment = assignments.find(a => a.supervisor === supervisorId && a.room === roomId);
  const blocking = blockingByRoom[roomId][supervisorId];
  const roomStudy = roomStudies[`${roomId}-${supervisorId}`] ?? roomStudies[roomId];
  const roomScenes = scenes.filter(s => s.supervisor === supervisorId && s.room === roomId);
  const scene = roomScenes.find(s => s.id === sceneId) ?? roomScenes[0];
  const pair = relationships.find(p => p.id === pairId)!;
  const pairArt = pair.art.length ? [pair.art[pairIndex] ?? pair.art[0]] : [person(pair.a).nativeArt, person(pair.b).nativeArt];

  function assign(id: string, roomChoice = person(id).focus) {
    const next = person(id);
    const options = scenes.filter(s => s.supervisor === id && s.room === roomChoice);
    setSupervisorId(id);
    setRoomId(roomChoice);
    setSceneId(options.find(s => s.id === next.nativeArt)?.id ?? options.find(s => s.kind === "Success")?.id ?? options[0]?.id ?? "");
    setIndependent(false);
  }
  function inspect(src: string, alt: string, title: string) {
    const detail = {src, alt, title};
    const event = new CustomEvent("supervisor:inspect", { cancelable: true, detail });
    if (window.frameElement?.dispatchEvent(event) === false) return;
    setInspection(detail);
    dialog.current?.showModal();
  }
  function painting(id: string, title: string, sizes: string) {
    const source = scenes.find(s => s.id === id)!;
    const asset = assets[id];
    return <button className={styles.painting} onClick={() => inspect(asset.variants[asset.variants.length - 1].src, source.alt, title)} aria-label={`Enlarge ${title}`}>
      <AssetImage asset={assets[id]} alt={source.alt} sizes={sizes} />
      <span className={styles.enlarge} aria-hidden="true">Inspect scene ↗</span>
    </button>;
  }
  const largeSizes = "(max-width: 800px) calc(100vw - 50px), (max-width: 1100px) calc(100vw - 262px), (max-width: 1398px) calc(100vw - 344px), 1054px";

  return <div className={styles.atlas} style={{ "--supervisor-color": supervisor.color } as CSSProperties}>
    <section id="room-matrix" className={styles.matrixSection}>
      <header className={styles.sectionHead}><div><span className={styles.kicker}>Assignments</span><h3>Supervisor assignments</h3></div><p>Select a cell for the paintings and floor marks. ◆ marks a supervisor’s focus room. Scroll sideways to see more rooms.</p></header>
      <div className={styles.tableScroll} role="region" aria-label="Supervisor and room interactions, horizontally scrollable" tabIndex={0}>
        <table className={styles.roomTable}><caption>Production and security · Cortex opens during commissioning</caption><thead><tr><th scope="col">Supervisor</th>{rooms.map(r => <th scope="col" key={r.id}>{r.name}</th>)}</tr></thead><tbody>{supervisors.map(p => <tr key={p.id}><th scope="row">{p.name}</th>{rooms.map(r => {
          const original = assignments.find(a => a.supervisor === p.id && a.room === r.id)!;
          const cell = r.id === "cortex" ? { headline: blockingByRoom[r.id][p.id].title, basis: "open" } : original;
          const options = scenes.filter(s => s.supervisor === p.id && s.room === r.id);
          const plate = options.find(s => s.id === p.nativeArt) ?? options.find(s => s.kind === "Success") ?? options[0];
          const study = roomStudies[`${r.id}-${p.id}`] ?? roomStudies[r.id];
          const thumbnail = plate ? assets[plate.id].variants[0].src : study?.src;
          return <td key={r.id}><a href="#supervisor-stage" aria-current={p.id === supervisorId && r.id === roomId || undefined} data-focus-room={p.focus === r.id || undefined} onClick={() => assign(p.id, r.id)} aria-label={`${p.name} in ${r.name}: ${cell.headline}`}>
            {thumbnail && <img className={styles.thumb} src={thumbnail} alt="" width="126" height="84" loading="lazy" />}
            <span>{p.focus === r.id && "◆ "}{cell.headline}</span><small>{basisLabels[cell.basis]}</small></a></td>;
        })}</tr>)}</tbody></table>
      </div>
      <details className={styles.sourceNote} open={serviceRooms.some(r => r.id === startRoom) || undefined}>
        <summary>Lobby, Dispatch, Logistics and pipe galleries · 20 proposed interactions</summary>
        <div className={styles.tableScroll} role="region" aria-label="Support and service spaces, horizontally scrollable" tabIndex={0}>
          <table className={styles.roomTable}><caption>Support and service spaces · proposed staging</caption>
            <thead><tr><th scope="col">Supervisor</th>{serviceRooms.map(r => <th key={r.id} scope="col">{r.name}</th>)}</tr></thead>
            <tbody>{supervisors.map(p => <tr key={p.id}><th scope="row">{p.name}</th>{serviceRooms.map(r =>
              <td key={r.id}><a href="#supervisor-stage" onClick={() => assign(p.id, r.id)} aria-label={`${p.name} in ${r.name}: ${blockingByRoom[r.id][p.id].title}`}>{blockingByRoom[r.id][p.id].title}</a></td>)}</tr>)}</tbody>
          </table>
        </div>
      </details>
      <nav className={styles.jump} aria-label="Supervisor field guide"><a href="#supervisor-stage">Selected assignment ↓</a><a href="#event-title">Focus-room event ↓</a><a href="#pair-matrix">Supervisor pairings ↓</a></nav>
    </section>

    <section id="supervisor-stage" tabIndex={-1} className={styles.stage} aria-label="Supervisor scenes">
      <div className={styles.people} role="group" aria-label="Choose a supervisor">
        {supervisors.map((p, i) => <button key={p.id} aria-pressed={p.id === supervisorId} onClick={() => assign(p.id)}>
          <span>{String(i + 1).padStart(2, "0")}</span>{p.name}
        </button>)}
      </div>
      <div className={styles.profile}>
        <div><span className={styles.kicker}>{supervisor.role}</span><h3>{supervisor.name}</h3><p className={styles.entry}>{supervisor.entry}</p></div>
        <dl><div><dt>Focus room</dt><dd>{rooms.find(r => r.id === supervisor.focus)!.name}</dd></div><div><dt>What you need them for</dt><dd>{supervisor.ability}</dd></div></dl>
      </div>
      <div className={styles.roomBar}>
        <span className={styles.kicker}>Assign a room</span>
        <div role="group" aria-label="Choose a room">{allRooms.map(r => <button key={r.id} aria-pressed={r.id === roomId} onClick={() => assign(supervisorId, r.id)}>{r.name}{r.id === supervisor.focus && <span aria-label="focus room"> ◆</span>}</button>)}</div>
      </div>
      <div className={styles.sceneHeading} aria-live="polite"><h4>{supervisor.name} / {room.name}</h4><span>{assignment && assignment.basis !== "open" ? basisLabels[assignment.basis] : "Proposed floor interaction"}</span></div>
      {scene ? <figure className={styles.figure}>
        {painting(scene.id, `${supervisor.name} — ${room.name}: ${scene.title}`, largeSizes)}
        <figcaption><span>Original concept art / {scene.title}</span><span>{roomScenes.indexOf(scene) + 1} of {roomScenes.length}</span></figcaption>
        {roomScenes.length > 1 && <div className={styles.variants} role="group" aria-label="Scene variations">{roomScenes.map(s => <button key={s.id} aria-pressed={scene.id === s.id} onClick={() => setSceneId(s.id)}>{s.title}</button>)}</div>}
      </figure> : roomStudy && <figure className={styles.figure}>
        {/* A single room plate gives architectural context when there is no assignment series. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <button className={styles.painting} aria-label={`Enlarge ${room.name} room study`} onClick={() => inspect(roomStudy.src, roomStudy.caption, room.name + " room study")}>
          <img src={roomStudy.src} alt={roomStudy.caption} loading="lazy" />
          <span className={styles.enlarge} aria-hidden="true">Inspect room study ↗</span>
        </button>
        <figcaption>{roomStudy.caption}</figcaption>
      </figure>}
      <div className={styles.reading}>
        <div><span className={styles.kicker}>Proposed floor action</span><h4>{blocking.title}</h4><p>{blocking.action}</p><FloorMarks marks={blocking.marks} /></div>
        <div><span className={styles.kicker}>Space and sightline</span><p>{blocking.space}</p></div>
      </div>
      {assignment && assignment.basis !== "open" && <div className={styles.reading}>
        <div><span className={styles.kicker}>Standard outcome</span><h4>{assignment.headline}</h4><p>{assignment.outcome}</p></div>
        <div><span className={styles.kicker}>Where it can go wrong</span><p>{assignment.risk}</p></div>
      </div>}
      {roomId === "cortex" && <p className={styles.note}>Cortex Assembly was closed in the original simulation. These assignments open with Brain 2.0 commissioning.</p>}
      <div className={styles.faultline}>
        <div><span className={styles.kicker}>Under pressure</span><p>{supervisor.pressure}</p></div>
        <div><span className={styles.kicker}>Possible refusal / story proposal</span><p>{supervisor.refusal}</p></div>
      </div>
    </section>

    <section className={styles.event} aria-labelledby="event-title">
      <header className={styles.sectionHead}><div><span className={styles.kicker}>Special event / {supervisor.name}</span><h3 id="event-title" tabIndex={-1}>{supervisor.special}</h3></div><p>{supervisor.effect}</p></header>
      <figure className={styles.figure}>
        {painting(supervisor.eventArt, supervisor.special, largeSizes)}
        <figcaption><span>{supervisor.id === "thrum" ? "Weaving scene reused for Harmonic Dissolution" : supervisor.id === "witch" ? "Experiment scene reused for System Refactor" : "Original event artwork"}</span><span>Same scene / different authority</span></figcaption>
      </figure>
      <div className={styles.authority}>
        <div role="group" aria-label="Compare event authorization"><button aria-pressed={!independent} onClick={() => setIndependent(false)}>Director permits</button><button aria-pressed={independent} onClick={() => setIndependent(true)}>Supervisor defies</button></div>
        <div className={styles.eventReading} aria-live="polite"><span className={styles.kicker}>{independent ? "Proposed independent action" : "Authorized event"}</span><h4>{independent ? supervisor.incident : "Your order. Their method."}</h4><p>{independent ? supervisor.independent : supervisor.ordered}</p></div>
      </div>
      <p className={styles.note}>A failure, a meltdown and a refusal are different states. Loyalty concerns whose direction they accept; confidence concerns their own judgment; agency concerns what they can act on. The independent paths above are proposals, with no fixed thresholds yet.</p>
      <details className={styles.sourceNote}><summary>How the original event worked</summary><p>The original simulation checked high confidence, assignment to the supervisor’s focus room, a cooldown and an early-game gate. The player then allowed or suppressed the event. Low loyalty did not trigger it, and independent refusal was not part of that rule. These events are not implemented in the website’s eight-shift teaching prototype.</p></details>
    </section>

    <section id="pair-matrix" tabIndex={-1} className={styles.matrixSection}>
      <header className={styles.sectionHead}><div><span className={styles.kicker}>Supervisor relationships</span><h3>Authority meets authority.</h3></div><p>All ten pairings. Select a pair to compare its tension and visual references.</p></header>
      <div className={styles.tableScroll} role="region" aria-label="Supervisor pair interactions, horizontally scrollable" tabIndex={0}>
        <table className={styles.pairTable}><caption>Supervisor × supervisor — documented connections and proposed scenes</caption><thead><tr><th scope="col">Pair</th><th scope="col">The tension</th><th scope="col">Basis</th><th scope="col">Artwork</th></tr></thead><tbody>{relationships.map(p => <tr key={p.id} data-current={p.id === pairId || undefined}><th scope="row"><a href="#pair-scene" onClick={() => { setPairId(p.id); setPairIndex(0); }}>{person(p.a).name}<span> × </span>{person(p.b).name} ↗</a></th><td><strong>{p.title}</strong><p>{p.dynamic}</p></td><td>{p.basis}</td><td>{p.art.length ? `${p.art.length} joint scene${p.art.length > 1 ? "s" : ""}` : "Individual references"}</td></tr>)}</tbody></table>
      </div>
      <section id="pair-scene" tabIndex={-1} className={styles.pairScene} aria-label="Selected supervisor pairing">
        <div className={styles.sectionHead} aria-live="polite"><div><span className={styles.kicker}>{person(pair.a).name} × {person(pair.b).name}</span><h3>{pair.title}</h3></div><p>{pair.proposal}</p></div>
        <div className={styles.pairBlocking}><span className={styles.kicker}>Proposed floor action</span><p>{pairBlocking[pair.id].action}</p><FloorMarks marks={pairBlocking[pair.id].marks} /></div>
        <div className={pair.art.length ? undefined : styles.diptych}>{pairArt.map(id => <figure className={styles.figure} key={id}>{painting(id, pair.art.length ? pair.title : `${scenes.find(s => s.id === id)!.supervisor ? person(scenes.find(s => s.id === id)!.supervisor!).name : "Supervisor"} — individual reference`, pair.art.length ? largeSizes : "(max-width: 600px) calc(100vw - 50px), (max-width: 800px) calc((100vw - 72px) / 2), (max-width: 1100px) calc((100vw - 284px) / 2), (max-width: 1398px) calc((100vw - 366px) / 2), 516px")}</figure>)}</div>
        {pair.art.length > 1 && <div className={styles.variants} role="group" aria-label="Pair scenes">{pair.art.map((id, i) => <button key={id} aria-pressed={i === pairIndex} onClick={() => setPairIndex(i)}>{rooms.find(r => r.id === scenes.find(s => s.id === id)!.room)!.name}</button>)}</div>}
        <p className={styles.note}>{pair.art.length ? "Original confrontation art. The scene above is a possible dramatic use, not a scripted outcome." : "No joint painting was found for this pair. These are separate reference plates, not a reconstruction of a shared event."}</p>
      </section>
    </section>

    <details className={styles.sourceNote}><summary>About this scene library</summary><p>The Substrate Brewery appears as Cognition Brewery in the original assignment grid. 62 original Loopforge concept paintings cover five supervisors in five rooms and six confrontations. They are concept scenes, not captures of the current playable prototype. Room outcomes come from the original simulation’s rules; visual studies and new story proposals are identified separately. The original character bible informs each introduction. The room and event mappings are a reusable art library for future play.</p><p>One painting can represent an authorized intervention, a disputed decision or a refusal when the people, room and visible action still match. Dialogue, event labels and consequences supply the state; the artwork does not change the facts.</p></details>

    <dialog ref={dialog} className={styles.dialog} aria-label={inspection?.title ?? "Scene inspection"} onClose={() => setInspection(null)} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}>
      <div className={styles.dialogBar}><span>{inspection?.title}</span><button autoFocus onClick={() => dialog.current?.close()}>Close ×</button></div>
      {inspection && <><img src={inspection.src} alt={inspection.alt} /><p>{inspection.alt}</p></>}
    </dialog>
  </div>;
}

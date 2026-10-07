"use client";

import { useRef, useState, type CSSProperties } from "react";
import AssetImage from "@/components/media/AssetImage";
import type { ImageAsset } from "@/lib/assets/types";
import content from "@/lib/loopforge/supervisor-content.json";
import styles from "./supervisor-atlas.module.css";

type Assets = Record<string, ImageAsset>;
const { supervisors, rooms, assignments, relationships, scenes } = content;
const person = (id: string) => supervisors.find(p => p.id === id)!;
const basisLabels: Record<string, string> = {
  rules: "Original simulation", art: "Art study", mixed: "Rules + art study", open: "Future design",
};

export default function SupervisorAtlas({ assets }: { assets: Assets }) {
  const [supervisorId, setSupervisorId] = useState("limen");
  const [roomId, setRoomId] = useState("security");
  const [sceneId, setSceneId] = useState("limen-security");
  const [independent, setIndependent] = useState(false);
  const [pairId, setPairId] = useState(relationships[0].id);
  const [pairIndex, setPairIndex] = useState(0);
  const [inspection, setInspection] = useState<{ id: string; title: string } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const supervisor = person(supervisorId);
  const room = rooms.find(r => r.id === roomId)!;
  const assignment = assignments.find(a => a.supervisor === supervisorId && a.room === roomId)!;
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
  function inspect(id: string, title: string) {
    setInspection({ id, title });
    dialog.current?.showModal();
  }
  function painting(id: string, title: string, sizes: string) {
    const source = scenes.find(s => s.id === id)!;
    return <button className={styles.painting} onClick={() => inspect(id, title)} aria-label={`Enlarge ${title}`}>
      <AssetImage asset={assets[id]} alt={source.alt} sizes={sizes} />
      <span className={styles.enlarge} aria-hidden="true">Inspect scene ↗</span>
    </button>;
  }
  const largeSizes = "(max-width: 800px) calc(100vw - 50px), (max-width: 1100px) calc(100vw - 262px), (max-width: 1398px) calc(100vw - 344px), 1054px";

  return <div className={styles.atlas} style={{ "--supervisor-color": supervisor.color } as CSSProperties}>
    <header className={styles.intro}>
      <div><span className={styles.kicker}>Personnel / room assignments / incidents</span><h2>Know who you are putting in charge.</h2></div>
      <p>Five specialists. Their best work, their failures, and the moment expertise becomes a claim to authority.</p>
      <nav className={styles.jump} aria-label="Supervisor field guide">
        <a href="#supervisor-stage">Meet the supervisors ↓</a><a href="#room-matrix">Room interactions ↓</a><a href="#pair-matrix">Supervisor pairings ↓</a>
      </nav>
    </header>

    <section id="supervisor-stage" className={styles.stage} aria-label="Supervisor scenes">
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
        <div role="group" aria-label="Choose a room">{rooms.map(r => <button key={r.id} aria-pressed={r.id === roomId} onClick={() => assign(supervisorId, r.id)}>{r.name}{r.id === supervisor.focus && <span aria-label="focus room"> ◆</span>}{r.id === "cortex" && " · closed"}</button>)}</div>
      </div>
      <div className={styles.sceneHeading} aria-live="polite"><h4>{supervisor.name} / {room.name}</h4><span>{basisLabels[assignment.basis]}</span></div>
      {scene ? <figure className={styles.figure}>
        {painting(scene.id, `${supervisor.name} — ${room.name}: ${scene.title}`, largeSizes)}
        <figcaption><span>Original concept art / {scene.title}</span><span>{roomScenes.indexOf(scene) + 1} of {roomScenes.length}</span></figcaption>
        {roomScenes.length > 1 && <div className={styles.variants} role="group" aria-label="Scene variations">{roomScenes.map(s => <button key={s.id} aria-pressed={scene.id === s.id} onClick={() => setSceneId(s.id)}>{s.title}</button>)}</div>}
      </figure> : <div className={styles.closed}><span aria-hidden="true">VI</span><h4>Cortex Assembly is still closed.</h4><p>Its opening belongs to the new factory progression. No supervisor assignment or outcome is established here yet.</p></div>}
      <div className={styles.reading}>
        <div><span className={styles.kicker}>Standard outcome</span><h4>{assignment.headline}</h4><p>{assignment.outcome}</p></div>
        <div><span className={styles.kicker}>Where it can go wrong</span><p>{assignment.risk}</p></div>
      </div>
      <div className={styles.faultline}>
        <div><span className={styles.kicker}>Under pressure</span><p>{supervisor.pressure}</p></div>
        <div><span className={styles.kicker}>Possible refusal / story proposal</span><p>{supervisor.refusal}</p></div>
      </div>
    </section>

    <section className={styles.event} aria-labelledby="event-title">
      <header className={styles.sectionHead}><div><span className={styles.kicker}>Special event / {supervisor.name}</span><h3 id="event-title">{supervisor.special}</h3></div><p>{supervisor.effect}</p></header>
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

    <section id="room-matrix" className={styles.matrixSection}>
      <header className={styles.sectionHead}><div><span className={styles.kicker}>01 / Assignment table</span><h3>Every supervisor. Every room.</h3></div><p>Select a cell to inspect its scenes. ◆ marks a focus room. Scroll the table sideways on a small screen.</p></header>
      <div className={styles.tableScroll} role="region" aria-label="Supervisor and room interactions, horizontally scrollable" tabIndex={0}>
        <table className={styles.roomTable}><caption>Supervisor × room — five active rooms and the closed Cortex Assembly</caption><thead><tr><th scope="col">Supervisor</th>{rooms.map(r => <th scope="col" key={r.id}>{r.name}</th>)}</tr></thead><tbody>{supervisors.map(p => <tr key={p.id}><th scope="row">{p.name}</th>{rooms.map(r => {
          const cell = assignments.find(a => a.supervisor === p.id && a.room === r.id)!;
          return <td key={r.id}><a href="#supervisor-stage" data-focus-room={p.focus === r.id || undefined} onClick={() => assign(p.id, r.id)} aria-label={`${p.name} in ${r.name}: ${cell.headline}`}><span>{p.focus === r.id && "◆ "}{cell.headline}</span><small>{basisLabels[cell.basis]}</small></a></td>;
        })}</tr>)}</tbody></table>
      </div>
    </section>

    <section id="pair-matrix" className={styles.matrixSection}>
      <header className={styles.sectionHead}><div><span className={styles.kicker}>02 / Relationship table</span><h3>Authority meets authority.</h3></div><p>All ten pairings. Select a pair to compare its tension and visual references.</p></header>
      <div className={styles.tableScroll} role="region" aria-label="Supervisor pair interactions, horizontally scrollable" tabIndex={0}>
        <table className={styles.pairTable}><caption>Supervisor × supervisor — documented connections and proposed scenes</caption><thead><tr><th scope="col">Pair</th><th scope="col">The tension</th><th scope="col">Basis</th><th scope="col">Artwork</th></tr></thead><tbody>{relationships.map(p => <tr key={p.id} data-current={p.id === pairId || undefined}><th scope="row"><a href="#pair-scene" onClick={() => { setPairId(p.id); setPairIndex(0); }}>{person(p.a).name}<span> × </span>{person(p.b).name} ↗</a></th><td><strong>{p.title}</strong><p>{p.dynamic}</p></td><td>{p.basis}</td><td>{p.art.length ? `${p.art.length} joint scene${p.art.length > 1 ? "s" : ""}` : "Individual references"}</td></tr>)}</tbody></table>
      </div>
      <section id="pair-scene" className={styles.pairScene} aria-label="Selected supervisor pairing">
        <div className={styles.sectionHead} aria-live="polite"><div><span className={styles.kicker}>{person(pair.a).name} × {person(pair.b).name}</span><h3>{pair.title}</h3></div><p>{pair.proposal}</p></div>
        <div className={pair.art.length ? undefined : styles.diptych}>{pairArt.map(id => <figure className={styles.figure} key={id}>{painting(id, pair.art.length ? pair.title : `${scenes.find(s => s.id === id)!.supervisor ? person(scenes.find(s => s.id === id)!.supervisor!).name : "Supervisor"} — individual reference`, pair.art.length ? largeSizes : "(max-width: 600px) calc(100vw - 50px), (max-width: 800px) calc((100vw - 72px) / 2), (max-width: 1100px) calc((100vw - 284px) / 2), (max-width: 1398px) calc((100vw - 366px) / 2), 516px")}</figure>)}</div>
        {pair.art.length > 1 && <div className={styles.variants} role="group" aria-label="Pair scenes">{pair.art.map((id, i) => <button key={id} aria-pressed={i === pairIndex} onClick={() => setPairIndex(i)}>{rooms.find(r => r.id === scenes.find(s => s.id === id)!.room)!.name}</button>)}</div>}
        <p className={styles.note}>{pair.art.length ? "Original confrontation art. The scene above is a possible dramatic use, not a scripted outcome." : "No joint painting was found for this pair. These are separate reference plates, not a reconstruction of a shared event."}</p>
      </section>
    </section>

    <details className={styles.sourceNote}><summary>About this scene library</summary><p>62 original Loopforge concept paintings cover five supervisors in five rooms and six confrontations. They are concept scenes, not captures of the current playable prototype. Room outcomes come from the original simulation’s rules; visual studies and new story proposals are identified separately. The original character bible informs each introduction. The room and event mappings are a reusable art library for future play.</p><p>One painting can represent an authorized intervention, a disputed decision or a refusal when the people, room and visible action still match. Dialogue, event labels and consequences supply the state; the artwork does not change the facts.</p></details>

    <dialog ref={dialog} className={styles.dialog} aria-label={inspection?.title ?? "Scene inspection"} onClose={() => setInspection(null)} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}>
      <div className={styles.dialogBar}><span>{inspection?.title}</span><button autoFocus onClick={() => dialog.current?.close()}>Close ×</button></div>
      {inspection && <><AssetImage asset={assets[inspection.id]} alt={scenes.find(s => s.id === inspection.id)!.alt} sizes="96vw" /><p>{scenes.find(s => s.id === inspection.id)!.alt}</p></>}
    </dialog>
  </div>;
}

import Link from "next/link";
import styles from "./engine-notes.module.css";
export const metadata = {
  title: "First-shift engine notes · Loopforge",
  robots: { index: false, follow: false },
};
const boundaries = [
  [
    "Commands",
    "The viewer sends intent: choose an adviser, approve placements, start, advance one beat, respond to an incident, or commit output. The server validates the entire bounded command history.",
  ],
  [
    "Kernel",
    "One owner changes state in a fixed order. Integers, explicit IDs, tagged commands and seeded unsigned 32-bit randomness preserve replay. There is no React, clock, network call or model inside the kernel.",
  ],
  [
    "Knowledge",
    "A separate projection exposes confirmed facts, attributed advice and observable reactions. Worker conditioning histories, supervisor trait values and internal BDI traces are kept server-side.",
  ],
  [
    "Protocol",
    "A complete snapshot establishes the baseline. Ordered operations advance one committed tick at a time. The viewer rejects wrong versions, runs, ordering and hash chains. It can request a fresh baseline from confirmed commands.",
  ],
  [
    "Viewer",
    "The current React viewer displays illustrated cameras, briefings, decisions and records. The director-console revision makes these asset-driven interfaces a complete playable loop. A later live 3D view joins through the same semantic boundary; neither presentation layer chooses outcomes or imports the kernel.",
  ],
];
export default function EngineNotes() {
  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/stepanoskin/loopforge">
          LOOPFORGE<small>ENGINE NOTES</small>
        </Link>
        <Link href="/stepanoskin/loopforge/play">Play the first shift →</Link>
      </header>
      <article className={styles.records}>
        <span className={styles.kicker}>
          Implementation record / first-shift-1.0.0
        </span>
        <h1>
          A small world.
          <br />
          An explicit boundary.
        </h1>
        <p style={{ marginTop: 25 }}>
          This is a server-resolved first-day prototype, built to test the
          adviser choice and its consequences. It is not the completed Act 1 or
          a persistent live-world service.
        </p>
        <ol>
          {boundaries.map(([title, text], i) => (
            <li key={title}>
              <span className={styles.recordTime}>0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <h2>Six consoles, one world.</h2>
        <p>
          The game menu and Settings expose all six equipment themes. A typed
          presentation recipe selects pinned asset manifests, framing geometry
          and control-state families. It never changes the run controller,
          commands, random stream or knowledge projection. The author workbench
          can combine monitor and control families while preserving the active
          shift. Equipment preference persists locally; game progress currently
          lasts only while the page stays open.
        </p>
        <p>
          The console beacon also lives on this side of the boundary. Confirmed
          production, accidents and attention requests trigger brief green, red
          and amber rotations; a sparse cyan impulse marks inactivity. The
          default is dark. Screen-space occlusion uses the same measured source
          as the light, with no per-frame kernel or React updates.
        </p>
        <p><Link href="/stepanoskin/loopforge/design#themes-assets">Themes, assets and feedback contract →</Link></p>
        <h2>Rust-native logic, TypeScript implementation.</h2>
        <p style={{ margin: "20px 0 32px" }}>
          The domain uses owned plain records, discriminated unions, bounded
          integer changes, fixed event ordering and a reproducible random
          stream. Presentation IDs are separate from asset paths. Golden tests,
          invalid-transition tests and cross-view reconstruction provide a
          migration contract for a later Rust implementation. TypeScript does
          not supply Rust’s borrow checker; ownership is enforced here through
          pure transitions, boundaries and tests.
        </p>
        <h2>Workers are people beneath the count.</h2>
        <p style={{ margin: "20px 0 32px" }}>
          Every robot has a stable identity and separate body, assignment,
          stress, conditioning and history components from the first shift. Work
          changes the workers doing it; accidents target a particular robot and
          affect the crew present to witness them. Production creates new
          identities, and allocation retains or dispatches those same robots.
          The interface receives permitted totals, not their hidden component
          records. The same deterministic systems are tested with 10, 24 and 100
          starting workers; the playable opening uses 24.
        </p>
        <h2>What KVP means here.</h2>
        <p style={{ margin: "20px 0 32px" }}>
          The original Kernel ↔ Viewer Protocol establishes sovereignty,
          replaceable viewers and explicit snapshots and differences. This slice
          uses a separately versioned HTTP application profile,{" "}
          <code>loopforge-kvp-http/1</code>, with schema{" "}
          <code>loopforge_first_shift_1</code>. It is not wire-compatible with
          the old KVP-0001 v0.1 live handshake or artifact manifest. Its fields,
          recovery behavior and differences are documented in the repository.
        </p>
        <h2>Truth stays clean. Story gets messy.</h2>
        <p style={{ margin: "20px 0 32px" }}>
          The first-day advisers use authored, sincere policies. Their
          priorities differ; overriding them records different reactions. BDI
          traces record belief, desire, intention and reason. This is a narrow
          foundation, not yet a general psychological simulation. Later model
          reasoning must improve decisions or character continuity against this
          deterministic baseline. Model prose alone is evaluated separately.
          This slice makes no paid LLM calls.
        </p>
        <h2>The interface belongs to the factory.</h2>
        <p style={{ margin: "20px 0 20px" }}>
          The landing conveyor guides the feel: weight, uneven momentum,
          pressure, interruption and deliberate restart. The revised direction
          starts from the old sim-sim console’s authored room scenes, character
          art, metal and glass, instrument plates and controls. These assets
          should define almost every visible game element; native text and
          interaction preserve readability and access. Recorded and procedural
          SFX support commitments and factory feedback. The soundtrack remains
          future work.
        </p>
        <p style={{ marginBottom: 32 }}>
          Frostpunk informs the composition and pacing of illustrated decisions.
          Loopforge’s own machinery and artwork establish its identity. All
          meaningful audio feedback also remains visible. Motion and sound can
          be disabled independently.
        </p>
        <h2>Playable interfaces now. Live 3D later.</h2>
        <p style={{ margin: "20px 0 20px" }}>
          Adviser selection, structured briefing, assignment approval and
          overrides, incidents, permanent allocation and debrief must carry the
          core loop with illustrated factory context. The console now opens
          directly on the weekly quota, factory facts and two unassigned
          advisers. Authored portraits, metal, glass and control states carry
          the daily decisions. The previous welcome/handover gates have been
          removed. The engine and protocol are unchanged; owner visual and play
          acceptance remains separate from implementation checks.
        </p>
        <p style={{ marginBottom: 32 }}>
          The future live tick-fed 3D factory adds cinematic observation beside
          those interfaces. The old Sim4/KVP implementation is a Pixi isometric
          viewer, while Sim5 includes broader viewer plans. A future renderer
          shares the knowledge-filtered event and command boundary, with any
          spatial schema extensions explicitly versioned. The core loop must
          remain playable with that view absent. Babylon.js is a research
          candidate, not an installed dependency or final selection.
        </p>
        <h2>Current limits.</h2>
        <p style={{ margin: "20px 0 32px" }}>
          One day, two supervisors, two available rooms, two scheduled
          observation fixtures and an irreversible final allocation. Candidate
          balance: 24 workers, 240 reserve funds and 60 units due at the end of
          day seven. There is no early repair action, cash settlement, paid
          generation, account ownership, cloud save or anti-cheat. The browser
          holds the command history; the server reconstructs each request.
          Reload starts a new playtest. Records can be downloaded, but replay
          import is not yet a player control.
        </p>
        <Link href="/stepanoskin/loopforge/design#engine-boundary">
          Open the complete game design and engine boundary →
        </Link>
        <p className={styles.note}>
          Author reference. The design board contains story spoilers and
          proposals beyond this implementation.
        </p>
      </article>
    </main>
  );
}

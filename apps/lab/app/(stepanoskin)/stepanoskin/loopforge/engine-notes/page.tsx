import Link from "next/link";
import styles from "@/components/loopforge/first-shift/first-shift.module.css";
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
    "React displays cameras, briefings, decisions and records. It interpolates presentation and plays event cues. It neither chooses outcomes nor imports the kernel. A different renderer can use the same contract.",
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
    <p style={{ margin: "20px 0 32px" }}>Every robot has a stable identity and separate body, assignment, stress, conditioning and history components from the first shift. Work changes the workers doing it; accidents target a particular robot and affect the crew present to witness them. Production creates new identities, and allocation retains or dispatches those same robots. The interface receives permitted totals, not their hidden component records. The same deterministic systems are tested with 10, 24 and 100 starting workers; the playable opening uses 24.</p>
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
          pressure, interruption and deliberate restart. Camera atmosphere,
          image transitions, readouts and original procedural SFX respond to the
          same event. A decision quiets the machinery; a commitment engages it
          again. Consequences remain in the ledger after the cue ends. Recorded
          sound assets and an immersive soundtrack are future layers.
        </p>
        <p style={{ marginBottom: 32 }}>
          Frostpunk informs the composition and pacing of illustrated decisions.
          Loopforge’s own machinery and artwork establish its identity. All
          meaningful audio feedback also remains visible. Motion and sound can
          be disabled independently.
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

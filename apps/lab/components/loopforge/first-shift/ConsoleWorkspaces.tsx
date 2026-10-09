"use client";
import { useState } from "react";
import type {
  Assignments,
  Command,
  Event,
  PlayerView,
  RoomId,
  SupervisorId,
} from "@/lib/loopforge/first-shift/contract";
import {
  Art,
  Control,
  Kicker,
  Monitor,
  ROOMS,
  Speech,
  Tape,
  Token,
  name,
  roomName,
  time,
  type Media,
} from "./ConsoleParts";
import { feedbackFor, type FeedbackId } from "@/lib/loopforge/first-shift/feedback";
import { OutcomeTokens, StatusToken, SupervisorSignal } from "./StatusFeedback";
import s from "./first-shift.module.css";
import l from "./living-console.module.css";

export type Workspace =
  | "factory"
  | "advisers"
  | "leadership"
  | "intercom"
  | "planning"
  | "room"
  | "dispatch"
  | "debrief"
  | "records"
  | "development";
type Common = {
  media: Media;
  view: PlayerView;
  busy: boolean;
  send: (command: Command) => Promise<boolean>;
};
export const tradeoff = (person: SupervisorId) =>
  person === "limen"
    ? "Less output. Less wear and risk."
    : "More output. More wear and risk.";

export function FactoryWall({
  media,
  view,
  onRoom,
  fullFloor = false,
}: {
  media: Media;
  view: PlayerView;
  onRoom?: (id: RoomId) => void;
  fullFloor?: boolean;
}) {
  return (
    <div className={`${s.cameraWall} ${l.wall}`} aria-label="Six factory cameras">
      {ROOMS.map((room, index) => (
        <Monitor
          key={room.id}
          media={media}
          view={view}
          room={room.id}
          index={index}
          fullFloor={fullFloor}
          onOpen={
            onRoom && (room.id === "conveyor" || room.id === "security")
              ? () => onRoom(room.id as RoomId)
              : undefined
          }
        />
      ))}
    </div>
  );
}
export function Intercom({
  media,
  view,
  busy,
  send,
  person,
  onPlan,
  onOther,
  onBack,
}: Common & {
  person: SupervisorId;
  onPlan: () => void;
  onOther: () => void;
  onBack: () => void;
}) {
  const [beat, setBeat] = useState(0);
  const chosen = view.adviser === person,
    brief = chosen && view.phase === "briefing" ? view.briefing : null;
  const remark = view.people.find((p) => p.id === person)!.remark;
  return (
    <section className={s.intercom} aria-label={`${name(person)} intercom`}>
      <div className={s.intercomPortrait}>
        <Token media={media} person={person} large active />
        <Tape>{name(person)}</Tape>
        <small>
          {person === "limen" ? "Protocol supervisor" : "Production supervisor"}
        </small>
      </div>
      <div className={s.comicChannel}>
        <header className={s.workspaceHeading}>
          <Kicker>
            {chosen
              ? "Private channel / today’s adviser"
              : "Private channel / supervisor"}
          </Kicker>
          <h1>{brief ? "The morning brief" : view.adviser ? "On the channel" : "Hear them out."}</h1>
        </header>
        {brief ? (
          <>
            <nav className={s.comicTabs} aria-label="Briefing topics">
              {["The factory", "Their view", "My priority"].map((title, i) => (
                <button
                  key={title}
                  aria-pressed={beat === i}
                  onClick={() => setBeat(i)}
                >
                  {title}
                </button>
              ))}
            </nav>
            <div className={s.comicBeats}>
              <section data-active={beat === 0}>
                <Kicker>About the factory</Kicker>
                <Speech>{brief.assessment}</Speech>
              </section>
              <section data-active={beat === 1}>
                <Kicker>
                  About {person === "limen" ? "STILETTO" : "LIMEN"}
                </Kicker>
                <Speech>{brief.context}</Speech>
              </section>
              <section className={s.priorityBeat} data-active={beat === 2}>
                <Kicker>My priority</Kicker>
                <h2>{brief.priority}</h2>
                <p>{brief.tradeoff}</p>
              </section>
            </div>
          </>
        ) : (
          <div className={s.previewSpeech}>
            <Speech>{remark}</Speech>
            <h2>
              {person === "limen"
                ? "Keep the line within protocol."
                : "Build the production lead."}
            </h2>
            <p>{tradeoff(person)}</p>
            {view.adviser && (
              <p className={s.smallPrint}>
                You appointed {name(view.adviser)} for today. This channel
                carries {name(person)}’s current response.
              </p>
            )}
          </div>
        )}
        <div className={s.workspaceActions}>
          {view.phase === "choose" ? (
            <>
              <Control
                disabled={busy}
                tone="primary"
                onClick={() =>
                  void send({ type: "choose_adviser", adviser: person })
                }
              >
                Appoint {name(person)} for today
              </Control>
              <button className={s.secondary} onClick={onOther}>
                Hear {person === "limen" ? "STILETTO" : "LIMEN"}
              </button>
            </>
          ) : view.phase === "briefing" && chosen ? (
            <Control tone="primary" onClick={onPlan}>
              Review placements
            </Control>
          ) : (
            <Control onClick={onBack}>Back to factory</Control>
          )}
        </div>
      </div>
    </section>
  );
}
export function Planning({
  media,
  view,
  busy,
  send,
  swap,
  onSwap,
  onBack,
  onHelp,
}: Common & {
  swap: boolean;
  onSwap: () => void;
  onBack: () => void;
  onHelp: () => void;
}) {
  const brief = view.briefing!;
  const assignments: Assignments = swap
    ? {
        conveyor: brief.assignments.security,
        security: brief.assignments.conveyor,
      }
    : brief.assignments;
  return (
    <section className={s.planning} aria-label="Supervisor placements">
      <header className={s.workspaceHeading}>
        <Kicker>Day 01 / placement desk</Kicker>
        <h1>
          {swap
            ? "Your revised arrangement"
            : `${name(view.adviser)}’s proposed arrangement`}
        </h1>
        <button className={s.helpLink} onClick={onHelp}>
          About delegated authority ?
        </button>
      </header>
      <div className={s.planBays}>
        {(["conveyor", "security"] as const).map((room, index) => (
          <div className={s.planBay} key={room}>
            <Monitor
              media={media}
              view={view}
              room={room}
              index={index}
              operator={assignments[room]}
              proposal
              onOpen={onSwap}
            />
            <div className={s.placementToken} key={assignments[room]}>
              <Token media={media} person={assignments[room]} />
              <span>
                <b>{name(assignments[room])}</b>
                <small>
                  {assignments[room] === view.adviser
                    ? "Acts automatically here"
                    : "You approve event responses"}
                </small>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className={s.planResponse}>
        <Token media={media} person={view.adviser!} />
        <Speech>
          {swap
            ? `${name(view.adviser)} will follow your arrangement, but will object to being overruled.`
            : brief.rationale}
        </Speech>
      </div>
      <div className={s.workspaceActions}>
        <button className={s.secondary} onClick={onBack}>
          Back to briefing
        </button>
        <Control onClick={onSwap} disabled={busy}>
          {swap ? "Restore proposal" : "Swap assignments"}
        </Control>
        <Control
          tone="primary"
          disabled={busy}
          onClick={() => void send({ type: "approve_plan", assignments })}
        >
          {swap ? "Issue revised assignments" : "Approve the arrangement"}
        </Control>
      </div>
    </section>
  );
}
export function RoomFocus({
  media,
  view,
  room,
  onRecord,
  onFeedback,
}: {
  media: Media;
  view: PlayerView;
  room: RoomId;
  onRecord: (id?: string) => void;
  onFeedback: (id: FeedbackId) => void;
}) {
  const person = view.assignments?.[room],
    latest = view.events
      .filter((e) => e.room === room && e.kind !== "production")
      .at(-1);
  return (
    <section
      className={s.roomFocus}
      aria-label={`${roomName(room)} room focus`}
    >
      <Monitor
        media={media}
        view={view}
        room={room}
        index={room === "conveyor" ? 0 : 1}
        focus
      />
      <div className={s.roomDesk}>
        <div>
          <Kicker>
            {person
              ? `${name(person)} / ${person === view.adviser ? "delegated authority" : "director oversight"}`
              : "Operator socket / unassigned"}
          </Kicker>
          <h1>{roomName(room)}</h1>
          <p>
            {room === "conveyor"
              ? `${view.condition}% line condition · ${view.produced} robots completed`
              : "Access control · reports and clearance"}
          </p>
          <StatusToken signal={feedbackFor(view, `room:${room}`)} onOpen={onFeedback} />
          {person && <SupervisorSignal media={media} view={view} person={person} onOpen={onFeedback} />}
          {latest && (
            <button
              className={s.receiptLink}
              onClick={() => onRecord(latest.id)}
            >
              {latest.title} <span>Inspect receipt →</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
export function IncidentPanel({
  media,
  view,
  busy,
  send,
  onEvidence,
}: Common & { onEvidence: () => void }) {
  const problem = view.pending!;
  return (
    <div className={s.incident}>
      <div className={s.incidentScene}>
        <Art
          media={media}
          id={problem.room === "conveyor" ? "forge" : "security"}
          sizes="(max-width:900px) 90vw, 50vw"
        />
        <Tape>{roomName(problem.room)}</Tape>
        <div>
          <Kicker>Crew report / observed</Kicker>
          <p>{problem.observation}</p>
        </div>
      </div>
      <div className={s.incidentDecision}>
        <Kicker>Shift paused / director response</Kicker>
        <h1>{problem.title}</h1>
        <div className={s.adviceVoice}>
          <Token media={media} person={view.adviser!} />
          <div>
            <Kicker>{name(view.adviser)} recommends</Kicker>
            <Speech>{problem.advice}</Speech>
          </div>
        </div>
        <div className={s.incidentChoices}>
          {problem.choices
            .slice()
            .sort(
              (a, b) =>
                Number(b.id === problem.recommendation) -
                Number(a.id === problem.recommendation),
            )
            .map((choice) => (
              <section key={choice.id}>
                <Kicker>
                  {choice.id === problem.recommendation
                    ? "Follow your adviser"
                    : `Override ${name(view.adviser)}`}
                </Kicker>
                <h2>{choice.label}</h2>
                <p>{choice.consequence}</p>
                <Control
                  disabled={busy}
                  tone={
                    choice.id === problem.recommendation ? "primary" : undefined
                  }
                  onClick={() =>
                    void send({
                      type: "resolve_incident",
                      incident: problem.id,
                      response: choice.id,
                    })
                  }
                >
                  {choice.id === problem.recommendation
                    ? "Authorize recommendation"
                    : "Issue override"}
                </Control>
              </section>
            ))}
        </div>
        <button className={s.secondary} onClick={onEvidence}>
          Inspect the recorded events
        </button>
      </div>
    </div>
  );
}
export function Dispatch({
  media,
  view,
  busy,
  send,
  retain,
  onRetain,
  confirm,
  onConfirm,
}: Common & {
  retain: number;
  onRetain: (n: number) => void;
  confirm: boolean;
  onConfirm: (value: boolean) => void;
}) {
  const delivery = view.produced - retain;
  return (
    <section className={s.dispatch} aria-label="Dispatch workspace">
      <div className={s.sceneBackdrop}>
        <Art media={media} id="dispatch-room" sizes="100vw" />
      </div>
      <header className={s.workspaceHeading}>
        <Kicker>Dispatch office / end of shift</Kicker>
        <h1>{view.produced} finished. Where do they go?</h1>
      </header>
      <div className={s.dispatchDesk}>
        <div className={s.dispatchDestinations}>
          {[
            {
              id: "workers-relief",
              title: "Stay at the factory",
              value: retain,
              note: `${view.workers + retain} workers after dispatch`,
            },
            {
              id: "delivery-relief",
              title: "Toward the weekly quota",
              value: delivery,
              note: `${view.committed + delivery} / ${view.quota} delivered`,
            },
          ].map((item) => (
            <div className={s.dispatchBin} key={item.id}>
              <Art
                media={media}
                id={item.id}
                sizes="(max-width:900px) 60px, 100px"
              />
              <Tape>{item.title}</Tape>
              <strong key={item.value}>{item.value}</strong>
              <small>{item.note}</small>
            </div>
          ))}
        </div>
        <label className={s.sliderLabel} htmlFor="retain-workers">
          Workers to retain <output>{retain}</output>
        </label>
        <input
          id="retain-workers"
          className={s.dispatchSlider}
          type="range"
          min={0}
          max={view.produced}
          step={1}
          value={retain}
          disabled={busy || confirm}
          onChange={(e) => onRetain(Number(e.target.value))}
        />
        <div className={s.dispatchPresets}>
          <Control disabled={busy || confirm} onClick={() => onRetain(0)}>
            All to quota
          </Control>
          <Control
            disabled={busy || confirm}
            onClick={() => onRetain(Math.floor(view.produced / 2))}
          >
            Split output
          </Control>
          <Control
            disabled={busy || confirm}
            onClick={() => onRetain(view.produced)}
          >
            Keep all
          </Control>
        </div>
        {confirm ? (
          <div
            className={s.dispatchSeal}
            role="group"
            aria-label="Confirm permanent allocation"
          >
            <Kicker>Final dispatch order</Kicker>
            <p>
              Keep <b>{retain}</b>. Deliver <b>{delivery}</b>. This cannot be
              undone.
            </p>
            <Control
              tone="primary"
              disabled={busy}
              onClick={() => void send({ type: "commit_output", retain })}
            >
              Seal dispatch order
            </Control>
            <button
              className={s.secondary}
              disabled={busy}
              onClick={() => onConfirm(false)}
            >
              Change allocation
            </button>
          </div>
        ) : (
          <div className={s.dispatchSeal}>
            <p>
              Retained workers join the factory. Delivered robots cannot be
              recalled.
            </p>
            <Control
              tone="primary"
              disabled={busy}
              onClick={() => onConfirm(true)}
            >
              Review dispatch order
            </Control>
          </div>
        )}
      </div>
    </section>
  );
}
export function Debrief({
  media,
  view,
  onRecords,
  onRestart,
  opening,
  onFeedback,
}: {
  media: Media;
  view: PlayerView;
  onRecords: () => void;
  onRestart: () => void;
  opening: PlayerView | null;
  onFeedback: (id: FeedbackId) => void;
}) {
  return (
    <section className={s.debrief} aria-label="Shift debrief">
      <div className={s.sceneBackdrop}>
        <Art media={media} id="logistics-room" sizes="100vw" />
      </div>
      <header className={s.workspaceHeading}>
        <Kicker>Logistics / day 01 filed</Kicker>
        <h1>The line moved. At a cost.</h1>
      </header>
      <div className={s.debriefContent}>
        <OutcomeTokens view={view} opening={opening} onOpen={onFeedback}/>
        <p className={s.costReceipt}>{view.losses ? `${view.losses} worker lost this shift.` : "All workers survived."} The factory carries today’s wear forward.</p>
        <div className={s.debriefVoices}>{view.people.map(p=><SupervisorSignal key={p.id} media={media} view={view} person={p.id} onOpen={onFeedback}/>)}</div>
        <div className={s.workspaceActions}>
          <Control tone="primary" onClick={onRecords}>
            Inspect what happened
          </Control>
          <Control onClick={onRestart}>Try another first shift</Control>
        </div>
        <p className={s.smallPrint}>
          This first-day playtest ends here. Later shifts are still in
          development.
        </p>
      </div>
    </section>
  );
}
export function Records({
  media,
  view,
  selected,
  onSelect,
  batches,
  onBatches,
  onExport,
}: {
  media: Media;
  view: PlayerView;
  selected: string | null;
  onSelect: (id: string) => void;
  batches: boolean;
  onBatches: () => void;
  onExport: () => void;
}) {
  const events = view.events.filter((e) => batches || e.kind !== "production");
  const event = events.find((e) => e.id === selected) ?? events.at(-1);
  return (
    <section className={s.records} aria-label="Shift records">
      <header className={s.workspaceHeading}>
        <Kicker>Confirmed events / day 01</Kicker>
        <h1>The shift record</h1>
        <div>
          <button className={s.secondary} onClick={onBatches}>
            {batches ? "Hide batch receipts" : "Show batch receipts"}
          </button>
          <button className={s.secondary} onClick={onExport}>
            Export replay
          </button>
        </div>
      </header>
      {event ? (
        <div className={s.recordDesk}>
          <ol className={s.recordIndex}>
            {events.map((e) => (
              <li key={e.id}>
                <button
                  aria-current={event.id === e.id ? "true" : undefined}
                  onClick={() => onSelect(e.id)}
                >
                  <small>
                    {time(e.shiftTick)} ·{" "}
                    {e.actor === "factory"
                      ? "Factory"
                      : e.actor === "director"
                        ? "Your order"
                        : name(e.actor)}
                  </small>
                  <strong>{e.title}</strong>
                </button>
              </li>
            ))}
          </ol>
          <Receipt media={media} event={event} />
        </div>
      ) : (
        <div className={s.emptyRecord}>
          <Tape>No orders issued</Tape>
          <p>The first entry follows your appointment of an adviser.</p>
        </div>
      )}
    </section>
  );
}
function Receipt({ media, event }: { media: Media; event: Event }) {
  return (
    <article className={s.recordReceipt}>
      <div className={s.receiptArt}>
        <Art
          media={media}
          id={
            event.room === "conveyor"
              ? "forge"
              : event.room === "security"
                ? "security"
                : "dispatch-room"
          }
          sizes="(max-width:900px) 85vw, 50vw"
        />
      </div>
      <div className={s.receiptText}>
        <Kicker>
          {time(event.shiftTick)} /{" "}
          {event.actor === "director"
            ? "Your order"
            : event.actor === "factory"
              ? "Factory record"
              : `${name(event.actor)}${event.kind === "resolution" ? " · automatic action" : ""}`}
        </Kicker>
        <h2>{event.title}</h2>
        <p>{event.detail}</p>
        <h3>Why this happened</h3>
        <p>{event.cause}</p>
      </div>
    </article>
  );
}
export function Development({
  media,
  selected,
  onSelect,
}: {
  media: Media;
  selected: number;
  onSelect: (index: number) => void;
}) {
  const descriptions = [
    "Intake, assembly and outtake form the first production line.",
    "Access control and clearance support factory operations.",
    "The next capability is workforce conditioning. Its supervision will matter.",
    "Recover conveyor waste as cognitive substrate. Engineering arrives with this stage.",
    "Weave advanced cognition and connect the chain for the first smart workers.",
    "Complete the Brain 2.0 prototype. The full chain must be operating first.",
  ];
  return (
    <section className={s.development} aria-label="Factory development">
      <header className={s.workspaceHeading}>
        <Kicker>Development / floor 01</Kicker>
        <h1>The factory ahead</h1>
      </header>
      <div className={s.developmentMap}>
        {ROOMS.map((r, i) => (
          <button
            key={r.id}
            onClick={() => onSelect(i)}
            aria-pressed={selected === i}
          >
            <span className={s.developmentNumber}>0{i + 1}</span>
            <Tape>{r.title}</Tape>
            <small>{i < 2 ? "OPERATIONAL" : "NOT COMMISSIONED"}</small>
          </button>
        ))}
      </div>
      <div className={s.projectDetail}>
        <Art media={media} id="funds-relief" sizes="64px" />
        <div>
          <Kicker>
            {selected < 2 ? "Existing capability" : "Future capability"}
          </Kicker>
          <h2>{ROOMS[selected].title}</h2>
          <p>{descriptions[selected]}</p>
          <p className={s.smallPrint}>
            Commissioning continues beyond this first-day slice. Requirements
            and prices remain in design.
          </p>
        </div>
      </div>
    </section>
  );
}

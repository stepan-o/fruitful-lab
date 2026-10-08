"use client";
import { useState } from "react";
import type {
  Assignments,
  Command,
  PlayerView,
} from "@/lib/loopforge/first-shift/contract";
import {
  Art,
  Control,
  Kicker,
  Speaker,
  name,
  roomName,
  time,
  type Media,
} from "./ConsoleParts";
import s from "./first-shift.module.css";

type Props = {
  media: Media;
  view: PlayerView;
  busy: boolean;
  send: (command: Command) => Promise<boolean>;
  onRecords: () => void;
  onRestart: () => void;
};

export function AdviserChoice({ media, view, busy, send }: Props) {
  return (
    <>
      <p className={s.instruction}>
        One adviser for the day. Their priority shapes the plan.
      </p>
      <div className={s.adviserPair}>
        {view.people.map((person) => (
          <article
            key={person.id}
            className={s.adviser}
            data-person={person.id}
          >
            <div className={s.adviserArt}>
              <Art
                media={media}
                id={`${person.id}-portrait`}
                sizes="(max-width: 500px) 43vw, (max-width: 760px) 42vw, 24vw"
              />
              <div className={s.portraitLabel}>
                <Kicker>
                  {person.id === "limen"
                    ? "Protocols / compliance"
                    : "Momentum / output"}
                </Kicker>
                <h2>{name(person.id)}</h2>
              </div>
            </div>
            <div className={s.adviserPitch}>
              <blockquote>“{person.remark}”</blockquote>
              <p>
                {person.id === "limen"
                  ? "Lower output. Less wear and accident risk."
                  : "More output. More wear and accident risk."}
              </p>
              <Control
                disabled={busy}
                tone="primary"
                onClick={() =>
                  void send({ type: "choose_adviser", adviser: person.id })
                }
              >
                Choose {name(person.id)}
              </Control>
            </div>
          </article>
        ))}
      </div>
      <p className={s.deckFoot}>
        They propose assignments and event responses. You can override the plan.
      </p>
    </>
  );
}

function BriefingDeck({ media, view, busy, send }: Props) {
  const [swap, setSwap] = useState(false);
  const brief = view.briefing!;
  const assignments: Assignments = swap
    ? {
        conveyor: brief.assignments.security,
        security: brief.assignments.conveyor,
      }
    : brief.assignments;
  return (
    <div className={s.briefingDeck}>
      <div className={s.briefingOpening}>
        <div className={s.briefingPortrait}>
          <Art
            media={media}
            id={`${view.adviser}-portrait`}
            sizes="(max-width: 760px) 30vw, 170px"
          />
          <span>{name(view.adviser)}</span>
        </div>
        <div className={s.speechBeats}>
          <section>
            <Kicker>01 / The factory</Kicker>
            <p>“{brief.assessment}”</p>
          </section>
          <section>
            <Kicker>02 / The other supervisor</Kicker>
            <p>“{brief.context}”</p>
          </section>
        </div>
      </div>
      <section className={s.priorityBeat}>
        <Kicker>03 / My priority</Kicker>
        <h2>{brief.priority}</h2>
        <p>{brief.tradeoff}</p>
      </section>
      <section className={s.orderSheet}>
        <div className={s.sectionHeading}>
          <Kicker>
            {swap ? "Your revised arrangement" : "Proposed arrangement"}
          </Kicker>
          <button
            className={s.textButton}
            disabled={busy}
            onClick={() => setSwap(!swap)}
          >
            {swap ? "Restore proposal" : "Swap assignments"}
          </button>
        </div>
        <div className={s.assignmentPair}>
          {(["conveyor", "security"] as const).map((id) => (
            <div key={id}>
              <small>{roomName(id)}</small>
              <strong>{name(assignments[id])}</strong>
              <span>
                {assignments[id] === view.adviser
                  ? "Acts automatically here"
                  : "You approve event responses"}
              </span>
            </div>
          ))}
        </div>
        <p className={s.assignmentNote}>
          {swap
            ? `${name(view.adviser)} will follow your arrangement, but will object to being overruled.`
            : `${name(view.adviser)} handles events in their own room without asking. You decide in the other room.`}
        </p>
        <Control
          tone="primary"
          disabled={busy}
          onClick={() => void send({ type: "approve_plan", assignments })}
        >
          {swap ? "Issue revised assignments" : "Approve the arrangement"}
        </Control>
      </section>
    </div>
  );
}

function ReadyDeck({ media, view, busy, send }: Props) {
  return (
    <div className={s.operationDeck}>
      <Speaker media={media} view={view} />
      <div className={s.orderSheet}>
        <Kicker>Assignments confirmed</Kicker>
        <div className={s.assignmentPair}>
          {(["conveyor", "security"] as const).map((id) => (
            <div key={id}>
              <small>{roomName(id)}</small>
              <strong>{name(view.assignments![id])}</strong>
              <span>
                {view.assignments![id] === view.adviser
                  ? "Automatic authority"
                  : "Director approves responses"}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className={s.release}>
        <Kicker>Line is waiting on you</Kicker>
        <h2>Release the first shift.</h2>
        <p>
          The line will run continuously. Decisions outside your adviser’s room
          pause the shift.
        </p>
        <Control
          disabled={busy}
          tone="primary"
          onClick={() => void send({ type: "start_shift" })}
        >
          Start the conveyor
        </Control>
      </div>
    </div>
  );
}

function RunningDeck({ media, view, onRecords }: Props) {
  const latest = view.events
    .filter(
      (e) =>
        e.kind !== "production" && e.kind !== "adviser" && e.kind !== "plan",
    )
    .slice(-2);
  return (
    <div className={s.operationDeck}>
      <Speaker media={media} view={view} />
      <div className={s.outputCounter}>
        <Kicker>Finished this shift</Kicker>
        <strong key={view.produced}>
          {String(view.produced).padStart(2, "0")}
        </strong>
        <span>robots awaiting dispatch</span>
      </div>
      <div className={s.liveLog} aria-label="Recent factory events">
        {latest.map((e) => (
          <article key={e.id} data-kind={e.kind}>
            <Kicker>
              {time(e.shiftTick)} ·{" "}
              {e.kind === "resolution" && e.actor !== "director"
                ? `${name(e.actor === "factory" ? null : e.actor)} / automatic action`
                : e.room
                  ? roomName(e.room)
                  : "Factory"}
            </Kicker>
            <h3>{e.title}</h3>
            <p>{e.detail}</p>
          </article>
        ))}
      </div>
      <button className={s.textButton} onClick={onRecords}>
        Inspect the shift record →
      </button>
    </div>
  );
}

function DecisionDeck({ media, view, busy, send }: Props) {
  const problem = view.pending!;
  return (
    <div>
      <div className={s.incidentObservation}>
        <Kicker>{roomName(problem.room)} / crew report</Kicker>
        <p>{problem.observation}</p>
      </div>
      <div className={s.advice}>
        <div className={s.advicePortrait}>
          <Art media={media} id={`${view.adviser}-portrait`} sizes="96px" />
        </div>
        <div>
          <Kicker>{name(view.adviser)} recommends</Kicker>
          <blockquote>“{problem.advice}”</blockquote>
        </div>
      </div>
      <div className={s.choices}>
        {problem.choices
          .slice()
          .sort(
            (a, b) =>
              Number(b.id === problem.recommendation) -
              Number(a.id === problem.recommendation),
          )
          .map((choice) => (
            <section
              key={choice.id}
              data-recommended={choice.id === problem.recommendation}
            >
              <Kicker>
                {choice.id === problem.recommendation
                  ? "Follow your adviser"
                  : `Override ${name(view.adviser)}`}
              </Kicker>
              <h2>{choice.label}</h2>
              <p>{choice.consequence}</p>
              <Control
                tone={
                  choice.id === problem.recommendation ? "primary" : undefined
                }
                disabled={busy}
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
      <p className={s.deckFoot}>
        Both supervisors will remember how you handle this.
      </p>
    </div>
  );
}

function DispatchDeck({ view, busy, send }: Props) {
  const [retain, setRetain] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const delivery = view.produced - retain;
  return (
    <div className={s.dispatchDeck}>
      <div className={s.dispatchIntro}>
        <Kicker>Shift complete / {view.produced} robots ready</Kicker>
        <h2>More hands. Or fewer promises.</h2>
        <p>
          Retain new workers for your factory or commit them to the weekly
          delivery. Once sealed, they cannot be recalled.
        </p>
      </div>
      <div className={s.dispatchScale}>
        <div>
          <Kicker>Retain at factory</Kicker>
          <strong>{retain}</strong>
          <small>{view.workers + retain} total workers</small>
        </div>
        <span className={s.dispatchDivider}>/</span>
        <div>
          <Kicker>Send to quota</Kicker>
          <strong>{delivery}</strong>
          <small>
            {delivery} / {view.quota} after dispatch
          </small>
        </div>
      </div>
      <label className={s.sliderLabel} htmlFor="retain-workers">
        Workers to retain <output>{retain}</output>
      </label>
      <input
        className={s.dispatchSlider}
        id="retain-workers"
        type="range"
        min={0}
        max={view.produced}
        step={1}
        value={retain}
        disabled={busy || confirm}
        onChange={(e) => setRetain(Number(e.target.value))}
      />
      <div className={s.dispatchPresets}>
        <Control disabled={busy || confirm} onClick={() => setRetain(0)}>
          All to quota
        </Control>
        <Control
          disabled={busy || confirm}
          onClick={() => setRetain(Math.floor(view.produced / 2))}
        >
          Split output
        </Control>
        <Control
          disabled={busy || confirm}
          onClick={() => setRetain(view.produced)}
        >
          Keep all
        </Control>
      </div>
      {confirm ? (
        <div
          className={s.dispatchConfirmation}
          role="group"
          aria-label="Confirm permanent allocation"
        >
          <Kicker>Final dispatch order</Kicker>
          <p>
            <b>Keep {retain}.</b> Deliver <b>{delivery}</b>. This cannot be
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
            className={s.textButton}
            disabled={busy}
            onClick={() => setConfirm(false)}
          >
            Change allocation
          </button>
        </div>
      ) : (
        <Control
          tone="primary"
          disabled={busy}
          onClick={() => setConfirm(true)}
        >
          Review dispatch order
        </Control>
      )}
    </div>
  );
}

function DebriefDeck({ media, view, onRecords, onRestart }: Props) {
  return (
    <div className={s.debriefDeck}>
      <div className={s.debriefTotals}>
        <div>
          <Kicker>Produced</Kicker>
          <b>{view.produced}</b>
        </div>
        <div>
          <Kicker>Retained</Kicker>
          <b>{view.retained}</b>
        </div>
        <div>
          <Kicker>Delivered</Kicker>
          <b>{view.committed}</b>
        </div>
      </div>
      <div className={s.costReceipt}>
        <Kicker>What it cost</Kicker>
        <p>
          Line condition <b>82 → {view.condition}</b>
        </p>
        <p>
          {view.losses ? (
            <>
              <b>{view.losses} worker lost.</b> The shift record names the
              decision.
            </>
          ) : (
            "All workers made it through the shift."
          )}
        </p>
      </div>
      <div className={s.debriefVoices}>
        {view.people.map((person) => (
          <div key={person.id}>
            <Art media={media} id={`${person.id}-portrait`} sizes="72px" />
            <div>
              <Kicker>{name(person.id)}</Kicker>
              <p>“{person.remark}”</p>
            </div>
          </div>
        ))}
      </div>
      <Control tone="primary" onClick={onRecords}>
        Inspect what happened
      </Control>
      <Control onClick={onRestart}>Try another first shift</Control>
      <p className={s.deckFoot}>
        This playable slice ends here. Later days are still in design.
      </p>
    </div>
  );
}

export default function CommandDeck(props: Props) {
  switch (props.view.phase) {
    case "choose":
      return <AdviserChoice {...props} />;
    case "briefing":
      return <BriefingDeck {...props} />;
    case "ready":
      return <ReadyDeck {...props} />;
    case "running":
      return <RunningDeck {...props} />;
    case "decision":
      return <DecisionDeck {...props} />;
    case "allocation":
      return <DispatchDeck {...props} />;
    case "complete":
      return <DebriefDeck {...props} />;
  }
}

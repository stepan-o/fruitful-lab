"use client";
import type { PlayerView, SupervisorId } from "@/lib/loopforge/first-shift/contract";
import { feedbackFor, type Feedback, type FeedbackAction, type FeedbackId } from "@/lib/loopforge/first-shift/feedback";
import { Art, Control, Kicker, Token, name, time, type Media } from "./ConsoleParts";
import s from "./status-feedback.module.css";

export function StatusToken({ signal, onOpen, compact = false }: { signal: Feedback; onOpen: (id: FeedbackId) => void; compact?: boolean }) {
  return <button className={s.statusToken} data-tone={signal.tone} data-compact={compact} onClick={() => onOpen(signal.id)} aria-label={`${signal.label}: ${signal.value}. ${signal.knowledge}. Inspect feedback`}>
    <span className={s.indicator} aria-hidden="true" />
    <span><small><span data-subject>{signal.label} · </span>{signal.knowledge}</small><strong key={signal.revision}>{signal.value}</strong></span>
    <span className={s.inspect} aria-hidden="true">↗</span>
  </button>;
}

export function SupervisorSignal({ media, view, person, onOpen, compact = false }: { media: Media; view: PlayerView; person: SupervisorId; onOpen: (id: FeedbackId) => void; compact?: boolean }) {
  const signal = feedbackFor(view, `person:${person}`);
  return <button className={s.supervisor} data-compact={compact} onClick={() => onOpen(signal.id)} aria-label={`${name(person)}: ${signal.value} Inspect statement`}>
    <Token media={media} person={person} active={view.adviser === person} />
    <span className={s.voice} key={signal.revision}><small>{name(person)}{view.adviser === person ? " · adviser" : ""} <i>Statement</i></small><q>{signal.value}</q></span>
  </button>;
}

export function EvidencePanel({ media, signal, onAction, onRecord }: { media: Media; signal: Feedback; onAction: (action: FeedbackAction) => void; onRecord: (id: string) => void }) {
  const person = signal.id.startsWith("person:") ? signal.id.slice(7) as SupervisorId : null;
  const art = signal.id === "room:security" ? "security" : signal.id === "quota" || signal.id === "output" ? "dispatch-room" : "forge";
  return <article className={s.evidence} data-tone={signal.tone}>
    <div className={s.evidenceArt}>
      {person ? <Token media={media} person={person} large active /> : <Art media={media} id={art} sizes="(max-width:700px) 90vw, 300px" />}
      <span>{person ? "INTERNAL CHANNEL" : "FACTORY RECORD"}</span>
    </div>
    <div className={s.evidenceBody}>
      <Kicker>{signal.knowledge} / {signal.source}</Kicker>
      <h1>{signal.label}</h1>
      {person ? <blockquote>{signal.detail}</blockquote> : <><strong className={s.reading}>{signal.value}</strong><p>{signal.detail}</p></>}
      <p className={s.context}>{signal.context}</p>
      {signal.events.length > 0 && <section className={s.evidenceRecords} aria-label="Related shift records">
        <h2>{person ? "Recorded context" : "Supporting record"}</h2>
        {signal.events.map(event => <button key={event.id} onClick={() => onRecord(event.id)}><small>{time(event.shiftTick)} · {event.actor === "director" ? "Your order" : event.actor === "factory" ? "Factory" : name(event.actor)}</small><span>{event.title} <b aria-hidden="true">↗</b></span></button>)}
      </section>}
      {person && <small className={s.attribution}>Their words are a perspective. The records confirm actions and outcomes.</small>}
      {signal.action && <Control tone="primary" onClick={() => onAction(signal.action!.id)}>{signal.action.label}</Control>}
    </div>
  </article>;
}

export function OutcomeTokens({ view, opening, onOpen }: { view: PlayerView; opening?: PlayerView | null; onOpen: (id: FeedbackId) => void }) {
  return <div className={s.outcomes} aria-label="Inspect shift consequences">{(["output", "workers", "condition", "quota"] as const).map(id => <StatusToken key={id} signal={feedbackFor(view, id, opening)} onOpen={onOpen} />)}</div>;
}

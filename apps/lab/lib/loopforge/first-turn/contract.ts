/** Wire-only first-turn extension. No engine, framework or renderer dependencies. */
import type { Command as DailyCommand, PlayerView as DailyView, Event } from '../first-shift/contract';
export { canonical } from '../first-shift/contract';
export const PROTOCOL = 'loopforge-kvp-http/2' as const;
export const SCHEMA = 'loopforge_first_turn_2' as const;
export const ENGINE = 'first-turn-2.0.0' as const;
export const TICK_MS = 50;
export const BATCH_TICKS = 20;
export type Fixture = 'terminal' | 'gate' | 'drive';
export type Feed = 'hold' | 'metered' | 'open';
export type Drive = 'steady' | 'push';
export type Actor = { id: string; x: number; y: number; dx: number; dy: number; room: 'lobby' | 'security' | 'conveyor'; task: 'work' | 'wait' | 'carry' | 'lost'; distance: number };
export type FloorView = {
  stage: 'mandate' | 'day' | 'settled'; simTick: number;
  installed: Fixture[]; feed: Feed; drive: Drive;
  intake: number; assembly: number; outtake: number; released: number;
  blocked: boolean; travel: number; actors: Actor[];
  concern: string; earned: number;
};
export type PlayerView = DailyView & { floor: FloorView };
export type Command = DailyCommand | { type: 'acknowledge_mandate' } | { type: 'set_operation'; feed: Feed; drive: Drive };
export type RunRequest = { protocol: typeof PROTOCOL; schema_version: typeof SCHEMA; engine_version: typeof ENGINE; run_id: string; seed: number; initial_workers: number; commands: Command[]; baseline: { tick: number; step_hash: string } | null };
type Header = Pick<RunRequest,'protocol'|'schema_version'|'engine_version'|'run_id'> & { msg_id: string; sent_at_ms: number };
export type Op = { op: 'set_fields'; value: Omit<PlayerView,'events'> } | { op: 'append_events'; value: Event[] };
export type RecordMessage = Header & ({ msg_type: 'FULL_SNAPSHOT'; payload: { tick: number; step_hash: string; view: PlayerView } } | { msg_type: 'FRAME_DIFF'; payload: { from_tick: number; to_tick: number; prev_step_hash: string; step_hash: string; ops: Op[] } });
export type Receipt = { view: PlayerView; hash: string; runId: string };

/** Authored presentation placements, never payroll or worker simulation state.
 * Metres, integer floor coordinates and serializable sockets keep this reusable by
 * a future imported model. The accepted floor topology remains authoritative. */
export const LOBBY_KIT_VERSION = 'lobby-claim-hall/1';
export const CLAIM_DESK = {
  id: 'lobby.pay-claim-desk', width: 2.2, depth: 1.05, height: 1.02,
  sockets: { terminal: [-.52, 1.03, .18], lamp: [.78, 1.04, .29], feeder: [.7, 1.05, -.2], seat: [0, .58, -1.05] },
} as const;
export const LOBBY_BAYS = [
  { id: 'claim-01', x: 59, y: 83, yaw: 0, occupied: true },
  { id: 'claim-02', x: 65, y: 83, yaw: 0, occupied: true },
  { id: 'claim-03', x: 71, y: 83, yaw: 0, occupied: false },
  { id: 'claim-04', x: 77.2, y: 91, yaw: Math.PI / 2, occupied: false },
  { id: 'claim-05', x: 77.2, y: 97, yaw: Math.PI / 2, occupied: false },
] as const;
export type ClaimDisplay = 'filing' | 'waiting' | 'accepted' | 'returned';
export const CLAIM_DISPLAYS: readonly ClaimDisplay[] = ['filing', 'waiting', 'accepted', 'returned'];
/** Review animation only: time in seconds, independent of the commissioning clock. */
export function claimDisplay(time: number, offset = 0): ClaimDisplay {
  return CLAIM_DISPLAYS[Math.floor(Math.max(0, time + offset) / 5) % CLAIM_DISPLAYS.length];
}

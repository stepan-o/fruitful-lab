/** Decorative machine state, deliberately separate from the game kernel. */
export type Drive = {
  time: number; distance: number; velocity: number; untilJam: number;
  status: "running" | "jammed" | "restarting"; stateAge: number; restarts: number;
};
export function createDrive(): Drive {
  return { time: 0, distance: 83, velocity: 34, untilJam: 19, status: "running", stateAge: 0, restarts: 0 };
}
export function noise(seed: number) {
  let n = Math.imul(seed ^ (seed >>> 16), 0x45d9f3b);
  n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}
export function stepDrive(d: Drive, seconds: number) {
  const dt = Math.max(0, Math.min(seconds, .08));
  d.time += dt;
  d.stateAge += dt;
  if (d.status === "jammed") { d.velocity = 0; return; }
  d.untilJam -= dt;
  if (d.untilJam <= 0) {
    d.status = "jammed"; d.stateAge = 0; d.velocity = 0; return;
  }
  // A loaded continuous drive: broad torque variation plus small tooth ripple.
  // The positive floor prevents routine hesitation from reading as another jam.
  // Smooth seeded load interpolation avoids discontinuities at cycle boundaries.
  const cycle = d.time / 2.7, whole = Math.floor(cycle), phase = cycle - whole;
  const blend = phase * phase * (3 - 2 * phase);
  const load = .83 + .32 * (noise(whole + 17) * (1 - blend) + noise(whole + 18) * blend);
  const haul = 35 + 15 * Math.sin(d.time * 3.1) + 7 * Math.sin(d.time * 6.7 + .8)
    + 2.5 * Math.sin(d.time * 23);
  const ramp = d.status === "restarting" ? Math.min(1, d.stateAge / 1.25) : 1;
  d.velocity = haul * load * ramp;
  d.distance += d.velocity * dt;
  if (d.status === "restarting" && d.stateAge >= 1.6) { d.status = "running"; d.stateAge = 0; }
}
export function restartDrive(d: Drive) {
  if (d.status !== "jammed") return false;
  d.restarts += 1;
  d.status = "restarting"; d.stateAge = 0;
  d.untilJam = 33 + noise(d.restarts * 73) * 22;
  return true;
}

export const cargoKinds = ["cortex", "twin", "glass", "cracked", "halo", "augmented", "rejected", "skull", "cortex", "sprout", "glass", "augmented"] as const;
export type CargoKind = typeof cargoKinds[number];
export function cargoFor(index: number) {
  const slot = ((index % 12) + 12) % 12;
  return { kind: cargoKinds[slot], seed: slot * 919 + 47, scale: .86 + noise(slot + 71) * .2 };
}

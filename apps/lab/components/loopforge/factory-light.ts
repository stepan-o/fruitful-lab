export const beaconSpeed = { idle: .78, alarm: 3.9 } as const;
export type BeaconRotor = { phase: number; speed: number; time: number };
export function createBeaconRotor(): BeaconRotor { return { phase: 2.45, speed: beaconSpeed.idle, time: 0 }; }

/** Integrate the motor, rather than multiplying time by a new speed at a jam.
 * The exact exponential integral keeps both angle and speed continuous across
 * acceleration/restart, and repeated resize/still draws cannot advance it. */
export function stepBeaconRotor(rotor: BeaconRotor, time: number, alarm: boolean, still = false) {
  if (still) return beaconOrbit(2.45);
  const dt = Math.max(0, Math.min(.08, time - rotor.time));
  rotor.time = time;
  const target = alarm ? beaconSpeed.alarm : beaconSpeed.idle;
  const response = alarm ? .18 : .7;
  const decay = Math.exp(-dt / response);
  rotor.phase = (rotor.phase + target * dt + (rotor.speed - target) * response * (1 - decay)) % (Math.PI * 2);
  rotor.speed = target + (rotor.speed - target) * decay;
  return beaconOrbit(rotor.phase);
}

/** One continuous revolution about a vertical shaft, projected onto the stage. */
export function beaconOrbit(radians: number, still = false) {
  const phase = still ? 2.45 : radians;
  const lateral = Math.sin(phase), depth = Math.cos(phase);
  return {
    phase,
    lateral,
    depth,
    // Perspective compresses the front/back axis. This travels through a full
    // turn; it is not a sine-driven pendulum around the vertical screen axis.
    angle: Math.atan2(lateral, -depth * .46),
    facing: Math.pow(Math.max(0, depth), 14),
  };
}

/** The motor takes up slack, holds under load, then slips. No net belt travel. */
export function jamStrain(age: number, still = false) {
  if (still) return 0;
  const t = age % 2.8;
  if (t < .18) return t / .18;
  if (t < .44) return 1 + Math.sin(t * 87) * .12;
  if (t < .68) return Math.exp(-(t - .44) * 20) * Math.cos((t - .44) * 36);
  return 0;
}

/** Front aperture and opaque bowl are different surfaces, not mirrored sprites. */
export function reflectorPose(orbit: ReturnType<typeof beaconOrbit>) {
  return {
    front: orbit.depth > 0,
    apertureX: orbit.lateral * 13,
    rearX: -orbit.lateral * 5,
    width: 2 + Math.abs(orbit.depth) * 25,
    emission: Math.max(0, orbit.depth),
  };
}

/** Slow refractive breathing plus small filament variation, without a strobe. */
export function beamVariation(time: number, still = false) {
  const t = still ? 0 : time;
  return {
    mix: .5 + .5 * Math.sin(t * .83),
    width: 1 + .012 * Math.sin(t * 2.1) + .004 * Math.sin(t * 5.7),
    power: .965 + .022 * Math.sin(t * 9.3) + .012 * Math.sin(t * 23.1),
  };
}

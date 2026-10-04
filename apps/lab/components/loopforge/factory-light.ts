/** One continuous revolution about a vertical shaft, projected onto the stage. */
export function beaconOrbit(seconds: number, still = false) {
  const phase = still ? 2.45 : seconds * .78;
  const lateral = Math.sin(phase), depth = Math.cos(phase);
  return {
    phase,
    lateral,
    depth,
    // Perspective compresses the front/back axis. This travels through a full
    // turn; it is not a sine-driven pendulum around the vertical screen axis.
    angle: Math.atan2(lateral, -depth * .46),
    facing: Math.pow(Math.max(0, depth), 9),
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

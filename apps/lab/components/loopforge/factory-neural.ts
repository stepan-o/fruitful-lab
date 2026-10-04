import { noise } from "./factory-drive";

type Point = readonly [number, number];
export type NeuralWeave = {
  routes: Point[][];
  broken: boolean; seed: number;
};
type Ctx = CanvasRenderingContext2D;

function stroke(c: Ctx, points: readonly Point[], color: string, width: number) {
  c.beginPath(); c.moveTo(...points[0]);
  for (let k=1;k<points.length;k++) c.lineTo(...points[k]);
  c.strokeStyle=color; c.lineWidth=width; c.stroke();
}

/** One scene-wide discharge at a time; irregular onsets, no per-frame randomness. */
export function neuralDischarge(time: number, still = false) {
  const cycle = Math.floor(time / 8.4), onset = cycle*8.4 + .8 + noise(cycle*71+31)*3.8;
  const age = time-onset, duration = 1.15;
  const strength = still || age < 0 || age >= duration ? 0
    : Math.min(1,age/.13) * Math.pow(1-age/duration,1.7);
  return { cycle, age, strength, choice: noise(cycle*139+17) };
}

export function neuralPulse(time: number, seed: number, route: number, still = false) {
  if (still) return { light: .28, position: -1 };
  const period = 2.6+noise(seed+route*41)*3, phase = (time/period+noise(seed+route*109))%1;
  return { light: .22 + .48*Math.pow(Math.sin(phase*Math.PI),6), position: phase*1.45-.2 };
}

function halo(c: Ctx, x: number, y: number, radius: number, power: number) {
  const g=c.createRadialGradient(x,y,0,x,y,radius);
  g.addColorStop(0,`rgba(143,255,239,${power})`); g.addColorStop(.18,`rgba(17,232,221,${power*.52})`); g.addColorStop(1,"#08b7ce00");
  c.fillStyle=g; c.fillRect(x-radius,y-radius,radius*2,radius*2);
}

/** Bounded moving packets and one short discharge; no filters or particle allocation. */
export function drawNeuralSignals(c: Ctx, weave: NeuralWeave, time: number, still: boolean, discharge: ReturnType<typeof neuralDischarge> | null) {
  c.save(); c.lineCap="round"; c.lineJoin="round"; c.globalCompositeOperation="screen";
  for (const [j, route] of weave.routes.entries()) {
    const pulse=neuralPulse(time,weave.seed,j,still), at=pulse.position*64;
    if (at<1 || at>63) continue;
    const k=Math.floor(at), p=route[k], tail=route[Math.max(0,k-6)];
    c.globalAlpha=weave.broken?.7:1;
    halo(c,p[0],p[1],6,.22);
    c.beginPath();c.moveTo(...tail);
    for(let n=Math.max(0,k-5);n<=k;n++) c.lineTo(...route[n]);
    c.strokeStyle="#90fff0";c.lineWidth=.9;c.stroke();
    halo(c,p[0],p[1],1.4,.65);
  }
  if (discharge && discharge.strength>0) {
    const {age,strength,cycle}=discharge;
    const route=weave.routes[weave.broken?1:Math.floor(noise(cycle+weave.seed)*weave.routes.length)];
    const at=weave.broken?64:32, origin=route[at], reach=weave.broken?36:27;
    c.globalAlpha=strength;
    halo(c,origin[0],origin[1],51,.63);
    for(let branch=0;branch<3;branch++) {
      const angle=-Math.PI*.95+branch*.76+noise(cycle+branch*31)*.5;
      // Fixed branching paths emerge, then fade. No high-frequency random flashing.
      c.beginPath();c.moveTo(...origin);
      for(let n=1;n<=6;n++) {
        const along=reach*n/6, kink=(noise(weave.seed+cycle*7+branch*53+n*11)-.5)*10;
        c.lineTo(origin[0]+Math.cos(angle)*along+kink,origin[1]+Math.sin(angle)*along);
      }
      c.strokeStyle="#18cbd744";c.lineWidth=5;c.stroke();
      c.strokeStyle="#6affec";c.lineWidth=1.2;c.stroke();
      c.strokeStyle="#e0fff3";c.lineWidth=.45;c.stroke();
    }
    for(let n=0;n<7;n++) {
      const vx=(noise(cycle*29+n*71)-.5)*66, vy=-13-noise(n*37+weave.seed)*35;
      const x=origin[0]+vx*age,y=origin[1]+vy*age+15*age*age;
      stroke(c,[[x-vx*.045,y-vy*.045],[x,y]],"#9affed",1.1);
    }
    // Cyan bounce on the specimen socket, contained to this carrier.
    halo(c,12,26,34,.2);
  }
  c.restore();
}

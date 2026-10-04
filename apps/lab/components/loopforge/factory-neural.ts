import { noise, type CargoKind } from "./factory-drive";

type Point = readonly [number, number];
export type NeuralWeave = { routes: Point[][]; strands: Point[][]; broken: boolean; seed: number };
type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;

/** Geometry is built once per specimen. The three cores actually cross in a braid. */
export function createNeuralWeave(kind: CargoKind, seed: number): NeuralWeave {
  const broken = kind === "cracked" || kind === "rejected";
  const curves: number[][] = kind === "skull"
    ? [[-26,-43,-54,-35,-55,0,-31,14], [11,-49,5,-18,44,-30,37,6], [38,2,60,10,57,30,41,28]]
    : kind === "twin"
      ? [[-30,-39,-61,-28,-41,5,-20,13], [24,-47,-1,-30,46,-18,29,15], [-16,-4,-1,25,14,-20,27,2]]
      : [[-19,-49,-66,-42,-55,16,-31,23], [13,-49,-8,-28,56,-26,43,17], [-38,-17,-5,-2,-7,30,24,22], [49,6,79,-2,73,34,48,28]];
  const routes = curves.map((v, j) => {
    const bend = (noise(seed + j * 61) - .5) * 12;
    return Array.from({ length: 65 }, (_, k): Point => {
      const t = k / 64, u = 1 - t;
      let x = u*u*u*v[0] + 3*u*u*t*(v[2]+bend) + 3*u*t*t*v[4] + t*t*t*v[6];
      let y = u*u*u*v[1] + 3*u*u*t*v[3] + 3*u*t*t*(v[5]+bend) + t*t*t*v[7];
      if (kind === "rejected") { const a = x, b = y*.72+12; x = a*.986+b*.169; y = -a*.169+b*.986; }
      if (kind === "cracked" && j === 1 && t > .58) { x += (t-.58)*19; y -= (t-.58)*32; }
      return [x, y];
    });
  });
  const strands = routes.flatMap((route, j) => Array.from({length: 3}, (_, strand) => route.map(([x, y], k): Point => {
    const before = route[Math.max(0,k-1)], after = route[Math.min(64,k+1)];
    const dx = after[0]-before[0], dy = after[1]-before[1], length = Math.hypot(dx,dy) || 1;
    const wind = Math.sin(k*.8+strand*TAU/3+j)*1.8;
    return [x-dy/length*wind,y+dx/length*wind];
  })));
  return { routes, strands, broken, seed };
}

function stroke(c: Ctx, points: readonly Point[], color: string, width: number) {
  c.beginPath(); c.moveTo(...points[0]);
  for (let k=1;k<points.length;k++) c.lineTo(...points[k]);
  c.strokeStyle=color; c.lineWidth=width; c.stroke();
}

export function paintNeuralWeave(c: Ctx, weave: NeuralWeave, emissive = false) {
  c.save(); c.lineCap="round"; c.lineJoin="round";
  if (!emissive) for (const route of weave.routes) {
    c.save(); c.translate(1,2); stroke(c,route,"#020a09cf",8); c.restore();
    stroke(c,route,"#242c23",6); stroke(c,route,"#697d68",4.7);
  }
  for (const [j, strand] of weave.strands.entries()) {
    if (emissive) { stroke(c,strand,"#18e8e713",6); stroke(c,strand,"#4bf5ed80",1.1); }
    else { stroke(c,strand,j%3===0?"#a39b62":"#065954",1.6); stroke(c,strand,j%3===0?"#789c7c":"#58bfb2",.65); }
  }
  if (!emissive) for (const route of weave.routes) {
    // Brass ferrules make the luminous fibres part of the machine, not a decal.
    for (const k of [0,25,64]) {
      const p=route[k], next=route[Math.min(64,k+1)], prev=route[Math.max(0,k-1)];
      c.save(); c.translate(...p); c.rotate(Math.atan2(next[1]-prev[1],next[0]-prev[0]));
      c.fillStyle="#0b1713"; c.fillRect(-3,-4.5,6,9);
      c.fillStyle="#716642"; c.fillRect(-2,-4,4,8);
      c.fillStyle="#c2b183"; c.fillRect(-2,-4,1,8); c.restore();
    }
  }
  c.restore();
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
    halo(c,p[0],p[1],10,.34);
    c.beginPath();c.moveTo(...tail);
    for(let n=Math.max(0,k-5);n<=k;n++) c.lineTo(...route[n]);
    c.strokeStyle="#90fff0";c.lineWidth=1.6;c.stroke();
    halo(c,p[0],p[1],2,.8);
  }
  if (discharge && discharge.strength>0) {
    const {age,strength,cycle}=discharge;
    const route=weave.routes[weave.broken?1:Math.floor(noise(cycle+weave.seed)*weave.routes.length)];
    const at=weave.broken?64:25, origin=route[at], reach=weave.broken?36:27;
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

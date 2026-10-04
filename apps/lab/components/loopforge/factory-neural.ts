import { noise, type CargoKind } from "./factory-drive";

type Point = readonly [number, number];
export type NeuralWeave = {
  routes: Point[][]; strands: Point[][];
  crossings: { points: Point[]; strand: number }[];
  broken: boolean; seed: number;
};
type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;

/** Arc-length sampling gives the braid a consistent physical pitch on tight bends.
 * Geometry, crossover ordering and connector orientation are all baked once. */
export function createNeuralWeave(kind: CargoKind, seed: number): NeuralWeave {
  const broken = kind === "cracked" || kind === "rejected";
  const curves: number[][] = kind === "skull"
    ? [[-25,-47,-50,-39,-50,-4,-30,14], [11,-48,3,-25,39,-23,32,15]]
    : kind === "twin"
      ? [[-30,-39,-53,-25,-46,1,-30,17], [23,-47,6,-25,41,-20,33,17], [-30,17,-15,27,11,29,33,17]]
      : [[-29,-49,-53,-39,-58,-5,-43,17], [14,-51,3,-28,42,-18,39,20], [-43,17,-25,31,16,33,39,20]];
  const routes = curves.map((v, j) => {
    const bend = (noise(seed + j * 61) - .5) * 3;
    const points = Array.from({ length: 193 }, (_, k): Point => {
      const t = k / 192, u = 1 - t;
      let x = u*u*u*v[0] + 3*u*u*t*(v[2]+bend) + 3*u*t*t*v[4] + t*t*t*v[6];
      let y = u*u*u*v[1] + 3*u*u*t*v[3] + 3*u*t*t*(v[5]+bend) + t*t*t*v[7];
      if (kind === "rejected") { const a=x, b=y*.72+12; x=a*.986+b*.169; y=-a*.169+b*.986; }
      if (kind === "cracked" && j === 1 && t > .7) { x+=(t-.7)*20; y-=(t-.7)*37; }
      return [x,y];
    });
    const lengths=[0];
    for(let k=1;k<points.length;k++) lengths.push(lengths[k-1]+Math.hypot(points[k][0]-points[k-1][0],points[k][1]-points[k-1][1]));
    let cursor=1;
    return Array.from({length:65},(_,k): Point => {
      const distance=lengths[192]*k/64;
      while(cursor<192 && lengths[cursor]<distance)cursor++;
      const f=(distance-lengths[cursor-1])/(lengths[cursor]-lengths[cursor-1] || 1);
      return [points[cursor-1][0]*(1-f)+points[cursor][0]*f,points[cursor-1][1]*(1-f)+points[cursor][1]*f];
    });
  });
  const strands: Point[][]=[], crossings: NeuralWeave["crossings"]=[];
  for(const [j,route] of routes.entries()) {
    const spacing=Math.hypot(route[1][0]-route[0][0],route[1][1]-route[0][1]);
    for(let strand=0;strand<3;strand++) {
      const core=route.map(([x,y],k): Point => {
        const before=route[Math.max(0,k-1)],after=route[Math.min(64,k+1)];
        const dx=after[0]-before[0],dy=after[1]-before[1],length=Math.hypot(dx,dy)||1;
        const wind=Math.sin(k*spacing*TAU/8+strand*TAU/3+j)*.95;
        return [x-dy/length*wind,y+dx/length*wind];
      });
      strands.push(core);
      let front: Point[]=[];
      for(let k=0;k<=64;k++) {
        const above=Math.cos(k*spacing*TAU/8+strand*TAU/3+j)>.1;
        if(above)front.push(core[k]);
        if((!above || k===64) && front.length) {
          if(!above)front.push(core[k]);
          if(front.length>1)crossings.push({points:front,strand});
          front=[];
        }
      }
    }
  }
  return { routes, strands, crossings, broken, seed };
}

function stroke(c: Ctx, points: readonly Point[], color: string, width: number) {
  c.beginPath(); c.moveTo(...points[0]);
  for (let k=1;k<points.length;k++) c.lineTo(...points[k]);
  c.strokeStyle=color; c.lineWidth=width; c.stroke();
}

export function paintNeuralWeave(c: Ctx, weave: NeuralWeave, emissive = false) {
  c.save(); c.lineCap="round"; c.lineJoin="round";
  if(emissive) {
    for(const route of weave.routes)stroke(c,route,"#16cddb18",5);
    for(const crossing of weave.crossings)stroke(c,crossing.points,"#70ffef75",.7);
    c.restore();return;
  }
  for(const route of weave.routes) {
    c.save();c.translate(.8,1.5);stroke(c,route,"#020a08ba",5.4);c.restore();
    stroke(c,route,"#092723",4.2);stroke(c,route,"#387b73",3.1);
  }
  for(const strand of weave.strands)stroke(c,strand,"#08635f",1.25);
  // Front windings occlude their neighbours: a manufactured plait, not scribbles.
  for(const crossing of weave.crossings) {
    stroke(c,crossing.points,"#063d3c",1.7);
    stroke(c,crossing.points,crossing.strand===0?"#55d9cf":"#32b3ae",1.05);
    c.save();c.translate(-.2,-.25);stroke(c,crossing.points,"#bbf5df",.28);c.restore();
  }
  for(const [j,route] of weave.routes.entries())for(const k of (j===2?[32]:[0,64])) {
    const p=route[k],next=route[Math.min(64,k+1)],prev=route[Math.max(0,k-1)];
    c.save();c.translate(...p);c.rotate(Math.atan2(next[1]-prev[1],next[0]-prev[0]));
    c.fillStyle="#082622";c.fillRect(-3.5,-3.4,7,6.8);
    const metal=c.createLinearGradient(0,-3,0,3);
    metal.addColorStop(0,"#3a493b");metal.addColorStop(.25,"#b0a475");metal.addColorStop(.5,"#637866");metal.addColorStop(1,"#172d27");
    c.fillStyle=metal;c.fillRect(-3,-2.8,6,5.6);
    c.fillStyle="#112d27";c.fillRect(-1.7,-2.8,.7,5.6);c.fillRect(1,-2.8,.7,5.6);c.restore();
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

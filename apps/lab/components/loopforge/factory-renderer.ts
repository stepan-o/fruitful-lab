import { cortexOutline, paintCortex, type CortexCache } from "./factory-brain";
import { cargoFor, noise, type CargoKind, type Drive } from "./factory-drive";
import { createNeuralWeave, drawNeuralSignals, neuralDischarge, neuralPulse, paintNeuralWeave, type NeuralWeave } from "./factory-neural";

import { beaconOrbit, jamStrain } from "./factory-light";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
function surface(w: number, h: number) {
  const c = document.createElement("canvas"); c.width = Math.ceil(w); c.height = Math.ceil(h);
  return c;
}
function line(c: Ctx, points: number[], color: string, width = 1) {
  c.strokeStyle = color; c.lineWidth = width; c.beginPath(); c.moveTo(points[0], points[1]);
  for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]); c.stroke();
}
function polygon(c: Ctx, points: number[], fill: string | CanvasGradient, stroke?: string) {
  c.beginPath(); c.moveTo(points[0], points[1]);
  for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]);
  c.closePath(); c.fillStyle = fill; c.fill(); if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); }
}
function ellipse(c: Ctx, x: number, y: number, rx: number, ry: number, fill: string | CanvasGradient, stroke?: string) {
  c.beginPath(); c.ellipse(x, y, Math.max(.01, rx), Math.max(.01, ry), 0, 0, TAU);
  c.fillStyle = fill; c.fill(); if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); }
}
function gradient(c: Ctx, x: number, y: number, x2: number, y2: number, stops: [number, string][]) {
  const g = c.createLinearGradient(x, y, x2, y2); stops.forEach(([at, color]) => g.addColorStop(at, color)); return g;
}
function glow(c: Ctx, x: number, y: number, r: number, color: string, power = 1) {
  c.save(); c.globalAlpha *= power;
  const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, color); g.addColorStop(1, "transparent");
  c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); c.restore();
}
function bolt(c: Ctx, x: number, y: number, r = 3) {
  ellipse(c, x + 1, y + 2, r + 1, r + 1, "#030606");
  ellipse(c, x, y, r, r, gradient(c, x, y - r, x, y + r, [[0,"#bca47c"],[.35,"#696b55"],[1,"#212824"]]), "#1c201b");
  line(c,[x-r*.55,y,x+r*.55,y],"#1e2824",.8);
}
function pipe(c: Ctx, x: number, y: number, w: number) {
  c.fillStyle = gradient(c,0,y,0,y+11,[[0,"#111b19"],[.3,"#526154"],[.48,"#839078"],[.62,"#303d34"],[1,"#070e0d"]]);
  c.fillRect(x,y,w,11);
  for(let a=x+8;a<x+w;a+=72) { c.fillStyle="#252e26";c.fillRect(a,y-2,8,15);line(c,[a+1,y-1,a+1,y+12],"#777c5e"); }
}
function drawBrain(c: Ctx, seed: number, kind: CargoKind, cortex: CortexCache) {
  const damaged = kind === "rejected" || kind === "cracked";
  paintCortex(c, seed, damaged, cortex);
  c.save(); cortexOutline(c); c.clip();
  if(kind==="cracked") {
    polygon(c,[17,-45,3,-19,20,-5,5,23,30,4,17,-12,33,-41],"#0e1613");
    line(c,[18,-44,4,-19,21,-5,7,22],"#edb154",1.5);
    for(let i=0;i<9;i++) { const x=18+noise(i+2)*20,y=-30+i*6;ellipse(c,x,y,2,1,"#71ae9a"); }
  }
  if(kind==="augmented") {
    polygon(c,[13,-57,51,-36,62,-4,38,8,17,-5],gradient(c,15,-45,50,8,[[0,"#6d8980"],[.4,"#263e3b"],[1,"#071917"]]),"#9d9270");
    for(let i=0;i<4;i++)line(c,[22+i*7,-37,34+i*6,-29,31+i*6,-10],"#8bb8a274",1.5);
    bolt(c,32,-39,2);bolt(c,49,-8,2);ellipse(c,40,-22,4,4,"#b5f6d3");
  }
  c.restore();
}
function skull(c: Ctx) {
  c.save();c.rotate(-.08);
  c.beginPath();c.moveTo(-32,11);c.bezierCurveTo(-42,6,-48,-12,-44,-29);
  c.bezierCurveTo(-42,-55,-10,-61,13,-51);c.bezierCurveTo(38,-46,45,-24,37,-7);
  c.lineTo(30,3);c.lineTo(24,8);c.lineTo(20,23);c.quadraticCurveTo(0,32,-19,22);
  c.lineTo(-23,7);c.lineTo(-32,11);c.closePath();
  c.fillStyle=gradient(c,-24,-51,28,27,[[0,"#c9b994"],[.25,"#b3a582"],[.63,"#796d50"],[1,"#2e3328"]]);c.fill();
  c.strokeStyle="#343629";c.lineWidth=2;c.stroke();
  c.save();c.clip();
  glow(c,-17,-32,32,"#e1d2ac5e");
  for(let i=0;i<700;i++){c.fillStyle=i%3?"#efe0b216":"#302a1b35";c.fillRect(-48+noise(i*19)*93,-58+noise(i*29)*90,.7,.7);}
  c.restore();
  // Unequal orbital cavities, brow ridges, temples and cheek arches give the
  // occasional legacy specimen anatomy instead of an emoji face.
  polygon(c,[-33,-24,-19,-30,-7,-23,-8,-8,-22,-3,-34,-10],gradient(c,-22,-29,-22,-3,[[0,"#080e0c"],[.65,"#151b13"],[1,"#564b31"]]),"#776849");
  polygon(c,[8,-24,24,-27,32,-20,28,-6,15,-5,8,-12],gradient(c,18,-28,21,-5,[[0,"#080e0c"],[.7,"#1b2016"],[1,"#685237"]]),"#726348");
  line(c,[-36,-24,-24,-32,-10,-29,-6,-24],"#d4c198",2.3);
  line(c,[8,-27,24,-30,33,-23],"#bcb18a",2);
  polygon(c,[0,-18,-7,3,-1,8,4,3,8,5,7,-3],"#182019","#77694b");
  line(c,[-37,-6,-27,3,-24,13],"#d0bd8b",2.3);
  line(c,[33,-5,25,4,22,15],"#a09367",2);
  c.beginPath();c.moveTo(-19,11);c.quadraticCurveTo(-1,5,22,10);c.lineTo(18,21);c.quadraticCurveTo(0,28,-17,20);c.closePath();c.fillStyle="#332d20";c.fill();
  for(let i=0;i<7;i++) {
    const x=-18+i*5.4,y=12+Math.sin(i*.56)*1.5;
    polygon(c,[x,y,x+4.5,y-.5,x+4,21-Math.abs(i-3)*.6,x+.6,20.5-Math.abs(i-3)*.5],gradient(c,x,y,x,22,[[0,"#d5c399"],[.65,"#a3946f"],[1,"#574d35"]]));
  }
  line(c,[-20,22,-13,28,4,29,19,24],"#867958",2);
  line(c,[-15,-53,-10,-43,-15,-35,-9,-30],"#5e5540",1);
  line(c,[-11,-44,-4,-41],"#766345",.7);
  line(c,[25,-43,21,-35,24,-31],"#655b42",.8);
  glow(c,20,-15,8,"#78c5b4",.18);ellipse(c,20,-15,1,1,"#b1d9b9");
  c.restore();
}

function cargoSprite(kind: CargoKind, seed: number, weave: NeuralWeave, cortex: CortexCache) {
  const sprite=surface(340,280),c=sprite.getContext("2d")!;c.scale(2,2);c.translate(85,95);
  ellipse(c,0,19,74,15,"#0009");
  polygon(c,[-67,13,-49,-2,62,-2,77,14,59,29,-70,29],gradient(c,0,0,0,29,[[0,"#777456"],[.2,"#2d3932"],[.6,"#181f1a"],[1,"#050d0d"]]),"#7d7954");
  polygon(c,[-60,9,-45,1,54,1,65,11,49,20,-63,20],"#071410","#54665a");
  c.save();c.translate(0,-9);
  if(kind==="skull")skull(c);
  else if(kind==="twin") {c.save();c.translate(-24,0);c.scale(.64,.7);drawBrain(c,seed,"cortex",cortex);c.restore();c.save();c.translate(24,-5);c.scale(.67,.8);drawBrain(c,seed+7,"cortex",cortex);c.restore();}
  else {c.save();if(kind==="rejected"){c.rotate(-.17);c.scale(1.04,.72);c.translate(0,12);}drawBrain(c,seed,kind,cortex);c.restore();}
  paintNeuralWeave(c,weave);
  if(kind==="glass") {
    c.beginPath();c.moveTo(-65,23);c.lineTo(-65,-31);c.bezierCurveTo(-67,-91,66,-91,66,-31);c.lineTo(66,23);c.closePath();
    c.fillStyle=gradient(c,-66,0,66,0,[[0,"#9befce30"],[.13,"#c3fff317"],[.35,"#9efde904"],[.74,"#4c8e7814"],[.91,"#afffea38"],[1,"#24574d33"]]);c.fill();c.strokeStyle="#74a29299";c.lineWidth=1.5;c.stroke();
    c.beginPath();c.moveTo(-54,6);c.lineTo(-54,-29);c.bezierCurveTo(-56,-54,-43,-64,-27,-67);c.strokeStyle="#c0f1d8a8";c.lineWidth=2.5;c.stroke();
    ellipse(c,0,23,67,8,"#213b3233","#9d9c6b");
    for(let i=0;i<4;i++)ellipse(c,47+noise(i+4)*5,-20-i*10,1.5,2,"#bbe3cc40");
  }
  if(kind==="halo") {ellipse(c,0,-76,29,5,"#bca54b18","#d8c377");ellipse(c,0,-76,23,3,"transparent","#6f6d45");}
  if(kind==="sprout") {line(c,[3,-54,4,-75],"#96a67c",2);c.save();c.translate(3,-72);c.rotate(-.5);ellipse(c,-7,-3,9,4,"#647c52","#a3ae77");c.rotate(.9);ellipse(c,6,-7,9,4,"#7a925c","#b1bc84");c.restore();}
  if(kind==="augmented" || kind==="cracked") {
    c.beginPath();c.moveTo(44,-1);c.bezierCurveTo(79,-12,78,18,54,27);c.strokeStyle="#171c16";c.lineWidth=6;c.stroke();c.strokeStyle="#8b8560";c.lineWidth=1.3;c.stroke();
  }
  c.restore();
  // Clamps connect the specimen to its cradle rather than letting it float.
  for(const x of [-56,57]) {polygon(c,[x-6,12,x-4,-3,x+2,-5,x+5,13],"#3c493b","#978f62");bolt(c,x,14,2.5);}
  c.fillStyle="#837651";c.fillRect(-23,23,48,9);c.fillStyle="#17231e";c.font="bold 5px monospace";c.textAlign="center";
  c.fillText(kind==="rejected"?"RETURN TO SENDER":kind==="skull"?"LEGACY MODEL":kind==="halo"?"SAINT-0":kind==="sprout"?"GROWTH MINDSET":`LF / ${String(seed).padStart(4,"0")}`,1,29);
  if(kind==="rejected") {line(c,[29,-17,47,1,29,1,47,-17],"#b45039",2.5);}
  return sprite;
}
function neuralSprite(weave: NeuralWeave) {
  const sprite=surface(340,280),c=sprite.getContext("2d")!;
  c.scale(2,2);c.translate(85,86);paintNeuralWeave(c,weave,true);return sprite;
}
function slatSprite() {
  const s=surface(44,55),c=s.getContext("2d")!;
  polygon(c,[12,0,43,0,31,49,0,49],gradient(c,0,0,0,52,[[0,"#38453d"],[.14,"#666b4c"],[.25,"#2f3930"],[.9,"#272e25"],[1,"#868063"]]),"#121a14");
  for(let y=5;y<48;y+=5)line(c,[13-y*.24,y,39-y*.24,y],y%2?"#aaa07935":"#060e1280");
  for(let i=0;i<9;i++){const x=13+noise(i*7)*18,y=4+noise(i*17)*39;line(c,[x,y,x+5,y-1],"#b8a1743c",.5);}
  bolt(c,16,5,1.5);bolt(c,20,41,1.5);return s;
}

/** Soft optical fan, baked once. The outer falloff has no visible cone edge. */
function opticalFan(red: boolean) {
  const s=surface(256,512), c=s.getContext("2d")!;
  const rgb=red?"248,48,21":"206,136,51";
  for(let y=0;y<512;y++) {
    const distance=(512-y)/512, half=distance*124+2;
    const falloff=.12+.6*Math.pow(1-distance,.8);
    const g=c.createLinearGradient(128-half,0,128+half,0);
    for(const [at,power] of [[0,0],[.15,.055],[.35,.36],[.5,.6],[.65,.36],[.85,.055],[1,0]])
      g.addColorStop(at,`rgba(${rgb},${power*falloff})`);
    c.fillStyle=g;c.fillRect(128-half,y,half*2,1);
  }
  return s;
}
function silhouette(sprite: HTMLCanvasElement) {
  const s=surface(sprite.width,sprite.height), c=s.getContext("2d")!;
  c.drawImage(sprite,0,0);c.globalCompositeOperation="source-in";c.fillStyle="#000";c.fillRect(0,0,s.width,s.height);
  return s;
}

export function createFactoryRenderer(canvas: HTMLCanvasElement) {
  const c=canvas.getContext("2d",{alpha:false});if(!c)return null;
  let width=1200,height=370,beltY=190;
  const background=surface(1,1),front=surface(1,1),lightLayer=surface(1,1);
  const redFan=opticalFan(true),amberFan=opticalFan(false);
  const bakeStart=performance.now();
  const cortex: CortexCache=new Map();
  const weaves=Array.from({length:12},(_,i)=>{const q=cargoFor(i);return createNeuralWeave(q.kind,q.seed);});
  const cargo=weaves.map((weave,i)=>{const q=cargoFor(i);return cargoSprite(q.kind,q.seed,weave,cortex);});
  for(const master of cortex.values())master.width=master.height=1;
  cortex.clear();
  const neural=weaves.map(neuralSprite);
  const shadows=cargo.map(silhouette);
  const slat=slatSprite();let count=0,totalMs=0,maxMs=0;
  canvas.dataset.bakeMs=(performance.now()-bakeStart).toFixed(2);
  let burstCycle=-1,burstCarrier:number|null=null;
  function build() {
    background.width=front.width=Math.ceil(width);background.height=front.height=Math.ceil(height);
    lightLayer.width=Math.ceil(width*.65);lightLayer.height=Math.ceil(height*.65);
    const b=background.getContext("2d")!,f=front.getContext("2d")!;
    b.fillStyle=gradient(b,0,0,0,height,[[0,"#010302"],[.55,"#020604"],[.8,"#08130e"],[1,"#020605"]]);b.fillRect(0,0,width,height);
    glow(b,width*.24,beltY-38,280,"#9d6b2727");glow(b,width*.82,beltY-20,210,"#44877820");
    for(let x=-30;x<width+100;x+=120) {
      b.fillStyle=gradient(b,x,0,x+80,0,[[0,"#0a120f"],[.4,"#18241b"],[1,"#09120f"]]);b.fillRect(x,beltY-113,88,108);
      line(b,[x+2,beltY-108,x+2,beltY-6],"#72715035");line(b,[x+6,beltY-106,x+77,beltY-106],"#55613c36");
      bolt(b,x+9,beltY-100,2);bolt(b,x+75,beltY-12,2);
      for(let k=0;k<4;k++) {b.fillStyle="#010b0a";b.fillRect(x+20,beltY-81+k*8,48,3);line(b,[x+20,beltY-78+k*8,x+67,beltY-78+k*8],"#66674728");}
    }
    pipe(b,0,beltY-6,width);pipe(b,0,beltY+104,width);
    // The bed shows its upper plane, with a recessed lower return and weight-bearing legs.
    b.fillStyle="#070d0b";b.fillRect(0,beltY+5,width,120);
    for(let x=42;x<width+140;x+=248) {
      polygon(b,[x,beltY+54,x+24,beltY+55,x+41,height-8,x-11,height-8],gradient(b,x,0,x+40,0,[[0,"#0b1816"],[.5,"#3d4a3c"],[1,"#101d18"]]),"#454c34");
      b.fillStyle="#1d2921";b.fillRect(x-16,height-13,70,9);bolt(b,x-8,height-9,2);bolt(b,x+45,height-9,2);
      line(b,[x+6,beltY+72,x+19,height-20],"#95926838",2);
    }
    for(let x=-30;x<width+70;x+=82) {
      ellipse(b,x,beltY+78,31,29,gradient(b,x-20,beltY+49,x+20,beltY+108,[[0,"#6b7054"],[.25,"#172723"],[.7,"#2f3a2d"],[1,"#090e0d"]]),"#686342");
      ellipse(b,x,beltY+78,24,23,"#071310","#485743");
      ellipse(b,x,beltY+78,8,8,"#5e6147","#908364");
    }
    // Front fascia with repeated plates, seams, inspection windows and bracket ears.
    f.fillStyle=gradient(f,0,beltY+32,0,beltY+74,[[0,"#b0a475"],[.05,"#666e50"],[.17,"#2c3b2d"],[.56,"#17271f"],[.85,"#344233"],[1,"#070e0c"]]);f.fillRect(0,beltY+32,width,37);
    for(let x=-80;x<width+180;x+=190) {
      line(f,[x,beltY+34,x,beltY+66],"#070d0b",3);line(f,[x+2,beltY+35,x+2,beltY+65],"#aaa27344");
      bolt(f,x+12,beltY+42);bolt(f,x+168,beltY+57);
      polygon(f,[x+42,beltY+39,x+122,beltY+39,x+127,beltY+62,x+36,beltY+62],"#0c1712","#746c45");
      for(let k=0;k<6;k++)line(f,[x+48+k*11,beltY+44,x+44+k*11,beltY+58],"#4d604236",3);
      f.fillStyle="#c6ad76";f.font="6px monospace";f.fillText(`LF // ${String(Math.round(x+80)/190+1).padStart(2,"0")}`,x+48,beltY+54);
      f.fillStyle="#8e793b";f.fillRect(x+143,beltY+39,13,19);for(let k=0;k<4;k++)line(f,[x+143,beltY+41+k*5,x+156,beltY+45+k*5],"#263023",3);
    }
    for(let i=0;i<width*2;i++) {
      const x=noise(i*29+3)*width,y=beltY+33+noise(i*11)*34;
      f.fillStyle=i%3?"#9b865621":"#020b0866";f.fillRect(x,y,noise(i+7)*10+1,.6);
    }
    line(f,[0,beltY+34,width,beltY+34],"#d3bd8166",1);line(f,[0,beltY+71,width,beltY+71],"#93855a",2);
  }
  function resize(cssWidth: number, cssHeight: number) {
    const artScale=cssWidth<=640 && cssHeight<480 ? Math.max(.42,(cssHeight-140)/400) : cssWidth<=640 ? Math.max(.68,Math.min(.92,(cssHeight-100)/780)) : cssHeight>cssWidth*1.1 ? Math.min(1.2,cssHeight/840) : Math.max(.64,Math.min(1,cssWidth/1050,cssHeight/600));
    width=Math.min(1800,cssWidth/artScale);height=cssHeight/artScale;beltY=height-190;
    const resolution=Math.min(1.25,1800/cssWidth,1100/cssHeight);
    canvas.width=Math.round(cssWidth*resolution);canvas.height=Math.round(cssHeight*resolution);build();
  }
  function draw(d: Drive, still=false) {
    const start=performance.now(),t=d.time,jammed=d.status==="jammed";
    c!.setTransform(canvas.width/width,0,0,canvas.height/height,0,0);
    c!.drawImage(background,0,0);
    const lampX=width*.5,lampY=height-78;
    const orbit=beaconOrbit(t,still),{phase,angle}=orbit;
    const alarm=jammed?Math.min(1,d.stateAge/.35):d.status==="restarting"?Math.max(0,1-d.stateAge/.8):0;
    const strain=jammed?jamStrain(d.stateAge,still):0;
    const travel=d.distance+strain*2.4;
    const spacing=194,first=Math.floor((-travel-100)/spacing),last=Math.ceil((width-travel+100)/spacing);
    const beam=(x:number,y:number)=>Math.pow(Math.max(0,Math.cos(Math.atan2(x-lampX,lampY-y)-angle)),28);
    const beamColor=alarm>.5?"#ff3b22":"#ffa83f";
    // Low-resolution light layer: the beam moves through a full projected orbit.
    // Cargo and support silhouettes remove light before the machinery is drawn.
    const l=lightLayer.getContext("2d")!;
    l.setTransform(lightLayer.width/width,0,0,lightLayer.height/height,0,0);l.clearRect(0,0,width,height);
    l.save();l.translate(lampX,lampY);l.rotate(angle);
    const reach=Math.hypot(width,height)*1.4;
    l.globalAlpha=.35+alarm*.65;
    l.drawImage(alarm>.5?redFan:amberFan,-reach*.52,-reach,reach*1.04,reach);
    l.globalAlpha*=.13;l.rotate(Math.PI);l.drawImage(alarm>.5?redFan:amberFan,-reach*.7,-reach,reach*1.4,reach);l.restore();
    l.save();l.globalCompositeOperation="destination-out";
    l.beginPath();l.rect(0,0,width,beltY+10);l.clip();
    for(let i=first;i<=last;i++) {
      const x=i*spacing+travel,q=cargoFor(i),slot=((i%12)+12)%12;
      const stretch=Math.min(6,(beltY+100)/105), skew=-(x-lampX-orbit.lateral*13)/height*.65;
      l.save();l.translate(x,beltY+12);l.transform(1,0,skew,1,0,0);l.globalAlpha=.5;
      l.drawImage(shadows[slot],-105*q.scale,-119*q.scale*stretch,210*q.scale,140*q.scale*stretch);l.restore();
    }
    l.restore();
    c!.save();c!.globalCompositeOperation="screen";c!.drawImage(lightLayer,0,0,width,height);
    // Broad reflected atmosphere has a gradual tail, never a solid spotlight disk.
    glow(c!,lampX,lampY,width*.6,alarm>.5?"#b324131d":"#84602608");c!.restore();
    for(let x=-50;x<width+80;x+=82) {
      c!.save();c!.translate(x,beltY+78);c!.rotate((travel+strain*1.5)/25);
      for(let k=0;k<6;k++){c!.rotate(TAU/6);line(c!,[10,0,21,0],"#828568",2.5);}c!.restore();
    }
    c!.save();c!.beginPath();c!.rect(0,beltY-17,width,54);c!.clip();
    const pitch=32,offset=travel%pitch;
    for(let x=-55+offset;x<width+55;x+=pitch)c!.drawImage(slat,x,beltY-17);
    c!.restore();
    c!.save();c!.globalAlpha=.44;
    for(let x=-44-(travel%pitch);x<width+44;x+=pitch)c!.drawImage(slat,x,beltY+102,44,12);
    c!.restore();
    // Each carrier belongs to an unbounded world index; recycling happens offscreen.
    const discharge=neuralDischarge(t,still);
    // Pick a carrier using its world index at onset, so a burst stays attached
    // while the belt moves. Selection is fixed until this bounded event ends.
    const onBeltFirst=Math.ceil(-d.distance/spacing),onBeltLast=Math.floor((width-d.distance)/spacing);
    if(discharge.cycle!==burstCycle) {burstCycle=discharge.cycle;burstCarrier=null;}
    if(discharge.strength>0 && burstCarrier===null) burstCarrier=onBeltFirst+Math.floor(discharge.choice*(onBeltLast-onBeltFirst+1));
    const kick=d.status==="restarting"?Math.sin(d.stateAge*36)*Math.exp(-d.stateAge*3):jammed?strain*.7:0;
    for(let i=first;i<=last;i++) {
      const x=i*spacing+travel, q=cargoFor(i),slot=((i%12)+12)%12;
      const chatter=still?0:Math.sin(t*24+i*1.7)*Math.min(.5,d.velocity/120)+kick*2;
      const settle=still?0:Math.sin(t*18+i)*Math.max(0,1-d.velocity/30)*.3;
      ellipse(c!,x+9,beltY+14,72*q.scale,10,"#000c");
      c!.save();c!.translate(x,beltY+chatter);c!.rotate((chatter+settle)*.006);
      c!.drawImage(cargo[slot],-85*q.scale,-119*q.scale,170*q.scale,140*q.scale);
      c!.save();c!.globalCompositeOperation="screen";
      c!.globalAlpha=neuralPulse(t,q.seed,0,still).light;
      c!.drawImage(neural[slot],-85*q.scale,-119*q.scale,170*q.scale,140*q.scale);c!.restore();
      c!.scale(q.scale,q.scale);c!.translate(0,-33);
      drawNeuralSignals(c!,weaves[slot],t,still,i===burstCarrier?discharge:null);c!.restore();
      // Sparse grazing highlights retain the brain's material instead of a red veil.
      const incident=beam(x,beltY-42)*(jammed ? .8 : .16);
      if(incident>.02){glow(c!,x+27,beltY-55,46,beamColor,incident*.35);line(c!,[x-64,beltY+19,x+55,beltY+19],jammed?`rgba(255,100,57,${incident})`:`rgba(239,182,92,${incident})`,1.6);}

    }
    c!.drawImage(front,0,0);
    // A travelling specular streak is clipped to metal, with bearing shadows below.
    c!.save();c!.globalCompositeOperation="screen";
    const specX=lampX+orbit.lateral*width*.6;
    const spec=c!.createRadialGradient(specX,beltY+46,0,specX,beltY+46,jammed?245:135);
    spec.addColorStop(0,jammed?"#f32e1460":"#c1781325");spec.addColorStop(1,"transparent");c!.fillStyle=spec;c!.globalAlpha=.25+Math.max(0,-orbit.depth)*.75;c!.fillRect(0,beltY+32,width,39);c!.restore();
    for(let x=42;x<width;x+=248){const dx=(x-lampX)*.23;polygon(c!,[x-1,beltY+70,x+23,beltY+70,x+dx+43,height,x+dx-21,height],jammed?"#0009":"#0005");}
    // Conduit and ribbed beacon housing sit BELOW the carrying bed.
    const by=height-85;
    c!.strokeStyle="#090f0b";c!.lineWidth=8;c!.beginPath();c!.moveTo(lampX+19,by+34);c!.bezierCurveTo(lampX+95,by+47,lampX+91,beltY+105,lampX+166,beltY+105);c!.stroke();
    c!.strokeStyle="#555b3f";c!.lineWidth=1.3;c!.stroke();
    glow(c!,lampX,by+12,jammed?95:47,jammed?"#ff321fe0":"#d48b2355");
    c!.fillStyle=gradient(c!,lampX-28,0,lampX+28,0,[[0,"#17231c"],[.35,"#8b8260"],[.5,"#b0a378"],[.8,"#394336"],[1,"#0e1b16"]]);c!.fillRect(lampX-31,by+30,62,17);
    ellipse(c!,lampX,by+30,31,6,"#766c49","#aa9567");
    c!.beginPath();c!.moveTo(lampX-24,by+28);c!.lineTo(lampX-22,by);c!.bezierCurveTo(lampX-21,by-25,lampX+21,by-25,lampX+22,by);c!.lineTo(lampX+24,by+28);c!.closePath();
    c!.fillStyle=gradient(c!,lampX-24,0,lampX+24,0,[[0,jammed?"#390e0b":"#36280e"],[.26,jammed?"#8f281b":"#7e5b1e"],[.54,jammed?"#d25234":"#b98d3a"],[.82,jammed?"#6e150f":"#64400c"],[1,"#1b1b0f"]]);c!.fill();c!.strokeStyle=jammed?"#f0784777":"#e7bc6477";c!.lineWidth=1;c!.stroke();
    c!.save();c!.clip();
    // Reflector turns about an upright central spindle. Its back crosses and
    // occludes the bulb for half the orbit; casing and ribs never lean.
    line(c!,[lampX,by-10,lampX,by+28],"#c49d6999",2);
    const bulbX=lampX+orbit.lateral*14;
    const reflectorWidth=3+Math.abs(orbit.depth)*13;
    ellipse(c!,bulbX,by+8,reflectorWidth,20,gradient(c!,bulbX-reflectorWidth,0,bulbX+reflectorWidth,0,[[0,"#35150c"],[.3,jammed?"#a23e2b":"#9a7043"],[.58,jammed?"#ff8d72":"#f3c086"],[1,"#352116"]]));
    glow(c!,bulbX,by+7,19,jammed?"#ff5332":"#ffa840",(jammed?1:.55)*(.12+Math.max(0,orbit.depth)*.88));
    ellipse(c!,bulbX,by+7,4+Math.max(0,Math.cos(phase))*5,21,orbit.depth>0?(jammed?"#ffd2c9d9":"#ffe4a766"):"#7e37152a");
    for(let k=-20;k<=20;k+=4)line(c!,[lampX+k,by-17,lampX+k,by+28],k%8?"#19090470":"#f8c49844",1);
    c!.restore();
    for(const dx of [-21,21]){line(c!,[lampX+dx,by-5,lampX+dx,by+31],"#15221b",2);bolt(c!,lampX+dx,by+39,2.7);}
    ellipse(c!,lampX,by+29,25,4,"#4e4932","#b49b61");
    if(jammed) {
      // Anamorphic glare spans the screen only as the reflector faces the reader.
      const facing=.03+.97*orbit.facing;
      c!.save();c!.globalCompositeOperation="screen";c!.globalAlpha=facing;
      c!.fillStyle=gradient(c!,0,0,width,0,[[0,"#ff271300"],[.3,"#e9371615"],[.49,"#ff703866"],[.5,"#ffd8aabb"],[.51,"#ff703866"],[.7,"#e9371615"],[1,"#ff271300"]]);
      c!.fillRect(0,by+5,width,2);
      glow(c!,lampX,by+6,52,"#ff4a2899");
      c!.restore();
    }
    // Brief, finite sparks on the jam impact or after pulling the mechanical reset.
    const impact=jammed?d.stateAge%2.8:d.status==="restarting"?d.stateAge:10;
    if(!still && impact<.55) for(let i=0;i<10;i++) {
      const u=impact, vx=(noise(i*67)-.5)*210,vy=-40-noise(i*89)*120;
      const sx=width*.75+vx*u,sy=beltY+64+vy*u+170*u*u;
      line(c!,[sx-vx*.018,sy-vy*.012,sx,sy],`rgba(255,${180-Math.round(u*100)},65,${1-u/.75})`,1+noise(i)*.7);
    }
    // A few dim dust particles lend depth; they never cover the menu above.
    if(!still)for(let i=0;i<11;i++) {
      const px=(noise(i*39)*width+t*(2+noise(i)*3))%width, py=beltY-30-noise(i*47)*120+Math.sin(t*.7+i)*6;
      ellipse(c!,px,py,.6+noise(i),.6+noise(i),`rgba(161,143,91,${.06+beam(px,py)*.18})`);
    }
    const ms=performance.now()-start;totalMs+=ms;maxMs=Math.max(maxMs,ms);count++;
    if(count%60===0){canvas.dataset.beaconPhase=(phase%TAU).toFixed(3);canvas.dataset.strain=strain.toFixed(2);canvas.dataset.drawMeanMs=(totalMs/count).toFixed(2);canvas.dataset.drawMaxMs=maxMs.toFixed(2);canvas.dataset.distance=d.distance.toFixed(2);canvas.dataset.frames=String(count);}
  }
  return {resize,draw,dispose(){[background,front,lightLayer,redFan,amberFan,slat,...cargo,...neural,...shadows].forEach(s=>{s.width=0;s.height=0;});}};
}

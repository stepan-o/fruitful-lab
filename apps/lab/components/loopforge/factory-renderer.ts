import { cargoFor, noise, type CargoKind, type Drive } from "./factory-drive";

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
function brainOutline(c: Ctx) {
  c.beginPath();c.moveTo(-56,11);c.bezierCurveTo(-69,-9,-56,-37,-36,-44);
  c.bezierCurveTo(-28,-61,-6,-59,3,-51);c.bezierCurveTo(24,-61,49,-45,56,-27);
  c.bezierCurveTo(72,-14,70,11,55,21);c.bezierCurveTo(36,37,18,30,4,31);
  c.bezierCurveTo(-19,38,-48,29,-56,11);c.closePath();
}
function drawBrain(c: Ctx, seed: number, kind: CargoKind) {
  const damaged = kind === "rejected" || kind === "cracked";
  const skin = damaged ? ["#8a8460","#514936","#202a26"] : ["#dbab76","#a97447","#4b3825"];
  c.save(); brainOutline(c);
  c.fillStyle=gradient(c,-35,-55,32,36,[[0,skin[0]],[.5,skin[1]],[1,skin[2]]]);c.fill();
  c.lineWidth=3;c.strokeStyle="#211d17";c.stroke();c.clip();
  // Seeded wandering ridges follow each hemisphere; no repeated tile pattern.
  c.lineCap="round";c.lineJoin="round";
  for(const side of [-1,1]) for(let row=0;row<8;row++) {
    const y=-52+row*11, n=noise(seed+row*117+side*81);
    c.beginPath();c.moveTo(side*(3+n*3),y);
    for(let segment=0;segment<4;segment++) {
      const x=side*(6+segment*16),bend=noise(seed+row*53+segment*199+side*13);
      const yy=y+Math.sin(segment*1.8+row)*6;
      c.bezierCurveTo(x+side*14,yy-10-bend*5,x-side*8,yy+11,x+side*(12+bend*7),yy+4);
    }
    c.strokeStyle="#30271c";c.lineWidth=11;c.stroke();
    c.strokeStyle=damaged?"#7e7756":"#b58a5d";c.lineWidth=8.1;c.stroke();
    c.save();c.translate(-1,-1.8);c.strokeStyle=damaged?"#a3986c":"#dfb17b";c.lineWidth=2.1;c.stroke();c.restore();
    c.save();c.translate(.8,1.5);c.strokeStyle="#342e2259";c.lineWidth=2;c.stroke();c.restore();
  }
  // Broad form lighting and subtle pores give the folds a rounded, warm material.
  c.fillStyle=gradient(c,-65,-15,66,28,[[0,"#19190f90"],[.3,"#f5c78713"],[.6,"#1b17040b"],[1,"#091712ac"]]);c.fillRect(-75,-70,150,110);
  c.fillStyle=gradient(c,0,-53,0,36,[[0,"#eac18239"],[.3,"#dea26106"],[.65,"#181b1017"],[1,"#09120dc9"]]);c.fillRect(-75,-70,150,110);
  for(let i=0;i<1500;i++){c.fillStyle=i%3?"#f3d3a016":"#1a211128";c.fillRect(-67+noise(seed+i*31)*137,-61+noise(seed+i*67)*99,.65,.65);}
  c.beginPath();c.moveTo(0,-52);c.bezierCurveTo(-12,-30,17,-18,5,3);c.bezierCurveTo(-2,14,12,20,6,34);
  c.strokeStyle="#201b16";c.lineWidth=3.4;c.stroke();
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
  c.beginPath();c.moveTo(-31,12);c.bezierCurveTo(-59,-7,-48,-46,-16,-51);
  c.bezierCurveTo(18,-62,49,-39,46,-6);c.lineTo(28,8);c.lineTo(23,28);c.lineTo(-20,28);c.closePath();
  c.fillStyle=gradient(c,-20,-45,30,27,[[0,"#c3af7e"],[.55,"#877653"],[1,"#36382d"]]);c.fill();c.strokeStyle="#292820";c.lineWidth=3;c.stroke();
  ellipse(c,-18,-13,13,14,"#0b1412","#635738");ellipse(c,20,-14,13,15,"#0b1412","#6c5d3c");
  polygon(c,[-1,-9,-7,9,7,8],"#15201a");
  for(let i=0;i<7;i++){c.fillStyle="#b7a477";c.fillRect(-20+i*6,16,4,9);}
  line(c,[-18,-44,-10,-34,-16,-24],"#514b36",1.2);glow(c,20,-14,10,"#78c5b4",.3);ellipse(c,20,-14,2,2,"#aae4cc");
}
function cargoSprite(kind: CargoKind, seed: number) {
  const sprite=surface(340,280),c=sprite.getContext("2d")!;c.scale(2,2);c.translate(85,95);
  ellipse(c,0,19,74,15,"#0009");
  polygon(c,[-67,13,-49,-2,62,-2,77,14,59,29,-70,29],gradient(c,0,0,0,29,[[0,"#777456"],[.2,"#2d3932"],[.6,"#181f1a"],[1,"#050d0d"]]),"#7d7954");
  polygon(c,[-60,9,-45,1,54,1,65,11,49,20,-63,20],"#071410","#54665a");
  c.save();c.translate(0,-9);
  if(kind==="skull")skull(c);
  else if(kind==="twin") {c.save();c.translate(-24,0);c.scale(.64,.7);drawBrain(c,seed,"cortex");c.restore();c.save();c.translate(24,-5);c.scale(.67,.8);drawBrain(c,seed+7,"cortex");c.restore();}
  else {c.save();if(kind==="rejected"){c.rotate(-.17);c.scale(1.04,.72);c.translate(0,12);}drawBrain(c,seed,kind);c.restore();}
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
function slatSprite() {
  const s=surface(44,55),c=s.getContext("2d")!;
  polygon(c,[12,0,43,0,31,49,0,49],gradient(c,0,0,0,52,[[0,"#38453d"],[.14,"#666b4c"],[.25,"#2f3930"],[.9,"#272e25"],[1,"#868063"]]),"#121a14");
  for(let y=5;y<48;y+=5)line(c,[13-y*.24,y,39-y*.24,y],y%2?"#aaa07935":"#060e1280");
  for(let i=0;i<9;i++){const x=13+noise(i*7)*18,y=4+noise(i*17)*39;line(c,[x,y,x+5,y-1],"#b8a1743c",.5);}
  bolt(c,16,5,1.5);bolt(c,20,41,1.5);return s;
}

export function createFactoryRenderer(canvas: HTMLCanvasElement) {
  const c=canvas.getContext("2d",{alpha:false});if(!c)return null;
  let width=1200,height=370,beltY=190;
  const background=surface(1,1),front=surface(1,1);
  const cargo=Array.from({length:12},(_,i)=>{const q=cargoFor(i);return cargoSprite(q.kind,q.seed);});
  const slat=slatSprite();let count=0,totalMs=0,maxMs=0;
  function build() {
    background.width=front.width=Math.ceil(width);background.height=front.height=Math.ceil(height);
    const b=background.getContext("2d")!,f=front.getContext("2d")!;
    b.fillStyle=gradient(b,0,0,0,height,[[0,"#020504"],[.32,"#07110e"],[.7,"#101b17"],[1,"#030807"]]);b.fillRect(0,0,width,height);
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
    const artScale=Math.max(.68,Math.min(1,cssWidth/1050));
    width=Math.min(1800,cssWidth/artScale);height=cssHeight/artScale;beltY=height-178;
    const resolution=Math.min(1.25,1600/cssWidth,540/cssHeight);
    canvas.width=Math.round(cssWidth*resolution);canvas.height=Math.round(cssHeight*resolution);build();
  }
  function draw(d: Drive, still=false) {
    const start=performance.now(),t=d.time,jammed=d.status==="jammed";
    c!.setTransform(canvas.width/width,0,0,canvas.height/height,0,0);
    c!.drawImage(background,0,0);
    const lampX=width*.5,lampY=height-43;
    const phase=still ? 0.72 :t*(jammed?1.12:.65),angle=Math.sin(phase)*1.3;
    const beam=(x:number,y:number)=>Math.pow(Math.max(0,Math.cos(Math.atan2(x-lampX,lampY-y)-angle)),18);
    const beamColor=jammed?"#ff321e":"#ffa83f";
    // Light exists behind the machine first. The opaque fascia and cargo occlude it.
    c!.save();c!.globalCompositeOperation="screen";
    glow(c!,lampX,lampY,width*.7,jammed?"#d629174c":"#9f651611",1);
    c!.translate(lampX,lampY);c!.rotate(angle);
    const light=gradient(c!,0,0,0,-height,[[0,jammed?"#ff3b24aa":"#d5963328"],[.3,jammed?"#ea281964":"#d5963317"],[1,"#641a0700"]]);
    polygon(c!,[-12,0,-width*.48,-height,width*.48,-height,12,0],light);c!.restore();
    for(let x=-50;x<width+80;x+=82) {
      c!.save();c!.translate(x,beltY+78);c!.rotate(d.distance/25);
      for(let k=0;k<6;k++){c!.rotate(TAU/6);line(c!,[10,0,21,0],"#828568",2.5);}c!.restore();
    }
    c!.save();c!.beginPath();c!.rect(0,beltY-17,width,54);c!.clip();
    const pitch=32,offset=d.distance%pitch;
    for(let x=-55+offset;x<width+55;x+=pitch)c!.drawImage(slat,x,beltY-17);
    c!.restore();
    c!.save();c!.globalAlpha=.44;
    for(let x=-44-(d.distance%pitch);x<width+44;x+=pitch)c!.drawImage(slat,x,beltY+102,44,12);
    c!.restore();
    // Each carrier belongs to an unbounded world index; recycling happens offscreen.
    const spacing=194,first=Math.floor((-d.distance-100)/spacing),last=Math.ceil((width-d.distance+100)/spacing);
    const kick=d.status==="restarting"?Math.sin(d.stateAge*36)*Math.exp(-d.stateAge*3):jammed?Math.sin(d.stateAge*43)*Math.exp(-d.stateAge*9):0;
    for(let i=first;i<=last;i++) {
      const x=i*spacing+d.distance, q=cargoFor(i),slot=((i%12)+12)%12;
      const chatter=still?0:Math.sin(t*24+i*1.7)*Math.min(.5,d.velocity/120)+kick*2;
      const settle=still?0:Math.sin(t*18+i)*Math.max(0,1-d.velocity/30)*.3;
      ellipse(c!,x+9,beltY+14,72*q.scale,10,"#000c");
      c!.save();c!.translate(x,beltY+chatter);c!.rotate((chatter+settle)*.006);
      c!.drawImage(cargo[slot],-85*q.scale,-119*q.scale,170*q.scale,140*q.scale);c!.restore();
      // Sparse grazing highlights retain the brain's material instead of a red veil.
      const incident=beam(x,beltY-42)*(jammed ? .8 : .16);
      if(incident>.02){glow(c!,x+27,beltY-55,46,beamColor,incident*.35);line(c!,[x-64,beltY+19,x+55,beltY+19],jammed?`rgba(255,100,57,${incident})`:`rgba(239,182,92,${incident})`,1.6);}
      // Long cast shadows diverge from the beacon, broken by the specimen profile.
      c!.save();c!.globalAlpha=jammed ? .13 : .07;
      const spread=(x-lampX)*.65;
      polygon(c!,[x-40,beltY-13,x+42,beltY-13,x+spread+57,0,x+spread-61,0],"#000");c!.restore();
    }
    c!.drawImage(front,0,0);
    // A travelling specular streak is clipped to metal, with bearing shadows below.
    c!.save();c!.globalCompositeOperation="screen";
    const specX=lampX+Math.tan(angle)*135;
    const spec=c!.createRadialGradient(specX,beltY+46,0,specX,beltY+46,jammed?245:135);
    spec.addColorStop(0,jammed?"#f32e1460":"#c1781325");spec.addColorStop(1,"transparent");c!.fillStyle=spec;c!.fillRect(0,beltY+32,width,39);c!.restore();
    for(let x=42;x<width;x+=248){const dx=(x-lampX)*.23;polygon(c!,[x-1,beltY+70,x+23,beltY+70,x+dx+43,height,x+dx-21,height],jammed?"#0009":"#0005");}
    // Conduit and ribbed beacon housing sit BELOW the carrying bed.
    const by=height-65;
    c!.strokeStyle="#090f0b";c!.lineWidth=8;c!.beginPath();c!.moveTo(lampX+19,by+34);c!.bezierCurveTo(lampX+95,by+47,lampX+91,beltY+105,lampX+166,beltY+105);c!.stroke();
    c!.strokeStyle="#555b3f";c!.lineWidth=1.3;c!.stroke();
    glow(c!,lampX,by+12,jammed?125:47,jammed?"#ff321fe0":"#d48b2355");
    c!.fillStyle=gradient(c!,lampX-28,0,lampX+28,0,[[0,"#17231c"],[.35,"#8b8260"],[.5,"#b0a378"],[.8,"#394336"],[1,"#0e1b16"]]);c!.fillRect(lampX-31,by+30,62,17);
    ellipse(c!,lampX,by+30,31,6,"#766c49","#aa9567");
    c!.beginPath();c!.moveTo(lampX-24,by+28);c!.lineTo(lampX-22,by);c!.bezierCurveTo(lampX-21,by-25,lampX+21,by-25,lampX+22,by);c!.lineTo(lampX+24,by+28);c!.closePath();
    c!.fillStyle=gradient(c!,lampX-24,0,lampX+24,0,[[0,jammed?"#390e0b":"#36280e"],[.26,jammed?"#8f281b":"#7e5b1e"],[.54,jammed?"#d25234":"#b98d3a"],[.82,jammed?"#6e150f":"#64400c"],[1,"#1b1b0f"]]);c!.fill();c!.strokeStyle=jammed?"#f0784777":"#e7bc6477";c!.lineWidth=1;c!.stroke();
    c!.save();c!.clip();
    const bulbX=lampX+Math.sin(phase)*15;
    glow(c!,bulbX,by+7,19,jammed?"#ff5332":"#ffa840",jammed?1:.55);
    ellipse(c!,bulbX,by+7,4+Math.max(0,Math.cos(phase))*5,21,jammed?"#ffddafd9":"#ffe4a744");
    for(let k=-20;k<=20;k+=4)line(c!,[lampX+k,by-17,lampX+k,by+28],k%8?"#19090470":"#f8c49844",1);
    c!.restore();
    for(const dx of [-21,21]){line(c!,[lampX+dx,by-5,lampX+dx,by+31],"#15221b",2);bolt(c!,lampX+dx,by+39,2.7);}
    ellipse(c!,lampX,by+29,25,4,"#4e4932","#b49b61");
    if(jammed) {
      // Anamorphic glare spans the screen only as the reflector faces the reader.
      const facing=.15+.85*Math.pow(Math.max(0,Math.cos(phase)),5);
      c!.save();c!.globalCompositeOperation="screen";c!.globalAlpha=facing;
      c!.fillStyle=gradient(c!,0,0,width,0,[[0,"#ff271300"],[.3,"#e9371615"],[.49,"#ff703866"],[.5,"#ffd8aabb"],[.51,"#ff703866"],[.7,"#e9371615"],[1,"#ff271300"]]);
      c!.fillRect(0,by+5,width,2);
      glow(c!,lampX,by+6,52,"#ff4a2899");
      c!.restore();
    }
    // Brief, finite sparks on the jam impact or after pulling the mechanical reset.
    const impact=jammed?d.stateAge:d.status==="restarting"?d.stateAge:10;
    if(!still && impact<.75) for(let i=0;i<14;i++) {
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
    if(count%60===0){canvas.dataset.drawMeanMs=(totalMs/count).toFixed(2);canvas.dataset.drawMaxMs=maxMs.toFixed(2);canvas.dataset.distance=d.distance.toFixed(2);canvas.dataset.frames=String(count);}
  }
  return {resize,draw,dispose(){[background,front,slat,...cargo].forEach(s=>{s.width=0;s.height=0;});}};
}

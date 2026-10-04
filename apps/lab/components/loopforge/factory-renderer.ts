import { cargoFor, noise, type Drive } from "./factory-drive";
import { drawNeuralSignals, neuralDischarge } from "./factory-neural";
import { specimenSlots, specimenLift, specimenWeave, paintSpecimenFibres } from "./factory-specimens";
import { loadFactoryArt } from "./factory-art";
import { createBeaconRotor, stepBeaconRotor, jamStrain } from "./factory-light";
import { createFactoryOptics } from "./factory-optics";

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
/** Soft, baked scattering lobes. Animation moves textures, never a CSS blur. */
function atmosphereTexture() {
  const s=surface(384,128), c=s.getContext("2d")!;
  for(let i=0;i<28;i++) {
    const x=noise(i*31+4)*384,y=40+noise(i*43+7)*48;
    glow(c,x,y,24+noise(i*17)*60,"#63857b",.04+noise(i*19)*.055);
  }
  return s;
}
function tint(source: HTMLCanvasElement, color: string) {
  const s=surface(source.width,source.height),c=s.getContext("2d")!;
  c.drawImage(source,0,0);c.globalCompositeOperation="source-in";c.fillStyle=color;c.fillRect(0,0,s.width,s.height);
  c.globalCompositeOperation="multiply";c.drawImage(source,0,0);
  c.globalCompositeOperation="destination-in";c.drawImage(source,0,0);return s;
}

export function createFactoryRenderer(canvas: HTMLCanvasElement) {
  const c=canvas.getContext("2d",{alpha:false});if(!c)return null;
  let width=1200,height=700,beltY=530,disposed=false,loaded=false;
  let plate: HTMLImageElement | undefined, beacon: HTMLImageElement | undefined;
  let redBeacon: HTMLCanvasElement | undefined;
  const background=surface(1,1),front=surface(1,1),lightLayer=surface(1,1),belt=surface(1,1);
  const optics=createFactoryOptics(),rotor=createBeaconRotor(),fog=atmosphereTexture();
  const cargo:HTMLCanvasElement[]=[],warm:HTMLCanvasElement[]=[],shadows:HTMLCanvasElement[]=[];
  const weaves=Array.from({length:12},(_,i)=>specimenWeave(specimenSlots[i],cargoFor(i).seed));
  let count=0,totalMs=0,maxMs=0,burstCycle=-1,burstCarrier:number|null=null;
  function build() {
    background.width=front.width=Math.ceil(width);background.height=front.height=Math.ceil(height);
    lightLayer.width=Math.ceil(width*.8);lightLayer.height=Math.ceil(height*.8);
    const b=background.getContext("2d")!,f=front.getContext("2d")!;
    b.fillStyle="#020504";b.fillRect(0,0,width,height);
    if(!plate)return;
    const factor=plate.naturalWidth/1536, span=Math.max(1150,width),left=(width-span)/2;
    const depth=span/1536;
    b.drawImage(plate,0,0,1536*factor,570*factor,left,beltY-18-570*depth,span,570*depth);
    // Keep navigation in black; the foundry emerges only around the production line.
    b.fillStyle=gradient(b,0,Math.min(beltY-165,height*.55),0,beltY-20,[[0,"#020504"],[.15,"#020504fa"],[.45,"#020504c0"],[.83,"#02050430"],[1,"#02050400"]]);
    b.fillRect(0,0,width,beltY-20);
    const lowerHeight=height-beltY-22;
    f.drawImage(plate,0,615*factor,1536*factor,Math.min(409,lowerHeight/.72)*factor,left,beltY+24,span,lowerHeight);
    f.fillStyle=gradient(f,0,height-85,0,height,[[0,"#02050400"],[1,"#020504dd"]]);f.fillRect(0,height-85,width,85);
    belt.width=Math.round(span);belt.height=45;
    belt.getContext("2d")!.drawImage(plate,0,570*factor,1536*factor,45*factor,0,0,span,45);
  }
  const compact=window.innerWidth<=640;
  const ready=loadFactoryArt(compact).then(([scene,atlas,lamp])=>{
    if(disposed)return false;
    const start=performance.now();plate=scene;beacon=lamp;
    redBeacon=surface(lamp.naturalWidth,lamp.naturalHeight);
    const ruby=redBeacon.getContext("2d")!;ruby.filter="hue-rotate(-38deg) saturate(1.4)";ruby.drawImage(lamp,0,0);
    const cell=atlas.naturalWidth/3;
    const size=compact?256:420;
    for(let v=0;v<6;v++) {
      const s=surface(size,size),ctx=s.getContext("2d")!;
      ctx.drawImage(atlas,(v%3)*cell,Math.floor(v/3)*cell,cell,cell,0,specimenLift(v)/512*size,size,size);
      ctx.save();ctx.scale(size/210,size/210);ctx.translate(105,172);paintSpecimenFibres(ctx,specimenWeave(v,0));ctx.restore();
      cargo.push(s);warm.push(tint(s,"#ff563c"));shadows.push(tint(s,"#000"));
    }
    loaded=true;build();canvas.dataset.art="lattice-forge";
    canvas.dataset.bakeMs=(performance.now()-start).toFixed(2);return true;
  }).catch(()=>{canvas.dataset.art="unavailable";return false;});
  function resize(cssWidth:number,cssHeight:number) {
    const artScale=cssWidth<=640 && cssHeight<480 ? Math.max(.42,(cssHeight-140)/400) : cssWidth<=640 ? Math.max(.68,Math.min(.92,(cssHeight-100)/780)) : cssHeight>cssWidth*1.1 ? Math.min(1.2,cssHeight/840) : Math.max(.64,Math.min(1,cssWidth/1050,cssHeight/600));
    width=Math.min(1800,cssWidth/artScale);height=cssHeight/artScale;beltY=height-154;
    const resolution=Math.min(1.5,2100/cssWidth,1400/cssHeight);
    canvas.width=Math.round(cssWidth*resolution);canvas.height=Math.round(cssHeight*resolution);build();
  }
  function draw(d:Drive,still=false) {
    if(!loaded || disposed)return;
    const start=performance.now(),t=d.time,jammed=d.status==="jammed";
    c!.setTransform(canvas.width/width,0,0,canvas.height/height,0,0);c!.drawImage(background,0,0);
    const lampX=width*.5,lampY=height-72,orbit=stepBeaconRotor(rotor,t,jammed,still),{phase,angle}=orbit;
    const alarm=jammed?Math.min(1,d.stateAge/.5):d.status==="restarting"?Math.max(0,1-d.stateAge/1.2):0;
    const strain=jammed?jamStrain(d.stateAge,still):0,travel=d.distance+strain*1.7;
    const spacing=221,first=Math.floor((-travel-120)/spacing),last=Math.ceil((width-travel+120)/spacing);
    const beam=(x:number,y:number)=>Math.pow(Math.max(0,Math.cos(Math.atan2(x-lampX,lampY-y)-angle)),18);
    // Atmosphere lies behind the specimens and in front of distant architecture.
    c!.save();c!.globalCompositeOperation="screen";
    glow(c!,width*.23,beltY-68,250,"#287d7927",.8+Math.sin(t*.27)*.08);
    glow(c!,width*.84,beltY-29,185,"#c375282c",.9+Math.sin(t*.91)*.06);
    for(let i=0;i<3;i++) {
      const drift=still?0:Math.sin(t*.07+i*2)*48;
      c!.globalAlpha=.32;c!.drawImage(fog,i*width/2-190+drift,beltY-190+i*22,590,148);
    }
    c!.restore();
    const l=lightLayer.getContext("2d")!;
    l.setTransform(lightLayer.width/width,0,0,lightLayer.height/height,0,0);l.clearRect(0,0,width,height);
    l.save();l.translate(lampX,lampY);l.rotate(angle);
    const reach=Math.hypot(width,height)*1.3;
    // Crossfade warm idle and vermilion alarm optics without a colour pop.
    l.globalAlpha=.35*(1-alarm);l.drawImage(optics.amberFan,-reach*.65,-reach,reach*1.3,reach);
    l.globalAlpha=alarm;l.drawImage(optics.redFan,-reach*.54,-reach,reach*1.08,reach);
    l.rotate(Math.PI);l.globalAlpha=alarm*.1;l.drawImage(optics.redFan,-reach*.6,-reach,reach*1.2,reach);l.restore();
    l.save();l.globalCompositeOperation="destination-out";l.beginPath();l.rect(0,0,width,beltY);l.clip();
    for(let i=first;i<=last;i++) {
      const x=i*spacing+travel,slot=((i%12)+12)%12,q=cargoFor(i);
      l.save();l.translate(x,beltY+20);l.transform(1,0,-(x-lampX)/height*.5,1,0,0);l.globalAlpha=.9;
      l.drawImage(shadows[specimenSlots[slot]],-105*q.scale,-height*1.625*q.scale,210*q.scale,height*1.8*q.scale);l.restore();
    }
    l.restore();c!.save();c!.globalCompositeOperation="screen";c!.drawImage(lightLayer,0,0,width,height);c!.restore();
    // The image-based tread and every specimen use the same drive distance.
    const offset=((travel%belt.width)+belt.width)%belt.width;
    for(let x=offset-belt.width;x<width;x+=belt.width)c!.drawImage(belt,x,beltY-18);
    const discharge=neuralDischarge(t,still);
    if(discharge.cycle!==burstCycle){burstCycle=discharge.cycle;burstCarrier=null;}
    if(discharge.strength>0 && burstCarrier===null){const a=Math.ceil(-d.distance/spacing),b=Math.floor((width-d.distance)/spacing);burstCarrier=a+Math.floor(discharge.choice*(b-a+1));}
    const kick=d.status==="restarting"?Math.sin(d.stateAge*36)*Math.exp(-d.stateAge*3):jammed?strain*.6:0;
    for(let i=first;i<=last;i++) {
      const x=i*spacing+travel,q=cargoFor(i),slot=((i%12)+12)%12;
      const chatter=still?0:Math.sin(t*24+i*1.7)*Math.min(.35,d.velocity/150)+kick*1.6;
      c!.save();c!.translate(x,beltY+chatter);c!.scale(q.scale,q.scale);
      const contact=c!.createRadialGradient(0,0,3,0,0,95);contact.addColorStop(0,"#000d");contact.addColorStop(1,"#0000");
      c!.save();c!.translate(0,23);c!.scale(1,.15);c!.fillStyle=contact;c!.fillRect(-100,-100,200,200);c!.restore();
      c!.drawImage(cargo[specimenSlots[slot]],-105,-172,210,210);
      const incident=beam(x,beltY-55)*alarm;
      if(incident>.015){c!.save();c!.globalCompositeOperation="screen";c!.globalAlpha=incident*.68;c!.drawImage(warm[specimenSlots[slot]],-105,-172,210,210);c!.restore();}
      drawNeuralSignals(c!,weaves[slot],t,still,i===burstCarrier?discharge:null);
      c!.restore();
    }
    c!.drawImage(front,0,0);
    c!.save();c!.globalCompositeOperation="screen";
    const specX=lampX+orbit.lateral*width*.7;
    glow(c!,specX,beltY+63,jammed?380:170,jammed?"#ff351f62":"#b5831812",.25+Math.max(0,-orbit.depth)*.75);
    // A low cyan reflection anchors pulses to the oily carrying surface.
    glow(c!,width*.25,beltY+23,170,"#236f6c14");c!.restore();
    // Fixed iron cage and fluted glass, with a reflector travelling through
    // one full orbit around its upright spindle. No rocking housing.
    const by=height-75;
    c!.beginPath();c!.moveTo(lampX+25,by+53);c!.bezierCurveTo(lampX+95,by+66,lampX+92,by-7,lampX+163,by-7);
    c!.strokeStyle="#030605";c!.lineWidth=6;c!.stroke();c!.strokeStyle="#56644855";c!.lineWidth=1;c!.stroke();
    if(beacon)c!.drawImage(beacon,lampX-36,by-46,72,112);
    if(redBeacon && alarm>0){c!.save();c!.globalAlpha=alarm;c!.drawImage(redBeacon,lampX-36,by-46,72,112);c!.restore();}
    c!.save();c!.beginPath();c!.roundRect(lampX-22,by-28,44,57,15);c!.clip();c!.globalCompositeOperation="screen";
    const bulbX=lampX+orbit.lateral*13;
    const facing=.1+.9*Math.max(0,orbit.depth);
    ellipse(c!,bulbX,by+3,2+Math.abs(orbit.depth)*8,24,gradient(c!,bulbX-12,0,bulbX+12,0,[[0,"#ff853400"],[.5,jammed?"#ffc6a6cb":"#eab97636"],[1,"#ff853400"]]));
    glow(c!,bulbX,by+2,32,jammed?"#ff321fff":"#efa14d4a",facing);
    line(c!,[bulbX,by-13,bulbX,by+22],jammed?`rgba(255,186,135,${facing*.9})`:`rgba(234,191,128,${facing*.45})`,1.6);
    c!.restore();
    // Cage occlusion remains in front of the rotating reflector.
    line(c!,[lampX,by-43,lampX,by+31],"#17201ccc",2);
    line(c!,[lampX-24,by-18,lampX+24,by-18],"#111a15aa",2);
    optics.drawGlare(c!,width,height,lampX,by+3,orbit,alarm);
    const impact=jammed?d.stateAge%2.8:d.status==="restarting"?d.stateAge:10;
    if(!still && impact<.55)for(let i=0;i<8;i++) {
      const vx=(noise(i*67)-.5)*180,vy=-40-noise(i*89)*95;
      const sx=width*.75+vx*impact,sy=beltY+52+vy*impact+170*impact*impact;
      line(c!,[sx-vx*.018,sy-vy*.012,sx,sy],`rgba(255,${180-Math.round(impact*100)},65,${1-impact/.75})`,.7+noise(i)*.5);
    }
    if(!still)for(let i=0;i<18;i++) {
      const px=(noise(i*39)*width+t*(1+noise(i)*2))%width,py=beltY-25-noise(i*47)*150+Math.sin(t*.4+i)*5;
      ellipse(c!,px,py,.35+noise(i)*.55,.35+noise(i)*.55,`rgba(161,172,149,${.08+beam(px,py)*.25})`);
    }
    const ms=performance.now()-start;totalMs+=ms;maxMs=Math.max(maxMs,ms);count++;
    if(count%60===0){canvas.dataset.beaconPhase=(phase%TAU).toFixed(3);canvas.dataset.beaconSpeed=rotor.speed.toFixed(2);canvas.dataset.strain=strain.toFixed(2);canvas.dataset.drawMeanMs=(totalMs/count).toFixed(2);canvas.dataset.drawMaxMs=maxMs.toFixed(2);canvas.dataset.distance=d.distance.toFixed(2);canvas.dataset.frames=String(count);}
  }
  return {ready,resize,draw,dispose(){disposed=true;optics.dispose();[background,front,lightLayer,belt,fog,...cargo,...warm,...shadows,...(redBeacon?[redBeacon]:[])].forEach(s=>{s.width=0;s.height=0;});}};
}

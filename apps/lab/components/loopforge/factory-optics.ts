import type { beaconOrbit } from './factory-light';
type Ctx = CanvasRenderingContext2D;
function surface(w: number, h: number) {
  const canvas = document.createElement('canvas'); canvas.width=w; canvas.height=h;
  return canvas;
}
/** Baked optics: only blits/transforms/opacity run each frame. */
export function createFactoryOptics() {
  function fan(alarm: boolean) {
    const s=surface(384,768),c=s.getContext('2d')!;
    for(let y=0;y<s.height;y++) {
      const d=(s.height-y)/s.height, half=d*188+2;
      const g=c.createLinearGradient(192-half,0,192+half,0);
      const falloff=.48+.52*(1-d);
      const stops=alarm
        ? [[0,0],[.12,.03],[.32,.18],[.43,.4],[.475,.67],[.5,.82],[.525,.67],[.57,.4],[.68,.18],[.88,.03],[1,0]]
        : [[0,0],[.18,.03],[.4,.12],[.5,.23],[.6,.12],[.82,.03],[1,0]];
      for(const [at,a] of stops) g.addColorStop(at,`rgba(${alarm?'255,43,29':'207,137,59'},${a*falloff})`);
      c.fillStyle=g;c.fillRect(192-half,y,half*2,1);
    }
    return s;
  }
  function flare(red: boolean) {
    const halo=surface(256,256),c=halo.getContext('2d')!;
    const g=c.createRadialGradient(128,128,0,128,128,128);
    const rgb=red?'255,44,28':'255,168,65';
    g.addColorStop(0,'#fff3dc');g.addColorStop(.025,'#ffe1be');
    g.addColorStop(.08,`rgba(${rgb},.78)`);g.addColorStop(.2,`rgba(${rgb},.28)`);
    g.addColorStop(.48,`rgba(${rgb},.09)`);g.addColorStop(1,`rgba(${rgb},0)`);
    c.fillStyle=g;c.fillRect(0,0,256,256);
    const streak=surface(1024,64),s=streak.getContext('2d')!;
    for(let y=0;y<64;y++) {
      const dy=Math.abs(y-31.5), core=Math.exp(-dy*1.45), skirt=Math.exp(-dy*.16)*.13;
      const h=s.createLinearGradient(0,0,1024,0);
      for(const [at,power] of [[0,0],[.13,.025],[.35,.16],[.485,.58],[.5,1],[.515,.58],[.65,.16],[.87,.025],[1,0]])
        h.addColorStop(at,`rgba(${dy<1.5?'255,235,208':rgb},${(core+skirt)*power})`);
      s.fillStyle=h;s.fillRect(0,y,1024,1);
    }
    const ghost=surface(128,128),gc=ghost.getContext('2d')!;
    const ring=gc.createRadialGradient(64,64,0,64,64,64);
    ring.addColorStop(0,'transparent');ring.addColorStop(.66,`rgba(${rgb},.008)`);
    ring.addColorStop(.82,`rgba(${rgb},.1)`);ring.addColorStop(.9,`rgba(${rgb},.03)`);ring.addColorStop(1,'transparent');
    gc.fillStyle=ring;gc.fillRect(0,0,128,128);
    return {halo,streak,ghost};
  }
  const redFan=fan(true),amberFan=fan(false),red=flare(true),amber=flare(false);
  return {
    redFan,amberFan,
    /** Lens response is tied to the forward-facing reflector, not a timer flash. */
    drawGlare(c:Ctx,width:number,height:number,x:number,y:number,orbit:ReturnType<typeof beaconOrbit>,alarm:number) {
      const shoulder=Math.pow(Math.max(0,orbit.depth),5),core=orbit.facing;
      if(shoulder<.002)return;
      const art=alarm>.1?red:amber, power=.18+.82*alarm;
      const bulb=x+orbit.lateral*13;
      c.save();c.globalCompositeOperation='screen';
      const radius=90+alarm*115;
      c.globalAlpha=shoulder*power;c.drawImage(art.halo,bulb-radius,y-radius,radius*2,radius*2);
      c.globalCompositeOperation='lighter';
      c.globalAlpha=core*power;c.drawImage(art.streak,0,y-20,width,40);
      c.drawImage(art.streak,0,y-8,width,16);
      c.globalCompositeOperation='screen';
      c.globalAlpha=core*power*.2;c.drawImage(art.streak,width*.15,y-9,width*.7,10);
      // Restrained diffraction needles remain attached to the bulb.
      c.save();c.translate(bulb,y);c.rotate(-.19);
      c.globalAlpha=core*power*.55;c.drawImage(art.streak,-75,-5,150,10);
      c.rotate(Math.PI/2);c.globalAlpha*=.32;c.drawImage(art.streak,-56,-3,112,6);c.restore();
      // Internal reflections track the source-to-optical-centre axis.
      for(let i=0;i<3;i++) {
        const k=.55+i*.58,gy=y+(height*.42-y)*k,gx=bulb+(width*.48-bulb)*k;
        const r=23+i*26;
        c.globalAlpha=shoulder*power*(.45-i*.07);c.drawImage(art.ghost,gx-r*1.35,gy-r,r*2.7,r*2);
      }
      c.restore();
    },
    dispose(){[redFan,amberFan,...Object.values(red),...Object.values(amber)].forEach(s=>{s.width=0;s.height=0;});}
  };
}

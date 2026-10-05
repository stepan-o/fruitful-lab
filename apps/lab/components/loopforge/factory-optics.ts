import { beamVariation, type beaconOrbit } from './factory-light';
export const alarmPalette={hot:'#ff1830',rgb:'255,24,48',edge:'#a1071b',core:'#fff1d9',material:'#ff3c42'} as const;
type Ctx = CanvasRenderingContext2D;
function surface(w: number, h: number) {
  const canvas = document.createElement('canvas'); canvas.width=w; canvas.height=h;
  return canvas;
}
/** Baked optics: only blits/transforms/opacity run each frame. */
export function createFactoryOptics() {
  function fan(alarm: boolean, variant: number) {
    const s=surface(384,768),c=s.getContext('2d')!;
    for(let y=0;y<s.height;y++) {
      const d=(s.height-y)/s.height;
      // Distorted glass produces an uneven envelope and fine refractive lanes.
      // Every displacement collapses at the emitter; the beam stays attached.
      const ripple=Math.sin(y*.024+variant*2.1)*3+Math.sin(y*.067+variant)*1.1;
      const center=192+ripple*d*d,half=(188+ripple*1.4)*d+1;
      const g=c.createLinearGradient(center-half,0,center+half,0);
      const falloff=(.62+.38*(1-d))*(.96+.04*Math.sin(y*.039+variant));
      const stops=alarm
        ? [[0,0],[.10,.025],[.26,.17],[.38,.32],[.435,.55],[.46,.46],[.485,.86],[.51,.95],[.533,.61],[.558,.67],[.62,.34],[.75,.12],[.91,.025],[1,0]]
        : [[0,0],[.18,.025],[.37,.1],[.46,.16],[.51,.26],[.56,.19],[.64,.11],[.82,.025],[1,0]];
      for(const [at,a] of stops) g.addColorStop(at,`rgba(${alarm?alarmPalette.rgb:'207,137,59'},${a*falloff})`);
      c.fillStyle=g;c.fillRect(center-half,y,half*2,1);
    }
    return s;
  }
  function flare(red: boolean) {
    const halo=surface(256,256),c=halo.getContext('2d')!;
    const g=c.createRadialGradient(128,128,0,128,128,128);
    const rgb=red?alarmPalette.rgb:'255,168,65';
    g.addColorStop(0,alarmPalette.core);g.addColorStop(.025,red?'#ffb6a0':'#ffe1be');
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
  const redFans=[fan(true,0),fan(true,1)],amberFans=[fan(false,0),fan(false,1)],red=flare(true),amber=flare(false);
  return {
    drawBeam(c:Ctx,x:number,y:number,angle:number,reach:number,alarm:number,time:number,still:boolean) {
      const variation=beamVariation(time,still);
      c.save();c.translate(x,y);c.rotate(angle);c.scale(variation.width,1);c.globalCompositeOperation="lighter";
      for(let i=0;i<2;i++) {
        const blend=i?variation.mix:1-variation.mix;
        c.globalAlpha=.35*(1-alarm)*blend*variation.power;
        c.drawImage(amberFans[i],-reach*.65,-reach,reach*1.3,reach);
        c.globalAlpha=alarm*blend*variation.power;
        c.drawImage(redFans[i],-reach*.54,-reach,reach*1.08,reach);
      }
      // Weak glass scatter behind the opaque reflector, not a second beam.
      c.rotate(Math.PI);c.globalAlpha=alarm*.045;c.drawImage(redFans[0],-reach*.6,-reach,reach*1.2,reach);
      c.restore();
    },
    /** Lens response is tied to the forward-facing reflector, not a timer flash. */
    drawGlare(c:Ctx,width:number,height:number,x:number,y:number,orbit:ReturnType<typeof beaconOrbit>,alarm:number) {
      const shoulder=Math.pow(Math.max(0,orbit.depth),5),core=orbit.facing;
      if(shoulder<.002)return;
      const art=alarm>.1?red:amber, power=.18+.82*alarm;
      const bulb=x;
      c.save();c.globalCompositeOperation='screen';
      const radius=90+alarm*115;
      c.globalAlpha=shoulder*power;c.drawImage(art.halo,bulb-radius,y-radius,radius*2,radius*2);
      c.globalCompositeOperation='lighter';
      c.globalAlpha=core*power;c.drawImage(art.streak,bulb-width*.5,y-20,width,40);
      c.drawImage(art.streak,bulb-width*.5,y-8,width,16);
      c.globalCompositeOperation='screen';
      c.globalAlpha=core*power*.2;c.drawImage(art.streak,bulb-width*.35,y-9,width*.7,10);
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
    dispose(){[...redFans,...amberFans,...Object.values(red),...Object.values(amber)].forEach(s=>{s.width=0;s.height=0;});}
  };
}

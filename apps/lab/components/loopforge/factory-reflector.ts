import { reflectorPose, type beaconOrbit } from './factory-light';
import { alarmPalette } from './factory-optics';
type Ctx = CanvasRenderingContext2D;

/** Small, cached metal faces. The rear is opaque: no second luminous aperture. */
export function createReflector() {
  function face(rear: boolean, alarm: boolean) {
    const s=document.createElement('canvas');s.width=96;s.height=160;
    const c=s.getContext('2d')!;c.translate(48,80);
    c.beginPath();c.ellipse(0,0,43,74,0,0,Math.PI*2);c.clip();
    const g=c.createRadialGradient(-13,-21,2,0,0,86);
    const colors=rear?['#778076','#303c36','#111b18','#080e0c']
      :alarm?['#fff5df','#ffb994',alarmPalette.hot,'#37070e']:['#fff0c7','#b99855','#554227','#101915'];
    colors.forEach((color,i)=>g.addColorStop(i/3,color));c.fillStyle=g;c.fillRect(-48,-80,96,160);
    // Pressed concentric ribs, interrupted machining marks and a rolled rim.
    for(let r=10;r<74;r+=8) {
      c.beginPath();c.ellipse(0,0,r*.58,r,0,0,Math.PI*2);
      c.strokeStyle=rear?'#070f0cc0':'#20090766';c.lineWidth=2;c.stroke();
      c.beginPath();c.ellipse(-.6,-1,r*.58,r,0,Math.PI,Math.PI*1.9);
      c.strokeStyle=rear?'#a6b1a44c':'#fff2d855';c.lineWidth=.8;c.stroke();
    }
    for(let i=0;i<28;i++) {
      const y=(i*47%137)-68,x=(i*19%67)-33;
      c.fillStyle=i%3?'#080e0c66':'#d3c5a33b';c.fillRect(x,y,3+i%6,.7);
    }
    if(rear) {
      c.fillStyle='#151e19';c.fillRect(-6,-47,12,94);
      c.fillStyle='#737969';c.fillRect(-5,-45,1,89);
      for(const y of [-43,43]){c.beginPath();c.arc(0,y,4,0,Math.PI*2);c.fillStyle='#928b70';c.fill();c.fillStyle='#182018';c.fillRect(-3,y-.7,6,1.4);}
    } else {
      c.fillStyle=alarm?alarmPalette.core:'#ffe0a3';c.fillRect(-2.5,-43,5,86);
      c.fillStyle=alarm?'#fff9eccc':'#ffc35a99';c.fillRect(-5,-36,10,72);
    }
    c.beginPath();c.ellipse(0,0,42,73,0,0,Math.PI*2);c.strokeStyle=rear?'#b4aa7b80':'#ffe2aacc';c.lineWidth=2;c.stroke();
    return s;
  }
  const back=face(true,false),front=face(false,false),hot=face(false,true);
  return {
    draw(c:Ctx,x:number,y:number,orbit:ReturnType<typeof beaconOrbit>,alarm:number) {
      const pose=reflectorPose(orbit),aperture=x+pose.apertureX,rear=x+pose.rearX;
      // The deep bowl has a side wall at quarter-turn. Its aperture and closed
      // back occupy different positions about the same vertical motor spindle.
      c.save();
      const body=c.createLinearGradient(Math.min(aperture,rear)-5,0,Math.max(aperture,rear)+5,0);
      body.addColorStop(0,'#09130f');body.addColorStop(.45,'#596352');body.addColorStop(.62,'#303e31');body.addColorStop(1,'#0c1611');
      c.beginPath();c.moveTo(aperture,y-23);c.bezierCurveTo(rear,y-24,rear,y-14,rear,y);
      c.bezierCurveTo(rear,y+14,rear,y+24,aperture,y+23);c.closePath();c.fillStyle=body;c.fill();
      const faceX=pose.front?aperture:rear,w=pose.width;
      c.drawImage(pose.front?front:back,faceX-w/2,y-25,w,50);
      if(pose.front && alarm>0){c.globalAlpha=alarm;c.drawImage(hot,faceX-w/2,y-25,w,50);}
      c.restore();
    },
    dispose(){for(const s of [back,front,hot])s.width=s.height=0;}
  };
}

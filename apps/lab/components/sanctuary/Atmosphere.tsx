"use client";
import { useEffect, useRef } from "react";
import styles from "./visuals.module.css";

export default function Atmosphere({enabled}:{enabled:boolean}) {
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas=ref.current,ctx=canvas?.getContext("2d");
    if(!canvas||!ctx)return;
    const motion=window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame=0,last=0,w=0,h=0;
    let sparks:{x:number;y:number;r:number;speed:number;phase:number}[]=[];
    function resize(){
      w=window.innerWidth;h=window.innerHeight;
      const scale=Math.min(window.devicePixelRatio||1,1.5);
      canvas!.width=Math.ceil(w*scale);canvas!.height=Math.ceil(h*scale);ctx!.setTransform(scale,0,0,scale,0,0);
      sparks=Array.from({length:Math.min(64,Math.round(w/20))},()=>({x:Math.random()*w,y:Math.random()*h,r:.5+Math.random()*1.6,speed:12+Math.random()*28,phase:Math.random()*6.28}));
    }
    function draw(time:number){
      frame=0;
      if(!enabled||motion.matches||document.hidden){ctx!.clearRect(0,0,w,h);return;}
      const elapsed=last?Math.min((time-last)/1000,.07):0;
      if(last&&time-last<32){frame=requestAnimationFrame(draw);return;}
      last=time;const t=time/1000;
      ctx!.clearRect(0,0,w,h);
      // Warm backlight appears between irregular shadow tongues, never over body copy.
      for(let i=0;i<7;i++){
        const x=w*(i/6)+Math.sin(t*.31+i)*45,heat=80+Math.sin(t*.57+i*2)*26;
        const glow=ctx!.createRadialGradient(x,h+25,0,x,h+25,Math.min(w*.28,260));
        glow.addColorStop(0,`rgba(205,55,10,${.15+Math.sin(t*.6+i)*.025})`);glow.addColorStop(.48,'rgba(115,27,8,.08)');glow.addColorStop(1,'rgba(0,0,0,0)');
        ctx!.fillStyle=glow;ctx!.fillRect(x-300,h-300,600,330);
        ctx!.fillStyle='rgba(6,8,8,.64)';ctx!.beginPath();ctx!.moveTo(x-60,h);
        ctx!.bezierCurveTo(x+35,h-heat*.5,x-30+Math.sin(t+i)*18,h-heat,x+Math.sin(t*.8+i)*22,h-heat*1.5);
        ctx!.bezierCurveTo(x+80,h-heat,x+20,h-heat*.3,x+60,h);ctx!.fill();
      }
      for(const p of sparks){
        p.y-=p.speed*elapsed;p.x+=Math.sin(t*.4+p.phase)*elapsed*7;
        if(p.y<-10){p.y=h+10;p.x=Math.random()*w;}
        const a=.25+Math.sin(t+p.phase)*.12;
        ctx!.fillStyle=`rgba(247,133,51,${a})`;ctx!.beginPath();ctx!.ellipse(p.x,p.y,p.r,p.r*1.8,.35,0,Math.PI*2);ctx!.fill();
        if(p.r>1.6){ctx!.fillStyle='rgba(249,87,23,.035)';ctx!.beginPath();ctx!.arc(p.x,p.y,7,0,Math.PI*2);ctx!.fill();}
      }
      frame=requestAnimationFrame(draw);
    }
    function sync(){cancelAnimationFrame(frame);frame=0;last=0;if(enabled&&!motion.matches&&!document.hidden)frame=requestAnimationFrame(draw);else ctx!.clearRect(0,0,w,h);}
    function onResize(){resize();sync();}
    resize();sync();window.addEventListener('resize',onResize);document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);
    return ()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',onResize);document.removeEventListener('visibilitychange',sync);motion.removeEventListener('change',sync);};
  },[enabled]);
  return <canvas ref={ref} className={styles.atmosphere} aria-hidden="true"/>;
}

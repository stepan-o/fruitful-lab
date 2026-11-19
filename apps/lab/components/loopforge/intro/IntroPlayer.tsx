'use client';
import {useEffect,useRef,useState} from 'react';
import {engine,envelope,reconstruct,schema,subscription,validEnvelope,type Frame} from '../../../lib/loopforge/intro/protocol';
import {paint,type Bank,type Camera,type Skin} from './paint';
import {Timing} from './metrics';
import styles from './intro.module.css';
const duration=190.60391778732966;
const timestamp=(s:number)=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
type Controls={toggle:()=>void;seek:(s:number)=>void;skin:(s:Skin)=>void;inspect:()=>void;metrics:()=>string};
export default function IntroPlayer(){
  const canvas=useRef<HTMLCanvasElement>(null),slider=useRef<HTMLInputElement>(null),clock=useRef<HTMLOutputElement>(null),controls=useRef<Controls|null>(null);
  const [ready,setReady]=useState(false),[playing,setPlaying]=useState(false),[skin,setSkin]=useState<Skin>('sprites');
  const [metrics,setMetrics]=useState('');
  const [beat,setBeat]=useState('The morning walk'),[speech,setSpeech]=useState(''),[failure,setFailure]=useState(''),[trace,setTrace]=useState<string[]>([]);
  useEffect(()=>{
    const surface=canvas.current!,ctx=surface.getContext('2d',{alpha:false});
    if(!ctx){setFailure('Canvas is unavailable in this browser.');return;}
    const worker=new Worker(new URL('../../../lib/loopforge/intro/host.worker.ts',import.meta.url),{type:'module'});
    const begun=performance.now(),cadence=new Timing(),drawing=new Timing(),response=new Timing();
    let costs:number[]=[],inputAt=0,cold=0,lastActiveFrame=0;
    let live=true,frame:Frame|null=null,previous:Frame|null=null,bank:Bank|undefined,mode:Skin='sprites',seq=0,raf=0;
    let received=0,elapsed=0,running=false,lastBeat='',lastSpeech='',width=0,height=0,lastDraw=0,needsDraw=true;
    let desiredHint='PAUSE';
    let session='hello',finished=false,recovering=false;
    const cam:Camera={x:0,y:0,scale:0,time:-1};
    const send=(type:string,p:object)=>worker.postMessage(envelope(type,++seq,p));
    const command=(hint:string)=>{desiredHint=hint;inputAt=performance.now();send('INPUT_COMMAND',{client_cmd_id:'view-'+(seq+1),tick_target:(frame?.tick??0)+(running&&!finished?1:0),cmd:{type:'VIEW_CONTROL',payload:{hint}}});};
    function requestDraw(){needsDraw=true;if(!raf&&live)raf=requestAnimationFrame(draw);}
    function draw(time:number){
      raf=0;
      if(frame&&bank&&(needsDraw||running)){
        const alpha=Math.min(1,Math.max(0,(time-received)/50));
        ctx!.setTransform(surface.width/width,0,0,surface.height/height,0,0);
        paint(ctx!,width,height,frame,elapsed,bank,mode,cam,Math.min(.2,(time-lastDraw)/1000),previous??undefined,alpha);
        if(finished){ctx!.fillStyle='rgba(4,8,10,.94)';ctx!.fillRect(0,0,width,height);ctx!.fillStyle='#e9d4a6';ctx!.font='600 18px monospace';ctx!.textAlign='center';ctx!.fillText('END OF SHIFT',width/2,height/2);}
        const done=performance.now();
        drawing.add(done-time);
        if(running&&lastActiveFrame)cadence.add(time-lastActiveFrame);
        lastActiveFrame=running?time:0;
        if(inputAt){response.add(done-inputAt);inputAt=0;}
        if(!cold)cold=done-begun;
        lastDraw=time;needsDraw=false;
      }
      if(running&&!document.hidden)raf=requestAnimationFrame(draw);
    }
    const resize=new ResizeObserver(()=>{
      const rect=surface.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);
      const ratio=Math.min(window.devicePixelRatio||1,1.5);surface.width=Math.round(width*ratio);surface.height=Math.round(height*ratio);requestDraw();
    });
    resize.observe(surface);
    async function load(){
      const res=await fetch('/loopforge-intro/sprites.json');if(!res.ok)throw Error('The sprite register could not be loaded.');
      const art:Bank['art']=await res.json(),images:Bank['images']={};
      await Promise.all(Object.keys(art.sheets).map(async key=>{const img=new Image();img.src='/loopforge-intro/'+key+'.webp';await img.decode();images[key]=img;}));
      if(!live)return;bank={art,images};setReady(!!frame);requestDraw();
    }
    load().catch(e=>{if(live)setFailure(String(e));});
    worker.onerror=e=>{setFailure(e.message||'The simulation worker could not start.');setReady(false);};
    worker.onmessage=({data:m})=>{
      if(!live)return;
      if(m.local==='failure'){setFailure(m.message);setReady(false);return;}
      if(m.local==='trace'){setTrace(m.rows.map((r:{tick:number;actor:string;goal:string;plan:string;reason:string})=>[r.tick,r.actor,r.goal,r.plan,r.reason].join(' · ')));return;}
      if(m.local==='overlay'){
        elapsed=m.seconds;finished=m.finished;costs=m.costs;
        if(running!==m.playing){running=m.playing;setPlaying(running);}
        if(lastBeat!==m.beat){lastBeat=m.beat;setBeat(lastBeat);}
        if(clock.current)clock.current.value=timestamp(elapsed)+' / 3:10';
        if(slider.current&&document.activeElement!==slider.current)slider.current.value=String(elapsed);
        requestDraw();return;
      }
      if(!validEnvelope(m)){setFailure('Invalid session envelope.');return;}
      switch(m.msg_type){
        case 'KERNEL_HELLO':
          if(session!=='hello'||m.payload.engine_name!==engine||m.payload.schema_version!==schema){setFailure('Incompatible engine.');return;}
          session='subscribing';send('SUBSCRIBE',subscription);break;
        case 'SUBSCRIBED':
          if(session!=='subscribing'){setFailure('Unexpected subscription.');return;}
          session='live';break;
        case 'DESYNC_CONFIRMED':recovering=true;break;
        case 'FULL_SNAPSHOT':case 'FRAME_DIFF':
          if(session!=='live'||(recovering&&m.msg_type==='FRAME_DIFF'))return;
          try{
            const next=reconstruct(frame,m);previous=m.msg_type==='FRAME_DIFF'?frame:null;frame=next;received=performance.now();recovering=false;
            if(!previous){cam.scale=0;setReady(!!bank);worker.postMessage({local:'applied',tick:frame.tick,hash:frame.hash});}
            const lines=frame.state.events.map(e=>e.speaker+' · '+e.text).join('\n');
            if(lines!==lastSpeech){lastSpeech=lines;setSpeech(lines);}
            requestDraw();
          }catch{if(!recovering){recovering=true;send('DESYNC_REPORT',{tick:frame?.tick??0,issue:'TICK_GAP'});}}
          break;
        case 'COMMAND_ACCEPTED':break;
        case 'COMMAND_REJECTED':if(m.payload.reason==='STALE_TICK'){command(desiredHint);break;}
        case 'ERROR':setFailure(String(m.payload.message??m.payload.reason));break;
        default:setFailure('Unsupported session message.');
      }
    };
    controls.current={toggle(){if(finished){worker.postMessage({local:'restart-play'});return;}command(running?'PAUSE':'PLAY');},
      seek(seconds){worker.postMessage({local:'locate',seconds});},
      metrics(){return JSON.stringify({viewport:[width,height],backingPixels:[surface.width,surface.height],coldMountToDrawMs:cold,frameIntervals:cadence.result(),drawSubmission:drawing.result(),inputToNextDraw:response.result(),workerTotalMs:{simulation:costs[0],deliberation:costs[1],projectionAndHash:costs[2]},images:Object.keys(bank?.images??{}).length,workers:1,heapEstimate:(performance as Performance&{memory?:{usedJSHeapSize:number}}).memory?.usedJSHeapSize},null,2);},
      skin(next){inputAt=performance.now();mode=next;cam.scale=0;requestDraw();},inspect(){worker.postMessage({local:'inspect'});}};
    const hidden=()=>{if(document.hidden&&running)command('PAUSE');};document.addEventListener('visibilitychange',hidden);
    send('VIEWER_HELLO',{viewer_name:'sprite-review',viewer_version:'1.0.0',supported_schema_versions:[schema],supports:{diff_stream:true,full_snapshot:true,replay_seek:false}});
    return ()=>{live=false;controls.current=null;resize.disconnect();cancelAnimationFrame(raf);worker.terminate();document.removeEventListener('visibilitychange',hidden);};
  },[]);
  return <main className={styles.page}>
    <header><a href="/stepanoskin/loopforge/design#day-one-intro">← Game design</a><span>LOOPFORGE</span></header>
    <section className={styles.console} aria-label="Day One live player">
      <div className={styles.title}><div><small>FACTORY FLOOR</small><h1>Day One</h1></div><p>{beat}</p></div>
      <canvas ref={canvas} className={styles.surface} aria-label="Live factory floor with character names and speech bubbles"/>
      <span className={styles.sr} aria-live="polite">{speech}</span>
      {failure&&<p role="alert">{failure}</p>}
      <div className={styles.controls}><button disabled={!ready} onClick={()=>controls.current?.toggle()}>{playing?'Pause':ready?'Play':'Loading…'}</button>
        <button disabled={!ready} onClick={()=>{if(slider.current)slider.current.value='0';controls.current?.seek(0);}}>Restart</button>
        <input ref={slider} aria-label="Scene time" type="range" min="0" max={duration} step=".05" defaultValue="0" onChange={e=>{if(clock.current)clock.current.value=timestamp(Number(e.target.value))+' / 3:10';}} onPointerUp={e=>controls.current?.seek(Number(e.currentTarget.value))} onKeyUp={e=>controls.current?.seek(Number(e.currentTarget.value))}/>
        <output ref={clock}>0:00 / 3:10</output>
        <label>View <select value={skin} onChange={e=>{const next=e.target.value as Skin;setSkin(next);controls.current?.skin(next);}}><option value="sprites">Pixel art</option><option value="model">3D study</option></select></label>
      </div>
    </section>
    <details className={styles.notes}><summary>Production notes and agent trace</summary><p><a href="/loopforge-intro/day-one-1x.mp4">Watch the normal-speed capture</a></p><p>bob and max use the delivered walk cycles. LIMEN and STILETTO use the fourth-check drawings. The eight other workers share bob’s walk as a temporary body, with colored arm bands. The 3D study shows the same session as projected solids.</p><button onClick={()=>controls.current?.inspect()}>Inspect recent decisions</button> <button onClick={()=>setMetrics(controls.current?.metrics()??'')}>Playback measurements</button>{metrics&&<pre>{metrics}</pre>}{trace.length>0&&<pre>{trace.join('\n')}</pre>}</details>
  </main>;
}

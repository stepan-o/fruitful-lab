'use client';
import type {InspectionMotion,MotionVersion} from './motion-model';
import styles from './agent-test.module.css';
export default function MotionReviewControls({bank,choices,clipId,version,phase,running,speed,loop,ready,onClip,onVersion,onPlay,onSeek,onSpeed,onLoop}:{bank:InspectionMotion;choices?:InspectionMotion['clips'];clipId:string;version:MotionVersion;phase:number;running:boolean;speed:number;loop:boolean;ready:boolean;onClip:(id:string)=>void;onVersion:(version:MotionVersion)=>void;onPlay:(v:boolean)=>void;onSeek:(seconds:number)=>void;onSpeed:(n:number)=>void;onLoop:(v:boolean)=>void}){
 const clip=bank.clips.find(c=>c.id===clipId),duration=clip?.duration??0;
 return <section aria-label='Motion comparison'>
  <label>Animation<select disabled={!ready} value={clipId} onChange={e=>onClip(e.target.value)}><option value='Rest'>Neutral rig · A-pose</option>{(choices??bank.clips).map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
  <div className={styles.duo} role='group' aria-label='Motion version'>{(['Corrected','Source']as const).map(v=><button key={v} disabled={!ready||!(bank.versions??['Source','Corrected']).includes(v)} aria-pressed={version===v} onClick={()=>onVersion(v)}>{v==='Source'?'Original export':'Corrected'}</button>)}</div>
  <p className={styles.intent}>{bank.versions?.length===1?'New source audition. No costume, limb-contact or loop cleanup has been applied to this motion.':(clip?.approval??bank.approval)==='candidate'?'Compare the original export with the cleanup candidate at the same pose. Awaiting visual approval.':'Compare the untouched source with the approved corrected motion at the same pose.'}</p>
  <div className={styles.duo}><button className={styles.primary} disabled={!ready||!clip} onClick={()=>onPlay(!running)}>{running?'Pause animation':'Play animation'}</button><button disabled={!ready||!clip} onClick={()=>onSeek(0)}>First frame</button></div>
  <label>Animation frame<input type='range' min='0' max='1000' step='1' disabled={!ready||!clip} value={Math.round(phase*1000)} onChange={e=>onSeek(Number(e.target.value)/1000*duration)}/></label>
  <label>Time in seconds<input className={styles.timeInput} type='number' min='0' max={duration} step='.01' disabled={!ready||!clip} value={Number((phase*duration).toFixed(2))} onChange={e=>{const n=e.target.valueAsNumber;if(Number.isFinite(n))onSeek(n);}}/></label>
  <label>Playback speed<select disabled={!ready} value={speed} onChange={e=>onSpeed(Number(e.target.value))}><option value='.25'>¼ speed</option><option value='.5'>½ speed</option><option value='1'>Normal</option></select></label>
  <label className={styles.check}><input type='checkbox' disabled={!ready||!clip} checked={loop} onChange={e=>onLoop(e.target.checked)}/> Repeat clip</label>
  {clip&&<div className={styles.beats} aria-label='Costume review poses'>{clip.markers.map(m=><button key={m.label} disabled={!ready} onClick={()=>onSeek(m.time)}>{m.label} · {m.time.toFixed(2)} s</button>)}</div>}
  <p className={styles.intent}>{bank.note}</p><a href={bank.record}>Motion review record ↗</a>
 </section>;
}

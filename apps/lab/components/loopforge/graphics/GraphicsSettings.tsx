'use client';
import {useSyncExternalStore} from 'react';
import {DEFAULT_GRAPHICS,presetSettings,type GraphicsPreset,type GraphicsSettings as Settings} from '@/lib/loopforge/graphics/settings';
import {graphicsSnapshot,graphicsServerSnapshot,saveGraphics,subscribeGraphics} from '@/lib/loopforge/graphics/store';
import s from './graphics-settings.module.css';
export default function GraphicsSettings({expanded=false}:{expanded?:boolean}){
 const value=useSyncExternalStore(subscribeGraphics,graphicsSnapshot,graphicsServerSnapshot);
 function change(patch:Partial<Settings>){saveGraphics({...value,...patch,preset:'custom'});}
 return <details className={s.panel} open={expanded}><summary>Graphics & performance</summary>
  <div className={s.fields}>
   <label>Quality<select value={value.preset} onChange={e=>saveGraphics(e.target.value==='custom'?{...value,preset:'custom'}:presetSettings(e.target.value as GraphicsPreset,value.targetFps))}>{[['auto','Automatic'],['performance','Performance'],['balanced','Balanced'],['high','High'],['custom','Custom']].map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
   <label>Frame-rate target<select value={value.targetFps} onChange={e=>saveGraphics({...value,targetFps:Number(e.target.value) as 30|60})}><option value={30}>30 FPS</option><option value={60}>60 FPS</option></select></label>
   <label>Render resolution<select value={value.resolution} onChange={e=>change({resolution:e.target.value==='auto'?'auto':Number(e.target.value) as Settings['resolution']})}><option value='auto'>Automatic</option>{[1,.85,.75,.65,.5].map(n=><option value={n} key={n}>{n*100}%</option>)}</select></label>
   <label>Shadows<select value={value.preset==='auto'?'auto':value.shadows} disabled={value.preset==='auto'} onChange={e=>change({shadows:e.target.value as Settings['shadows']})}>{value.preset==='auto'&&<option value='auto'>Automatic for this view</option>}<option value='off'>Off</option><option value='low'>Simple</option><option value='full'>Full</option></select></label>
   <label className={s.check}><input type='checkbox' checked={value.bloom} disabled={value.preset==='auto'} onChange={e=>change({bloom:e.target.checked})}/> Glow halo</label>
   <label className={s.check}><input type='checkbox' checked={value.antialias} onChange={e=>change({antialias:e.target.checked})}/> Smooth edges</label>
  </div>
  <p>Saved on this browser. Automatic adjusts resolution and uses more detail for close inspection. Frame rates depend on the device. Character motion and light-emitting features remain intact.</p>
  <button onClick={()=>saveGraphics(DEFAULT_GRAPHICS)}>Restore automatic settings</button>
 </details>;
}

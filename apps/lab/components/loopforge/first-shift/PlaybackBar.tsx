import {seekSeconds,type Speed} from '../../../lib/loopforge/shifts/playback';
import css from './shift-floor.module.css';

type Props={
  clock:string;episode:string;paused:boolean;speed:Speed;canSeek:boolean;
  disabled?:boolean;
  onPlay:()=>void;onPause:()=>void;onSpeed:(speed:Speed)=>void;onSeek:(seconds:number)=>void;onMenu?:()=>void;
};
export default function PlaybackBar(p:Props){
  return <div className={css.toolbar} role="group" aria-label="Factory playback">
    <div className={css.readout}><span>{p.episode}</span><time className={css.clock} aria-label="Factory time">{p.clock}</time></div>
    <div className={css.transport}>
      <button aria-label="Rewind 10 seconds" title="Rewind 10 seconds" disabled={p.disabled||!p.canSeek} onClick={()=>p.onSeek(-seekSeconds)}>−10s</button>
      <button className={css.play} disabled={p.disabled} onClick={p.paused?p.onPlay:p.onPause}>{p.paused?'Play':'Pause'}</button>
      <button aria-label="Forward 10 seconds" title="Forward 10 seconds" disabled={p.disabled||!p.canSeek} onClick={()=>p.onSeek(seekSeconds)}>+10s</button>
      <div className={css.rates} role="group" aria-label="Playback speed">
        {([.5,1,2] as const).map(rate=><button key={rate} disabled={p.disabled} aria-label={rate+'× speed'} aria-pressed={p.speed===rate} onClick={()=>p.onSpeed(rate)}>{rate===.5?'½':rate}×</button>)}
      </div>
    </div>
    {p.onMenu&&<button className={css.menuButton} disabled={p.disabled} onClick={p.onMenu}>Main menu</button>}
  </div>;
}

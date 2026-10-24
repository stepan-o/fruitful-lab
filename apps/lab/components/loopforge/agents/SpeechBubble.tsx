import {memo,useMemo,type CSSProperties} from 'react';
import type {Bubble,Character} from '@/lib/loopforge/encounters/contract';
import {EMOTIONS,speechAccent,speechWords} from '@/lib/loopforge/encounters/speech-delivery';
import styles from './speech-bubble.module.css';

type Props={speech:Bubble;name:string;character:Character;playing:boolean;expressive:boolean};
/** A public performance. No inference from the agent's hidden stress or beliefs. */
export default memo(function SpeechBubble({speech,name,character,playing,expressive}:Props){
 const {delivery,age,text}=speech,tone=delivery?.tone??'plain';
 const words=useMemo(()=>speechWords(text,delivery),[text,delivery]);
 const emotion=delivery?.emotion?EMOTIONS[delivery.emotion]:undefined;
 const animate=playing&&expressive;
 // The encounter clock drives presentation: pause/seek never leaves a half-read sentence.
 const impact=animate?Math.max(0,1-age/.45):0;
 const tilt=tone==='outburst'?Math.sin(age*45)*impact*1.3:0;
 const scale=1+(tone==='outburst'?.055:.025)*impact;
 const style={'--voice-accent':speechAccent(tone),transform:`rotate(${tilt}deg) scale(${scale})`} as CSSProperties;
 return <div className={styles.voice} data-tone={tone} data-character={character} data-expressive={expressive} style={style}>
  <div className={styles.speaker}>{name}{expressive&&emotion&&<span className={styles.emotion} role='img' aria-label={emotion.label}>{emotion.glyph}</span>}</div>
  <div className={styles.balloon} data-speech-body>
   <span className={styles.accessible}>{text}</span>
   <span aria-hidden='true' className={styles.sentence}>{words.map((word,i)=><span key={i} className={word.stress&&expressive?styles.stress:styles.word} style={{opacity:animate&&age<word.at?0:1}}>{word.text}</span>)}</span>
  </div>
 </div>;
});

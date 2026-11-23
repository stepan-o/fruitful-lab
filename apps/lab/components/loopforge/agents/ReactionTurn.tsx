import type {CSSProperties} from 'react';
import {REACTION_ART,reactionOpacity,type TurnView} from '@/lib/loopforge/encounters/dialogue-turn';
import type {Character} from '@/lib/loopforge/encounters/contract';
import {frameSource} from './turn-presentation';
import styles from './speech-bubble.module.css';
export default function ReactionTurn({view,name,character='worker',reducedMotion=false,playing=false}:{view?:TurnView;name?:string;character?:Character;reducedMotion?:boolean;playing?:boolean}){if(view?.turn.kind!=='reaction-only')return null;const art=REACTION_ART[view.turn.reaction.visualId];if(!art)return null;return <div className={styles.reaction} data-reaction-turn={view.turn.id} data-event-id={view.eventId} data-event-tick={view.eventTick} aria-label={(name??view.turn.actorId)+': '+view.turn.reaction.accessibleLabel} role='img' style={{'--turn-frame':`url(${frameSource(character)})`,opacity:reactionOpacity(view,playing,reducedMotion)} as CSSProperties}><strong aria-hidden='true'>{name??view.turn.actorId}</strong><img src={art.src} width={120} height={96} alt=''/></div>;}

import type {ZoneId} from '../spatial/floor';
export const ENCOUNTER_VERSION='loopforge-encounters/1';
export const TICK_MS=50;
export type Point=readonly [number,number]; // Floor coordinates, millimetres; never renderer coordinates.
export type Character='worker'|'limen'|'stiletto'|'cathexis';
export type Motion='idle'|'listen'|'scratch'|'walk'|'threaten'|'settle'|'dismiss'|'guard'|'warn'|'strike'|'recoil'|'limp'|'fall'|'recover';
export type Value=string|number|boolean;
export type Belief={value:Value;source:string;mode:'observed'|'reported';tick:number};
export type Agent={id:string;name:string;character:Character;room:ZoneId;position:Point;yaw:number;beliefs:Record<string,Belief>;stress:number;trust:number;memory:string[]};
export type Condition={prop:string;heldBy:string;equals:boolean}|{agent:string;near:string;within:number}|{fact:string;equals:Value}|{agent:string;belief:string;equals:Value}|{agent:string;feeling:'trust'|'stress';atLeast:number};
/** Omitted observedBy preserves public encounter effects; [] commits private world truth. */
export type Effect={fact:string;value:Value;observedBy?:string[]}|{agent:string;stress?:number;trust?:number;remember?:string;observe?:{fact:string;value:Value}};
export type Delivery={tone:'plain'|'command'|'outburst'|'aside'|'hesitant'|'dry'|'warm';emotion?:'anger'|'nerves'|'doubt'|'relief'|'care';emphasis?:string[]};
export type Speech={delivery?:Delivery;channel?:'local'|'shout';speaker:string;to:string[];text:string;claim?:{fact:string;value:Value};act:'report'|'request'|'instruction'|'acknowledge'|'response';cause:string;seconds:number};
/** Presentation instructions contain no authority to award effects. Times are source seconds. */
export type MotionCue={clip:string;start?:number;rate?:number;loop?:boolean;blend?:number;rootMotion?:'preserve'};
/** Custody is world state. A renderer may display a card, but cannot transfer it. */
export type PropLocation={kind:'stowed';agent:string}|{kind:'hand';agent:string;socket:'left'|'right';grip?:'palm'|'edge'}|{kind:'floor';position:Point;yaw:number};
export type SceneProp={id:string;kind:'credential';owner:string;location:PropLocation;previous?:{location:PropLocation;tick:number}};
export type PropTransfer={prop:string;from:PropLocation;to:PropLocation;observedBy?:string[]};
export type Performance={agent:string;motion:Motion;to?:Point;yaw?:number;cue?:MotionCue};
export type SceneFraming='wide'|'interaction'|'approach'|'assembly'|'impact'|'passage'|'card'|'threshold'|'aftermath'|'conveyor-wide'|'intake'|'wash'|'belt'|'forge';
export type ProcessCue={station:'intake'|'wash'|'belt'|'forge';from:number;to:number;operator:{agent:string;position:Point;within:number}};
export type Phase={process?:ProcessCue;attention?:'flow'|'hold';inputLabel?:string;framing?:SceneFraming;id:string;ticks:number;perform:Performance[];say?:Speech[];effects?:Effect[];transfers?:PropTransfer[]};
export type Action={id:string;room:ZoneId;adjacentRoom?:ZoneId;additionalRooms?:ZoneId[];participants:string[];resources:string[];requires:Condition[];reason:string;phases:Phase[]};
export type Intent={id:string;action:string;initiator:string};
export type Active={intent:Intent;phase:number;start:number;origins:Record<string,Point>};
export type Event={id:string;tick:number;kind:'admitted'|'rejected'|'cancelled'|'completed'|'speech'|'heard'|'effect'|'prop-transferred';action:string;agent?:string;detail:string;speech?:Speech;until?:number};
export type World={version:typeof ENCOUNTER_VERSION;tick:number;sequence:number;agents:Record<string,Agent>;props?:Record<string,SceneProp>;facts:Record<string,Value>;resources:string[];held:Record<string,string>;active:Active[];done:string[];events:Event[]};
/** The planner only proposes. Authority, admission, clock and effects belong to the kernel. */
export interface Planner { propose(world:Readonly<World>):Intent[] }
/** A room's path/visibility service. Rehearsals use authored, collision-reviewed lanes. */
export interface SpatialServices { roomAt?(point:Point):ZoneId|undefined; connected(a:ZoneId,b:ZoneId,world:World):boolean; canTraverse(agent:Agent,to:Point,world:World):boolean; canHear(speaker:Agent,listener:Agent,world:World,channel?:Speech['channel']):boolean }
export type Registry=Record<string,Action>;
export type ActorView={id:string;name:string;character:Character;position:Point;yaw:number;motion:Motion;seconds:number;action:string;cue?:MotionCue;previous?:{cue:MotionCue;seconds:number;yaw?:number};blend?:number};
export type Bubble=Pick<Speech,'speaker'|'to'|'text'|'act'|'delivery'>&{id:string;age:number};
export type View={process?:{stage:number;output:number;active?:ProcessCue;progress:number};framing?:SceneFraming;tick:number;actors:ActorView[];props?:SceneProp[];bubbles:Bubble[];gateOpen:boolean;drive:Value;phase:string;finished:boolean};

import type {ZoneId} from '../spatial/floor';
export const ENCOUNTER_VERSION='loopforge-encounters/1';
export const TICK_MS=50;
export type Point=readonly [number,number]; // Floor coordinates, millimetres; never renderer coordinates.
export type Character='worker'|'limen'|'stiletto'|'cathexis';
export type Motion='idle'|'listen'|'scratch'|'walk'|'threaten'|'settle'|'dismiss'|'guard'|'warn'|'strike'|'recoil'|'limp';
export type Value=string|number|boolean;
export type Belief={value:Value;source:string;mode:'observed'|'reported';tick:number};
export type Agent={id:string;name:string;character:Character;room:ZoneId;position:Point;yaw:number;beliefs:Record<string,Belief>;stress:number;trust:number;memory:string[]};
export type Condition={fact:string;equals:Value}|{agent:string;belief:string;equals:Value}|{agent:string;feeling:'trust'|'stress';atLeast:number};
export type Effect={fact:string;value:Value}|{agent:string;stress?:number;trust?:number;remember?:string};
export type Speech={channel?:'local'|'shout';speaker:string;to:string[];text:string;claim?:{fact:string;value:Value};act:'report'|'request'|'instruction'|'acknowledge'|'response';cause:string;seconds:number};
export type Performance={agent:string;motion:Motion;to?:Point;yaw?:number};
export type Phase={id:string;ticks:number;perform:Performance[];say?:Speech[];effects?:Effect[]};
export type Action={id:string;room:ZoneId;adjacentRoom?:ZoneId;participants:string[];resources:string[];requires:Condition[];reason:string;phases:Phase[]};
export type Intent={id:string;action:string;initiator:string};
export type Active={intent:Intent;phase:number;start:number;origins:Record<string,Point>};
export type Event={id:string;tick:number;kind:'admitted'|'rejected'|'cancelled'|'completed'|'speech'|'heard'|'effect';action:string;agent?:string;detail:string;speech?:Speech;until?:number};
export type World={version:typeof ENCOUNTER_VERSION;tick:number;sequence:number;agents:Record<string,Agent>;facts:Record<string,Value>;resources:string[];held:Record<string,string>;active:Active[];done:string[];events:Event[]};
/** The planner only proposes. Authority, admission, clock and effects belong to the kernel. */
export interface Planner { propose(world:Readonly<World>):Intent[] }
/** A room's path/visibility service. Rehearsals use authored, collision-reviewed lanes. */
export interface SpatialServices { roomAt?(point:Point):ZoneId|undefined; connected(a:ZoneId,b:ZoneId,world:World):boolean; canTraverse(agent:Agent,to:Point,world:World):boolean; canHear(speaker:Agent,listener:Agent,world:World,channel?:Speech['channel']):boolean }
export type Registry=Record<string,Action>;
export type ActorView={id:string;name:string;character:Character;position:Point;yaw:number;motion:Motion;seconds:number;action:string};
export type Bubble={id:string;speaker:string;to:string[];text:string;act:Speech['act']};
export type View={tick:number;actors:ActorView[];bubbles:Bubble[];gateOpen:boolean;drive:Value;phase:string;finished:boolean};

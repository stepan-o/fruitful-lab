import {Intro} from './simulation';
import {editTick,lastTick,score,worldAt} from './floor';
import {projectIntro} from './projection';
import {channels,digest,engine,envelope,operations,renderSpec,schema,validEnvelope,type Envelope,type Frame} from './protocol';
export type HostMessage=Envelope|{local:'overlay';seconds:number;beat:string;finished:boolean;playing:boolean;costs:number[]}|{local:'trace';rows:Intro['trace']};
export class Session {
  deliberationMs=0;
  private fresh(){return new Intro(undefined,run=>{const start=performance.now();run();this.deliberationMs+=performance.now()-start;});}
  sim=this.fresh();
  state:'hello'|'subscribe'|'live'='hello';
  playing=false;
  awaitingBaseline=false;
  private seq=0;
  private frame:Frame|null=null;
  private accepted=new Map<string,{tick:number;hint:string}>();
  private hints=new Map<number,string[]>();
  simulationMs=0;
  serializeMs=0;
  constructor(readonly send:(m:HostMessage)=>void,readonly runId:string){}
  private post(type:string,payload:object){this.send(envelope(type,++this.seq,payload));}
  private error(message:string){this.post('ERROR',{code:'UNSUPPORTED',message,fatal:false});}
  async record(baseline=false){
    const start=performance.now(),tick=this.sim.world.tick,state=projectIntro(this.sim),hash=await digest(state);
    if(baseline||!this.frame){this.awaitingBaseline=true;this.post('FULL_SNAPSHOT',{schema_version:schema,tick,state,step_hash:hash});}
    else this.post('FRAME_DIFF',{schema_version:schema,from_tick:this.frame.tick,to_tick:tick,prev_step_hash:this.frame.hash,step_hash:hash,ops:operations(this.frame.state,state)});
    this.frame={tick,state,hash};this.serializeMs+=performance.now()-start;
  }
  applied(tick:number,hash:string){if(this.frame?.tick===tick&&this.frame.hash===hash)this.awaitingBaseline=false;}
  private advance(target:number){
    const start=performance.now();
    while(this.sim.world.tick<target){
      this.sim.step();
      const hints=this.hints.get(this.sim.world.tick)??[];
      for(const hint of hints)this.playing=hint==='PLAY'&&!this.sim.finished;
      this.hints.delete(this.sim.world.tick);
      if(hints.length&&!this.playing)break;
    }
    this.simulationMs+=performance.now()-start;
  }
  overlay(){
    const beat=score.beats.filter(b=>b.at<=worldAt(this.sim.world.tick)).at(-1)??score.beats[0];
    this.send({local:'overlay',seconds:this.sim.finished?score.duration:this.sim.seconds,beat:beat.name,finished:this.sim.finished,playing:this.playing,costs:[Math.max(0,this.simulationMs-this.deliberationMs),this.deliberationMs,this.serializeMs]});
  }
  async progress(seconds:number){
    if(this.state!=='live'||!this.playing||this.awaitingBaseline)return;
    const target=editTick(Math.min(score.duration,seconds));
    if(target-this.sim.world.tick>12){
      // Editorial cut / slow consumer. Run every hidden world tick, send one fresh baseline.
      this.advance(target);await this.record(true);
    }else while(this.playing&&this.sim.world.tick<target){this.advance(this.sim.world.tick+1);await this.record();}
    if(this.sim.finished)this.playing=false;
    this.overlay();
  }
  async locate(seconds:number){
    if(this.state!=='live'||!Number.isFinite(seconds)||seconds<0||seconds>score.duration+.001)return;
    const target=Math.min(lastTick,editTick(seconds));
    this.hints.clear();
    if(target<this.sim.world.tick)this.sim=this.fresh();
    this.advance(target);await this.record(true);this.overlay();
  }
  async receive(input:unknown){
    if(!validEnvelope(input))return this.error('Invalid KVP envelope');
    const p=input.payload;
    switch(input.msg_type){
      case 'VIEWER_HELLO':
        if(this.state!=='hello'||!Array.isArray(p.supported_schema_versions)||!p.supported_schema_versions.includes(schema)||typeof p.viewer_name!=='string'||typeof p.viewer_version!=='string')return this.error('Incompatible hello');
        this.state='subscribe';this.post('KERNEL_HELLO',{engine_name:engine,engine_version:'1.0.0',schema_version:schema,world_id:'16abc285-c29f-4b49-a9ea-be2864dac001',run_id:this.runId,seed:1,tick_rate_hz:20,time_origin_ms:0,render_spec:renderSpec});return;
      case 'SUBSCRIBE':
        if(this.state!=='subscribe'||p.stream!=='LIVE'||p.snapshot_policy!=='ON_JOIN'||p.diff_policy!=='DIFF_ONLY'||p.compression!=='NONE'||!Array.isArray(p.channels)||p.channels.length!==channels.length||!channels.every(c=>(p.channels as unknown[]).includes(c)))return this.error('Unsupported live subscription');
        this.state='live';this.post('SUBSCRIBED',{stream_id:this.runId,effective_stream:'LIVE',effective_channels:channels,effective_diff_policy:'DIFF_ONLY',effective_snapshot_policy:'ON_JOIN',effective_compression:'NONE'});await this.record(true);this.overlay();return;
      case 'INPUT_COMMAND':{
        const cmd=p.cmd as {type?:string;payload?:{hint?:string}}|null;
        const hint=cmd?.payload?.hint,id=p.client_cmd_id;
        const earlier=typeof id==='string'?this.accepted.get(id):undefined;
        if(earlier&&earlier.tick===p.tick_target&&earlier.hint===hint&&cmd?.type==='VIEW_CONTROL'){this.post('COMMAND_ACCEPTED',{client_cmd_id:id});return;}
        if(this.state!=='live'||typeof id!=='string'||!id||earlier||this.accepted.size>=4096||!Number.isInteger(p.tick_target)||Number(p.tick_target)<this.sim.world.tick||Number(p.tick_target)>Math.min(lastTick,this.sim.world.tick+(this.playing?4:0))||cmd?.type!=='VIEW_CONTROL'||!['PLAY','PAUSE'].includes(hint??'')){
          this.post('COMMAND_REJECTED',{client_cmd_id:id??'',reason:Number(p.tick_target)<this.sim.world.tick?'STALE_TICK':'Unsupported or invalid viewer command'});return;
        }
        // This is a host playback hint. Commands do not insert actions into past world ticks.
        const target=Number(p.tick_target);
        this.accepted.set(id,{tick:target,hint:hint!});
        if(target===this.sim.world.tick)this.playing=hint==='PLAY'&&!this.sim.finished;
        else this.hints.set(target,[...(this.hints.get(target)??[]),hint!]);
        this.post('COMMAND_ACCEPTED',{client_cmd_id:id});this.overlay();return;}
      case 'DESYNC_REPORT':
        if(this.state!=='live'||!['TICK_GAP','FROM_TICK_MISMATCH','INVALID_PAYLOAD','EXTERNAL_HASH_MISMATCH'].includes(String(p.issue)))return this.error('Invalid recovery request');
        this.post('DESYNC_CONFIRMED',{recovery_tick:this.sim.world.tick,message:'Replace the local baseline'});await this.record(true);return;
      default:this.error('Unsupported message '+input.msg_type);
    }
  }
  history(){return [...this.accepted].map(([id,v])=>({id,...v}));}
}

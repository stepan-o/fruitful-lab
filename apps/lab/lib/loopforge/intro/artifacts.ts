import {engine,schema,reconstruct,validEnvelope,type Envelope,type Frame} from './protocol';
/** Read-only, disconnected reconstruction. Transport handshake and playback controls have no role here. */
export type Pointer={path:string;msg_type:'FRAME_DIFF'|'FULL_SNAPSHOT';sha256:string};
export type ArtifactIndex={
  engine_name:string;schema_version:string;available_start_tick:number;available_end_tick:number;
  snapshots:Record<string,Pointer>;diffs:Record<string,Pointer>;
};
export async function offlineFrame(index:ArtifactIndex,tick:number,load:(path:string)=>Promise<Uint8Array>){
  if(index.engine_name!==engine||index.schema_version!==schema||!Number.isSafeInteger(tick)||tick<index.available_start_tick||tick>index.available_end_tick)throw Error('Unavailable artifact tick or schema');
  const first=Math.max(...Object.keys(index.snapshots).map(Number).filter(k=>k<=tick));
  if(!Number.isSafeInteger(first))throw Error('Missing offline baseline');
  let frame:Frame|null=null;
  for(let n=first;n<=tick;n++){
    const type=n===first?'FULL_SNAPSHOT':'FRAME_DIFF';
    const pointer=(n===first?index.snapshots:index.diffs)[n];
    if(!pointer||pointer.msg_type!==type)throw Error('Missing or incorrect record pointer');
    const bytes=await load(pointer.path);
    const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new Uint8Array(bytes))),b=>b.toString(16).padStart(2,'0')).join('');
    if(hash!==pointer.sha256)throw Error('Artifact checksum mismatch');
    const record:Envelope=JSON.parse(new TextDecoder().decode(bytes));
    if(!validEnvelope(record)||record.msg_type!==type||record.sent_at_ms!==0)throw Error('Invalid offline record');
    frame=reconstruct(frame,record);
    if(frame.tick!==n)throw Error('Offline tick mismatch');
  }
  return frame!;
}

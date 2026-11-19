/** Optional CPU acceptance harness. Pass the compiled worker and a local @napi-rs/canvas installation. */
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {Worker}=require('node:worker_threads');
const ts=require('typescript');
require.extensions['.ts']=(mod,name)=>mod._compile(ts.transpileModule(fs.readFileSync(name,'utf8'),{
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}
}).outputText,name);
const {createCanvas,loadImage}=require(process.argv[3]??'@napi-rs/canvas');
const {paint}=require('../components/loopforge/intro/paint.ts');
const {Timing}=require('../components/loopforge/intro/metrics.ts');
const {envelope,schema,subscription,reconstruct}=require('../lib/loopforge/intro/protocol.ts');
const crypto=require('node:crypto');
const app=path.resolve(__dirname,'..'),workerPath=path.resolve(process.argv[2]),start=performance.now();
const art=require('../public/loopforge-intro/sprites.json'),bank={art,images:{}};
const system={model:os.cpus()[0].model,node:process.version,os:os.release(),memory:os.totalmem(),workerSha256:crypto.createHash('sha256').update(fs.readFileSync(workerPath)).digest('hex')};
(async()=>{
  await Promise.all(Object.keys(art.sheets).map(async key=>{bank.images[key]=await loadImage(path.join(app,'public/loopforge-intro',key+'.webp'));}));
  const shim="const {parentPort,workerData}=require('node:worker_threads');global.self=global;global.postMessage=m=>parentPort.postMessage(m);require(workerData);parentPort.on('message',data=>self.onmessage({data}));";
  const worker=new Worker(shim,{eval:true,workerData:workerPath});
  let seq=0,frame=null,previous=null,received=0,seconds=0,costs=[],playing=false,done=false,error=null;
  const post=(type,p)=>worker.postMessage(envelope(type,++seq,p));
  const cmd=hint=>post('INPUT_COMMAND',{client_cmd_id:'bench-'+seq,tick_target:frame.tick+(playing?1:0),cmd:{type:'VIEW_CONTROL',payload:{hint}}});
  let baselines=0,diffs=0;
  worker.on('message',m=>{
    if(m.local==='overlay'){seconds=m.seconds;costs=m.costs;playing=m.playing;done=m.finished;return;}
    if(m.local==='failure'||m.msg_type==='ERROR'||m.msg_type==='COMMAND_REJECTED'){error=JSON.stringify(m);return;}
    if(m.msg_type==='KERNEL_HELLO')post('SUBSCRIBE',subscription);
    if(m.msg_type==='FULL_SNAPSHOT'||m.msg_type==='FRAME_DIFF'){
      previous=m.msg_type==='FRAME_DIFF'?frame:null;frame=reconstruct(frame,m);received=performance.now();
      if(!previous){baselines++;worker.postMessage({local:'applied',tick:frame.tick,hash:frame.hash});}else diffs++;
    }
  });
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  async function until(predicate){const start=performance.now();while(!predicate()){if(error||performance.now()-start>5000)throw Error(error??'Worker response timeout');await wait(5);}}
  post('VIEWER_HELLO',{viewer_name:'cpu-review',viewer_version:'1.0.0',supported_schema_versions:[schema]});
  await until(()=>frame!==null);
  const cold=start?performance.now()-start:0;
  const runs=[];
  for(const [w,h] of [[1280,720],[390,580],[1280,720]]){
    const surface=createCanvas(w,h),ctx=surface.getContext('2d'),cam={x:0,y:0,scale:0,time:-1};
    const cadence=new Timing(),draw=new Timing(),responses=[];
    const beginCost=[...costs],beginMem=process.memoryUsage(),beginDiffs=diffs,beginBaselines=baselines;
    const begin=performance.now();let last=begin,target=begin,first=true,skin='sprites',switched=0,midPause=false;
    cmd('PLAY');
    while(!done){
      if(error)throw Error(error);
      if(performance.now()-begin>201000)throw Error('Incomplete normal-speed intro');
      await wait(Math.max(0,target-performance.now()));const now=performance.now();
      if(!first)cadence.add(now-last);
      if(seconds>=80&&switched===0){skin='model';switched=1;}
      else if(seconds>=84&&switched===1){skin='sprites';switched=2;}
      paint(ctx,w,h,frame,seconds,bank,skin,cam,Math.min(.2,(now-last)/1000),previous??undefined,Math.min(1,(now-received)/50));
      // Native Skia lazily submits draw calls. Sample a pixel to include raster work.
      ctx.getImageData(w>>1,h>>1,1,1);
      const end=performance.now();draw.add(end-now);
      if(first&&playing)responses.push(end-begin);
      if(!midPause&&seconds>=115){
        const before=performance.now();cmd('PAUSE');await until(()=>!playing);responses.push(performance.now()-before);
        const frozen=frame.hash;await wait(60);if(frame.hash!==frozen)throw Error('Paused state changed');cmd('PLAY');midPause=true;
      }
      last=now;first=false;target=Math.max(target+1000/60,now+1);
    }
    const endMem=process.memoryUsage();
    runs.push({viewport:[w,h],durationMs:performance.now()-begin,frame:cadence.result(),draw:draw.result(),controlAckMs:responses,workerMs:costs.map((v,i)=>v-(beginCost[i]??0)),baselines:baselines-beginBaselines,diffs:diffs-beginDiffs,finalHash:frame.hash,outputs:frame.state.world.outputs,images:Object.keys(bank.images).length,workers:1,heapStart:beginMem.heapUsed,heapEnd:endMem.heapUsed,rssStart:beginMem.rss,rssEnd:endMem.rss});
    const result={profile:'normal-speed CPU Skia with shipped webpack worker; no DOM, GPU compositor or network',system,coldAssetsAndWorkerMs:cold,runs};
    fs.writeFileSync(process.argv[4]??'/tmp/day-one-software-run.json',JSON.stringify(result,null,2)+'\n');
    if(runs.length<3){worker.postMessage({local:'locate',seconds:0});await until(()=>!done&&frame.tick===0);}
  }
  await worker.terminate();
})().catch(e=>{console.error(e);process.exit(1);});

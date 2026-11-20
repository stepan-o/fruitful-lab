const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const {execFileSync}=require('node:child_process');
const path=require('node:path');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');

async function main(){
  const surface=process.argv[2],width=Number(process.argv[3]);
  const viewport={width,height:width===320?844:800};
  const dir=path.resolve('shift-evidence',surface+'-'+width);
  await fs.mkdir(dir,{recursive:true});
  const browser=await chromium.launch();
  try{
    const context=await browser.newContext({viewport,hasTouch:width===320,offline:surface==='portable',
      recordVideo:{dir,size:viewport}});
    const page=await context.newPage(),errors=[],receipts=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(()=>{
      window.addEventListener('loopforge:frame',e=>{window.floorFrame=e.detail;});
    });
    await page.goto(surface==='portable'?pathToFileURL(process.env.OFFLINE_PLAYER).href:
      'http://127.0.0.1:4173/'+(surface==='embedded'?'loopforge-design/index.html#2d-shifts':'loopforge-shifts/index.html'));
    const f=surface==='embedded'?await (await page.waitForSelector('#shifts-player')).contentFrame():page.mainFrame();
    await f.waitForFunction(()=>!!window.floorFrame);
    const stamp=async name=>{
      const tick=await f.evaluate(()=>window.floorFrame.tick);
      await page.evaluate(label=>{
        const box=document.getElementById('capture-caption')||document.createElement('aside');
        box.id='capture-caption';box.textContent=label;
        Object.assign(box.style,{position:'fixed',bottom:'0',left:'0',background:'#102523',color:'white',zIndex:'99999',padding:'6px 10px',font:'13px system-ui',pointerEvents:'none'});
        document.body.append(box);
      },[process.env.GITHUB_SHA.slice(0,8),surface,width+' × '+viewport.height,'1×','seed early / 3241',name,'tick '+tick].join(' · '));
      receipts.push({name,tick});
    };
    const photograph=async name=>{
      const picture=await page.screenshot({type:'jpeg',quality:60,path:path.join(dir,name+'.jpg')});
      if(surface==='standalone'&&width===320&&name==='return')console.log('FRAME_'+name+' '+picture.toString('base64'));
    };
    const play=async()=>{await f.locator('#play').click();await f.locator('#room').scrollIntoViewIfNeeded();};
    const pause=async()=>{if(await f.locator('#play').innerText()==='Pause')await f.locator('#play').click();};
    const inspect=async(actor,needle)=>{
      await f.locator('#inspect').evaluate(d=>d.open=true);
      await f.locator('#who').selectOption(actor);await f.locator('#trace').click();
      await f.waitForFunction(t=>document.querySelector('#traceOut').textContent.includes(t),needle);
      const trace=await f.locator('#traceOut').textContent();receipts.push({actor,trace});
      await f.locator('#traceOut').scrollIntoViewIfNeeded();await page.waitForTimeout(900);
      await f.locator('#inspect').evaluate(d=>d.open=false);
    };
    const event=async(kind,actor,subject,text)=>f.waitForFunction(([k,a,b,t])=>window.floorFrame.scene.events.some(e=>
      e.kind===k&&(!a||e.actor===a)&&(!b||e.subject===b)&&(!t||e.text.includes(t))),[kind,actor,subject,text],{timeout:35000});
    const load=async name=>{
      await f.locator('#checkpoint').selectOption(name);
      await f.waitForFunction(()=>document.getElementById('play').textContent==='Play 1×');
      await f.waitForFunction(n=>window.floorFrame.scene.world.day===(n.startsWith('3D')?3:n.startsWith('4F')||n.includes('return')?4:2)&&
        (n.startsWith('3D')?window.floorFrame.scene.world.pressure==='refusal':n.startsWith('4F')?window.floorFrame.scene.world.called==='kit':n.includes('exit')?window.floorFrame.scene.world.stage==='departure':n.includes('return')?window.floorFrame.scene.world.pressure==='clash':window.floorFrame.scene.world.chat==='reply'),name);
      await stamp(name);
    };
    await f.locator('[data-bid="LIMEN"]').click();await f.locator('#commit').click();
    await event('speech.delivered','bob','sam','picked me up');await f.locator('#room').scrollIntoViewIfNeeded();await stamp('Morning approach');
    const opening = await f.locator('#speech-text').textContent();
    assert(opening.startsWith('bob · When you picked me up'), opening);
    const started = performance.now();
    await f.waitForFunction(() => document.querySelector('#speech-text').textContent.startsWith('sam · No.'));
    assert(performance.now() - started >= 4300, 'bob’s opening changed before it could be read');
    await event('speech.delivered','LIMEN','crew','privilege');
    await f.waitForFunction(()=>document.querySelector('#welcome-voice').currentTime>0.1,{},{timeout:6000});
    receipts.push({greetingAudio:await f.locator('#welcome-voice').evaluate(a=>({time:a.currentTime,rate:a.playbackRate}))});
    await f.waitForFunction(() => document.querySelector('#speech-text').textContent.split(' · ').length === 4);
    const chorus = await f.locator('#speech-text').textContent();
    await pause();await page.waitForTimeout(750);assert.equal(await f.locator('#speech-text').textContent(),chorus);
    await photograph('greeting-replies');await play();
    await page.waitForTimeout(5700);
    assert.equal(await f.locator('#speech-text').textContent(),chorus);
    await pause();
    const layout=await f.evaluate(()=>({width:innerWidth,actual:document.documentElement.scrollWidth,
      overflow:[...document.querySelectorAll('body *')].filter(el=>el.getBoundingClientRect().right>innerWidth+1).slice(0,6).map(el=>[el.tagName,el.id,el.clientWidth])}));
    assert(layout.actual<=layout.width+1,JSON.stringify(layout));
    for(const cutoff of ['early','late']){
      const name='G5 · '+cutoff+' cutoff';await load(name);
      await f.locator('#save-state').click();await play();
      await event('chat.interrupted','STILETTO','sam');
      const seen=await f.evaluate(()=>window.floorFrame.scene.events.some(e=>e.text==='ed’s desk.'));
      assert.equal(seen,cutoff==='late');await pause();
      await f.locator('#load-state').click();await f.locator('[data-room="security"]').click();await play();
      await event('chat.interrupted','STILETTO','sam');await pause();
      await load('G5 · exit after '+cutoff+' cutoff');await play();
      await event('speech.delivered',cutoff==='late'?'ed':'ben','bob',cutoff==='late'?'show you':'boot');
      await page.waitForTimeout(1200);await pause();await inspect('bob',cutoff==='late'?'desk.lead':'boot.lead');
    }
    await load('3D · hands at the desk');await play();await event('check.return','LIMEN','jo');
    await photograph('return');await pause();
    for(const [name,act] of [['4D · firsthand return','go'],['W1 · reported return','stay']]){
      await load(name);await play();await event('worker.choice','ben','','');await page.waitForTimeout(700);
      assert(await f.evaluate(t=>window.floorFrame.scene.events.some(e=>e.kind==='worker.choice'&&e.actor==='ben'&&e.text===t),act));
      await photograph('rail-'+act);
      await f.locator('[data-room="conveyor"]').click();
      if(act==='go')await event('speech.delivered','ben','mae','bob was still');
      else await page.waitForTimeout(6500);
      await pause();await inspect('ben','jo.crossed.4');
    }
    await load('4F · late check at bell');await play();await event('shift.closed','BELL');
    await photograph('late-check');await pause();
    assert.deepEqual(errors,[]);
    await fs.writeFile(path.join(dir,'capture.json'),JSON.stringify({build:process.env.GITHUB_SHA,seed:'early / 3241',viewport,surface,speed:1,receipts,errors},null,2));
    await context.close();
    if(surface==='standalone'&&width===320){
      const list=[];
      const readings=[
        ['G5 · exit after early cutoff','speech.delivered','ben','boot'],
        ['G5 · exit after late cutoff','speech.delivered','ed','show you'],
        ['4D · firsthand return','worker.choice','ben','go'],
        ['W1 · reported return','worker.choice','ben','stay']
      ];
      // Keep the full reading interval from Play through the reply or the crossing.
      for(const [i,[checkpoint,kind,actor,word]] of readings.entries()){
        const clip=await browser.newContext({viewport,recordVideo:{dir,size:viewport}});
        const shot=await clip.newPage();
        await shot.addInitScript(()=>window.addEventListener('loopforge:frame',e=>window.floorFrame=e.detail));
        await shot.goto('http://127.0.0.1:4173/loopforge-shifts/index.html');
        await shot.locator('#checkpoint').selectOption(checkpoint);
        await shot.waitForFunction(exit=>exit?window.floorFrame?.scene.world.stage==='departure':window.floorFrame?.scene.world.pressure==='clash',i<2);
        await shot.evaluate(label=>{
          const box=document.createElement('div');box.textContent=label+' · tick '+window.floorFrame.tick;
          Object.assign(box.style,{position:'fixed',bottom:'0',left:'0',background:'#102523',color:'white',padding:'6px 8px',font:'13px system-ui',zIndex:9999});document.body.append(box);
        },process.env.GITHUB_SHA.slice(0,8)+' · 320 × 844 · standalone · 1× · seed early / 3241 · '+checkpoint);
        const started = performance.now();
        await shot.locator('#play').click();await shot.locator('#room').scrollIntoViewIfNeeded();
        await shot.waitForFunction(([k,a,t])=>window.floorFrame.scene.events.some(e=>e.kind===k&&e.actor===a&&e.text.includes(t)),[kind,actor,word],{timeout:35000});
        if(i===2){
          await shot.waitForTimeout(1000);
          await shot.locator('[data-room="conveyor"]').click();
          await shot.locator('#room').scrollIntoViewIfNeeded();
        }
        const reply=i<2?word:i===2?'bob was still':'take my turn here';
        await shot.waitForFunction(t=>document.querySelector('#speech-text').textContent.includes(t),reply);
        const words=await shot.locator('#speech-text').textContent();
        await shot.waitForFunction(t=>document.querySelector('#speech-text').textContent!==t,words);
        const seconds=(performance.now()-started)/1000;
        const take=shot.video();await clip.close();const input=await take.path(),name='take-'+i+'.mp4';
        execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-sseof','-'+seconds.toFixed(3),'-i',input,'-an','-r','12','-c:v','libx264','-crf','29','-pix_fmt','yuv420p',path.join(dir,name)]);
        await fs.unlink(input);list.push("file '"+name+"'");
      }
      await fs.writeFile(path.join(dir,'cuts.txt'),list.join('\n'));
      const film=path.join(dir,'dialogue-at-1x.mp4');
      execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',path.join(dir,'cuts.txt'),'-c','copy','-movflags','+faststart',film]);
      const bytes=(await fs.readFile(film)).toString('base64');
      for(let i=0;i<bytes.length;i+=6000)console.log('PLAYBACK_'+i+' '+bytes.slice(i,i+6000));
      console.log('PLAYBACK_SIZE '+bytes.length);
      for(let i=0;i<4;i++)await fs.unlink(path.join(dir,'take-'+i+'.mp4'));
      await fs.unlink(path.join(dir,'cuts.txt'));
    }
  }finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});

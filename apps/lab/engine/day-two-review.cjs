// Record the ordinary campaign at its default 1× speed. Only player controls write to the session.
const {chromium}=require("playwright");
const assert=require("node:assert/strict");
const fs=require("node:fs/promises");
const path=require("node:path");
const route=process.env.DAY_TWO_ROUTE, width=Number(process.env.DAY_TWO_WIDTH);
const viewport={width,height:width===320?693:width===390?844:800};
const out=path.resolve(process.env.RUNNER_TEMP||".","day-two-evidence");
(async()=>{
  await fs.mkdir(out,{recursive:true});
  const browser=await chromium.launch({args:["--no-sandbox"]});
  const context=await browser.newContext({viewport,recordVideo:{dir:out,size:viewport}});
  const page=await context.newPage(), errors=[],workers=[];
  page.on("pageerror",e=>errors.push(e.message));
  page.on("worker",w=>workers.push(w.url()));
  const video=page.video();
  const button=(name)=>page.getByRole("button",{name,exact:typeof name==="string"});
  const journal=()=>page.evaluate(()=>JSON.parse(sessionStorage.getItem("loopforge.kernel.journal.1")));
  async function picture(name){
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,"Horizontal overflow at "+name);
    await page.screenshot({path:path.join(out,name+".png")});
  }
  async function staffed(ids){
    for(const [i,id] of ids.entries()){
      await button(new RegExp("^"+id+" ·")).click();
      await button("Send "+id+" to "+["Intake","Wash","Belt","Forge"][i]).click();
    }
  }
  page.setDefaultTimeout(120000);
  try{
    await page.goto((process.env.LOOPFORGE_URL||"http://127.0.0.1:3204")+"/stepanoskin/loopforge/play",{waitUntil:"domcontentloaded"});
    await button("2nd day").click();
    await button("Answer leadership").waitFor();
    await page.waitForFunction(()=>[...document.querySelectorAll('[data-screen="console"] canvas')].length===2&&[...document.querySelectorAll('[data-screen="console"] canvas')].every(c=>c.width!==300&&c.getContext("2d").getImageData(c.width/2,c.height/2,1,1).data[3]>0));
    await picture("01-desk");
    await button("Answer leadership").click();
    await button("Receive the quota").click();
    await picture("02-quota");
    await button("Acknowledge quota").click();
    const lead=route==="clear"?"STILETTO":"LIMEN";
    await button(new RegExp("^"+lead+" at Security")).click();
    await picture("03-appointment");
    await button("Commit assignment").click();
    await page.getByRole("heading",{name:"Security",exact:true}).waitFor();
    assert.equal(workers.length,1,"The desk and both rooms share one campaign worker");
    if(route==="clear"){
      const forge=button("Clear Forge"),intake=button("Clear Intake");
      await page.waitForFunction(()=>["Clear Forge","Clear Intake"].every(label=>document.querySelector('button[aria-label="'+label+'"]:enabled')),{},{timeout:180000});
      await picture("04-ready");
      await forge.focus();
      assert.ok(await forge.evaluate(el=>el===document.activeElement));
      await page.keyboard.press("Enter");
      await page.getByText(/LIMEN calling max/).first().waitFor();
      await picture("05-clearance");
      await page.waitForFunction(()=>document.querySelector('[data-screen="conveyor"] header')?.textContent.includes("Rack +2"),{},{timeout:30000});
      await intake.click();
      await picture("06-intake");
    }else{
      await page.getByText(/Give each operator two stations/).waitFor();
      await picture("04-pairs");
      await staffed(["sam","sam","max","max"]);
      const pin=button(/^Missing ID · Inspect bob/);
      await pin.waitFor();
      await picture("05-missing-id");
      await button("Pause").click();
      await button("Play").waitFor();
      const before=await journal();
      await pin.focus();await page.keyboard.press("Enter");
      const grant=button("Issue daily pass");
      await grant.waitFor();
      assert.equal(await grant.isEnabled(),false,"Pause blocks a world command");
      await button("≋ Desk exchange").click();
      await page.getByText("No ID. Hold both desks.",{exact:false}).first().waitFor();
      await button("≋ Desk exchange").click();
      await picture("06-incident");
      await page.keyboard.press("Escape");
      assert.ok(await pin.evaluate(el=>el===document.activeElement),"Return focuses bob");
      assert.deepEqual(await journal(),before,"Inspection and return leave the saved run untouched");
      await pin.click();await button("Play").click();
      if(route==="pass"){
        await grant.click();
        await page.getByText(/Daily pass granted/).waitFor();
      }else{
        await page.getByText(/decision window has closed/).waitFor();
        assert.equal(await grant.count(),0);
        await picture("07-expired");
        await button("Return to camera").click();
        await page.getByText(/bob in custody/).waitFor();
      }
      await page.getByText(/Assign a different operator/).waitFor();
      const bob=button(/^bob ·/);
      assert.equal(await bob.count(),route==="pass"?1:0);
      await staffed(["sam",route==="pass"?"bob":"max","jo","kit"]);
      await button("Assign crew").click();
      await button(/^kit ·/).click();
      await page.getByLabel("Station",{exact:true}).selectOption("2");
      await picture("08-staffing");
      await button("Send kit to Belt").click();
      await button("Close assignments").click();
    }
    await page.getByRole("heading",{name:"Shift closed"}).waitFor({timeout:310000});
    await picture("09-register");
    assert.equal(errors.length,0,errors.join("\n"));
    await fs.writeFile(path.join(out,"review.json"),JSON.stringify({route,viewport,rate:1,workers:workers.length,register:await page.locator("main").innerText(),inputs:(await journal()).commands?.length},null,2));
  }catch(error){
    console.error("Route",route,width,"Browser errors",errors,"Visible page",(await page.locator("body").innerText()).slice(0,1800));
    await page.screenshot({path:path.join(out,"failure.png")}).catch(()=>{});
    throw error;
  }finally{
    await context.close();
    await video.saveAs(path.join(out,"day-two-"+route+"-"+width+"-1x.webm"));
    await video.delete();
    await browser.close();
  }
})().catch(e=>{console.error(e);process.exitCode=1;});

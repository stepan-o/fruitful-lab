(() => {
 const root=document.getElementById('model-brief-library');if(!root)return;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const stage=(p,i)=>Number(p.file?.split('/').pop().match(/^\d+/)?.[0]||i+1);
 const size=n=>(n/1048576).toFixed(1)+' MB';let catalog,current,sequence=0,started=false,zipBusy=false;const cache=new Map();
 const get=async url=>{const r=await fetch(url);if(!r.ok)throw Error('Could not load '+url);return r.json();};
 const model=async item=>{if(!cache.has(item.id))cache.set(item.id,await get(item.src));return cache.get(item.id);};
 const announce=t=>{root.querySelector('[data-brief-status]').textContent=t;};
 function imageMarkup(img){const v=img.variants[0];return `<figure><a href="${esc(img.input.src)}" target="_blank" rel="noopener" aria-label="Inspect ${esc(img.label)}"><img src="${esc(v.src)}" srcset="${img.variants.map(x=>`${esc(x.src)} ${x.width}w`).join(', ')}" sizes="(max-width:600px) calc(100vw - 46px), 320px" width="${v.width}" height="${v.height}" loading="lazy" decoding="async" alt="${esc(img.label)}"></a><figcaption><strong>${esc(img.label)}</strong><span>${esc(img.role)}</span><a href="${esc(img.input.src)}" download>Download image</a></figcaption></figure>`;}
 async function select(id,push=true){
  const item=catalog.models.find(x=>x.id===id)||catalog.models[0],ticket=++sequence;
  root.querySelectorAll('[data-model]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.model===item.id)));
  if(push){const u=new URL(location.href);u.searchParams.set('model',item.id);history.replaceState(null,'',u);}
  const target=root.querySelector('[data-brief-detail]');target.setAttribute('aria-busy','true');announce('Loading '+item.name+'…');
  try{const d=await model(item);if(ticket!==sequence)return;current=d;
   target.innerHTML=`<header class="brief-heading"><div class="brief-heading-copy"><span class="kicker">${esc(d.revision)}</span><h3>${esc(d.name)}</h3><p>${esc(d.summary)}</p><span class="status">${esc(d.status)}</span><div class="brief-actions">${d.viewer?`<a class="brief-primary" href="${esc(d.viewer)}">${esc(d.viewerLabel)} →</a>`:`<strong>No CATHEXIS model yet</strong><a href="${esc(d.referenceViewer)}">Hot Walk on worker stand-in ↗</a>`}<button data-download-model ${zipBusy?'disabled':''}>Download ${esc(d.name)} kit · ${size(d.downloadBytes)}</button><a href="${esc(d.record)}">Current review record ↗</a></div><div class="brief-actions brief-jumps"><button data-brief-jump="images">Reference images ↓</button><button data-brief-jump="prompts">Copy Meshy stages ↓</button></div></div>${imageMarkup(d.images[0])}</header>
   <div class="brief-notes"><div><h4>Included parts</h4><ul>${d.parts.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><h4>Still to validate</h4><ul>${d.remaining.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div>
   <p class="brief-provenance">${esc(d.provenance)}</p>
   ${d.id==='cathexis'?`<div class="brief-face-system"><h4>One intact head. Three appearances.</h4><p><strong>Original mechanical face + eyes → full or half Grace coverage.</strong> Full porcelain, split coverage and exposed mechanism reuse the accepted head without removing its face. Either covered side can be inspected. The half mask comes from Grace itself. Stage 2 is closed; remaining expression generation is abandoned. Stage 3 body rig, Hot Walk and Happy Sway have arrived. Their local cleanup is available in the viewer; moving Grace attachment is next. Facial animation is outside this prototype. Sampled lower-skirt/leg clearance passes; moving mask fit, blends and paired contacts remain open.</p><p>Start with the clean body. A/B/C are dirt treatments to choose later, using that same mesh and rig. Hot Walk only; never runs, no alert state.</p></div>`:''}
   <h4 data-brief-section="images" tabindex="-1">Reference images</h4><p>Open an image for close inspection. Downloads contain body-reference images, transparent overlays where supplied, and their hashes; source PNG masters stay outside deployments.</p><div class="brief-gallery">${d.images.map(imageMarkup).join('')}</div>
   <h4 data-brief-section="prompts" tabindex="-1">Meshy handoff · numbered stages</h4><p>Copy one stage at a time. Body views belong together; masks and tools are separate objects. Images marked “reference only” should not be used to generate a fused model.</p>
   <div class="brief-prompts">${d.prompts.map((p,i)=>`<details ${i===0?'open':''}><summary>${String(stage(p,i)).padStart(2,'0')} · ${esc(p.title)}</summary><div class="brief-actions"><button data-copy-prompt="${i}">Copy stage ${stage(p,i)}</button><a href="${esc(p.url)}" download>Download plain text</a></div><pre tabindex="0" aria-label="Stage ${stage(p,i)} prompt">${esc(p.text)}</pre></details>`).join('')}</div>

   ${d.motionInventory?`<details><summary>Actual exported motion inventory · ${d.motionInventory.length} clips</summary>${d.motionInventory.map(c=>`<article class="brief-motion"><strong>${esc(c.label)} · ${c.duration.toFixed(2)} s</strong><p>${esc(c.note)}</p><code>${esc(c.sourceClip)}</code></article>`).join('')}</details>`:''}`;
   target.removeAttribute('aria-busy');announce(d.name+' brief ready.');
  }catch(error){if(ticket!==sequence)return;target.removeAttribute('aria-busy');target.innerHTML='<p>Could not load this brief. <button data-retry-model="'+esc(item.id)+'">Retry</button></p>';announce(error.message);}
 }
 function save(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
 async function download(all){
  if(zipBusy||!current)return;zipBusy=true;const chosen=all?catalog.models:[catalog.models.find(m=>m.id===current.id)];
  root.querySelectorAll('[data-download-model],[data-download-all]').forEach(b=>b.disabled=true);
  try{const {zipStore}=await import('/loopforge-design/model-briefs.zip.mjs');const entries=[];
   for(const item of chosen){const d=await model(item);let n=0;
    for(const f of d.files){announce(`Preparing ${d.name}: ${++n} / ${d.files.length}`);const r=await fetch(f.src);if(!r.ok)throw Error('Download failed: '+f.name);const bytes=new Uint8Array(await r.arrayBuffer());
     const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');if(hash!==f.sha256||bytes.length!==f.bytes)throw Error('Integrity check failed: '+f.name);
     entries.push({name:d.id+'/'+f.name,data:bytes});
    }
    entries.push({name:d.id+'/manifest.json',data:JSON.stringify(d.packageManifest,null,2)});
   }
   save(zipStore(entries),`loopforge-${all?'all-models':chosen[0].id}-${catalog.date}.zip`);announce('ZIP prepared and download requested. Includes images, prompts and provenance; no 3D model binaries.');
  }catch(error){announce(error.message+' — retry the download.');}finally{zipBusy=false;root.querySelectorAll('[data-download-model],[data-download-all]').forEach(b=>b.disabled=false);}
 }
 async function init(){
  if(started||root.closest('[hidden]'))return;started=true;
  try{catalog=await get(root.dataset.catalog);root.innerHTML=`<div class="brief-picker" role="group" aria-label="Choose model brief">${catalog.models.map(m=>`<button data-model="${m.id}" aria-pressed="false"><strong>${esc(m.name)}</strong><span>${esc(m.subtitle)}</span></button>`).join('')}</div><div class="brief-archive-actions"><button data-download-all>Download all four kits · ${size(catalog.models.reduce((n,m)=>n+m.downloadBytes,0))}</button><a href="/stepanoskin/loopforge/play/asset-review">All model viewers ↗</a></div><p class="brief-status" data-brief-status role="status" aria-live="polite"></p><div data-brief-detail></div>`;
   await select(new URL(location.href).searchParams.get('model')||'cathexis',false);
  }catch(error){started=false;root.innerHTML='<p>Could not load the brief library. <button data-retry-library>Retry</button></p>';}
 }
 root.addEventListener('click',async event=>{const b=event.target.closest('button');if(!b)return;
  if(b.dataset.briefJump){const section=root.querySelector('[data-brief-section="'+b.dataset.briefJump+'"]');section.scrollIntoView({block:'start'});section.focus({preventScroll:true});}
  if(b.dataset.model)select(b.dataset.model);if(b.dataset.retryModel)select(b.dataset.retryModel);if(b.hasAttribute('data-retry-library'))init();
  if(b.hasAttribute('data-download-model'))download(false);if(b.hasAttribute('data-download-all'))download(true);
  if(b.hasAttribute('data-copy-prompt')&&current){try{await navigator.clipboard.writeText(current.prompts[Number(b.dataset.copyPrompt)].text);announce('Stage '+stage(current.prompts[Number(b.dataset.copyPrompt)],Number(b.dataset.copyPrompt))+' copied.');}catch{announce('Clipboard unavailable. Select the prompt text or download its plain-text file.');}}
 });
 document.addEventListener('design:panelchange',init);init();
})();

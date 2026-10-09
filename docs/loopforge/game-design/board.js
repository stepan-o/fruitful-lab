(() => {
  const d = JSON.parse(document.getElementById('design-data').textContent);
  const art = JSON.parse(document.getElementById('art-data').textContent);
  const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const p = text => `<p>${escape(text)}</p>`;
  const def = (label,text) => `<div class="definition"><dt>${escape(label)}</dt><dd>${escape(text)}</dd></div>`;
  const picture = (id,alt) => {const vs=art[id].variants;const v=vs[vs.length-1];return `<img src="${v.src}" srcset="${vs.map(x=>`${x.src} ${x.width}w`).join(', ')}" sizes="(max-width:600px) calc(100vw - 38px), (max-width:1100px) 420px, 520px" width="${v.width}" height="${v.height}" alt="${escape(alt)}" decoding="async" loading="lazy">`;};
  const announce = text => {document.getElementById('announcement').textContent=text;};
  function renderStage(id, notify=true){
    const s=d.stages.find(x=>x.id===id)||d.stages[0];
    document.querySelectorAll('[data-stage]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.stage===s.id)));
    document.getElementById('stage-detail').innerHTML=`<div class="phase-detail"><figure>${picture(s.art,s.room+' concept art')}<figcaption>${escape(s.caption)}</figcaption></figure><div class="phase-copy"><span class="status agreed">${escape(s.status)}</span><h3>${escape(s.room)}</h3><p class="arrival">${escape(s.arrivals)}</p>${p(s.visible)}<dl>${def('What the player learns',s.learn)}${def('New decision',s.choice)}${def('Friction to overcome',s.friction)}${def('Mastery evidence to develop',s.gate)}</dl></div></div><div class="subsurface"><div><h4>Developing beneath the surface</h4>${p(s.hidden)}</div><div><h4>Carried into the next stage</h4>${p(s.carry)}</div></div>`;
    if(notify)announce(s.room+' selected');
  }
  function renderRoute(id,notify=true){
    const r=d.trajectories.find(x=>x.id===id)||d.trajectories[0];
    document.querySelectorAll('[data-route]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.route===r.id)));
    document.getElementById('route-detail').innerHTML=`<div class="trajectory-head"><div><span class="status">${escape(r.status)}</span><h3>${escape(r.name)}</h3>${p(r.premise)}</div><figure>${picture(r.art,r.name+' visual reference')}</figure></div><ol class="journey">${r.beats.map((b,i)=>`<li><h4>${String(i+1).padStart(2,'0')} · ${escape(d.stages[i].room)}</h4>${p(b)}</li>`).join('')}</ol><div class="consequence-grid"><div><h4>The accumulated pitfall</h4>${p(r.pitfall)}</div><div><h4>A costly recovery</h4>${p(r.recovery)}</div></div><div class="inheritance"><span class="kicker">Inherited by Act 2</span>${p(r.inheritance)}</div><div class="callout"><strong>Design test.</strong> ${escape(r.test)}</div>`;
    if(notify)announce(r.name+' trajectory selected');
  }
  function renderPerson(id,notify=true){
    const c=d.characters.find(x=>x.id===id)||d.characters[0];
    document.querySelectorAll('[data-person]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.person===c.id)));
    document.getElementById('person-detail').innerHTML=`<div class="person"><figure>${picture(c.art,c.name+' original character sheet')}<figcaption>Original character grounding. Behaviour under replacement pressure is a proposed extension.</figcaption></figure><div><span class="kicker">${escape(c.role)}</span><h3>${escape(c.name)}</h3>${p(c.grounding)}<dl>${def('Where they shine',c.strength)}${def('Where it can go wrong',c.failure)}${def('The flawed adviser',c.advisor)}${def('Relationship pressure',c.relationship)}${def('When replacement feels possible',c.underThreat)}</dl></div></div>`;
    if(notify)announce(c.name+' selected');
  }
  function renderRumor(id,notify=true){
    const c=d.stress.cases.find(x=>x.id===id)||d.stress.cases[0];
    document.querySelectorAll('[data-rumor]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.rumor===c.id)));
    document.getElementById('rumor-detail').innerHTML=`<article class="rumor-case"><span class="status">Conceptual scenario · proposed sequence</span><h3>${escape(c.name)}</h3><div class="two-col"><dl>${def('Physical truth',c.truth)}${def('Who learns what',c.reach)}${def('What they believe',c.interpretation)}</dl><dl>${def('Player response',c.choice)}${def('Consequences',c.aftermath)}${def('Thrum’s role',c.thrum)}</dl></div></article>`;
    if(notify)announce(c.name+' selected');
  }
  function renderBDI(id,notify=true){
    const x=d.bdi.example.cases.find(c=>c.id===id)||d.bdi.example.cases[0];
    document.querySelectorAll('[data-bdi]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.bdi===x.id)));
    document.getElementById('bdi-detail').innerHTML=`<article class="bdi-case"><span class="status">Authored causal example · proposed interpretation</span><h3>${escape(x.name)}</h3><blockquote class="quote">${escape(x.short)}</blockquote><div class="bdi-trace">${[['Belief formed',x.belief],['Concern prioritized',x.desire],['Intention adopted',x.intention],['Next action',x.action],['Later echo',x.echo],['Causal explanation',x.trace]].map(([label,text],i)=>`<div><span class="phase-number">${i+1}</span><h4>${escape(label)}</h4>${p(text)}</div>`).join('')}</div></article>`;
    if(notify)announce(x.name+' selected');
  }
  function renderBeat(id,notify=true){
    const x=d.episodes.beats.find(c=>c.id===id)||d.episodes.beats[0];
    document.querySelectorAll('[data-beat]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.beat===x.id)));
    document.getElementById('episode-detail').innerHTML=`<article class="episode-beat"><span class="status">Conditional story specimen · not a simulated run</span><h3>${escape(x.name)}</h3><div class="episode-scene"><figure>${picture(x.art,x.caption)}<figcaption>${escape(x.caption)}</figcaption></figure><dl>${def('Factory condition',x.condition)}${def('Different interpretations',x.minds)}${def('Action',x.action)}</dl></div><div class="consequence-grid"><div><h4>What changes</h4>${p(x.change)}</div><div><h4>Pressure carried forward</h4>${p(x.next)}</div></div><div class="inheritance"><span class="kicker">Trace to inspect</span>${p(x.trace)}</div></article>`;
    if(notify)announce(x.name+' selected');
  }
  function renderHorizon(id,notify=true){
    const s=d.loops.scales.find(x=>x.id===id)||d.loops.scales[1];
    document.querySelectorAll('[data-horizon]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.horizon===s.id)));
    document.getElementById('loop-detail').innerHTML=`<article class="loop-detail"><span class="status">Proposed attention horizon</span><h3>${escape(s.name)}</h3><blockquote class="quote">${escape(s.question)}</blockquote><div class="two-col"><dl>${def('Player activity',s.player)}${def('World activity',s.system)}${def('Feedback',s.feedback)}</dl><dl>${def('Payoff',s.reward)}${def('Carried outward',s.carry)}${def('Design trap',s.failure)}</dl></div><div class="inheritance"><span class="kicker">One example</span>${p(s.example)}</div></article>`;
    if(notify)announce(s.time+' horizon selected');
  }
  function renderMechanic(id,notify=true){
    const m=d.uiDesign.mechanics.find(x=>x.id===id)||d.uiDesign.mechanics[0];
    document.querySelectorAll('[data-mechanic]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mechanic===m.id)));
    document.getElementById('mechanic-detail').innerHTML=`<article class="mechanic-detail"><span class="status">${escape(m.stage)}</span><h3>${escape(m.name)}</h3><div class="two-col"><div><span class="kicker">Interface</span><dl>${def('Player perceives',m.see)}${def('Player can influence',m.do)}</dl></div><div><span class="kicker">Simulation</span><dl>${def('Engine resolves',m.engine)}${def('History carried forward',m.carry)}</dl></div></div><div class="inheritance"><span class="kicker">Interface demand</span>${p(m.uiCost)}</div></article>`;
    if(notify)announce(m.name+' contract selected');
  }
  function renderScreen(id,notify=true){
    const sc=d.uiStructure.screens.find(x=>x.id===id)||d.uiStructure.screens[0];
    document.querySelectorAll('[data-screen]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.screen===sc.id)));
    document.querySelectorAll('[data-screen-detail]').forEach(el=>el.hidden=el.dataset.screenDetail!==sc.id);
    if(notify)announce(sc.name+' screen structure selected');
  }
  function renderAdviser(id,notify=true){
    const c=d.advisedPlanning.cases.find(x=>x.id===id)||d.advisedPlanning.cases[0];
    document.querySelectorAll('[data-adviser]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.adviser===c.id)));
    document.querySelectorAll('[data-adviser-case]').forEach(el=>el.hidden=el.dataset.adviserCase!==c.id);
    if(notify)announce(c.name+' staffing proposal selected');
  }
  function openPanel(id,updateHash=true){
    const panel=document.getElementById(id);if(!panel||!panel.classList.contains('panel'))return;
    document.querySelectorAll('.panel').forEach(el=>el.hidden=el.id!==id);
    document.dispatchEvent(new Event('design:panelchange'));
    document.querySelectorAll('[data-panel]').forEach(el=>el.setAttribute('aria-current',String(el.dataset.panel===id)));
    if(updateHash)history.replaceState(null,'','#'+id);
    announce(panel.querySelector('h2').textContent);
  }
  document.addEventListener('click',event=>{
    const b=event.target.closest('button');if(!b)return;
    if(b.dataset.panel){openPanel(b.dataset.panel);document.getElementById(b.dataset.panel).scrollIntoView({block:'start'});}
    if(b.dataset.stage)renderStage(b.dataset.stage);
    if(b.dataset.route)renderRoute(b.dataset.route);
    if(b.dataset.person)renderPerson(b.dataset.person);
    if(b.dataset.rumor)renderRumor(b.dataset.rumor);
    if(b.dataset.bdi)renderBDI(b.dataset.bdi);
    if(b.dataset.beat)renderBeat(b.dataset.beat);
    if(b.dataset.horizon)renderHorizon(b.dataset.horizon);
    if(b.dataset.mechanic)renderMechanic(b.dataset.mechanic);
    if(b.dataset.screen)renderScreen(b.dataset.screen);
    if(b.dataset.adviser)renderAdviser(b.dataset.adviser);
  });
  window.addEventListener('hashchange',()=>openPanel(location.hash.slice(1),false));
  renderStage('line',false);renderRoute('order',false);renderPerson('limen',false);renderRumor('accident',false);renderBDI('blame',false);renderBeat('mandate',false);renderHorizon('minute',false);renderMechanic('flow',false);renderScreen('factory',false);renderAdviser('limen',false);
  openPanel(location.hash.slice(1)||'player-desires',false);
})();

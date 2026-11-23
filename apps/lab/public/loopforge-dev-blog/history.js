(function(){
'use strict';
function matches(row,phase,role){return(!phase||row.phase.split(' ').includes(phase))&&(!role||row.role.split(' ').includes(role));}
if(typeof module!=='undefined'&&module.exports)module.exports={matches};
if(typeof document==='undefined')return;
const panels=[...document.querySelectorAll('.tab-panel')],tabs=[...document.querySelectorAll('[data-tab]')],form=document.getElementById('filters'),phase=document.getElementById('phase-filter'),role=document.getElementById('role-filter'),rows=[...document.querySelectorAll('.inventory-row')];
function select(id){for(const p of panels)p.hidden=p.id!==id;for(const a of tabs){if(a.dataset.tab===id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}}
function apply(){let events=0,tasks=0;for(const row of rows){row.hidden=!matches(row.dataset,phase.value,role.value);if(!row.hidden){if(row.classList.contains('event-row'))events++;else tasks++;}}
 document.getElementById('filter-count').textContent=`${events} of 420 events · ${tasks} of 65 tasks`;
 document.getElementById('filter-empty').hidden=events+tasks!==0;
 for(const group of document.querySelectorAll('.phase-events'))group.querySelector('.phase-count').textContent=[...group.querySelectorAll('.event-row')].filter(r=>!r.hidden).length;
}
function revealHash(){let id;try{id=decodeURIComponent(location.hash.slice(1));}catch(_){return;}if(!id){select('run');return;}const target=document.getElementById(id);if(!target)return;
 const panel=target.closest('.tab-panel');if(panel)select(panel.id);
 if(target.classList.contains('inventory-row')&&target.hidden){phase.value='';role.value='';apply();}
 let node=target;while(node){if(node.tagName==='DETAILS')node.open=true;node=node.parentElement;}
 requestAnimationFrame(()=>{target.scrollIntoView({block:'start'});if(!target.matches('a,button,input,select,summary'))target.setAttribute('tabindex','-1');target.focus({preventScroll:true});});
}
form.hidden=false;form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('change',apply);form.addEventListener('reset',()=>{phase.value='';role.value='';apply();});
window.addEventListener('hashchange',revealHash);document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a&&a.hash===location.hash)revealHash();});
select('run');apply();revealHash();
})();

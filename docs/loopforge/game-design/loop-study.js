/* Editorial figures load only when an active page brings them near the viewport. */
(()=>{
  const figures=[...document.querySelectorAll('img[data-study-src]')];
  const load=img=>{img.srcset=img.dataset.studySrcset;img.src=img.dataset.studySrc;delete img.dataset.studySrc;delete img.dataset.studySrcset;};
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(({isIntersecting,target})=>{if(isIntersecting){load(target);observer.unobserve(target);}}),{rootMargin:'120px'});
    figures.forEach(img=>observer.observe(img));
  }else{
    const loadVisible=()=>figures.filter(img=>img.dataset.studySrc&&!img.closest('[hidden]')).forEach(load);
    loadVisible();document.addEventListener('design:panelchange',loadVisible);
  }
  let dialog,opener;
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-study-inspect]');if(!button)return;
    if(!dialog){
      dialog=document.createElement('dialog');dialog.className='study-modal';dialog.setAttribute('aria-labelledby','study-modal-heading');
      const header=document.createElement('header');const heading=document.createElement('h2');heading.id='study-modal-heading';heading.textContent='Gameplay reference';
      const close=document.createElement('button');close.type='button';close.textContent='Close';close.addEventListener('click',()=>dialog.close());
      const zoom=document.createElement('button');zoom.type='button';zoom.textContent='Zoom details';zoom.setAttribute('aria-pressed','false');
      const viewport=document.createElement('div');viewport.className='study-zoomview';viewport.tabIndex=0;viewport.setAttribute('aria-label','Screenshot; scroll to inspect when zoomed');
      zoom.addEventListener('click',()=>{const on=viewport.classList.toggle('is-zoomed');zoom.textContent=on?'Fit image':'Zoom details';zoom.setAttribute('aria-pressed',String(on));});
      header.append(heading,zoom,close);const img=document.createElement('img');viewport.append(img);const caption=document.createElement('p');dialog.append(header,viewport,caption);document.body.append(dialog);
      dialog.addEventListener('close',()=>{dialog.querySelector('img').removeAttribute('src');viewport.classList.remove('is-zoomed');zoom.textContent='Zoom details';zoom.setAttribute('aria-pressed','false');opener?.focus();});
    }
    opener=button;const figure=button.closest('figure'),img=dialog.querySelector('img');img.alt=button.querySelector('img').alt;img.src=button.dataset.large;
    dialog.querySelector('p').textContent=figure.querySelector('figcaption').innerText;dialog.showModal();
  });
})();

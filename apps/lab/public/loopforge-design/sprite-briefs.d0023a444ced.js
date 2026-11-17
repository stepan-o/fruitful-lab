(() => {
  const search = document.getElementById('sb-search');
  const group = document.getElementById('sb-group');
  const priority = document.getElementById('sb-priority');
  const cards = [...document.querySelectorAll('.sb-card')];
  function filter() {
    const terms = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    for (const card of cards) {
      const visible = (!group.value || card.dataset.group === group.value)
        && (!priority.value || card.dataset.priority === priority.value)
        && terms.every(term => card.dataset.search.includes(term));
      card.hidden = !visible;
      if (visible) count++;
    }
    document.getElementById('sb-count').textContent = `${count} of ${cards.length} briefs · P0 first dependencies, P1 required completion`;
    document.getElementById('sb-empty').hidden = count !== 0;
  }
  search.addEventListener('input', filter);
  group.addEventListener('change', filter);
  priority.addEventListener('change', filter);
  function revealHash() {
    const target = document.getElementById(location.hash.slice(1));
    if (target?.classList.contains('sb-card')) {
      search.value = ''; group.value = ''; priority.value = ''; filter(); target.open = true;
      target.scrollIntoView({block: 'start'});
    }
  }
  window.addEventListener('hashchange', revealHash);
  revealHash();
  // Keep portable standalone navigation intact; embedded external links leave the frame.
  if (window.parent !== window) {
    for (const a of document.querySelectorAll('a[href]:not([download]):not([target])')) {
      if (!a.getAttribute('href').startsWith('#')) a.target = '_top';
    }
  }
})();

(() => {
  'use strict';
  const source = document.getElementById('style-review-data');
  if (!source) return;
  const studies = JSON.parse(source.textContent);
  const dialog = document.getElementById('style-viewer');
  const title = document.getElementById('style-viewer-title');
  const controls = document.getElementById('style-comparison-controls');
  const images = document.getElementById('style-viewer-images');
  const note = document.getElementById('style-viewer-note');
  const zoom = document.getElementById('style-zoom');
  const left = document.getElementById('style-left');
  const right = document.getElementById('style-right');
  let opener;
  right.value = studies[1].id;
  function render(ids) {
    images.replaceChildren(...ids.map(id => {
      const study = studies.find(x => x.id === id);
      const figure = document.createElement('figure');
      const caption = document.createElement('figcaption');
      const image = document.createElement('img');
      caption.textContent = study.title;
      image.src = study.src;
      image.alt = study.alt;
      image.width = 1536;
      image.height = 1024;
      image.decoding = 'async';
      figure.append(caption, image);
      return figure;
    }));
    images.classList.toggle('is-comparing', ids.length === 2);
    images.classList.remove('is-zoomed');
    zoom.setAttribute('aria-pressed', 'false');
    zoom.textContent = 'View full detail';
    note.textContent = ids.length === 1
      ? studies.find(x => x.id === ids[0]).watch
      : 'Compare silhouette, glass, material contrast and character presence. These selectors do not choose a final direction.';
  }
  function open(target, ids, comparison) {
    opener = target;
    controls.hidden = !comparison;
    title.textContent = comparison ? 'Compare style sheets' : studies.find(x => x.id === ids[0]).title;
    render(ids);
    dialog.showModal();
    document.documentElement.classList.add('style-modal-open');
  }
  document.querySelectorAll('[data-study]').forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    open(link, [link.dataset.study], false);
  }));
  document.getElementById('open-style-comparison').addEventListener('click', event => open(event.currentTarget, [left.value, right.value], true));
  document.getElementById('close-style-viewer').addEventListener('click', () => dialog.close());
  [left,right].forEach(select => select.addEventListener('change', () => render([left.value, right.value])));
  zoom.addEventListener('click', () => {
    const expanded = images.classList.toggle('is-zoomed');
    zoom.setAttribute('aria-pressed', String(expanded));
    zoom.textContent = expanded ? 'Fit sheets to view' : 'View full detail';
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('style-modal-open');
    opener?.focus();
  });
  document.addEventListener('design:panelchange', () => { if (dialog.open) dialog.close(); });
})();

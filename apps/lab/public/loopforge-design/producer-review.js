(() => {
  'use strict';
  const source = document.getElementById('producer-review-data');
  if (!source) return;
  const studies = JSON.parse(source.textContent);
  const dialog = document.getElementById('producer-viewer');
  const title = document.getElementById('producer-viewer-title');
  const controls = document.getElementById('producer-comparison-controls');
  const images = document.getElementById('producer-viewer-images');
  const note = document.getElementById('producer-viewer-note');
  const zoom = document.getElementById('producer-zoom');
  const left = document.getElementById('producer-left');
  const right = document.getElementById('producer-right');
  let opener;
  right.value = studies[1].id;
  function render(ids) {
    images.replaceChildren(...ids.map(id => {
      const study = studies.find(x => x.id === id);
      const figure = document.createElement('figure');
      const caption = document.createElement('figcaption');
      const image = document.createElement('img');
      figure.style.setProperty('--producer-native-width', `${study.width}px`);
      caption.textContent = study.title;
      image.src = study.src;
      image.alt = study.alt;
      image.width = study.width;
      image.height = study.height;
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
      : 'Wide concepts show the visual origin; portrait images are clean runtime plates with live rooms and native controls added in play. Compare composition and control ownership. Visual QA is underway; this viewer does not change the selected skin.';
  }
  function open(target, ids, comparison) {
    opener = target;
    controls.hidden = !comparison;
    title.textContent = comparison ? 'Compare producer consoles' : studies.find(x => x.id === ids[0]).title;
    render(ids);
    dialog.showModal();
    document.documentElement.classList.add('producer-modal-open');
  }
  document.querySelectorAll('[data-producer-study]').forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    open(link, [link.dataset.producerStudy], false);
  }));
  document.getElementById('open-producer-comparison').addEventListener('click', event => open(event.currentTarget, [left.value, right.value], true));
  document.querySelectorAll('[data-producer-pair]').forEach(button => button.addEventListener('click', () => {
    left.value = `${button.dataset.producerPair}-wide`;
    right.value = `${button.dataset.producerPair}-portrait`;
    open(button, [left.value, right.value], true);
  }));
  document.getElementById('close-producer-viewer').addEventListener('click', () => dialog.close());
  [left,right].forEach(select => select.addEventListener('change', () => render([left.value, right.value])));
  zoom.addEventListener('click', () => {
    const expanded = images.classList.toggle('is-zoomed');
    zoom.setAttribute('aria-pressed', String(expanded));
    zoom.textContent = expanded ? 'Fit images to view' : 'View full detail';
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('producer-modal-open');
    opener?.focus();
  });
  document.addEventListener('design:panelchange', () => { if (dialog.open) dialog.close(); });
})();

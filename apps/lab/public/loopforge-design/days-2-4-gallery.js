(() => {
  const section = document.getElementById('days-2-4-art');
  if (!section) return;
  const viewer = section.querySelector('.shift-art-viewer');
  const controls = viewer.querySelector('.shift-art-controls');
  const scene = controls.querySelector('[name="scene"]');
  const viewport = controls.querySelector('[name="viewport"]');
  const description = viewer.querySelector('.shift-art-description');
  const status = viewer.querySelector('.shift-art-status');
  const retry = viewer.querySelector('.shift-art-retry');
  const shots = viewer.querySelector('.shift-art-shots');
  const dialog = section.querySelector('dialog');
  const inspection = dialog.querySelector('.shift-art-inspection');
  const indexUrl = new URL(viewer.dataset.index, document.baseURI);
  let groups = [];

  function inspect(event) {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const preview = event.currentTarget.querySelector('img');
    const image = preview.cloneNode();
    image.loading = 'eager';
    inspection.replaceChildren(image);
    dialog.querySelector('h4').textContent = event.currentTarget.dataset.title;
    dialog.showModal();
    inspection.scrollTo(0, 0);
  }
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => inspection.replaceChildren());

  function render() {
    const group = groups.find(item => item.id === scene.value);
    description.textContent = group.description;
    shots.replaceChildren();
    for (const shot of group.shots) {
      const variant = shot.images[viewport.value];
      if (!variant) continue;
      const figure = document.createElement('figure');
      const link = document.createElement('a');
      const img = document.createElement('img');
      const caption = document.createElement('figcaption');
      const title = document.createElement('strong');
      const detail = document.createElement('span');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.width = variant.width;
      img.height = variant.height;
      img.alt = shot.description || shot.title;
      img.src = new URL(variant.file, indexUrl).href;
      link.href = img.src;
      link.dataset.title = shot.title + ' · ' + img.width + ' × ' + img.height;
      link.setAttribute('aria-label', 'Inspect at native size: ' + link.dataset.title);
      link.addEventListener('click', inspect);
      title.textContent = shot.title;
      detail.textContent = shot.description;
      link.append(img);
      caption.append(title, detail);
      figure.append(link, caption);
      shots.append(figure);
    }
    status.textContent = shots.childElementCount
      ? 'Select a proof to inspect its native pixels.'
      : 'This viewport has no proofs for this scene.';
  }

  async function load() {
    retry.hidden = true;
    status.textContent = 'Loading proof comparisons…';
    try {
      const response = await fetch(indexUrl);
      if (!response.ok) throw new Error('Unavailable index');
      const index = await response.json();
      if (index.version !== 1 || !index.groups?.length) throw new Error('Unsupported index');
      groups = index.groups;
      scene.replaceChildren(...groups.map(group => new Option(group.title, group.id)));
      viewport.value = window.innerWidth <= 350 ? 'narrow' : window.innerWidth <= 600 ? 'phone' : 'desktop';
      controls.hidden = false;
      render();
    } catch {
      status.textContent = 'The proof index could not be loaded.';
      retry.hidden = false;
    }
  }
  scene.addEventListener('change', render);
  viewport.addEventListener('change', render);
  retry.addEventListener('click', load);
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      observer.disconnect();
      load();
    }
  }, { rootMargin: '200px' });
  observer.observe(viewer);
})();

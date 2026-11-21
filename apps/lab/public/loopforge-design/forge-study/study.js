(() => {
  const body = document.body;
  const frames = [...document.querySelectorAll('.frame')];
  const frameButtons = [...document.querySelectorAll('[data-frame]')];
  const deviceButtons = [...document.querySelectorAll('button[data-device]')];
  const annotate = document.getElementById('annotate');
  const sequence = document.getElementById('sequence');
  const status = document.getElementById('status');
  let current = 0;
  let device = matchMedia('(max-width:767px)').matches ? 'phone' : 'desktop';
  let compare = false;
  let notes = false;
  function render() {
    body.dataset.device = device;
    body.classList.toggle('compare', compare);
    body.classList.toggle('notes', notes);
    frames.forEach((frame, i) => { frame.hidden = compare ? i === 0 : i !== current; });
    frameButtons.forEach((button, i) => { button.setAttribute('aria-pressed', String(!compare && i === current)); });
    deviceButtons.forEach(button => { button.setAttribute('aria-pressed', String(device === button.dataset.device)); });
    sequence.setAttribute('aria-pressed', String(compare));
    annotate.setAttribute('aria-pressed', String(notes));
    annotate.textContent = notes ? 'Hide annotations' : 'Show annotations';
    status.textContent = compare ? 'Three close-ups in order' : frameButtons[current].textContent;
  }
  frameButtons.forEach((button, i) => button.addEventListener('click', () => { current = i; compare = false; render(); }));
  deviceButtons.forEach(button => button.addEventListener('click', () => { device = button.dataset.device; render(); }));
  sequence.addEventListener('click', () => { compare = !compare; render(); });
  annotate.addEventListener('click', () => { notes = !notes; render(); });
  render();
  body.classList.add('enhanced');
})();

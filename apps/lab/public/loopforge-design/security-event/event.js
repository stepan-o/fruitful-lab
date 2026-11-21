const byId = id => document.getElementById(id);
const views = {
  watch: 'held', returned: 'held', case: 'held',
  issued: 'issued', expired: 'closed', closed: 'closed',
};
const floorText = {
  held: ['No ID. Hold both desks.', 'bob stands before LIMEN at the held checkpoint.'],
  issued: ['Good until the bell. Through you go.', 'bob crosses the outgoing gate with a day pass. jo advances toward the desk.'],
  closed: ['', 'bob remains at Security after the missing-ID case closes.'],
};

async function prepare() {
  const response = await fetch('floor.json');
  if (!response.ok) throw new Error('Unable to load the saved checkpoint.');
  const states = await response.json();

  function render(focus) {
    const hash = location.hash.slice(1);
    const name = Object.hasOwn(views, hash) ? hash : 'watch';
    const state = states[views[name]];
    const open = state.caseStatus === 'open';
    const inspecting = name === 'case' || name === 'expired';
    byId('watch').hidden = inspecting;
    byId('inspection').hidden = !inspecting;
    byId('issue').hidden = !open || Boolean(state.spent);
    byId('marker').hidden = !open;
    byId('return').href = open ? '#returned' : '#closed';
    byId('inventory').textContent = state.spent ? 'Intervention spent' : '1 intervention available';
    const receiver = document.querySelector('.receiver');
    receiver.dataset.state = views[name];
    for (const [device, width, height] of [['desktop', 760, 540], ['phone', 390, 480]]) {
      for (const actor of ['bob', 'LIMEN']) {
        const [x, y] = state.cameras[device][actor];
        const prefix = '--' + device + '-' + actor.toLowerCase();
        receiver.style.setProperty(prefix + '-x', (100 * x / width) + '%');
        receiver.style.setProperty(prefix + '-y', (100 * y / height) + '%');
      }
    }
    document.querySelector('.exchange').open = false;
    if (focus) document.querySelector('.review details').open = false;
    byId('effect').textContent = open ? 'Admit bob until the bell. Uses today’s one intervention.' : 'The decision window has closed. bob is held at Security until the bell.';
    const [speech,alt] = floorText[views[name]];
    byId('floor-speech').hidden = !speech;
    byId('floor-speech').querySelector('span').textContent = speech;
    byId('floor-picture').querySelector('source').srcset = views[name]+'-phone.webp';
    byId('floor').src = views[name]+'-desktop.webp';
    byId('floor').alt = alt;
    byId('floor-receipt').hidden = open;
    byId('floor-receipt').textContent = state.pass?.valid ? 'Day pass issued · bob cleared the gate. jo is next.' : 'Case closed · bob is held until the bell.';
    if (focus) {
      const target = name === 'returned' ? byId('marker') : byId(inspecting ? 'event-title' : 'room-title');
      target.focus({preventScroll:true});
      window.scrollTo(0,0);
    }
  }
  window.addEventListener('hashchange', () => render(true));
  render(false);
}
prepare().catch(error => {
  byId('marker').hidden = true;
  byId('floor-receipt').hidden = false;
  byId('floor-receipt').textContent = error.message;
});

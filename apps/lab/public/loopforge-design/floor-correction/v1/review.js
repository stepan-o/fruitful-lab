const controls = document.getElementById('controls');
const plate = document.getElementById('plate');
const frame = document.getElementById('frame');
const rooms = {
  security: {
    title: 'Security · Missing ID', tick: 5671,
    description: 'Follow the teal shaft from the back of the held queue toward the register. The grip and heel wear sit at the desk approach.',
  },
  conveyor: {
    title: 'Conveyor · Conveyor chat', tick: 6142,
    description: 'Follow the amber fan from the press louver across the staffed line. The workpiece is at Wash. The 320 px camera puts part of the band behind bob’s speech plate.',
  },
};
// The capture service resampled the complete viewport. Percentages below use
// CSS coordinates measured against the original viewport, before that resample.
const cameras = {
  desktop: {width:872, height:370, viewWidth:1280, x:196.5, y:222.03125, cssHeight:369.796875},
  phone: {width:289, height:266, viewWidth:320, x:8, y:163.53125, cssHeight:266.390625},
};
const labels = {live:'Production capture · existing floor', before:'Composed proof · existing floor', after:'Composed proof · proposed floor'};

function showCamera() {
  const room = controls.elements.room.value;
  const size = controls.elements.size.value;
  const version = controls.elements.version.value;
  const camera = cameras[size];
  const data = rooms[room];
  const live = version === 'live';
  const prefix = 'proofs/' + room + '-' + size + '-';
  const original = prefix + 'live.jpg';
  document.body.classList.toggle('phone', size === 'phone');
  frame.classList.toggle('live', live);
  plate.alt = data.title + '. ' + labels[version] + '. ' + size + ' camera.';
  plate.style.width = live ? (100 * camera.viewWidth / camera.width) + '%' : '';
  plate.style.left = live ? (-100 * camera.x / camera.width) + '%' : '';
  plate.style.top = live ? (-100 * camera.y / camera.cssHeight) + '%' : '';
  plate.src = live ? original : prefix + version + '.webp';
  document.getElementById('title').textContent = data.title;
  document.getElementById('context').textContent = 'Day 2 · tick ' + data.tick + ' · ' + camera.width + ' × ' + camera.height + ' camera';
  document.getElementById('provenance').textContent = labels[version];
  document.getElementById('description').textContent = data.description;
  document.getElementById('capture').href = original;
  document.getElementById('repeat').href = 'proofs/' + room + '-material-4x3.webp';
}
if (matchMedia('(max-width: 520px)').matches) controls.elements.size.value = 'phone';
controls.addEventListener('change', showCamera);
showCamera();

if (location.protocol === 'file:') {
  document.querySelector('.download').hidden = true;
  for (const link of document.querySelectorAll('a[href^="/"]')) {
    link.href = 'https://www.fruitfulab.net' + link.getAttribute('href');
  }
}

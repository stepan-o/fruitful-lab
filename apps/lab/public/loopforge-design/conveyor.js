(() => {
  const root = document.querySelector('#conveyor');
  if (!root) return;
  const choices = Array.from(root.querySelectorAll('[data-conveyor-choice]'));
  const layouts = Array.from(root.querySelectorAll('[data-conveyor-layout]'));
  const announcement = root.querySelector('[data-conveyor-announcement]');
  choices.forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.conveyorChoice;
    choices.forEach(choice => choice.setAttribute('aria-pressed', String(choice === button)));
    layouts.forEach(layout => { layout.hidden = layout.dataset.conveyorLayout !== selected; });
    if (announcement) announcement.textContent = button.textContent.trim() + ' comparison selected.';
  }));
})();

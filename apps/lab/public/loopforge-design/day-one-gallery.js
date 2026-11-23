(() => {
  const gallery = document.getElementById('day-one-art-calibration');
  const players = gallery.querySelectorAll('video');
  const posters = new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) {
      if (isIntersecting) {
        target.poster = target.dataset.poster;
        posters.unobserve(target);
      }
    }
  }, { rootMargin: '180px' });
  players.forEach(player => posters.observe(player));

  function pauseHiddenPlayers() {
    for (const player of players) {
      if (!player.paused && !player.getClientRects().length) player.pause();
    }
  }
  document.addEventListener('design:panelchange', pauseHiddenPlayers);
  gallery.addEventListener('toggle', pauseHiddenPlayers, true);
})();

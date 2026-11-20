// Audition controls also work in the complete reading copy. No automatic playback.
(() => {
  const clips = Array.from(document.querySelectorAll('[data-sound-preview]'));
  // Link the cast and sound readers to their shared voice-acting page.
  for (const anchor of document.querySelectorAll('a[download][href$="OPENING_CAST.md"], a[download][href$="SOUND_LIBRARY.md"]')) {
    const link = document.createElement('a');
    link.href = '/loopforge-design/voice-acting/index.html';
    link.textContent = 'Voice acting · Recordings and process';
    anchor.before(link, ' · ');
  }
  function pauseAll() { clips.forEach(clip => clip.pause()); }
  for (const clip of clips) {
    clip.addEventListener('play', () => {
      clips.forEach(other => { if (other !== clip) other.pause(); });
    });
    clip.addEventListener('error', () => {
      const status = clip.closest('.sound-card').querySelector('[data-sound-status]');
      status.textContent = 'Preview unavailable. Try the download link or reload the page.';
    });
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseAll(); });
  document.addEventListener('design:panelchange', () => {
    const panel = document.getElementById('sound-library');
    if (panel?.hidden) pauseAll();
  });
  window.addEventListener('pagehide', pauseAll);
})();

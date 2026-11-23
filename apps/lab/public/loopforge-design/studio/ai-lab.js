// Plain fragment links expose all three sections when scripting is unavailable.
const views = document.querySelector("#views");
const links = [...views.querySelectorAll("a")];
const panels = links.map(link => document.querySelector(link.hash));

function showView(hash) {
  const selected = panels.find(panel => "#" + panel.id === hash) || panels[0];
  for (const [index, panel] of panels.entries()) {
    panel.hidden = panel !== selected;
    if (panel === selected) links[index].setAttribute("aria-current", "location");
    else links[index].removeAttribute("aria-current");
  }
  return selected;
}

function restoreView() {
  showView(window.location.hash);
}

document.addEventListener("click", event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (!panels.some(panel => "#" + panel.id === link.hash)) return;
  event.preventDefault();
  if (window.location.hash !== link.hash) history.pushState(null, "", link.hash);
  const panel = showView(link.hash);
  if (!views.contains(link)) {
    panel.querySelector("h2").focus({ preventScroll: true });
    views.scrollIntoView({ block: "start" });
  }
});

window.addEventListener("popstate", restoreView);
window.addEventListener("hashchange", restoreView);
restoreView();

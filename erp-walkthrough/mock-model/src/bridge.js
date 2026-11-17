// Reports clicks on [data-action] controls to a hosting window (the walkthrough).
// Does nothing when the app is not framed.
export function installBridge(getScreenCode) {
  if (window.parent === window) return;
  document.addEventListener('click', (event) => {
    const el = event.target.closest('[data-action]');
    if (!el) return;
    window.parent.postMessage(
      { source: 'tera-mock-model', type: 'action', action: el.dataset.action, screen: getScreenCode() },
      location.origin
    );
  });
}

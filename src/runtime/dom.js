export function bindEvents(view) {
  window.addEventListener('languagechange', view);
  window.addEventListener('moztimechange', view);
  window.addEventListener('timeformatchange', view);
}

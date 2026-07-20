(() => {
  const STORAGE_KEY = 'tempo-theme';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function setTheme(theme, { persist = true } = {}) {
    const root = document.documentElement;
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    if (persist) localStorage.setItem(STORAGE_KEY, theme);
  }

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  // Call this synchronously in <head> to set the theme before first paint.
  function applyInitial() {
    const saved = localStorage.getItem(STORAGE_KEY);
    setTheme(saved || (prefersDark.matches ? 'dark' : 'light'), { persist: false });
  }

  // Call this once the toggle button exists in the DOM.
  function initToggle(buttonId) {
    const toggleBtn = document.getElementById(buttonId);
    if (!toggleBtn) return;
    const icon = toggleBtn.querySelector('.theme-toggle__icon');

    function reflect(theme) {
      toggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      if (icon) icon.textContent = theme === 'dark' ? '🌞' : '🌙';
    }
    reflect(currentTheme());

    toggleBtn.addEventListener('click', () => {
      const root = document.documentElement;
      if (!root.classList.contains('theme-animate')) {
        root.classList.add('theme-animate');
        setTimeout(() => root.classList.remove('theme-animate'), 550);
      }
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      setTheme(next);
      reflect(next);
    });

    prefersDark.addEventListener('change', (e) => {
      if (localStorage.getItem(STORAGE_KEY)) return;
      const next = e.matches ? 'dark' : 'light';
      setTheme(next, { persist: false });
      reflect(next);
    });
  }

  window.Theme = Object.freeze({ applyInitial, initToggle });
})();

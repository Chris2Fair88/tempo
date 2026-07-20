(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    if (window.Theme) Theme.initToggle('themeToggle');

    const navToggle = document.getElementById('navToggle');
    const nav = document.getElementById('siteNav');
    if (navToggle && nav) {
      navToggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('site-header__nav--open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
      });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn && window.Auth) {
      logoutBtn.addEventListener('click', () => Auth.logout());
    }
  });
})();

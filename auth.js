(() => {
  const ROLE_KEY = 'tempo-role';
  const ROUTES = { student: 'student.html', teacher: 'teacher.html', admin: 'admin.html' };

  const Auth = {
    getRole() {
      return localStorage.getItem(ROLE_KEY);
    },
    setRole(role) {
      localStorage.setItem(ROLE_KEY, role);
    },
    routeFor(role) {
      return ROUTES[role] || 'index.html';
    },
    // Call synchronously in <head> so unauthorized visitors are redirected
    // before the protected page has a chance to paint.
    requireRole(role) {
      if (Auth.getRole() !== role) window.location.replace('login.html');
    },
    logout() {
      localStorage.removeItem(ROLE_KEY);
      window.location.href = 'login.html';
    },
  };

  window.Auth = Object.freeze(Auth);
})();

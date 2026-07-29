// Enhanced role-based auth system with proper authentication
export const ROLE_KEY = 'tempo-role';
export const USER_ID_KEY = 'tempo-user-id';
export const USER_DATA_KEY = 'tempo-user-data';

export const DASHBOARD_ROUTE_BY_ROLE = Object.freeze({
  admin: '/admin',
  teacher: '/teacher',
  student: '/student',
  parent: '/parent',
});

function notifyRoleChange() {
  try {
    window.dispatchEvent(new Event('tempo:rolechange'));
  } catch (err) { // eslint-disable-line no-unused-vars
    // no-op in non-browser envs
  }
}

export function setRole(role) {
  if (typeof role === 'string') {
    localStorage.setItem(ROLE_KEY, role);
    notifyRoleChange();
  }
}

export function getRole() {
  return localStorage.getItem(ROLE_KEY);
}

export function setUserId(id) {
  if (id != null) {
    localStorage.setItem(USER_ID_KEY, String(id));
    notifyRoleChange();
  }
}

export function getUserId() {
  const v = localStorage.getItem(USER_ID_KEY);
  return v ? Number(v) : null;
}

export function setUserData(userData) {
  if (userData) {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }
}

export function getUserData() {
  const data = localStorage.getItem(USER_DATA_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearAuth() {
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  notifyRoleChange();
}

/**
 * Set authentication data (role and user info determined by backend)
 * @param {Object} userData - User data from authentication
 */
export function setAuth(userData) {
  if (userData && userData.role && userData.id) {
    setRole(userData.role);
    setUserId(userData.id);
    setUserData(userData);
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean} - Authentication status
 */
export function isAuthenticated() {
  return !!(getRole() && getUserId());
}

// Backward compatibility
export function clearRole() {
  clearAuth();
}

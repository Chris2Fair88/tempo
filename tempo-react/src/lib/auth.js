// Simple role-based auth helpers using localStorage
export const ROLE_KEY = 'tempo-role';
export const USER_ID_KEY = 'tempo-user-id';

export const DASHBOARD_ROUTE_BY_ROLE = Object.freeze({
  admin: '/admin',
  teacher: '/teacher',
  student: '/student',
  parent: '/student', // Parent shares Student dashboard
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

export function clearRole() {
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_ID_KEY);
  notifyRoleChange();
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

export function setAuth(role, id) {
  setRole(role);
  if (id != null) setUserId(id);
}

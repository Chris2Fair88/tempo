/**
 * Role-based access control utilities
 * 
 * Provides helper functions and hooks for managing user permissions
 * and role-based access throughout the application.
 */

import { getRole } from './auth';

/**
 * Hook for checking user role permissions
 */
export function useRolePermissions(requiredRoles = []) {
  const currentRole = getRole();
  
  return {
    hasPermission: currentRole && requiredRoles.includes(currentRole),
    currentRole,
    isLoggedIn: !!currentRole
  };
}

/**
 * Get appropriate redirect path based on user role
 */
export function getRedirectPathForRole(userRole) {
  switch (userRole) {
    case 'admin':
      return '/admin';
    case 'teacher':
      return '/teacher';
    case 'student':
      return '/student';
    case 'parent':
      return '/student'; // Parents see student view
    default:
      return '/';
  }
}

/**
 * Check if user has permission to access a route
 */
export function hasRoutePermission(allowedRoles) {
  const currentRole = getRole();
  
  if (!currentRole) {
    return false;
  }
  
  return allowedRoles.includes(currentRole);
}

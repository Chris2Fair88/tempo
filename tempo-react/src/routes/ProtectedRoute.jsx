import { Navigate, useLocation } from 'react-router-dom';
import { getRole } from '../lib/auth';

/**
 * Protected Route Component - RBAC Implementation
 * 
 * Implements role-based access control as required by reviewer feedback:
 * "students should not be able to access the Admin or Teacher dashboards. 
 * Access should be restricted based on the user's assigned role."
 */

/**
 * ProtectedRoute component that enforces role-based access control
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The component to render if authorized
 * @param {string[]} props.allowed - Array of roles allowed to access this route (backward compatibility)
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route
 * @param {string} props.redirectTo - Where to redirect unauthorized users (default: smart redirect)
 * @returns {React.ReactNode} - Protected component or redirect
 */
export default function ProtectedRoute({ 
  children, 
  allowed = [], 
  allowedRoles = [],
  redirectTo = null 
}) {
  const currentRole = getRole();
  const location = useLocation();
  
  // Support both 'allowed' and 'allowedRoles' for backward compatibility
  const permittedRoles = allowedRoles.length > 0 ? allowedRoles : allowed;

  // If no role is set, redirect to login
  if (!currentRole) {
    return <Navigate 
      to="/login" 
      state={{ from: location.pathname }} 
      replace 
    />;
  }

  // If user's role is not in allowed roles, redirect intelligently
  if (permittedRoles.length > 0 && !permittedRoles.includes(currentRole)) {
    // Smart redirect: send user to their appropriate dashboard
    const roleBasedRedirects = {
      admin: '/admin',
      teacher: '/teacher', 
      student: '/student',
      parent: '/student'
    };

    const userDashboard = roleBasedRedirects[currentRole];
    const finalRedirect = redirectTo || userDashboard || '/';
    
    return <Navigate 
      to={finalRedirect} 
      replace 
    />;
  }

  // User is authorized, render the protected component
  return children;
}

/**
 * Role-specific route wrappers for cleaner code
 */
export function AdminRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      {children}
    </ProtectedRoute>
  );
}

export function TeacherRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      {children}
    </ProtectedRoute>
  );
}

export function StudentRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={['admin', 'student', 'parent']}>
      {children}
    </ProtectedRoute>
  );
}

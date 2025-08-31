import { Navigate } from 'react-router-dom';
import { getRole } from '../lib/auth';

export default function ProtectedRoute({ allowed = [], children }) {
  const role = getRole();
  if (!role || (allowed.length && !allowed.includes(role))) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

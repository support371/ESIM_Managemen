import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { hasMinRole } from '@/lib/roleUtils';

export default function RoleRoute({ minRole, allowedRoles }) {
  const { user } = useAuth();
  const role = user?.role || 'customer';
  const isAllowed = allowedRoles
    ? allowedRoles.includes(role)
    : hasMinRole(role, minRole);

  return isAllowed ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

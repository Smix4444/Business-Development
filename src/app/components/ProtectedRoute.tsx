import { Navigate } from 'react-router';
import { useAuth, UserRole } from '../context/auth-context';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ROLE_DASHBOARDS: Record<string, string> = {
  student: '/swipe',
  company: '/company',
  school: '/school',
  admin: '/admin',
};

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { role, loading } = useAuth();

  // Show loading state while auth is being restored
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-base)',
        color: 'var(--text-muted)',
        gap: '0.5rem',
        fontSize: '0.88rem',
      }}>
        <RefreshCw size={16} className="spin" />
        Loading…
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Role check: if allowedRoles specified, ensure user has correct role
  if (allowedRoles && !allowedRoles.includes(role)) {
    const correctDashboard = ROLE_DASHBOARDS[role] || '/';
    return <Navigate to={correctDashboard} replace />;
  }

  return <>{children}</>;
}

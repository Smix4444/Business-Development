import { Navigate } from 'react-router';
import { useAuth } from '../context/auth-context';
import { LandingPage } from '../../features/landing/LandingPage';
import { RefreshCw } from 'lucide-react';

const ROLE_DASHBOARDS: Record<string, string> = {
  student: '/swipe',
  company: '/company',
  school: '/school',
  admin: '/admin',
};

export function RootRedirect() {
  const { role, loading } = useAuth();

  // During auth restoration, show a brief loading state instead of flashing the landing page
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

  // Authenticated users go straight to their dashboard
  if (role) {
    const dashboard = ROLE_DASHBOARDS[role] || '/swipe';
    return <Navigate to={dashboard} replace />;
  }

  // Unauthenticated users see the landing page
  return <LandingPage />;
}

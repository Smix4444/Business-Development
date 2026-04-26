import { useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { useApplications } from '../../app/context/application-context';
import './MatchesPage.css';

const STATUS_CONFIG = {
  pending:  { label: 'Applied',    color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)',  icon: <Clock3 size={11} /> },
  accepted: { label: 'Accepted',   color: '#22C55E', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.2)',   icon: <CheckCircle2 size={11} /> },
  rejected: { label: 'Not Selected', color: '#EF4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)',  icon: <XCircle size={11} /> },
} as const;

type AppStatus = keyof typeof STATUS_CONFIG;

export function MatchesPage() {
  const { applications, refreshApplications } = useApplications();

  useEffect(() => { refreshApplications(); }, [refreshApplications]);

  const AppCard = ({ app, idx }: { app: typeof applications[0]; idx: number }) => {
    const status = (app.status || 'pending') as AppStatus;
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
      <motion.div
        className="app-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.055, duration: 0.4 }}
        layout
      >
        <div className="app-card-img" style={{ backgroundImage: `url(${app.internship.logo})` }} />
        <div className="app-card-content">
          <div
            className="status-badge"
            style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
          >
            {cfg.icon}
            {cfg.label}
          </div>
          <h3 className="app-role">{app.internship.role}</h3>
          <p className="app-company">{app.internship.company}</p>
          <div className="card-tags" style={{ marginBottom: '0.85rem' }}>
            <span className="tag"><MapPin size={11} /> {app.internship.location}</span>
            <span className="tag"><Clock size={11} /> {app.internship.duration}</span>
          </div>
          <div className="message-bubble">"{app.message}"</div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="matches-page">
      <header className="main-header">
        <div className="app-title">InternMatch</div>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/swipe" className="nav-link">Swipe</Link>
          <div className="nav-link" style={{ color: '#22C55E' }}>
            <CheckCircle2 size={15} />
            <span>{applications.length} Applied</span>
          </div>
        </nav>
      </header>

      <main className="matches-container">
        <div className="matches-header">
          <div>
            <h1 className="matches-title">My Applications</h1>
            <p className="matches-count">
              {applications.length === 0
                ? 'No applications yet — start swiping.'
                : `${applications.length} application${applications.length !== 1 ? 's' : ''} sent.`}
            </p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={48} style={{ margin: '0 auto 1rem', color: '#888888', display: 'block' }} />
            <h2>No applications yet</h2>
            <p>Go back to swiping to find your dream internship.</p>
            <Link to="/swipe" className="login-btn" style={{ textDecoration: 'none', display: 'inline-flex', marginTop: '1.75rem' }}>
              Start Swiping
            </Link>
          </div>
        ) : (
          <div className="apps-list">
            {applications.map((app, idx) => <AppCard key={idx} app={app} idx={idx} />)}
          </div>
        )}
      </main>
    </div>
  );
}

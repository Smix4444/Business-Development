import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { useApplications } from '../../app/context/application-context';
import './MatchesPage.css';

export function MatchesPage() {
  const { applications, refreshApplications } = useApplications();

  useEffect(() => {
    refreshApplications();
  }, [refreshApplications]);

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
          <h1 className="matches-title">My Applications</h1>
          <p className="matches-count">
            {applications.length === 0
              ? 'No applications yet — start swiping.'
              : `${applications.length} personalised application${applications.length !== 1 ? 's' : ''} sent.`}
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={48} style={{ margin: '0 auto 1rem', color: '#2A2A2A', display: 'block' }} />
            <h2>No applications yet</h2>
            <p>Go back to swiping to find your dream internship.</p>
            <Link to="/swipe" className="login-btn" style={{ textDecoration: 'none', display: 'inline-flex', marginTop: '1.75rem' }}>
              Start Swiping
            </Link>
          </div>
        ) : (
          <div className="apps-list">
            {applications.map((app, idx) => (
              <motion.div
                key={idx}
                className="app-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07, duration: 0.45 }}
              >
                <div className="app-card-img" style={{ backgroundImage: `url(${app.internship.logo})` }} />
                <div className="app-card-content">
                  <div className="status-badge">
                    <CheckCircle2 size={11} />
                    {app.status || 'Applied'}
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router';
import { Home, Briefcase, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { useApplications } from '../../app/context/application-context';
import './MatchesPage.css';

export function MatchesPage() {
  const { applications } = useApplications();

  return (
    <div className="matches-page">
      <header className="main-header">
        <div className="app-title">InternMatch</div>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/swipe" className="nav-link">Swipe</Link>
          <div className="nav-link">
            <CheckCircle2 size={18} />
            <span>{applications.length} Applied</span>
          </div>
        </nav>
      </header>

      <main className="matches-container">
        <div className="matches-header">
          <h1 className="matches-title">My Applications</h1>
          <p className="matches-count">
            You've sent {applications.length} personalized applications.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={64} className="mx-auto mb-4 text-pink-200" />
            <h2>No applications yet!</h2>
            <p>Go back to swiping to find your dream internship.</p>
            <Link to="/swipe" className="login-btn" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '2rem' }}>
              Start Swiping
            </Link>
          </div>
        ) : (
          <div className="apps-list">
            {applications.map((app, idx) => (
              <div key={idx} className="app-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div 
                  className="app-card-img" 
                  style={{ backgroundImage: `url(${app.internship.logo})` }}
                />
                <div className="app-card-content">
                  <div className="status-badge">Applied</div>
                  <h3 className="app-role">{app.internship.role}</h3>
                  <p className="app-company">{app.internship.company}</p>
                  
                  <div className="card-tags" style={{ marginBottom: '1rem' }}>
                    <span className="tag"><MapPin size={12} /> {app.internship.location}</span>
                    <span className="tag"><Clock size={12} /> {app.internship.duration}</span>
                  </div>

                  <div className="message-bubble">
                    {app.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

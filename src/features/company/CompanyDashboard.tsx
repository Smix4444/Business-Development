import React from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Briefcase, Users, Eye, Star, LogOut, Plus, Settings } from 'lucide-react';

import { useAuth } from '../../app/context/auth-context';
import './CompanyDashboard.css';

const mockApplicants = [
  { name: 'Jonas De Smet', role: 'Software Engineering Intern', msg: 'I\'m really passionate about building scalable products and I\'ve been following your work...' },
  { name: 'Lena Braun', role: 'UX/UI Design Intern', msg: 'Your design philosophy matches my thesis on human-centered interaction...' },
  { name: 'Marco Rossi', role: 'Data Science Intern', msg: 'I built a recommendation engine last semester using very similar tech to what you use...' },
  { name: 'Aisha Patel', role: 'Product Management Intern', msg: 'I\'ve been using your product for 2 years and have detailed notes on potential improvements...' },
];

export function CompanyDashboard() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CO';

  return (
    <div className="company-page">
      <header className="company-header">
        <div className="company-header-title">InternMatch <span style={{ opacity: 0.5, fontSize: '0.875rem', fontWeight: 400 }}>for Companies</span></div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="company-action-btn" onClick={() => navigate('/settings')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)' }}>
            <Settings size={16} /> Settings
          </button>
          <button className="company-action-btn" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="company-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="company-welcome">
            Welcome, <span>{profile?.company || 'Company'}</span> 👋
          </h1>
          <p className="company-subtext">Here's a quick overview of your internship activity.</p>

          <div className="company-stats-grid">
            <div className="stat-card">
              <span className="stat-number">4</span>
              <div className="stat-label">New Applicants</div>
            </div>
            <div className="stat-card">
              <span className="stat-number">2</span>
              <div className="stat-label">Active Positions</div>
            </div>
            <div className="stat-card">
              <span className="stat-number">127</span>
              <div className="stat-label">Profile Views</div>
            </div>
            <div className="stat-card">
              <span className="stat-number">89%</span>
              <div className="stat-label">Response Rate</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Recent Applicants</h2>
            <button className="company-action-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} /> Post a Position
            </button>
          </div>

          <div className="applicants-grid">
            {mockApplicants.map((a, i) => (
              <motion.div 
                key={i} 
                className="applicant-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="applicant-avatar">{initials(a.name)}</div>
                <div className="applicant-name">{a.name}</div>
                <div className="applicant-role">{a.role}</div>
                <p className="applicant-message">"{a.msg}"</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="status-pill"><Star size={12} /> Review</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

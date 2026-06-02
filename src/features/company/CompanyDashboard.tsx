import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Briefcase, LogOut, Plus, Settings } from 'lucide-react';
import { useAuth } from '../../app/context/auth-context';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import './CompanyDashboard.css';

interface Applicant {
  id: number;
  message: string;
  status: string;
  appliedAt: string;
  student: { name: string; email: string; bio: string; photo: string | null };
  internship: { role: string; company: string };
}

export function CompanyDashboard() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  useEffect(() => {
    api.get<Applicant[]>('/applications').then(setApplicants).catch(() => toast.error('Failed to load applicants'));
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const initials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CO';

  return (
    <div className="company-page">
      <header className="company-header">
        <div className="company-header-title">
          InternMatch <span>for Companies</span>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button className="company-action-btn" onClick={() => navigate('/settings')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Settings size={14} /> Settings
          </button>
          <button className="company-action-btn" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <main className="company-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="company-welcome">
            Welcome, <span>{profile?.company || profile?.name || 'Company'}</span>
          </h1>
          <p className="company-subtext">Here's an overview of your internship activity.</p>

          <div className="company-stats-grid">
            {[
              { num: applicants.length, label: 'Total Applicants' },
              { num: applicants.filter(a => a.status === 'pending').length, label: 'Pending Review' },
              { num: applicants.filter(a => a.status === 'accepted').length, label: 'Accepted' },
              { num: applicants.length > 0 ? `${Math.round((applicants.filter(a => a.status !== 'pending').length / applicants.length) * 100)}%` : '—', label: 'Response Rate' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="stat-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <span className="stat-number">{stat.num}</span>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Recent Applicants</h2>
            <button className="company-action-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={14} /> Post a Position
            </button>
          </div>

          {applicants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '1.25rem' }}>
              <Briefcase size={40} style={{ color: '#9CA3AF', margin: '0 auto 1rem', display: 'block' }} />
              <p style={{ color: '#6B7280', fontSize: '0.88rem' }}>No applicants yet. Share your listing to get started.</p>
            </div>
          ) : (
            <div className="applicants-grid">
              {applicants.map((a, i) => (
                <motion.div
                  key={a.id}
                  className="applicant-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  {a.student.photo ? (
                    <img src={a.student.photo} alt={a.student.name} style={{ width: '3rem', height: '3rem', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.75rem', border: '1px solid rgba(0,0,0,0.1)' }} />
                  ) : (
                    <div className="applicant-avatar">{initials(a.student.name || 'AN')}</div>
                  )}
                  <div className="applicant-name">{a.student.name || 'Anonymous'}</div>
                  <div className="applicant-role">{a.internship.role}</div>
                  <p className="applicant-message">"{a.message}"</p>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="status-pill" style={{ color: a.status === 'accepted' ? '#22C55E' : a.status === 'rejected' ? '#EF4444' : undefined }}>
                      {a.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

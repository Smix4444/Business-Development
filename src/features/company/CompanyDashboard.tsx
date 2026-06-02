import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, LogOut, Plus, Settings, X } from 'lucide-react';
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

const DURATION_OPTIONS = ['1 month', '2 months', '3 months', '4 months', '5 months', '6 months'];
const TAG_OPTIONS = ['Hybrid', 'Remote', 'On-site', 'Paid', 'Full-time', 'Part-time'];

function PostPositionModal({ companyName, onClose, onPosted }: {
  companyName: string;
  onClose: () => void;
  onPosted: () => void;
}) {
  const [role, setRole]             = useState('');
  const [location, setLocation]     = useState('');
  const [duration, setDuration]     = useState('3 months');
  const [description, setDescription] = useState('');
  const [tags, setTags]             = useState<string[]>(['Paid']);
  const [submitting, setSubmitting] = useState(false);

  const toggleTag = (tag: string) =>
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/internships', {
        company: companyName,
        role,
        location,
        duration,
        description,
        requirements: [],
        tags,
      });
      toast.success('Position posted successfully!');
      onPosted();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to post position');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="post-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="post-modal"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="post-modal-header">
          <h2 className="post-modal-title">Post a Position</h2>
          <button type="button" className="post-modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="post-modal-form">
          <div className="post-field">
            <label className="post-label">Job Title</label>
            <input
              className="post-input"
              type="text"
              placeholder="e.g. Software Engineering Intern"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
            />
          </div>

          <div className="post-field">
            <label className="post-label">Location</label>
            <input
              className="post-input"
              type="text"
              placeholder="e.g. Antwerpen or Remote"
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="post-field">
            <label className="post-label">Duration</label>
            <select className="post-input post-select" value={duration} onChange={e => setDuration(e.target.value)}>
              {DURATION_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="post-field">
            <label className="post-label">Description</label>
            <textarea
              className="post-input post-textarea"
              placeholder="Describe the role, responsibilities, and what the intern will learn…"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows={4}
            />
          </div>

          <div className="post-field">
            <label className="post-label">Tags</label>
            <div className="post-tags">
              {TAG_OPTIONS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`post-tag-btn${tags.includes(tag) ? ' post-tag-btn--active' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="post-modal-actions">
            <button type="button" className="post-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="post-submit-btn" disabled={submitting}>
              {submitting ? 'Posting…' : 'Post Position'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function CompanyDashboard() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [showPostForm, setShowPostForm] = useState(false);

  const loadApplicants = () => {
    api.get<Applicant[]>('/applications').then(setApplicants).catch(() => toast.error('Failed to load applicants'));
  };

  useEffect(() => { loadApplicants(); }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const initials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CO';

  const companyName = profile?.company || profile?.name || 'Your Company';

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
            Welcome, <span>{companyName}</span>
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
            <button
              className="company-action-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              onClick={() => setShowPostForm(true)}
            >
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

      <AnimatePresence>
        {showPostForm && (
          <PostPositionModal
            companyName={companyName}
            onClose={() => setShowPostForm(false)}
            onPosted={loadApplicants}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

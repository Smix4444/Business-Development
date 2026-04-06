import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, User, GraduationCap, ChevronDown } from 'lucide-react';
import { useAuth } from '../../app/context/auth-context';
import { OnboardingModal } from './OnboardingModal';
import './LoginPage.css';

type Role = 'student' | 'company' | 'school';
type Mode = 'login' | 'register';

interface School { id: number; name: string; domain: string; }

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [role, setRole] = useState<Role>('student');
  const [mode, setMode] = useState<Mode>('login');

  // Common fields
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  // Student fields
  const [name, setName]             = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null);
  const [schools, setSchools]       = useState<School[]>([]);

  // Company fields
  const [companyName, setCompanyName] = useState('');

  // School fields
  const [schoolName, setSchoolName]     = useState('');
  const [schoolDomain, setSchoolDomain] = useState('');
  const [contactName, setContactName]   = useState('');

  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Load schools list for student dropdown
  useEffect(() => {
    if (role === 'student' && mode === 'register') {
      fetch('/api/schools')
        .then(r => r.json())
        .then(d => setSchools(d.schools || []))
        .catch(() => {});
    }
  }, [role, mode]);

  // Auto-detect school from email domain
  useEffect(() => {
    if (role !== 'student' || mode !== 'register' || !email.includes('@')) return;
    const domain = email.split('@')[1];
    if (!domain || !schools.length) return;
    const match = schools.find(s => s.domain && domain.endsWith(s.domain.replace(/^@/, '')));
    if (match && selectedSchoolId === null) setSelectedSchoolId(match.id);
  }, [email, schools, role, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password, role);
      } else {
        await register(email, password, role, {
          name,
          companyName,
          schoolName,
          schoolDomain: schoolDomain.replace(/^@/, ''), // strip leading @
          contactName,
          schoolId: selectedSchoolId,
        });
      }

      if (role === 'company') navigate('/company');
      else if (role === 'school') navigate('/school');
      else {
        if (mode === 'register') setShowOnboarding(true);
        else navigate('/swipe');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const switchRole = (r: Role) => { setRole(r); setError(''); };
  const switchMode = () => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); };

  return (
    <div className="login-page">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="login-header">
          <Briefcase size={36} className="login-logo-icon" />
          <h2 className="login-title">InternMatch</h2>
          <p className="login-subtitle">
            {mode === 'login' ? 'Sign in to continue' : 'Create your account'}
          </p>
        </div>

        {/* Role toggle — 3 options */}
        <div className="role-toggle role-toggle--3">
          <button type="button" className={`role-btn ${role === 'student' ? 'role-btn-active' : ''}`} onClick={() => switchRole('student')}>
            <User size={13} /> Student
          </button>
          <button type="button" className={`role-btn ${role === 'company' ? 'role-btn-active' : ''}`} onClick={() => switchRole('company')}>
            <Briefcase size={13} /> Company
          </button>
          <button type="button" className={`role-btn ${role === 'school' ? 'role-btn-active' : ''}`} onClick={() => switchRole('school')}>
            <GraduationCap size={13} /> School
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={`${role}-${mode}`}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.18 }}
          >
            {/* ── Student register fields ── */}
            {mode === 'register' && role === 'student' && (
              <>
                <div className="form-group">
                  <label className="label">Full Name</label>
                  <input type="text" className="input" placeholder="e.g. Alex Johnson" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="label">Your School <span className="optional-label">optional</span></label>
                  <div className="select-wrap">
                    <select
                      className="input select-input"
                      value={selectedSchoolId ?? ''}
                      onChange={e => setSelectedSchoolId(e.target.value ? parseInt(e.target.value) : null)}
                    >
                      <option value="">No school / skip</option>
                      {schools.map(s => (
                        <option key={s.id} value={s.id}>{s.name}{s.domain ? ` (${s.domain})` : ''}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="select-icon" />
                  </div>
                  {selectedSchoolId && (
                    <p className="field-hint">Auto-detected from your email domain.</p>
                  )}
                </div>
              </>
            )}

            {/* ── Company register fields ── */}
            {mode === 'register' && role === 'company' && (
              <div className="form-group">
                <label className="label">Company Name</label>
                <input type="text" className="input" placeholder="e.g. Acme Corp" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
              </div>
            )}

            {/* ── School register fields ── */}
            {mode === 'register' && role === 'school' && (
              <>
                <div className="form-group">
                  <label className="label">School Name</label>
                  <input type="text" className="input" placeholder="e.g. KdG University of Applied Sciences" value={schoolName} onChange={e => setSchoolName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="label">Email Domain <span className="optional-label">for auto-linking students</span></label>
                  <input type="text" className="input" placeholder="e.g. kdg.be or student.ap.be" value={schoolDomain} onChange={e => setSchoolDomain(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="label">Contact Person</label>
                  <input type="text" className="input" placeholder="e.g. Internship Coordinator" value={contactName} onChange={e => setContactName(e.target.value)} />
                </div>
              </>
            )}

            {/* ── Common fields ── */}
            <div className="form-group">
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder={
                  role === 'student' ? 'student@university.edu'
                  : role === 'school' ? 'internships@school.edu'
                  : 'hr@company.com'
                }
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <input type="password" className="input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            {error && (
              <p style={{ color: '#EF4444', fontSize: '0.82rem', margin: '0.5rem 0', textAlign: 'center' }}>{error}</p>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Loading…' : mode === 'login'
                ? `Sign in as ${role === 'student' ? 'Student' : role === 'company' ? 'Company' : 'School'}`
                : 'Create Account'}
            </button>
          </motion.form>
        </AnimatePresence>

        <div className="login-divider">
          <div className="login-divider-line" />
          <span className="login-divider-text">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <div className="login-divider-line" />
        </div>

        <button type="button" onClick={switchMode} className="login-btn"
          style={{ background: 'transparent', color: '#666666', border: '1px solid rgba(255,255,255,0.09)', marginTop: 0 }}>
          {mode === 'login' ? 'Create a free account' : 'Sign in instead'}
        </button>

        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.72rem', color: '#2E2E2E' }}>
          Demo: student@demo.com / password123
        </div>

        <Link to="/" className="back-home">← Back to home</Link>
      </motion.div>

      {showOnboarding && <OnboardingModal onComplete={() => { setShowOnboarding(false); navigate('/swipe'); }} />}
    </div>
  );
}

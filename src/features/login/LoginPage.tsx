import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, User } from 'lucide-react';
import { useAuth } from '../../app/context/auth-context';
import { OnboardingModal } from './OnboardingModal';
import './LoginPage.css';

type Role = 'student' | 'company';
type Mode = 'login' | 'register';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [role, setRole] = useState<Role>('student');
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password, role);
      } else {
        await register(email, password, role, name || undefined, companyName || undefined);
      }

      if (role === 'company') {
        navigate('/company');
      } else {
        if (mode === 'register') {
          setShowOnboarding(true);
        } else {
          navigate('/swipe');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate('/swipe');
  };

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

        {/* Role toggle */}
        <div className="role-toggle">
          <button
            type="button"
            className={`role-btn ${role === 'student' ? 'role-btn-active' : ''}`}
            onClick={() => setRole('student')}
          >
            <User size={14} />
            Student
          </button>
          <button
            type="button"
            className={`role-btn ${role === 'company' ? 'role-btn-active' : ''}`}
            onClick={() => setRole('company')}
          >
            <Briefcase size={14} />
            Company
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
            {mode === 'register' && role === 'student' && (
              <div className="form-group">
                <label className="label">Full Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            )}

            {mode === 'register' && role === 'company' && (
              <div className="form-group">
                <label className="label">Company Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Acme Corp"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder={role === 'student' ? 'student@university.edu' : 'hr@company.com'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p style={{ color: '#EF4444', fontSize: '0.82rem', margin: '0.5rem 0', textAlign: 'center' }}>
                {error}
              </p>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Loading…' : mode === 'login' ? `Sign in as ${role === 'student' ? 'Student' : 'Company'}` : 'Create Account'}
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

        <button
          type="button"
          onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); }}
          className="login-btn"
          style={{ background: 'transparent', color: '#666666', border: '1px solid rgba(255,255,255,0.09)', marginTop: 0 }}
        >
          {mode === 'login' ? 'Create a free account' : 'Sign in instead'}
        </button>

        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.72rem', color: '#2E2E2E' }}>
          Demo: student@demo.com / password123
        </div>

        <Link to="/" className="back-home">← Back to home</Link>
      </motion.div>

      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
    </div>
  );
}

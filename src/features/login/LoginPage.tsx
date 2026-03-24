import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Briefcase, User } from 'lucide-react';
import { useAuth } from '../../app/context/auth-context';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { OnboardingModal } from './OnboardingModal';
import './LoginPage.css';

type Role = 'student' | 'company';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<Role>('student');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
    if (role === 'company') {
      navigate('/company');
    } else {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate('/swipe');
  };

  return (
    <AuroraBackground>
      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <Heart className="mx-auto mb-4 text-pink-500 hover:scale-110 transition-transform" size={48} fill="currentColor" />
            <h2 className="login-title">Welcome to InternMatch</h2>
            <p className="login-subtitle">Sign in to continue</p>
          </div>

          {/* Role Toggle */}
          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn ${role === 'student' ? 'role-btn-active' : ''}`}
              onClick={() => setRole('student')}
            >
              <User size={16} />
              I'm a Student
            </button>
            <button
              type="button"
              className={`role-btn ${role === 'company' ? 'role-btn-active' : ''}`}
              onClick={() => setRole('company')}
            >
              <Briefcase size={16} />
              I'm a Company
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={role}
              onSubmit={handleLogin}
              initial={{ opacity: 0, x: role === 'student' ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="form-group">
                <label className="label">Email Address</label>
                <input
                  type="email"
                  className="input"
                  placeholder={role === 'student' ? 'student@university.edu' : 'hr@company.com'}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              {role === 'company' && (
                <div className="form-group">
                  <label className="label">Company Name</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Google, Airbnb..."
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="login-btn">
                {role === 'student' ? 'Sign In as Student' : 'Sign In as Company'}
              </button>
            </motion.form>
          </AnimatePresence>

          <Link to="/" className="back-home hover:text-pink-500 transition-colors">
            ← Back to landing page
          </Link>
        </div>
      </div>

      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
    </AuroraBackground>
  );
}

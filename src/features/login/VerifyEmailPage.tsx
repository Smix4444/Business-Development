import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ArrowRight, Mail } from 'lucide-react';
import './VerifyEmailPage.css';

type Status = 'loading' | 'success' | 'error';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found. Please check your email link.');
      return;
    }

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.success) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed. Please try again.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Network error. Please try again.');
      });
  }, [token]);

  return (
    <div className="verify-page">
      {/* Ambient glow */}
      <div className="verify-glow verify-glow--1" />
      <div className="verify-glow verify-glow--2" />

      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          className="verify-card"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {status === 'loading' && (
            <>
              <motion.div
                className="verify-icon-wrap verify-icon-wrap--loading"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 size={40} />
              </motion.div>
              <h1 className="verify-title">Verifying your email…</h1>
              <p className="verify-desc">Hang tight, this only takes a moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <motion.div
                className="verify-icon-wrap verify-icon-wrap--success"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.1 }}
              >
                <CheckCircle size={48} />
              </motion.div>

              <motion.div
                className="verify-confetti"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {[...Array(12)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="confetti-dot"
                    initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                    animate={{
                      opacity: 0,
                      y: -60 - Math.random() * 40,
                      x: (Math.random() - 0.5) * 120,
                      scale: 0,
                    }}
                    transition={{ duration: 1 + Math.random() * 0.5, delay: 0.15 + i * 0.04 }}
                    style={{
                      background: ['#22C55E', '#F2F2F2', '#10B981', '#6EE7B7', '#34D399'][i % 5],
                    }}
                  />
                ))}
              </motion.div>

              <h1 className="verify-title">Email Verified!</h1>
              <p className="verify-desc">{message}</p>

              <motion.button
                className="verify-btn"
                onClick={() => navigate('/login')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue to Sign In <ArrowRight size={16} />
              </motion.button>
            </>
          )}

          {status === 'error' && (
            <>
              <motion.div
                className="verify-icon-wrap verify-icon-wrap--error"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 15 }}
              >
                <XCircle size={48} />
              </motion.div>
              <h1 className="verify-title">Verification Failed</h1>
              <p className="verify-desc">{message}</p>

              <div className="verify-actions">
                <motion.button
                  className="verify-btn"
                  onClick={() => navigate('/login')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Go to Login <ArrowRight size={16} />
                </motion.button>
              </div>
            </>
          )}

          <Link to="/" className="verify-home-link">
            <Mail size={13} /> Back to InternMatch
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

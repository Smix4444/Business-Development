import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Briefcase, CheckCircle2, Shield, FileSearch, Zap, MessageSquare, UserCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { useApplications } from '../../app/context/application-context';
import './LandingPage.css';

// ─── Text Scramble Hook ───────────────────────────────────────────────────────
const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#@$%&';

function useTextScramble(text: string, active: boolean, speed = 28) {
  const [output, setOutput] = useState('');
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (frameRef.current) clearInterval(frameRef.current);

    if (!active) {
      setOutput('');
      return;
    }

    let iteration = 0;
    frameRef.current = setInterval(() => {
      setOutput(
        text.split('').map((char, i) => {
          if (i < Math.floor(iteration)) return char;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }).join('')
      );
      iteration += 0.38;
      if (iteration > text.length) {
        if (frameRef.current) clearInterval(frameRef.current);
        setOutput(text);
      }
    }, speed);

    return () => { if (frameRef.current) clearInterval(frameRef.current); };
  }, [active, text]);

  return output;
}

// ─── Cursor Orb ──────────────────────────────────────────────────────────────
function CursorOrb() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 60, damping: 20 });
  const springY = useSpring(y, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  return (
    <motion.div
      className="cursor-orb"
      style={{ left: springX, top: springY }}
    />
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export function LandingPage() {
  const { applications } = useApplications();
  const [showRefs, setShowRefs] = useState(false);
  const [isInternHovered, setIsInternHovered] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const scrambledMatch = useTextScramble('match', isInternHovered);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let gsap: any, ScrollTrigger: any;

    async function initGSAP() {
      try {
        const gsapModule = await import('gsap');
        const stModule = await import('gsap/ScrollTrigger');
        gsap = gsapModule.gsap;
        ScrollTrigger = stModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        if (heroRef.current) {
          gsap.from(heroRef.current.querySelectorAll('.hero-eyebrow, .hero-headline, .hero-sub, .hero-actions'), {
            y: 40,
            opacity: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
          });
        }

        if (featuresRef.current) {
          const cards = featuresRef.current.querySelectorAll('.feature-card');
          ScrollTrigger.batch(cards, {
            onEnter: (batch: Element[]) =>
              gsap.to(batch, { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out' }),
            start: 'top 85%',
          });
          gsap.set(cards, { y: 50, opacity: 0 });
        }

        gsap.utils.toArray('.section-heading, .market-stat, .privacy-item').forEach((el: any) => {
          gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            y: 24,
            opacity: 0,
            duration: 0.65,
            ease: 'power2.out',
          });
        });
      } catch {
        document.querySelectorAll('.feature-card').forEach(el => {
          (el as HTMLElement).style.opacity = '1';
        });
      }
    }

    initGSAP();
    return () => { if (ScrollTrigger) ScrollTrigger.getAll().forEach((t: any) => t.kill()); };
  }, []);

  return (
    <div className="landing-root">
      <CursorOrb />

      {/* Nav */}
      <nav className="landing-nav">
        <a className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Briefcase size={18} className="nav-logo-icon" />
          <span className="nav-logo-text">InternMatch</span>
        </a>

        <div className="nav-links">
          <button className="nav-link-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
          <button className="nav-link-btn" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Features</button>
          <button className="nav-link-btn" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>Analysis</button>
          <button className="nav-link-btn" onClick={() => document.getElementById('privacy')?.scrollIntoView({ behavior: 'smooth' })}>Privacy</button>
          <Link to="/pricing" className="nav-link-btn" style={{ textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>Pricing</Link>
        </div>

        <Link to="/login" className="nav-cta">Get Started</Link>
      </nav>

      {/* Hero */}
      <section className="landing-hero" ref={heroRef}>
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          Now live — swipe to find your internship
        </div>

        <h1 className="hero-headline">
          Find your<br />
          {/* ── Hover word reveal: intern → match ── */}
          <span className="hero-word-group">
            <span
              className={`hero-trigger-word${isInternHovered ? ' is-hovered' : ''}`}
              onMouseEnter={() => setIsInternHovered(true)}
              onMouseLeave={() => setIsInternHovered(false)}
            >
              intern
              {/* Ghost glow ring on hover */}
              {isInternHovered && (
                <motion.span
                  className="intern-glow-ring"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </span>

            <AnimatePresence>
              {isInternHovered && (
                <motion.span
                  className="hero-reveal-word"
                  initial={{ opacity: 0, x: -24, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -16, filter: 'blur(8px)' }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {scrambledMatch || 'match'}
                </motion.span>
              )}
            </AnimatePresence>

            <motion.span
              className="hero-suffix"
              animate={{ opacity: isInternHovered ? 0.08 : 0.18, x: isInternHovered ? 6 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ship.
            </motion.span>
          </span>
        </h1>

        <p className="hero-sub">
          The first swipe-based platform for internships. Browse curated roles, show genuine interest, and get matched with top companies.
        </p>
        <div className="hero-actions">
          <Link to="/login" className="btn-primary">
            Start Swiping <Zap size={15} />
          </Link>
          <button className="btn-ghost" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
            See how it works
          </button>
        </div>

        {/* Hint label */}
        <p className="hero-hover-hint">
          hover <span>intern</span> ↑
        </p>
      </section>

      {/* Features */}
      <section id="features" className="landing-features" ref={featuresRef}>
        <p className="section-label">How it works</p>
        <h2 className="section-heading">Three steps to your next role</h2>
        <p className="section-sub">No cold emails. No mass applying. Just curated matches and real conversations.</p>

        <div className="features-grid">
          <div className="feature-card">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop" alt="Browse" className="feature-card-img" />
            <div className="feature-card-body">
              <div className="feature-card-icon"><Briefcase size={15} /></div>
              <h3 className="feature-card-title">Browse Opportunities</h3>
              <p className="feature-card-text">Swipe through curated internships from top companies matched to your skills and interests.</p>
            </div>
          </div>

          <div className="feature-card">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop" alt="Message" className="feature-card-img" />
            <div className="feature-card-body">
              <div className="feature-card-icon"><MessageSquare size={15} /></div>
              <h3 className="feature-card-title">Show Real Interest</h3>
              <p className="feature-card-text">Swipe right and write a personalised message explaining exactly why you're the perfect fit.</p>
            </div>
          </div>

          <div className="feature-card">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop" alt="Match" className="feature-card-img" />
            <div className="feature-card-body">
              <div className="feature-card-icon"><UserCheck size={15} /></div>
              <h3 className="feature-card-title">Match & Connect</h3>
              <p className="feature-card-text">Companies review thoughtful applications and reach out to candidates who truly stand out.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Analysis */}
      <section id="about" className="landing-market">
        <div className="market-inner">
          <div>
            <p className="section-label">Market Analysis</p>
            <h2 className="section-heading">The internship search is broken</h2>
            <p className="section-sub">Students face two compounding problems: too many generic options and too little guidance on how to stand out.</p>

            <div className="market-stat-row">
              <div className="market-stat">
                <div className="market-stat-num">73%</div>
                <div className="market-stat-label">of students feel underprepared for technical interviews</div>
              </div>
              <div className="market-stat">
                <div className="market-stat-num">5×</div>
                <div className="market-stat-label">more applications submitted per role vs 5 years ago</div>
              </div>
              <div className="market-stat">
                <div className="market-stat-num">89%</div>
                <div className="market-stat-label">of recruiters prefer personalised outreach</div>
              </div>
              <div className="market-stat">
                <div className="market-stat-num">2x</div>
                <div className="market-stat-label">higher callback rate for tailored applications</div>
              </div>
            </div>
          </div>

          <div className="market-quote-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <AlertCircle size={18} style={{ color: '#AAAAAA', flexShrink: 0, marginTop: '3px' }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#CCCCCC', margin: '0 0 0.3rem' }}>The Readiness Gap</p>
                <p style={{ fontSize: '0.8rem', color: '#AAAAAA', lineHeight: '1.55', margin: 0 }}>Students often feel "not good enough" and struggle with technical interviews, even when they have the skills.</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '2rem' }}>
              <TrendingUp size={18} style={{ color: '#AAAAAA', flexShrink: 0, marginTop: '3px' }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#CCCCCC', margin: '0 0 0.3rem' }}>Manual Outreach Fatigue</p>
                <p style={{ fontSize: '0.8rem', color: '#AAAAAA', lineHeight: '1.55', margin: 0 }}>Cold-emailing and fragmented applications are the #1 pain point cited by student job-seekers.</p>
              </div>
            </div>
            <p className="market-quote-text">
              "Access alone is not enough; students need structured guidance to turn internship opportunities into meaningful career development."
            </p>
            <p className="market-quote-cite">— Hora et al. (2019), WCER Working Paper No. 2019-1</p>
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className="landing-privacy">
        <div className="privacy-inner">
          <div>
            <p className="section-label">Data & Privacy</p>
            <h2 className="section-heading">GDPR Secure by design</h2>
            <p className="section-sub" style={{ marginBottom: 0 }}>
              Your personal data is handled to the highest standards of European privacy law. No exceptions.
            </p>
          </div>

          <div className="privacy-grid">
            {[
              { title: 'Transparency', detail: 'Know exactly what data is collected and why at every step.' },
              { title: 'Minimization', detail: 'Only data essential for your match is ever processed.' },
              { title: 'User Rights', detail: 'Access, correct, or permanently delete your data at any time.' },
              { title: 'Security', detail: 'Technical and organisational safeguards enforced end-to-end.' },
            ].map((item) => (
              <div key={item.title} className="privacy-item">
                <p className="privacy-item-title">
                  <CheckCircle2 size={14} className="privacy-check" />
                  {item.title}
                </p>
                <p className="privacy-item-text">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="landing-footer-wrap">
        <div className="landing-footer">
          <span className="footer-copy">© 2026 InternMatch. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/admin" style={{ fontSize: '0.72rem', color: '#888888', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#555')}
              onMouseLeave={e => (e.currentTarget.style.color = '#222')}
            >
              Admin
            </Link>
            <button className="footer-refs-btn" onClick={() => setShowRefs(r => !r)}>
              <FileSearch size={14} />
              {showRefs ? 'Hide' : 'View'} cited studies
            </button>
          </div>
        </div>
        {showRefs && (
          <div className="footer-refs-list">
            <p className="footer-ref">Hora, M. T., Chen, Z., Parrott, E., & Her, P. (2019). WCER Working Paper No. 2019-1.</p>
            <p className="footer-ref">Kapoor, A., & Gardner-McCune, C. (2020). Barriers to Securing Industry Internships.</p>
          </div>
        )}
      </div>
    </div>
  );
}

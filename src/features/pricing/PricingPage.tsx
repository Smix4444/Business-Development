import { motion } from 'framer-motion';
import { Link } from 'react-router';
import {
  GraduationCap, Building2, Check, ArrowRight, Sparkles,
  Users, BarChart3, ShieldCheck, Mail, BookOpen, Star,
  Briefcase, Globe, Zap, FileText, Bell, Lock,
} from 'lucide-react';
import './PricingPage.css';

const schoolFeatures = [
  { icon: <Users size={10} />, text: 'Up to 500 student accounts per school' },
  { icon: <GraduationCap size={10} />, text: 'Dedicated school coordinator dashboard' },
  { icon: <FileText size={10} />, text: 'Bulk student import via CSV / school system' },
  { icon: <BarChart3 size={10} />, text: 'Placement analytics & internship tracking' },
  { icon: <BookOpen size={10} />, text: 'Teacher & advisor access roles' },
  { icon: <ShieldCheck size={10} />, text: 'Verified school badge on all student profiles' },
  { icon: <Bell size={10} />, text: 'Automated reminder emails to students' },
  { icon: <Globe size={10} />, text: 'Custom school landing page with branding' },
  { icon: <Mail size={10} />, text: 'Priority email support + onboarding call' },
  { icon: <Lock size={10} />, text: 'GDPR-compliant student data handling' },
];

const businessFeatures = [
  { icon: <Briefcase size={10} />, text: 'Unlimited internship listings' },
  { icon: <Users size={10} />, text: 'Full applicant management dashboard' },
  { icon: <FileText size={10} />, text: 'CV & portfolio access for every applicant' },
  { icon: <Zap size={10} />, text: 'Boost listings — appear first in student feed' },
  { icon: <BarChart3 size={10} />, text: 'Application funnel analytics' },
  { icon: <Star size={10} />, text: 'Verified company badge' },
  { icon: <Globe size={10} />, text: 'Custom branded company profile page' },
  { icon: <Bell size={10} />, text: 'Instant notifications on new applications' },
  { icon: <ShieldCheck size={10} />, text: 'Advanced candidate filtering & shortlisting' },
  { icon: <Mail size={10} />, text: 'Direct messaging with applicants' },
];

const faqs = [
  {
    q: 'Can I try before committing?',
    a: 'Yes — both plans come with a 14-day free trial, no credit card required. You\'ll have full access to every feature during the trial.',
  },
  {
    q: 'What happens when a school\'s student limit is reached?',
    a: 'You\'ll be notified automatically at 80% capacity. Additional student slots can be added for a small fee, or you can upgrade to a custom enterprise plan.',
  },
  {
    q: 'Can a business cancel anytime?',
    a: 'Absolutely. The Business Plan is month-to-month with no lock-in. Cancel any time from your account settings and you won\'t be billed again.',
  },
  {
    q: 'Is there a discount for annual billing on the Business plan?',
    a: 'Yes — paying annually saves you 2 months (effectively 166€/year instead of 239.88€). Contact us to switch to annual billing.',
  },
  {
    q: 'Do you offer a free tier for individual students?',
    a: 'Students can always sign up and use InternMatch for free — swiping, applying, and managing their profile costs nothing.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 },
  }),
};

export function PricingPage() {
  return (
    <div className="pricing-page">
      {/* Header */}
      <header className="pricing-header">
        <div className="app-title">InternMatch</div>
        <nav className="pricing-header-nav">
          <Link to="/" className="pricing-nav-link">Home</Link>
          <Link to="/login" className="pricing-nav-cta">Get Started</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="pricing-hero">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="pricing-eyebrow">
            <Sparkles size={11} /> Transparent Pricing
          </span>
          <h1 className="pricing-title">
            The right plan for<br />every institution
          </h1>
          <p className="pricing-subtitle">
            Students always free. Schools and businesses pay only for what they need.
          </p>
        </motion.div>
      </section>

      {/* Cards */}
      <div className="pricing-grid">
        {/* School */}
        <motion.div
          className="pricing-card"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <span className="pricing-badge badge-school">
            <GraduationCap size={11} /> School Plan
          </span>
          <h2 className="pricing-plan-name">Academic Institution</h2>
          <p className="pricing-plan-desc">
            Give your students a head start. Manage every placement from one dashboard with full visibility for advisors.
          </p>

          <div className="pricing-price-row">
            <span className="pricing-currency">€</span>
            <span className="pricing-amount">2,999</span>
          </div>
          <p className="pricing-period" style={{ marginBottom: '0.35rem' }}>per year</p>
          <p className="pricing-billing-note">Billed annually · one invoice for your institution</p>

          <div className="pricing-divider" />

          <ul className="pricing-features">
            {schoolFeatures.map((f, i) => (
              <li key={i} className="pricing-feature">
                <span className="feature-check check-school">{f.icon}</span>
                {f.text}
              </li>
            ))}
          </ul>

          <a href="mailto:schools@internmatch.io" className="pricing-cta cta-school">
            Contact for Schools <ArrowRight size={14} />
          </a>
        </motion.div>

        {/* Business */}
        <motion.div
          className="pricing-card featured"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <span className="pricing-badge badge-business">
            <Building2 size={11} /> Business Plan
          </span>
          <h2 className="pricing-plan-name">Company</h2>
          <p className="pricing-plan-desc">
            Source top early-career talent at scale. Post unlimited roles, manage applicants and build your employer brand.
          </p>

          <div className="pricing-price-row">
            <span className="pricing-currency">€</span>
            <span className="pricing-amount">19.99</span>
          </div>
          <p className="pricing-period" style={{ marginBottom: '0.35rem' }}>per month</p>
          <p className="pricing-billing-note">No lock-in · cancel anytime</p>

          <div className="pricing-divider" />

          <ul className="pricing-features">
            {businessFeatures.map((f, i) => (
              <li key={i} className="pricing-feature">
                <span className="feature-check check-business">{f.icon}</span>
                {f.text}
              </li>
            ))}
          </ul>

          <Link to="/login" className="pricing-cta cta-business">
            Start Free Trial <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>

      {/* FAQ */}
      <section className="pricing-faq">
        <h3 className="faq-title">Frequently asked questions</h3>
        {faqs.map((item, i) => (
          <motion.div
            key={i}
            className="faq-item"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.07, duration: 0.4, ease: 'easeOut' }}
          >
            <p className="faq-q">{item.q}</p>
            <p className="faq-a">{item.a}</p>
          </motion.div>
        ))}
      </section>

      <p className="pricing-footer-note">
        All prices exclude VAT where applicable. · <a href="mailto:hello@internmatch.io" style={{ color: '#555' }}>hello@internmatch.io</a>
      </p>
    </div>
  );
}

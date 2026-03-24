import React from 'react';
import { Link } from 'react-router';
import { Heart, Briefcase, MessageSquare, Zap, CheckCircle2 } from 'lucide-react';
import { useApplications } from '../../app/context/application-context';
import './LandingPage.css';

export function LandingPage() {
  const { applications } = useApplications();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <header className="header">
          <div className="logo-section">
            <Heart className="logo-icon icon-heart" fill="white" />
            <h1 className="title">InternMatch</h1>
          </div>
          <p className="subtitle">Swipe right on your future career</p>
        </header>

        <section className="hero-card">
          <h2 className="hero-title">Find Your Perfect Internship</h2>
          <p className="hero-description">
            The first Tinder-style platform for internships. Swipe through opportunities, 
            show genuine interest, and land your dream role.
          </p>
          
          <Link to="/login" className="cta-button">
            Start Swiping
            <Zap size={20} />
          </Link>
        </section>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper icon-purple">
              <Briefcase size={32} />
            </div>
            <h3 className="feature-title">Browse Opportunities</h3>
            <p className="feature-text">
              Swipe through curated internships from top companies tailored to your interests.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper icon-pink">
              <MessageSquare size={32} />
            </div>
            <h3 className="feature-title">Show Real Interest</h3>
            <p className="feature-text">
              When you swipe right, craft a personalized message explaining why you're the perfect fit.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper icon-orange">
              <Heart size={32} fill="currentColor" />
            </div>
            <h3 className="feature-title">Match & Connect</h3>
            <p className="feature-text">
              Companies review your thoughtful applications and connect with candidates who stand out.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

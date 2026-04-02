import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Upload, FileText, Check, Camera } from 'lucide-react';
import { useAuth } from '../../app/context/auth-context';
import './OnboardingModal.css';

interface Props {
  onComplete: () => void;
}

export function OnboardingModal({ onComplete }: Props) {
  const { updateProfile, profile } = useAuth();
  const [name, setName] = useState(profile?.name || '');
  const [bio, setBio] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cvName, setCvName] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCvName(file.name);
  };

  const handleAccept = () => {
    updateProfile({ name, bio, photo: photoPreview || undefined, cvFile: cvName || undefined });
    onComplete();
  };

  return (
    <div className="onboarding-overlay">
      <motion.div
        className="onboarding-card"
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      >
        <h2 className="onboarding-title">Let's set up your profile 👋</h2>
        <p className="onboarding-subtitle">
          Tell companies a bit about yourself. Everything is optional.
        </p>

        <div className="onboarding-form">
          {/* Photo upload */}
          <div>
            <label className="onboarding-label">
              Profile Photo <span className="optional-badge">Optional</span>
            </label>
            <div className="photo-upload-area" onClick={() => photoRef.current?.click()}>
              {photoPreview ? (
                <img src={photoPreview} className="photo-preview" alt="Your photo" />
              ) : (
                <>
                  <Camera size={28} />
                  <span>Click to upload a photo</span>
                </>
              )}
            </div>
            <input 
              ref={photoRef} 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handlePhotoChange}
            />
          </div>

          {/* Name */}
          <div>
            <label className="onboarding-label">
              Your Name <span className="optional-badge">Optional</span>
            </label>
            <input
              type="text"
              className="onboarding-input"
              placeholder="e.g. Jonas De Smet"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="onboarding-label">
              Short Bio <span className="optional-badge">Optional</span>
            </label>
            <textarea
              className="onboarding-input"
              style={{ minHeight: '80px', resize: 'none' }}
              placeholder="e.g. Computer Science student interested in UX and product design..."
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
          </div>

          {/* CV Upload */}
          <div>
            <label className="onboarding-label">
              Upload CV <span className="optional-badge">Optional</span>
            </label>
            <div className="cv-upload-area" onClick={() => cvRef.current?.click()}>
              {cvName ? (
                <span className="cv-uploaded"><Check size={14} style={{ display: 'inline', marginRight: '6px' }} />{cvName}</span>
              ) : (
                <span><FileText size={16} style={{ display: 'inline', marginRight: '6px' }} />Click to upload your CV (PDF)</span>
              )}
            </div>
            <input
              ref={cvRef}
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={handleCvChange}
            />
          </div>

          <button className="onboarding-accept-btn" onClick={handleAccept}>
            Go to Internships →
          </button>

          <span className="skip-link" onClick={onComplete}>
            Skip for now
          </span>
        </div>
      </motion.div>
    </div>
  );
}

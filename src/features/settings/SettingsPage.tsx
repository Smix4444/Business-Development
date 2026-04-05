import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'framer-motion';
import { Camera, Check, FileText, ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../../app/context/auth-context';
import { toast } from 'sonner';
import './SettingsPage.css';

export function SettingsPage() {
  const { profile, role, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [photoPreview, setPhotoPreview] = useState<string | null>(profile?.photo || null);
  const [cvName, setCvName] = useState<string | null>(profile?.cvFile || null);
  const [companyName, setCompanyName] = useState(profile?.company || '');

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ name, bio, photo: photoPreview || undefined, cvFile: cvName || undefined, company: companyName });
      toast.success('Settings saved');
      navigate(role === 'company' ? '/company' : '/swipe');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    }
  };

  const backLink = role === 'company' ? '/company' : '/swipe';

  return (
    <div className="settings-page">
      <header className="settings-header">
        <Link to={backLink} className="back-link">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="settings-title">Account Settings</h1>
        <div style={{ width: 60 }} />
      </header>

      <main className="settings-container">
        <motion.div className="settings-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <form className="settings-form" onSubmit={handleSave}>

            {/* Photo */}
            <div className="form-group-settings">
              <label className="settings-label">Profile Photo</label>
              <div className="photo-upload-area-settings" onClick={() => photoRef.current?.click()}>
                {photoPreview ? (
                  <img src={photoPreview} className="photo-preview-settings" alt="Your photo" />
                ) : (
                  <>
                    <Camera size={22} />
                    <span>Click to upload a photo</span>
                  </>
                )}
              </div>
              <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
            </div>

            {role === 'company' && (
              <div className="form-group-settings">
                <label className="settings-label">Company Name</label>
                <input type="text" className="settings-input" value={companyName} onChange={e => setCompanyName(e.target.value)} />
              </div>
            )}

            <div className="form-group-settings">
              <label className="settings-label">Full Name</label>
              <input type="text" className="settings-input" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            {role === 'student' && (
              <>
                <div className="form-group-settings">
                  <label className="settings-label">Bio</label>
                  <textarea className="settings-input" style={{ minHeight: '90px', resize: 'vertical' }} value={bio} onChange={e => setBio(e.target.value)} />
                </div>

                <div className="form-group-settings">
                  <label className="settings-label">CV Document</label>
                  <div className="cv-upload-area-settings" onClick={() => cvRef.current?.click()}>
                    {cvName ? (
                      <span className="cv-uploaded-settings"><Check size={14} /> {cvName}</span>
                    ) : (
                      <span><FileText size={14} style={{ display: 'inline', marginRight: '6px' }} />Click to upload (PDF)</span>
                    )}
                  </div>
                  <input ref={cvRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleCvChange} />
                </div>
              </>
            )}

            <button type="submit" className="settings-save-btn">
              <Save size={16} /> Save Changes
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

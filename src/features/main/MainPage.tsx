import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Briefcase, MapPin, Clock, RotateCcw, CheckCircle2, Filter, UserCircle2, Settings, LogOut, Lightbulb } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { Internship } from '../../app/context/application-context';
import { useApplications } from '../../app/context/application-context';
import { useAuth } from '../../app/context/auth-context';
import { Popover, PopoverContent, PopoverTrigger } from '../../app/components/ui/popover';
import { Checkbox } from '../../app/components/ui/checkbox';
import { Label } from '../../app/components/ui/label';
import { Separator } from '../../app/components/ui/separator';
import './MainPage.css';

export function MainPage() {
  const { applications, addApplication, refreshApplications } = useApplications();
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const [internships, setInternships] = useState<Internship[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [exitDirection, setExitDirection] = useState<number | null>(null);

  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);

  useEffect(() => {
    api.get<Internship[]>('/internships').then(setInternships).catch(() => {});
    refreshApplications();
  }, [refreshApplications]);

  const locations = useMemo(() => Array.from(new Set(internships.map(i => i.location))).sort(), [internships]);
  const tags = useMemo(() => Array.from(new Set(internships.flatMap(i => i.tags))).sort(), [internships]);
  const durations = useMemo(() => Array.from(new Set(internships.map(i => i.duration))).sort(), [internships]);

  const filteredInternships = useMemo(() => {
    return internships.filter(i => {
      if (selectedLocations.length > 0 && !selectedLocations.includes(i.location)) return false;
      if (selectedTags.length > 0 && !i.tags.some(t => selectedTags.includes(t))) return false;
      if (selectedDurations.length > 0 && !selectedDurations.includes(i.duration)) return false;
      return true;
    });
  }, [internships, selectedLocations, selectedTags, selectedDurations]);

  const currentInternship = filteredInternships[currentIndex];
  const hasMore = currentIndex < filteredInternships.length;

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setShowModal(true);
    } else {
      setExitDirection(-1);
      setTimeout(() => { setCurrentIndex(p => p + 1); setExitDirection(null); }, 200);
      toast.info('Passed', { style: { background: '#111', border: '1px solid rgba(255,255,255,0.1)', color: '#888' } });
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const submitApplication = async () => {
    if (message.length < 20) { toast.error('Write at least 20 characters'); return; }
    try {
      await addApplication(currentInternship, message);
      toast.success(`Applied to ${currentInternship.company}!`);
      setShowModal(false);
      setMessage('');
      setExitDirection(1);
      setTimeout(() => { setCurrentIndex(p => p + 1); setExitDirection(null); }, 200);
    } catch (err: any) {
      toast.error(err.message || 'Failed to apply');
    }
  };

  const resetDeck = () => { setCurrentIndex(0); toast.success('Deck reset'); };

  const toggleFilter = (value: string, selected: string[], setter: (v: string[]) => void) => {
    setter(selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value]);
    setCurrentIndex(0);
  };

  const clearFilters = () => { setSelectedLocations([]); setSelectedTags([]); setSelectedDurations([]); setCurrentIndex(0); };
  const activeFilterCount = selectedLocations.length + selectedTags.length + selectedDurations.length;

  const filterContent = (
    <div className="filter-content-inner">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Filters</h3>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} style={{ fontSize: '0.75rem', color: '#888', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear all</button>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.72rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
          {locations.map(loc => (
            <div key={loc} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Checkbox checked={selectedLocations.includes(loc)} onCheckedChange={() => toggleFilter(loc, selectedLocations, setSelectedLocations)} />
              <Label style={{ fontSize: '0.8rem', color: '#666', cursor: 'pointer' }}>{loc}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator style={{ background: 'rgba(255,255,255,0.06)', margin: '0.75rem 0' }} />

      <div style={{ marginBottom: '1rem' }}>
        <Label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.72rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
          {tags.map(tag => (
            <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Checkbox checked={selectedTags.includes(tag)} onCheckedChange={() => toggleFilter(tag, selectedTags, setSelectedTags)} />
              <Label style={{ fontSize: '0.8rem', color: '#666', cursor: 'pointer' }}>{tag}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator style={{ background: 'rgba(255,255,255,0.06)', margin: '0.75rem 0' }} />

      <div>
        <Label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.72rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</Label>
        <div>
          {durations.map(dur => (
            <div key={dur} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Checkbox checked={selectedDurations.includes(dur)} onCheckedChange={() => toggleFilter(dur, selectedDurations, setSelectedDurations)} />
              <Label style={{ fontSize: '0.8rem', color: '#666', cursor: 'pointer' }}>{dur}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="main-page">
      <header className="main-header">
        <div className="app-title">InternMatch</div>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/tips" className="nav-link"><Lightbulb size={15} /><span>Tips</span></Link>
          <Link to="/matches" className="nav-link"><CheckCircle2 size={15} /><span>{applications.length} Applied</span></Link>

          <Popover>
            <PopoverTrigger asChild>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: '#AAAAAA', padding: '0.35rem 0.8rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
                {profile?.photo ? <img src={profile.photo} alt="Profile" style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} /> : <UserCircle2 size={16} />}
                <span>{profile?.name || 'Account'}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent style={{ width: '200px', padding: '0.5rem', background: '#111', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '0.85rem' }} align="end">
              <div style={{ padding: '0.5rem 0.75rem 0.6rem', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '0.35rem' }}>
                <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#DDD', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile?.name || 'Student'}</p>
                <p style={{ fontSize: '0.72rem', color: '#444', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile?.email}</p>
              </div>
              <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: '#888', textDecoration: 'none', borderRadius: '0.5rem', transition: 'background 0.15s' }}>
                <Settings size={14} /> Settings
              </Link>
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '0.5rem', width: '100%', fontFamily: 'inherit' }}>
                <LogOut size={14} /> Logout
              </button>
            </PopoverContent>
          </Popover>
        </nav>
      </header>

      <main className="main-layout">
        <aside className="sidebar-filters">
          <div className="filter-panel">{filterContent}</div>
        </aside>

        <div className="main-container">
          {hasMore ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <div className="mobile-filter-btn">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#111', border: '1px solid rgba(255,255,255,0.09)', color: '#888', padding: '0.45rem 0.9rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                        <Filter size={14} /> Filters
                        {activeFilterCount > 0 && <span style={{ background: '#F2F2F2', color: '#060606', borderRadius: '999px', padding: '0 0.4rem', fontSize: '0.7rem', fontWeight: 700 }}>{activeFilterCount}</span>}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent style={{ width: '280px', padding: '1.25rem', background: '#111', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '1rem' }} align="start">
                      {filterContent}
                    </PopoverContent>
                  </Popover>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#3A3A3A', marginLeft: 'auto' }}>
                  {filteredInternships.length - currentIndex} remaining
                </div>
              </div>

              <div className="progress-bar-container" style={{ marginBottom: '1.5rem' }}>
                <motion.div
                  className="progress-bar-fill"
                  animate={{ width: `${((filteredInternships.length - currentIndex) / Math.max(filteredInternships.length, 1)) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                />
              </div>

              <div className="swipe-card-container">
                <AnimatePresence mode="popLayout">
                  {currentInternship && (
                    <InternCard
                      key={currentInternship.id}
                      internship={currentInternship}
                      onSwipe={handleSwipe}
                      exitDirection={exitDirection}
                    />
                  )}
                </AnimatePresence>
              </div>

              <div className="action-buttons">
                <button className="action-btn btn-dislike" onClick={() => handleSwipe('left')}>
                  <X size={24} />
                </button>
                <button className="action-btn btn-like" onClick={() => handleSwipe('right')}>
                  <Briefcase size={24} fill="currentColor" />
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <Briefcase size={48} style={{ margin: '0 auto 1rem', color: '#2A2A2A', display: 'block' }} />
              <h2>All caught up</h2>
              <p style={{ marginBottom: '1.5rem' }}>You've seen all available internships matching your filters.</p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {activeFilterCount > 0 && (
                  <button className="login-btn" onClick={clearFilters}>Clear Filters</button>
                )}
                <button className="login-btn" onClick={resetDeck} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#666' }}>
                  <RotateCcw size={15} /> Reset Deck
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Application modal */}
      {showModal && currentInternship && (
        <div className="modal-overlay">
          <motion.div className="modal-content" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.22 }}>
            <h3 className="modal-title">Why {currentInternship.company}?</h3>
            <p className="modal-description">
              Write a personalised message explaining why you're the right fit for this role at {currentInternship.company}.
            </p>
            <textarea
              className="message-area"
              placeholder="Hi! I'm really interested in this role because…"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <div style={{ fontSize: '0.78rem', marginBottom: '0.75rem', textAlign: 'right', color: message.length < 20 ? '#555' : '#22C55E', fontWeight: 600 }}>
              {message.length} / 20 min
            </div>

            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
              <Link to="/tips" target="_blank" style={{ fontSize: '0.78rem', color: '#555', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Lightbulb size={13} /> Need inspiration? Check our tips guide
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.82rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.09)', color: '#666', borderRadius: '0.75rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.88rem' }}>
                Cancel
              </button>
              <button className="submit-app-btn" style={{ flex: 2 }} onClick={submitApplication} disabled={message.length < 20}>
                Send Application
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function InternCard({ internship, onSwipe, exitDirection }: {
  internship: Internship;
  onSwipe: (dir: 'left' | 'right') => void;
  exitDirection: number | null;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-22, 22]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) onSwipe('right');
    else if (info.offset.x < -100) onSwipe('left');
  };

  return (
    <motion.div
      className="intern-card"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={exitDirection ? { x: exitDirection * 500, opacity: 0, transition: { duration: 0.2 } } : undefined}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
    >
      <div className="card-image" style={{ backgroundImage: `url(${internship.logo})` }}>
        <div className="card-overlay">
          <div className="card-company">{internship.company}</div>
          <h2 className="card-title">{internship.role}</h2>
        </div>
      </div>
      <div className="card-details">
        <div>
          <div className="card-tags" style={{ marginBottom: '0.65rem' }}>
            <span className="tag"><MapPin size={11} /> {internship.location}</span>
            <span className="tag"><Clock size={11} /> {internship.duration}</span>
            {internship.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
          <p className="card-description" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{internship.description}</p>
        </div>
        <div className="requirements">
          <h4>Requirements</h4>
          <div className="card-tags">
            {internship.requirements.map(req => (
              <span key={req} className="tag" style={{ background: 'rgba(255,255,255,0.04)', color: '#555' }}>{req}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

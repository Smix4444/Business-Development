import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Briefcase, MapPin, Clock, RotateCcw, CheckCircle2, Filter, UserCircle2,
         Settings, LogOut, Lightbulb, ChevronRight, Sparkles, Info, Bookmark, BookmarkCheck, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { Internship, useApplications } from '../../app/context/application-context';
import { useAuth } from '../../app/context/auth-context';
import { Popover, PopoverContent, PopoverTrigger } from '../../app/components/ui/popover';
import { Checkbox } from '../../app/components/ui/checkbox';
import { Label } from '../../app/components/ui/label';
import { Separator } from '../../app/components/ui/separator';
import { computeMatchScore, scoreLabel } from '../../lib/matchScore';
import './MainPage.css';

export function MainPage() {
  const { applications, addApplication, refreshApplications } = useApplications();
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const [internships, setInternships] = useState<Internship[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [message, setMessage] = useState('');
  const [exitDirection, setExitDirection] = useState<number | null>(null);

  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    api.get<Internship[]>('/internships').then(setInternships).catch(() => {});
    refreshApplications();
  }, [refreshApplications]);

  const locations = useMemo(() => Array.from(new Set(internships.map(i => i.location))).sort(), [internships]);
  const tags      = useMemo(() => Array.from(new Set(internships.flatMap(i => i.tags))).sort(), [internships]);
  const durations = useMemo(() => Array.from(new Set(internships.map(i => i.duration))).sort(), [internships]);

  const filteredInternships = useMemo(() => internships.filter(i => {
    if (selectedLocations.length > 0 && !selectedLocations.includes(i.location)) return false;
    if (selectedTags.length > 0 && !i.tags.some(t => selectedTags.includes(t))) return false;
    if (selectedDurations.length > 0 && !selectedDurations.includes(i.duration)) return false;
    return true;
  }), [internships, selectedLocations, selectedTags, selectedDurations]);

  const currentInternship = filteredInternships[currentIndex];
  const hasMore = currentIndex < filteredInternships.length;

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') { setShowModal(true); return; }
    setExitDirection(-1);
    setTimeout(() => { setCurrentIndex(p => p + 1); setExitDirection(null); }, 200);
    toast.info('Passed', { style: { background: '#111', border: '1px solid rgba(255,255,255,0.1)', color: '#C8C8C8' } });
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

  const resetDeck    = () => { setCurrentIndex(0); toast.success('Deck reset'); };
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
          <button onClick={clearFilters} style={{ fontSize: '0.75rem', color: '#C8C8C8', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear all</button>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.72rem', color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: '0.05em' }}>City</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
          {locations.map(loc => (
            <div key={loc} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Checkbox checked={selectedLocations.includes(loc)} onCheckedChange={() => toggleFilter(loc, selectedLocations, setSelectedLocations)} />
              <Label style={{ fontSize: '0.8rem', color: '#BBBBBB', cursor: 'pointer' }}>{loc}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator style={{ background: 'rgba(255,255,255,0.06)', margin: '0.75rem 0' }} />

      <div style={{ marginBottom: '1rem' }}>
        <Label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.72rem', color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
          {tags.map(tag => (
            <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Checkbox checked={selectedTags.includes(tag)} onCheckedChange={() => toggleFilter(tag, selectedTags, setSelectedTags)} />
              <Label style={{ fontSize: '0.8rem', color: '#BBBBBB', cursor: 'pointer' }}>{tag}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator style={{ background: 'rgba(255,255,255,0.06)', margin: '0.75rem 0' }} />

      <div>
        <Label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.72rem', color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</Label>
        {durations.map(dur => (
          <div key={dur} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Checkbox checked={selectedDurations.includes(dur)} onCheckedChange={() => toggleFilter(dur, selectedDurations, setSelectedDurations)} />
            <Label style={{ fontSize: '0.8rem', color: '#BBBBBB', cursor: 'pointer' }}>{dur}</Label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="main-page">
      <header className="main-header">
        <div className="app-title">InternMatch</div>

        {/* Desktop nav */}
        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/tips" className="nav-link"><Lightbulb size={15} /><span>Tips</span></Link>
          <Link to="/matches" className="nav-link"><CheckCircle2 size={15} /><span>{applications.length} Applied</span></Link>

          <Popover>
            <PopoverTrigger asChild>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--dash-elevated)', border: '1px solid var(--dash-border)', color: 'var(--text-secondary)', padding: '0.35rem 0.8rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, minHeight: '44px' }}>
                {profile?.photo ? <img src={profile.photo} alt="Profile" style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} /> : <UserCircle2 size={16} />}
                <span>{profile?.name || 'Account'}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent style={{ width: '200px', padding: '0.5rem', background: 'var(--dash-surface)', border: '1px solid var(--dash-border)', borderRadius: '0.85rem', boxShadow: 'var(--shadow-md)' }} align="end">
              <div style={{ padding: '0.5rem 0.75rem 0.6rem', borderBottom: '1px solid var(--dash-border)', marginBottom: '0.35rem' }}>
                <p style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile?.name || 'Student'}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile?.email}</p>
              </div>
              <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: 'var(--text-secondary)', textDecoration: 'none', borderRadius: '0.5rem' }}>
                <Settings size={14} /> Settings
              </Link>
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: 'var(--status-red)', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '0.5rem', width: '100%', fontFamily: 'inherit' }}>
                <LogOut size={14} /> Logout
              </button>
            </PopoverContent>
          </Popover>
        </nav>

        {/* Mobile hamburger */}
        <button className="hamburger-btn" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              className="mobile-nav-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.div
              className="mobile-nav-drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="mobile-nav-header">
                <span className="mobile-nav-title">InternMatch</span>
                <button className="mobile-nav-close" onClick={() => setMobileNavOpen(false)} aria-label="Close menu">
                  <X size={16} />
                </button>
              </div>
              <div className="mobile-nav-links">
                <Link to="/" className="mobile-nav-link" onClick={() => setMobileNavOpen(false)}>
                  <Lightbulb size={18} /> Home
                </Link>
                <Link to="/tips" className="mobile-nav-link" onClick={() => setMobileNavOpen(false)}>
                  <Lightbulb size={18} /> Tips
                </Link>
                <Link to="/matches" className="mobile-nav-link" onClick={() => setMobileNavOpen(false)}>
                  <CheckCircle2 size={18} /> {applications.length} Applied
                </Link>
                <Link to="/settings" className="mobile-nav-link" onClick={() => setMobileNavOpen(false)}>
                  <Settings size={18} /> Settings
                </Link>
                <button className="mobile-nav-link danger" onClick={() => { setMobileNavOpen(false); handleLogout(); }}>
                  <LogOut size={18} /> Logout
                </button>
              </div>
              <div className="mobile-nav-user">
                <p className="mobile-nav-user-name">{profile?.name || 'Student'}</p>
                <p className="mobile-nav-user-email">{profile?.email}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                      <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#111', border: '1px solid rgba(255,255,255,0.09)', color: '#C8C8C8', padding: '0.45rem 0.9rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                        <Filter size={14} /> Filters
                        {activeFilterCount > 0 && <span style={{ background: '#F2F2F2', color: '#060606', borderRadius: '999px', padding: '0 0.4rem', fontSize: '0.7rem', fontWeight: 700 }}>{activeFilterCount}</span>}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent style={{ width: '280px', padding: '1.25rem', background: '#111', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '1rem' }} align="start">
                      {filterContent}
                    </PopoverContent>
                  </Popover>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#999999', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Info size={12} style={{ color: '#888888' }} />
                  <span>tap card for details</span>
                  <span style={{ color: '#999999', margin: '0 0.25rem' }}>·</span>
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
                      onTap={() => setShowDetail(true)}
                      exitDirection={exitDirection}
                      profile={profile}
                    />
                  )}
                </AnimatePresence>
              </div>

              <div className="action-buttons">
                <button className="action-btn btn-dislike" onClick={() => handleSwipe('left')} title="Pass">
                  <X size={24} />
                </button>
                <button className="action-btn btn-detail" onClick={() => setShowDetail(true)} title="See details">
                  <ChevronRight size={20} />
                </button>
                <button className="action-btn btn-like" onClick={() => handleSwipe('right')} title="Apply">
                  <Briefcase size={24} fill="currentColor" />
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <Briefcase size={48} style={{ margin: '0 auto 1rem', color: '#888888', display: 'block' }} />
              <h2>All caught up</h2>
              <p style={{ marginBottom: '1.5rem' }}>You&apos;ve seen all available internships matching your filters.</p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {activeFilterCount > 0 && <button className="login-btn" onClick={clearFilters}>Clear Filters</button>}
                <button className="login-btn" onClick={resetDeck} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#BBBBBB' }}>
                  <RotateCcw size={15} /> Reset Deck
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Detail Drawer ── */}
      <AnimatePresence>
        {showDetail && currentInternship && (
          <DetailDrawer
            internship={currentInternship}
            profile={profile}
            onClose={() => setShowDetail(false)}
            onApply={() => { setShowDetail(false); setShowModal(true); }}
            onPass={() => { setShowDetail(false); handleSwipe('left'); }}
          />
        )}
      </AnimatePresence>

      {/* ── Application Modal ── */}
      {showModal && currentInternship && (
        <div className="modal-overlay">
          <motion.div className="modal-content" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.22 }}>
            <h3 className="modal-title">Why {currentInternship.company}?</h3>
            <p className="modal-description">
              Write a personalised message explaining why you&apos;re the right fit for this role at {currentInternship.company}.
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
              <Link to="/tips" target="_blank" style={{ fontSize: '0.78rem', color: '#AAAAAA', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Lightbulb size={13} /> Need inspiration? Check our tips guide
              </Link>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.82rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.09)', color: '#BBBBBB', borderRadius: '0.75rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.88rem' }}>
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

// ─────────────────────────────────────────────────────────────────────────────
// InternCard
// ─────────────────────────────────────────────────────────────────────────────
function InternCard({ internship, onSwipe, onTap, exitDirection, profile }: {
  internship: Internship;
  onSwipe: (dir: 'left' | 'right') => void;
  onTap: () => void;
  exitDirection: number | null;
  profile: any;
}) {
  const x       = useMotionValue(0);
  const rotate  = useTransform(x, [-200, 200], [-22, 22]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  // ── 3D tilt ──────────────────────────────────────────────────────────────
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = React.useState({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const [isDragging, setIsDragging] = React.useState(false);

  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width;   // 0–1
    const cy = (e.clientY - rect.top)  / rect.height;  // 0–1
    setTilt({
      rx: (cy - 0.5) * -14,  // rotateX
      ry: (cx - 0.5) * 14,   // rotateY
      gx: cx * 100,
      gy: cy * 100,
    });
  }, [isDragging]);

  const resetTilt = () => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const score = computeMatchScore(profile?.bio, profile?.cvFile, internship);
  const meta  = score !== null ? scoreLabel(score) : null;

  // ── Bookmark (localStorage) ──────────────────────────────────────────────
  const BOOKMARK_KEY = 'internmatch_bookmarks';
  const [bookmarked, setBookmarked] = React.useState(() => {
    try {
      const saved: number[] = JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '[]');
      return saved.includes(internship.id);
    } catch { return false; }
  });

  const toggleBookmark = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked(prev => {
      const next = !prev;
      try {
        const saved: number[] = JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '[]');
        const updated = next ? [...saved, internship.id] : saved.filter(id => id !== internship.id);
        localStorage.setItem(BOOKMARK_KEY, JSON.stringify(updated));
      } catch {}
      return next;
    });
  }, [internship.id]);

  const handleDragEnd = (_: any, info: any) => {
    setIsDragging(false);
    resetTilt();
    if (info.offset.x > 100) onSwipe('right');
    else if (info.offset.x < -100) onSwipe('left');
  };

  return (
    <motion.div
      ref={cardRef}
      className="intern-card"
      style={{
        x, rotate, opacity,
        transformStyle: 'preserve-3d',
        rotateX: tilt.rx,
        rotateY: tilt.ry,
        '--gx': `${tilt.gx}%`,
        '--gy': `${tilt.gy}%`,
      } as any}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={() => { setIsDragging(true); resetTilt(); }}
      onDragEnd={handleDragEnd}
      onTap={onTap}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={exitDirection ? { x: exitDirection * 500, opacity: 0, transition: { duration: 0.2 } } : undefined}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
    >
      <div className="card-image" style={{ backgroundImage: `url(${internship.logo})` }}>
        {/* AI match badge */}
        {meta && (
          <div className="card-match-badge" style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}33` }}>
            <Sparkles size={10} />
            <span>{score}% match</span>
          </div>
        )}
        {!meta && (
          <div className="card-match-badge card-match-badge--empty">
            <Sparkles size={10} />
            <span>Add bio for AI match</span>
          </div>
        )}

        {/* Bookmark button */}
        <motion.button
          className={`card-bookmark-btn${bookmarked ? ' is-bookmarked' : ''}`}
          onClick={toggleBookmark}
          whileTap={{ scale: 0.85 }}
          title={bookmarked ? 'Remove bookmark' : 'Save for later'}
        >
          {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </motion.button>

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
          <p className="card-description" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
            {internship.description}
          </p>
        </div>

        <div>
          {/* Match bar */}
          {meta && score !== null && (
            <div className="card-match-bar-wrap">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.67rem', color: '#999999', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Sparkles size={9} /> AI Match
                </span>
                <span style={{ fontSize: '0.67rem', fontWeight: 700, color: meta.color }}>{meta.label}</span>
              </div>
              <div className="card-match-track">
                <motion.div
                  className="card-match-fill"
                  style={{ background: meta.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          )}

          <div className="requirements">
            <h4>Requirements</h4>
            <div className="card-tags">
              {internship.requirements.map(req => (
                <span key={req} className="tag" style={{ background: 'rgba(255,255,255,0.04)', color: '#AAAAAA' }}>{req}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DetailDrawer
// ─────────────────────────────────────────────────────────────────────────────
function DetailDrawer({ internship, profile, onClose, onApply, onPass }: {
  internship: Internship;
  profile: any;
  onClose: () => void;
  onApply: () => void;
  onPass: () => void;
}) {
  const score = computeMatchScore(profile?.bio, profile?.cvFile, internship);
  const meta  = score !== null ? scoreLabel(score) : null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <motion.div
        className="drawer-sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 38 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="drawer-handle" />

        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-logo" style={{ backgroundImage: `url(${internship.logo})` }} />
          <div>
            <p className="drawer-company">{internship.company}</p>
            <h2 className="drawer-role">{internship.role}</h2>
            <div className="card-tags" style={{ marginTop: '0.5rem' }}>
              <span className="tag"><MapPin size={11} /> {internship.location}</span>
              <span className="tag"><Clock size={11} /> {internship.duration}</span>
              {internship.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
        </div>

        {/* AI Match section */}
        {meta && score !== null ? (
          <div className="drawer-match-section" style={{ background: meta.bg, borderColor: `${meta.color}33` }}>
            <div className="drawer-match-header">
              <Sparkles size={14} style={{ color: meta.color }} />
              <span style={{ color: meta.color, fontWeight: 700, fontSize: '0.88rem' }}>AI Match Score — {score}%</span>
              <span className="drawer-match-label" style={{ background: `${meta.color}22`, color: meta.color }}>{meta.label}</span>
            </div>
            <div className="drawer-match-track">
              <motion.div
                className="drawer-match-fill"
                style={{ background: `linear-gradient(90deg, ${meta.color}88, ${meta.color})` }}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <p className="drawer-match-hint">
              Based on keywords in your bio and CV compared to the vacancy requirements and description.
              {score < 40 && ' Consider updating your profile to improve match accuracy.'}
              {score >= 80 && ' Your profile aligns strongly with what this role requires.'}
            </p>
          </div>
        ) : (
          <div className="drawer-match-section drawer-match-empty">
            <Sparkles size={14} style={{ color: '#999999' }} />
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#999999' }}>
              <Link to="/settings" style={{ color: '#BBBBBB', textDecoration: 'underline' }}>Add a bio or CV</Link> to see your AI match score for this vacancy.
            </p>
          </div>
        )}

        {/* Description */}
        <div className="drawer-section">
          <h4 className="drawer-section-title">About the role</h4>
          <p className="drawer-description">{internship.description}</p>
        </div>

        {/* Requirements */}
        <div className="drawer-section">
          <h4 className="drawer-section-title">Requirements</h4>
          <div className="card-tags" style={{ gap: '0.45rem' }}>
            {internship.requirements.map(req => (
              <span key={req} className="drawer-req-tag">{req}</span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="drawer-actions">
          <button className="drawer-btn-pass" onClick={onPass}>
            <X size={16} /> Pass
          </button>
          <button className="drawer-btn-apply" onClick={onApply}>
            <Briefcase size={16} /> Apply Now
          </button>
        </div>
      </motion.div>
    </div>
  );
}

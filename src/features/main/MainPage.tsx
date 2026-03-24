import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, Briefcase, MapPin, Clock, RotateCcw, CheckCircle2, Filter, UserCircle2, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { mockInternships, Internship } from '../../app/data/internships';
import { useApplications } from '../../app/context/application-context';
import { useAuth } from '../../app/context/auth-context';
import { Popover, PopoverContent, PopoverTrigger } from "../../app/components/ui/popover";
import { Checkbox } from "../../app/components/ui/checkbox";
import { Label } from "../../app/components/ui/label";
import { Separator } from "../../app/components/ui/separator";
import './MainPage.css';

export function MainPage() {
  const { applications, addApplication } = useApplications();
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [exitDirection, setExitDirection] = useState<number | null>(null);

  // Filter states
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);

  // Get unique filter options
  const locations = useMemo(() => Array.from(new Set(mockInternships.map(i => i.location))).sort(), []);
  const tags = useMemo(() => Array.from(new Set(mockInternships.flatMap(i => i.tags))).sort(), []);
  const durations = useMemo(() => Array.from(new Set(mockInternships.map(i => i.duration))).sort(), []);

  // Filter internships
  const filteredInternships = useMemo(() => {
    return mockInternships.filter(internship => {
      if (selectedLocations.length > 0 && !selectedLocations.includes(internship.location)) return false;
      if (selectedTags.length > 0 && !internship.tags.some(tag => selectedTags.includes(tag))) return false;
      if (selectedDurations.length > 0 && !selectedDurations.includes(internship.duration)) return false;
      return true;
    });
  }, [selectedLocations, selectedTags, selectedDurations]);

  const currentInternship = filteredInternships[currentIndex];
  const hasMore = currentIndex < filteredInternships.length;

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setShowModal(true);
    } else {
      setExitDirection(-1);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setExitDirection(null);
      }, 200);
      toast.info("Passed on this opportunity");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const submitApplication = () => {
    if (message.length < 20) {
      toast.error("Please write a more detailed message (min 20 chars)");
      return;
    }
    
    addApplication(currentInternship, message);
    toast.success(`Application sent to ${currentInternship.company}!`);
    setShowModal(false);
    setMessage('');
    setExitDirection(1);
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setExitDirection(null);
    }, 200);
  };

  const resetDeck = () => {
    setCurrentIndex(0);
    toast.success("Deck reset!");
  };

  const toggleFilter = (value: string, selected: string[], setter: (v: string[]) => void) => {
    if (selected.includes(value)) {
      setter(selected.filter(v => v !== value));
    } else {
      setter([...selected, value]);
    }
    setCurrentIndex(0);
  };

  const clearFilters = () => {
    setSelectedLocations([]);
    setSelectedTags([]);
    setSelectedDurations([]);
    setCurrentIndex(0);
  };

  const activeFilterCount = selectedLocations.length + selectedTags.length + selectedDurations.length;

  const filterContent = (
    <div className="filter-content-inner">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Filters</h3>
        {activeFilterCount > 0 && (
          <button className="text-sm font-semibold text-purple-600 hover:text-purple-800 border-none bg-transparent cursor-pointer" onClick={clearFilters}>
            Clear all
          </button>
        )}
      </div>
      
      {/* Location */}
      <div className="mb-4">
        <Label className="font-semibold block mb-2 text-gray-700">Location</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
          {locations.map(loc => (
            <div key={loc} className="flex items-center gap-2">
              <Checkbox 
                id={`loc-${loc}`} 
                checked={selectedLocations.includes(loc)}
                onCheckedChange={() => toggleFilter(loc, selectedLocations, setSelectedLocations)}
              />
              <Label htmlFor={`loc-${loc}`} className="text-sm cursor-pointer ml-1 text-gray-600 font-medium">{loc}</Label>
            </div>
          ))}
        </div>
      </div>
      <Separator className="my-4" />
      
      {/* Tags */}
      <div className="mb-4">
        <Label className="font-semibold block mb-2 text-gray-700">Type</Label>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
          {tags.map(tag => (
            <div key={tag} className="flex items-center gap-2">
              <Checkbox 
                id={`tag-${tag}`} 
                checked={selectedTags.includes(tag)}
                onCheckedChange={() => toggleFilter(tag, selectedTags, setSelectedTags)}
              />
              <Label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer ml-1 text-gray-600 font-medium">{tag}</Label>
            </div>
          ))}
        </div>
      </div>
      <Separator className="my-4" />
      
      {/* Durations */}
      <div>
        <Label className="font-semibold block mb-2 text-gray-700">Duration</Label>
        <div className="space-y-2 custom-scrollbar">
          {durations.map(dur => (
            <div key={dur} className="flex items-center gap-2">
              <Checkbox 
                id={`dur-${dur}`} 
                checked={selectedDurations.includes(dur)}
                onCheckedChange={() => toggleFilter(dur, selectedDurations, setSelectedDurations)}
              />
              <Label htmlFor={`dur-${dur}`} className="text-sm cursor-pointer ml-1 text-gray-600 font-medium">{dur}</Label>
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
          <Link to="/matches" className="nav-link">
            <CheckCircle2 size={18} />
            <span>{applications.length} Applied</span>
          </Link>
          
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-200 transition-colors border-none cursor-pointer">
                {profile?.photo ? (
                  <img src={profile.photo} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <UserCircle2 size={18} />
                )}
                <span className="font-semibold text-sm">{profile?.name || 'Account'}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2 bg-white rounded-xl shadow-xl mt-2 border border-gray-100" align="end">
              <div className="px-3 py-2 border-b border-gray-100 mb-2">
                <p className="font-semibold text-sm text-gray-800 truncate">{profile?.name || 'Student'}</p>
                <p className="text-xs text-gray-500 truncate">{profile?.email || 'Not signed in'}</p>
              </div>
              <Link to="/settings" className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer text-left border-none bg-transparent" style={{ textDecoration: 'none' }}>
                <Settings size={16} /> Settings
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer text-left border-none bg-transparent mt-1"
              >
                <LogOut size={16} /> Logout
              </button>
            </PopoverContent>
          </Popover>
        </nav>
      </header>

      <main className="main-layout">
        <aside className="sidebar-filters">
          <div className="filter-panel">
            {filterContent}
          </div>
        </aside>

        <div className="main-container">
          {hasMore ? (
            <>
              {/* Filters and Progress */}
              <div className="flex justify-between items-center mb-4 text-sm font-semibold relative z-10 w-full">
                <div className="mobile-filter-btn">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-100 cursor-pointer text-gray-700">
                        <Filter size={16} /> Filters
                        {activeFilterCount > 0 && (
                          <span className="bg-purple-600 text-white rounded-full px-2 py-0.5 text-xs">
                            {activeFilterCount}
                          </span>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4 bg-white rounded-xl shadow-xl mt-2 border border-gray-100" align="start">
                      {filterContent}
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 ml-auto">
                  {filteredInternships.length - currentIndex} remaining
                </div>
              </div>

            {/* Progress Bar */}
            <div className="progress-bar-container mb-6">
              <motion.div 
                className="progress-bar-fill"
                initial={{ width: "100%" }}
                animate={{ width: `${((filteredInternships.length - currentIndex) / filteredInternships.length) * 100}%` }}
                transition={{ type: 'spring', stiffness: 50, damping: 15 }}
              />
            </div>

            <div className="swipe-card-container">
              <AnimatePresence mode="popLayout">
                <InternCard 
                  key={currentInternship.id}
                  internship={currentInternship}
                  onSwipe={handleSwipe}
                  exitDirection={exitDirection}
                />
              </AnimatePresence>
            </div>

            <div className="action-buttons">
              <button 
                className="action-btn btn-dislike" 
                onClick={() => handleSwipe('left')}
              >
                <X size={32} />
              </button>
              <button 
                className="action-btn btn-like" 
                onClick={() => handleSwipe('right')}
              >
                <Heart size={32} fill="white" />
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <Briefcase size={64} className="mx-auto mb-4 text-purple-300" />
            <h2>You've seen them all!</h2>
            <p className="mt-2 text-gray-500">You've swiped through all available internships matching your filters.</p>
            <div className="flex gap-4 justify-center mt-6">
              {activeFilterCount > 0 && (
                <button className="login-btn mt-0 flex-1 max-w-[150px]" onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
              <button className="login-btn mt-0 flex-1 max-w-[150px]" onClick={resetDeck} style={{ background: '#f3f4f6', color: '#374151' }}>
                <RotateCcw size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
                Reset Deck
              </button>
            </div>
          </div>
          )}
        </div>
      </main>

      {/* Message Dialog */}
      {showModal && currentInternship && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="modal-title">Why {currentInternship.company}?</h3>
            <p className="modal-description">
              To match with this internship, tell them what makes you the perfect fit. 
              Be specific about your skills and interest in {currentInternship.company}.
            </p>
            <textarea 
              className="message-area"
              placeholder="Hi! I'm really interested in this role because..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="text-right text-sm mb-4" style={{ color: message.length < 20 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
              {message.length} / 20 chars min
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="input" 
                style={{ flex: 1, cursor: 'pointer', textAlign: 'center' }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                className="submit-app-btn"
                style={{ flex: 2, opacity: message.length < 20 ? 0.5 : 1, cursor: message.length < 20 ? 'not-allowed' : 'pointer' }}
                onClick={submitApplication}
                disabled={message.length < 20}
              >
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
  internship: Internship, 
  onSwipe: (dir: 'left' | 'right') => void,
  exitDirection: number | null
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      className="intern-card"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={exitDirection ? { x: exitDirection * 500, opacity: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="card-image" style={{ backgroundImage: `url(${internship.logo})` }}>
        <div className="card-overlay" style={{ padding: '1.5rem' }}>
          <div className="card-company" style={{ fontSize: '0.75rem' }}>{internship.company}</div>
          <h2 className="card-title" style={{ fontSize: '1.5rem' }}>{internship.role}</h2>
        </div>
      </div>
      <div className="card-details flex flex-col justify-between h-[40%] p-4">
        <div>
          <div className="card-tags mb-3">
            <span className="tag text-xs py-1"><MapPin size={12} style={{ marginRight: '4px' }} /> {internship.location}</span>
            <span className="tag text-xs py-1"><Clock size={12} style={{ marginRight: '4px' }} /> {internship.duration}</span>
            {internship.tags.map(tag => (
              <span key={tag} className="tag text-xs py-1">{tag}</span>
            ))}
          </div>
          <p className="card-description line-clamp-2 text-sm" style={{ marginBottom: '1rem' }}>{internship.description}</p>
        </div>
        <div className="requirements mt-auto">
          <h4 style={{ marginBottom: '0.25rem', fontSize: '0.8rem', fontWeight: 600 }}>Requirements:</h4>
          <div className="card-tags mb-0 gap-1.5">
            {internship.requirements.map(req => (
              <span key={req} className="tag text-xs py-0.5" style={{ background: '#e0e7ff', color: '#4338ca' }}>{req}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Users, CheckCircle2, Clock3, XCircle,
  LogOut, RefreshCw, X, ChevronRight, Briefcase, MapPin,
  TrendingUp, UserCheck, Search,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../app/context/auth-context';
import { api } from '../../lib/api';
import './SchoolDashboard.css';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Application {
  id: number;
  status: 'pending' | 'accepted' | 'rejected';
  applied_at: string;
  internship: { id: number; role: string; company: string; location: string } | null;
}

interface Student {
  id: number;
  name: string;
  email: string;
  bio: string;
  photo: string | null;
  created_at: string;
  applications: Application[];
  applicationCount: number;
  isPlaced: boolean;
}

// ─── Status helpers ───────────────────────────────────────────────────────────
const STATUS = {
  pending:  { label: 'Pending',  color: '#F59E0B', icon: <Clock3 size={11} /> },
  accepted: { label: 'Accepted', color: '#22C55E', icon: <CheckCircle2 size={11} /> },
  rejected: { label: 'Rejected', color: '#EF4444', icon: <XCircle size={11} /> },
} as const;

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
}

// ─── Student detail side panel ────────────────────────────────────────────────
function StudentPanel({ student, onClose }: { student: Student; onClose: () => void }) {
  return (
    <motion.div
      className="student-panel-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="student-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="panel-header">
          <button className="panel-close" onClick={onClose}><X size={16} /></button>
          <div className="panel-student-identity">
            {student.photo ? (
              <img src={student.photo} className="panel-avatar-img" alt={student.name} />
            ) : (
              <div className="panel-avatar">{initials(student.name || '?')}</div>
            )}
            <div>
              <h2 className="panel-student-name">{student.name || 'Unnamed'}</h2>
              <p className="panel-student-email">{student.email}</p>
            </div>
            {student.isPlaced && (
              <span className="placed-chip">
                <CheckCircle2 size={11} /> Placed
              </span>
            )}
          </div>

          {student.bio && (
            <p className="panel-bio">"{student.bio}"</p>
          )}

          {/* Quick stats */}
          <div className="panel-quick-stats">
            <div className="panel-stat">
              <span className="panel-stat-num">{student.applicationCount}</span>
              <span className="panel-stat-label">Applications</span>
            </div>
            <div className="panel-stat">
              <span className="panel-stat-num">
                {student.applications.filter(a => a.status === 'accepted').length}
              </span>
              <span className="panel-stat-label">Accepted</span>
            </div>
            <div className="panel-stat">
              <span className="panel-stat-num">
                {student.applications.filter(a => a.status === 'pending').length}
              </span>
              <span className="panel-stat-label">Pending</span>
            </div>
          </div>
        </div>

        {/* Application list */}
        <div className="panel-body">
          <h3 className="panel-section-title">Applications</h3>

          {student.applications.length === 0 ? (
            <div className="panel-empty">
              <Briefcase size={28} />
              <p>No applications yet</p>
            </div>
          ) : (
            <div className="panel-apps">
              {student.applications.map(app => {
                const meta = STATUS[app.status] || STATUS.pending;
                return (
                  <motion.div
                    key={app.id}
                    className="panel-app-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="panel-app-top">
                      <div>
                        <p className="panel-app-role">{app.internship?.role || 'Unknown role'}</p>
                        <p className="panel-app-company">{app.internship?.company}</p>
                        {app.internship?.location && (
                          <p className="panel-app-location">
                            <MapPin size={10} /> {app.internship.location}
                          </p>
                        )}
                      </div>
                      <span
                        className="panel-status-chip"
                        style={{ color: meta.color, borderColor: meta.color + '44', background: meta.color + '11' }}
                      >
                        {meta.icon} {meta.label}
                      </span>
                    </div>
                    <p className="panel-app-date">
                      Applied {new Date(app.applied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
export function SchoolDashboard() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [search, setSearch] = useState('');

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<{ students: Student[] }>('/schools?dashboard=1');
      setStudents(data.students);
    } catch (e: any) {
      setError(e.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleLogout = () => { logout(); navigate('/'); };

  const filtered = students.filter(s =>
    !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total:    students.length,
    active:   students.filter(s => s.applicationCount > 0).length,
    placed:   students.filter(s => s.isPlaced).length,
    inactive: students.filter(s => s.applicationCount === 0).length,
  };

  // School display name — stored in profile.bio (see register.js)
  const schoolDisplayName = profile?.bio || profile?.name || 'Your School';

  return (
    <div className="school-page">
      {/* Header */}
      <header className="school-header">
        <div className="school-header-left">
          <div className="school-logo-wrap">
            <GraduationCap size={18} />
          </div>
          <div>
            <h1 className="school-header-title">{schoolDisplayName}</h1>
            <p className="school-header-sub">School Dashboard · InternMatch</p>
          </div>
        </div>
        <div className="school-header-actions">
          <button className="school-action-btn" onClick={fetchStudents} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
          </button>
          <button className="school-action-btn" onClick={handleLogout}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <main className="school-main">
        {/* Stats row */}
        <div className="school-stats-grid">
          {[
            { icon: <Users size={16} />, label: 'Total Students', value: stats.total, color: '#F2F2F2' },
            { icon: <TrendingUp size={16} />, label: 'Active (applied)', value: stats.active, color: '#A3A3A3' },
            { icon: <UserCheck size={16} />, label: 'Placed', value: stats.placed, color: '#22C55E' },
            { icon: <Clock3 size={16} />, label: 'Not yet active', value: stats.inactive, color: '#AAAAAA' },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="school-stat-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="school-stat-icon" style={{ color: s.color }}>{s.icon}</div>
              <div className="school-stat-num" style={{ color: s.color }}>{s.value}</div>
              <div className="school-stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Search + student list */}
        <div className="school-roster-header">
          <h2 className="school-roster-title">Student Roster</h2>
          <div className="school-search-wrap">
            <Search size={14} className="school-search-icon" />
            <input
              type="text"
              className="school-search-input"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {error && <div className="school-error">{error}</div>}

        {loading ? (
          <div className="school-loading">
            <RefreshCw size={20} className="spin" />
            <p>Loading students…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="school-empty">
            <GraduationCap size={44} />
            <h3>{search ? 'No students match your search' : 'No students linked yet'}</h3>
            <p>
              {search
                ? 'Try a different name or email.'
                : 'Students registering with your school domain will appear here automatically.'}
            </p>
          </div>
        ) : (
          <div className="school-roster">
            {filtered.map((student, i) => (
              <motion.div
                key={student.id}
                className="school-student-row"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedStudent(student)}
                whileHover={{ x: 3 }}
              >
                {/* Avatar */}
                {student.photo ? (
                  <img src={student.photo} className="student-row-avatar-img" alt={student.name} />
                ) : (
                  <div className="student-row-avatar">{initials(student.name || '?')}</div>
                )}

                {/* Info */}
                <div className="student-row-info">
                  <div className="student-row-name">
                    {student.name || 'Unnamed'}
                    {student.isPlaced && (
                      <span className="placed-chip placed-chip--sm">
                        <CheckCircle2 size={9} /> Placed
                      </span>
                    )}
                  </div>
                  <div className="student-row-email">{student.email}</div>
                </div>

                {/* Application count */}
                <div className="student-row-apps">
                  <span className="apps-count">{student.applicationCount}</span>
                  <span className="apps-label">apps</span>
                </div>

                {/* Status pills */}
                <div className="student-row-statuses">
                  {student.applicationCount === 0 ? (
                    <span className="student-status-tag inactive">Inactive</span>
                  ) : student.isPlaced ? (
                    <span className="student-status-tag placed">Placed</span>
                  ) : (
                    <span className="student-status-tag active">Active</span>
                  )}
                </div>

                <ChevronRight size={15} className="student-row-arrow" />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Student detail panel */}
      <AnimatePresence>
        {selectedStudent && (
          <StudentPanel student={selectedStudent} onClose={() => setSelectedStudent(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

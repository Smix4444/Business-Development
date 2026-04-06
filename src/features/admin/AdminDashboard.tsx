import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts';
import {
  Users, Briefcase, FileText, TrendingUp, Shield,
  RefreshCw, Trash2, CheckCircle, XCircle, Clock,
  ChevronRight, Activity, LogOut,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import './AdminDashboard.css';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Overview {
  totalUsers: number;
  totalStudents: number;
  totalCompanies: number;
  totalInternships: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
}

interface DayPoint { date: string; applications: number; signups: number; }
interface TopInternship { role: string; company: string; location: string; applications: number; }
interface RecentUser { id: number; name: string; email: string; role: string; company_name: string; created_at: string; }
interface RecentApp {
  id: number; status: string; applied_at: string; message: string;
  internship: { role: string; company: string } | null;
  student: { name: string; email: string } | null;
}
interface StatusSlice { name: string; value: number; color: string; }

interface AdminStats {
  overview: Overview;
  activityByDay: DayPoint[];
  topInternships: TopInternship[];
  recentUsers: RecentUser[];
  recentApplications: RecentApp[];
  applicationStatus: StatusSlice[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ADMIN_SECRET = 'internmatch-admin-2026';

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
function adminFetch(action: string, opts: RequestInit = {}) {
  return fetch(`/api/admin?action=${action}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET, ...opts.headers },
  });
}

function StatCard({ icon, label, value, sub, color = '#F2F2F2' }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <motion.div
      className="admin-stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.12)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="stat-icon" style={{ color }}>{icon}</div>
      <div className="stat-body">
        <div className="stat-value" style={{ color }}>{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </motion.div>
  );
}

const STATUS_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:  { label: 'Pending',  color: '#F59E0B', icon: <Clock size={11} /> },
  accepted: { label: 'Accepted', color: '#22C55E', icon: <CheckCircle size={11} /> },
  rejected: { label: 'Rejected', color: '#EF4444', icon: <XCircle size={11} /> },
};

// ─── Login Gate ───────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_SECRET) { onLogin(); }
    else { setErr('Invalid admin secret'); }
  };

  return (
    <div className="admin-login-wrap">
      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="admin-login-icon"><Shield size={28} /></div>
        <h1>Admin Access</h1>
        <p>Enter the admin secret to continue.</p>
        <form onSubmit={submit}>
          <input
            type="password"
            placeholder="Admin secret"
            value={pw}
            onChange={e => { setPw(e.target.value); setErr(''); }}
            className="admin-input"
            autoFocus
          />
          {err && <p className="admin-err">{err}</p>}
          <button type="submit" className="admin-submit-btn">
            Enter Dashboard <ChevronRight size={15} />
          </button>
        </form>
        <Link to="/" className="admin-back-link">← Back to InternMatch</Link>
      </motion.div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'applications' | 'internships'>('overview');
  const navigate = useNavigate();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminFetch('stats');
      if (!res.ok) throw new Error('Failed to load stats');
      setStats(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchStats();
  }, [authed, fetchStats]);

  const handleStatusChange = async (appId: number, status: string) => {
    await adminFetch('app-status', {
      method: 'PATCH',
      body: JSON.stringify({ id: appId, status }),
    });
    fetchStats();
  };

  const handleDeleteInternship = async (id: number) => {
    if (!window.confirm('Delete this internship?')) return;
    await adminFetch('internship', { method: 'DELETE', body: JSON.stringify({ id }) });
    fetchStats();
  };

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  const o = stats?.overview;

  return (
    <div className="admin-root">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Briefcase size={16} />
          <span>InternMatch</span>
          <span className="admin-badge">Admin</span>
        </div>

        <nav className="admin-nav">
          {(['overview', 'users', 'applications', 'internships'] as const).map(tab => (
            <button
              key={tab}
              className={`admin-nav-item${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'overview'     && <Activity size={15} />}
              {tab === 'users'        && <Users size={15} />}
              {tab === 'applications' && <FileText size={15} />}
              {tab === 'internships'  && <Briefcase size={15} />}
              <span style={{ textTransform: 'capitalize' }}>{tab}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <button className="admin-nav-item" onClick={fetchStats} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh
          </button>
          <Link to="/" className="admin-nav-item" style={{ textDecoration: 'none' }}>
            <LogOut size={15} /> Exit
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1 className="admin-page-title" style={{ textTransform: 'capitalize' }}>{activeTab}</h1>
            <p className="admin-page-sub">
              {activeTab === 'overview' && 'Real-time platform metrics'}
              {activeTab === 'users' && 'Registered users'}
              {activeTab === 'applications' && 'All candidate applications'}
              {activeTab === 'internships' && 'Active listings'}
            </p>
          </div>
          {loading && (
            <div className="admin-loading-pill">
              <RefreshCw size={12} className="spin" /> Loading…
            </div>
          )}
        </div>

        {error && <div className="admin-error-banner">{error}</div>}

        <AnimatePresence mode="wait">
          {stats && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >

              {/* ── Overview Tab ── */}
              {activeTab === 'overview' && o && (
                <div className="admin-overview">
                  {/* Stat grid */}
                  <div className="admin-stat-grid">
                    <StatCard icon={<Users size={18} />} label="Total Users" value={o.totalUsers} sub={`${o.totalStudents} students · ${o.totalCompanies} companies`} />
                    <StatCard icon={<Briefcase size={18} />} label="Internships" value={o.totalInternships} color="#A3A3A3" />
                    <StatCard icon={<FileText size={18} />} label="Applications" value={o.totalApplications} color="#A3A3A3" />
                    <StatCard icon={<TrendingUp size={18} />} label="Response Rate"
                      value={o.totalApplications ? `${Math.round(((o.acceptedApplications + o.rejectedApplications) / o.totalApplications) * 100)}%` : '—'}
                      color="#22C55E"
                    />
                  </div>

                  <div className="admin-charts-row">
                    {/* Activity line chart */}
                    <div className="admin-chart-card">
                      <h3 className="chart-title">Activity — last 14 days</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={stats.activityByDay} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                          <XAxis dataKey="date" tick={{ fill: '#444', fontSize: 10 }} interval={2} />
                          <YAxis tick={{ fill: '#444', fontSize: 10 }} allowDecimals={false} />
                          <Tooltip contentStyle={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                          <Line type="monotone" dataKey="applications" stroke="#F2F2F2" strokeWidth={2} dot={false} name="Applications" />
                          <Line type="monotone" dataKey="signups" stroke="#555" strokeWidth={1.5} dot={false} name="Signups" strokeDasharray="4 2" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Status pie */}
                    <div className="admin-chart-card admin-chart-card--narrow">
                      <h3 className="chart-title">Application Status</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={stats.applicationStatus}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            dataKey="value"
                            paddingAngle={3}
                          >
                            {stats.applicationStatus.map((entry, i) => (
                              <Cell key={i} fill={entry.color} opacity={0.9} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="pie-legend">
                        {stats.applicationStatus.map(s => (
                          <div key={s.name} className="pie-legend-item">
                            <span className="pie-dot" style={{ background: s.color }} />
                            <span>{s.name}</span>
                            <span className="pie-val">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Top internships bar */}
                  <div className="admin-chart-card">
                    <h3 className="chart-title">Top Listings by Applications</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={stats.topInternships} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="company" tick={{ fill: '#444', fontSize: 10 }} />
                        <YAxis tick={{ fill: '#444', fontSize: 10 }} allowDecimals={false} />
                        <Tooltip contentStyle={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                        <Bar dataKey="applications" fill="rgba(255,255,255,0.12)" radius={[4, 4, 0, 0]} name="Applications" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Mini status cards */}
                  <div className="admin-mini-stats">
                    <div className="admin-mini-card pending">
                      <Clock size={14} /> Pending
                      <span>{o.pendingApplications}</span>
                    </div>
                    <div className="admin-mini-card accepted">
                      <CheckCircle size={14} /> Accepted
                      <span>{o.acceptedApplications}</span>
                    </div>
                    <div className="admin-mini-card rejected">
                      <XCircle size={14} /> Rejected
                      <span>{o.rejectedApplications}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Users Tab ── */}
              {activeTab === 'users' && (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Company</th><th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentUsers.map(u => (
                        <tr key={u.id}>
                          <td className="dim">#{u.id}</td>
                          <td><strong>{u.name || '—'}</strong></td>
                          <td className="dim">{u.email}</td>
                          <td>
                            <span className={`role-badge role-badge--${u.role}`}>{u.role}</span>
                          </td>
                          <td className="dim">{u.company_name || '—'}</td>
                          <td className="dim">{u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB') : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── Applications Tab ── */}
              {activeTab === 'applications' && (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th><th>Student</th><th>Position</th><th>Message</th><th>Status</th><th>Date</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentApplications.map(a => {
                        const meta = STATUS_META[a.status] || STATUS_META.pending;
                        return (
                          <tr key={a.id}>
                            <td className="dim">#{a.id}</td>
                            <td>
                              <strong>{a.student?.name || '—'}</strong>
                              <div className="dim" style={{ fontSize: '0.72rem' }}>{a.student?.email}</div>
                            </td>
                            <td>
                              <strong>{a.internship?.role || '—'}</strong>
                              <div className="dim" style={{ fontSize: '0.72rem' }}>{a.internship?.company}</div>
                            </td>
                            <td className="dim message-cell">"{a.message}"</td>
                            <td>
                              <span className="status-chip" style={{ color: meta.color, borderColor: meta.color + '44' }}>
                                {meta.icon} {meta.label}
                              </span>
                            </td>
                            <td className="dim">{a.applied_at ? new Date(a.applied_at).toLocaleDateString('en-GB') : '—'}</td>
                            <td>
                              <div className="action-btns">
                                {a.status !== 'accepted' && (
                                  <button className="act-btn accept" onClick={() => handleStatusChange(a.id, 'accepted')} title="Accept">
                                    <CheckCircle size={13} />
                                  </button>
                                )}
                                {a.status !== 'rejected' && (
                                  <button className="act-btn reject" onClick={() => handleStatusChange(a.id, 'rejected')} title="Reject">
                                    <XCircle size={13} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── Internships Tab ── */}
              {activeTab === 'internships' && (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Company</th><th>Role</th><th>Location</th><th>Duration</th><th>Applications</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.topInternships.map((intern, idx) => (
                        <tr key={idx}>
                          <td><strong>{intern.company}</strong></td>
                          <td>{intern.role}</td>
                          <td className="dim">{intern.location}</td>
                          <td className="dim">—</td>
                          <td>
                            <span className="app-count-badge">{intern.applications}</span>
                          </td>
                          <td>
                            <button className="act-btn reject" title="Delete listing">
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </motion.div>
          )}

          {!stats && !loading && !error && (
            <div className="admin-empty">
              <Activity size={40} />
              <p>No data yet. The database may be empty.</p>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

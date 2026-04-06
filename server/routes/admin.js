const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const DATA_FILE = path.join(__dirname, '../data.json');
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'internmatch-admin-2026';

// ─── Guard ────────────────────────────────────────────────────────────────────
router.use((req, res, next) => {
  const secret = req.headers['x-admin-secret'];
  if (secret !== ADMIN_SECRET) {
    return res.status(403).json({ error: 'Forbidden — invalid admin secret' });
  }
  next();
});

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { users: [], internships: [], applications: [] };
  }
}

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
router.get('/stats', (req, res) => {
  const data = loadData();
  const users = data.users || [];
  const internships = data.internships || [];
  const applications = data.applications || [];

  // Applications grouped by day (last 14 days)
  const now = new Date();
  const byDay = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const dayStr = d.toISOString().slice(0, 10);
    byDay.push({
      date: label,
      applications: applications.filter(a => a.applied_at?.slice(0, 10) === dayStr).length,
      signups: users.filter(u => u.created_at?.slice(0, 10) === dayStr).length,
    });
  }

  // Top internships by application count
  const topInternships = internships
    .map(i => ({
      role: i.role,
      company: i.company,
      location: i.location,
      applications: applications.filter(a => a.internship_id === i.id).length,
    }))
    .sort((a, b) => b.applications - a.applications)
    .slice(0, 6);

  res.json({
    overview: {
      totalUsers: users.length,
      totalStudents: users.filter(u => u.role === 'student').length,
      totalCompanies: users.filter(u => u.role === 'company').length,
      totalInternships: internships.length,
      totalApplications: applications.length,
      pendingApplications: applications.filter(a => a.status === 'pending').length,
      acceptedApplications: applications.filter(a => a.status === 'accepted').length,
      rejectedApplications: applications.filter(a => a.status === 'rejected').length,
    },
    activityByDay: byDay,
    topInternships,
    recentUsers: users.slice(-8).reverse().map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      company_name: u.company_name,
      created_at: u.created_at,
    })),
    recentApplications: applications.slice(-10).reverse().map(a => ({
      id: a.id,
      status: a.status,
      applied_at: a.applied_at,
      message: a.message?.slice(0, 80) + (a.message?.length > 80 ? '…' : ''),
      internship: internships.find(i => i.id === a.internship_id),
      student: (() => {
        const s = users.find(u => u.id === a.student_id);
        return s ? { name: s.name, email: s.email } : null;
      })(),
    })),
    applicationStatus: [
      { name: 'Pending', value: applications.filter(a => a.status === 'pending').length, color: '#F59E0B' },
      { name: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, color: '#22C55E' },
      { name: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, color: '#EF4444' },
    ],
  });
});

// ─── DELETE /api/admin/internships/:id ────────────────────────────────────────
router.delete('/internships/:id', (req, res) => {
  const data = loadData();
  const id = parseInt(req.params.id);
  const before = data.internships.length;
  data.internships = data.internships.filter(i => i.id !== id);
  if (data.internships.length === before) return res.status(404).json({ error: 'Not found' });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

// ─── PATCH /api/admin/applications/:id/status ─────────────────────────────────
router.patch('/applications/:id/status', (req, res) => {
  const data = loadData();
  const id = parseInt(req.params.id);
  const { status } = req.body;
  if (!['pending', 'accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const idx = data.applications.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data.applications[idx].status = status;
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

module.exports = router;

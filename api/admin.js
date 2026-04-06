/**
 * Vercel Serverless Function — /api/admin
 * Secured by X-Admin-Secret header.
 */
const { createClient } = require('@supabase/supabase-js');

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'internmatch-admin-2026';

function supabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-secret');
}

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Auth guard
  if (req.headers['x-admin-secret'] !== ADMIN_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const sb = supabase();
  const action = req.query.action || 'stats';

  try {
    // ── GET stats ──────────────────────────────────────────────────────────
    if (req.method === 'GET' && action === 'stats') {
      const [{ data: users }, { data: internships }, { data: applications }] = await Promise.all([
        sb.from('users').select('id, name, email, role, company_name, created_at'),
        sb.from('internships').select('id, company, role, location, created_at'),
        sb.from('applications').select('id, student_id, internship_id, status, message, applied_at'),
      ]);

      const u = users || [];
      const i = internships || [];
      const a = applications || [];

      // Activity by day (last 14 days)
      const now = new Date();
      const byDay = [];
      for (let d = 13; d >= 0; d--) {
        const date = new Date(now);
        date.setDate(date.getDate() - d);
        const label   = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        const dayStr  = date.toISOString().slice(0, 10);
        byDay.push({
          date: label,
          applications: a.filter(x => x.applied_at?.slice(0, 10) === dayStr).length,
          signups: u.filter(x => x.created_at?.slice(0, 10) === dayStr).length,
        });
      }

      const topInternships = i
        .map(intern => ({
          role: intern.role,
          company: intern.company,
          location: intern.location,
          applications: a.filter(x => x.internship_id === intern.id).length,
        }))
        .sort((a, b) => b.applications - a.applications)
        .slice(0, 6);

      return res.json({
        overview: {
          totalUsers: u.length,
          totalStudents: u.filter(x => x.role === 'student').length,
          totalCompanies: u.filter(x => x.role === 'company').length,
          totalInternships: i.length,
          totalApplications: a.length,
          pendingApplications: a.filter(x => x.status === 'pending').length,
          acceptedApplications: a.filter(x => x.status === 'accepted').length,
          rejectedApplications: a.filter(x => x.status === 'rejected').length,
        },
        activityByDay: byDay,
        topInternships,
        recentUsers: u.slice(-8).reverse(),
        recentApplications: a.slice(-10).reverse().map(app => ({
          ...app,
          message: app.message?.slice(0, 80) + (app.message?.length > 80 ? '…' : ''),
          internship: i.find(x => x.id === app.internship_id) || null,
          student: u.find(x => x.id === app.student_id) ? { name: u.find(x => x.id === app.student_id).name, email: u.find(x => x.id === app.student_id).email } : null,
        })),
        applicationStatus: [
          { name: 'Pending',  value: a.filter(x => x.status === 'pending').length,  color: '#F59E0B' },
          { name: 'Accepted', value: a.filter(x => x.status === 'accepted').length, color: '#22C55E' },
          { name: 'Rejected', value: a.filter(x => x.status === 'rejected').length, color: '#EF4444' },
        ],
      });
    }

    // ── PATCH application status ───────────────────────────────────────────
    if (req.method === 'PATCH' && action === 'app-status') {
      const { id, status } = req.body;
      if (!['pending', 'accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      await sb.from('applications').update({ status }).eq('id', id);
      return res.json({ ok: true });
    }

    // ── DELETE internship ──────────────────────────────────────────────────
    if (req.method === 'DELETE' && action === 'internship') {
      const { id } = req.body;
      await sb.from('internships').delete().eq('id', id);
      return res.json({ ok: true });
    }

    res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    console.error('admin error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

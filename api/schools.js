/**
 * Vercel Serverless Function — /api/schools
 * GET (public)   — list all schools (for student signup dropdown)
 * GET ?dashboard — school dashboard data (school auth required)
 */
const db = require('./_lib/db');
const { verifyRequest } = require('./_lib/authMiddleware');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Dashboard mode — requires school auth
    if (req.query.dashboard === '1') {
      const payload = verifyRequest(req);
      if (!payload || payload.role !== 'school') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const students = await db.getStudentsBySchool(payload.userId);
      return res.json({ students });
    }

    // Public — list all schools for dropdown
    const schools = await db.getAllSchools();
    return res.json({ schools });
  } catch (err) {
    console.error('schools error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

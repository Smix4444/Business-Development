const db = require('./_lib/db');
const { verifyRequest } = require('./_lib/authMiddleware');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      return res.json(await db.getAllInternships());
    }

    if (req.method === 'POST') {
      const payload = verifyRequest(req);
      if (!payload) return res.status(401).json({ error: 'Unauthorized' });
      if (payload.role !== 'company') return res.status(403).json({ error: 'Only companies can post internships' });

      const { company, role, location, duration, description, requirements, tags, logo } = req.body;
      if (!company || !role || !location || !duration || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const created = await db.createInternship({
        companyId: payload.userId, company, role, location, duration, description,
        requirements: requirements || [], tags: tags || [], logo,
      });
      return res.status(201).json(created);
    }

    if (req.method === 'DELETE') {
      const payload = verifyRequest(req);
      if (!payload) return res.status(401).json({ error: 'Unauthorized' });
      if (payload.role !== 'company') return res.status(403).json({ error: 'Only companies can delete' });

      const id = parseInt(req.query.id);
      if (!id) return res.status(400).json({ error: 'id required' });

      const internship = await db.findInternshipById(id);
      if (!internship) return res.status(404).json({ error: 'Not found' });
      if (internship.company_id !== payload.userId) return res.status(403).json({ error: 'Not your listing' });

      await db.deleteInternship(id);
      return res.json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('internships error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

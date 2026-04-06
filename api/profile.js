const db = require('./_lib/db');
const { verifyRequest } = require('./_lib/authMiddleware');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const payload = verifyRequest(req);
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });

  try {
    if (req.method === 'GET') {
      const user = await db.findUserById(payload.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      return res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        bio: user.bio,
        photo: user.photo,
        cvFile: user.cv_file,
        company: user.company_name,
      });
    }

    if (req.method === 'PUT') {
      const { name, bio, photo, cvFile, company } = req.body;

      const updated = await db.updateUser(payload.userId, {
        name,
        bio,
        photo,
        cv_file: cvFile,
        company_name: company,
      });

      if (!updated) return res.status(404).json({ error: 'User not found' });

      return res.json({
        id: updated.id,
        email: updated.email,
        role: updated.role,
        name: updated.name,
        bio: updated.bio,
        photo: updated.photo,
        cvFile: updated.cv_file,
        company: updated.company_name,
      });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
